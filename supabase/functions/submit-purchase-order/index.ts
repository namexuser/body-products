import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface PurchaseOrderRequest {
  customerInfo: {
    name: string;
    email: string;
    city: string;
    phone: string;
  };
  cartItems: Array<{
    product_id: string; // Use product_id from our schema
    quantity: number;
  }>;
  totals: {
    totalMSRP: number;
    totalUnits: number;
    estimatedTotal: number;
    unitPrice: number;
    discountPercentage: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const { customerInfo, cartItems, totals }: PurchaseOrderRequest = await req.json();

    // Basic validation for customer info
    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.city || !customerInfo.phone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required customer information (name, email, city, or phone)',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid customer email format',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Basic city and phone validation (non-empty)
    if (!customerInfo.city || customerInfo.city.trim() === '' || !customerInfo.phone || customerInfo.phone.trim() === '') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'City and Phone fields are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Basic validation for cart items
    if (!cartItems || cartItems.length === 0) {
       return new Response(
        JSON.stringify({
          success: false,
          error: 'Cart is empty',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Validate each item in the cart
    for (const item of cartItems) {
      if (!item.product_id || typeof item.quantity !== 'number' || item.quantity <= 0) {
         return new Response(
          JSON.stringify({
            success: false,
            error: `Invalid item in cart: product_id ${item.product_id}, quantity ${item.quantity}`,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }
    }


    console.log('Processing purchase order for:', customerInfo.email);

    // Fetch product details for items in the cart
    const productIds = cartItems.map(item => item.product_id);
    const { data: products, error: productsError } = await supabaseClient
      .from('products')
      .select('id, name, price, sku') // Select necessary fields
      .in('id', productIds);

    if (productsError) {
      console.error('Error fetching product details:', productsError);
      // Return a more specific error response
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to fetch product details: ${productsError.message}`,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Create order
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders') // Use the 'orders' table
      .insert({
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_city: customerInfo.city,
        customer_phone: customerInfo.phone,
        total_amount: 0, // Calculate total amount later
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    console.log('Order created:', orderData.id);

    // Create order items
    const orderItemsToInsert = cartItems.map(item => {
      const product = products?.find(p => p.id === item.product_id);
      if (!product) {
        throw new Error(`Product with ID ${item.product_id} not found.`);
      }
      const itemPrice = product.price;

      return {
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: itemPrice,
      };
    });

    const { error: itemsError } = await supabaseClient
      .from('order_items') // Use the 'order_items' table
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    console.log('Order items created successfully');

    // Decrement inventory for purchased items
    for (const item of cartItems) {
      const { error: inventoryError } = await supabaseClient
        .from('inventory')
        .update({ quantity_in_stock: 'quantity_in_stock - ' + item.quantity })
        .eq('product_id', item.product_id);

      if (inventoryError) {
        console.error(`Error updating inventory for product ${item.product_id}:`, inventoryError);
        // If an inventory update fails, we should probably not proceed with the order confirmation.
        // In a real-world scenario, you might want to implement a rollback mechanism here.
        // For now, we will return an error response.
        return new Response(
          JSON.stringify({
            success: false,
            error: `Failed to update inventory for product ${item.product_id}: ${inventoryError.message}`,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }
    }

    console.log('Inventory updated successfully');

    // Update total amount in the order
    const { error: updateTotalError } = await supabaseClient
      .from('orders')
      .update({ total_amount: totals.estimatedTotal }) // Use estimatedTotal from frontend
      .eq('id', orderData.id);

    if (updateTotalError) {
      console.error('Error updating order total:', updateTotalError);
      // Continue without throwing error, as order and items are already created
    }

    console.log('Order total updated');

    // Fetch order items with product details for email
    const { data: orderItemsWithDetails, error: fetchItemsError } = await supabaseClient
      .from('order_items')
      .select(`
        quantity,
        price_at_purchase,
        products (
          name,
          sku,
          image_url
        )
      `)
      .eq('order_id', orderData.id);

    if (fetchItemsError) {
      console.error('Error fetching order items with details:', fetchItemsError);
      // Continue without throwing error, as order and items are already created
    }

    // Send confirmation email
    const itemsHtml = orderItemsWithDetails
      ?.map(
        (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${
            item.products?.name || 'N/A'
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${
            item.products?.sku || 'N/A'
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${
            item.quantity
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">$${item.price_at_purchase.toFixed(
            2
          )}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">$${(
            item.price_at_purchase * item.quantity
          ).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Purchase Order Confirmation</h1>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Order Details</h2>
          <p><strong>Order ID:</strong> ${orderData.id}</p>
          <p><strong>Customer:</strong> ${customerInfo.name}</p>
          <p><strong>Email:</strong> ${customerInfo.email}</p>
          <p><strong>City:</strong> ${customerInfo.city}</p>
          <p><strong>Phone:</strong> ${customerInfo.phone}</p>
          <p><strong>Order Date:</strong> ${new Date(orderData.order_date).toLocaleString()}</p>
        </div>

        <h3 style="color: #333;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f1f3f4;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">SKU</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">MSRP</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Order Summary</h3>
          <p><strong>Total Units:</strong> ${totals.totalUnits}</p>
          <p><strong>Total MSRP:</strong> $${totals.totalMSRP.toFixed(2)}</p>
          <p><strong>Discount:</strong> ${totals.discountPercentage.toFixed(1)}%</p>
          <p><strong>Discounted Unit Price:</strong> $${totals.unitPrice.toFixed(2)}</p>
          <p style="font-size: 18px; color: #2d5016;"><strong>Estimated Total: $${totals.estimatedTotal.toFixed(
            2
          )}</strong></p>
        </div>

        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;"><strong>Note:</strong> This is a purchase order confirmation. Final pricing will be confirmed upon processing. You will receive updates on your order status via email.</p>
        </div>

        <p style="text-align: center; color: #666; margin-top: 30px;">
          Thank you for your business!<br>
          <strong>offprice.pro</strong>
        </p>
      </div>
    `;

    // Send email to customer and client
    const emailResponse = await resend.emails.send({
      from: 'Off-Price <ask@offprice.pro>',
      to: [customerInfo.email, 'ask@offprice.pro'], // Send to both customer and client
      subject: `Purchase Order Confirmation - Order ID: ${orderData.id}`,
      html: emailHtml,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        orderId: orderData.id,
        message: 'Purchase order submitted successfully!',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in submit-purchase-order function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler); // Use serve to handle incoming requests

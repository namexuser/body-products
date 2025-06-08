import { serve } from 'https://esm.sh/v118/deno.land/std@0.190.0/http/server.ts';
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
    phone: string;
    city: string;
  };
  cartItems: Array<{
    id: string;
    name: string;
    size: string;
    msrp: number;
    itemNumber: string;
    quantity: number;
  }>;
  totals: {
    totalMSRP: number;
    totalUnits: number;
    unitPrice: number;
    estimatedTotal: number;
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

    const { customerInfo, cartItems, totals }: PurchaseOrderRequest =
      await req.json();

    console.log('Processing purchase order for:', customerInfo.email);

    // Create purchase order
    const { data: orderData, error: orderError } = await supabaseClient
      .from('purchase_orders')
      .insert({
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_city: customerInfo.city,
        total_msrp: totals.totalMSRP,
        total_units: totals.totalUnits,
        unit_price: totals.unitPrice,
        estimated_total: totals.estimatedTotal,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating purchase order:', orderError);
      throw new Error(`Failed to create purchase order: ${orderError.message}`);
    }

    console.log('Purchase order created:', orderData.id);

    // Create order items
    const orderItems = cartItems.map((item) => ({
      purchase_order_id: orderData.id,
      product_name: item.name,
      product_size: item.size,
      item_number: item.itemNumber,
      msrp: item.msrp,
      quantity: item.quantity,
      subtotal: item.msrp * item.quantity,
    }));

    const { error: itemsError } = await supabaseClient
      .from('purchase_order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    console.log('Order items created successfully');

    // Send confirmation email
    const itemsHtml = cartItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${
            item.name
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${
            item.itemNumber
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${
            item.size
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${
            item.quantity
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">$${item.msrp.toFixed(
            2
          )}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">$${(
            item.msrp * item.quantity
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
          <p><strong>Order Number:</strong> ${orderData.order_number}</p>
          <p><strong>Customer:</strong> ${customerInfo.name}</p>
          <p><strong>Email:</strong> ${customerInfo.email}</p>
          <p><strong>Phone:</strong> ${customerInfo.phone}</p>
          <p><strong>City:</strong> ${customerInfo.city}</p>
        </div>

        <h3 style="color: #333;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f1f3f4;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">SKU</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Size</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Price</th>
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
          <p><strong>Unit Price:</strong> $${totals.unitPrice.toFixed(2)}</p>
          <p style="font-size: 18px; color: #2d5016;"><strong>Estimated Total: $${totals.estimatedTotal.toFixed(
            2
          )}</strong></p>
        </div>

        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;"><strong>Note:</strong> This is a purchase order confirmation. Final pricing will be confirmed upon processing. You will receive updates on your order status via email.</p>
        </div>

        <p style="text-align: center; color: #666; margin-top: 30px;">
          Thank you for your business!<br>
          <strong>Body Product Inventory Team</strong>
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: 'Body Products <onboarding@resend.dev>',
      to: [customerInfo.email],
      subject: `Purchase Order Confirmation - ${orderData.order_number}`,
      html: emailHtml,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        orderNumber: orderData.order_number,
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

serve(handler);

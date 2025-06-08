const { submitPurchaseOrder } = require('./index.ts');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const http = require('http');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  try {
    const supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const resend = new Resend(process.env.RESEND_API_KEY);

    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      const { customerInfo, cartItems, totals } = JSON.parse(body);

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
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({ success: false, error: `Failed to create purchase order: ${orderError.message}` }));
        return;
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
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({ success: false, error: `Failed to create order items: ${itemsError.message}` }));
        return;
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

      res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders });
      res.end(
        JSON.stringify({
          success: true,
          orderNumber: orderData.order_number,
          orderId: orderData.id,
          message: 'Purchase order submitted successfully!',
        })
      );
    });
  } catch (error) {
    console.error('Error in submit-purchase-order function:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ success: false, error: error.message }));
  }
};

const server = http.createServer(handler);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
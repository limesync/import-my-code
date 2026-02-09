import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface EmailRequest {
  orderId: string;
  emailType: "order_confirmation" | "order_shipped" | "order_delivered";
  trackingNumber?: string;
  trackingUrl?: string;
}

const EMAIL_TEMPLATES = {
  order_confirmation: {
    subject: "Ordrebekræftelse - FINOVIDA",
    getHtml: (order: OrderData) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ordrebekræftelse</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #F7F4EF;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background-color: #3A3A3A;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 2px;">✦ FINOVIDA ✦</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #3A3A3A; font-size: 24px;">Tak for din ordre!</h2>
              <p style="margin: 0 0 20px; color: #666; line-height: 1.6;">
                Hej ${order.customerName},<br><br>
                Vi har modtaget din ordre og er i gang med at forberede den. Du vil modtage en email når din ordre er afsendt.
              </p>
              
              <div style="background-color: #F7F4EF; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="margin: 0 0 10px; font-size: 14px; color: #666;">Ordrenummer</p>
                <p style="margin: 0; font-size: 20px; font-weight: 600; color: #3A3A3A;">${order.orderNumber}</p>
              </div>

              <h3 style="margin: 30px 0 15px; color: #3A3A3A; font-size: 16px; border-bottom: 1px solid #E5D8C8; padding-bottom: 10px;">Dine produkter</h3>
              ${order.items.map(item => `
                <div style="display: flex; padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
                  <div style="flex: 1;">
                    <p style="margin: 0; font-weight: 500; color: #3A3A3A;">${item.product_title}</p>
                    <p style="margin: 5px 0 0; font-size: 14px; color: #666;">${item.variant_name} × ${item.quantity}</p>
                  </div>
                  <p style="margin: 0; font-weight: 500; color: #3A3A3A;">${(item.price * item.quantity).toLocaleString('da-DK')} kr</p>
                </div>
              `).join('')}
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #E5D8C8;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Subtotal</span>
                  <span style="color: #3A3A3A;">${order.subtotal.toLocaleString('da-DK')} kr</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Fragt</span>
                  <span style="color: #3A3A3A;">${order.shipping.toLocaleString('da-DK')} kr</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 600;">
                  <span style="color: #3A3A3A;">Total</span>
                  <span style="color: #3A3A3A;">${order.total.toLocaleString('da-DK')} kr</span>
                </div>
              </div>

              <h3 style="margin: 30px 0 15px; color: #3A3A3A; font-size: 16px;">Leveringsadresse</h3>
              <p style="margin: 0; color: #666; line-height: 1.6;">
                ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.zip} ${order.shippingAddress.city}<br>
                ${order.shippingAddress.country}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background-color: #F7F4EF; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                Har du spørgsmål? Kontakt os på <a href="mailto:info@finovida.dk" style="color: #C7A98A;">info@finovida.dk</a>
              </p>
              <p style="margin: 15px 0 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} FINOVIDA. Alle rettigheder forbeholdes.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  },
  order_shipped: {
    subject: "Din ordre er afsendt! - FINOVIDA",
    getHtml: (order: OrderData, trackingNumber?: string, trackingUrl?: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Din ordre er afsendt</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #F7F4EF;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background-color: #3A3A3A;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 2px;">✦ FINOVIDA ✦</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 48px; margin-bottom: 10px;">📦</div>
                <h2 style="margin: 0; color: #3A3A3A; font-size: 24px;">Din ordre er på vej!</h2>
              </div>
              
              <p style="margin: 0 0 20px; color: #666; line-height: 1.6;">
                Hej ${order.customerName},<br><br>
                Gode nyheder! Din ordre ${order.orderNumber} er nu afsendt og på vej til dig.
              </p>
              
              ${trackingNumber ? `
                <div style="background-color: #F7F4EF; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
                  <p style="margin: 0 0 10px; font-size: 14px; color: #666;">Tracking-nummer</p>
                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #3A3A3A; font-family: monospace;">${trackingNumber}</p>
                  ${trackingUrl ? `
                    <a href="${trackingUrl}" style="display: inline-block; margin-top: 15px; padding: 12px 24px; background-color: #C7A98A; color: #ffffff; text-decoration: none; border-radius: 25px; font-weight: 500;">
                      Spor din forsendelse →
                    </a>
                  ` : ''}
                </div>
              ` : ''}

              <h3 style="margin: 30px 0 15px; color: #3A3A3A; font-size: 16px;">Leveringsadresse</h3>
              <p style="margin: 0; color: #666; line-height: 1.6;">
                ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.zip} ${order.shippingAddress.city}<br>
                ${order.shippingAddress.country}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background-color: #F7F4EF; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                Har du spørgsmål? Kontakt os på <a href="mailto:info@finovida.dk" style="color: #C7A98A;">info@finovida.dk</a>
              </p>
              <p style="margin: 15px 0 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} FINOVIDA. Alle rettigheder forbeholdes.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  },
  order_delivered: {
    subject: "Din ordre er leveret! - FINOVIDA",
    getHtml: (order: OrderData) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Din ordre er leveret</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #F7F4EF;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background-color: #3A3A3A;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 2px;">✦ FINOVIDA ✦</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
                <h2 style="margin: 0; color: #3A3A3A; font-size: 24px;">Din ordre er leveret!</h2>
              </div>
              
              <p style="margin: 0 0 20px; color: #666; line-height: 1.6;">
                Hej ${order.customerName},<br><br>
                Din ordre ${order.orderNumber} er nu leveret. Vi håber du bliver glad for dine nye produkter!
              </p>
              
              <div style="background-color: #F7F4EF; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
                <p style="margin: 0 0 15px; color: #3A3A3A; font-weight: 500;">Hvad synes du om dine nye produkter?</p>
                <p style="margin: 0; color: #666; font-size: 14px;">
                  Vi vil elske at høre fra dig! Del gerne din oplevelse med os.
                </p>
              </div>

              <p style="margin: 20px 0 0; color: #666; line-height: 1.6;">
                Tak fordi du handler hos FINOVIDA. Vi sætter stor pris på din støtte!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background-color: #F7F4EF; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                Har du spørgsmål? Kontakt os på <a href="mailto:info@finovida.dk" style="color: #C7A98A;">info@finovida.dk</a>
              </p>
              <p style="margin: 15px 0 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} FINOVIDA. Alle rettigheder forbeholdes.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  },
};

interface OrderItem {
  product_title: string;
  variant_name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
}

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured - email not sent");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Email service not configured. Please add RESEND_API_KEY to send emails." 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { orderId, emailType, trackingNumber, trackingUrl }: EmailRequest = await req.json();

    if (!orderId || !emailType) {
      throw new Error("Missing required fields: orderId and emailType");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch order data
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found");
    }

    // Fetch order items
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    const shippingAddress = typeof order.shipping_address === 'string' 
      ? JSON.parse(order.shipping_address) 
      : order.shipping_address;

    const orderData: OrderData = {
      orderNumber: order.order_number,
      customerName: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || 'Kunde',
      customerEmail: shippingAddress.email,
      items: items || [],
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      total: Number(order.total),
      shippingAddress,
    };

    if (!orderData.customerEmail) {
      throw new Error("No customer email found for this order");
    }

    const template = EMAIL_TEMPLATES[emailType];
    if (!template) {
      throw new Error(`Unknown email type: ${emailType}`);
    }

    const html = emailType === 'order_shipped' 
      ? template.getHtml(orderData, trackingNumber, trackingUrl)
      : template.getHtml(orderData);

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FINOVIDA <noreply@finovida.dk>", // Update with your verified domain
        to: [orderData.customerEmail],
        subject: template.subject,
        html,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailResult);
      throw new Error(emailResult.message || "Failed to send email");
    }

    console.log(`Email sent successfully: ${emailType} for order ${order.order_number}`);

    // Log email event
    await supabase.from("order_events").insert({
      order_id: orderId,
      event_type: "email_sent",
      description: `Email sendt: ${template.subject}`,
      metadata: { email_type: emailType, email_id: emailResult.id },
    });

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-order-email:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

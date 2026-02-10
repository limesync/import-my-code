import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface EmailRequest {
  orderId: string;
  emailType: "order_confirmation" | "order_shipped" | "order_delivered" | "order_refunded";
  trackingNumber?: string;
  trackingUrl?: string;
}

const BRAND = {
  name: 'Thumbie',
  email: 'hej@thumbie.dk',
  color: '#B08968',
  bgColor: '#F9F6F2',
  darkColor: '#3A3A3A',
};

const EMAIL_TEMPLATES = {
  order_confirmation: {
    subject: `Ordrebekræftelse - ${BRAND.name}`,
    getHtml: (order: OrderData) => `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background-color:${BRAND.bgColor};">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;">
          <tr><td style="padding:40px 30px;text-align:center;background-color:${BRAND.darkColor};">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:600;letter-spacing:2px;">◆ ${BRAND.name} ◆</h1>
          </td></tr>
          <tr><td style="padding:40px 30px;">
            <h2 style="margin:0 0 20px;color:${BRAND.darkColor};font-size:24px;">Tak for din ordre!</h2>
            <p style="margin:0 0 20px;color:#666;line-height:1.6;">
              Hej ${order.customerName},<br><br>
              Vi har modtaget din ordre og er i gang med at forberede den. Du vil modtage en email når din ordre er afsendt.
            </p>
            <div style="background-color:${BRAND.bgColor};padding:20px;border-radius:12px;margin:30px 0;">
              <p style="margin:0 0 10px;font-size:14px;color:#666;">Ordrenummer</p>
              <p style="margin:0;font-size:20px;font-weight:600;color:${BRAND.darkColor};">${order.orderNumber}</p>
            </div>
            <h3 style="margin:30px 0 15px;color:${BRAND.darkColor};font-size:16px;border-bottom:1px solid #E5D8C8;padding-bottom:10px;">Dine produkter</h3>
            ${order.items.map(item => `
              <div style="padding:15px 0;border-bottom:1px solid #f0f0f0;">
                <p style="margin:0;font-weight:500;color:${BRAND.darkColor};">${item.product_title}</p>
                <p style="margin:5px 0 0;font-size:14px;color:#666;">${item.variant_name} × ${item.quantity} — ${(item.price * item.quantity).toLocaleString('da-DK')} kr</p>
              </div>
            `).join('')}
            <div style="margin-top:20px;padding-top:20px;border-top:2px solid #E5D8C8;">
              <table width="100%"><tr><td style="color:#666;">Subtotal</td><td style="text-align:right;color:${BRAND.darkColor};">${order.subtotal.toLocaleString('da-DK')} kr</td></tr>
              <tr><td style="color:#666;padding-top:8px;">Fragt</td><td style="text-align:right;color:${BRAND.darkColor};padding-top:8px;">${order.shipping === 0 ? 'Gratis' : order.shipping.toLocaleString('da-DK') + ' kr'}</td></tr>
              <tr><td style="font-size:18px;font-weight:600;color:${BRAND.darkColor};padding-top:12px;border-top:1px solid #eee;">Total</td><td style="text-align:right;font-size:18px;font-weight:600;color:${BRAND.darkColor};padding-top:12px;border-top:1px solid #eee;">${order.total.toLocaleString('da-DK')} kr</td></tr></table>
            </div>
            <h3 style="margin:30px 0 15px;color:${BRAND.darkColor};font-size:16px;">Leveringsadresse</h3>
            <p style="margin:0;color:#666;line-height:1.6;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>${order.shippingAddress.address}<br>${order.shippingAddress.zip} ${order.shippingAddress.city}<br>${order.shippingAddress.country}</p>
          </td></tr>
          <tr><td style="padding:30px;background-color:${BRAND.bgColor};text-align:center;">
            <p style="margin:0;color:#666;font-size:14px;">Har du spørgsmål? Kontakt os på <a href="mailto:${BRAND.email}" style="color:${BRAND.color};">${BRAND.email}</a></p>
            <p style="margin:15px 0 0;color:#999;font-size:12px;">© ${new Date().getFullYear()} ${BRAND.name}. Alle rettigheder forbeholdes.</p>
          </td></tr>
        </table>
      </body></html>
    `,
  },
  order_shipped: {
    subject: `Din ordre er afsendt! - ${BRAND.name}`,
    getHtml: (order: OrderData, trackingNumber?: string, trackingUrl?: string) => `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background-color:${BRAND.bgColor};">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;">
          <tr><td style="padding:40px 30px;text-align:center;background-color:${BRAND.darkColor};">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:600;letter-spacing:2px;">◆ ${BRAND.name} ◆</h1>
          </td></tr>
          <tr><td style="padding:40px 30px;">
            <div style="text-align:center;margin-bottom:30px;">
              <div style="font-size:48px;margin-bottom:10px;">📦</div>
              <h2 style="margin:0;color:${BRAND.darkColor};font-size:24px;">Din ordre er på vej!</h2>
            </div>
            <p style="margin:0 0 20px;color:#666;line-height:1.6;">Hej ${order.customerName},<br><br>Din ordre ${order.orderNumber} er nu afsendt og på vej til dig.</p>
            ${trackingNumber ? `
              <div style="background-color:${BRAND.bgColor};padding:25px;border-radius:12px;margin:30px 0;text-align:center;">
                <p style="margin:0 0 10px;font-size:14px;color:#666;">Tracking-nummer</p>
                <p style="margin:0;font-size:18px;font-weight:600;color:${BRAND.darkColor};font-family:monospace;">${trackingNumber}</p>
                ${trackingUrl ? `<a href="${trackingUrl}" style="display:inline-block;margin-top:15px;padding:12px 24px;background-color:${BRAND.color};color:#ffffff;text-decoration:none;border-radius:25px;font-weight:500;">Spor din forsendelse →</a>` : ''}
              </div>
            ` : ''}
            <h3 style="margin:30px 0 15px;color:${BRAND.darkColor};font-size:16px;">Leveringsadresse</h3>
            <p style="margin:0;color:#666;line-height:1.6;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>${order.shippingAddress.address}<br>${order.shippingAddress.zip} ${order.shippingAddress.city}<br>${order.shippingAddress.country}</p>
          </td></tr>
          <tr><td style="padding:30px;background-color:${BRAND.bgColor};text-align:center;">
            <p style="margin:0;color:#666;font-size:14px;">Har du spørgsmål? Kontakt os på <a href="mailto:${BRAND.email}" style="color:${BRAND.color};">${BRAND.email}</a></p>
            <p style="margin:15px 0 0;color:#999;font-size:12px;">© ${new Date().getFullYear()} ${BRAND.name}. Alle rettigheder forbeholdes.</p>
          </td></tr>
        </table>
      </body></html>
    `,
  },
  order_delivered: {
    subject: `Din ordre er leveret! - ${BRAND.name}`,
    getHtml: (order: OrderData) => `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background-color:${BRAND.bgColor};">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;">
          <tr><td style="padding:40px 30px;text-align:center;background-color:${BRAND.darkColor};">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:600;letter-spacing:2px;">◆ ${BRAND.name} ◆</h1>
          </td></tr>
          <tr><td style="padding:40px 30px;">
            <div style="text-align:center;margin-bottom:30px;">
              <div style="font-size:48px;margin-bottom:10px;">🎉</div>
              <h2 style="margin:0;color:${BRAND.darkColor};font-size:24px;">Din ordre er leveret!</h2>
            </div>
            <p style="margin:0 0 20px;color:#666;line-height:1.6;">Hej ${order.customerName},<br><br>Din ordre ${order.orderNumber} er nu leveret. Vi håber du bliver glad for dine nye produkter!</p>
            <div style="background-color:${BRAND.bgColor};padding:25px;border-radius:12px;margin:30px 0;text-align:center;">
              <p style="margin:0 0 15px;color:${BRAND.darkColor};font-weight:500;">Hvad synes du om dine nye produkter?</p>
              <p style="margin:0;color:#666;font-size:14px;">Vi vil elske at høre fra dig! Del gerne din oplevelse med os.</p>
            </div>
            <p style="margin:20px 0 0;color:#666;line-height:1.6;">Tak fordi du handler hos ${BRAND.name}. Vi sætter stor pris på din støtte!</p>
          </td></tr>
          <tr><td style="padding:30px;background-color:${BRAND.bgColor};text-align:center;">
            <p style="margin:0;color:#666;font-size:14px;">Har du spørgsmål? Kontakt os på <a href="mailto:${BRAND.email}" style="color:${BRAND.color};">${BRAND.email}</a></p>
            <p style="margin:15px 0 0;color:#999;font-size:12px;">© ${new Date().getFullYear()} ${BRAND.name}. Alle rettigheder forbeholdes.</p>
          </td></tr>
        </table>
      </body></html>
    `,
  },
  order_refunded: {
    subject: `Din ordre er refunderet - ${BRAND.name}`,
    getHtml: (order: OrderData) => `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background-color:${BRAND.bgColor};">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;">
          <tr><td style="padding:40px 30px;text-align:center;background-color:${BRAND.darkColor};">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:600;letter-spacing:2px;">◆ ${BRAND.name} ◆</h1>
          </td></tr>
          <tr><td style="padding:40px 30px;">
            <div style="text-align:center;margin-bottom:30px;">
              <div style="font-size:48px;margin-bottom:10px;">💰</div>
              <h2 style="margin:0;color:${BRAND.darkColor};font-size:24px;">Din ordre er refunderet</h2>
            </div>
            <p style="margin:0 0 20px;color:#666;line-height:1.6;">Hej ${order.customerName},<br><br>Vi bekræfter hermed, at din ordre ${order.orderNumber} er blevet refunderet.</p>
            <div style="background-color:${BRAND.bgColor};padding:25px;border-radius:12px;margin:30px 0;text-align:center;">
              <p style="margin:0 0 10px;font-size:14px;color:#666;">Refunderet beløb</p>
              <p style="margin:0;font-size:24px;font-weight:600;color:${BRAND.darkColor};">${order.total.toLocaleString('da-DK')} kr</p>
              <p style="margin:15px 0 0;font-size:14px;color:#666;">Beløbet vil blive tilbageført til din konto inden for 5-10 hverdage.</p>
            </div>
            <h3 style="margin:30px 0 15px;color:${BRAND.darkColor};font-size:16px;border-bottom:1px solid #E5D8C8;padding-bottom:10px;">Refunderede produkter</h3>
            ${order.items.map(item => `
              <div style="padding:15px 0;border-bottom:1px solid #f0f0f0;">
                <p style="margin:0;font-weight:500;color:${BRAND.darkColor};">${item.product_title}</p>
                <p style="margin:5px 0 0;font-size:14px;color:#666;">${item.variant_name} × ${item.quantity} — ${(item.price * item.quantity).toLocaleString('da-DK')} kr</p>
              </div>
            `).join('')}
            <p style="margin:20px 0 0;color:#666;line-height:1.6;">Har du spørgsmål til din refundering, er du velkommen til at kontakte os.</p>
          </td></tr>
          <tr><td style="padding:30px;background-color:${BRAND.bgColor};text-align:center;">
            <p style="margin:0;color:#666;font-size:14px;">Har du spørgsmål? Kontakt os på <a href="mailto:${BRAND.email}" style="color:${BRAND.color};">${BRAND.email}</a></p>
            <p style="margin:15px 0 0;color:#999;font-size:12px;">© ${new Date().getFullYear()} ${BRAND.name}. Alle rettigheder forbeholdes.</p>
          </td></tr>
        </table>
      </body></html>
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
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured - email not sent");
      return new Response(
        JSON.stringify({ success: false, message: "Email service not configured. Please add RESEND_API_KEY to send emails." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { orderId, emailType, trackingNumber, trackingUrl }: EmailRequest = await req.json();

    if (!orderId || !emailType) {
      throw new Error("Missing required fields: orderId and emailType");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: order, error: orderError } = await supabase
      .from("orders").select("*").eq("id", orderId).single();

    if (orderError || !order) throw new Error("Order not found");

    const { data: items } = await supabase
      .from("order_items").select("*").eq("order_id", orderId);

    const shippingAddress = typeof order.shipping_address === 'string' 
      ? JSON.parse(order.shipping_address) : order.shipping_address;

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

    if (!orderData.customerEmail) throw new Error("No customer email found for this order");

    const template = EMAIL_TEMPLATES[emailType as keyof typeof EMAIL_TEMPLATES];
    if (!template) throw new Error(`Unknown email type: ${emailType}`);

    const html = emailType === 'order_shipped' 
      ? (template as typeof EMAIL_TEMPLATES.order_shipped).getHtml(orderData, trackingNumber, trackingUrl)
      : (template as typeof EMAIL_TEMPLATES.order_confirmation).getHtml(orderData);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${BRAND.name} <noreply@thumbie.dk>`,
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
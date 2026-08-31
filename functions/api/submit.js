/**
 * Cloudflare Pages Serverless Function: /api/submit
 * Receives form submissions from The High Pass and dispatches them.
 */

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();

    // If GOOGLE_SHEETS_WEBHOOK is set in Cloudflare environment variables, forward it
    const webhookUrl = context.env.GOOGLE_SHEETS_WEBHOOK;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Logged to queue" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}

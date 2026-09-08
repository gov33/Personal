/**
 * Cloudflare Pages Serverless Function: /api/submit
 * Handles form submissions for The High Pass with Resend API.
 * Dispatches two distinct, beautifully tabulated emails:
 * 1. To Admin (govindcs33@gmail.com) with From: "High Pass Website"
 * 2. To Client (clientEmail) with From: "The High Pass new Client Submission",
 *    Subject: "You have filled up a form at The High Pass",
 *    and notice: "Somebody will reach out to you within 24 to 48 hours."
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateTabulatedEmail(data, isClientCopy) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>The High Pass Project Summary</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 24px; color: #18181b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #09090b; padding: 24px; text-align: center; }
    .header h1 { color: #fafafa; margin: 0; font-size: 18px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; }
    .header p { color: #a1a1aa; margin: 4px 0 0; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; }
    .body { padding: 28px; }
    .intro { font-size: 15px; color: #27272a; margin-top: 0; margin-bottom: 20px; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    th, td { padding: 11px 14px; text-align: left; vertical-align: top; border-bottom: 1px solid #f4f4f5; }
    th { width: 34%; font-weight: 600; color: #52525b; background-color: #fafafa; border-right: 1px solid #f4f4f5; }
    td { color: #09090b; }
    .notice-box { background: #f8fafc; border-left: 3px solid #09090b; padding: 14px 16px; margin: 20px 0 8px; font-size: 14px; color: #18181b; font-weight: 500; border-radius: 0 4px 4px 0; }
    .footer { background: #fafafa; border-top: 1px solid #f4f4f5; padding: 16px; text-align: center; font-size: 11px; color: #a1a1aa; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>THE HIGH PASS</h1>
      <p>Client Information &amp; Project Intake</p>
    </div>
    <div class="body">
      <p class="intro">
        ${isClientCopy
          ? 'You have filled up a form at <strong>The High Pass</strong>. Here is a summary of the details you submitted:'
          : `A new project intake form was submitted by <strong>${escapeHtml(data.clientName || 'Client')}</strong> for <strong>${escapeHtml(data.companyName || 'Brand')}</strong>:`
        }
      </p>
      <table>
        <tbody>
          <tr><th>Contact Name</th><td>${escapeHtml(data.clientName || 'Not specified')} (${escapeHtml(data.clientRole || 'Not specified')})</td></tr>
          <tr><th>Company / Brand</th><td>${escapeHtml(data.companyName || 'Not specified')}</td></tr>
          <tr><th>Email Address</th><td><a href="mailto:${escapeHtml(data.clientEmail)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(data.clientEmail || 'Not specified')}</a></td></tr>
          <tr><th>Current Website</th><td>${escapeHtml(data.clientWebsite || 'None specified')}</td></tr>
          ${data.businessSummary ? `<tr><th>What We Do</th><td>${escapeHtml(data.businessSummary)}</td></tr>` : ''}
          <tr><th>Project Type</th><td><strong>${escapeHtml(data.projectScope || 'Not specified')}</strong></td></tr>
          <tr><th>Main Priorities</th><td>${escapeHtml(data.objectives || 'None selected')}</td></tr>
          ${data.projectNotes ? `<tr><th>Project Notes</th><td>${escapeHtml(data.projectNotes)}</td></tr>` : ''}
          <tr><th>Look &amp; Feel</th><td>${escapeHtml(data.aestheticWorld || 'Not specified')}</td></tr>
          <tr><th>Design Assets</th><td>${escapeHtml(data.brandHeritage || 'Not specified')}</td></tr>
          ${data.stylePreferences ? `<tr><th>Style Preferences</th><td>${escapeHtml(data.stylePreferences)}</td></tr>` : ''}
          ${data.inspirationLinks ? `<tr><th>Sites Admired</th><td>${escapeHtml(data.inspirationLinks)}</td></tr>` : ''}
          <tr><th>Features Needed</th><td>${escapeHtml(data.capabilities || 'Standard Web Features')}</td></tr>
          <tr><th>Target Launch</th><td>${escapeHtml(data.targetTimeline || 'Not specified')}</td></tr>
          ${data.integrationNotes ? `<tr><th>Tool Integrations</th><td>${escapeHtml(data.integrationNotes)}</td></tr>` : ''}
          <tr><th>Investment Range</th><td><strong style="color: #09090b;">${escapeHtml(data.budgetTier || 'Not specified')}</strong></td></tr>
          <tr><th>Decision Making</th><td>${escapeHtml(data.decisionMakers || 'Not specified')}</td></tr>
          ${data.additionalNotes ? `<tr><th>Additional Notes</th><td>${escapeHtml(data.additionalNotes)}</td></tr>` : ''}
        </tbody>
      </table>
      <div class="notice-box">
        Somebody will reach out to you within 24 to 48 hours.
      </div>
    </div>
    <div class="footer">
      THE HIGH PASS &bull; CLIENT PROJECT INTAKE
    </div>
  </div>
</body>
</html>`;
}

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const resendApiKey = context.env?.RESEND_API_KEY || data.resendApiKey;
    const fromDomain = context.env?.RESEND_FROM_DOMAIN || data.resendFromDomain || 'aihaving.fun';
    const destinationEmail = context.env?.DESTINATION_EMAIL || 'govindcs33@gmail.com';

    if (!resendApiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "RESEND_API_KEY is not configured in Cloudflare environment variables."
      }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }

    const adminHtml = generateTabulatedEmail(data, false);
    const clientHtml = generateTabulatedEmail(data, true);

    // 1. Send Email to Admin (Govind) with From: "High Pass Website"
    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: `High Pass Website <contact@${fromDomain}>`,
        to: [destinationEmail],
        reply_to: data.clientEmail,
        subject: `[The High Pass] Project Summary: ${data.companyName || 'New Client'} (${data.projectScope})`,
        html: adminHtml
      })
    });

    // 2. Send Email to Client with From: "The High Pass new Client Submission" and Subject: "You have filled up a form at The High Pass"
    let clientResOk = true;
    if (data.clientEmail) {
      const clientRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: `The High Pass new Client Submission <contact@${fromDomain}>`,
          to: [data.clientEmail],
          reply_to: destinationEmail,
          subject: "You have filled up a form at The High Pass",
          html: clientHtml
        })
      });

      if (clientRes.ok) {
        clientResOk = true;
      } else {
        const clientJson = await clientRes.json().catch(() => ({}));
        // If Resend test mode restriction (403: can only send to verified domain or owner), deliver client preview to destinationEmail
        if (clientJson.statusCode === 403 || clientJson.name === 'validation_error') {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              from: `The High Pass new Client Submission <onboarding@${fromDomain}>`,
              to: [destinationEmail],
              reply_to: data.clientEmail,
              subject: `[Client Copy Preview] You have filled up a form at The High Pass (For: ${data.clientEmail})`,
              html: clientHtml
            })
          });
          clientResOk = true;
        }
      }
    }

    if (adminRes.ok && clientResOk) {
      return new Response(JSON.stringify({ success: true, message: "Emails dispatched via Resend" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        status: 200
      });
    } else {
      const errDetail = await adminRes.text();
      return new Response(JSON.stringify({ success: false, error: errDetail }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        status: adminRes.status || 500
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}

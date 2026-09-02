const http = require('http');
const fs = require('fs');
const path = require('path');

// Load .env if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of envLines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [k, ...v] = trimmed.split('=');
        if (k && v.length) process.env[k.trim()] = v.join('=').trim();
      }
    }
  } catch (e) {}
}

const PORT = process.env.PORT || 3001;
const PUBLIC_DIR = __dirname;
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const DESTINATION_EMAIL = 'govindcs33@gmail.com';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

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
  const domainDisplay = data.isStartingFresh
    ? 'Starting Fresh (No existing website)'
    : (data.clientWebsite || 'None specified');

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
          <tr><th>Current Website</th><td>${escapeHtml(domainDisplay)}</td></tr>
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

async function handleApiSubmit(req, res) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const data = JSON.parse(body);
      const apiKey = data.resendApiKey || RESEND_API_KEY;

      if (!apiKey) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'No Resend API Key provided' }));
        return;
      }

      const fromDomain = data.resendFromDomain || process.env.RESEND_FROM_DOMAIN || 'aihaving.fun';
      const adminHtml = generateTabulatedEmail(data, false);
      const clientHtml = generateTabulatedEmail(data, true);

      // 1. Email to Govind (From: "High Pass Website")
      const adminRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `High Pass Website <contact@${fromDomain}>`,
          to: [DESTINATION_EMAIL],
          reply_to: data.clientEmail,
          subject: `[The High Pass] Project Summary: ${data.companyName || 'New Client'} (${data.projectScope})`,
          html: adminHtml
        })
      });

      const adminJson = await adminRes.json();

      // 2. Email to Client (From: "The High Pass new Client Submission", Subject: "You have filled up a form at The High Pass")
      let clientSent = false;
      let clientError = null;

      if (data.clientEmail) {
        const clientRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: `The High Pass new Client Submission <contact@${fromDomain}>`,
            to: [data.clientEmail],
            reply_to: DESTINATION_EMAIL,
            subject: 'You have filled up a form at The High Pass',
            html: clientHtml
          })
        });

        const clientJson = await clientRes.json();

        if (clientRes.ok) {
          clientSent = true;
        } else {
          clientError = clientJson;
          // If Resend 403 (unverified domain in test mode), deliver client copy preview to Govind
          if (clientJson.statusCode === 403 || clientJson.name === 'validation_error') {
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: 'The High Pass new Client Submission <onboarding@resend.dev>',
                to: [DESTINATION_EMAIL],
                reply_to: data.clientEmail,
                subject: `[Client Copy Preview] You have filled up a form at The High Pass (For: ${data.clientEmail})`,
                html: clientHtml
              })
            });
            clientSent = true;
          }
        }
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        success: true,
        message: 'Emails dispatched via Resend',
        adminId: adminJson.id,
        clientSent,
        clientNote: clientError ? clientError.message : undefined
      }));
    } catch (err) {
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  });
}

const server = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // API Route
  if (req.url === '/api/submit' && req.method === 'POST') {
    handleApiSubmit(req, res);
    return;
  }

  // Static File Serving
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';

  let filePath = path.join(PUBLIC_DIR, reqPath);

  // Security check: stay inside PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Check if it's a directory without trailing slash
      if (stats && stats.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`The High Pass local server running on http://localhost:${PORT}`);
});

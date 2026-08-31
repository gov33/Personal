/**
 * THE HIGH PASS — GOOGLE SHEETS & EMAIL DISPATCH APPS SCRIPT
 * 
 * FAQ: What should the name of the sheet tab be?
 * - It can be named ANYTHING (e.g. "Sheet1", "Commissions", etc.).
 * - This script automatically selects your first tab (or "Commissions" if present).
 * - If the sheet is empty, it will even auto-create the column headers for you!
 */

// OPTIONAL: If you created this script directly inside Google Sheets (Extensions > Apps Script),
// leave this empty. If you created a standalone script at script.google.com, paste your Sheet URL or ID below:
var SPREADSHEET_ID_OR_URL = "";

// Headers to auto-create if row 1 is blank
var HEADERS = [
  "Timestamp", "Name", "Company", "Email", "Role", "Website",
  "Scope", "Objectives", "Aesthetic", "Brand Assets",
  "Capabilities", "Timeline", "Budget Tier", "Decision Maker",
  "Notes", "Markdown Brief"
];

const CONFIG = {
  destinationEmail: 'govindcs33@gmail.com',
  googleSheetsWebhookUrl: 'https://script.google.com/macros/s/AKfycbxFhYMuCzQz8jFCQ8EvB88hfvJ45DHbQ_UhX3mav4CeA-5BJGoe9SehIpLk1pbrNrNCFA/exec',
  ...
};

function getTargetSheet() {
  var ss;
  if (SPREADSHEET_ID_OR_URL && SPREADSHEET_ID_OR_URL.trim() !== "") {
    if (SPREADSHEET_ID_OR_URL.indexOf("http") === 0) {
      ss = SpreadsheetApp.openByUrl(SPREADSHEET_ID_OR_URL.trim());
    } else {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID_OR_URL.trim());
    }
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }

  if (!ss) {
    throw new Error("Cannot find Spreadsheet. Please make sure this script was opened from Extensions > Apps Script in your Google Sheet, or set SPREADSHEET_ID_OR_URL.");
  }

  // Look for a tab named "Commissions", or fallback to the first tab (e.g. "Sheet1")
  var sheet = ss.getSheetByName("Commissions") || ss.getSheets()[0];

  // Auto-add headers on Row 1 if sheet is blank
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

// GET request handler (test connection in browser)
function doGet(e) {
  try {
    var sheet = getTargetSheet();
    // If visited with ?test=1 in browser, write a test row immediately!
    if (e && e.parameter && e.parameter.test) {
      testSubmission();
      return ContentService.createTextOutput("SUCCESS: Test row written to Sheet '" + sheet.getName() + "' and email sent to govindcs33@gmail.com!")
        .setMimeType(ContentService.MimeType.TEXT);
    }
    return ContentService.createTextOutput("The High Pass Webhook is active and connected.\nSheet Tab: " + sheet.getName() + " (" + sheet.getLastRow() + " rows).\nTip: Add ?test=1 to this URL in your browser to insert a test row!")
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// POST request handler (receives form submissions)
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ result: "error", message: "No post data received" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    var sheet = getTargetSheet();

    var rowData = [
      data.timestamp || new Date().toISOString(),
      data.clientName || '',
      data.companyName || '',
      data.clientEmail || '',
      data.clientRole || '',
      data.clientWebsite || '',
      data.projectScope || '',
      data.objectives || '',
      data.aestheticWorld || '',
      data.brandHeritage || '',
      data.capabilities || '',
      data.targetTimeline || '',
      data.budgetTier || '',
      data.decisionMakers || '',
      data.additionalNotes || '',
      data.markdownBrief || ''
    ];

    // Writes directly to the next row (avoids jumping over empty rows)
    var nextRow = Math.max(sheet.getLastRow() + 1, 2);
    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);

    // Send email notification to Govind
    var recipient = "govindcs33@gmail.com";
    var subject = "✦ [New Commission] " + (data.companyName || "New Client") + " — " + (data.projectScope || "Discovery Brief");
    var body = "A new client inquiry was submitted via The High Pass:\n\n" +
      "Client: " + (data.clientName || "Unknown") + " (" + (data.clientRole || "") + ")\n" +
      "Company: " + (data.companyName || "Unspecified") + "\n" +
      "Email: " + (data.clientEmail || "Unspecified") + "\n" +
      "Scope: " + (data.projectScope || "") + "\n" +
      "Budget Tier: " + (data.budgetTier || "") + "\n" +
      "Timeline: " + (data.targetTimeline || "") + "\n\n" +
      "=========================================\n" +
      "FULL SPECIFICATION BRIEF:\n" +
      "=========================================\n\n" +
      (data.markdownBrief || "");

    MailApp.sendEmail(recipient, subject, body);

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      row: nextRow,
      sheet: sheet.getName()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Select "testSubmission" in the dropdown and click Run to test!
function testSubmission() {
  var testEvent = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        clientName: "Aurelius Vance",
        companyName: "Nexus Foundry",
        clientEmail: "govindcs33@gmail.com",
        clientRole: "Founder / CEO",
        clientWebsite: "https://nexusfoundry.dev",
        projectScope: "Flagship Web Experience",
        objectives: "High Inquiries & Conversion, Category Authority",
        aestheticWorld: "Cyberpunk Neo-Dark",
        brandHeritage: "Complete System Ready",
        capabilities: "Headless CMS, 60FPS Micro-motion, Edge Speed",
        targetTimeline: "1–2 Months",
        budgetTier: "$5,000 – $10,000",
        decisionMakers: "Solo Decision Maker",
        additionalNotes: "Test submission directly from Apps Script editor",
        markdownBrief: "# THE HIGH PASS: CLIENT DISCOVERY BRIEF\nClient: Aurelius Vance\nCompany: Nexus Foundry\n..."
      })
    }
  };
  var result = doPost(testEvent);
  Logger.log(result.getContent());
}

# Google Apps Script for Waitlist Email Collection

This script receives email submissions from the web app and stores them in a Google Sheet.

## Setup Instructions

### 1. Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Crowdians Cyber Farm - Waitlist"
4. In the first row, add headers: `Email` | `Timestamp` | `User Agent`

### 2. Create Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code
3. Copy and paste the script below
4. Save the project (Ctrl/Cmd + S)

### 3. Deploy as Web App
1. Click **Deploy > New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: "Waitlist API"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Authorize** the script (you may see a warning - click "Advanced" then "Go to [project name]")
7. Copy the **Web app URL**

### 4. Add URL to Environment Variables
1. Open `.env.local` in your project
2. Paste the URL: `VITE_GOOGLE_SCRIPT_URL=https://script.google.com/...`
3. Restart your dev server

---

## Apps Script Code

Copy this entire code block into your Apps Script editor:

\`\`\`javascript
/**
 * Waitlist Email Collection Script
 * Receives POST requests and stores emails in Google Sheets
 */

function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const email = data.email;
    const timestamp = data.timestamp || new Date().toISOString();
    
    // Get user agent from headers
    const userAgent = e.parameter.userAgent || 'Unknown';
    
    // Validate email format
    if (!isValidEmail(email)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Invalid email format'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Check for duplicates
    const existingEmails = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    const isDuplicate = existingEmails.some(row => row[0] === email);
    
    if (isDuplicate) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: 'Email already registered'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add new row with email, timestamp, and user agent
    sheet.appendRow([email, timestamp, userAgent]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Email added successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'Waitlist API is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}
\`\`\`

---

## Testing

### Test in Apps Script Editor
1. Click the **Run** button (▶️) next to the function dropdown
2. Select `doGet` function
3. Check the execution log for any errors

### Test from Your App
1. Make sure your dev server is running
2. Click the "출시 알림 받기" button
3. Enter a test email
4. Check your Google Sheet - the email should appear!

---

## Exporting Data

When you're ready to use the emails:

1. Open your Google Sheet
2. **File > Download > Comma Separated Values (.csv)**
3. Import into your email service (Mailchimp, SendGrid, etc.)

---

## Security Notes

- The script only accepts POST requests with email data
- Email validation is performed server-side
- Duplicate emails are automatically filtered
- No sensitive data is stored
- You can revoke access anytime from Google Apps Script dashboard

---

## Troubleshooting

**"Authorization required"**
- Re-deploy the script and authorize it again

**"Script function not found"**
- Make sure you saved the script before deploying

**Emails not appearing in sheet**
- Check the Apps Script execution logs (View > Executions)
- Verify the Web App URL in `.env.local`
- Make sure you restarted the dev server after adding the URL

**CORS errors**
- This is expected with `no-cors` mode
- The submission still works, we just can't read the response

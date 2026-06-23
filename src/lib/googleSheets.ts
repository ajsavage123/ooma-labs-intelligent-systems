/**
 * Submits form data to a Google Sheet via a Google Apps Script Web App URL.
 * 
 * @param formType - The sheet name to append to (e.g. 'Contacts', 'Quick Quotes', 'Chatbot Quotes')
 * @param data - The form key-value pairs to submit
 * @returns Promise<boolean> - True if the submission request is sent successfully or skipped (if not configured), false on failure
 */
export async function submitToGoogleSheets(formType: string, data: Record<string, any>): Promise<boolean> {
  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    console.warn(`[Google Sheets] Warning: VITE_GOOGLE_SCRIPT_URL is not configured. Submission for "${formType}" skipped.`, data);
    return true; // Bypass silently in dev/prod so forms don't break if env var is missing
  }

  try {
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors", // Crucial: Google Apps Script Web Apps use 302 redirects, which trigger browser CORS errors unless in no-cors mode
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formType,
        ...data,
      }),
    });
    return true;
  } catch (error) {
    console.error(`[Google Sheets] Failed to submit to ${formType}:`, error);
    return false;
  }
}

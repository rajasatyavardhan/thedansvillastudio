export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      return res.status(500).json({
        success: false,
        error: "GOOGLE_SCRIPT_URL is not configured"
      });
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { success: response.ok, raw: text };
    }

    if (!response.ok || result.success === false) {
      return res.status(500).json({
        success: false,
        error: result.error || "Google Apps Script failed"
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Server error"
    });
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [parseInt(process.env.BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    });

    const data = await brevoRes.json();
    console.log("Brevo response:", brevoRes.status, data);

    if (!brevoRes.ok) {
      return res.status(brevoRes.status).json({ message: data.message || "Failed to add contact" });
    }

    return res.status(200).json({ message: "Contact added successfully" });
  } catch (err) {
    console.error("Error contacting Brevo:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Only POST requests allowed" });
    }
  
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
  
    try {
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          listIds: [3], // Replace with your actual list ID
          updateEnabled: true,
        }),
      });
  
      if (!response.ok) {
        throw new Error(await response.text());
      }
  
      return res.status(200).json({ message: "Success" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  
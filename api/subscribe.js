export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          email,
          listIds: [parseInt(process.env.BREVO_LIST_ID)], // Your Brevo list ID
          updateEnabled: true, // Update if already exists
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return res.status(response.status).json({ message: data.message || 'Failed to add contact' });
      }
  
      res.status(200).json({ message: 'Contact added successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
  
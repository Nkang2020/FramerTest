export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  console.log("API KEY", process.env.BREVO_API_KEY); // Remove after testing
  console.log("LIST ID", process.env.BREVO_LIST_ID); 
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Parse the body manually
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const { email } = JSON.parse(body);

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          email,
          listIds: [parseInt(process.env.BREVO_LIST_ID)],
          updateEnabled: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ message: data.message || 'Failed to add contact' });
      }

      return res.status(200).json({ message: 'Contact added successfully' });
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message, botcheck } = req.body;

  // Simple validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Honeypot check
  if (botcheck) {
    // If honeypot is filled out, silently succeed to trick the bot
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  }

  try {
    const web3FormsResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        name,
        email,
        subject,
        message,
        from_name: 'Portfolio Contact Form'
      })
    });

    const result = await web3FormsResponse.json();

    if (result.success) {
      return res.status(200).json({ success: true, message: 'Message sent successfully.' });
    } else {
      return res.status(500).json({ success: false, error: result.message || 'Failed to send message.' });
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, message, email } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Send to a Discord webhook or store somewhere
    // For now, log and store in Vercel's logs
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        type,
        message,
        email: email || 'not provided'
    }));

    // If you want notifications, add a webhook URL here later
    // For now, feedback shows up in Vercel Function Logs

    return res.status(200).json({ success: true });
}

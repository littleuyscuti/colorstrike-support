export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, message, email, image } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Log feedback (visible in Vercel Function Logs)
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        type,
        message,
        email: email || 'not provided',
        hasImage: !!image,
        imageSize: image ? Math.round(image.length / 1024) + 'KB' : null
    }));

    return res.status(200).json({ success: true });
}

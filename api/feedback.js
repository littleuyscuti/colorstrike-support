export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, message, email, image } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const timestamp = new Date().toISOString();

    // Log feedback
    console.log(JSON.stringify({
        timestamp, type, message,
        email: email || 'not provided',
        hasImage: !!image
    }));

    // Send to Telegram - must await or Vercel kills the process
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    const telegramMessage = `🎮 ColorStrike Feedback\n\nType: ${type || 'Other'}\nMessage: ${message}\nEmail: ${email || 'Not provided'}\nScreenshot: ${image ? '✅ Attached' : '❌ None'}\nTime: ${timestamp}`;

    try {
        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: telegramMessage
            })
        });
    } catch (err) {
        console.error('Telegram send failed:', err.message);
    }

    return res.status(200).json({ success: true });
}

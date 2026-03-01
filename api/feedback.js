export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, message, email, image, images } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const now = new Date();
    const hkTime = now.toLocaleString('en-GB', {
        timeZone: 'Asia/Hong_Kong',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });

    const allImages = [];
    if (images && Array.isArray(images)) allImages.push(...images);
    else if (image) allImages.push(image);
    const validImages = allImages.filter(img => typeof img === 'string' && img.length < 7000000);

    console.log(JSON.stringify({ time: hkTime, type, message, email: email || 'not provided', imageCount: validImages.length }));

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    const typeMap = { bug: 'Bug Report', bug_report: 'Bug Report', feedback: 'Suggestion', suggestion: 'Suggestion', question: 'Question', other: 'Other' };
    const displayType = typeMap[type] || type || 'Other';
    const feedbackText = `🎮 ColorStrike Feedback\n\nType: ${displayType}\nMessage: ${message}\nEmail: ${email || 'Not provided'}\nTime: ${hkTime} (HKT)`;

    try {
        // Always send text first
        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: telegramChatId, text: feedbackText })
        });

        // Then send images separately
        if (validImages.length === 1) {
            const buf = Buffer.from(validImages[0], 'base64');
            const formData = new FormData();
            formData.append('chat_id', telegramChatId);
            formData.append('document', new Blob([buf], { type: 'image/png' }), 'screenshot.png');
            await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendDocument`, {
                method: 'POST',
                body: formData
            });
        } else if (validImages.length > 1) {
            const formData = new FormData();
            formData.append('chat_id', telegramChatId);
            const media = [];
            for (let i = 0; i < validImages.length; i++) {
                const buf = Buffer.from(validImages[i], 'base64');
                const fieldName = `file${i}`;
                formData.append(fieldName, new Blob([buf], { type: 'image/png' }), `screenshot${i + 1}.png`);
                media.push({ type: 'document', media: `attach://${fieldName}` });
            }
            formData.append('media', JSON.stringify(media));
            await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMediaGroup`, {
                method: 'POST',
                body: formData
            });
        }
    } catch (err) {
        console.error('Telegram send failed:', err.message);
    }

    return res.status(200).json({ success: true });
}

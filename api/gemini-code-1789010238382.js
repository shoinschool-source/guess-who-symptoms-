export default async function handler(req, res) {
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!kvUrl || !kvToken) return res.status(500).json({ error: 'Database not connected' });

    const roomPin = req.method === 'POST' ? req.body.roomPin : req.query.roomPin;
    if (!roomPin) return res.status(400).json({ error: 'Missing roomPin' });

    const key = `room:${roomPin}:step`;

    if (req.method === 'POST') {
        const { gameStep } = req.body;
        await fetch(kvUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${kvToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(["SET", key, gameStep])
        });
        return res.status(200).json({ success: true });
    } else {
        const response = await fetch(kvUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${kvToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(["GET", key])
        });
        const data = await response.json();
        res.status(200).json({ gameStep: parseInt(data.result || 0, 10) });
    }
}
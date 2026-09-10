export default async function handler(req, res) {
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!kvUrl || !kvToken) return res.status(500).json({ error: 'Database not connected' });

    if (req.method === 'POST') {
        const { roomPin, gameStep } = req.body;
        await fetch(kvUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${kvToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(["HSET", `room:${roomPin}`, "__GAME_STEP__", gameStep])
        });
        return res.status(200).json({ success: true });
    } else {
        const { roomPin } = req.query;
        const response = await fetch(kvUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${kvToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(["HGET", `room:${roomPin}`, "__GAME_STEP__"])
        });
        const data = await response.json();
        res.status(200).json({ gameStep: parseInt(data.result || 0, 10) });
    }
}
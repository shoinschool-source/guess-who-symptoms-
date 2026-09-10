export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { roomPin, playerName, score } = req.body;

    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!kvUrl || !kvToken) return res.status(500).json({ error: 'Database not connected' });

    try {
        await fetch(kvUrl, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${kvToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(["HSET", `room:${roomPin}`, playerName, score])
        });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update score' });
    }
}

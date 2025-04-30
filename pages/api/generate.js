
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST is allowed' });
  }

  const prompt = req.body.prompt;

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
    },
    body: JSON.stringify({
      version: "db21e45f3700c8ffb75ab7353c74b8e86cb38cc1e7778c7b87c74cd80f9e6e79",
      input: { prompt }
    })
  });

  const prediction = await response.json();

  let output = null;
  while (!output || prediction.status !== 'succeeded') {
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` }
    });
    const data = await poll.json();
    if (data.status === 'succeeded') {
      output = data.output[0];
      break;
    }
    if (data.status === 'failed') {
      return res.status(500).json({ error: 'Generation failed' });
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  res.status(200).json({ image: output });
}

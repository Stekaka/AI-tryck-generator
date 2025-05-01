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
      version: "7e8c1de0ceec49d7d53e2f7c81a7c1df4fd4f3b7b7b69f91caa8a5ff06e7e204", // Realistic Vision v5.1
      input: {
        prompt,
        width: 512,
        height: 512,
        guidance_scale: 7,
        num_inference_steps: 25
      }
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

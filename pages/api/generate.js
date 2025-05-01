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

  const data = await response.json();
  console.log("Replicate response från backend:", data);

  if (!data.id) {
    return res.status(500).json({ error: 'Replicate response saknar ID', fullResponse: data });
  }

  res.status(200).json({ id: data.id });

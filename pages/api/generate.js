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
      version: "cc6e1b763e6c4e68be58b8695c3237f4213fbfd3c4570c3f61638e5cf59e442b", // stability-ai/sdxl
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
}

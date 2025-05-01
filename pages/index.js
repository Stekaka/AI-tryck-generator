const generateImage = async () => {
  setLoading(true);
  setImageUrl(null);

  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  const { id } = await res.json();

  let image = null;
  while (!image) {
    await new Promise(r => setTimeout(r, 2000)); // Vänta 2 sek mellan poll
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`
      }
    });
    const pollData = await pollRes.json();
    if (pollData.status === 'succeeded') {
      image = pollData.output[0];
    }
    if (pollData.status === 'failed') {
      alert('Generation failed');
      setLoading(false);
      return;
    }
  }

  setImageUrl(image);
  setLoading(false);
};

import React, { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

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
      await new Promise(r => setTimeout(r, 2000)); // Vänta 2 sek mellan varje poll
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

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Skapa AI-genererat t-shirtmotiv
      </h1>
      <input
        type='text'
        placeholder='Skriv t.ex. "En korv med solglasögon"'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      <button
        onClick={generateImage}
        disabled={loading || !prompt}
        style={{ padding: '0.5rem 1rem' }}
      >
        {loading ? 'Genererar...' : 'Generera bild'}
      </button>
      {imageUrl && (
        <div style={{ marginTop: '2rem' }}>
          <img src={imageUrl} alt='AI-genererad' style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
}


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
    const data = await res.json();
    setImageUrl(data.image);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Skapa AI-genererat t-shirtmotiv
      </h1>
      <input
        type='text'
        placeholder='Beskriv ditt motiv...'
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

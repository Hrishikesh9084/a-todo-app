import { useEffect, useState } from 'react';

export default function App() {
  const [health, setHealth] = useState('Checking backend...');

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setHealth(d.status === 'ok' ? 'Backend connected' : 'Backend unavailable'))
      .catch(() => setHealth('Backend unavailable'));
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Generated Application</h1>
      <p>Prompt: "Build a project management tool like Trello with boards, lists, and drag-and-drop cards"</p>
      <p>{health}</p>
    </main>
  );
}

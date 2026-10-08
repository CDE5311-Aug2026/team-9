import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchField } from '../components/UI';
import { specimens } from '../data';
import type { Notice } from '../data';

export function Collection({ showNotice }: { showNotice: (notice: Notice) => void }) {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const category = params.get('category') ?? 'All';
  const [liveMessage, setLiveMessage] = useState('');
  const update = (name: string, value: string) => { const next = new URLSearchParams(params); if (!value || value === 'All') next.delete(name); else next.set(name, value); setParams(next, { replace: true }); };
  const filtered = specimens.filter(s => (category === 'All' || s.category === category) && `${s.name} ${s.scientific}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <main id="main" tabIndex={-1} className="page collection-page" data-figma-node="94:2468">
    <header className="collection-heading"><div><h1>My Collection</h1><p>25 species discovered</p></div><button className="avatar" aria-label="Alex Morgan profile" onClick={() => showNotice({ title: 'Alex Morgan', body: '25 species discovered. Your ocean discoveries, all in one place.' })}>AM</button></header>
    <SearchField value={query} onChange={v => update('q', v)} placeholder="Search your species." label="Search your species" />
    <div className="category-tabs" role="group" aria-label="Species categories">{['All', 'Fish', 'Turtles', 'Other'].map(c => <button key={c} aria-pressed={category === c} className={category === c ? 'selected' : ''} onClick={() => { update('category', c); setLiveMessage(`${c} selected`); }}>{c}</button>)}</div>
    <button className="pending-review" onClick={() => showNotice({ title: '3 results need review', body: 'Your identification results are waiting for a closer look. Reviewing results is coming soon.' })}><span>3</span>3 results need review</button>
    <div className="specimen-grid">{filtered.map(s => {
      const content = <><img className="specimen-image" src={s.image} alt={`${s.name} cyanotype specimen`} /><span className="specimen-info"><strong>{s.name}</strong><em>{s.scientific}</em><span>{s.observations} {s.observations === 1 ? 'observation' : 'observations'}</span></span></>;
      return s.id === 'clown-anemonefish' ? <Link className="specimen-card" key={s.id} to={`/collection/${s.id}`}>{content}</Link> : <button className="specimen-card" key={s.id} onClick={() => showNotice({ title: s.name, body: `${s.scientific} · ${s.observations} observations in your collection.`, image: s.image })}>{content}</button>;
    })}</div>
    {!filtered.length && <div className="empty-state"><h2>No species found</h2><p>Try a different name or category.</p><button className="text-button" onClick={() => setParams({})}>Clear filters</button></div>}
    <span className="sr-only" role="status">{liveMessage}</span>
  </main>;
}

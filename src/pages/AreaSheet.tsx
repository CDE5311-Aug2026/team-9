import { useEffect, useRef, useState } from 'react';
import { assets } from '../assets';
import { areas } from '../data';
import type { AreaId } from '../data';
import { HomeIndicator, Icon, Modal, SearchField } from '../components/UI';

export function AreaSheet({ selected, onSelect, onClose }: { selected: AreaId; onSelect: (area: AreaId) => void; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [locating, setLocating] = useState(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const useLocation = () => {
    if (!navigator.geolocation) { setLocationStatus('Location is unavailable. Please choose an area below.'); return; }
    setLocating(true); setLocationStatus('Finding your area…');
    navigator.geolocation.getCurrentPosition(position => {
      if (!mounted.current) return;
      setLocating(false);
      const { latitude, longitude } = position.coords;
      if (latitude > -9 && latitude < -8 && longitude > 114 && longitude < 116) onSelect('bali');
      else if (latitude > 6 && latitude < 9 && longitude > 133 && longitude < 135) onSelect('palau');
      else setLocationStatus('No local guide is available here yet. Choose an area below to explore.');
    }, () => { if (mounted.current) { setLocating(false); setLocationStatus('Could not access your location. You can still choose an area below.'); } }, { timeout: 10000, maximumAge: 300000 });
  };
  const matches = areas.filter(a => a.name.toLowerCase().includes(query.trim().toLowerCase()));
  return <Modal title="Choose an area" onClose={onClose} className="area-sheet">
    <p className="muted small">Choose an area to browse. Location access is optional.</p>
    <button className="button secondary" onClick={useLocation} disabled={locating}><Icon src={assets.area.locateFixed} />{locating ? 'Finding your area…' : 'Use My Location'}</button>
    {locationStatus && <p className="inline-status" role="status">{locationStatus}</p>}
    <SearchField value={query} onChange={setQuery} placeholder="Search a region or dive site" label="Search a region or dive site" />
    <div className="area-options" role="group" aria-label="Suggested areas">{matches.map(a => <button key={a.id} className={`area-option ${selected === a.id ? 'selected' : ''}`} aria-pressed={selected === a.id} onClick={() => onSelect(a.id)}><Icon src={selected === a.id ? assets.area.mapPin1 : assets.area.mapPin2} /><span>{a.name}</span>{selected === a.id && <Icon src={assets.area.check1} />}</button>)}</div>
    {!matches.length && <p className="muted small" role="status">No matching areas. Try Bali or Palau.</p>}
    <HomeIndicator />
  </Modal>;
}

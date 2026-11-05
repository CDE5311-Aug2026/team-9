import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import type {ReactNode} from 'react';
import {AIIcon} from './AIIcon';
import {Go} from './UI';
import {collectionIds,species} from './model';
import {areaContent, marineNames, marinePhotos, nearbyArea} from './companionData';

export function AIHint({children}: {children: ReactNode}) {
  return <p className="c-ai-hint"><AIIcon/>{children}</p>;
}
export function PhotoCard({photo, tag, title, subtitle, to, action, onAction}: {onAction?: () => void; photo: string; tag: string; title: string; subtitle: string; to: string; action: string}) {
  return <article className="c-photo-card"><img src={photo} alt=""/><small>{tag}</small><div className="c-photo-copy"><h2>{title}</h2><p>{subtitle}</p><Go className="c-photo-action" to={to} onClick={onAction}>{action}</Go></div></article>;
}
export function MarineStories({ids, saved, compact = false}: {ids: number[]; saved: number[]; compact?: boolean}) {
  const collected = new Set(collectionIds(saved));
  return <div className={'c-stories' + (compact ? ' compact' : '')} aria-label="Marine life stories">{ids.map(id => <Go to={'guide/' + id} key={id} className={"c-story" + (collected.has(id) ? " is-collected" : "")}><span title={collected.has(id) ? "In your collection" : "Not collected yet"}><img src={marinePhotos[id]??species[id]?.photo} alt=""/></span><small>{marineNames[id]??species[id]?.name}</small><span className="c-collection-status">{collected.has(id) ? "In your collection" : "Not collected yet"}</span></Go>)}</div>;
}

// Native dialog provides focus containment and restores focus to its opener.
export function Modal({children, onClose, label, motion = false, exitAction, placement}: {placement?: 'bottom';motion?: boolean; exitAction?: (() => void) | null; children: ReactNode; onClose: () => void; label: string}) {
  const ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const dialog = ref.current!;
    const phone = dialog.closest<HTMLElement>('.v3');
    const fit = () => {
      if (!phone) return;
      const bounds = phone.getBoundingClientRect();
      const scale = bounds.width / phone.offsetWidth;
      Object.assign(dialog.style, {zoom: String(1 / scale), left: `${bounds.left}px`, top: `${bounds.top}px`, width: `${bounds.width}px`, height: `${bounds.height}px`});
      dialog.style.setProperty('--dialog-scale', String(scale));
      dialog.style.setProperty('--dialog-content-height', `${bounds.height / scale - 64}px`);
      dialog.style.borderRadius = `${parseFloat(getComputedStyle(phone).borderRadius) * scale}px`;
    };
    fit();
    dialog.showModal();
    const observer = new ResizeObserver(fit);
    if (phone) observer.observe(phone);
    window.addEventListener('resize', fit);
    return () => {observer.disconnect(); window.removeEventListener('resize', fit); dialog.close();};
  }, []);
  useGSAP(() => {
    if (!motion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {exitAction?.(); return;}
    if (exitAction) {
      gsap.to(ref.current!.firstElementChild, {opacity: 0, y: 10, '--backdrop-opacity': 0, duration: .16, ease: 'power1.in', onComplete: exitAction});
    } else {
      gsap.fromTo(ref.current!.firstElementChild, {opacity: 0, y: 14, '--backdrop-opacity': 0}, {opacity: 1, y: 0, '--backdrop-opacity': 1, duration: .26, ease: 'power2.out'});
    }
  }, {scope: ref, dependencies: [exitAction], revertOnUpdate: true});
  return <dialog ref={ref} className={'c-dialog c-phone-dialog'+(placement==='bottom'?' c-interest-sheet':'')} aria-label={label} onCancel={event => {event.preventDefault(); onClose();}} onClick={event => {if (event.target === ref.current) onClose();}}><div className="c-dialog-content">{children}</div></dialog>;
}

type LocationMode = 'confirm' | 'choose' | 'loading' | 'error';
export function LocationDialog({area, onSelect, onClose, start = 'confirm', motion = true, autoLocate = false, autoSelect = false, onWorldwide}: {onWorldwide?:()=>void;motion?: boolean; autoLocate?: boolean; autoSelect?: boolean; area: string; onSelect: (area: string) => void; onClose: () => void; start?: LocationMode}) {
  const [exitAction, setExitAction] = useState<(() => void) | null>(null);
  const finish = (action: () => void) => {if (motion) setExitAction(() => action); else action();};
  const close = () => finish(onClose);
  const select = (value: string) => finish(() => onSelect(value));
  const [mode, setMode] = useState<LocationMode>(start);
  const [query, setQuery] = useState('');
  const [candidate, setCandidate] = useState(area);
  const [nearby, setNearby] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);
  useEffect(() => () => {requestId.current++;}, []);
  const choose = () => {requestId.current++; setMode('choose');};
  const locate = () => {
    const id = ++requestId.current;
    setMode('loading');
    if (!navigator.geolocation) {setError('Location is unavailable in this browser.'); setMode('error'); return;}
    navigator.geolocation.getCurrentPosition(position => {
      if (id !== requestId.current) return;
      const match = nearbyArea(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
      if (!match) {setError('No supported dive area nearby. Choose a place to explore.'); setMode('error'); return;}
      if (autoSelect) {select(match.label); return;}
      setCandidate(match.label); setNearby(true); setMode('confirm');
    }, failure => {
      if (id !== requestId.current) return;
      setError(failure.code === 1 ? 'Location access is off. Choose a place or allow access in your browser.' : 'Couldn’t find your location. Try again or choose a place.');
      setMode('error');
    }, {timeout: 10000, maximumAge: 60000, enableHighAccuracy: false});
  };
  const initialLocate = useRef(locate);
  useEffect(() => {if (autoLocate) initialLocate.current();}, [autoLocate]);
  const matches = Object.values(areaContent).filter(option => option.label.toLowerCase().includes(query.trim().toLowerCase()));
  const custom = query.trim();
  return <Modal motion={motion} exitAction={exitAction} onClose={close} label="Choose your location">
    {mode === 'confirm' ? <>
      <h2 className="c-dialog-title"><AIIcon/>{nearby ? 'Near' : 'Explore'} {candidate.split(',')[0]}?</h2>
      <button className="c-primary" onClick={() => select(candidate)}>Explore {candidate.split(',')[0]}</button>
      <button className="c-secondary" onClick={close}>Not now</button>
      <div className="c-correction"><button onClick={locate}>Locate again</button><button onClick={choose}>Choose a place</button></div>
    </> : mode === 'choose' ? <>
      <div className="c-dialog-heading"><h2>Choose a place</h2><button onClick={close} aria-label="Close location search">×</button></div>
      <form onSubmit={event => {event.preventDefault(); if (custom) select(matches[0]?.label ?? custom);}}><input autoFocus className="v-input" aria-label="Search a region or dive site" placeholder="Search a region or dive site" value={query} maxLength={80} onChange={event => setQuery(event.target.value)}/></form>
      {onWorldwide&&<button className="c-place-option c-worldwide-option" onClick={()=>finish(onWorldwide)}>Browse worldwide<span aria-hidden="true">→</span></button>}
      <small className="v-muted">{query ? 'Search results' : 'Suggested places'}</small>
      {matches.map(option => <button className="c-place-option" key={option.key} onClick={() => select(option.label)}>{option.label}<span>{area === option.label ? '✓' : '→'}</span></button>)}
      {!matches.length && <><p className="v-muted">No curated content here yet.</p><button className="c-place-option" onClick={() => select(custom)}>Use “{custom}” →</button></>}
      <button className="c-secondary" onClick={locate}>Use current location</button>
    </> : mode === 'loading' ? <>
      <h2 className="c-dialog-title"><AIIcon/>Finding your location…</h2><p role="status" className="v-muted">Waiting for your browser’s location.</p>
      <button className="c-primary" onClick={choose}>Choose a place instead</button><button className="c-secondary" onClick={close}>Cancel</button>
    </> : <>
      <h2>Couldn’t find your location</h2><p role="status" className="v-muted">{error}</p><button className="c-primary" onClick={locate}>Try again</button><button className="c-secondary" onClick={choose}>Choose a place</button><button className="c-text-button" onClick={close}>Not now</button>
    </>}
  </Modal>;
}

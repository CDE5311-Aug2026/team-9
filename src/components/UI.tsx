import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { assets } from '../assets';

export function Icon({ src }: { src: string }) {
  return <img className="icon" src={src} alt="" aria-hidden="true" />;
}
export function StatusBar() {
  return <div className="status-bar" aria-hidden="true"><span>9:41</span><div className="device-status"><Icon src={assets.collection.iosSignal} /><Icon src={assets.collection.iosWifiSignal} /><Icon src={assets.collection.iosBatteryFull} /></div></div>;
}
export function HomeIndicator() {
  return <div className="home-indicator" aria-hidden="true"><span /></div>;
}
export function BottomNav({ explorePath, onIdentify }: { explorePath: string; onIdentify: () => void }) {
  const { pathname } = useLocation();
  return <footer className="bottom-nav"><nav aria-label="Main navigation">
    <NavLink to={explorePath} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Icon src={pathname.includes('/explore') ? assets.explore.bookOpen : assets.collection.bookOpen} /><span>Explore</span></NavLink>
    <button className="nav-item identify-nav" onClick={onIdentify}><span className="identify-icon"><Icon src={assets.collection.plus} /></span><span>Identify</span></button>
    <NavLink to="/collection" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Icon src={pathname.includes('/collection') ? assets.collection.bookOpen1 : assets.explore.bookOpen1} /><span>Collection</span></NavLink>
  </nav><HomeIndicator /></footer>;
}
export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link className="back-link" to={to}><Icon src={assets.species.arrowLeft} />{children}</Link>;
}
export function SearchField({ value, onChange, placeholder, label }: { value: string; onChange: (value: string) => void; placeholder: string; label: string }) {
  return <label className="search-field"><Icon src={assets.collection.search} /><span className="sr-only">{label}</span><input type="search" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} /></label>;
}
export function Modal({ title, children, onClose, className = '' }: { title: string; children: ReactNode; onClose: () => void; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);
  return <dialog ref={ref} className={`modal ${className}`} aria-label={title} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) { const bounds = e.currentTarget.getBoundingClientRect(); if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) onClose(); } }}>
    <div className="sheet-handle" aria-hidden="true"><span /></div>
    <div className="modal-heading"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close"><Icon src={assets.area.x} /></button></div>
    {children}
  </dialog>;
}
export function PointList({ items, small = false }: { items: { icon: string; text: string }[]; small?: boolean }) {
  return <ul className={`point-list ${small ? 'small-points' : ''}`}>{items.map(item => <li key={item.text}><span className="point-icon"><Icon src={item.icon} /></span><span>{item.text}</span></li>)}</ul>;
}
export function ArchiveCard({ image, title, description, scientific, collected, to, onClick, compact = false }: { image: string; title: string; description: string; scientific?: string; collected?: boolean; to?: string; onClick?: () => void; compact?: boolean }) {
  const content = <><span className="archive-image"><img src={image} alt={title} />{collected && <span className="collected-badge" aria-label="In your collection"><Icon src={assets.explore.check} /></span>}</span><span className="archive-copy"><strong>{title}</strong>{scientific && <span>{scientific}</span>}<span>{description}</span></span></>;
  const className = `archive-card ${compact ? 'compact' : ''}`;
  return to ? <Link to={to} className={className}>{content}</Link> : <button className={className} onClick={onClick}>{content}</button>;
}

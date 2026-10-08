import { Link, useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets';
import { areas } from '../data';
import type { Notice } from '../data';
import { ArchiveCard, Icon } from '../components/UI';

export function Explore({ showNotice, choosing = false, areaId }: { showNotice: (notice: Notice) => void; choosing?: boolean; areaId: string }) {
  const navigate = useNavigate();
  const { region } = useParams();
  const current = region ?? areaId;
  const palau = current === 'palau';
  const supported = current === 'bali' || palau;
  const area = areas.find(a => a.id === current) ?? areas[0];
  const a = palau ? assets.palau : assets.explore;
  const openArea = () => navigate(`/explore/${current}/areas`);
  const unavailableSpecies = (name: string, body: string, image: string) => showNotice({ title: name, body, image });
  return <main id="main" tabIndex={-1} className={`page explore-page ${palau ? 'palau-page' : ''}`} data-figma-node={palau ? '98:13756' : '98:13593'}>
    <header className="explore-intro"><div className="explore-heading"><h1>Explore</h1><p>Get to know the ocean around you.</p></div><button className="area-select" onClick={openArea} aria-haspopup="dialog" aria-expanded={choosing}><Icon src={a.mapPin} /><span><small>Selected area</small><strong>{area.name}</strong></span><Icon src={a.chevronDown} /></button></header>
    <section className="section around-you"><div className="section-heading"><h2>Around You</h2><button className="text-button" onClick={() => navigate(`/explore/${current}/all`)}>View all</button></div><p className="muted small">Marine life you may encounter in this area.</p>
      {supported ? <><ArchiveCard image={a.photograph} title="Green Turtle" description="Shallow reefs & seagrass beds" collected to={`/explore/${current}/green-turtle`} /><ArchiveCard image={a.photograph1} title="Reef Manta Ray" description="Reef slopes & coastal waters" collected onClick={() => unavailableSpecies('Reef Manta Ray', 'Mobula alfredi · Reef slopes & coastal waters', a.photograph1)} />{!palau && <ArchiveCard image={assets.explore.photograph2} title="Moorish Idol" scientific="Zanclus cornutus" description="Coral reefs & rocky lagoons" onClick={() => unavailableSpecies('Moorish Idol', 'Zanclus cornutus · Coral reefs & rocky lagoons', assets.explore.photograph2)} />}</> : <div className="empty-state"><h3>A new area to explore</h3><p>This area’s marine life guide is coming soon.</p><Link className="text-button" to="/explore/bali">Explore Bali</Link></div>}
    </section>
    <section className="section ocean-notes"><h2>Ocean Notes</h2><ArchiveCard image={palau ? assets.palau.photograph2 : assets.explore.photograph3} title={palau ? 'Look for fin shape and body markings' : 'Fin shape & markings'} description="1 min read" to={`/explore/${current}/notes/identification`} compact={palau} /><ArchiveCard image={a.photograph} title={palau ? 'Observe marine life without disturbing it' : 'Observe without disturbing'} description="1 min read" compact={palau} onClick={() => showNotice({ title: 'Observe without disturbing', body: 'Never touch or feed. Never block the path to the surface. Give marine life room to swim.', image: a.photograph })} /></section>
    <section className="cleanup-section"><h2>Cleanup Activities</h2><p className="muted">Support the places you explore.</p>{palau || !supported ? <div className="cleanup-card empty-cleanups"><Icon src={assets.palau.calendarDays} /><h3>No cleanups listed here yet.</h3><p className="muted">Try another area or check back later.</p><button className="button secondary" onClick={openArea}>Change Area</button></div> : <div className="cleanup-card"><p className="cleanup-label"><Icon src={assets.explore.trash2} />Join a Cleanup</p><span className="sample-tag">Sample activity</span><h3>Amed Shoreline Cleanup</h3><p className="muted small">Amed Coast Volunteers (sample organizer)</p><p className="small">Amed Beach, Bali</p><p className="muted small">24 Oct 2026</p><button className="button secondary" onClick={() => showNotice({ title: 'Amed Shoreline Cleanup', body: 'Sample activity · Amed Coast Volunteers (sample organizer). Amed Beach, Bali · 24 Oct 2026. This is an example activity; registration is not available.' })}>View Activity</button></div>}</section>
  </main>;
}

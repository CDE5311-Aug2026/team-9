import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { assets } from './assets';
import { areas, identificationNotice } from './data';
import type { AreaId, Notice } from './data';
import { ArchiveCard, BottomNav, HomeIndicator, Modal, StatusBar } from './components/UI';
import { Collection } from './pages/Collection';
import { Explore } from './pages/Explore';
import { AreaSheet } from './pages/AreaSheet';
import { OceanNote, SpeciesDetail, TurtleDetail } from './pages/Details';

function readArea(): AreaId {
  try { const value = localStorage.getItem('divedex.area'); return areas.find(a => a.id === value)?.id ?? 'bali'; } catch { return 'bali'; }
}
function RegionPage({ area, selectArea, showNotice }: { area: AreaId; selectArea: (area: AreaId) => void; showNotice: (notice: Notice) => void }) {
  const { region, '*': child = '' } = useParams();
  const navigate = useNavigate();
  const selected = areas.find(a => a.id === region)?.id ?? area;
  useEffect(() => { selectArea(selected); }, [selected, selectArea]);
  if (!areas.some(a => a.id === region)) return <Navigate to={`/explore/${area}`} replace />;
  const backTo = `/explore/${selected}`;
  if (child === 'green-turtle') return <TurtleDetail backTo={backTo} showNotice={showNotice} />;
  if (child === 'notes/identification') return <OceanNote backTo={backTo} />;
  if (child && child !== 'areas' && child !== 'all') return <Navigate to={backTo} replace />;
  return <><Explore showNotice={showNotice} areaId={selected} choosing={child === 'areas'} />
    {child === 'areas' && <AreaSheet selected={selected} onClose={() => navigate(backTo, { replace: true })} onSelect={a => { selectArea(a); navigate(`/explore/${a}`, { replace: true }); }} />}
    {child === 'all' && <Modal title="Around You" onClose={() => navigate(backTo, { replace: true })} className="all-species"><p className="muted small">Marine life you may encounter in {areas.find(a => a.id === selected)?.name}.</p>{selected === 'bali' || selected === 'palau' ? <><ArchiveCard image={assets.explore.photograph} title="Green Turtle" description="Shallow reefs & seagrass beds" collected to={`${backTo}/green-turtle`} /><ArchiveCard image={assets.explore.photograph1} title="Reef Manta Ray" description="Reef slopes & coastal waters" collected onClick={() => { showNotice({ title: 'Reef Manta Ray', body: 'Mobula alfredi · Reef slopes & coastal waters', image: assets.explore.photograph1 }); }} />{selected === 'bali' && <ArchiveCard image={assets.explore.photograph2} title="Moorish Idol" description="Zanclus cornutus · Coral reefs & rocky lagoons" onClick={() => { showNotice({ title: 'Moorish Idol', body: 'Zanclus cornutus · Coral reefs & rocky lagoons', image: assets.explore.photograph2 }); }} />}</> : <p>This area’s marine life guide is coming soon.</p>}</Modal>}
  </>;
}
export function App() {
  const [area, setArea] = useState<AreaId>(readArea);
  const [notice, setNotice] = useState<Notice | null>(null);
  const { pathname } = useLocation();
  const isDetail = pathname.includes('/collection/') || pathname.endsWith('/green-turtle') || pathname.includes('/notes/');
  useEffect(() => { try { localStorage.setItem('divedex.area', area); } catch { /* Browsing remains available without storage. */ } }, [area]);
  useLayoutEffect(() => {
    if (!pathname.endsWith('/areas') && !pathname.endsWith('/all')) window.scrollTo(0, 0);
    setNotice(null);
    const title = pathname.includes('identification') ? 'Ocean Notes' : pathname.includes('green-turtle') ? 'Green Turtle' : pathname.includes('clown-anemonefish') ? 'Clown Anemonefish' : pathname.includes('explore') ? 'Explore' : 'My Collection';
    document.title = `DiveDex · ${title}`;
  }, [pathname]);
  return <div className={`app-shell ${isDetail ? 'detail-shell' : ''}`}>
    <a href="#main" className="skip-link" onClick={e => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
    <StatusBar />
    <Routes>
      <Route path="/" element={<Navigate to="/collection" replace />} />
      <Route path="/collection" element={<Collection showNotice={setNotice} />} />
      <Route path="/collection/clown-anemonefish" element={<SpeciesDetail showNotice={setNotice} />} />
      <Route path="/explore" element={<Navigate to={`/explore/${area}`} replace />} />
      <Route path="/explore/:region/*" element={<RegionPage area={area} selectArea={setArea} showNotice={setNotice} />} />
      <Route path="*" element={<main id="main" tabIndex={-1} className="page empty-state"><h1>Page not found</h1><p>Let’s get you back to the ocean.</p><Link className="button primary" to="/collection">My Collection</Link></main>} />
    </Routes>
    {isDetail ? <HomeIndicator /> : <BottomNav explorePath={`/explore/${area}`} onIdentify={() => setNotice(identificationNotice)} />}
    {notice && <Modal title={notice.title} onClose={() => setNotice(null)} className="notice-modal">{notice.image && <img className="notice-image" src={notice.image} alt={notice.title} />}<p className="muted">{notice.body}</p><button className="button primary" onClick={() => setNotice(null)}>Got it</button></Modal>}
  </div>;
}

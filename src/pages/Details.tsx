import { assets } from '../assets';
import { BackLink, Icon, PointList } from '../components/UI';
import { identificationNotice } from '../data';
import type { Notice } from '../data';

export function SpeciesDetail({ showNotice }: { showNotice: (notice: Notice) => void }) {
  const viewObservation = () => showNotice({ title: 'Your observation', body: 'Clown Anemonefish · 7 Oct 2026 · Amed, Bali', image: assets.species.originalUnderwaterPhotograph });
  return <main id="main" tabIndex={-1} className="page detail-page species-page" data-figma-node="94:2529">
    <BackLink to="/collection">My Collection</BackLink>
    <figure className="species-artwork"><img src={assets.species.cyanotypeSpecimen} alt="Clown Anemonefish cyanotype specimen" /><figcaption>Species artwork · Cyanotype specimen</figcaption></figure>
    <section className="species-information"><h1>Clown Anemonefish</h1><p className="scientific">Amphiprion ocellaris</p><div className="fun-fact"><h2>Fun fact</h2><p>Those sea anemones are more than a hiding place—the clownfish’s mucus helps protect it from their stings.</p></div></section>
    <dl className="personal-record"><div><dt>First recorded</dt><dd>7 Oct 2026</dd></div><div><dt>Personal encounters</dt><dd>1 observation</dd></div></dl>
    <section className="observations"><h2>Your Observations</h2><p className="muted tiny">Your photograph</p><button className="observation-card" onClick={viewObservation}><img src={assets.species.originalUnderwaterPhotograph} alt="Your underwater clownfish photograph" /><span><strong>7 Oct 2026</strong><small>Amed, Bali</small></span></button><button className="observation-link" onClick={viewObservation}>View Observation<Icon src={assets.species.chevronRight} /></button></section>
    <button className="button secondary" onClick={() => showNotice(identificationNotice)}><Icon src={assets.species.plus} />Add Observation</button>
  </main>;
}
export function TurtleDetail({ backTo, showNotice }: { backTo: string; showNotice: (notice: Notice) => void }) {
  const a = assets.turtle;
  return <main id="main" tabIndex={-1} className="page detail-page turtle-page" data-figma-node="98:13825">
    <BackLink to={backTo}>Explore</BackLink>
    <figure className="reference-photo"><img src={a.underwaterPhotograph} alt="Green turtle swimming above a coral reef" /><figcaption>Reference underwater photograph</figcaption></figure>
    <header className="detail-heading"><h1>Green Turtle</h1><p className="scientific">Chelonia mydas</p></header>
    <h2>Fun fact</h2><p className="muted">That “green” name? It comes from the fat beneath their shell, not the shell itself.</p>
    <section className="information-section"><h2>How to spot it</h2><PointList items={[{ icon: a.shield, text: 'Smooth oval shell' }, { icon: a.eye, text: 'One pair of scales between eyes' }, { icon: a.circleX, text: 'Paddle-shaped front flippers' }]} /></section>
    <section className="information-section"><h2>Where to look</h2><div className="habitat-tags"><span>Shallow tropical reefs</span><span>Seagrass beds</span></div></section>
    <section className="information-section"><h2>A friendly reminder</h2><PointList items={[{ icon: a.hand, text: 'Never touch or feed' }, { icon: a.arrowUp, text: 'Never block path to surface' }, { icon: a.circleX, text: 'Give room to swim' }]} /></section>
    <button className="button primary" onClick={() => showNotice(identificationNotice)}>Identify Your Photo</button>
  </main>;
}
export function OceanNote({ backTo }: { backTo: string }) {
  const a = assets.note;
  return <main id="main" tabIndex={-1} className="page detail-page note-page" data-figma-node="98:13860">
    <BackLink to={backTo}>Explore</BackLink><p className="muted small">Ocean Notes · 1 min read</p><h1>Look for fin shape and body markings</h1><img className="note-photo" src={a.underwaterPhotograph} alt="Clownfish showing its orange body and white bands among anemone tentacles" />
    <section className="information-section"><h2>How to spot it</h2><PointList small items={[{ icon: a.shapes, text: 'Compare fin and tail shape' }, { icon: a.eye, text: 'Note band and spot locations' }, { icon: a.layers, text: 'Compare several traits—colors change underwater.' }]} /></section>
    <section className="information-section"><h2>A friendly reminder</h2><PointList small items={[{ icon: a.camera, text: 'Whole body side view if relaxed' }, { icon: a.hand, text: 'Never chase for a photo' }, { icon: a.minusCircle, text: 'Uncertain results can stay unidentified' }]} /></section>
    <p className="muted small">DiveDex editorial · Educational sample</p>
  </main>;
}

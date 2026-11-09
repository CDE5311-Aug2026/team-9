import {DiagonalArrow} from './ExploreArrow';
import {useSearchParams} from 'react-router-dom';
import {collectionTrips} from './collectionTrips';
import {useState} from 'react';
import {BlueTangKnowledge,SpeciesCuriosity} from './SpeciesKnowledge';
import {specimenPhotoCredits} from './specimenPhotoCredits';
import {speciesQuickFacts} from './speciesQuickFacts';
import {Back,Button,Go,Panel} from './UI';
import {species, collectionIds} from './model';
export function Species({id,guide=false,saved=[]}:{id:number;guide?:boolean;saved?:number[]}) {
 const validId = species[id] ? id : 0;
 const s = species[validId], facts = speciesQuickFacts[validId];
 const collected = collectionIds(saved).includes(validId);
 const credit = specimenPhotoCredits[validId];
 const [params]=useSearchParams();const trips=collectionTrips(saved);const trip=trips.find(t=>t.id===params.get('trip')&&t.ids.includes(validId))??trips.find(t=>t.ids.includes(validId));
 return <>
  <Back to={guide?'explore':'collection'} label={guide?'Explore':'My Collection'}/>
  <article className="c-species-quick">
   <img className="c-species-photo" src={s.photo} alt={s.name}/>
   <header className="c-species-name"><h1>{s.name}</h1><i>{s.latin}</i><span className={'c-species-status'+(collected?' collected':'')}><span aria-hidden="true"/>{collected?'In your collection':'Not collected yet'}</span></header>
   <section className="c-species-fact"><h2>Fun fact</h2><p>{facts.fact}</p></section>
   <p className="c-species-reminder">{facts.reminder}</p>
   <details className="c-species-source"><summary>Read the source</summary><a href={facts.source} target="_blank" rel="noreferrer">Species reference <DiagonalArrow/></a>{credit && <p>Photo: <a href={credit.source} target="_blank" rel="noreferrer">{credit.title}</a> · {credit.author} · <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a>. Display cropped to fit.</p>}</details>
   {validId===4?<BlueTangKnowledge/>:<SpeciesCuriosity key={validId} name={s.name} cues={facts.cues} habitat={facts.habitat} reminder={facts.reminder} fact={facts.fact} source={facts.source}/>}
   {!guide && collected && <section className="c-species-observations"><h2>Your observations</h2><dl className="c-observation-table">
    <div><dt>Trip dates</dt><dd>{trip && trip.id!=='unassigned'?trip.dates:'Not recorded'}</dd></div>
    <div><dt>Location</dt><dd>{trip && trip.id!=='unassigned'?trip.name:'Not recorded'}</dd></div>
    <div><dt>Record</dt><dd>Photo observation</dd></div>
    <div><dt>Visibility</dt><dd>Private</dd></div>
   </dl></section>}
   {guide&&<Go className="c-primary" to="identify">Identify your photo</Go>}
  </article>
 </>;
}
export function Study({review=false,onContribute}:{review?:boolean;onContribute:()=>void}){const [consent,setConsent]=useState(false);return <><Back to={review?'study':'explore'} label={review?'Study':'Explore'}/><h1>{review?'Contribution Review':'Bali Reef Fish Photo Study'}</h1><p>{review?'Bali Reef Fish Photo Study':'Blue Reef Research'}</p><small className="v-muted">{review?'1 observation selected':'Help document reef-fish diversity in Bali.'}</small>{!review?<><img className="v-hero" src={species[0].photo} alt="Clown Anemonefish"/><Panel><h2>Looking for</h2><p>Underwater reef-fish photos</p><h2>Where</h2><p>Bali, Indonesia</p></Panel><Panel><h2>Your match</h2><strong>1 matching observation</strong><p>Your photos help map Bali’s reef-fish diversity.</p></Panel><details><summary>About this study</summary><p>Blue Reef Research reviews identification and studies Bali reef-fish diversity.</p></details><Go className="v-button" to="contribute">Review contribution</Go></>:<><h2>Selected observations</h2><Panel><div className="v-species-row"><img src={species[0].photo} alt=""/><div><strong>Clown Anemonefish</strong><small>7 Oct 2026 · Amed, Bali</small></div></div></Panel><Panel><h2>What you’ll share · Required</h2><p>1 selected photo</p><p>Date · 7 Oct 2026</p><p>Species · Clown Anemonefish</p><p>Bali, Indonesia · Region only</p><label className="v-check"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>Allow public photo use · Optional</label></Panel><Panel><h2>Who receives it and why</h2><p>Blue Reef Research</p><p className="v-muted">Review identification and study Bali reef-fish diversity.</p></Panel><Panel><h2>Your control</h2><p className="v-muted">Photo kept up to 12 months.</p><p className="v-muted">Request withdrawal in Research Contributions.</p><p className="v-muted">Anonymous summaries may remain.</p></Panel><Panel><h2>Not shared</h2><p className="v-muted">Precise coordinates, dive-site name, email, other observations.</p></Panel><details><summary>Study methods & permissions</summary><p>Only the selected observation and consented fields are included in your contribution.</p></details><Button onClick={onContribute}>Confirm & Contribute</Button><small className="v-muted">By confirming, you share only these selected fields.</small></>}</>}

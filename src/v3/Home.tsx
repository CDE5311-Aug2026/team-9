import {FishCompanion,OceanChat} from './OceanChat';
import {CollectionPolaroids} from './CollectionPolaroids';
import {species} from './model';
import {SavedIdeaPreview} from './SavedIdeaPreview';
import {ideaKey} from './savedIdeas';
import type {SavedIdea} from './savedIdeas';
import {DiveChallenge} from './DiveChallenge';
import type {DiveChallengeState} from './DiveChallenge';
import {useEffect, useRef, useState} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {AIIcon} from './AIIcon';
import {Go} from './UI';
import {LocationDialog, MarineStories} from './CompanionUI';
import {areaContent, companionPhotos, getArea, stages} from './companionData';
import type {Preferences, Stage} from './companionData';

gsap.registerPlugin(useGSAP);

function StagePicker({stage, onSelect}: {stage: Stage; onSelect: (value: Stage) => void}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null);
  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to('.c-stage-menu', {autoAlpha: open ? 1 : 0, y: open ? 0 : -5, duration: reduced ? 0 : open ? .22 : .16, ease: 'power2.out', overwrite: true});
  }, {scope: root, dependencies: [open]});
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {if (!root.current?.contains(event.target as Node)) setOpen(false);};
    const escape = (event: KeyboardEvent) => {if (event.key === 'Escape') {setOpen(false); trigger.current?.focus();}};
    document.addEventListener('pointerdown', dismiss); document.addEventListener('keydown', escape);
    return () => {document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape);};
  }, [open]);
  return <div className="c-stage" ref={root} onBlur={event => {if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);}}>
    <button ref={trigger} className="c-stage-trigger" aria-expanded={open} aria-controls="journey-options" onClick={() => setOpen(!open)}><AIIcon/>{stage} <svg className="c-chevron" aria-hidden="true" width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
    <div inert={!open} aria-hidden={!open} className="c-stage-menu" id="journey-options" role="group" aria-label="Your dive stage">{stages.map(option => <button key={option} aria-pressed={stage === option} onClick={() => {setOpen(false); trigger.current?.focus(); onSelect(option);}}>{option}{stage === option && <span>✓</span>}</button>)}</div>
  </div>;
}
export function Home({onSaveIdea,savedIdeas,onRemoveIdea,saved, area, setArea, onBrowse, stage, setStage, discovered, challenge, onStartChallenge}: {onSaveIdea:(idea:SavedIdea)=>void;savedIdeas:SavedIdea[];onRemoveIdea:(idea:SavedIdea)=>void;saved: number[]; onBrowse: () => void; area: string; setArea: (value: string) => void; stage: Stage; setStage: (value: Stage) => void; preferences: Preferences; discovered: number;challenge:DiveChallengeState|null;onStartChallenge:(id:number)=>void}) {
  const [locationOpen, setLocationOpen] = useState<'gps' | 'edit' | null>(null);
  const homeRoot = useRef<HTMLDivElement>(null);
  const previousContent = useRef(stage + area);
  useGSAP(() => {
    const key = stage + area;
    if (previousContent.current === key) return;
    previousContent.current = key;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo('.c-home-first > :not(.c-home-heading)', {opacity: .4, y: 6}, {opacity: 1, y: 0, duration: .3, ease: 'power2.out', clearProps: 'opacity,transform'});
  }, {scope: homeRoot, dependencies: [stage, area], revertOnUpdate: true});
  const [chatOpen,setChatOpen]=useState(false);
  const region = getArea(area), place = region?.short ?? area;
  const after = stage === 'After a dive', exploring = stage === 'Just exploring';
  const [nearbyTarget,setNearbyTarget]=useState<{place:string;id:number}|null>(null);
  const targetId=challenge?.speciesId??(nearbyTarget?.place===place?nearbyTarget.id:place.includes('Raja')?1:0);
  const regionKey = region?.key ?? 'unknown';
  const marine = <section className="c-card"><Go onClick={onBrowse} className="c-home-section-link" to="explore?tab=marine">{!after&&!exploring?'Also around you':'Marine life'} <span>→</span></Go>{region ? <MarineStories saved={saved} ids={region.marine.filter(id=>(after||exploring||id!==targetId)&&![13,14,17,region.key==='raja'?2:12].includes(id))} compact/> : <Go to="areas">Choose a place →</Go>}</section>;
  const hero = <Go className="c-home-visual" to="collection"><img src={species[17].photo} alt="Broadclub cuttlefish"/><div><h2>Your discoveries</h2><span>{discovered} species →</span></div></Go>;
  const escapeArea=region??areaContent.amed;
  const freshIdea=Object.values(areaContent).flatMap(destination=>[0,1].map(index=>({destination,index}))).find(candidate=>!savedIdeas.some(idea=>idea.areaKey===candidate.destination.key&&idea.index===candidate.index))??{destination:escapeArea,index:1};
  const escapeCard=(destination:typeof escapeArea,index=0)=>{
    const idea:SavedIdea={areaKey:destination.key,index,month:new Date().getMonth()+1,interest:'Marine life'};
    const isSaved=savedIdeas.some(value=>ideaKey(value)===ideaKey(idea));
    return <article className="c-home-visual"><Go to={'destination/'+destination.key+'?overview=1&idea='+index+'&month='+idea.month+'&interest=Marine+life'} aria-label={'Explore '+destination.short}><img src={destination.dives[index].photo} alt={'Landscape in '+destination.short}/><div><small>{new Date().toLocaleString('en-US',{month:'long'})}</small><h2>{destination.short} <span aria-hidden="true">↗</span></h2></div></Go><button className="c-home-bookmark" aria-label={(isSaved?'Saved: ':'Save ')+destination.short} aria-pressed={isSaved} onClick={()=>isSaved?onRemoveIdea(idea):onSaveIdea(idea)}><svg width="20" height="22" viewBox="0 0 24 24" fill={isSaved?'currentColor':'none'} aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg></button></article>;
  };
  return <div className="c-home c-home-visual-first c-home-dashboard" ref={homeRoot}>
    <section className={'c-home-first' + (after ? ' after' : exploring ? ' exploring'+(savedIdeas.length?' has-saved-ideas':'') : '')}>
      <header className="c-home-heading"><div className="c-home-title-row"><h1 className="c-page-title">{after?'What a day in the blue.':exploring?'Your ocean awaits.':'Welcome to '+place+'.'}</h1><button className="c-home-chat-trigger" onClick={()=>setChatOpen(true)} aria-label="Open AI ocean assistant" aria-haspopup="dialog"><FishCompanion/><span>AI</span></button></div><div className="c-home-context"><StagePicker stage={stage} onSelect={value => {if (value === stage) return; if (value === 'At the spot') setLocationOpen('gps'); else {setStage(value); document.getElementById('v3-main')?.scrollTo(0, 0);}}}/>{<button className="c-change-location" aria-label={"Change location, current location: " + area} title={area} onClick={() => setLocationOpen('edit')}> <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7"/></svg><span>{place}</span><svg aria-hidden="true" width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></button>}</div></header>
      {exploring?(savedIdeas.length?<SavedIdeaPreview ideas={savedIdeas} onRemove={onRemoveIdea}/>:escapeCard(escapeArea)):after ? <>{challenge?<DiveChallenge after compact place={place} challenge={challenge} onStart={onStartChallenge}/>:hero}</> : <DiveChallenge after={false} place={place} challenge={challenge} onStart={onStartChallenge} onTargetChange={id=>setNearbyTarget({place,id})}/>}
      {marine}
      {<div className="c-home-quick-grid">{exploring?<Go to="explore?scope=world&tab=sites" className="c-identify-tile"><span className="c-explore-tile-symbol" aria-hidden="true">↗</span><strong>Find your<br/>next dive</strong><small>Explore destinations</small></Go>:<Go to="identify" className="c-identify-tile"><svg aria-hidden="true" viewBox="0 0 32 32" fill="none"><path d="M4 10h6l2-4h8l2 4h6v16H4V10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><circle cx="16" cy="18" r="5" stroke="currentColor" strokeWidth="1.7"/></svg><strong>Identify<br/>a find</strong><small>Photo or video</small><span aria-hidden="true">↗</span></Go>}<CollectionPolaroids saved={saved} compact/></div>}
    </section>
    <div className="c-home-rest">
      {exploring&&savedIdeas.length>0&&<section className="c-home-inspiration">{escapeCard(freshIdea.destination,freshIdea.index)}</section>}

      {after&&saved.length>0&&region&&<Go onClick={onBrowse} className="c-home-study" to={'experience/'+regionKey+'/study'}><img src={region.key==='raja'?companionPhotos.manta:species[12].photo} alt=""/><span>{region.study}<small>Contribute a photo →</small></span></Go>}
      <Go className="c-home-interest-link" to="preferences"><span>Not quite your thing?</span><strong>Change your interests <span aria-hidden="true">→</span></strong></Go>
    </div>
    {chatOpen&&<OceanChat onClose={()=>setChatOpen(false)}/>}
    {locationOpen && <LocationDialog motion autoLocate={locationOpen === 'gps'} autoSelect start={locationOpen === 'gps' ? 'loading' : 'choose'} area={area} onClose={() => setLocationOpen(null)} onSelect={value => {setArea(value); if(locationOpen==='gps')setStage('At the spot'); setLocationOpen(null); document.getElementById('v3-main')?.scrollTo(0, 0);}}/>}
  </div>;
}

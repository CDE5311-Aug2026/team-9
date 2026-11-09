import {useState} from 'react';
import {collectionTrips} from './collectionTrips';
import {species} from './model';
import {Go} from './UI';
import {AIIcon} from './AIIcon';

export type StudyRecord = {
  id: string;
  title: string;
  photos: number[];
  publicUse: boolean;
};

const photoGuidance = {
  manta: {
    choose: 'Choose a photo from Raja Ampat that shows the dark spots on the manta’s pale underside. A clear belly view is especially useful.',
    why: 'A manta’s spot pattern can act like a fingerprint. Comparing two belly photos can help a reviewer tell whether the same ray appeared on different dives.',
  },
  turtles: {
    choose: 'Choose a clear side view of the turtle’s head. A wider photo showing the shell can also help a reviewer check the species.',
    why: 'Head markings and shell features give reviewers details they can compare across encounters. The trip date and region put each observation in context.',
  },
  habitats: {
    choose: 'Choose a wide view that shows the coral and its surroundings. If you photographed the same patch on another visit, include both views.',
    why: 'A wide frame shows how coral, rock and sand fit together. Photos from different visits give reviewers a way to compare the same patch over time.',
  },
  fish: {
    choose: 'Choose a sharp side view that shows the whole fish, including its fins, markings and tail.',
    why: 'A reviewer can check the species against visible features. Together with the trip date and region, each photo adds an observation to the Bali reef-fish record.',
  },
};

export function StudyPhotos({title, area, item, detail, cover, saved, onSubmit}: {
  title:string; area:string; item:string; detail:string; cover:string; saved:number[];
  onSubmit:(record:StudyRecord)=>void;
}) {
  const [step,setStep]=useState<'about'|'review'|'done'>('about');
  const [selected,setSelected]=useState<number[]>([]);
  const [publicUse,setPublicUse]=useState(false);
  const trips=collectionTrips(saved);
  const purpose=item==='turtles'
    ? 'Compare turtle encounters across trips and document which turtles divers see in this region.'
    : item==='habitats'
    ? 'Compare wide reef photographs to document habitat features over time.'
    : area==='raja'
    ? 'Compare the spot patterns on mantas’ undersides to recognise individuals across encounters.'
    : 'Check fish identifications and document which reef species divers observe around Bali.';
  const guidance = photoGuidance[item === 'turtles' || item === 'habitats' ? item : area === 'raja' ? 'manta' : 'fish'];
  const toggle=(id:number)=>setSelected(current=>current.includes(id)?current.filter(value=>value!==id):[...current,id]);

  if(step==='done')return <section className="c-card"><h2>Contribution saved</h2><p>{selected.length} selected {selected.length===1?'photo':'photos'} · {title}</p><Go className="c-primary" to="contributions">View contributions</Go></section>;
  const region = area === 'raja' ? 'Raja Ampat' : 'Bali';
  const subject = item === 'turtles' ? 'turtles' : item === 'habitats' ? 'corals' : area === 'raja' ? 'manta rays' : 'reef fish';
  function matchesSubject(id:number) {
    if (subject === 'manta rays') return species[id].latin === 'Mobula alfredi';
    const category = item === 'habitats' ? 'Corals' : item === 'turtles' ? 'Turtles' : 'Fish';
    return species[id].category === category;
  }
  const matches = trips.filter(trip=>trip.short===region).flatMap(trip=>trip.ids.filter(matchesSubject));
  const photoButton=(id:number)=><button key={id} className="c-study-photo" aria-pressed={selected.includes(id)} onClick={()=>toggle(id)}>
    <img src={species[id].photo} alt=""/><span>{species[id].name}</span>
    <b aria-hidden="true">{selected.includes(id)?'✓':''}</b>
  </button>;

  const photoPermissions = (
    <section className="c-card" aria-label="Photo use and permissions">
      <h2>How your photos will be used</h2>
      <p>{guidance.why}</p>
      <p><strong>Study use.</strong> By confirming, you allow this study’s team to keep and analyse your selected photos with their species names and available trip dates and region. You keep ownership of your photos.</p>
      <p><strong>Public use is optional.</strong> You can also allow the team to show your selected photos in this study’s public reports and presentations.</p>
    </section>
  );

  if(step==='about')return <>
    <img className="v-hero" src={cover} alt=""/>
    <section className="c-card c-study-about">
      <h2>About this study</h2>
      <p>{purpose}</p>
      <details>
        <summary><h2>Photos needed</h2></summary>
        <p>{guidance.choose}</p>
        <p>{detail}</p>
      </details>

    </section>
    {photoPermissions}
    <section className="c-card"><h2 className="c-study-match-heading"><AIIcon/>From your Collection</h2>
      <p>{matches.length ? `${matches.length} suggested ${matches.length===1?'photo':'photos'} · ${region} · ${subject}` : `No photos tagged with ${subject} in ${region} yet.`}</p>
      {matches.length>0&&<div className="c-study-photo-grid">{matches.map(photoButton)}</div>}
      <details><summary>Browse other photos</summary>{trips.map(trip=>{
        const other=trip.ids.filter(id=>!matches.includes(id));
        return other.length>0&&<section key={trip.id}><h3>{trip.name}</h3><div className="c-study-photo-grid">{other.map(photoButton)}</div></section>;
      })}</details>
    </section>
    <button className="c-primary" disabled={!selected.length} onClick={()=>setStep('review')}>Review selection{selected.length?' · '+selected.length:''}</button>
  </>;
  return <>
    <section className="c-card"><h2>Review your contribution</h2><p>{purpose}</p>{selected.map(id=>{
      const trip=trips.find(t=>t.ids.includes(id));
      return <div className="v-species-row" key={id}><img src={species[id].photo} alt=""/><div><strong>{species[id].name}</strong><small>{trip?.id==='unassigned'?'Trip details unavailable':trip?.dates+' · '+trip?.name}</small></div></div>;
    })}<button className="c-secondary" onClick={()=>setStep('about')}>Add or change photos</button></section>
    {photoPermissions}
    <label className="v-check"><input type="checkbox" checked={publicUse} onChange={event=>setPublicUse(event.target.checked)}/>Allow my photos in public study reports and presentations</label>
    <button className="c-primary" onClick={()=>{onSubmit({id:crypto.randomUUID(),title,photos:selected,publicUse});setStep('done');}}>Confirm contribution</button>
  </>;
}

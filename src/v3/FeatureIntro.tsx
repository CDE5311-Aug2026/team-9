import {species} from './model';
import {AIIcon} from './AIIcon';
import {Back,Go} from './UI';

const cards = [
  {title:'Find your next dive', copy:'Browse destinations and save the marine life you’d love to see.'},
  {title:'Identify your find', copy:'Choose a dive photo, then review the suggested species.'},
  {title:'Keep your discoveries', copy:'Revisit the photos and species you collected on each trip.'},
  {title:'Contribute to a study', copy:'Choose matching photos from your Collection and review what you’ll share.'},
];

export function FeatureIntro({step,onFinish}:{step:number;onFinish:()=>void}) {
  const card=cards[step];
  return <section className="c-first-run c-feature-intro">
    <div className="c-first-top"><Back to={step?'intro-feature-'+step:'welcome'} force/><button onClick={onFinish}>Skip</button></div>
    <div className={'c-feature-stage stage-'+step} aria-hidden="true">
      <div className="c-feature-composition">
      {step===0&&<figure className="c-feature-print"><img src="/v3/destinations/amed-coast-user.png" alt=""/><figcaption><small>Dive sites</small><strong>Amed coast</strong></figcaption></figure>}
      {step===1&&<figure className="c-feature-print"><div className="c-feature-scan"><img src={species[0].photo} alt=""/><i/></div><figcaption><small><AIIcon/> Suggested match</small><strong>{species[0].name}</strong></figcaption></figure>}
      {step===2&&<div className="c-feature-album">{[3,4].map(id=><figure key={id}><img src={species[id].photo} alt=""/><figcaption>{species[id].name}</figcaption></figure>)}</div>}
      {step===3&&<figure className="c-feature-print"><img src={species[2].photo} alt=""/><figcaption><small>Research contribution</small><strong>Manta Photo Study</strong></figcaption></figure>}
      <div className="c-feature-character" style={{backgroundPosition:['50% 0%','100% 0%','center','100% 100%'][step]}}/>
      </div>

    </div>
    <header><h1>{card.title}</h1><p>{card.copy}</p></header>
    <div className="c-first-actions">{step===cards.length-1?<button className="c-primary" onClick={onFinish}>Personalize DiveDex</button>:<Go to={'intro-feature-'+(step+2)} className="c-primary">Continue</Go>}</div>
    <div className="c-feature-dots" aria-label={'Page '+(step+1)+' of '+cards.length}>{cards.map((c,i)=><i key={c.title} className={i===step?'active':''}/>)}</div>
  </section>;
}

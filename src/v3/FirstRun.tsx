import {useEffect,useState} from 'react';
import {Back,Go} from './UI';
import {AIIcon} from './AIIcon';
import {species,read} from './model';
import {parseInterests,uniqueInterests} from './exploreInterests';
import type {Preferences} from './companionData';
const choices=[
 {name:'Marine life',photo:species[1].photo},
 {name:'Natural scenery',photo:'/v3/destinations/raja-islands.jpg'},
 {name:'Photography',photo:species[17].photo},
 {name:'Local culture',photo:'/v3/destinations/amed-coast-user.png'},
 {name:'Coral reefs',photo:species[16].photo},
 {name:'Macro photography',photo:species[15].photo},
];
export function FirstRun({page,preferences,onFinish}:{page:string;preferences:Preferences;onFinish:(topics:string[]|null)=>void}){
 const editing=page==='preferences';
 const [selected,setSelected]=useState<string[]>(()=>editing?(preferences.topics??[]):read('onboarding.draft',preferences.topics??[]));
 const [text,setText]=useState('');
 useEffect(()=>{if(editing)return;try{localStorage.setItem('divedex.v3.onboarding.draft',JSON.stringify(selected))}catch{/* Optional storage. */}},[selected,editing]);
 const add=()=>{if(text.trim()){setSelected(values=>uniqueInterests([...values,...parseInterests(text)]).slice(0,12));setText('')}};
 const extras=selected.filter(value=>!choices.some(c=>c.name===value));
 if(page==='welcome')return <section className="c-first-run c-first-welcome"><div className="c-first-brand">DiveDex</div><div className="c-first-cover"><img src="/v3/destinations/raja-islands.jpg" alt="Turquoise lagoons and islands in Raja Ampat"/><div><h1>Your ocean.<br/>More to discover.</h1><p>Find your next dive. Meet its marine life.<br/>Keep what you discover.</p></div></div><div className="c-first-actions"><Go className="c-primary" to="intro">Make it mine →</Go><button className="c-text-button" onClick={()=>onFinish(null)}>Explore first</button></div></section>;
 return <section className="c-first-run"><div className="c-first-top"><Back to={editing?"home":"welcome"} force/>{!editing&&<button onClick={()=>onFinish(null)}>Skip</button>}</div><header><h1>{editing?"Your interests":<>What draws you<br/>to the ocean?</>}</h1><p>Pick any mix. You can change it later.</p></header><div className="c-first-options" role="group" aria-label="Your interests">{choices.map(choice=><button key={choice.name} aria-pressed={selected.includes(choice.name)} onClick={()=>setSelected(values=>values.includes(choice.name)?values.filter(v=>v!==choice.name):[...values,choice.name])}><img src={choice.photo} alt=""/><span>{choice.name}</span><i aria-hidden="true">{selected.includes(choice.name)?'✓':'＋'}</i></button>)}</div><form className="c-first-custom" onSubmit={e=>{e.preventDefault();add()}}><label htmlFor="o-interest">Something else?</label><div><input id="o-interest" value={text} maxLength={100} onChange={e=>setText(e.target.value)} placeholder="Whale sharks, blackwater photography…"/><button aria-label="Add interest" disabled={!text.trim()}>＋</button></div></form>{extras.length>0&&<div className="c-interest-tags">{extras.map(value=><button key={value} onClick={()=>setSelected(values=>values.filter(v=>v!==value))} aria-label={'Remove '+value}>{value} ×</button>)}</div>}<div className="c-first-actions"><p><AIIcon/>Ideas shaped around your interests</p><button className="c-primary" onClick={()=>onFinish(uniqueInterests([...selected,...parseInterests(text)]))}>{editing?'Save interests':selected.length||text.trim()?'Show my ideas →':'Explore everything →'}</button></div></section>;
}

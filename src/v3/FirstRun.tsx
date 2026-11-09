import {DialogClose} from './DialogClose';
import {useNavigate} from 'react-router-dom';
import {Modal} from './CompanionUI';
import {FeatureIntro} from './FeatureIntro';
import welcomeLogo from '../../public/v3/brand/DiveDexLogo.svg?raw';
import {QuickEquipment} from './Equipment';
import {useEffect,useState} from 'react';
import {Back,Go} from './UI';
import {AIIcon} from './AIIcon';
import {read} from './model';
import {extraInterestGroups,uniqueInterests} from './exploreInterests';
import type {Preferences} from './companionData';
const choices=['Marine life','Natural scenery','Photography','Local culture','Coral reefs','Macro photography'];
export function FirstRun({page,preferences,onFinish,onGuest}:{onGuest?:()=>void;page:string;preferences:Preferences;onFinish:(topics:string[]|null)=>void}){
 const navigate=useNavigate();
 const editing=page==='preferences';
 const [selected,setSelected]=useState<string[]>(()=>editing?(preferences.topics??[]):read('onboarding.draft',preferences.topics??[]));
 useEffect(()=>{if(editing)return;try{localStorage.setItem('divedex.v3.onboarding.draft',JSON.stringify(selected))}catch{/* Optional storage. */}},[selected,editing]);
 const [draft,setDraft]=useState<string[]|null>(null);
 const groups=extraInterestGroups.map(({label,topics})=>({label,topics}));
 const previous=selected.filter(value=>!choices.includes(value)&&!groups.some(group=>group.topics.includes(value)));
 if(previous.length)groups.push({label:'Your other interests',topics:previous});
 const toggle=(choice:string)=>setSelected(values=>values.includes(choice)?values.filter(value=>value!==choice):[...values,choice]);
 if (page === 'welcome') return (
   <section className="c-first-run c-first-welcome">
     <div className="c-welcome-identity">
       <span className="c-welcome-mark" aria-hidden="true" dangerouslySetInnerHTML={{__html:welcomeLogo}}/>
       <h1>DiveDex</h1>
     </div>
     <div className="c-first-actions">
       <Go className="c-primary" to="signup">Create account</Go>
       <Go className="c-secondary" to="login">Log in</Go>
       <Go className="c-text-button" to="intro-feature-1" onClick={onGuest}>Continue as guest</Go>
     </div>
   </section>
 );

 if (page === 'intro-equipment') return <section className="c-first-run">
   <div className="c-first-top"><Back to="intro" force/></div>
   <QuickEquipment onFinish={()=>onFinish(selected)}/>
 </section>;
 if (page.startsWith('intro-feature-')) return <FeatureIntro step={Number(page.slice(-1))-1} onFinish={()=>navigate('/v3/intro')}/>;
 const next = () => {
   const topics=uniqueInterests(selected);
   if(editing)onFinish(topics);
   else {setSelected(topics);navigate('/v3/intro-equipment');}
 };
 return <section className="c-first-run"><div className="c-first-top"><Back to={editing?"home":"intro-feature-4"} force/></div><header><h1>{editing?"Your interests":<>What draws you<br/>to the ocean?</>}</h1><p>Pick any mix. You can change it later.</p></header><div className="c-first-options" role="group" aria-label="Your interests">{choices.map((choice,index)=><button key={choice} aria-pressed={selected.includes(choice)} onClick={()=>toggle(choice)}><div className="c-interest-art" aria-hidden="true" style={{backgroundPosition:(index%3)*50+'% '+Math.floor(index/3)*100+'%'}}/><span>{choice}</span>{selected.includes(choice)&&(
   <svg className="c-interest-selected-mark" aria-hidden="true" viewBox="0 0 20 20">
     <rect width="20" height="20" rx="6" fill="currentColor"/>
     <path d="m5.5 10 3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
   </svg>
 )}</button>)}</div><button className="c-more-open" aria-haspopup="dialog" onClick={()=>setDraft([...selected])}>
   More interests <svg className="c-more-chevron" aria-hidden="true" viewBox="0 0 16 16"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
 </button>
 {draft && <Modal label="More interests" placement="bottom" motion onClose={()=>setDraft(null)}>
   <section className="c-topic-sheet">
     <div className="c-dialog-heading"><h2>More interests</h2><DialogClose label="Close more interests" onClose={()=>setDraft(null)}/></div>
     {groups.map(group=><fieldset key={group.label}><legend>{group.label}</legend>
       <div className="c-topic-pills">{group.topics.map(topic=><button type="button" key={topic} aria-pressed={draft.includes(topic)}
         onClick={()=>setDraft(draft.includes(topic)?draft.filter(value=>value!==topic):[...draft,topic])}>{topic}</button>)}</div>
     </fieldset>)}
     <footer><span aria-live="polite">{draft.filter(value=>!choices.includes(value)).length} selected</span>
       <button onClick={()=>{setSelected(draft);setDraft(null)}}>Save</button></footer>
   </section>
 </Modal>}
 <div className="c-first-actions"><p><AIIcon/>Ideas shaped around your interests</p><button className="c-primary" onClick={next}>{editing?'Save interests':'Continue'}</button>{!editing&&<Go className="c-text-button c-onboarding-skip" to="intro-equipment">Skip for now</Go>}</div></section>;
}

import {DiagonalArrow} from './ExploreArrow';
import {useState} from 'react';
import {AIIcon} from './AIIcon';

const museum = 'https://australian.museum/learn/animals/fishes/blue-tang-paracanthurus-hepatus/';
const aquarium = 'https://www.georgiaaquarium.org/animal/palette-surgeonfish/';
const questions = [
  {title:'How do I recognise it?', answer:'Look for the curved black pattern across its blue body and a yellow tail edged in black. Check these markings together rather than relying on colour alone.', source:'Australian Museum', url:museum},
  {title:'Where does it live?', answer:'It lives on Indo-Pacific coral reefs. Adults may gather over outer reef terraces; young fish stay close to branching coral where they can shelter.', source:'Georgia Aquarium', url:aquarium},
  {title:'What does it eat?', answer:'It eats tiny drifting animals called zooplankton, as well as algae. Its food comes from both the water around the reef and surfaces on it.', source:'Georgia Aquarium', url:aquarium},
];

export function BlueTangKnowledge() {
  const [open,setOpen]=useState<number|null>(null);
  const [followUp,setFollowUp]=useState(false);
  return <section className="o-knowledge" aria-label="Blue Tang knowledge">
    <dl className="o-knowledge-facts">
      {[['Size','Up to 31 cm'],['Habitat','Coral reefs'],['Behaviour','Coral shelter']].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
    <h2>Stay curious</h2>
    {questions.map((question,index)=><div className="o-knowledge-question" key={question.title}>
      <button aria-expanded={open===index} aria-controls={'blue-tang-answer-'+index} onClick={()=>{setOpen(open===index?null:index);setFollowUp(false)}}>{question.title}<span aria-hidden="true">{open===index?'−':'+'}</span></button>
      {open===index&&<div className="o-knowledge-answer" id={'blue-tang-answer-'+index}>
        <p>{question.answer}</p>
        <a href={question.url} target="_blank" rel="noreferrer">{question.source} <DiagonalArrow/></a>
        {index===1&&<><button className="o-knowledge-followup" aria-expanded={followUp} aria-controls="blue-tang-followup" onClick={()=>setFollowUp(!followUp)}>↳ Why does it hide in coral?{followUp?'  −':''}</button>
          {followUp&&<div id="blue-tang-followup" className="o-knowledge-answer"><p>When startled, it can wedge itself among coral branches. Give it space and watch without chasing it out of its shelter.</p><a href={aquarium} target="_blank" rel="noreferrer">Georgia Aquarium <DiagonalArrow/></a></div>}
        </>}
      </div>}
    </div>)}
    <SpeciesAI/>
  </section>;
}

function SpeciesAI(){
 const [expanded,setExpanded]=useState(false),[query,setQuery]=useState(''),[answer,setAnswer]=useState(false),[notice,setNotice]=useState(''),[diet,setDiet]=useState(false);
 const sample='Why does it hide in coral?';
 return <div className="o-species-ai"><button className="o-ai-entry" aria-expanded={expanded} onClick={()=>setExpanded(!expanded)}><AIIcon/><span><strong>Ask AI about this species</strong><small>What else would you like to know?</small></span></button>{expanded&&<div className="o-ai-composer">{answer?<div className="o-knowledge-answer" aria-live="polite"><strong>{sample}</strong><p>When startled, it can wedge itself among coral branches. Give it space and watch without chasing it out of its shelter.</p><a href={aquarium} target="_blank" rel="noreferrer">Georgia Aquarium <DiagonalArrow/></a><button className="o-knowledge-followup" aria-expanded={diet} onClick={()=>setDiet(!diet)}>↳ What does it eat?</button>{diet&&<><p>{questions[2].answer}</p><a href={aquarium} target="_blank" rel="noreferrer">Georgia Aquarium <DiagonalArrow/></a></>}<button onClick={()=>{setAnswer(false);setQuery('');setNotice('');setDiet(false)}}>Ask another question →</button></div>:<><form onSubmit={event=>{event.preventDefault();if(query.trim().toLowerCase().replace(/[?.!]/g,'')===sample.toLowerCase().replace('?','')){setAnswer(true);setNotice('')}else setNotice('Try the suggested question below.')}}><input aria-label="Ask a question about Blue Tang" placeholder="Ask a question about Blue Tang…" value={query} onChange={event=>setQuery(event.target.value)}/><button aria-label="Send question" disabled={!query.trim()}>↑</button></form><button className="o-ai-sample" onClick={()=>{setQuery(sample);setNotice('')}}>Try: Why does it hide in coral?</button>{notice&&<p role="status">{notice}</p>}</>}<button className="o-ai-close" onClick={()=>setExpanded(false)}>Close</button></div>}</div>;
}

export function QuickSpeciesAI({name,answer,source}:{name:string;answer:string;source:string}) {
 const [open,setOpen]=useState(false), [query,setQuery]=useState(''), [shown,setShown]=useState(false), [notice,setNotice]=useState('');
 const sample = 'Tell me a fun fact';
 return <section className="o-species-ai c-quick-ai"><button className="o-ai-entry" aria-expanded={open} onClick={()=>setOpen(!open)}><AIIcon/><strong>Ask AI about {name}</strong></button>{open&&<div className="o-ai-composer"><form onSubmit={e=>{e.preventDefault();const match=query.trim().toLowerCase().replace(/[?.!]/g,'')===sample.toLowerCase();setShown(match);setNotice(match?'':'Try the suggested question below.');}}><input aria-label={'Ask about '+name} placeholder="What would you like to know?" value={query} onChange={e=>setQuery(e.target.value)}/><button aria-label="Send question" disabled={!query.trim()}>↑</button></form><button className="o-ai-sample" onClick={()=>{setQuery(sample);setShown(true);setNotice('');}}>Tell me a fun fact →</button>{shown&&<div aria-live="polite"><p>{answer}</p><a href={source} target="_blank" rel="noreferrer">Source <DiagonalArrow/></a></div>}{notice&&<p role="status">{notice}</p>}</div>}</section>;
}

export function SpeciesCuriosity({name,cues,habitat,reminder,fact,source}:{name:string;cues:string[];habitat:string;reminder:string;fact:string;source:string}){
 const [open,setOpen]=useState<number|null>(null);
 const items=[{title:'How do I recognise it?',answer:cues.join(' · ')},{title:'Where does it live?',answer:habitat},{title:'How can I observe it respectfully?',answer:reminder}];
 return <section className="o-knowledge" aria-label={name+' knowledge'}><h2>Stay curious</h2>{items.map((item,index)=><div className="o-knowledge-question" key={item.title}><button aria-expanded={open===index} aria-controls={'species-answer-'+index} onClick={()=>setOpen(open===index?null:index)}>{item.title}<span aria-hidden="true">{open===index?'−':'+'}</span></button>{open===index&&<div id={'species-answer-'+index} className="o-knowledge-answer"><p>{item.answer}</p><a href={source} target="_blank" rel="noreferrer">Species reference <DiagonalArrow/></a></div>}</div>)}<QuickSpeciesAI name={name} answer={fact} source={source}/></section>;
}

import {DialogClose} from './DialogClose';
import {DiagonalArrow} from './ExploreArrow';
import {useEffect,useRef,useState} from 'react';
import {Modal} from './CompanionUI';
import {Go} from './UI';
export function FishCompanion(){
 return <img className="c-assistant-puffer" src="/v3/onboarding/fish-avatar.jpg" alt=""/>;
}
type Reply={text:string;action?:string;to?:string};
type Message=Reply&{role:'user'|'assistant'};
function respond(text:string):Reply{
 if(/photo|upload|identify|照片|识别|上传/i.test(text))return {text:'Have a photo or video? Let’s see what you spotted.',action:'Identify a find',to:'identify'};
 if(/interest|preference|兴趣|偏好/i.test(text))return {text:'Tell DiveDex what you enjoy, and shape the ideas you see.',action:'Edit interests',to:'preferences'};
 if(/saved|plan|收藏.*地点|计划/i.test(text))return {text:'Your saved ideas are a good place to pick up where you left off.',action:'See saved ideas',to:'saved-ideas'};
 if(/fish|shark|turtle|marine|动物|海洋|鱼|龟/i.test(text))return {text:'Explore marine life and open a species to see where and how to spot it.',action:'Explore marine life',to:'explore?scope=local&tab=marine'};
 if(/dive|place|travel|site|where|潜|地点|旅行|去哪/i.test(text))return {text:'Browse destinations, then choose a month and what you’d like to see.',action:'Browse dive destinations',to:'explore?scope=world&tab=sites'};
 return {text:'I can point you to photo identification, marine life, dive destinations or your saved ideas. What would you like to explore?'};
}
export function OceanChat({onClose}:{onClose:()=>void}){
 const [input,setInput]=useState(''),[messages,setMessages]=useState<Message[]>([]);const end=useRef<HTMLDivElement>(null);
 useEffect(()=>{end.current?.scrollIntoView({block:'nearest'});},[messages]);
 const send=(value:string)=>{const clean=value.trim();if(!clean)return;setMessages(m=>[...m,{role:'user',text:clean},{role:'assistant',...respond(clean)}]);setInput('');};
 return <Modal label="Ocean assistant" onClose={onClose} motion><div className="c-dialog-heading"><div className="c-ocean-chat-title"><FishCompanion/><div><h2>Your ocean buddy</h2><small>AI assistant</small></div></div><DialogClose label="Close ocean assistant" onClose={onClose}/></div><div className="c-chat-log" role="log" aria-live="polite"><p className="c-chat-greeting">Where shall we start?</p>{messages.map((m,i)=><div key={i} className={'c-chat-message '+m.role}><p>{m.text}</p>{m.to&&<Go className="c-chat-action" to={m.to} onClick={onClose}>{m.action} →</Go>}</div>)}<div ref={end}/></div>{!messages.length&&<div className="c-chat-prompts">{['Identify a photo','Find marine life','Plan a dive'].map(prompt=><button key={prompt} onClick={()=>send(prompt)}>{prompt} <DiagonalArrow/></button>)}</div>}<form className="c-chat-form" onSubmit={e=>{e.preventDefault();send(input)}}><input aria-label="Message ocean assistant" placeholder="What’s on your mind?" value={input} onChange={e=>setInput(e.target.value)} maxLength={500}/><button disabled={!input.trim()} aria-label="Send message" type="submit">↑</button></form></Modal>;
}

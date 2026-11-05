import {useRef,useState} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {collectionIds,species} from './model';
import {Go} from './UI';
gsap.registerPlugin(useGSAP);
export function CollectionPolaroids({saved,compact=false}:{saved:number[];compact?:boolean}){
 const ids=collectionIds(saved),root=useRef<HTMLElement>(null),[index,setIndex]=useState(0),[direction,setDirection]=useState<1|-1|null>(null);
 const gesture=useRef<{x:number;y:number}|null>(null),suppressClick=useRef(false),busy=useRef(false);
 const current=index%ids.length,target=(current+(direction??1)+ids.length)%ids.length;
 const move=(step:1|-1)=>{if(busy.current||ids.length<2)return;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setIndex((current+step+ids.length)%ids.length);return;}busy.current=true;setDirection(step);};
 useGSAP(()=>{
  if(direction===null)return;
  const incoming=root.current!.querySelector('.c-polaroid-incoming'),front=root.current!.querySelector('.c-polaroid-front');
  gsap.timeline({onComplete:()=>{setIndex(target);setDirection(null);busy.current=false;}})
   .to(incoming,{x:direction*(compact?40:104),y:compact?-24:-48,rotation:direction*15,scale:1.025,duration:.23,ease:'power2.out'})
   .set(incoming,{zIndex:4})
   .to(front,{scale:.94,rotation:-direction*5,y:8,duration:.28,ease:'power2.inOut'},.23)
   .to(incoming,{x:0,y:0,rotation:-1,scale:1,duration:.32,ease:'back.out(1.15)'},.23);
 },{scope:root,dependencies:[direction],revertOnUpdate:true});
 const print=(id:number,front=false)=>{const s=species[id];return front?<Go className="c-polaroid-print" to={'species/'+id}><img draggable={false} src={s.photo} alt={s.name}/><span>{s.name}</span><small>{s.latin}</small></Go>:<div className="c-polaroid-print"><img draggable={false} src={s.photo} alt=""/><span>{s.name}</span><small>{s.latin}</small></div>;};
 return <section ref={root} className={"c-home-collection c-polaroid-collection"+(compact?" is-compact":"")} aria-label="Your collection"><Go to="collection" className="c-home-section-link">{compact?<span>Collection<small>{ids.length} species</small></span>:<>Your collection · {ids.length} species</>} <span>→</span></Go><div className="c-polaroid-stack" role="group" aria-label="Species photo stack" tabIndex={0} onDragStart={e=>e.preventDefault()} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}}} onPointerDown={e=>{gesture.current={x:e.clientX,y:e.clientY};suppressClick.current=false;}} onPointerCancel={()=>{gesture.current=null;}} onPointerUp={e=>{const start=gesture.current;gesture.current=null;if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy)){suppressClick.current=true;move(dx<0?1:-1);}}} onClickCapture={e=>{if(suppressClick.current||busy.current){e.preventDefault();e.stopPropagation();suppressClick.current=false;}}}>
 <div className="c-polaroid-layer c-polaroid-bottom" aria-hidden="true">{print(ids[(target+1)%ids.length])}</div>
 <div className="c-polaroid-layer c-polaroid-incoming" aria-hidden="true">{print(ids[target])}</div>
 <div className="c-polaroid-layer c-polaroid-front">{print(ids[current],true)}</div>
 </div><div className="c-polaroid-controls"><button aria-label="Previous species" disabled={direction!==null} onClick={()=>move(-1)}>←</button><span aria-live="polite">{current+1} / {ids.length}</span><button aria-label="Next species" disabled={direction!==null} onClick={()=>move(1)}>→</button></div></section>;
}

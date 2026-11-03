import {useEffect,useRef,useState} from 'react';
import {Go} from './UI';
import {areaContent} from './companionData';
import {recommendationIdeas} from './recommendationIdeas';
import {ideaKey,ideaRoute} from './savedIdeas';
import type {SavedIdea} from './savedIdeas';
function TrashIcon(){return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7M14 10v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function SavedIdeaRow({saved,onRemove,compact=false}:{compact?:boolean;saved:SavedIdea;onRemove:(idea:SavedIdea)=>void}){
 const area=areaContent[saved.areaKey as keyof typeof areaContent],idea=recommendationIdeas(area,saved.interest)[saved.index];
 const [menuOpen,setMenuOpen]=useState(false),menuRoot=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!menuOpen)return;const outside=(event:PointerEvent)=>{if(!menuRoot.current?.contains(event.target as Node))setMenuOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[menuOpen]);
 const [revealed,setRevealed]=useState(false),touch=useRef<{x:number;y:number}|null>(null);
 return <div className={'c-saved-row'+(revealed?' is-revealed':'')}>
  {revealed&&<button className="c-swipe-delete" onClick={()=>onRemove(saved)} aria-label={'Delete saved idea: '+idea.title.replace(/\n/g,' ')}><TrashIcon/>Delete</button>}
  <article className="c-saved-row-content" onTouchStart={e=>{if(compact)return;touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{const start=touch.current;touch.current=null;if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)setRevealed(dx<0);}} onTouchCancel={()=>{touch.current=null;}}>
   <div className="c-dream-photo"><Go className="c-dream-open" to={ideaRoute(saved)} aria-label={'Explore saved idea in '+area.short}><img src={idea.photo||area.dives[0].photo} alt={'Landscape in '+area.short}/><div className="c-dream-caption"><small>{new Date(2026,saved.month-1,1).toLocaleString('en-US',{month:'long'})}</small><h3>{area.short}</h3></div></Go><div className="c-dream-menu" ref={menuRoot} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setMenuOpen(false);}} onKeyDown={e=>{if(e.key==='Escape'){setMenuOpen(false);menuRoot.current?.querySelector('button')?.focus();}}}><button aria-label={'Options for '+area.short} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>···</button>{menuOpen&&<button className="c-dream-delete" onClick={()=>onRemove(saved)}><TrashIcon/>Delete saved idea</button>}</div></div>

  </article>
 </div>;
}
export function SavedIdeaPreview({ideas,onRemove}:{ideas:SavedIdea[];onRemove:(idea:SavedIdea)=>void}){
 const rail=useRef<HTMLDivElement>(null);
 return <section className="c-saved-preview" aria-label="Your saved ideas"><div className="c-saved-list-heading"><h2>Saved places</h2>{ideas.length>1&&<div className="c-plan-arrows"><button aria-label="Previous saved plans" onClick={()=>rail.current?.scrollBy({left:-220,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}>←</button><button aria-label="Next saved plans" onClick={()=>rail.current?.scrollBy({left:220,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}>→</button></div>}</div><div ref={rail} className={ideas.length>1?"c-plans-rail":"c-plan-single"} aria-label="Saved travel ideas">{[...ideas].reverse().map(idea=><SavedIdeaRow compact={ideas.length>1} key={ideaKey(idea)} saved={idea} onRemove={onRemove}/>)}</div></section>;
}

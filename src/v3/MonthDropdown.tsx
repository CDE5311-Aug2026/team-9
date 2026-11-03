import {useEffect,useId,useRef,useState} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';

gsap.registerPlugin(useGSAP);
export function MonthDropdown({options,value,onChange}:{options:string[];value:string;onChange:(value:string)=>void}){
 const [open,setOpen]=useState(false),[above,setAbove]=useState(false);
 const root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null),menu=useRef<HTMLDivElement>(null),id=useId();
 const selected=Math.max(0,options.indexOf(value));
 const close=()=>{setOpen(false);trigger.current?.focus({preventScroll:true});};
 const show=()=>{const box=trigger.current?.getBoundingClientRect(),bounds=document.getElementById('v3-main')?.getBoundingClientRect();setAbove(!!box&&!!bounds&&bounds.bottom-box.bottom<220&&box.top-bounds.top>220);setOpen(true);};
 useGSAP(()=>{gsap.to(menu.current,{autoAlpha:open?1:0,y:open?0:above?5:-5,duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:open?.2:.14,ease:'power2.out',overwrite:true,onComplete:()=>{if(open)menu.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus({preventScroll:true});}});},{scope:root,dependencies:[open,above]});
 useEffect(()=>{if(!open)return;const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[open]);
 return <div className="c-month-dropdown" ref={root} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}} onKeyDown={e=>{if(e.key==='Escape'&&open){e.preventDefault();close();}}}>
  <button ref={trigger} className="c-month-trigger" aria-label={'Travel month: '+value} aria-haspopup="listbox" aria-controls={id} aria-expanded={open} onClick={()=>open?close():show()} onKeyDown={e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();show();}}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/><path d="M8 3v4m8-4v4M4 11h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg><span>{value}</span><svg className="c-chevron" width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
  <div ref={menu} id={id} className={'c-month-menu'+(above?' opens-up':'')} inert={!open} aria-hidden={!open}><small>Choose a month</small><div role="listbox" aria-label="Travel month" onKeyDown={e=>{const buttons=Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]'));const index=buttons.indexOf(document.activeElement as HTMLButtonElement);const offset={ArrowRight:1,ArrowLeft:-1,ArrowDown:3,ArrowUp:-3}[e.key];if(offset!==undefined||e.key==='Home'||e.key==='End'){e.preventDefault();buttons[e.key==='Home'?0:e.key==='End'?11:(index+(offset??0)+12)%12]?.focus();}}}>{options.map((month,index)=><button key={month} role="option" aria-selected={value===month} tabIndex={index===selected?0:-1} onClick={()=>{onChange(month);close();}}>{month}</button>)}</div></div>
 </div>;
}

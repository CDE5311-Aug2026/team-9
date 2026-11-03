import {useEffect} from 'react';
import type {RefObject} from 'react';
import gsap from 'gsap';
const visited=new Set<string>();
export function useDetailReveal(root:RefObject<HTMLElement|null>,route:string,enabled:boolean){
 useEffect(()=>{
  const scroller=root.current;
  if(!enabled||!scroller||visited.has(route))return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const pending=new Set<HTMLElement>();
  const ctx=gsap.context(()=>{},scroller);
  let frame=0;
  const show=(el:HTMLElement)=>{pending.delete(el);ctx.add(()=>gsap.fromTo(el,{opacity:.35,y:10},{opacity:1,y:0,duration:.38,ease:'power2.out',clearProps:'opacity,transform'}));};
  const check=()=>{frame=0;const bounds=scroller.getBoundingClientRect();pending.forEach(el=>{const box=el.getBoundingClientRect();if(box.top<bounds.bottom-16&&box.bottom>bounds.top)show(el);});};
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(check);};
  const focus=(event:FocusEvent)=>{pending.forEach(el=>{if(el.contains(event.target as Node))show(el);});};
  const reduce=()=>{if(preference.matches){pending.clear();ctx.revert();}};
  const setup=requestAnimationFrame(()=>{visited.add(route);if(preference.matches)return;const bottom=scroller.getBoundingClientRect().bottom;scroller.querySelectorAll<HTMLElement>('.c-card,.v-panel,.o-knowledge,.c-species-fact,.c-species-observations').forEach(el=>{if(el.getBoundingClientRect().top>=bottom&&!el.parentElement?.closest('.c-card,.v-panel,.o-knowledge'))pending.add(el);});});
  scroller.addEventListener('scroll',scroll,{passive:true});scroller.addEventListener('focusin',focus);preference.addEventListener('change',reduce);
  return()=>{cancelAnimationFrame(setup);cancelAnimationFrame(frame);scroller.removeEventListener('scroll',scroll);scroller.removeEventListener('focusin',focus);preference.removeEventListener('change',reduce);ctx.revert();};
 },[root,route,enabled]);
}

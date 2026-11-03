import {useEffect,useRef} from 'react';

const ROW=32, CYCLES=9, MIDDLE=4;
export function RecommendationWheel({label,options,value,onChange}:{label:string;options:readonly string[];value:string;onChange:(value:string)=>void}){
  const root=useRef<HTMLDivElement>(null),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  const selected=Math.max(0,options.indexOf(value)),count=options.length;
  const wrap=(index:number)=>(index%count+count)%count;
  useEffect(()=>{const el=root.current;if(el)el.scrollTop=(MIDDLE*count+selected)*ROW;},[selected,count]);
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  const choose=(index:number)=>{root.current?.scrollTo({top:index*ROW,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
  return <div className="c-wheel-field"><span>{label}</span><div className="c-wheel-frame"><div className="c-wheel" ref={root} role="spinbutton" tabIndex={0} aria-label={label} aria-valuemin={1} aria-valuemax={count} aria-valuenow={selected+1} aria-valuetext={value} onScroll={()=>{
    clearTimeout(timer.current);timer.current=setTimeout(()=>{const el=root.current;if(!el)return;const index=wrap(Math.round(el.scrollTop/ROW));
      // Recenter on an identical copy after scrolling settles, so neither end is exposed.
      const center=(MIDDLE*count+index)*ROW;if(Math.abs(el.scrollTop-center)>1)el.scrollTop=center;
      if(options[index]!==value)onChange(options[index]);
    },180);
  }} onKeyDown={e=>{if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();const current=Math.round((root.current?.scrollTop??0)/ROW);const next=e.key==='Home'?MIDDLE*count:e.key==='End'?MIDDLE*count+count-1:current+(e.key==='ArrowDown'?1:-1);choose(next);}}>{Array.from({length:count*CYCLES},(_,index)=><button type="button" key={index} tabIndex={-1} aria-hidden="true" data-selected={wrap(index)===selected} onMouseDown={e=>e.preventDefault()} onClick={()=>{root.current?.focus({preventScroll:true});choose(index);}}>{options[wrap(index)]}</button>)}</div></div></div>;
}

import {useLayoutEffect,useRef,useState} from 'react';
export const tourPages=['home','collection','explore','profile'];
const steps=[
 {title:'Home',targets:['.c-home-heading','.c-identify','.c-photo-card'],items:[['Identify a sighting','Add a photo or video for AI identification.'],['Choose your dive stage','Use the suggested stage, or change it yourself.'],['Revisit your ocean stories','Tap a photo to open a past encounter.']]},
 {title:'Collection',targets:['.o-milestone','.v-segment','.v-review','.o-category-toggle'],items:[['Browse your collection','Switch between Map, Timeline and Category.'],['Review uncertain matches','Check results before saving them.'],['Learn about a species','Open a species for facts, sightings and AI Q&A.']]},
 {title:'Explore',targets:['.c-area-trigger','.c-tabs','.c-area-map'],items:[['Choose an area','Browse a dive destination of your choice.'],['Explore the map','Browse dive sites, marine life and experiences.'],['Find ways to take part','Open Experiences for studies and beach cleanups.']]},
 {title:'Profile',targets:['.o-stats','.o-profile .v-row a'],items:[['See your progress','Track species, encounters and quiz answers.'],['Discover your milestones','Find your badges and next achievement.'],['Manage your preferences','Open settings for privacy, account and help.']]}
];
type Hole={x:number;y:number;width:number;height:number};
export function Tour({step,onNext,onClose}:{step:number;onNext:()=>void;onClose:()=>void}){
 const overlay=useRef<HTMLDivElement>(null),card=useRef<HTMLDivElement>(null);
 const [layout,setLayout]=useState<{holes:Hole[];top:number;arrow:number}>({holes:[],top:170,arrow:0});
 useLayoutEffect(()=>{
  const root=overlay.current!.parentElement!,panel=card.current!,previous=document.activeElement as HTMLElement|null;
  const surfaces=Array.from(root.children).filter(el=>el!==overlay.current) as HTMLElement[];
  surfaces.forEach(el=>el.inert=true);
  const measure=()=>{
   const bounds=root.getBoundingClientRect();
   const selectors=[...steps[step].targets,`.v-nav a[href="#/v3/${tourPages[step]}"]`];
   const holes=selectors.flatMap(selector=>{const el=root.querySelector(selector);if(!el)return [];const r=el.getBoundingClientRect();return [{x:Math.max(0,r.left-bounds.left-4),y:Math.max(0,r.top-bounds.top-4),width:r.width+8,height:selector==='.o-map'?Math.min(r.height+8,110):r.height+8}]}).filter(r=>r.y<bounds.height);
   const preferred=step===0?165:step===1?390:step===2?440:350;
   const top=Math.max(64,Math.min(preferred,bounds.height-panel.offsetHeight-110));
   setLayout({holes,top,arrow:step===0?top+panel.offsetHeight+6:top-30});
  };
  measure();const observer=new ResizeObserver(measure);observer.observe(root);observer.observe(panel);
  panel.querySelector<HTMLButtonElement>('button')?.focus({preventScroll:true});
  const keydown=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();onClose()}
   if(event.key==='Tab'){const buttons=Array.from(panel.querySelectorAll<HTMLButtonElement>('button'));const first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
  };
  document.addEventListener('keydown',keydown);
  return()=>{observer.disconnect();surfaces.forEach(el=>el.inert=false);document.removeEventListener('keydown',keydown);previous?.focus({preventScroll:true})};
 },[step,onClose]);
 return <div className="o-tour" ref={overlay} role="dialog" aria-modal="true" aria-labelledby="tour-title"><svg className="o-tour-mask" width="100%" height="100%" aria-hidden="true"><defs><mask id="tour-cutouts"><rect width="100%" height="100%" fill="white"/>{layout.holes.map((r,i)=><rect key={i} {...r} rx="12" fill="black"/>)}</mask></defs><rect width="100%" height="100%" fill="#081219" fillOpacity=".72" mask="url(#tour-cutouts)"/></svg><div className="o-tour-arrow" style={{top:layout.arrow}} aria-hidden="true">{step===0?'↓':'↑'}</div><div ref={card} className="o-tour-card" style={{top:layout.top}}><header><h2 id="tour-title">{steps[step].title}</h2><small>{step+1} / 4</small></header><ol>{steps[step].items.map(([title,body])=><li key={title}><div><strong>{title}</strong><p>{body}</p></div></li>)}</ol><footer><button onClick={onClose}>Skip</button><button className="v-button" onClick={onNext}>{step===3?'Got it':'Next →'}</button></footer></div></div>
}

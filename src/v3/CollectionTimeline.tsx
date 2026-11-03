import {useEffect,useRef,useState} from 'react';
import {Go} from './UI';
import {species} from './model';
import {collectionTrips} from './collectionTrips';
export function CollectionTimeline({saved}:{saved:number[]}){
 const trips=collectionTrips(saved),[active,setActive]=useState(trips[0].id),root=useRef<HTMLDivElement>(null);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);if(visible[0])setActive(visible[0].target.id.replace('trip-',''));},{root:document.getElementById('v3-main'),rootMargin:'-5% 0px -50% 0px',threshold:0});root.current?.querySelectorAll('section').forEach(el=>observer.observe(el));return()=>observer.disconnect();},[]);
 return <div className="c-trip-layout" ref={root}><nav aria-label="Jump to trip" className="c-trip-rail">{trips.map(t=><button key={t.id} aria-label={t.month+' · '+t.name} aria-current={active===t.id?'location':undefined} onClick={()=>{setActive(t.id);document.getElementById('trip-'+t.id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}}><i aria-hidden="true"/><span>{t.month.split(' ')[0]}<br/>{t.month.split(' ').slice(1).join(' ')}</span></button>)}</nav><div className="c-trips">{trips.map(t=><section tabIndex={-1} id={'trip-'+t.id} key={t.id} className="c-trip"><small>{t.dates}</small><h2>{t.name}</h2><p>{t.ids.length} observations · {t.ids.length} species</p><div className="o-species-grid">{t.ids.map(id=><Go key={id} to={'species/'+id+'?trip='+t.id}><img src={species[id].photo} alt=""/><p>{species[id].name}</p></Go>)}</div></section>)}</div></div>;
}

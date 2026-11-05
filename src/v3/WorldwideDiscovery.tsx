import {Go} from './UI';
import {ExploreArrow} from './ExploreArrow';
import {species,collectionIds} from './model';
import {worldDestinations} from './worldDestinations';
import type {WorldDestination} from './worldDestinations';

// Destination associations, not live sightings or a popularity ranking.
const marineHighlights=[
 {region:'maldives',id:5,place:'South Ari Atoll'},
 {region:'raja',id:2,place:'Dampier Strait'},
 {region:'amed',id:0,place:'Amed reefs'},
 {region:'koh-tao',id:1,place:'Koh Tao'},
];
const experiences=[
 {region:'coron',title:'Explore historic shipwrecks',kind:'Wreck diving',photo:'/v3/destinations/coron.jpg'},
 {region:'koh-tao',title:'Your first reef dive',kind:'Learn to dive',photo:'/v3/destinations/koh-tao.jpg'},
 {region:'raja',title:'Photograph the islands',kind:'Photography',photo:'/v3/destinations/raja-lagoon.jpg',to:'learn/photo'},
 {region:'raja',title:'Manta photo study',kind:'Studies',photo:species[2].photo,to:'experience/raja/study?item=reef'},
 {region:'amed',title:'Amed shoreline cleanup',kind:'Beach cleanups',photo:'/v3/destinations/amed-coast-user.png',to:'experience/amed/cleanup?item=shore'},
];
export function WorldwideDiscovery({tab,regions,saved,onSelect}:{tab:'marine'|'experiences';regions:WorldDestination[];saved:number[];onSelect:(area:WorldDestination)=>void}){
 const keys=new Set(regions.map(area=>area.key)),collected=new Set(collectionIds(saved));
 const items=tab==='marine'?marineHighlights.filter(item=>keys.has(item.region)):experiences.filter(item=>keys.has(item.region));
 return <section className="c-world-discovery" aria-label={tab==='marine'?'Marine life around the world':'Featured worldwide experiences'}><h2>{tab==='marine'?'Worth travelling for':'Experiences to discover'}</h2><div className="c-world-discovery-list">{tab==='marine'?marineHighlights.filter(item=>keys.has(item.region)).map(item=>{const animal=species[item.id],area=worldDestinations.find(d=>d.key===item.region)!;return <article className="c-world-feature" key={item.region}><Go to={'guide/'+item.id} aria-label={'Discover '+animal.name}><div className="c-world-feature-photo"><img src={animal.photo} alt={animal.name} loading="lazy"/>{collected.has(item.id)&&<span className="c-collected-label">✓ Collected</span>}</div><div className="c-world-feature-copy"><small>{area.name} · {item.place}</small><div><h3>{animal.name}</h3><ExploreArrow/></div></div></Go><button className="c-world-place-link" onClick={()=>onSelect(area)}>Explore {area.name}<ExploreArrow/></button></article>}):experiences.filter(item=>keys.has(item.region)).map(item=>{const area=worldDestinations.find(d=>d.key===item.region)!;const content=<><img src={item.photo} alt="" loading="lazy"/><div className="c-world-feature-copy"><small>{area.name} · {item.kind}</small><div><h3>{item.title}</h3><ExploreArrow/></div></div></>;return <article className="c-world-feature" key={item.title}>{item.to?<Go to={item.to}>{content}</Go>:<button className="c-world-experience-open" onClick={()=>onSelect(area)}>{content}</button>}</article>})}</div>{!items.length&&<p>No matches here yet. Try another region.</p>}</section>;
}

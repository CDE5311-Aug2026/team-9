import {SaveSpecies,WishlistButton} from './MarineWishlist';
import {useSearchParams} from 'react-router-dom';
import {AIIcon} from './AIIcon';
import {Back,Go} from './UI';
import {species,collectionIds} from './model';
import {marineCategories,marineTopics,experienceItems} from './discoveryContent';
import type {AreaContent} from './companionData';
export function MarineDiscovery({area,saved}:{area:AreaContent;saved:number[]}){
 const [params,setParams]=useSearchParams();const selected=params.get('life')??'All';
 const category=marineCategories.includes(selected as typeof marineCategories[number])?selected:'All';
 const available=[...new Set([...area.marine,8,9,10,11])];
 const collected=new Set(collectionIds(saved));
 const ids=available.filter(id=>category==='All'||species[id]?.category===category);
 return <section className="c-discovery-section"><div className="c-wishlist-heading"><h2>Marine life in {area.short}</h2><WishlistButton/></div><div className="c-filter-chips" role="group" aria-label="Marine life categories">{marineCategories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>{const next=new URLSearchParams(params);next.set('tab','marine');next.set('life',c);setParams(next,{replace:true});}}>{c}</button>)}</div><div className="c-marine-feed">{ids.map(id=><article className="c-marine-tile" key={id}><Go to={'guide/'+id}><div><img src={species[id].photo} alt="" loading="lazy"/>{collected.has(id)&&<span className="c-collected-label">✓ Collected</span>}</div><h3>{species[id].name}</h3></Go><SaveSpecies id={id}/></article>)}</div></section>;
}
export function MarineTopic({topic}:{topic:string}){const item=marineTopics.find(t=>t.key===topic)??marineTopics[0];return <><Back to="explore?tab=marine" label="Marine life"/><img className="v-hero" src={item.photo} alt={item.alt}/><small>{item.category}</small><h1>{item.title}</h1><p>{item.body}</p><section className="c-card"><h2>Start with curiosity</h2>{item.prompts.map(p=><p key={p}>{p}</p>)}</section><Go className="c-primary" to="identify">Identify what you spotted</Go><Go className="c-secondary" to="learn/photo">Photography tips</Go></>;}
export function ExperienceDiscovery({area}:{area:AreaContent}){
 const [params,setParams]=useSearchParams();const selected=params.get('activity')??'all';
 const items=experienceItems(area);const showAll=params.get('view')==='all';
 const filtered=items.filter(i=>selected==='all'||i.kind===selected);
 return <section className="c-discovery-section"><h2>Be part of the ocean</h2><div className="c-filter-chips" role="group" aria-label="Experience types">{[['all','All'],['study','Studies'],['cleanup','Beach cleanups']].map(([key,label])=><button key={key} aria-pressed={selected===key} onClick={()=>setParams({tab:'experiences',activity:key},{replace:true})}>{label}</button>)}</div>{['study','cleanup'].filter(kind=>selected==='all'||selected===kind).map(kind=><section className="c-discovery-section" key={kind}><div className="c-rail-heading"><h3>{kind==='study'?'Studies':'Beach cleanups'} <small>{items.filter(i=>i.kind===kind).length}</small></h3><button onClick={()=>setParams({tab:'experiences',activity:kind,...(!showAll?{view:'all'}:{})},{replace:true})}>{showAll?'Show less':'See all'} →</button></div><div className={showAll?'c-activity-list':'c-activity-rail'}>{filtered.filter(i=>i.kind===kind).map(item=><Go className="c-activity-card" key={item.id} to={'experience/'+area.key+'/'+item.kind+'?item='+item.id}><img src={item.photo} alt=""/><div><small>{area.short} · {kind==='study'?'Contribute photos':'On land'}</small><h3>{item.title}</h3><p>{item.summary}</p><span>View {kind==='study'?'study':'activity'} →</span></div></Go>)}</div></section>)}<Go to="learn/photo" className="c-photo-learning"><AIIcon/><div><h2>Through your lens</h2><small>Photography tips & camera setup →</small></div></Go></section>;
}

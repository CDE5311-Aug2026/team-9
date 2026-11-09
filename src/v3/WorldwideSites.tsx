import {DialogClose} from './DialogClose';
import {InterestSummary} from './InterestSummary';
import {useEffect,useRef,useState} from 'react';
import {usePhoneMapDialog} from './usePhoneMapDialog';
import {useSearchParams} from 'react-router-dom';
import L from 'leaflet';
import {areaContent,defaultPreferences,seasonalRecommendation} from './companionData';
import type {AreaContent} from './companionData';
import {MonthDropdown} from './MonthDropdown';
import {InterestPicker} from './InterestPicker';
import {selectedInterests,interestCategory} from './exploreInterests';
import {browsingInterests} from './recommendationIdeas';
import {WorldwideDiscovery} from './WorldwideDiscovery';
import {ExploreArrow} from './ExploreArrow';
import {Modal} from './CompanionUI';
import {worldDestinations} from './worldDestinations';
import type {WorldDestination} from './worldDestinations';
type RegionView={center:L.LatLng;zoom:number};
function RegionCanvas({onSelect,view}:{onSelect:(area:WorldDestination)=>void;view:React.RefObject<RegionView|null>}){
 const root=useRef<HTMLDivElement>(null),select=useRef(onSelect);select.current=onSelect;
 useEffect(()=>{if(!root.current)return;const map=L.map(root.current,{scrollWheelZoom:false});if(view.current)map.setView(view.current.center,view.current.zoom);else map.fitBounds(worldDestinations.map(d=>[d.latitude,d.longitude] as [number,number]),{padding:[70,40],maxZoom:4});L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:18}).addTo(map);
 worldDestinations.forEach(area=>{const name=area.name;const label=document.createElement('span');label.className='c-map-label';label.textContent=name;L.marker([area.latitude,area.longitude],{title:name,alt:name,icon:L.divIcon({html:label,className:'c-live-marker',iconSize:[118,32],iconAnchor:[59,16]})}).on('click',()=>select.current(area)).addTo(map)});
 const resize=new ResizeObserver(()=>map.invalidateSize({pan:false}));resize.observe(root.current);return()=>{resize.disconnect();view.current={center:map.getCenter(),zoom:map.getZoom()};map.remove()};},[view]);
 return <div className="c-world-region-map" ref={root} aria-label="Map of destination regions"/>;
}
function RegionMap({onSelect}:{onSelect:(area:WorldDestination)=>void}){
 const [expanded,setExpanded]=useState(false),dialog=useRef<HTMLDialogElement>(null),view=useRef<RegionView|null>(null);
 usePhoneMapDialog(dialog,expanded);
 const canvas=<RegionCanvas view={view} onSelect={onSelect}/>;
 return <div className="c-world-map-preview">
  {!expanded&&canvas}
  <button type="button" className="c-map-expand" aria-label="Expand map" aria-haspopup="dialog" onClick={()=>setExpanded(true)}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
  {expanded&&<dialog ref={dialog} className="c-map-fullscreen" aria-label="Worldwide map" onCancel={e=>{e.preventDefault();setExpanded(false)}}><header><h2>Worldwide</h2><DialogClose label="Collapse map" onClose={()=>setExpanded(false)} showText/></header><div className="c-map-full-body">{canvas}</div></dialog>}
 </div>;
}
export function WorldwideSites({onSelect,topics=[],tab='sites',saved=[]}:{tab?:'sites'|'marine'|'experiences';saved?:number[];topics?:string[];onSelect:(area:AreaContent)=>void}){
 const [preview,setPreview]=useState<WorldDestination|null>(null);
 const select=(destination:WorldDestination)=>setPreview(destination);
 const [params,setParams]=useSearchParams(),[editing,setEditing]=useState(false),[query,setQuery]=useState('');
 const rawMonth=Number(params.get('month')),month=Number.isInteger(rawMonth)&&rawMonth>=1&&rawMonth<=12?rawMonth:new Date().getMonth()+1;
 const months=Array.from({length:12},(_,i)=>new Date(2026,i,1).toLocaleString('en-US',{month:'long'}));
 const interests=selectedInterests(params,topics);
 const apply=(values:string[])=>{const next=new URLSearchParams(params);next.set('interestsEdited','1');next.delete('interest');values.forEach(value=>next.append('interest',value));setParams(next,{replace:true})};
 const supported=interests.filter(interest=>browsingInterests.some(category=>category===interestCategory(interest))),unmatched=interests.filter(interest=>!supported.includes(interest));
 const matches=(interests.length&&!supported.length?[]:worldDestinations).filter(area=>(area.name+' '+area.country).toLowerCase().includes(query.trim().toLowerCase())).map(area=>({area,rank:area.key==='amed'||area.key==='raja'?Number(seasonalRecommendation(area.key,defaultPreferences,new Date(2026,month-1,15)).inSeason):0})).sort((a,b)=>b.rank-a.rank);
 return <section className="c-worldwide"><RegionMap onSelect={select}/><div className="c-explore-preferences"><MonthDropdown options={months} value={months[month-1]} onChange={value=>{const next=new URLSearchParams(params);next.set('month',String(months.indexOf(value)+1));setParams(next,{replace:true})}}/><InterestSummary interests={interests} open={editing} onEdit={()=>setEditing(true)}/></div><input className="v-input" aria-label="Search destination regions" placeholder="Search a country or region" value={query} onChange={e=>setQuery(e.target.value)} maxLength={100}/>{unmatched.length>0&&<p>No matching destination ideas for {unmatched.join(', ')} yet. <button className="c-world-edit" onClick={()=>setEditing(true)}>Edit interests</button></p>}{tab==='sites'?<div className="c-worldwide-feed">{matches.map(({area})=><article className="c-worldwide-place" key={area.key}><img src={area.photo} alt={'Landscape in '+area.name} loading="lazy"/><div><h3>{area.name}</h3><button onClick={()=>select(area)} aria-label={'Explore '+area.name}>Explore <ExploreArrow/></button></div></article>)}</div>:<WorldwideDiscovery tab={tab} regions={matches.map(item=>item.area)} saved={saved} onSelect={select}/>}{!matches.length&&<button className="c-secondary" onClick={()=>{setQuery('');apply([])}}>Show all destinations</button>}{preview&&<Modal label={preview.name} onClose={()=>setPreview(null)} motion><div className="c-region-preview"><div className="c-dialog-heading"><h2>{preview.name}</h2><DialogClose label="Close destination details" onClose={()=>setPreview(null)}/></div><img src={preview.photo} alt={preview.name}/><small>{preview.country}</small><p>{preview.description}</p><h3>Places to explore</h3><ul>{preview.highlights?.map((item,i)=><li key={item}>{(preview.key==='amed'||preview.key==='raja')&&<img src={areaContent[preview.key].dives[i].photo} alt=""/>}<span>{item}</span></li>)}</ul>{preview.key==='amed'||preview.key==='raja'?<button className="c-region-continue" onClick={()=>{const key=preview.key;if(key==='amed'||key==='raja'){setPreview(null);onSelect(areaContent[key]);}}}>Explore this area <ExploreArrow/></button>:<a href={preview.source} target="_blank" rel="noreferrer">Destination guide <ExploreArrow/></a>}</div></Modal>}{editing&&<InterestPicker values={interests} onApply={apply} onClose={()=>setEditing(false)}/>}</section>;
}

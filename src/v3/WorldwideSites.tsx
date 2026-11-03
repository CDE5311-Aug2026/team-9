import {useEffect,useRef,useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import L from 'leaflet';
import {areaContent,defaultPreferences,seasonalRecommendation} from './companionData';
import type {AreaContent} from './companionData';
import {MonthDropdown} from './MonthDropdown';
import {InterestPicker} from './InterestPicker';
import {selectedInterests,interestCategory} from './exploreInterests';
import {browsingInterests} from './recommendationIdeas';
import {AIIcon} from './AIIcon';
function RegionMap({onSelect}:{onSelect:(area:AreaContent)=>void}){
 const root=useRef<HTMLDivElement>(null),select=useRef(onSelect);select.current=onSelect;
 useEffect(()=>{if(!root.current)return;const map=L.map(root.current,{scrollWheelZoom:false}).fitBounds([[-8.4,115.1],[-.4,130.8]],{padding:[70,40],maxZoom:4});L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:18}).addTo(map);
 Object.values(areaContent).forEach(area=>{const name=area.key==='amed'?'Bali':'Raja Ampat';const label=document.createElement('span');label.className='c-map-label';label.textContent=name;L.marker(area.key==='amed'?[-8.4,115.1]:[-.4,130.8],{title:name,alt:name,icon:L.divIcon({html:label,className:'c-live-marker',iconSize:[118,32],iconAnchor:[59,16]})}).on('click',()=>select.current(area)).addTo(map)});
 const resize=new ResizeObserver(()=>map.invalidateSize({pan:false}));resize.observe(root.current);return()=>{resize.disconnect();map.remove()};},[]);
 return <div className="c-world-region-map" ref={root} aria-label="Map of destination regions"/>;
}
export function WorldwideSites({onSelect}:{onSelect:(area:AreaContent)=>void}){
 const [params,setParams]=useSearchParams(),[editing,setEditing]=useState(false),[query,setQuery]=useState('');
 const rawMonth=Number(params.get('month')),month=Number.isInteger(rawMonth)&&rawMonth>=1&&rawMonth<=12?rawMonth:new Date().getMonth()+1;
 const months=Array.from({length:12},(_,i)=>new Date(2026,i,1).toLocaleString('en-US',{month:'long'}));
 const interests=selectedInterests(params);
 const apply=(values:string[])=>{const next=new URLSearchParams(params);next.delete('interest');values.forEach(value=>next.append('interest',value));setParams(next,{replace:true})};
 const supported=interests.filter(interest=>browsingInterests.some(category=>category===interestCategory(interest))),unmatched=interests.filter(interest=>!supported.includes(interest));
 const matches=(interests.length&&!supported.length?[]:Object.values(areaContent)).filter(area=>(area.region+' '+area.label).toLowerCase().includes(query.trim().toLowerCase())).map(area=>({area,season:seasonalRecommendation(area.key,defaultPreferences,new Date(2026,month-1,15))})).sort((a,b)=>Number(b.season.inSeason)-Number(a.season.inSeason));
 return <section className="c-worldwide"><RegionMap onSelect={onSelect}/><div className="c-explore-preferences"><MonthDropdown options={months} value={months[month-1]} onChange={value=>{const next=new URLSearchParams(params);next.set('month',String(months.indexOf(value)+1));setParams(next,{replace:true})}}/><div className="c-interest-controls"><button className="c-interest-trigger" aria-haspopup="dialog" aria-expanded={editing} onClick={()=>setEditing(true)}><AIIcon/><span>{interests.length?'Your interests':'What would you love to see?'}</span><span aria-hidden="true">＋</span></button><div className="c-interest-tags">{interests.map(value=><button key={value} aria-label={'Remove '+value} onClick={()=>apply(interests.filter(v=>v!==value))}>{value}<span aria-hidden="true">×</span></button>)}</div></div></div><input className="v-input" aria-label="Search destination regions" placeholder="Search a country or region" value={query} onChange={e=>setQuery(e.target.value)} maxLength={100}/>{unmatched.length>0&&<p>No matching destination ideas for {unmatched.join(', ')} yet. <button className="c-world-edit" onClick={()=>setEditing(true)}>Edit interests</button></p>}<div className="c-worldwide-feed">{matches.map(({area,season})=><article className="c-worldwide-place" key={area.key}><img src={area.dives[0].photo} alt={'Landscape in '+area.region}/><div><small>{months[month-1]} · {season.inSeason?'In season':'Best '+season.season}{supported.length?' · '+supported.join(' + '):''}</small><h3>{area.key==='amed'?'Bali':'Raja Ampat'}</h3><p>{area.key==='amed'?'Black-sand beaches · fishing villages':'Karst islands · lagoons · coral reefs'}</p><button onClick={()=>onSelect(area)}>Explore {area.key==='amed'?'Bali':'Raja Ampat'} <span aria-hidden="true">→</span></button></div></article>)}</div>{!matches.length&&<button className="c-secondary" onClick={()=>{setQuery('');apply([])}}>Show all destinations</button>}{editing&&<InterestPicker values={interests} onApply={apply} onClose={()=>setEditing(false)}/>}</section>;
}

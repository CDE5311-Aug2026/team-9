import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {marineNames, marinePhotos} from './companionData';
import type {AreaContent} from './companionData';
import {collectionIds} from './model';

type Place = {name:string; point:[number,number]};
// Approximate overview positions, not entry points or navigation instructions.
export const places:Record<string,Place[]> = {
 amed:[{name:'Jemeluk Bay',point:[-8.337,115.660]},{name:'Lipah Bay',point:[-8.347,115.682]},{name:'Japanese Wreck',point:[-8.363,115.711]},{name:'USAT Liberty',point:[-8.274,115.593]}],
 raja:[{name:'Cape Kri',point:[-0.555,130.690]},{name:'Sardine Reef',point:[-0.542,130.730]},{name:'Blue Magic',point:[-0.500,130.710]}],
};
type View={center:L.LatLng;zoom:number};
function MapCanvas({area,tab,saved,view,onView,onNavigate}:{area:AreaContent;tab:number;saved:number[];view:React.RefObject<View|null>;onView:(v:View)=>void;onNavigate:(path:string)=>void}) {
 const root=useRef<HTMLDivElement>(null);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  if(!root.current)return;
  const sites=places[area.key], collected=new Set(collectionIds(saved));
  const map=L.map(root.current,{scrollWheelZoom:false,zoomControl:true,zoomAnimation:false,fadeAnimation:false,markerZoomAnimation:false});
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
  tiles.on('tileerror',()=>setFailed(true));tiles.on('tileload',()=>setFailed(false));
  if(view.current)map.setView(view.current.center,view.current.zoom);else map.fitBounds(L.latLngBounds((tab===2?sites.slice(0,3):sites).map(s=>s.point)),{padding:[58,45],maxZoom:13});
  let markerIndex=0;
  const add=(point:L.LatLngExpression,element:HTMLElement,label:string,action:()=>void)=>{
   const offset=tab===1?(markerIndex%2===0?-26:26):tab===0?(markerIndex%3-1)*36:0;markerIndex++;
   const marker=L.marker(point,{icon:L.divIcon({html:element,className:'c-live-marker',iconSize:tab===1?[58,72]:[118,32],iconAnchor:tab===1?[29,36+offset]:[59,16+offset]}),title:label,alt:label,keyboard:true}).addTo(map);
   marker.on('click',action);
  };
  if(tab===1){
   area.marine.forEach((id,index)=>{
    const site=sites[index%sites.length];const el=document.createElement('div');el.className='c-map-creature'+(collected.has(id)?' collected':'');
    const img=document.createElement('img');img.src=marinePhotos[id];img.alt='';img.style.width='48px';img.style.height='48px';el.append(img);
    const name=document.createElement('span');name.textContent=marineNames[id];el.append(name);
    add([site.point[0]+(Math.floor(index/sites.length)*.008),site.point[1]+(Math.floor(index/sites.length)*.008)],el,marineNames[id],()=>onNavigate('guide/'+id));
   });
  }else if(tab===2){
   ['Study','Beach cleanup','Photography'].forEach((name,index)=>{const el=document.createElement('span');el.className='c-map-label'+(index===1?' orange':'');el.textContent=name;add(sites[index].point,el,name,()=>onNavigate(index===2?'learn/photo':'experience/'+area.key+'/'+(index===0?'study':'cleanup')));});
  }else{
   sites.forEach(site=>{const el=document.createElement('span');el.className='c-map-label';el.textContent=site.name;add(site.point,el,site.name,()=>{
    const content=document.createElement('div');content.className='c-site-popup';const title=document.createElement('strong');title.textContent=site.name;content.append(title);
    const button=document.createElement('button');button.setAttribute('aria-label','Explore '+site.name);const label=document.createElement('span');label.textContent='Explore';const arrow=document.createElement('span');arrow.textContent='→';arrow.setAttribute('aria-hidden','true');button.append(label,arrow);button.onclick=()=>onNavigate('destination/'+area.key);content.append(button);
    L.popup().setLatLng(site.point).setContent(content).openOn(map);
   });});
  }
  const remember=()=>onView({center:map.getCenter(),zoom:map.getZoom()});map.on('moveend',remember);
  const resize=new ResizeObserver(()=>map.invalidateSize({pan:false}));resize.observe(root.current);
  return()=>{resize.disconnect();map.stop();map.remove();};
 // Callbacks and view are stable for this mounted map; remount for area/tab changes.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 return <><div className="c-live-map" ref={root} aria-label={'Interactive map of '+area.short}/>{failed&&<p className="c-map-error" role="status">Map tiles unavailable. Check your connection.</p>}</>;
}
export function ExploreMap({area,tab,saved}:{area:AreaContent;tab:number;saved:number[]}){
 const [expanded,setExpanded]=useState(false);const dialog=useRef<HTMLDialogElement>(null), view=useRef<View|null>(null);
 const navigate=useNavigate(),location=useLocation();
 const onNavigate=(path:string)=>navigate('/v3/'+path,{state:{from:location.pathname+location.search}});
 const onView=(next:View)=>{view.current=next;};
 useEffect(()=>{if(expanded)dialog.current?.showModal();},[expanded]);
 return <section className="c-explore-map-wrap">
  <div className="c-live-map-preview">{!expanded&&<MapCanvas area={area} tab={tab} saved={saved} view={view} onView={onView} onNavigate={onNavigate}/>}<button className="c-map-expand" onClick={()=>setExpanded(true)} aria-label="Expand map" title="Expand map"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></button></div>
  {expanded&&<dialog className="c-map-fullscreen" ref={dialog} aria-label={'Explore '+area.short+' map'} onCancel={e=>{e.preventDefault();setExpanded(false);}}><header><div><h2>{area.short}</h2></div><button onClick={()=>setExpanded(false)} aria-label="Collapse map">↙ Close map</button></header><div className="c-map-full-body"><MapCanvas area={area} tab={tab} saved={saved} view={view} onView={onView} onNavigate={onNavigate}/></div></dialog>}
 </section>;
}

import {DialogClose} from './DialogClose';
import {usePhoneMapDialog} from './usePhoneMapDialog';
import {useEffect,useRef,useState} from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {collectionTrips} from './collectionTrips';
import type {CollectionTrip} from './collectionTrips';
import {species} from './model';
type View={center:L.LatLng;zoom:number};
function Canvas({trips,view,onSpecies}:{trips:CollectionTrip[];view:React.RefObject<View|null>;onSpecies:(id:number,trip:string)=>void}){
 const root=useRef<HTMLDivElement>(null);const [failed,setFailed]=useState(false);
 useEffect(()=>{
  if(!root.current)return;
  const map=L.map(root.current,{scrollWheelZoom:false,zoomAnimation:false,fadeAnimation:false});
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
  tiles.on('tileerror',()=>setFailed(true));tiles.on('tileload',()=>setFailed(false));
  if(view.current)map.setView(view.current.center,view.current.zoom);else map.fitBounds(L.latLngBounds(trips.map(t=>t.point)),{padding:[55,65],maxZoom:10});
  const layer=L.layerGroup().addTo(map);
  const render=()=>{layer.clearLayers();trips.forEach(t=>{
   // Expand grouped observations around the travel location without inventing precise sighting coordinates.
   const expanded=map.getZoom()>=10;
   (expanded?t.ids:[t.ids[0]]).forEach((id,index)=>{
    const el=document.createElement('div');el.className='c-map-creature c-collected-marker';
    const img=document.createElement('img');img.src=species[id].photo;img.alt='';el.append(img);
    const label=document.createElement('span');label.textContent=expanded?species[id].name:`${t.short} · ${t.ids.length}`;el.append(label);
    const angle=(index/t.ids.length)*Math.PI*2;const offset=expanded?L.point(Math.cos(angle)*88,Math.sin(angle)*88):L.point(0,0);
    const marker=L.marker(t.point,{title:expanded?species[id].name:`Open ${t.short} discoveries`,alt:expanded?species[id].name:`Open ${t.short} discoveries`,icon:L.divIcon({html:el,className:'c-live-marker',iconSize:[58,72],iconAnchor:[29-offset.x,36-offset.y]})}).addTo(layer);
    marker.getElement()?.setAttribute('aria-label',expanded?species[id].name:`Open ${t.short} discoveries`);
    marker.on('click',()=>expanded?onSpecies(id,t.id):map.setView(t.point,12));
   });
  });};
  render();map.on('zoomend',render);map.on('moveend',()=>{view.current={center:map.getCenter(),zoom:map.getZoom()};});
  const resize=new ResizeObserver(()=>map.invalidateSize({pan:false}));resize.observe(root.current);
  return()=>{resize.disconnect();map.remove();};
 // Keep map gestures stable while mounted; the containing view remounts when reopened.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 return <><div ref={root} className="c-live-map" aria-label="Map of your discoveries"/>{failed&&<p className="c-map-error" role="status">Map tiles unavailable. Check your connection.</p>}</>;
}
export function CollectionMap({saved}:{saved:number[]}){
 const trips=collectionTrips(saved).filter(t=>t.id!=='unassigned'),[expanded,setExpanded]=useState(false),dialog=useRef<HTMLDialogElement>(null),view=useRef<View|null>(null),trigger=useRef<HTMLButtonElement>(null);
 const navigate=useNavigate(),location=useLocation();const onSpecies=(id:number,trip:string)=>navigate('/v3/species/'+id+'?trip='+trip,{state:{from:location.pathname+'?view=Map',returnState:location.state}});
 const close=()=>{setExpanded(false);requestAnimationFrame(()=>trigger.current?.focus());};
 usePhoneMapDialog(dialog,expanded);
 return <section className="c-collection-map"><div className="c-live-map-preview">{!expanded&&<Canvas trips={trips} view={view} onSpecies={onSpecies}/>}<button ref={trigger} className="c-map-expand" onClick={()=>setExpanded(true)} aria-label="Expand map"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></button></div>{expanded&&<dialog ref={dialog} className="c-map-fullscreen" aria-label="Your discoveries map" onCancel={e=>{e.preventDefault();close();}}><header><h2>Your discoveries</h2><DialogClose label="Collapse map" onClose={close} showText/></header><div className="c-map-full-body"><Canvas trips={trips} view={view} onSpecies={onSpecies}/></div></dialog>}</section>;
}

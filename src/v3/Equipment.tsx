import {createContext,useContext,useEffect,useState} from 'react';
import type {ReactNode} from 'react';
import {Modal} from './CompanionUI';
import {AIIcon} from './AIIcon';
import {companionPhotos} from './companionData';
const types=['Action camera','Compact camera','Mirrorless / DSLR','Phone','Other equipment'] as const;
type Equipment={type:typeof types[number];model:string;capture:'Photos'|'Video';light:boolean};
const EquipmentContext=createContext<{equipment:Equipment|null;save:(value:Equipment|null)=>void}>({equipment:null,save:()=>{}});
export function EquipmentProvider({children}:{children:ReactNode}){
 const [equipment,save]=useState<Equipment|null>(()=>{try{const value=JSON.parse(localStorage.getItem('divedex.v3.equipment')||'null');return value&&types.includes(value.type)?{type:value.type,model:typeof value.model==='string'?value.model:'',capture:value.capture==='Video'?'Video':'Photos',light:!!value.light}:null;}catch{return null}});
 useEffect(()=>{try{localStorage.setItem('divedex.v3.equipment',JSON.stringify(equipment))}catch{/* Storage is optional. */}},[equipment]);
 return <EquipmentContext.Provider value={{equipment,save}}>{children}</EquipmentContext.Provider>;
}
const popularCameras: {model:string;type:Equipment['type']}[] = [
  {model:'OM SYSTEM Tough TG-7',type:'Compact camera'},
  {model:'Olympus Tough TG-6',type:'Compact camera'},
  {model:'GoPro HERO',type:'Action camera'},
  {model:'DJI Osmo Action',type:'Action camera'},
  {model:'Mirrorless / DSLR',type:'Mirrorless / DSLR'},
  {model:'Phone with housing',type:'Phone'},
];

export function QuickEquipment({onFinish,editing=false}:{onFinish:()=>void;editing?:boolean}){
  const {equipment,save}=useContext(EquipmentContext);
  const existing=popularCameras.find(camera=>camera.model===equipment?.model);
  const [choice,setChoice]=useState(existing?.model??(equipment?'Other equipment':'No equipment'));
  const [custom,setCustom]=useState(existing?'':(equipment?.model||equipment?.type||''));
  function finish(){
    const preset=popularCameras.find(camera=>camera.model===choice);
    const model=preset?.model??custom.trim();
    const type=preset?.type??(equipment?.model===model?equipment.type:'Other equipment');
    save(choice==='No equipment'?null:{model,type,capture:equipment?.capture??'Photos',light:equipment?.light??false});
    onFinish();
  }
  return <>
    {!editing&&<header><h1>Your equipment</h1><p>What do you take underwater?</p></header>}
    <div className="c-gear-picker" role="group" aria-label="Your equipment">
      {popularCameras.map((camera,index)=><button type="button" key={camera.model} aria-pressed={choice===camera.model} onClick={()=>setChoice(camera.model)}>
        <span className="c-gear-poster" aria-hidden="true">
          <b>{['TG-7','TG-6','HERO','ACTION','DSLR','PHONE'][index]}</b>
          <i style={{backgroundPosition:(index%3)*50+'% '+Math.floor(index/3)*100+'%'}}/>
        </span>
        <strong>{camera.model}</strong>
      </button>)}
      {['Other equipment','No equipment'].map(name=><button type="button" className="c-gear-text" key={name} aria-pressed={choice===name} onClick={()=>setChoice(name)}>{name}</button>)}
    </div>
    {choice==='Other equipment'&&<label className="c-camera-custom">Equipment name<input className="v-input" value={custom} onChange={e=>setCustom(e.target.value)} maxLength={60} placeholder="Camera or setup"/></label>}
    <div className="c-first-actions"><button className="c-primary" onClick={finish} disabled={choice==='Other equipment'&&!custom.trim()}>{editing?'Save equipment':'Start exploring'}</button>{!editing&&<button type="button" className="c-text-button c-onboarding-skip" onClick={onFinish}>Skip for now</button>}</div>
  </>;
}
function EquipmentEditor({onClose}:{onClose:()=>void}){
 return <Modal label="My equipment" placement="bottom" motion onClose={onClose}>
   <div className="c-dialog-heading"><h2>My equipment</h2><button onClick={onClose} aria-label="Close equipment">×</button></div>
   <QuickEquipment editing onFinish={onClose}/>
 </Modal>;
}

export function MyEquipment(){
 const {equipment}=useContext(EquipmentContext);
 const [editing,setEditing]=useState(false);
 const exact=popularCameras.findIndex(camera=>camera.model===equipment?.model);
 const index=exact>=0?exact:popularCameras.findIndex(camera=>camera.type===equipment?.type);
 return <section className="c-card c-my-equipment">
   <div><h2>My equipment</h2>
     <button type="button" className="c-profile-gear-button" onClick={()=>setEditing(true)} aria-label={equipment?'Edit equipment':'Add equipment'}>
       {equipment&&index>=0?<span className="c-profile-camera" aria-hidden="true" style={{backgroundPosition:(index%3)*50+'% '+Math.floor(index/3)*100+'%'}}/>:equipment?'Edit →':'Add →'}
       {equipment&&<small>{equipment.model||equipment.type}</small>}
     </button>
   </div>
   {!equipment&&<p>Save your camera for tailored photo ideas.</p>}
   {editing&&<EquipmentEditor onClose={()=>setEditing(false)}/>}
 </section>;
}
export function EquipmentAdvice(){
 const {equipment}=useContext(EquipmentContext),[editing,setEditing]=useState(false);
 const video=equipment?.capture==='Video';
 const mode=video?'Video':equipment?.type==='Mirrorless / DSLR'?'Photo · your familiar exposure mode':'Photo · start with Auto';
 const technique=video?'Hold one wide reef view steady; record a short clip.':equipment?.type==='Compact camera'?'Frame one reef detail. Try close-focus mode if your camera supports it.':equipment?.type==='Mirrorless / DSLR'?'Choose a wide reef scene or one small detail, to suit the lens you bring.':'Include the reef around your subject for a sense of place.';
 return <section className="c-card c-equipment-advice"><div className="c-equipment-advice-title"><AIIcon/><h2>{equipment?'With your '+(equipment.model||equipment.type):'Bring your camera'}</h2><button onClick={()=>setEditing(true)}>{equipment?'Edit':'Add'}</button></div>{equipment?<><div className="c-camera-visual"><img src={video?companionPhotos.turtle:companionPhotos.clown} alt={video?'A wide reef scene':'Clownfish in an anemone'}/><div><small>MODE TO TRY</small><strong>{mode}</strong><p>{technique}</p></div></div><div className="c-equipment-prep"><span>Charge & clear storage</span><span>Check housing instructions</span>{equipment.light&&<span>Charge your light</span>}</div><small className="c-muted">Based on your camera type and shooting preference.</small></>:<p>Add your camera once to see a mode and photo idea here.</p>}{editing&&<EquipmentEditor onClose={()=>setEditing(false)}/>}</section>;
}

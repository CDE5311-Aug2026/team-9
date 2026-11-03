import {createContext,useContext,useEffect,useState} from 'react';
import type {ReactNode} from 'react';
import {Modal} from './CompanionUI';
import {AIIcon} from './AIIcon';
import {companionPhotos} from './companionData';
const types=['Action camera','Compact camera','Mirrorless / DSLR','Phone'] as const;
type Equipment={type:typeof types[number];model:string;capture:'Photos'|'Video';light:boolean};
const EquipmentContext=createContext<{equipment:Equipment|null;save:(value:Equipment|null)=>void}>({equipment:null,save:()=>{}});
export function EquipmentProvider({children}:{children:ReactNode}){
 const [equipment,save]=useState<Equipment|null>(()=>{try{const value=JSON.parse(localStorage.getItem('divedex.v3.equipment')||'null');return value&&types.includes(value.type)?{type:value.type,model:typeof value.model==='string'?value.model:'',capture:value.capture==='Video'?'Video':'Photos',light:!!value.light}:null;}catch{return null}});
 useEffect(()=>{try{localStorage.setItem('divedex.v3.equipment',JSON.stringify(equipment))}catch{/* Storage is optional. */}},[equipment]);
 return <EquipmentContext.Provider value={{equipment,save}}>{children}</EquipmentContext.Provider>;
}
function EquipmentEditor({onClose}:{onClose:()=>void}){
 const {equipment,save}=useContext(EquipmentContext),[draft,setDraft]=useState<Equipment>(equipment??{type:'Action camera',model:'',capture:'Photos',light:false});
 return <Modal label="My equipment" placement="bottom" motion onClose={onClose}><div className="c-dialog-heading"><h2>My equipment</h2><button onClick={onClose} aria-label="Close equipment">×</button></div><form className="c-equipment-form" onSubmit={e=>{e.preventDefault();save({...draft,model:draft.model.trim()});onClose();}}><fieldset><legend>Camera type</legend><div className="c-equipment-types">{types.map(type=><label key={type}><input type="radio" name="camera-type" checked={draft.type===type} onChange={()=>setDraft({...draft,type})}/>{type}</label>)}</div></fieldset><label>Model · optional<input className="v-input" value={draft.model} maxLength={60} onChange={e=>setDraft({...draft,model:e.target.value})} placeholder="e.g. GoPro HERO13"/></label><fieldset><legend>I usually shoot</legend><div className="c-equipment-types">{(['Photos','Video'] as const).map(capture=><label key={capture}><input type="radio" name="capture" checked={draft.capture===capture} onChange={()=>setDraft({...draft,capture})}/>{capture}</label>)}</div></fieldset><label className="c-equipment-check"><input type="checkbox" checked={draft.light} onChange={e=>setDraft({...draft,light:e.target.checked})}/>I bring an underwater light</label><button className="c-primary" type="submit">Save equipment</button></form></Modal>;
}
export function MyEquipment(){const {equipment,save}=useContext(EquipmentContext),[editing,setEditing]=useState(false);return <section className="c-card c-my-equipment"><div><h2>My equipment</h2><button onClick={()=>setEditing(true)}>{equipment?'Edit':'Add'} →</button></div>{equipment?<><strong>{equipment.model||equipment.type}</strong><p>{equipment.type} · {equipment.capture}{equipment.light?' · Light':''}</p><button className="c-equipment-remove" onClick={()=>save(null)}>Remove equipment</button></>:<p>Save your camera for tailored photo ideas.</p>}{editing&&<EquipmentEditor onClose={()=>setEditing(false)}/>}</section>}
export function EquipmentAdvice(){
 const {equipment}=useContext(EquipmentContext),[editing,setEditing]=useState(false);
 const video=equipment?.capture==='Video';
 const mode=video?'Video':equipment?.type==='Mirrorless / DSLR'?'Photo · your familiar exposure mode':'Photo · start with Auto';
 const technique=video?'Hold one wide reef view steady; record a short clip.':equipment?.type==='Compact camera'?'Frame one reef detail. Try close-focus mode if your camera supports it.':equipment?.type==='Mirrorless / DSLR'?'Choose a wide reef scene or one small detail, to suit the lens you bring.':'Include the reef around your subject for a sense of place.';
 return <section className="c-card c-equipment-advice"><div className="c-equipment-advice-title"><AIIcon/><h2>{equipment?'With your '+(equipment.model||equipment.type):'Bring your camera'}</h2><button onClick={()=>setEditing(true)}>{equipment?'Edit':'Add'}</button></div>{equipment?<><div className="c-camera-visual"><img src={video?companionPhotos.turtle:companionPhotos.clown} alt={video?'A wide reef scene':'Clownfish in an anemone'}/><div><small>MODE TO TRY</small><strong>{mode}</strong><p>{technique}</p></div></div><div className="c-equipment-prep"><span>Charge & clear storage</span><span>Check housing instructions</span>{equipment.light&&<span>Charge your light</span>}</div><small className="c-muted">Based on your camera type and shooting preference.</small></>:<p>Add your camera once to see a mode and photo idea here.</p>}{editing&&<EquipmentEditor onClose={()=>setEditing(false)}/>}</section>;
}

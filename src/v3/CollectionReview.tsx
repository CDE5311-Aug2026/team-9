import {useState} from 'react';
import {AIIcon} from './AIIcon';
import {Back,Button,Go,Panel} from './UI';
import {species} from './model';
export const reviewIds=[6,7,2];
export function CollectionReview({handled,onConfirm}:{handled:number[];onConfirm:(source:number,id:number)=>void}){
 const [skipped,setSkipped]=useState<number[]>([]),[choices,setChoices]=useState<Record<number,number>>({}),[editing,setEditing]=useState<number|null>(null);
 const remaining=reviewIds.filter(id=>!handled.includes(id));const visible=remaining.filter(id=>!skipped.includes(id));
 return <><Back to="collection" label="Collection"/><h1 className="o-ai-heading"><AIIcon/>Confirm species</h1><p className="v-muted">AI isn’t sure about these matches.</p>{visible.map(source=>{const id=choices[source]??source,s=species[id];return <Panel key={source} className="c-confirm-card"><img src={species[source].photo} alt="Photo to identify"/><small>Suggested match</small><h2>{s.name}</h2>{editing===source&&<label>Species<select className="v-input" value={id} onChange={e=>setChoices({...choices,[source]:Number(e.target.value)})}>{species.map((s,i)=><option key={s.name} value={i}>{s.name}</option>)}</select></label>}<Button onClick={()=>onConfirm(source,id)}>Confirm & save</Button><div className="v-row"><button onClick={()=>setEditing(editing===source?null:source)}>Change species</button><button onClick={()=>setSkipped([...skipped,source])}>Skip for now</button></div></Panel>})}{!visible.length&&<Panel><h2>{remaining.length?'Saved for later':'All confirmed'}</h2><p>{remaining.length?'You can return to these photos anytime.':'Your collection is up to date.'}</p>{remaining.length>0&&<button onClick={()=>setSkipped([])}>Show skipped photos</button>}<Go className="v-button" to="collection">Back to collection</Go></Panel>}</>;
}

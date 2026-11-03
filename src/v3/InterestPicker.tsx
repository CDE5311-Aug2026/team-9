import {useState} from 'react';
import {Modal} from './CompanionUI';
import {AIIcon} from './AIIcon';
import {parseInterests,suggestedInterests,uniqueInterests} from './exploreInterests';
export function InterestPicker({values,onApply,onClose}:{values:string[];onApply:(values:string[])=>void;onClose:()=>void}){
 const [draft,setDraft]=useState(values),[text,setText]=useState('');
 const toggle=(value:string)=>setDraft(current=>current.includes(value)?current.filter(v=>v!==value):[...current,value]);
 const add=()=>{if(!text.trim())return;setDraft(current=>uniqueInterests([...current,...parseInterests(text)]));setText('');};
 return <Modal label="Your interests for this trip" placement="bottom" motion onClose={onClose}>
  <div className="c-dialog-heading"><h2><AIIcon/>What would you love to see?</h2><button aria-label="Close interests" onClick={onClose}>×</button></div>
  <form className="c-interest-input" onSubmit={e=>{e.preventDefault();add();}}><label className="c-visually-hidden" htmlFor="explore-wish">Tell us what interests you</label><input id="explore-wish" className="v-input" maxLength={240} value={text} onChange={e=>setText(e.target.value)} placeholder="Whale sharks, blackwater photography…"/><button type="submit" disabled={!text.trim()}>Add</button></form>
  {!!draft.length&&<div className="c-interest-draft" aria-label="Selected interests">{draft.map(value=><button key={value} onClick={()=>toggle(value)} aria-label={'Remove '+value}>{value}<span aria-hidden="true">×</span></button>)}</div>}
  <small className="v-muted">A few ideas to start with</small><div className="c-interest-suggestions">{suggestedInterests.map(value=><button key={value} aria-pressed={draft.includes(value)} onClick={()=>toggle(value)}>{value}{draft.includes(value)?' ✓':' +'}</button>)}</div>
  <button className="c-primary" onClick={()=>{onApply(uniqueInterests([...draft,...parseInterests(text)]));onClose();}}>Show my ideas</button>
 </Modal>;
}

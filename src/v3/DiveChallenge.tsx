import {Go} from './UI';
import {species} from './model';
export type DiveChallengeState={speciesId:number;place:string;status:'active'|'complete'};
export function DiveChallenge({after,place,challenge,onStart}:{after:boolean;place:string;challenge:DiveChallengeState|null;onStart:(id:number)=>void}){
 const id=challenge?.speciesId??(place.includes('Raja')?1:0),s=species[id],done=challenge?.status==='complete';
 return <section className="c-photo-card c-dive-challenge"><img src={s.photo} alt={s.name}/><div className="c-photo-copy"><h2>{done?'You found it!':after?'Did you spot it?':`Can you spot ${s.name}?`}</h2>{(after||done)&&<p>{s.name}</p>}{done?<Go className="c-photo-action" to="profile">View achievement →</Go>:after?<Go className="c-photo-action" to="identify">Confirm with a photo →</Go>:challenge?<span className="c-quest-active">Challenge started ✓</span>:<button className="c-photo-action" onClick={()=>onStart(id)}>Start challenge →</button>}</div></section>;
}

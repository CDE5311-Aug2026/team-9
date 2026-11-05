import {useEffect,useState} from 'react';
import {Back,Go} from './UI';
import {species} from './model';
import {speciesQuickFacts} from './speciesQuickFacts';
import type {DiveChallengeState} from './DiveChallenge';
export function ChallengeCheck({challenge,onConfirm}:{challenge:DiveChallengeState|null;onConfirm:(id:number)=>void}){
 const [file,setFile]=useState<File|null>(null),[url,setUrl]=useState(''),[error,setError]=useState('');
 useEffect(()=>{if(!file){setUrl('');return;}const next=URL.createObjectURL(file);setUrl(next);return()=>URL.revokeObjectURL(next);},[file]);
 if(!challenge)return <><Back to="home"/><h1>Choose a challenge first</h1><Go to="home" className="v-button">Back home</Go></>;
 const target=species[challenge.speciesId],facts=speciesQuickFacts[challenge.speciesId];
 return <><Back to="home" label="Home"/><h1>Verify your find</h1><p className="v-muted">{target.name} · {challenge.place}</p><div className="c-verify-photos"><figure><img src={target.photo} alt={target.name}/><figcaption>Your target</figcaption></figure><figure>{url?<img src={url} alt="Your observation" onError={()=>{setError('This photo could not be opened. Try a JPG or PNG.');setFile(null);}}/>:<div className="c-verify-placeholder">＋</div>}<figcaption>Your photo</figcaption></figure></div><label className="c-verify-upload">{file?'Choose another photo':'Add your photo'}<input type="file" accept="image/*" onChange={e=>{setError('');setFile(e.target.files?.[0]??null);}}/></label>{error&&<p role="alert">{error}</p>}<section className="c-verify-cues"><h2>Does it match?</h2>{facts.cues.map(cue=><p key={cue}>• {cue}</p>)}</section><button className="v-button" disabled={!url||!!error} onClick={()=>onConfirm(challenge.speciesId)}>Yes, save & complete</button><Go className="c-text-button" to="home">Keep looking</Go></>;
}

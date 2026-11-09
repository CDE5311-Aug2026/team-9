import {InterestSummary} from './InterestSummary';
import {DestinationTile} from './DestinationTile';
import {WorldwideSites} from './WorldwideSites';
import {InterestPicker} from './InterestPicker';
import {interestCategory,selectedInterests} from './exploreInterests';
import {species} from './model';
import {MonthDropdown} from './MonthDropdown';
import {useEffect,useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {LocationDialog, PhotoCard} from './CompanionUI';
import {AIIcon} from './AIIcon';
import {Go} from './UI';
import {browsingInterests,recommendationIdeas} from './recommendationIdeas';
import {MarineDiscovery,ExperienceDiscovery} from './DiscoverySections';
import {ExploreMap} from './ExploreMap';
import {Back} from './UI';
import {areaContent, exploreTabs, getArea, seasonalRecommendation} from './companionData';
import type {AreaContent, Preferences} from './companionData';

const tabKeys = ['sites', 'marine', 'experiences'];
function DiveRecommendations({area, preferences, onChoosePlace}: {area: AreaContent; preferences: Preferences; onChoosePlace:()=>void}) {
  const [params,setParams]=useSearchParams();
  const monthValue=Number(params.get('month'));
  const month=monthValue>=1&&monthValue<=12?monthValue:new Date().getMonth()+1;
  const interests=selectedInterests(params,preferences.topics??[]);
  const [editing,setEditing]=useState(false);
  const why = seasonalRecommendation(area.key, preferences,new Date(new Date().getFullYear(),month-1,15));
  const update=(key:string,value:string)=>{const next=new URLSearchParams(params);next.set(key,value);setParams(next,{replace:true});};
  const applyInterests=(values:string[])=>{const next=new URLSearchParams(params);next.set('interestsEdited','1');next.delete('interest');values.forEach(value=>next.append('interest',value));setParams(next,{replace:true});};
  const months=Array.from({length:12},(_,i)=>new Date(2026,i,1).toLocaleString('en-US',{month:'long'}));
  const topics=interests.length?interests:['Marine life'];
  return <>
    <div className="c-section-heading"><h2>{area.short}, your way</h2></div>
    <div className="c-explore-preferences"><MonthDropdown options={months} value={months[month-1]} onChange={value=>update('month',String(months.indexOf(value)+1))}/><InterestSummary interests={interests} open={editing} onEdit={()=>setEditing(true)}/></div>
    <div className="c-dive-list" aria-label="Dive recommendations">{topics.map(interest=>{
      if(interest==='Whale sharks'||interest==='Turtles'){
        const id=interest==='Whale sharks'?5:1;
        return <section className="c-interest-result" key={interest}><p className="c-interest-match"><AIIcon/>{interest} · Get to know your subject</p><PhotoCard photo={species[id].photo} tag="SPECIES GUIDE" title={interest==='Whale sharks'?'Meet the biggest\nfish in the sea.':'Get to know\nthe sea turtles.'} subtitle={'For your interest in '+interest.toLowerCase()+'. Learn what to look for before planning an encounter.'} to={'guide/'+id} action="Explore this species →"/><div className="c-interest-alternative"><p>No matching encounter trips listed for {area.short} in {months[month-1]}.</p><button onClick={onChoosePlace}>Try another place →</button><button onClick={()=>document.querySelector<HTMLButtonElement>('.c-month-trigger')?.click()}>Change month</button></div></section>;
      }
      if(interest==='Blackwater photography')return <section className="c-interest-result" key={interest}><p className="c-interest-match"><AIIcon/>Blackwater photography · Start with the technique</p><Go className="c-blackwater-idea" to="learn/blackwater"><span aria-hidden="true">✦</span><h2>A different world<br/>after dark.</h2><p>Explore blackwater photography before choosing a trip.</p><strong>Explore the technique →</strong></Go><div className="c-interest-alternative"><p>No blackwater trips listed for {area.short} in {months[month-1]}.</p><button onClick={onChoosePlace}>Try another place →</button><button onClick={()=>document.querySelector<HTMLButtonElement>('.c-month-trigger')?.click()}>Change month</button></div></section>;
      const category=interestCategory(interest);
      if(!browsingInterests.some(value=>value===category))return <section className="c-card c-interest-unmatched" key={interest}><p className="c-interest-match"><AIIcon/>{interest}</p><h3>No matching ideas here yet.</h3><div><button onClick={()=>setEditing(true)}>Edit interests</button><button onClick={onChoosePlace}>Try another place →</button></div></section>;
      return <section className="c-interest-result" key={interest}><div className="c-destination-feed">{recommendationIdeas(area,category).map((dive,i)=>{
        const to='destination/'+area.key+'?idea='+i+'&month='+month+'&interest='+encodeURIComponent(interest);
        const subtitle=dive.subtitle;
        return <DestinationTile key={i} photo={dive.photo} title={dive.title} subtitle={subtitle} tag={area.short+' · '+(why.inSeason?'In season':'Best '+why.season)} to={to}/>;
      })}</div></section>;
    })}</div>
    {editing&&<InterestPicker values={interests} onApply={applyInterests} onClose={()=>setEditing(false)}/>}
  </>;

}
export function Explore({saved, area, setArea, preferences}: {saved: number[]; area: string; setArea: (value: string) => void; preferences: Preferences}) {
  const [params, setParams] = useSearchParams();
  const tab = Math.max(0, tabKeys.indexOf(params.get('tab') ?? 'sites'));
  const [choosing, setChoosing] = useState(false);
  const requestedArea=areaContent[params.get('area') as keyof typeof areaContent];
  useEffect(()=>{if(requestedArea&&requestedArea.label!==area)setArea(requestedArea.label);},[requestedArea,area,setArea]);
  const region = requestedArea??getArea(area);
  const worldwide=params.get('scope')==='world'||(!params.has('scope')&&!params.has('tab'));
  const setScope=(global:boolean)=>{const next=new URLSearchParams(params);next.delete('area');if(global){next.set('scope','world');next.set('tab','sites');}else {next.set('scope','local');next.set('tab','sites');}setParams(next,{replace:true});};
  const changeTab = (index: number) => {const next=new URLSearchParams(params);next.set('tab',tabKeys[index]);next.set('scope',worldwide?'world':'local');setParams(next,{replace:true});};
  return <div className="c-explore">
    <div className="c-explore-sticky"><header className="c-explore-heading"><h1 className="c-page-title">Explore</h1><button className="c-area-trigger" aria-label={'Change location, current location: '+area} aria-haspopup="dialog" aria-expanded={choosing} title={area} onClick={() => setChoosing(true)}><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7"/></svg><span>{worldwide?'Worldwide':region?.short ?? area}</span><svg className="c-chevron" aria-hidden="true" width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></button></header>
    {<div className="c-tabs" role="tablist" aria-label="Explore categories">{exploreTabs.map((label, i) => <button id={'explore-tab-' + i} role="tab" aria-selected={tab === i} aria-controls="explore-content" key={label} onClick={() => changeTab(i)}>{label}</button>)}</div>}
    </div>
    {worldwide?<div id="explore-content" aria-label="Worldwide destinations"><WorldwideSites tab={tabKeys[tab] as 'sites'|'marine'|'experiences'} saved={saved} topics={preferences.topics??[]} onSelect={destination=>{setArea(destination.label);setScope(false);document.getElementById('v3-main')?.scrollTo(0,0);}}/></div>:region ? <div role="tabpanel" id="explore-content" aria-labelledby={'explore-tab-' + tab} className="c-explore-panel">
      <ExploreMap key={region.key+tab} area={region} tab={tab} saved={saved}/>
      {tab === 0 ? <DiveRecommendations key={region.key} area={region} preferences={preferences} onChoosePlace={()=>setChoosing(true)}/> : tab === 1 ? <MarineDiscovery area={region} saved={saved}/> : <ExperienceDiscovery area={region}/>}

    </div> : <section className="c-card"><h2>A new place to discover.</h2><p>No curated {exploreTabs[tab].toLowerCase()} for {area} yet.</p><button className="c-primary" onClick={() => setChoosing(true)}>Browse featured places</button></section>}
    {choosing && <LocationDialog start="choose" area={area} onWorldwide={()=>{setScope(true);setChoosing(false);}} onClose={() => setChoosing(false)} onSelect={value => {setArea(value);setScope(false);setChoosing(false);}}/>}
  </div>;
}
export function Areas({area, onSelect}: {area: string; onSelect: (area: string) => void}) {
  const [query, setQuery] = useState(''), [locate, setLocate] = useState(false);
  const matches = Object.values(areaContent).filter(a => a.label.toLowerCase().includes(query.trim().toLowerCase()));
  return <><Back to="explore" label="Explore"/><h1>Where to explore?</h1><input className="v-input" aria-label="Search places" placeholder="Search a region or dive site" value={query} onChange={e => setQuery(e.target.value)}/>{matches.map(a => <button className="c-place-option" key={a.key} onClick={() => onSelect(a.label)}>{a.label}<span>{area === a.label ? '✓' : '→'}</span></button>)}{!matches.length && <><p>No curated content here yet.</p><button className="c-place-option" onClick={() => onSelect(query.trim())}>Use “{query.trim()}” →</button></>}<button className="c-secondary" onClick={() => setLocate(true)}>Use current location</button>{locate && <LocationDialog area={area} start="choose" onSelect={onSelect} onClose={() => setLocate(false)}/>}</>;
}

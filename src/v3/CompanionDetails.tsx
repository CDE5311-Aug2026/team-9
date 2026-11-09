import {DiagonalArrow} from './ExploreArrow';
import {ActivitySignup} from './ActivitySignup';
import {StudyPhotos} from './StudyPhotos';
import type {StudyRecord} from './StudyPhotos';
import {ideaFromParams,ideaKey,ideaRoute} from './savedIdeas';
import type {SavedIdea} from './savedIdeas';
import {CameraAdvice} from './DestinationSections';
import {TripOverview} from './TripOverview';
import {recommendationIdeas} from './recommendationIdeas';
import {experienceItems} from './discoveryContent';
import {useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {AIHint} from './CompanionUI';
import {Back, Go} from './UI';
import {areaContent, companionPhotos, interests} from './companionData';
import type {Preferences} from './companionData';

export function Personalize({preferences, onSave, onSkip}: {preferences: Preferences; onSave: (prefs: Preferences) => void; onSkip: () => void}) {
  const [step, setStep] = useState(0), [draft, setDraft] = useState(preferences);
  return <div className="c-personalize"><div className="c-personalize-progress">{step ? <button onClick={() => setStep(0)}>← Back</button> : <span>MAKE IT YOURS</span>}<small>{step + 1} / 2</small></div>
    <h1>{step ? 'Where are you in your journey?' : 'Make it your ocean.'}</h1><p className="v-muted">{step ? 'I’ll use this to find a better starting point.' : 'What would you like more of? Choose a few.'}</p>
    {!step ? <>{interests.map((interest, i) => <button className="c-preference" aria-pressed={draft.interests.includes(interest)} key={interest} onClick={() => setDraft(current => ({...current, interests: current.interests.includes(interest) ? current.interests.filter(value => value !== interest) : [...current.interests, interest]}))}><img src={[companionPhotos.turtle, companionPhotos.manta, companionPhotos.clown, companionPhotos.tang][i]} alt=""/><span><strong>{interest}{draft.interests.includes(interest) ? ' ✓' : ''}</strong><small>{['Get to know the ocean’s characters.', 'Find somewhere to look forward to.', 'Explore ideas, gear and techniques.', 'Build confidence, one step at a time.'][i]}</small></span></button>)}<button className="c-primary" onClick={() => setStep(1)}>Continue →</button><button className="c-text-button" onClick={onSkip}>Skip for now</button></> : <>
      {['Just curious', 'Learning to dive', 'Already diving'].map((experience, i) => <button className="c-preference" key={experience} aria-pressed={draft.experience === experience} onClick={() => setDraft({...draft, experience})}><span><strong>{experience}{draft.experience === experience ? ' ✓' : ''}</strong><small>{['I’m here to explore.', 'I’m finding my feet underwater.', 'I’m ready for new ideas.'][i]}</small></span></button>)}
      <h2>Anything you’re planning?</h2><small className="v-muted">Optional · You can change this later.</small><div className="c-tabs">{['Just exploring', 'Bali', 'Raja Ampat'].map(plan => <button key={plan} aria-pressed={draft.plan === plan} onClick={() => setDraft({...draft, plan})}>{plan}</button>)}</div><button className="c-primary" onClick={() => onSave(draft)}>Find my inspiration →</button>
    </>}
  </div>;
}
export function Destination({areaKey, onSave, saved}: {areaKey: string; onSave: (idea: SavedIdea) => void; saved: SavedIdea[]}) {
  const [params] = useSearchParams();
  const area = areaContent[areaKey as keyof typeof areaContent];
  if (!area) return <><Back to="explore"/><h1>Choose a destination.</h1><Go to="areas" className="c-primary">Explore places</Go></>;
  const selection=ideaFromParams(areaKey,params), isSaved=saved.some(item=>ideaKey(item)===ideaKey(selection));
  const index = params.get('idea') === '1' ? 1 : 0, interest=params.get('interest')??'Marine life', idea = recommendationIdeas(area,interest)[index];
  const overview=params.get('overview')==='1';
  return <><Back to="explore" label="Back"/><h1>{overview?'A little escape to '+area.short+'.':idea.title}</h1><img className="v-hero" src={idea.photo||area.dives[0].photo} alt={area.short + ' dive inspiration'}/><p>{area.region} · {area.key==='amed'?'Reefs, coastal views and time to wander.':'Reef encounters, island views and slower afternoons.'}</p><p className="c-muted">{new Date(2026,selection.month-1,1).toLocaleString('en-US',{month:'long'})}</p><button className="c-primary" onClick={() => onSave(selection)}>{isSaved ? 'Saved ✓' : 'Save this idea'}</button><TripOverview areaKey={area.key} interest={interest}/></>;

}
export function ExperienceDetail({areaKey,kind,saved,onContribute}:{areaKey:string;kind:string;saved:number[];onContribute:(record:StudyRecord)=>void}) {
  const [params]=useSearchParams();
  const area=areaContent[areaKey as keyof typeof areaContent];
  if(!area)return <Back to="explore?tab=experiences"/>;
  const items=experienceItems(area).filter(option=>option.kind===kind);
  const item=items.find(option=>option.id===params.get('item'))??items[0];
  if(!item)return <Back to="explore?tab=experiences"/>;
  return <><Back to="explore?tab=experiences"/><small className="v-muted">{kind==='study'?'Study':'Activity'} · {area.short}</small><h1>{item.title}</h1>
    {kind==='study'?<StudyPhotos key={item.id} title={item.title} area={areaKey} item={item.id} detail={item.detail} cover={item.photo} saved={saved} onSubmit={onContribute}/>:<><img className="v-hero" src={item.photo} alt=""/><section className="c-card"><h2>Get involved</h2><p>{item.detail}</p></section><ActivitySignup key={areaKey+item.id} activityId={areaKey+'.'+item.id} title={item.title} region={area.region}/></>}
  </>;
}
export function Learning({topic}: {topic: string}) {
  const [camera, setCamera] = useState('');
  if (topic === 'setup') return <><Back to="learn/photo" label="Photography"/><h1>Let’s start with what you already have.</h1><AIHint>What do you shoot with?</AIHint>{['Action camera', 'Compact camera', 'Mirrorless / DSLR', 'I’m still choosing'].map(value => <button className="c-place-option" key={value} aria-pressed={camera === value} onClick={() => setCamera(value)}>{value}{camera === value ? ' ✓' : ' →'}</button>)}{camera && <section className="c-card" aria-live="polite"><h2>{camera === 'I’m still choosing' ? 'Start with what you want to capture.' : 'Let’s explore your ' + camera.toLowerCase() + '.'}</h2><p>{camera === 'Action camera' ? 'Explore composition, steady shots and working with available light.' : camera === 'Compact camera' ? 'Get familiar with the controls you can reach through your housing.' : camera === 'Mirrorless / DSLR' ? 'Start with your camera model, lens and compatible housing.' : 'Would you rather photograph small reef details, wide scenes or your dive companions?'}</p><Go to="learn/photo" className="c-small-link">See the beginner guide →</Go></section>}</>;
  if (topic === 'prep') return <><Back to="explore"/><h1>A little preparation.</h1>{['Confirm your dive plans with your operator', 'Get familiar with your camera and housing', 'Make a marine-life wish list'].map(label => <label className="c-place-option" key={label}><span>{label}</span><input type="checkbox"/></label>)}<Go to="learn/photo" className="c-primary">Photography inspiration</Go></>;
  if (topic === 'blackwater') return <><Back to="learn/photo"/><h1>A different world after dark.</h1><p>An introduction to blackwater diving and photography.</p><a className="c-primary" href="https://blog.padi.com/blackwater-diving/" target="_blank" rel="noreferrer">Read PADI’s introduction <DiagonalArrow/></a><AIHint>Explore the experience before choosing your setup.</AIHint><Go className="c-secondary" to="learn/setup">Help with my setup</Go></>;
  return <><Back to="explore?tab=experiences" label="Explore"/><h1>A better photo starts here.</h1><img className="v-hero" src={companionPhotos.clown} alt="Clownfish among anemones"/><h2>A starting point for underwater photography</h2><p>Explore light, camera controls and how to prepare your setup.</p><a href="https://www.canon.co.nz/get-inspired/underwater-photography-tips-for-beginners" target="_blank" rel="noreferrer" className="c-primary">Read Canon’s beginner guide <DiagonalArrow/></a><CameraAdvice/><section className="c-card"><h2>Try this on your next dive</h2><p>Choose one subject, keep the camera steady, and leave room in the frame for its surroundings. Review the result before changing your angle.</p></section><Go to="learn/blackwater" className="c-place-option">Curious about blackwater photography? →</Go></>;
}
export function SavedIdeas({saved}: {saved: SavedIdea[]}) {
  return <><Back/><h1>Your saved ideas</h1>{saved.length ? [...saved].reverse().map(item => {const area=areaContent[item.areaKey as keyof typeof areaContent];const idea=recommendationIdeas(area,item.interest)[item.index];return <Go key={ideaKey(item)} className="c-photo-learning" to={ideaRoute(item)}>{idea.photo&&<img src={idea.photo} alt=""/>}<h2>{idea.title}</h2><p>{area.short} · {new Date(2026,item.month-1,1).toLocaleString('en-US',{month:'long'})} · {item.interest}</p></Go>;}) : <p className="v-muted">Save an idea to start planning.</p>}<Go to="explore" className="c-primary">Find some inspiration</Go></>;
}

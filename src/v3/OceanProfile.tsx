import type {QuizState} from './OceanQuiz';
import type {Identity} from './LocalIdentity';
import {WishlistButton} from './MarineWishlist';
import {MyEquipment} from './Equipment';
import './profile-badges.css';
import {Go} from './UI';
import {collectionIds, species, v3} from './model';
const a=v3['427:2427'];
type ProfileProps = {
  quiz: QuizState;
  identity: Identity | null;
  reefFinderPlace: string;
  saved: number[];
  hasContribution: boolean;
};

export function OceanProfile({reefFinderPlace,identity,quiz,saved,hasContribution}: ProfileProps){
  const ids = collectionIds(saved);
  const categories = new Set(ids.map(id => species[id].category));
  const quizScore=Math.max(quiz.best??0,quiz.correct);
  const badges = [
    {name:'Reef Finder', hint:reefFinderPlace || 'Verify a Reef Challenge target', color:'orange', shape:'focus', earned:!!reefFinderPlace},
    {name:'First splash', hint:'First species saved', color:'orange', shape:'seal', icon:a.imgFrame, earned:ids.length>0},
    {name:'A little ocean', hint:'10 species found', color:'blue', shape:'seal', icon:a.imgFrame1, earned:ids.length>=10},
    {name:'Familiar faces', hint:'5 correct answers', color:'blue', shape:'diamond', icon:a.imgFrame2, earned:quizScore>=5},
    {name:'Sharp eyes', hint:'10 correct answers', color:'orange', shape:'diamond', icon:a.imgFrame3, earned:quizScore>=10},
    {name:'Beyond fish', hint:'3 categories found', color:'blue', shape:'seal', icon:a.imgFrame4, earned:categories.size>=3},
    {name:'Ocean helper', hint:'First study contribution', color:'orange', shape:'shield', icon:a.imgFrame5, earned:hasContribution},
  ];
  return <div className="o-profile"><div className="v-row"><h1 className="c-page-title">Your ocean story</h1><Go to="settings" className="c-profile-settings"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" role="img" aria-label="Settings"><path d="m9.5 3-.6 2.3-1.5.9-2.3-.6-2.5 4.3 1.7 1.7v1.8l-1.7 1.7 2.5 4.3 2.3-.6 1.5.9.6 2.3h5l.6-2.3 1.5-.9 2.3.6 2.5-4.3-1.7-1.7v-1.8l1.7-1.7-2.5-4.3-2.3.6-1.5-.9L14.5 3h-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><circle cx="12" cy="12.5" r="3" stroke="currentColor" strokeWidth="1.6"/></svg></Go></div><div className="o-identity"><span><img className="c-default-fish-avatar" src="/v3/onboarding/fish-avatar.jpg" alt=""/></span><div><h3>{identity?.name??'Ocean explorer'}</h3><small>A little curiosity. A whole ocean.</small></div></div><div className="o-stats">{[['25','species found'],['38','encounters'],[String(quizScore),'quiz answers right']].map(([n,label])=><div key={label}><h2>{n}</h2><small>{label}</small></div>)}</div><MyEquipment/><WishlistButton profile/><Go className="o-progress" to="quiz"><h2>Ocean quiz</h2><p>{quiz.remaining.length ? quiz.remaining.length+(quiz.remaining.length===1?' question left':' questions left') : 'Play again · '+quiz.total+' questions'}</p>{quiz.remaining.length>0 && <progress value={quiz.total-quiz.remaining.length} max={quiz.total}/>}</Go>{quiz.best!==null && <Go to="quiz-medal">View your best medal →</Go>}<h2>Little wins, big ocean.</h2><div className="o-badges">{badges.map(badge=>
    <div key={badge.name} className={'profile-award '+(badge.earned?'earned':'locked')}>
      <span className={'award-mark award-'+badge.shape+' award-'+badge.color} aria-hidden="true">
        {badge.icon ? <img src={badge.icon} alt=""/> :
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M4 12V6h6m16 0h6v6m0 12v6h-6m-16 0H4v-6"/><path d="M9 18q7-10 16 0-9 10-16 0Zm16 0 4-4v8Z"/><circle cx="14" cy="17" r="1" fill="currentColor"/></svg>}
      </span>
      <p>{badge.name}</p><small>{badge.hint}<em className="award-state">{badge.earned?'Earned':'Locked'}</em></small>
    </div>
  )}</div><Go to="contributions">My contributions →</Go></div>}

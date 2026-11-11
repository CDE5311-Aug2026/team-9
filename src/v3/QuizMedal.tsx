import {useEffect, useState} from 'react';
import {Go} from './UI';
import {read, v3} from './model';
import './quiz-medal.css';

const profileArt = v3['427:2427'];
const medals = [
  {name: 'Ocean Explorer', seal: 'imgStar1', icon: 'imgFrame'},
  {name: 'Reef Spotter', seal: 'imgStar', icon: 'imgFrame1'},
  {name: 'Ocean Naturalist', seal: 'imgStar1', icon: 'imgFrame2'},
  {name: 'Perfect Dive', seal: 'imgStar', icon: 'imgFrame3'},
] as const;

export function QuizMedal({correct,total}: {correct:number;total:number}) {
  const medal = medals[correct===total ? 3 : correct>=8 ? 2 : correct>=4 ? 1 : 0];
  const [reveal] = useState(()=>!read('quiz.medalSeen',false));
  useEffect(()=>{
    try { localStorage.setItem('divedex.v3.quiz.medalSeen','true'); } catch { /* Storage is optional. */ }
  },[]);
  return <section className={'qm-result'+(reveal?' qm-reveal':'')}>
    <div className="qm-stage" aria-hidden="true">
      <div className="qm-burst">
        {Array.from({length:12}, (_,i) => <i key={i} style={{rotate: (i*30)+'deg'}}/>)}
      </div>
      <div className="qm-medal">
        <img src={profileArt[medal.seal]} alt=""/>
        <img className="qm-icon" src={profileArt[medal.icon]} alt=""/>
      </div>
    </div>
    <div className="qm-caption"><h1>{medal.name}</h1><p>{correct} / {total} correct</p></div>
    <Go className="c-primary" to="collection">Explore your Collection</Go>
  </section>;
}

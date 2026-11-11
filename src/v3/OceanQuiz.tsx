import {useState} from 'react';
import {Back} from './UI';
import {QuizMedal} from './QuizMedal';
import {read,species} from './model';

const questions = [
  {id:'whale-spots',photo:5,prompt:'Which shark wears this constellation of spots?',options:['Whale shark','Blacktip reef shark','Nurse shark'],answer:0,note:'Look for the pale spots and broad, flat head.'},
  {id:'clown-home',photo:0,prompt:'Where does this clownfish find shelter?',options:['Seagrass blades','Sea anemone tentacles','An empty shell'],answer:1,note:'Its host anemone offers a sheltered place on the reef.'},
  {id:'manta-id',photo:2,prompt:'Which feature helps researchers recognise a manta?',options:['Its wingspan','The shape of its shadow','Spots on its underside'],answer:2,note:'Researchers compare belly spot patterns across sightings.'},
  {id:'tang-tail',photo:4,prompt:'What colour is the blue tang’s tail?',options:['Blue','Yellow','White'],answer:1,note:'Its yellow tail contrasts with the dark pattern on its blue body.'},
  {id:'hermit-shell',photo:9,prompt:'What does a hermit crab carry for protection?',options:['An empty snail shell','A coral branch','A sea sponge'],answer:0,note:'The borrowed shell protects its soft abdomen.'},
  {id:'moray-id',photo:6,prompt:'Who is peeking out of this reef crevice?',options:['A cuttlefish','A cleaner shrimp','A giant moray'],answer:2,note:'The long body and large jaws are clues to this reef eel.'},
  {id:'green-turtle',photo:1,prompt:'What gives the green turtle its name?',options:['Its shell','Its body fat','Its eyes'],answer:1,note:'The name comes from the greenish colour of its fat.'},
  {id:'lionfish-id',photo:12,prompt:'Which fish has these striped, fan-like fins?',options:['Red lionfish','Moorish idol','Blue tang'],answer:0,note:'Striped fins and long dorsal spines form its distinctive outline.'},
  {id:'coral-animal',photo:10,prompt:'What builds a branching coral colony?',options:['Seaweed','Tiny fish','Coral polyps'],answer:2,note:'A colony is made up of small animals called polyps.'},
  {id:'cuttlefish-id',photo:17,prompt:'Which animal is pictured here?',options:['Moon jelly','Broadclub cuttlefish','Mantis shrimp'],answer:1,note:'Look for the oval mantle and the fringe of fin along its sides.'},
];

type Progress=Record<string,boolean>;
export function useOceanQuiz(){
  type Round = {progress:Progress; best:number|null};
  const [round,setRound]=useState<Round>(()=>{
    const stored=read<Round|null>('quiz.round',null);
    const answers=stored?.progress ?? read<Progress|null>('quiz.progress',null);
    const progress=Object.fromEntries(questions.filter(q=>typeof answers?.[q.id]==='boolean').map(q=>[q.id,answers![q.id]]));
    const best=stored?.best ?? (Object.keys(progress).length===questions.length ? Object.values(progress).filter(Boolean).length : null);
    return {progress,best};
  });
  const unanswered=questions.filter(q=>!(q.id in round.progress));
  const complete=unanswered.length===0;
  const correct=Object.values(round.progress).filter(Boolean).length;
  function record(id:string,correctAnswer:boolean){
    const previous=complete ? {} : round.progress;
    if(id in previous)return;
    const progress={...previous,[id]:correctAnswer};
    const finished=Object.keys(progress).length===questions.length;
    const best=finished ? Math.max(round.best??0,Object.values(progress).filter(Boolean).length) : round.best;
    const next={progress,best};
    setRound(next);
    try{localStorage.setItem('divedex.v3.quiz.round',JSON.stringify(next));}catch{/* In-session progress is still available. */}
  }
  return {remaining:unanswered,total:questions.length,correct,best:round.best,record};
}
export type QuizState=ReturnType<typeof useOceanQuiz>;

export function OceanQuiz({quiz}:{quiz:QuizState}){
  const [result,setResult]=useState<{question:typeof questions[number];choice:number}|null>(null);
  const [showResults,setShowResults]=useState(false);
  const question=result?.question??quiz.remaining[0]??questions[0];
  if(showResults)return <><Back to="profile"/><QuizMedal correct={quiz.correct} total={quiz.total}/></>;
  const right=result?.choice===question.answer;
  const choose=(choice:number)=>{
    if(result)return;
    setResult({question,choice});
    quiz.record(question.id,choice===question.answer);
  };
  return <><Back to="profile"/><section key={question.id} className="c-ocean-quiz">
    <small>Ocean quiz · {!result && !quiz.remaining.length ? 1 : quiz.total-quiz.remaining.length+(result?0:1)} / {quiz.total}</small>
    <h1>{question.prompt}</h1><img className="v-hero" src={species[question.photo].photo} alt={result?species[question.photo].name:'Underwater observation'}/>
    {result?<div role="status" className={'c-card c-quiz-result '+(right?'is-correct':result.choice>=0?'is-missed':'')}>
      <h2>{right?'✓ You got it!':question.options[question.answer]}</h2><p>{question.note}</p>
      <button className="c-primary" onClick={()=>{if(!quiz.remaining.length)setShowResults(true);setResult(null)}}>{quiz.remaining.length?'Next question':'See my results'}</button>
    </div>:<><div className="c-quiz-choices">{question.options.map((option,index)=><button className="c-secondary" key={option} onClick={()=>choose(index)}>{option}</button>)}</div>
    <button className="c-text-button" onClick={()=>choose(-1)}>Reveal answer</button></>}
  </section></>;
}

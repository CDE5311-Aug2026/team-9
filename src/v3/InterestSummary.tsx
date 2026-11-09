import {AIIcon} from './AIIcon';

export function InterestSummary({interests,open,onEdit}:{
  interests:string[]; open:boolean; onEdit:()=>void;
}){
  return <button className="c-interest-trigger c-interest-summary" aria-label={'Edit interests'+(interests.length?' · '+interests.join(', '):'')}
    aria-haspopup="dialog" aria-expanded={open} onClick={onEdit}>
    <AIIcon/><span>{interests[0]??'Your interests'}</span>
    {interests.length>1&&<small>+{interests.length-1}</small>}
    <span aria-hidden="true">›</span>
  </button>;
}

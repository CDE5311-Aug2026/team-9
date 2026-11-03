import {areaContent} from './companionData';
export type SavedIdea = {areaKey:string; month:number; interest:string; index:number};
export function ideaFromParams(areaKey:string, params:URLSearchParams):SavedIdea {
  const month=Number(params.get('month'));
  return {areaKey,month:Number.isInteger(month)&&month>=1&&month<=12?month:new Date().getMonth()+1,interest:params.get('interest')?.trim().slice(0,100)||'Marine life',index:params.get('idea')==='1'?1:0};
}
export function ideaKey(idea:SavedIdea){return `${idea.areaKey}:${idea.month}:${idea.interest}:${idea.index}`;}
export function ideaRoute(idea:SavedIdea){return `destination/${idea.areaKey}?${new URLSearchParams({idea:String(idea.index),month:String(idea.month),interest:idea.interest})}`;}
export function normalizeIdeas(value:unknown):SavedIdea[]{
  if(!Array.isArray(value))return [];
  return value.flatMap(item=>{
    if(typeof item==='string')return item in areaContent?[ideaFromParams(item,new URLSearchParams())]:[];
    if(!item||typeof item!=='object'||!(item.areaKey in areaContent))return [];
    return [ideaFromParams(item.areaKey,new URLSearchParams({month:String(item.month),interest:String(item.interest),idea:String(item.index)}))];
  });
}

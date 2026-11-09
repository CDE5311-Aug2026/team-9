export const extraInterestGroups = [
  {label:'Marine animals', category:'Marine life', topics:['Whale sharks','Turtles','Manta rays','Clownfish','Moray eels','Cuttlefish','Mantis shrimp']},
  {label:'Photography styles', category:'Photography', topics:['Blackwater photography','Wide-angle photography','Split-level photography','Underwater portraits']},
  {label:'Coastal scenery', category:'Natural scenery', topics:['Black-sand beaches','Limestone islands','Lagoons','Coastal sunsets']},
  {label:'Local culture', category:'Culture & heritage', topics:['Fishing villages','Local crafts','Coastal food']},
];
const extraTopics=extraInterestGroups.flatMap(group=>group.topics);
export const suggestedInterests=['Whale sharks','Blackwater photography','Coral reefs','Local culture','Turtles','Macro photography'];
const matches:[string,RegExp][]=[
 ['Wide-angle photography',/wide.angle photography/i],['Whale sharks',/whale\s*sharks?|鲸鲨/i],['Blackwater photography',/black\s*water|黑水/i],
 ['Coral reefs',/corals?|珊瑚/i],['Turtles',/turtles?|海龟/i],['Macro photography',/macro|微距/i],
 ['Local culture',/local culture|heritage|culture|人文|文化/i],['Photography',/photograph|camera|摄影/i],
 ['Natural scenery',/scenery|landscape|风景|景观/i],['Marine life',/marine life|海洋生物/i],
];
export function parseInterests(text:string){
 const parts=text.split(/[,，;；\n]/).map(s=>s.trim()).filter(Boolean);
 return uniqueInterests(parts.flatMap(part=>{
   const exact=extraTopics.find(topic=>topic.toLowerCase()===part.toLowerCase());
   if(exact)return [exact];
   const found=matches.filter(([,pattern])=>pattern.test(part)).map(([name])=>name);
   if(found.includes('Wide-angle photography')||found.includes('Blackwater photography')||found.includes('Macro photography'))return found.filter(name=>name!=='Photography');
   return found.length?found:[part.slice(0,100)];
 }));
}
export function uniqueInterests(values:string[]){return [...new Map(values.map(value=>[value.toLowerCase(),value])).values()];}
export function selectedInterests(params:URLSearchParams,fallback:string[]=[]){if(!params.has('interest')&&!params.has('interestsEdited'))return uniqueInterests(fallback);return uniqueInterests(params.getAll('interest').flatMap(value=>value?parseInterests(value):[]));}
export function interestCategory(interest:string){
 const group=extraInterestGroups.find(group=>group.topics.includes(interest));
 if(group)return group.category;
 if(interest==='Local culture')return 'Culture & heritage';
 if(interest==='Coral reefs')return 'Marine life';
 if(interest==='Wide-angle photography'||interest==='Macro photography')return 'Photography';
 return interest;
}

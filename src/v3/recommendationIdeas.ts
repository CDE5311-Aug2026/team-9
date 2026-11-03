import {interestCategory} from './exploreInterests';
import type {AreaContent} from './companionData';
export const browsingInterests=['Marine life','Natural scenery','Culture & heritage','Photography'] as const;
export function recommendationIdeas(area:AreaContent, interest:string){
 interest=interestCategory(interest);
 if(interest==='Culture & heritage')return [
  {photo:area.dives[0].photo,tag:area.short+' · ON LAND',title:'Village walks',subtitle:'Local food · village life',topic:'village'},
  {photo:area.dives[1].photo,tag:area.short+' · CULTURE',title:'Local craft visits',subtitle:'Workshops · local makers',topic:'craft'},
 ];
 const scenes=area.key==='amed'?[['Amed coast','Black-sand beach · fishing boats'],['Jemeluk Bay','Sunset · bay views']]:[['Pianemo islands','Karst islands · turquoise lagoons'],['Pianemo viewpoint','Island panoramas · clear water']];
 return area.dives.map((d,i)=>({...d,topic:'reef',title:scenes[i][0],subtitle:scenes[i][1]}));
}

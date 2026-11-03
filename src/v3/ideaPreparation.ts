import {interestCategory} from './exploreInterests';
import type {SavedIdea} from './savedIdeas';
export function ideaPreparation(idea:SavedIdea){
 const interest=interestCategory(idea.interest);
 const amed=idea.areaKey==='amed',closeup=idea.index===1;
 const site=amed?(closeup?'Lipah Bay':'Jemeluk Bay'):(closeup?'Sardine Reef':'Cape Kri');
 if(interest==='Culture & heritage')return {title:closeup?'Start with a local craft visit':'Make time for a village walk',reason:closeup?'A land-based stop to add between dives.':'A slower way to get to know the place beyond the reef.',tasks:['Ask your host for a locally led visit.','Check opening hours and visiting arrangements.']};
 if(interest==='Photography')return {title:`Try ${site}`,reason:closeup?'Build your photo plan around small reef details.':'Start with a wide reef scene, then look for a closer detail.',tasks:[closeup?'Practise your camera’s close-focus mode.':'Choose a wide-angle camera setup.','Charge your camera and clear storage space.']};
 if(interest==='Natural scenery')return {title:`Start at ${site}`,reason:'Put reef scenery at the centre of this trip idea.',tasks:['Shortlist this site with your local operator.','Choose one reef scene you want to explore.']};
 return {title:`Meet the reef at ${site}`,reason:'Choose one reef subject to watch more closely.',tasks:['Pick one species you would like to recognise.','Ask your operator which sites suit your experience.']};
}

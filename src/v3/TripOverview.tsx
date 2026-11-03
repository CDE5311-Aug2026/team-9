import {AIIcon} from './AIIcon';
import {EquipmentAdvice} from './Equipment';
import {areaContent,companionPhotos} from './companionData';
import {interestCategory} from './exploreInterests';
export function TripOverview({areaKey,interest}:{areaKey:string;interest:string}){
 const area=areaContent[areaKey as keyof typeof areaContent],amed=areaKey==='amed',culture=interestCategory(interest)==='Culture & heritage';
 return <><section className="c-visual-trip"><div className="c-trip-overview-heading"><AIIcon/><h2>Explore this idea</h2></div><div className="c-trip-photo-grid"><figure><img src={area.dives[0].photo} alt={amed?"Amed coast with fishing boats":"Pianemo islands, Raja Ampat"}/><figcaption><small>AROUND THE AREA</small><h3>{amed?'Amed coast':'Pianemo islands'}</h3></figcaption></figure><figure><img src={amed?companionPhotos.clown:companionPhotos.tang} alt="Colourful reef fish"/><figcaption><small>LOOK CLOSER</small><h3>A photo to bring home</h3></figcaption></figure></div><p className="c-trip-land-note">Between dives · {culture?'A locally led walk or craft visit.':'A coastal walk, a local meal, no rush.'}</p></section>
 <details className="c-trip-planning"><summary>Help me prepare<span aria-hidden="true">＋</span></summary><div><EquipmentAdvice/><section className="c-card c-trip-essentials"><h2>One thing to arrange</h2><p>{culture?'Ask your host about local visits and opening times.':'Check your site choice and the day’s conditions with your dive operator.'}</p></section></div></details></>;
}

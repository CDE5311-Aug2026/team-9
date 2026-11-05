import {ExploreArrow} from './ExploreArrow';
import {Go} from './UI';
export function DestinationTile({photo,title,to}:{photo:string;title:string;subtitle:string;tag:string;to:string}){
 return <article className={'c-destination-tile'+(!photo?' is-text':'')}><Go to={to} aria-label={'Explore '+title.replace(/\n/g,' ')}>{photo&&<img src={photo} alt="" loading="lazy"/>}<div className="c-tile-copy"><h3>{title.replace(/\n/g,' ')}</h3><span className="c-tile-open">Explore <ExploreArrow/></span></div></Go></article>;
}

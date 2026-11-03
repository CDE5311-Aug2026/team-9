import {Go} from './UI';
export function DestinationTile({photo,title,subtitle,tag,to}:{photo:string;title:string;subtitle:string;tag:string;to:string}){
 return <article className={'c-destination-tile'+(!photo?' is-text':'')}><Go to={to} aria-label={'Explore '+title.replace(/\n/g,' ')}>{photo&&<img src={photo} alt="" loading="lazy"/>}<div className="c-tile-copy"><small>{tag}</small><h3>{title.replace(/\n/g,' ')}</h3><p>{subtitle}</p><span className="c-tile-open">Explore idea <span aria-hidden="true">↗</span></span></div></Go></article>;
}

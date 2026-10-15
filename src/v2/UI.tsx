import type {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {art,home} from './model';
export function Go({to,children,className=''}:{to:string;children:ReactNode;className?:string}){return <Link className={className} to={'/v2/'+to}>{children}</Link>}
export function Back({to='home',label='Back'}:{to?:string;label?:string}){return <Go className="v-back" to={to}>← {label}</Go>}
export function Button({children,onClick,disabled=false,secondary=false}:{children:ReactNode;onClick:()=>void;disabled?:boolean;secondary?:boolean}){return <button className={'v-button '+(secondary?'secondary':'')} disabled={disabled} onClick={onClick}>{children}</button>}
export function Panel({children,className=''}:{children:ReactNode;className?:string}){return <section className={'v-panel '+className}>{children}</section>}
export function Status(){return <div className="v-status" aria-hidden="true"><span>9:41</span><div>{['imgIosSignal','imgIosWifiSignal','imgIosBatteryFull'].map(k=><img key={k} src={home[k]} alt="" />)}</div></div>}
export function Nav({page}:{page:string}){return <footer className="v-nav"><nav aria-label="Main navigation">{['Home','Explore','Identify','Collection','Profile'].map(name=><Go key={name} to={name.toLowerCase()} className={page.startsWith(name.toLowerCase())?'active':''}><span className={name==='Identify'?'v-plus':''}><img alt="" src={name==='Identify'?home.imgDiveDexV2IconPlus5:(art[page==='collection'?'190:16269':page==='explore'?'190:16088':page==='profile'?'190:15482':'v2home']||home)['imgDiveDexV2NavigationIcon'+name]}/></span>{name}</Go>)}</nav><div className="v-indicator"><i/></div></footer>}

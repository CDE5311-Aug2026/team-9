import type {ReactNode, MouseEventHandler} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {art,home} from './model';
export function Go({to,children,className='',onClick}:{to:string;children:ReactNode;className?:string;onClick?:MouseEventHandler<HTMLAnchorElement>}){const location=useLocation();return <Link state={{from:location.pathname+location.search,returnState:location.state}} onClick={onClick} className={className} to={'/v3/'+to}>{children}</Link>}
export function Back({to='home',label='Back',force=false}:{to?:string;label?:string;force?:boolean}){
 const location=useLocation(),navigate=useNavigate();
 const from=!force&&typeof location.state?.from==='string'&&location.state.from.startsWith('/v3/')&&location.state.from!==location.pathname+location.search?location.state.from:null;
 const destination=from??'/v3/'+to;
 const names:Record<string,string>={home:'Home',explore:'Explore',collection:'Collection',profile:'Profile',settings:'Settings',identify:'Photos',welcome:'Welcome'};
 const name=names[destination.split('?')[0].replace('/v3/','')]??label;
 return <button type="button" className="v-back c-back" aria-label={'Back'+(name==='Back'?'':' to '+name)} onClick={()=>navigate(destination,{replace:true,state:from?location.state?.returnState:null})}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Back</span></button>;
}
export function Button({children,onClick,disabled=false,secondary=false}:{children:ReactNode;onClick:()=>void;disabled?:boolean;secondary?:boolean}){return <button className={'v-button '+(secondary?'secondary':'')} disabled={disabled} onClick={onClick}>{children}</button>}
export function Panel({children,className=''}:{children:ReactNode;className?:string}){return <section className={'v-panel '+className}>{children}</section>}
export function Status(){return <div className="v-status" aria-hidden="true"><span>9:41</span><div>{['imgIosSignal','imgIosWifiSignal','imgIosBatteryFull'].map(k=><img key={k} src={home[k]} alt="" />)}</div></div>}
export function Nav({page}:{page:string}){return <footer className="v-nav"><nav aria-label="Main navigation">{['Home','Explore','Identify','Collection','Profile'].map(name=><Go key={name} to={name.toLowerCase()} className={page.startsWith(name.toLowerCase())?'active':''}><span className={name==='Identify'?'v-plus':''}><img alt="" src={name==='Identify'?home.imgDiveDexV2IconPlus5:(art[page==='collection'?'427:2893':page==='explore'?'427:2817':page==='profile'?'427:2427':'509:3559']||home)['imgDiveDexV2NavigationIcon'+name]}/></span>{name}</Go>)}</nav><div className="v-indicator"><i/></div></footer>}

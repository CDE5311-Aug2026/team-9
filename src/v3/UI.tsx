import type {ReactNode, MouseEventHandler} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {art,home} from './model';
export function Go({to,children,className='',onClick}:{to:string;children:ReactNode;className?:string;onClick?:MouseEventHandler<HTMLAnchorElement>}){const location=useLocation();return <Link state={{from:location.pathname+location.search}} onClick={onClick} className={className} to={'/v3/'+to}>{children}</Link>}
export function Back({to='home',label='Back'}:{to?:string;label?:string}){
 const location=useLocation(),navigate=useNavigate();
 const from=typeof location.state?.from==='string'&&location.state.from.startsWith('/v3/')?location.state.from:null;
 const names:Record<string,string>={home:'Home',explore:'Explore',collection:'My Collection',profile:'Profile',settings:'Settings'};
 const origin=from?.split('?')[0].replace('/v3/','');
 const text=from?(names[origin??'']??'Back'):label;
 return <button className="v-back c-back" onClick={()=>from?navigate(-1):navigate('/v3/'+to,{replace:true})}>← {text}</button>;
}
export function Button({children,onClick,disabled=false,secondary=false}:{children:ReactNode;onClick:()=>void;disabled?:boolean;secondary?:boolean}){return <button className={'v-button '+(secondary?'secondary':'')} disabled={disabled} onClick={onClick}>{children}</button>}
export function Panel({children,className=''}:{children:ReactNode;className?:string}){return <section className={'v-panel '+className}>{children}</section>}
export function Status(){return <div className="v-status" aria-hidden="true"><span>9:41</span><div>{['imgIosSignal','imgIosWifiSignal','imgIosBatteryFull'].map(k=><img key={k} src={home[k]} alt="" />)}</div></div>}
export function Nav({page}:{page:string}){return <footer className="v-nav"><nav aria-label="Main navigation">{['Home','Explore','Identify','Collection','Profile'].map(name=><Go key={name} to={name.toLowerCase()} className={page.startsWith(name.toLowerCase())?'active':''}><span className={name==='Identify'?'v-plus':''}><img alt="" src={name==='Identify'?home.imgDiveDexV2IconPlus5:(art[page==='collection'?'427:2893':page==='explore'?'427:2817':page==='profile'?'427:2427':'509:3559']||home)['imgDiveDexV2NavigationIcon'+name]}/></span>{name}</Go>)}</nav><div className="v-indicator"><i/></div></footer>}

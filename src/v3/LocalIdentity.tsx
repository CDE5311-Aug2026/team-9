import {useState} from 'react';
import {Back,Go} from './UI';
import {read} from './model';

export type Identity = {name:string;email:string};
type Account = Identity & {salt:string;hash:string};
export const initials = (name:string) => name.split(/\s+/).slice(0,2).map(part=>Array.from(part)[0]).join('').toUpperCase();

async function passwordHash(password:string, salt:string) {
  const bytes = new TextEncoder();
  const key = await crypto.subtle.importKey('raw',bytes.encode(password),'PBKDF2',false,['deriveBits']);
  const digest = await crypto.subtle.deriveBits({name:'PBKDF2',salt:bytes.encode(salt),iterations:210000,hash:'SHA-256'},key,256);
  return Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
}

export function LocalAccount({login,onSuccess}:{login:boolean;onSuccess:(user:Identity)=>void}) {
  const [error,setError]=useState(''),[busy,setBusy]=useState(false);
  return <><Back to="welcome"/><h1>{login?'Welcome back.':'Create your account'}</h1>
    <form className="v-form" onSubmit={async event=>{
      event.preventDefault();
      if(busy)return;
      const fields=new FormData(event.currentTarget);
      const email=String(fields.get('email')).trim().toLowerCase(),password=String(fields.get('password'));
      setBusy(true);setError('');
      try {
        let account=read<Account|null>('localAccount',null);
        if(login){
          if(!account||account.email!==email||await passwordHash(password,account.salt)!==account.hash){setError('Check your email and password.');return;}
        }else{
          const name=String(fields.get('name')).trim();
          if(!name){setError('Enter your name.');return;}
          if(account){setError('A profile already exists on this device. Log in to continue.');return;}
          const salt=crypto.randomUUID();
          account={email,name,salt,hash:await passwordHash(password,salt)};
          localStorage.setItem('divedex.v3.localAccount',JSON.stringify(account));
        }
        onSuccess({name:account.name,email:account.email});
      }catch{setError('This browser could not save or open the local profile.');}
      finally{setBusy(false);}
    }}>
      {!login&&<label>Your name<input name="name" className="v-input" autoComplete="name" maxLength={60} required/></label>}
      <label>Email<input name="email" className="v-input" type="email" autoComplete="email" required/></label>
      <label>Password<input name="password" className="v-input" type="password" minLength={8} placeholder="At least 8 characters" autoComplete={login?'current-password':'new-password'} required/></label>
      {error&&<p role="alert">{error}</p>}
      <button className="c-primary" disabled={busy}>{login?'Log in':'Create account'}</button>
    </form><Go className="c-text-button" to={login?'signup':'login'}>{login?'Create an account':'Already registered? Log in'}</Go></>;
}

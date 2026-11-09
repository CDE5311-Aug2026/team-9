import {DialogClose} from './DialogClose';
import {createContext, useContext, useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import {Modal} from './CompanionUI';
import {Go} from './UI';
import {read, species} from './model';

const key = 'marineWishlist';
const Wishlist = createContext<{ids:number[]; toggle:(id:number)=>void} | null>(null);

export function MarineWishlist({children}:{children:ReactNode}) {
  const [ids,setIds] = useState<number[]>(() => {
    const stored = read<unknown>(key, []);
    return Array.isArray(stored) ? [...new Set(stored.filter(id => Number.isInteger(id) && species[id]))] : [];
  });
  useEffect(() => {
    try { localStorage.setItem('divedex.v3.' + key, JSON.stringify(ids)); } catch { /* Keep the in-session list available. */ }
  }, [ids]);
  function toggle(id:number) {
    setIds(current => current.includes(id) ? current.filter(value => value !== id) : [...current,id]);
  }
  return <Wishlist.Provider value={{ids,toggle}}>{children}</Wishlist.Provider>;
}

function Bookmark({filled=false}:{filled?:boolean}) {
  return <svg aria-hidden="true" width="18" height="20" viewBox="0 0 24 24" fill={filled?'currentColor':'none'}>
    <path d="M6 3h12v18l-6-4-6 4V3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
  </svg>;
}

export function useWantedSpecies() {
  return useContext(Wishlist)!.ids;
}

export function SaveSpecies({id}:{id:number}) {
  const list = useContext(Wishlist)!;
  const saved = list.ids.includes(id);
  const label = (saved?'Remove ':'Save ') + species[id].name + (saved?' from':' to') + ' Want to see';
  return <button type="button" className="c-species-bookmark" aria-label={label} title={label}
    aria-pressed={saved} onClick={()=>list.toggle(id)}><Bookmark filled={saved}/></button>;
}

export function WishlistButton({tile=false,profile=false}:{tile?:boolean;profile?:boolean} = {}) {
  const list = useContext(Wishlist)!;
  const [open,setOpen] = useState(false);
  return <>
    <button className={tile ? "c-home-section-link c-wishlist-tile-title" : profile ? "c-wishlist-open c-profile-wishlist" : "c-wishlist-icon"} aria-label={tile||profile?undefined:`Want to see · ${list.ids.length} saved`} title="Want to see" aria-haspopup="dialog" onClick={()=>setOpen(true)}>
      {tile ? <><Bookmark filled/><span>Want to see<small>{list.ids.length} saved</small></span><span aria-hidden="true">→</span></> : profile ? <><Bookmark filled/><strong>Want to see</strong><small>{list.ids.length} saved</small><span aria-hidden="true">→</span></> : <Bookmark filled/>}
    </button>
    {open && <Modal label="Want to see" onClose={()=>setOpen(false)} motion>
      <div className="c-dialog-heading"><h2>Want to see</h2><DialogClose label="Close list" onClose={()=>setOpen(false)}/></div>
      {list.ids.length===0 && <p>Tap the bookmark on a species to save it here.</p>}
      {list.ids.map(id=><div className="c-wishlist-row" key={id}>
        <Go to={'guide/'+id}><img src={species[id].photo} alt=""/>{species[id].name}</Go>
        <SaveSpecies id={id}/>
      </div>)}
    </Modal>}
  </>;
}

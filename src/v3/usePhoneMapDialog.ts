import {useLayoutEffect} from 'react';
import type {RefObject} from 'react';

// Native dialogs enter the top layer; pin them to the scaled phone, not the window.
export function usePhoneMapDialog(ref:RefObject<HTMLDialogElement|null>,open:boolean){
 useLayoutEffect(()=>{
  const dialog=ref.current;
  if(!open||!dialog)return;
  const phone=dialog.closest<HTMLElement>('.v3');
  if(!phone)return;
  const fit=()=>{
   const bounds=phone.getBoundingClientRect(),scale=bounds.width/phone.offsetWidth;
   Object.assign(dialog.style,{zoom:String(1/scale),left:`${bounds.left}px`,top:`${bounds.top}px`,width:`${bounds.width}px`,height:`${bounds.height}px`,borderRadius:`${parseFloat(getComputedStyle(phone).borderRadius)||0}px`});
   dialog.style.setProperty('--map-dialog-scale',String(scale));
  };
  fit();dialog.showModal();
  const observer=new ResizeObserver(fit);observer.observe(phone);
  window.addEventListener('resize',fit);
  return()=>{observer.disconnect();window.removeEventListener('resize',fit);dialog.close();};
 },[open,ref]);
}

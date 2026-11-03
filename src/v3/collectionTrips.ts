import {collectionIds} from './model';
export type CollectionTrip={id:string;name:string;short:string;month:string;dates:string;point:[number,number];ids:number[]};
// Seeded travel history for the clickable prototype. New identifications stay unassigned.
export function collectionTrips(saved:number[]):CollectionTrip[]{
 const trips:CollectionTrip[]=[
  {id:'bali-oct',name:'Bali, Indonesia',short:'Bali',month:'Oct 2026',dates:'7–10 Oct 2026',point:[-8.337,115.660],ids:[4,3,0,8,9,10,12,13,16]},
  {id:'philippines-jun',name:'Cebu, Philippines',short:'Cebu',month:'Jun 2026',dates:'12–16 Jun 2026',point:[9.46,123.38],ids:[1,5,11,14,15,17]},
 ];
 const known=new Set(trips.flatMap(t=>t.ids));const extra=collectionIds(saved).filter(id=>!known.has(id));
 if(extra.length)trips.unshift({id:'unassigned',name:'Not added to a trip',short:'Recent',month:'New finds',dates:'Location not set',point:[0,0],ids:extra});
 return trips;
}

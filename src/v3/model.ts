import raw from '../v2/assets.json';
import updated from './assets.json';
export const art = {...raw,...updated} as Record<string, Record<string,string>>;
export const home = {...art.v2home,...art['509:3559']};
export const photos = Array.from({length:8},(_,i)=>art['190:14931'][`imgLibraryPhotograph${i||''}`]);
export const species = [
 {name:'Clown Anemonefish',latin:'Amphiprion ocellaris',category:'Fish',photo:photos[0],art:art['190:16219'].imgScientificSpecimenClownAnemonefish,count:1},
 {name:'Green Turtle',latin:'Chelonia mydas',category:'Turtles',photo:photos[1],art:home.imgRectangle2,count:5},
 {name:'Reef Manta Ray',latin:'Mobula alfredi',category:'Fish',photo:photos[4],art:photos[4],count:3},
 {name:'Moorish Idol',latin:'Zanclus cornutus',category:'Fish',photo:photos[2],art:photos[2],count:1},
 {name:'Blue Tang',latin:'Paracanthurus hepatus',category:'Fish',photo:photos[7],art:home.imgRectangle1,count:1},
 {name:'Whale Shark',latin:'Rhincodon typus',category:'Fish',photo:'/v3/specimens/whale-shark.jpg',art:'/v3/specimens/whale-shark.jpg',count:3},
 {name:'Giant Moray',latin:'Gymnothorax javanicus',category:'Fish',photo:photos[6],art:photos[6],count:1},
 {name:'Blacktip Reef Shark',latin:'Carcharhinus melanopterus',category:'Fish',photo:photos[5],art:photos[5],count:1},
 {name:"Banded Cleaner Shrimp",latin:"Stenopus hispidus",category:"Critters",photo:'/v3/specimens/shrimp.jpg',art:'/v3/specimens/shrimp.jpg',count:1},
 {name:"Spotted Hermit Crab",latin:"Dardanus megistos",category:"Critters",photo:'/v3/specimens/hermit.jpg',art:'/v3/specimens/hermit.jpg',count:1},
 {name:"Branching Coral",latin:"Acropora sp.",category:"Corals",photo:'/v3/specimens/coral.jpg',art:'/v3/specimens/coral.jpg',count:1},
 {name:"Moon Jelly",latin:"Aurelia aurita",category:"Other",photo:'/v3/specimens/jelly.jpg',art:'/v3/specimens/jelly.jpg',count:1},
 {name:'Red Lionfish',latin:'Pterois volitans',category:'Fish',photo:'/v3/specimens/lionfish.jpg',art:'/v3/specimens/lionfish.jpg',count:1},
 {name:'Blue Sea Star',latin:'Linckia laevigata',category:'Critters',photo:'/v3/specimens/blue-sea-star.jpg',art:'/v3/specimens/blue-sea-star.jpg',count:1},
 {name:'Maxima Clam',latin:'Tridacna maxima',category:'Other',photo:'/v3/specimens/maxima-clam.jpg',art:'/v3/specimens/maxima-clam.jpg',count:1},
 {name:'Peacock Mantis Shrimp',latin:'Odontodactylus scyllarus',category:'Critters',photo:'/v3/specimens/mantis-shrimp.jpg',art:'/v3/specimens/mantis-shrimp.jpg',count:1},
 {name:'Leather Coral',latin:'Sarcophyton glaucum',category:'Corals',photo:'/v3/specimens/leather-coral.jpg',art:'/v3/specimens/leather-coral.jpg',count:1},
 {name:'Broadclub Cuttlefish',latin:'Ascarosepion latimanus',category:'Critters',photo:'/v3/specimens/reef-cuttlefish.jpg',art:'/v3/specimens/reef-cuttlefish.jpg',count:1},
];
export const categories=[['Fish','Fish, sharks, rays & seahorses'],['Turtles','All sea turtles'],['Critters','Crabs, shrimp, octopus, sea slugs & stars'],['Corals','Corals & anemones'],['Other','Dolphins, jellyfish & more']];
export function read<T>(key:string,fallback:T):T {try{return JSON.parse(localStorage.getItem('divedex.v3.'+key)||'null')??fallback;}catch{return fallback;}}

export const v3 = updated as Record<string,Record<string,string>>;
species[4].photo=v3['427:2893'].imgRectangle;
species[3].photo=v3['427:2893'].imgRectangle1;
species[0].photo=v3['427:2893'].imgRectangle2;

// Existing collection entries, including the whale shark in the dive log.
export const initialCollectionIds = [4, 3, 0, 1, 2, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
export function collectionIds(saved: number[]) {return [...new Set([...initialCollectionIds, ...saved])].filter(id => !!species[id]);}

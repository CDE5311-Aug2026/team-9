import raw from './assets.json';
export const art = raw as Record<string, Record<string,string>>;
export const home = art.v2home;
export const photos = Array.from({length:8},(_,i)=>art['190:14931'][`imgLibraryPhotograph${i||''}`]);
export const species = [
 {name:'Clown Anemonefish',latin:'Amphiprion ocellaris',category:'Fish',photo:photos[0],art:art['190:16219'].imgScientificSpecimenClownAnemonefish,count:1},
 {name:'Green Turtle',latin:'Chelonia mydas',category:'Turtles',photo:photos[1],art:home.imgRectangle2,count:5},
 {name:'Reef Manta Ray',latin:'Mobula alfredi',category:'Fish',photo:photos[4],art:photos[4],count:3},
 {name:'Moorish Idol',latin:'Zanclus cornutus',category:'Fish',photo:photos[2],art:photos[2],count:1},
 {name:'Blue Tang',latin:'Paracanthurus hepatus',category:'Fish',photo:photos[7],art:home.imgRectangle1,count:1},
 {name:'Whale Shark',latin:'Rhincodon typus',category:'Fish',photo:art['304:2516'].imgWhaleSharkPreviouslyCollected,art:art['312:3753'].imgRectangle1,count:3},
 {name:'Giant Moray',latin:'Gymnothorax javanicus',category:'Fish',photo:photos[6],art:photos[6],count:1},
 {name:'Blacktip Reef Shark',latin:'Carcharhinus melanopterus',category:'Fish',photo:photos[5],art:photos[5],count:1},
];
export const categories=[['Fish','Fish, sharks, rays & seahorses'],['Turtles','All sea turtles'],['Critters','Crabs, shrimp, octopus, sea slugs & stars'],['Corals','Corals & anemones'],['Other','Dolphins, jellyfish & more']];
export function read<T>(key:string,fallback:T):T {try{return JSON.parse(localStorage.getItem('divedex.v2.'+key)||'null')??fallback;}catch{return fallback;}}

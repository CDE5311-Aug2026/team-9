import {species} from './model';
export const stages = ['Just exploring', 'At the spot', 'After a dive'] as const;
export type Stage = typeof stages[number];
export const exploreTabs = ['Dive sites', 'Marine life', 'Experiences'] as const;
export type ExploreTab = typeof exploreTabs[number];
export const interests = ['Marine life', 'Dive destinations', 'Underwater photography', 'Learn & improve'] as const;
export type Interest = typeof interests[number];
export type Preferences = {interests: Interest[]; experience: string; plan: string};
export const defaultPreferences: Preferences = {interests: ['Underwater photography'], experience: '', plan: ''};
export const companionPhotos = {
  manta: '/v3/companion/manta.png', turtle: '/v3/companion/turtle.png',
  clown: '/v3/companion/clown.png', tang: '/v3/companion/tang.png', idol: '/v3/companion/idol.png',
  moray: '/v2/f5c7cf9d-5f08-47c6-bac4-8616f2910736.png', shark: '/v2/6f1c33bd-f717-4a0b-83b8-4f7222243efe.png',
};
export const marinePhotos: Record<number, string> = {...Object.fromEntries(species.map((s,id)=>[id,s.photo])),0: companionPhotos.clown, 1: companionPhotos.turtle, 2: companionPhotos.manta, 3: companionPhotos.idol, 4: companionPhotos.tang, 6: companionPhotos.moray, 7: companionPhotos.shark};
export const marineNames: Record<number, string> = {...Object.fromEntries(species.map((s,id)=>[id,s.name])),0: 'Clownfish', 1: 'Sea turtle', 2: 'Manta ray', 3: 'Moorish idol', 4: 'Blue tang', 6: 'Giant moray', 7: 'Blacktip shark'};
export type AreaKey = 'amed' | 'raja';
export type AreaContent = {
  key: AreaKey; label: string; short: string; region: string; map: string; mapNote: string;
  marine: number[]; study: string; cleanup: string; latitude: number; longitude: number; radiusKm: number;
  dives: {photo: string; tag: string; title: string; subtitle: string}[];
};
export const areaContent: Record<AreaKey, AreaContent> = {
  amed: {key: 'amed', label: 'Amed, Bali', short: 'Amed', region: 'Bali, Indonesia',
    map: '/v3/companion/amed-map.png', mapNote: 'Apple Maps · Amed / illustrative locations',
    marine: [12, 6, 15, 7, 16, 0, 13, 17, 1, 14, 4, 3], study: 'Bali Reef Fish Photo Study', cleanup: 'Amed Shoreline Cleanup',
    latitude: -8.336, longitude: 115.656, radiusKm: 15,
    dives: [
      {photo: '/v3/destinations/amed-coast.jpg', tag: 'AMED, BALI · REEF DIVE', title: 'A slower look at the reef', subtitle: 'Coral gardens. Small details. Bring your camera.'},
      {photo: '/v3/destinations/jemeluk-sunset.jpg', tag: 'BALI · PHOTOGRAPHY INSPIRATION', title: 'Get a little closer', subtitle: 'Discover the little characters of the reef.'},
    ]},
  raja: {key: 'raja', label: 'Raja Ampat, Indonesia', short: 'Raja Ampat', region: 'Raja Ampat, Indonesia',
    map: '/v3/companion/raja-map.svg', mapNote: 'Raja Ampat · schematic map / illustrative content',
    marine: [2, 17, 16, 7, 14, 1, 15, 6, 13, 12, 0, 3, 4], study: 'Raja Ampat Manta Photo Study', cleanup: 'Island Shoreline Cleanup',
    latitude: -0.423, longitude: 130.82, radiusKm: 80,
    dives: [
      {photo: '/v3/destinations/raja-islands.jpg', tag: 'RAJA AMPAT · ISLAND EXPLORATION', title: 'Between islands\nand open blue.', subtitle: 'A different perspective for your next dive.'},
      {photo: '/v3/destinations/raja-lagoon.jpg', tag: 'RAJA AMPAT · REEF INSPIRATION', title: 'Follow your curiosity', subtitle: 'Explore the colours of a different reef.'},
    ]},
};
export function getArea(value: string): AreaContent | undefined {
  const name = value.trim().toLowerCase();
  if (['amed', 'amed, bali', 'bali', 'bali, indonesia'].includes(name)) return areaContent.amed;
  if (['raja', 'raja ampat', 'raja ampat, indonesia'].includes(name)) return areaContent.raja;
}
export function nearbyArea(latitude: number, longitude: number, accuracy: number): AreaContent | undefined {
  if (![latitude, longitude, accuracy].every(Number.isFinite) || accuracy < 0 || accuracy > 10000) return;
  const rad = Math.PI / 180;
  const candidates = Object.values(areaContent).map(area => {
    const dLat = (latitude - area.latitude) * rad, dLon = (longitude - area.longitude) * rad;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(latitude * rad) * Math.cos(area.latitude * rad) * Math.sin(dLon / 2) ** 2;
    return {area, distance: 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))};
  }).filter(({area, distance}) => distance <= area.radiusKm);
  return candidates.sort((a, b) => a.distance - b.distance)[0]?.area;
}
export function recommendationReason(prefs: Preferences) {
  if (prefs.interests.includes('Underwater photography')) return 'For your photography side';
  if (prefs.interests.includes('Marine life')) return 'For your love of marine life';
  if (prefs.experience === 'Learning to dive' || prefs.interests.includes('Learn & improve')) return 'A little inspiration for your diving journey';
  return 'A little inspiration for your next escape';
}

export function seasonalRecommendation(area: AreaKey, prefs: Preferences, date = new Date()) {
  const month = date.getMonth() + 1;
  const monthName = date.toLocaleString('en-US', {month:'long'});
  const inSeason = area === 'raja' ? month >= 10 || month <= 4 : month >= 4 && month <= 11;
  const timing = area === 'raja'
    ? inSeason ? 'October–April usually brings calmer seas around Raja Ampat.' : 'Plan for October–April, when Raja Ampat’s seas are usually calmer.'
    : inSeason ? 'April–November is a recommended season for Amed’s reef dives.' : 'Plan ahead for Amed’s April–November reef-diving season.';
  const interest = prefs.interests.includes('Underwater photography')
    ? 'You chose underwater photography — explore reef scenes and close-up subjects.'
    : prefs.interests.includes('Marine life')
      ? 'You chose marine life — explore the reef’s different species.'
      : prefs.interests.includes('Learn & improve')
        ? 'You chose learning — get to know the site before planning your dive.'
        : 'You’re exploring this area — these ideas keep your next dive nearby.';
  return {monthName, inSeason, timing, interest, season:area==='raja'?'Oct–Apr':'Apr–Nov', source:area==='raja'?'https://www.padi.com/diving-in/raja-ampat/':'https://www.indonesia.travel/id/id/travel-ideas/marine/location-in-bali-that-diver-s-will-love'};
}

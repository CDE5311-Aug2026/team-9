import { assets } from './assets';
export const specimens = [
  { id: 'clown-anemonefish', name: 'Clown Anemonefish', scientific: 'Amphiprion ocellaris', observations: 1, category: 'Fish', image: assets.collection.speciesArtwork },
  { id: 'whale-shark', name: 'Whale Shark', scientific: 'Rhincodon typus', observations: 3, category: 'Fish', image: assets.collection.speciesArtwork1 },
  { id: 'green-turtle', name: 'Green Turtle', scientific: 'Chelonia mydas', observations: 5, category: 'Turtles', image: assets.collection.speciesArtwork2 },
  { id: 'reef-manta-ray', name: 'Reef Manta Ray', scientific: 'Mobula alfredi', observations: 3, category: 'Fish', image: assets.collection.speciesArtwork3 },
] as const;
export const areas = [
  { id: 'bali', name: 'Bali, Indonesia' },
  { id: 'raja-ampat', name: 'Raja Ampat, Indonesia' },
  { id: 'palau', name: 'Palau' },
  { id: 'amed', name: 'Amed, Bali' },
] as const;
export type AreaId = typeof areas[number]['id'];
export type Notice = { title: string; body: string; image?: string };
export const identificationNotice: Notice = { title: 'More discoveries ahead', body: 'Photo identification is coming soon. For now, explore marine life and revisit your collection.' };

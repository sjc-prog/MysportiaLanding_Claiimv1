export interface Venue {
  id: string;
  name: string;
  area: string;
  city: string;
  address: string;
}

// Well-known real gyms anchor the list so owners recognize the ecosystem.
// In production this is served from the scraped venue DB (~380 records) via API.
const SEED_VENUES: Array<[string, string, string]> = [
  ['Tiger Muay Thai', 'Chalong', 'Phuket'],
  ['Sinbi Muay Thai', 'Rawai', 'Phuket'],
  ['Phuket Muay Thai', 'Kathu', 'Phuket'],
  ['Bangtao Muay Thai & MMA', 'Bang Tao', 'Phuket'],
  ['Sumalee Boxing Gym', 'Thalang', 'Phuket'],
  ['Rawai Supa Muay Thai', 'Rawai', 'Phuket'],
  ['Dragon Muay Thai', 'Chalong', 'Phuket'],
  ['Revolution Muay Thai', 'Kathu', 'Phuket'],
  ['Fairtex Training Center', 'Naklua', 'Pattaya'],
  ['Sitsongpeenong Pattaya', 'Jomtien', 'Pattaya'],
  ['Venum Training Camp', 'Jomtien', 'Pattaya'],
  ['Petchyindee Academy', 'Pomprap', 'Bangkok'],
  ['Yokkao Training Center', 'Sukhumvit', 'Bangkok'],
  ['Attachai Muay Thai Gym', 'On Nut', 'Bangkok'],
  ['Khongsittha Muay Thai', 'Lat Phrao', 'Bangkok'],
  ['Sor Vorapin Gym', 'Banglamphu', 'Bangkok'],
  ['Luktupfah Muay Thai', 'Prawet', 'Bangkok'],
  ['Elite Fight Club Bangkok', 'Thonglor', 'Bangkok'],
  ['Chacrit Muay Thai School', 'Sukhumvit', 'Bangkok'],
  ['Lamai Muay Thai Camp', 'Lamai', 'Koh Samui'],
  ['Superpro Samui', 'Chaweng', 'Koh Samui'],
  ['Wech Pinyo Muay Thai', 'Lamai', 'Koh Samui'],
  ['Jun Muay Thai', 'Bophut', 'Koh Samui'],
  ['KOH FIT Thailand', 'Chaweng', 'Koh Samui'],
  ['Santai Muay Thai', 'San Kamphaeng', 'Chiang Mai'],
  ['Lanna Muay Thai', 'Chang Phueak', 'Chiang Mai'],
  ['Team Quest Thailand', 'Mae Rim', 'Chiang Mai'],
  ['Hongthong Muay Thai', 'Hang Dong', 'Chiang Mai'],
  ['Manop Gym', 'San Sai', 'Chiang Mai'],
  ['Diamond Muay Thai', 'Ao Nang', 'Krabi'],
  ['Emerald Gym', 'Ao Nang', 'Krabi'],
  ['Phuket Fight Club', 'Chalong', 'Phuket'],
  ['AKA Thailand', 'Chalong', 'Phuket'],
  ['Kombat Group', 'Huai Yai', 'Pattaya'],
  ['Por Silaphai Gym', 'Nong Prue', 'Pattaya'],
  ['Muay Thai Sangha', 'Doi Saket', 'Chiang Mai'],
  ['Charn Chai Muay Thai', 'Pai', 'Mae Hong Son'],
  ['Sitjemam Muay Thai', 'Pai', 'Mae Hong Son'],
  ['Monsoon Gym & Fight Club', 'Sairee', 'Koh Tao'],
  ['Island Muay Thai', 'Haad Rin', 'Koh Phangan'],
];

const PREFIXES = [
  'Sit', 'Sor.', 'Por.', 'Kiat', 'Petch', 'Chok', 'Singha', 'Dech', 'Fah', 'Kru',
];
const CORES = [
  'monkon', 'dam', 'rit', 'chai', 'sak', 'yod', 'thong', 'ngern', 'fon', 'narin',
  'prasert', 'wichai', 'anan', 'krung', 'sila', 'wan', 'phet', 'suk', 'daeng', 'lek',
];
const SUFFIX_STYLES = [
  'Muay Thai', 'Muay Thai Gym', 'Boxing Camp', 'Muay Thai Camp', 'Gym',
  'Fight Club', 'Boxing Stadium Gym', 'Muay Thai Academy', 'Training Camp',
];
const LOCATIONS: Array<[string, string[]]> = [
  ['Bangkok', ['Sukhumvit', 'Silom', 'Lat Phrao', 'On Nut', 'Bang Na', 'Thonburi', 'Ramkhamhaeng', 'Ari', 'Din Daeng', 'Bang Kapi']],
  ['Phuket', ['Chalong', 'Rawai', 'Kathu', 'Patong', 'Thalang', 'Kamala', 'Bang Tao', 'Karon']],
  ['Chiang Mai', ['Old City', 'Nimman', 'Hang Dong', 'San Sai', 'Mae Rim', 'Santitham']],
  ['Pattaya', ['Jomtien', 'Naklua', 'Central Pattaya', 'Huai Yai', 'Nong Prue']],
  ['Koh Samui', ['Chaweng', 'Lamai', 'Bophut', 'Maenam', 'Nathon']],
  ['Krabi', ['Ao Nang', 'Krabi Town', 'Klong Muang']],
  ['Hua Hin', ['Hua Hin Town', 'Khao Takiab', 'Cha-am']],
  ['Koh Phangan', ['Thong Sala', 'Haad Rin', 'Srithanu']],
  ['Udon Thani', ['Mueang Udon', 'Nong Bua']],
  ['Khon Kaen', ['Mueang Khon Kaen', 'Nai Mueang']],
];

// Deterministic PRNG so the generated list is stable across reloads.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildVenues(): Venue[] {
  const rand = mulberry32(20260714);
  const venues: Venue[] = SEED_VENUES.map(([name, area, city], i) => ({
    id: `v${i + 1}`,
    name,
    area,
    city,
    address: `${area}, ${city}, Thailand`,
  }));

  const seen = new Set(venues.map((v) => v.name.toLowerCase()));
  let id = venues.length + 1;

  while (venues.length < 380) {
    const prefix = PREFIXES[Math.floor(rand() * PREFIXES.length)];
    const core = CORES[Math.floor(rand() * CORES.length)];
    const suffix = SUFFIX_STYLES[Math.floor(rand() * SUFFIX_STYLES.length)];
    const joined = prefix.endsWith('.') ? `${prefix} ${capitalize(core)}` : `${prefix}${core}`;
    const name = `${joined} ${suffix}`;
    if (seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());

    const [city, areas] = LOCATIONS[Math.floor(rand() * LOCATIONS.length)];
    const area = areas[Math.floor(rand() * areas.length)];
    venues.push({
      id: `v${id++}`,
      name,
      area,
      city,
      address: `${area}, ${city}, Thailand`,
    });
  }
  return venues;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const VENUES: Venue[] = buildVenues();

export function searchVenues(query: string, limit = 6): Venue[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const starts: Venue[] = [];
  const contains: Venue[] = [];
  for (const v of VENUES) {
    const hay = `${v.name} ${v.area} ${v.city}`.toLowerCase();
    if (v.name.toLowerCase().startsWith(q)) starts.push(v);
    else if (hay.includes(q)) contains.push(v);
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}

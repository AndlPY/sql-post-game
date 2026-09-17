export interface LevelProgress { stars: number; completed: boolean }
export interface Profile { version: 1; nickname: string; gender: 'female' | 'male'; coins: number; stars: number; completed: boolean; uiTutorialSeen?: boolean; levels?: Record<string, LevelProgress> }
const key = 'sql-post.profile.v1';
export const defaultProfile: Profile = { version: 1, nickname: '', gender: 'female', coins: 0, stars: 0, completed: false };
export function parseProfile(raw: string | null): Profile {
  if (!raw) return { ...defaultProfile };
  const p = JSON.parse(raw);
  if (p.version !== 1 || typeof p.nickname !== 'string' || p.nickname.length > 24 || !['female', 'male'].includes(p.gender) || !Number.isSafeInteger(p.coins) || p.coins < 0 || !Number.isInteger(p.stars) || p.stars < 0 || p.stars > 3 || typeof p.completed !== 'boolean') throw new Error('Некоректне збереження');
  if (p.uiTutorialSeen !== undefined && typeof p.uiTutorialSeen !== 'boolean') throw new Error('Некоректний стан навчання');
  if (p.levels !== undefined) {
    if (!p.levels || typeof p.levels !== 'object' || Array.isArray(p.levels)) throw new Error('Некоректні рівні');
    for (const [id, progress] of Object.entries(p.levels)) {
      const item = progress as LevelProgress | null;
      if (!/^[1-9]\d*$/.test(id) || !item || !Number.isInteger(item.stars) || item.stars < 0 || item.stars > 3 || typeof item.completed !== 'boolean') throw new Error('Некоректний прогрес рівня');
    }
  }
  return p;
}
export function levelProgress(profile: Profile, id: number): LevelProgress {
  return profile.levels?.[String(id)] ?? (id === 1 ? { stars: profile.stars, completed: profile.completed } : { stars: 0, completed: false });
}
export function levelUnlocked(profile: Profile, id: number): boolean { return id === 1 || levelProgress(profile, id - 1).stars === 3; }
export function recordLevel(profile: Profile, id: number, stars: number, completed: boolean) {
  const previous = levelProgress(profile, id);
  profile.levels ??= {};
  profile.levels[String(id)] = { stars: Math.max(previous.stars, stars), completed: previous.completed || completed };
  // Preserve compatibility with existing level-one saves and earlier UI clients.
  if (id === 1) { profile.stars = profile.levels['1'].stars; profile.completed = profile.levels['1'].completed; }
}
export function loadProfile(): { profile: Profile; warning?: string } {
  try { return { profile: parseProfile(localStorage.getItem(key)) }; }
  catch { return { profile: { ...defaultProfile }, warning: 'Збереження недоступне або пошкоджене. Старі дані не видаляємо; нова гра замінить їх.' }; }
}
export function saveProfile(profile: Profile) {
  try { localStorage.setItem(key, JSON.stringify(profile)); return true; }
  catch { return false; }
}

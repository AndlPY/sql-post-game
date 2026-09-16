export interface Profile { version: 1; nickname: string; gender: 'female' | 'male'; coins: number; stars: number; completed: boolean }
const key = 'sql-post.profile.v1';
export const defaultProfile: Profile = { version: 1, nickname: '', gender: 'female', coins: 0, stars: 0, completed: false };
export function parseProfile(raw: string | null): Profile {
  if (!raw) return { ...defaultProfile };
  const p = JSON.parse(raw);
  if (p.version !== 1 || typeof p.nickname !== 'string' || p.nickname.length > 24 || !['female', 'male'].includes(p.gender) || !Number.isSafeInteger(p.coins) || p.coins < 0 || !Number.isInteger(p.stars) || p.stars < 0 || p.stars > 3 || typeof p.completed !== 'boolean') throw new Error('Некоректне збереження');
  return p;
}
export function loadProfile(): { profile: Profile; warning?: string } {
  try { return { profile: parseProfile(localStorage.getItem(key)) }; }
  catch { return { profile: { ...defaultProfile }, warning: 'Збереження недоступне або пошкоджене. Старі дані не видаляємо; нова гра замінить їх.' }; }
}
export function saveProfile(profile: Profile) {
  try { localStorage.setItem(key, JSON.stringify(profile)); return true; }
  catch { return false; }
}

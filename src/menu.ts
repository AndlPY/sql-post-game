import musicUrl from '../Audio/Music/Morning.mp3?url';
import starUrl from '../Img/Assets/UI/reward-star.png?url';
import uiAtlasUrl from '../Img/Assets/UI/menu-panels.png?url';
import iconAtlasUrl from '../Img/Assets/UI/menu-icons.png?url';
import boardUrl from '../Img/Assets/UI/level-board-hires.png?url';
import { playableLevels } from './levels';
import { defaultProfile, levelProgress, levelUnlocked, type Profile } from './profile';

// ViewBoxes isolate generated artwork without baking text or interaction into it.
const panelFrames = {
  banner: '12 136 612 239', board: '647 112 595 280',
  card: '123 490 399 377', selected: '735 489 400 378',
  ticket: '14 963 714 220', play: '747 985 491 172',
};
const iconFrames = {
  sound: '110 119 453 445', muted: '691 119 453 445',
  lock: '156 735 328 405', plaque: '642 828 580 250',
};
function panelArt(name: keyof typeof panelFrames) {
  return `<svg class="menu-art" aria-hidden="true" viewBox="${panelFrames[name]}" preserveAspectRatio="none"><image href="${uiAtlasUrl}" width="1254" height="1254" /></svg>`;
}
function iconArt(name: keyof typeof iconFrames) {
  return `<svg class="menu-icon icon-${name}" aria-hidden="true" viewBox="${iconFrames[name]}" preserveAspectRatio="${name === 'plaque' ? 'none' : 'xMidYMid meet'}"><image href="${iconAtlasUrl}" width="1254" height="1254" /></svg>`;
}

const levels = [
  ['SELECT', 'Перша зміна', 'SELECT, FROM, вибір полів, WHERE ='],
  ['WHERE', 'Особливі прикмети', '>, <, <>, текстові значення'],
  ['AND / OR', 'Точне замовлення', 'AND, OR та дужки'],
  ['LIKE', 'Частина адреси', 'LIKE, IN, BETWEEN'],
  ['ORDER BY', 'Правильна черга', 'ORDER BY, ASC, DESC'],
  ['LIMIT', 'Маленький візок', 'LIMIT разом з ORDER BY'],
  ['COUNT', 'Перевірка вантажу', 'COUNT, SUM, MIN, MAX, AVG'],
  ['GROUP BY', 'Сектори складу', 'GROUP BY та агрегатні функції'],
  ['HAVING', 'Великі партії', 'HAVING; повторення WHERE'],
  ['JOIN', 'Хто одержувач?', 'INNER JOIN, ON, aliases'],
];

export function mountMenu(onPlay: (levelId: number) => void, onProfile: () => void) {
  const root = document.createElement('section');
  root.className = 'level-menu';
  root.setAttribute('aria-label', 'Робочі зміни');
  root.innerHTML = `
    <svg class="menu-robot-eyes" aria-hidden="true" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice">
      <defs><filter id="menu-eye-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2" /></filter></defs>
      <g transform="rotate(18.4 1539 535)"><g class="robot-eye-lights">
        <g fill="#14caff" filter="url(#menu-eye-glow)"><rect x="1514" y="527" width="11" height="16" rx="3"/><rect x="1552" y="527" width="11" height="16" rx="3"/></g>
        <g fill="#64eaff"><rect x="1514" y="527" width="11" height="16" rx="3"/><rect x="1552" y="527" width="11" height="16" rx="3"/></g>
        <g fill="#d9ffff"><rect x="1516" y="530" width="3" height="8"/><rect x="1554" y="530" width="3" height="8"/></g>
      </g></g>
    </svg>
    <div class="menu-top">
      <button class="menu-profile wood-panel" aria-label="Змінити профіль">${iconArt('plaque')}<svg class="profile-stamp" aria-hidden="true" viewBox="0 0 40 32" fill="none"><rect x="3" y="4" width="34" height="24" rx="1"/><path d="m4 6 16 12L36 6"/></svg><span><small>Профіль</small><strong class="menu-name"></strong></span></button>
      <h1>${panelArt('banner')}<span>Робочі зміни</span></h1>
      <div class="menu-wallet wood-panel">${iconArt('plaque')}<span aria-hidden="true">◈</span> <b>0</b><span class="sr-only"> монет</span></div>
    </div>
    <p class="menu-progress parchment">${panelArt('ticket')}<span></span></p>
    <div class="level-board" role="group" aria-label="Обери робочу зміну">
      <img class="menu-art" src="${boardUrl}" alt="" aria-hidden="true" />
      ${levels.map(([topic], i) => `<button class="level-card${i === 0 ? ' selected' : ''}" data-level="${i}" aria-pressed="${i === 0}">${panelArt(i === 0 ? 'selected' : 'card')}<span class="level-number">${String(i + 1).padStart(2, '0')}</span><strong>${topic}</strong><span class="card-divider"></span><span class="card-reward" aria-hidden="true">${i === 0 ? [0, 1, 2].map(() => `<img class="menu-star unearned" src="${starUrl}" alt="" />`).join('') : iconArt('lock')}</span><span class="card-state">${i === 0 ? 'До роботи!' : 'Незабаром'}</span></button>`).join('')}
    </div>
    <div class="shift-ticket parchment">
      ${panelArt('ticket')}
      <div><h2 class="shift-title"></h2><p class="shift-syntax"></p><p class="shift-description"></p></div>
      <div class="shift-action"><button class="menu-play">${panelArt('play')}<span>Грати</span></button><p class="unlock-note"></p></div>
    </div>
    <div class="menu-bottom"><span class="menu-brand">SQL POST OFFICE</span><div class="music-controls"><label class="volume-popover">Гучність <input class="music-volume" aria-label="Гучність музики" type="range" min="0" max="100" value="35" /></label><button class="music-toggle" aria-label="Вимкнути музику" aria-pressed="false">${iconArt('sound')}${iconArt('muted')}</button></div></div>`;
  document.querySelector('#app')!.append(root);
  const get = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const audio = new Audio(musicUrl);
  audio.hidden = true;
  root.append(audio);
  audio.loop = true;
  audio.preload = 'none';
  let muted = false, volume = .35, visible = true, selected = 0;
  let savedProfile: Profile = defaultProfile;
  const implemented = (index: number) => playableLevels.some(level => level.id === index + 1);
  const accessible = (index: number) => implemented(index) && levelUnlocked(savedProfile, index + 1);
  try {
    const saved = JSON.parse(localStorage.getItem('sql-post.audio.v1') ?? 'null');
    if (saved && typeof saved.muted === 'boolean') muted = saved.muted;
    if (saved && typeof saved.volume === 'number' && Number.isFinite(saved.volume)) volume = Math.max(0, Math.min(1, saved.volume));
  } catch { /* Music preferences must not prevent playing. */ }
  function syncMusic() {
    audio.volume = volume;
    audio.muted = muted;
    const silent = muted || volume === 0;
    get<HTMLButtonElement>('.music-toggle').setAttribute('aria-pressed', String(silent));
    get('.music-toggle').setAttribute('aria-label', silent ? 'Увімкнути музику' : 'Вимкнути музику');
    get('.music-toggle').title = silent ? 'Увімкнути музику' : 'Вимкнути музику';
    get<HTMLInputElement>('.music-volume').value = String(Math.round(volume * 100));
    if (visible && !document.hidden && !muted && volume > 0) {
      void audio.play().then(() => {
        // A pending play request may finish after the player has left the menu.
        if (!visible || document.hidden || muted || volume === 0) audio.pause();
      }).catch(() => { /* Autoplay can wait until the first menu interaction. */ });
    } else audio.pause();
  }
  function saveMusic() {
    try { localStorage.setItem('sql-post.audio.v1', JSON.stringify({ muted, volume })); } catch { /* Session settings still work. */ }
    syncMusic();
  }
  function select(index: number) {
    selected = index;
    root.querySelectorAll<HTMLButtonElement>('.level-card').forEach((card, i) => {
      card.classList.toggle('selected', i === index);
      card.setAttribute('aria-pressed', String(i === index));
      card.querySelector('.menu-art')!.setAttribute('viewBox', panelFrames[i === index ? 'selected' : 'card']);
    });
    const definition = playableLevels.find(level => level.id === index + 1);
    get('.shift-title').textContent = `Зміна ${String(index + 1).padStart(2, '0')} · ${definition?.title ?? levels[index][1]}`;
    get('.shift-syntax').textContent = definition?.syntax ?? levels[index][2];
    get('.shift-description').textContent = implemented(index) ? 'Навчальна видача + 13 клієнтів · нова черга щоразу' : 'Нова робоча зміна вже готується';
    get<HTMLButtonElement>('.menu-play').disabled = !accessible(index);
    get('.menu-play span').textContent = accessible(index) ? 'Грати' : implemented(index) ? 'Зачинено' : 'Незабаром';
    get('.unlock-note').textContent = accessible(index) ? 'Для наступної зміни потрібно 3 зірки' : 'Відкриється після 3 зірок у попередній зміні';
  }
  root.querySelectorAll<HTMLButtonElement>('.level-card').forEach((card, i) => card.onclick = () => select(i));
  get('.menu-play').onclick = () => { if (accessible(selected)) onPlay(selected + 1); };
  get('.menu-profile').onclick = onProfile;
  get('.music-toggle').onclick = () => {
    if (muted || volume === 0) { muted = false; if (volume === 0) volume = .35; }
    else muted = true;
    saveMusic();
  };
  get<HTMLInputElement>('.music-volume').oninput = e => { volume = Number((e.target as HTMLInputElement).value) / 100; saveMusic(); };
  // Retry after a real interaction; never promise audio before browser permission.
  document.addEventListener('pointerdown', () => { if (visible) syncMusic(); });
  document.addEventListener('keydown', () => { if (visible) syncMusic(); });
  document.addEventListener('visibilitychange', syncMusic);
  syncMusic();
  return {
    show(profile: Profile) {
      savedProfile = profile;
      visible = true; root.hidden = false;
      get('.menu-name').textContent = profile.nickname || 'Новий працівник';
      get('.menu-wallet b').textContent = String(profile.coins);
      get('.menu-progress span').textContent = `Пройдено ${levels.filter((_, i) => levelProgress(profile, i + 1).stars === 3).length}/10`;
      root.querySelectorAll<HTMLButtonElement>('.level-card').forEach((card, i) => {
        const progress = levelProgress(profile, i + 1);
        card.querySelector('.card-reward')!.innerHTML = accessible(i) ? [0, 1, 2].map(star => `<img class="menu-star${star >= progress.stars ? ' unearned' : ''}" src="${starUrl}" alt="" />`).join('') : iconArt('lock');
        card.querySelector('.card-state')!.textContent = accessible(i) ? progress.stars === 3 ? 'Зміну пройдено' : 'До роботи!' : implemented(i) ? 'Потрібно 3 зірки' : 'Незабаром';
        card.setAttribute('aria-label', `Зміна ${i + 1}, ${levels[i][0]}, ${accessible(i) ? `${progress.stars} з 3 зірок` : 'зачинено'}`);
      });
      select(selected); syncMusic();
    },
    hide() { visible = false; root.hidden = true; audio.pause(); audio.currentTime = 0; },
    focus() { get<HTMLButtonElement>('.menu-play').focus(); },
  };
}

import './style.css';
import { orders, parcels, schema } from './content';
import { mountScene, asset } from './game/scene';
import { mountEditor } from './editor';
import { SqlClient, type QueryResult } from './sql/client';
import { assess, starsFor, customerPayment, shiftSummary } from './game/rules';
import { loadProfile, saveProfile } from './profile';
import starUrl from '../Img/Assets/UI/reward-star.png?url';
import packageInfo from '../package.json';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <div id="save-warning" class="notice" role="alert" hidden></div>
  <header class="hud"><span>Усього обслужено <b id="served">0</b>/13</span><div class="meter" aria-label="Прогрес основних клієнтів"><span id="progress"></span></div><span id="main-progress" class="hud-detail">Основні: 0/12 · бонус: —</span><span class="spacer"></span><button id="exit" class="small-button">Меню</button><span class="coin">◈ <b id="coins">0</b></span></header>
  <main class="layout">
    <section class="warehouse" aria-label="Поштове відділення"><div id="scene"></div><div class="scene-caption">SQL POST OFFICE · Перша зміна · v${packageInfo.version}</div></section>
    <section class="terminal" aria-label="Термінал пошти">
      <div class="customer-panel"><div class="portrait-frame"><img id="portrait" alt="Клієнт" /></div><div id="speech" class="speech"></div><div class="attempts"><span>Оплата: <b id="payment">10</b> ◈</span><span>Спроби: <b id="attempts">3/3</b></span></div></div>
      <div class="panel schema"><strong>▤ parcels</strong><p>${schema.join(' · ')}</p></div>
      <div class="panel editor-panel"><span class="panel-title">SQL</span><div id="editor" class="editor"></div></div>
      <div class="panel preview"><div id="preview-heading" class="preview-heading">Попередній перегляд</div><div id="results" class="table-scroll"><p class="empty">Готуємо навчальний склад…</p></div></div>
      <div class="actions"><p id="status" class="status" role="status">Завантажуємо PostgreSQL…</p><div class="footer-row"><span id="customer-number">Клієнт 1/13</span><button id="mentor" class="small-button">Пояснення наставника</button></div><button id="run" class="run" disabled>Run</button></div>
    </section>
  </main>
  <dialog id="welcome"><h1>SQL Post</h1><p>Перша зміна на пошті. Знайди посилку через SQL — суперробот привезе її клієнту.</p><form id="profile-form"><label>Твій nickname<input id="nickname" maxlength="24" required autocomplete="nickname" placeholder="Як до тебе звертатися?" /></label><label>Персонаж<select id="gender"><option value="female">Працівниця</option><option value="male">Працівник</option></select></label><p id="best"></p><p>Монети й зірки зберігаються в цьому браузері. Незавершена зміна після виходу починається спочатку.</p><div class="dialog-buttons"><button class="primary" type="submit">Почати зміну</button></div></form></dialog>
  <dialog id="help"><h2>Колега пояснює</h2><p><b>1. Прочитай замовлення.</b> Клієнт називає номер або прикмету посилки. Список полів таблиці завжди над редактором.</p><p><b>2. Напиши SELECT.</b> <code>SELECT * FROM parcels WHERE id = 1001;</code> вибирає всі поля посилки №1001. Для тексту потрібні одинарні лапки: <code>WHERE last_name = 'Коваль'</code>.</p><p><b>3. Перевір preview.</b> Він автоматично показує результат SQL. Щоб вибрати лише певні поля, напиши <code>SELECT id, shelf FROM parcels WHERE id = 1001;</code>.</p><p><b>4. Натисни Run.</b> Робот піднімає лише одну коробку, тому потрібен один рядок та поле id. 0 або кілька рядків — без штрафу. Неправильна видача зменшує оплату цього клієнта на 5 монет та витрачає одну спробу. Монети на твоєму рахунку залишаються. Після третьої помилки клієнт іде без оплати.</p><p>За 12 обслужених основних клієнтів — 3 зірки. Останній клієнт бонусний.</p><div class="dialog-buttons"><button id="help-close" class="primary">Зрозуміло</button></div></dialog>
  <dialog id="summary"><h2>Зміну завершено!</h2><div id="stars" class="stars" role="img"></div><p id="summary-total"></p><p id="summary-text"></p><p id="summary-coins"></p><p class="summary-note">Зірки оцінюють 12 основних замовлень. Бонусний клієнт приносить додаткові монети.</p><p id="summary-save">Найкращі зірки та монети збережено в цьому браузері.</p><div class="dialog-buttons"><button id="replay" class="primary">Ще одна зміна</button><button id="summary-menu" class="small-button">До меню</button></div></dialog>
  <dialog id="leave"><h2>Завершити зміну?</h2><p>Прогрес цієї зміни не збережеться. Наступного разу почнеш із першого клієнта. Нараховані монети залишаться.</p><div class="dialog-buttons"><button id="stay" class="primary">Продовжити гру</button><button id="confirm-leave" class="small-button">Вийти до меню</button></div></dialog>`;

const element = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const dialog = (id: string) => element<HTMLDialogElement>(id);
const loaded = loadProfile();
const profile = loaded.profile;
if (loaded.warning) warning(loaded.warning);
const { scene } = mountScene(element('scene'));
const db = new SqlClient();
let active = false, busy = false, index = 0, served = 0, attempts = 3, earned = 0, bonus = false;
let previewVersion = 0, timer: ReturnType<typeof setTimeout>, lastResult: QueryResult | undefined;
let ready = false;
const editor = mountEditor(element('editor'), () => {
  clearTimeout(timer); ++previewVersion; lastResult = undefined; updateRun();
  element('preview-heading').textContent = 'Попередній перегляд · оновлюємо…';
  element('results').textContent = '';
  timer = setTimeout(() => { void preview(); }, 300);
});

function warning(text: string) { element('save-warning').hidden = false; element('save-warning').textContent = text; }
function persist() { const saved = saveProfile(profile); if (!saved) warning('Браузер не дозволяє збереження. Прогрес може зникнути після закриття.'); return saved; }
function message(text: string, kind = '') { element('status').textContent = text; element('status').dataset.kind = kind; }
function updateRun() { element<HTMLButtonElement>('run').disabled = !active || busy || !ready || !lastResult; }
function hud() {
  element('coins').textContent = String(profile.coins); element('served').textContent = String(served + Number(bonus));
  element('main-progress').textContent = `Основні: ${served}/12 · бонус: ${bonus ? '✓' : '—'}`;
  element('payment').textContent = String(customerPayment(orders[index].reward, 3 - attempts));
  element('progress').style.width = `${served / 12 * 100}%`; element('attempts').textContent = `${attempts}/3`;
  element('customer-number').textContent = `Клієнт ${index + 1}/13${index === 12 ? ' · бонус' : ''}`;
}
function showCustomer() {
  const order = orders[index];
  element('speech').textContent = order.text;
  element<HTMLImageElement>('portrait').src = asset(`Portraits/customer-${order.customer}-portrait.png`);
  void scene.setCustomer(order.customer, orders.slice(index + 1, index + 3).map(o => o.customer));
  hud();
}
function displayResults(result: QueryResult) {
  element('preview-heading').textContent = `Попередній перегляд · рядків: ${result.rows.length}`;
  const table = document.createElement('table');
  const head = table.createTHead().insertRow();
  result.columns.forEach(name => { const th = document.createElement('th'); th.textContent = name; head.append(th); });
  const body = table.createTBody();
  result.rows.forEach(row => { const tr = body.insertRow(); result.columns.forEach(name => { tr.insertCell().textContent = row[name] === null ? 'NULL' : String(row[name]); }); });
  element('results').replaceChildren(table);
  if (!result.rows.length) { const p = document.createElement('p'); p.className = 'empty'; p.textContent = 'Жодної посилки за цією умовою.'; element('results').append(p); }
}
async function preview() {
  const version = ++previewVersion; lastResult = undefined; updateRun();
  if (!ready) return;
  const sql = editor.state.doc.toString();
  if (!sql.trim()) { element('results').textContent = ''; message('Напиши SELECT, щоб знайти посилку.'); return; }
  try {
    const result = await db.query(sql);
    if (version !== previewVersion) return;
    lastResult = result; displayResults(result); if (!busy) message('Робот привезе одну вибрану посилку.');
  } catch (error) {
    if (version !== previewVersion) return;
    element('results').textContent = ''; element('preview-heading').textContent = 'Попередній перегляд';
    message(error instanceof Error ? error.message : String(error), 'error');
  }
  updateRun();
}
function start() {
  active = true; busy = false; index = 0; served = 0; attempts = 3; earned = 0; bonus = false;
  void scene.setClerk(profile.gender); showCustomer();
  editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: 'SELECT * FROM parcels;' } });
  updateRun();
}
function menu() {
  active = false; updateRun();
  element<HTMLInputElement>('nickname').value = profile.nickname;
  element<HTMLSelectElement>('gender').value = profile.gender;
  element('best').textContent = `Перша зміна · найкраще: ${'★'.repeat(profile.stars)}${'☆'.repeat(3-profile.stars)} · монет: ${profile.coins}`;
  dialog('welcome').showModal();
}
element('profile-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = element<HTMLInputElement>('nickname').value.trim(); if (!name) return;
  const isNew = !profile.nickname;
  profile.nickname = name; profile.gender = element<HTMLSelectElement>('gender').value as 'female' | 'male';
  persist(); dialog('welcome').close(); start(); if (isNew) dialog('help').showModal();
});
element('run').addEventListener('click', async () => {
  if (!active || busy || !lastResult) return;
  const result = lastResult; const verdict = assess(result, orders[index]);
  if (verdict.kind === 'notice') { message(verdict.message); return; }
  busy = true; updateRun(); message('Робот виконує доставку…');
  const parcel = parcels.find(p => p.id === result.rows[0].id);
  try {
    await scene.deliver(parcel?.shelf ?? 'A1', verdict.correct, parcel?.color === 'gold');
    if (verdict.correct) {
      const payment = customerPayment(orders[index].reward, 3 - attempts);
      profile.coins += payment; earned += payment;
      if (index < 12) served++; else bonus = true;
      message(`Дякую! Правильна видача. +${payment} монет.`, 'success');
    } else {
      attempts--;
      const payment = customerPayment(orders[index].reward, 3 - attempts);
      message(attempts ? `Це не моя посилка. Оплата тепер ${payment} монет. Баланс не змінено.` : 'Клієнт пішов без оплати. Баланс не змінено.', 'error');
    }
    persist(); hud();
    if (verdict.correct || attempts === 0) {
      await new Promise(resolve => setTimeout(resolve, 700));
      index++;
      if (index === orders.length) {
        active = false; profile.stars = Math.max(profile.stars, starsFor(served)); profile.completed = profile.completed || served === 12;
        const saved = persist();
        const summary = shiftSummary(served, bonus);
        const stars = element('stars'); stars.replaceChildren(); stars.setAttribute('aria-label', `${summary.stars} з 3 зірок`);
        for (let i = 0; i < 3; i++) { const image = new Image(); image.src = starUrl; image.alt = ''; image.className = i < summary.stars ? 'reward-star earned' : 'reward-star unearned'; stars.append(image); }
        element('summary-total').textContent = `Усього обслужено: ${summary.total}/13`;
        element('summary-text').textContent = `Основні: ${summary.main}/12 · Бонусний: ${summary.bonus ? 'обслужено' : 'не обслужено'}`;
        element('summary-coins').textContent = `Зароблено за зміну: ${earned} монет`;
        element('summary-save').textContent = saved ? 'Найкращі зірки та монети збережено в цьому браузері.' : 'Не вдалося зберегти прогрес у браузері.';
        dialog('summary').showModal();
      } else { attempts = 3; showCustomer(); message('Нове замовлення. Перевір SQL перед наступною видачею.'); }
    }
  } catch { message('Не вдалося завершити анімацію. Спробу не зараховано.', 'error'); }
  busy = false; updateRun();
});
element('mentor').onclick = () => dialog('help').showModal();
element('help-close').onclick = () => dialog('help').close();
element('exit').onclick = () => { if (busy) return; if (active) dialog('leave').showModal(); else menu(); };
element('stay').onclick = () => dialog('leave').close();
element('confirm-leave').onclick = () => { dialog('leave').close(); menu(); };
element('replay').onclick = () => { dialog('summary').close(); start(); };
element('summary-menu').onclick = () => { dialog('summary').close(); menu(); };
dialog('welcome').addEventListener('cancel', e => e.preventDefault());
dialog('summary').addEventListener('cancel', e => e.preventDefault());
window.addEventListener('beforeunload', e => { if (active) { e.preventDefault(); e.returnValue = ''; } });
void db.ready.then(() => { ready = true; void preview(); }).catch(error => message(String(error), 'error'));
showCustomer(); menu();

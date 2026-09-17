import { demoOrder, uiSteps, type TutorialStep } from './tutorial-content';
import type { LevelDefinition } from './levels';

const portraits = import.meta.glob('../Img/Assets/Portraits/Mentor-gestures/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
export function mountTutorial(options: { writeSql: (sql: string) => void; highlight: (phrase: string) => void; finish: () => void; seen: () => void }) {
  const panel = document.createElement('aside');
  panel.className = 'tutorial'; panel.hidden = true; panel.setAttribute('aria-label', 'Покрокове пояснення наставника');
  panel.innerHTML = `<img class="tutorial-portrait" alt="Наставник"/><div class="tutorial-body"><small class="tutorial-count"></small><h2></h2><p aria-live="polite"></p><div class="tutorial-buttons"><button class="small-button" data-action="back">Назад</button><button class="primary" data-action="next">Далі</button><button class="small-button" data-action="skip">Пропустити</button><button class="small-button" data-action="example">Вписати приклад</button></div></div>`;
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrow.classList.add('tutorial-arrow'); arrow.setAttribute('aria-hidden', 'true');
  arrow.innerHTML = '<defs><marker id="tutorial-arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#ffd87f"/></marker></defs><path class="tutorial-line" fill="none" stroke="#ffd87f" stroke-width="3" marker-end="url(#tutorial-arrowhead)"/>';
  document.body.append(arrow, panel);
  const get = <T extends HTMLElement = HTMLElement>(selector: string) => panel.querySelector<T>(selector)!;
  let steps: TutorialStep[] = [], index = 0, target: HTMLElement | null = null, busy = false, complete = false, running = false, full = false, uiMarked = false, exampleWritten = false, reviewing = false;
  let demo = demoOrder, title = 'Перша зміна';
  const button = (action: string) => get<HTMLButtonElement>(`[data-action="${action}"]`);
  function position() {
    if (!running || !target) return;
    const a = panel.getBoundingClientRect(), b = target.getBoundingClientRect();
    // End just outside the target; the overlay never intercepts pointer events.
    const x = b.left > a.right ? b.left - 9 : b.left + b.width / 2;
    const y = b.top > a.bottom ? b.top - 9 : b.bottom < a.top ? b.bottom + 9 : b.top + b.height / 2;
    const sx = Math.min(a.right - 20, Math.max(a.left + 20, x));
    const sy = y < a.top ? a.top - 6 : a.top + 12;
    arrow.querySelector('.tutorial-line')!.setAttribute('d', `M ${sx} ${sy} L ${x} ${y}`);
  }
  const observer = new ResizeObserver(position);
  observer.observe(panel);
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, true);
  function clearTarget() { if (target) { target.classList.remove('tutorial-target'); observer.unobserve(target); } target = null; options.highlight(''); }
  function controls() {
    button('back').disabled = busy || complete || index === 0;
    button('next').disabled = busy || (!complete && !!steps[index]?.awaitDelivery);
    button('skip').disabled = busy;
    button('example').disabled = busy || complete;
  }
  function render() {
    clearTarget();
    const step = steps[index];
    if (full && index >= uiSteps.length && !uiMarked) { options.seen(); uiMarked = true; }
    if (step.writeDemo && !exampleWritten) { options.writeSql(demo.solution); exampleWritten = true; }
    get<HTMLImageElement>('img').src = portraits[`../Img/Assets/Portraits/Mentor-gestures/mentor-${step.gesture}.png`];
    get('h2').textContent = step.title; get('p').textContent = step.text;
    get('.tutorial-count').textContent = `${full && index < uiSteps.length ? 'Знайомство з поштою' : `SQL · ${title}`} · ${index + 1}/${steps.length}`;
    button('next').textContent = reviewing && index === steps.length - 1 ? 'Завершити' : 'Далі'; button('example').hidden = reviewing || (full && index < uiSteps.length);
    target = document.querySelector<HTMLElement>(step.target);
    target?.classList.add('tutorial-target'); if (target) observer.observe(target);
    options.highlight(step.phrase ?? ''); controls(); position();
  }
  function hide() { running = false; panel.hidden = true; arrow.style.display = 'none'; clearTarget(); }
  function finish() { if (busy) return; if (full && !uiMarked) options.seen(); hide(); if (!reviewing) options.finish(); }
  button('back').onclick = () => { if (!busy && !complete && index > 0) { index--; render(); } };
  button('next').onclick = () => { if (busy) return; if (complete || (reviewing && index === steps.length - 1)) finish(); else if (!steps[index].awaitDelivery && index < steps.length - 1) { index++; render(); } };
  button('skip').onclick = finish;
  button('example').onclick = () => { if (!busy && !complete) options.writeSql(demo.solution); };
  return {
    start(showUI: boolean, level: LevelDefinition) { demo = level.demo; title = level.title; reviewing = false; full = showUI; uiMarked = false; exampleWritten = false; steps = showUI ? [...uiSteps, ...level.tutorial] : [...level.tutorial]; index = 0; busy = false; complete = false; running = true; panel.hidden = false; arrow.style.display = 'block'; render(); },
    review() {
      reviewing = true; full = false; complete = false; index = 0;
      steps = uiSteps.map(step => ({ ...step, text: step.text.replace('Зараз перед нами окремий навчальний клієнт.', '').replace('У цій вправі тренуємося без оплати.', '') }));
      running = true; panel.hidden = false; arrow.style.display = 'block'; render();
    },
    setBusy(value: boolean) { busy = value; controls(); },
    delivered() {
      if (!running) return;
      complete = true; clearTarget(); arrow.style.display = 'none';
      if (full && !uiMarked) { options.seen(); uiMarked = true; }
      get('h2').textContent = 'Чудово, посилку видано!'; get('p').textContent = 'Навчальний клієнт отримав свою коробку. Тепер починається справжня зміна: 13 клієнтів, перший уже чекає. Твій запит можна змінювати для кожного замовлення.';
      get('.tutorial-count').textContent = 'Навчальну видачу завершено'; button('next').textContent = 'Почати зміну'; button('example').hidden = true; controls();
    },
    hide,
  };
}

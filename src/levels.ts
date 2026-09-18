import { parcels } from './data/parcels.ts';
import { customers, orders, type Order } from './content.ts';
import { demoOrder, sqlSteps, type TutorialStep } from './tutorial-content.ts';

export type Cohort = 'easy' | 'medium' | 'review' | 'bonus';
export interface LevelOrder extends Order { cohort: Cohort; search?: string }
export interface LevelDefinition {
  id: number; title: string; topic: string; syntax: string;
  orders: LevelOrder[]; demo: Order; tutorial: TutorialStep[];
}

/** Authoring invariants fail explicitly instead of silently shipping missing parcels. */
function defineLevel(level: LevelDefinition): LevelDefinition {
  const ids = new Set(parcels.map(parcel => parcel.id));
  if (ids.size !== parcels.length) throw new Error(`Level ${level.id}: duplicate parcel id`);
  const requested = [level.demo, ...level.orders].map(order => order.parcelId);
  if (new Set(requested).size !== requested.length || requested.some(id => !ids.has(id))) throw new Error(`Level ${level.id}: missing or reused order parcel`);
  for (const cohort of ['easy', 'medium', 'review', 'bonus'] as const) {
    if (level.orders.filter(order => order.cohort === cohort).length !== (cohort === 'bonus' ? 1 : 4)) throw new Error(`Level ${level.id}: invalid ${cohort} cohort`);
  }
  if (level.demo.reward !== 0) throw new Error(`Level ${level.id}: demo must be unpaid`);
  return level;
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** New material keeps easy→medium progression, with two review orders in each half. */
export function createShift(level: LevelDefinition, random: () => number = Math.random): LevelOrder[] {
  const cohort = (name: Cohort) => shuffled(level.orders.filter(order => order.cohort === name), random);
  const reviews = cohort('review');
  const interleave = (material: LevelOrder[], review: LevelOrder[]) => {
    const slots = new Set(shuffled(Array.from({ length: material.length + review.length }, (_, i) => i), random).slice(0, review.length));
    let nextNew = 0, nextReview = 0;
    return Array.from({ length: material.length + review.length }, (_, i) => ({ ...(slots.has(i) ? review[nextReview++] : material[nextNew++]) }));
  };
  return [...interleave(cohort('easy'), reviews.slice(0, 2)), ...interleave(cohort('medium'), reviews.slice(2)), ...cohort('bonus').map(order => ({ ...order }))];
}

const levelOne = defineLevel({
  id: 1, title: 'Перша зміна', topic: 'SELECT', syntax: 'SELECT, FROM, вибір полів, WHERE =',
  demo: demoOrder, tutorial: sqlSteps,
  orders: orders.map((order, i) => {
    return { ...order, customer: customers[i % customers.length], cohort: i < 4 ? 'easy' : i < 8 ? 'medium' : i < 12 ? 'review' : 'bonus' };
  }),
});

// Search examples teach the topic; delivery still accepts any correct single id.
function secondOrder(id: number, cohort: Cohort, clue: string, search: string): LevelOrder {
  return { parcelId: id, cohort, customer: customers[id % customers.length], text: clue,
    reward: cohort === 'bonus' ? 30 : cohort === 'medium' ? 20 : 10,
    search, solution: `SELECT * FROM parcels WHERE id = ${id};` };
}
const secondDemo: Order = { parcelId: 2000, customer: 'red-beret', reward: 0,
  text: 'Я Тарас Наставченко, навчальний клієнт. Моя посилка важча за 4 кг. Знайдемо її разом?',
  solution: 'SELECT id, first_name, last_name, weight_kg FROM parcels WHERE weight_kg > 4;' };
const secondTutorial: TutorialStep[] = [
  { title: 'Нульовий клієнт · WHERE', text: 'Сьогодні шукаємо за порівняннями. Спочатку навчальна видача Тарасові: він не входить до 13 клієнтів і не платить монети.', target: '.customer-panel', gesture: 'open-palm', writeDemo: true },
  { title: '> означає «більше»', text: 'weight_kg > 4 знаходить усі коробки важчі за 4 кг. Коробка рівно 4 кг сюди не потрапить.', target: '.editor-panel', gesture: 'point-right', phrase: 'weight_kg > 4' },
  { title: '< означає «менше»', text: 'weight_kg < 1 знаходить коробки легші за 1 кг. Вага в таблиці — кілограми: 200 грамів це 0.2 кг. Десятковий роздільник у SQL — крапка.', target: '.schema', gesture: 'raised-finger' },
  { title: '<> означає «не дорівнює»', text: "color <> 'brown' залишить коробки будь-якого кольору, крім коричневого. Синій у таблиці — blue. Текст беремо в одинарні лапки. Числа теж можна порівнювати: weight_kg <> 2 виключає пакунки рівно 2 кг.", target: '.editor-panel', gesture: 'raised-finger' },
  { title: 'Кілька збігів — це нормально', text: 'Подивись у preview: серед важких посилок знайди Тараса Наставченка й прочитай його id. В інших замовленнях звіряй усі відомі ознаки: одне прізвище може належати кільком посилкам.', target: '.preview', gesture: 'point-right' },
  { title: 'Вибери знайдений номер', text: 'Тепер заміни умову на WHERE id = 2000. У preview залишиться одна коробка. Це два кроки пошуку; AND та OR вивчимо в наступній зміні.', target: '.editor-panel', gesture: 'point-right' },
  { title: 'Навчальна видача', text: 'Натисни Run, коли вибрано посилку Тараса. Оцінюється правильний id, а не спосіб, яким ти його знайшов.', target: '#run', gesture: 'both-hands', awaitDelivery: true },
];
const levelTwo = defineLevel({
  id: 2, title: 'Особливі прикмети', topic: 'WHERE', syntax: '>, <, <>, текстові значення',
  demo: secondDemo, tutorial: secondTutorial,
  orders: [
    secondOrder(2011, 'easy', 'Добрий день, я Гончар. Сьогодні заберу важку коробку — вона важча за 8 кілограмів.', 'SELECT * FROM parcels WHERE weight_kg > 8;'),
    secondOrder(2022, 'easy', 'На прізвище Дзюба, будь ласка. Чекаю конверт легший за 200 грамів. Нарешті вдалося зайти після роботи!', 'SELECT * FROM parcels WHERE weight_kg < 0.2;'),
    secondOrder(2033, 'easy', 'Посилка на прізвище Левченко. Кольору не пам’ятаю, але відправниця точно сказала: коробка не коричнева.', "SELECT * FROM parcels WHERE color <> 'brown';"),
    secondOrder(2044, 'easy', 'Я Ковальчук. Мій пакунок важить не 2 кілограми — це вага іншого замовлення.', 'SELECT * FROM parcels WHERE weight_kg <> 2;'),
    secondOrder(2055, 'medium', 'Мороз. На квитанції написано «понад 3500 грамів». Заберу цей пакунок, інший поки залишиться.', 'SELECT * FROM parcels WHERE weight_kg > 3.5;'),
    secondOrder(2066, 'medium', 'Прізвище Савка. Відправник сказав: пакунок легший за 750 грамів, не рівно 750. Усередині подарунок племінниці.', 'SELECT * FROM parcels WHERE weight_kg < 0.75;'),
    secondOrder(2077, 'medium', 'Я Білик. Здається, коробка синя… Ні, перепрошую, синя була минулого разу. Цього разу точно не синя.', "SELECT * FROM parcels WHERE color <> 'blue';"),
    secondOrder(2088, 'medium', 'На прізвище Кравець. Квитанція намокла, номер не розібрати. Пам’ятаю лише, що він більший за 2080.', 'SELECT * FROM parcels WHERE id > 2080;'),
    secondOrder(2099, 'review', 'Вітаю! Посилка на ім’я Мирослава, будь ласка.', "SELECT * FROM parcels WHERE first_name = 'Мирослава';"),
    secondOrder(2110, 'review', 'Моя посилка №2110. Дякую!', 'SELECT * FROM parcels WHERE id = 2110;'),
    secondOrder(2121, 'review', 'Добрий день! Посилка на прізвище Терещук.', "SELECT * FROM parcels WHERE last_name = 'Терещук';"),
    secondOrder(2132, 'review', 'Козак, отримати посилку. Сподіваюся, встигну до автобуса.', "SELECT * FROM parcels WHERE last_name = 'Козак';"),
    secondOrder(2143, 'bonus', 'Номер загубився, але пам’ятаю вагу: два набори по 1250 грамів, книга 900 грамів та ще 450 грамів упаковки. Допоможете знайти? Добре віддячу!', 'SELECT * FROM parcels WHERE weight_kg = 3.85;'),
  ],
});

export const playableLevels: readonly LevelDefinition[] = [levelOne, levelTwo];
export function getLevel(id: number): LevelDefinition {
  const level = playableLevels.find(level => level.id === id);
  if (!level) throw new Error(`Невідомий рівень: ${id}`);
  return level;
}

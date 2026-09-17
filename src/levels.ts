import { orders, parcels, type Order, type Parcel } from './content.ts';
import { demoOrder, sqlSteps, type TutorialStep } from './tutorial-content.ts';

export type Cohort = 'easy' | 'medium' | 'review' | 'bonus';
export interface LevelOrder extends Order { cohort: Cohort }
export interface LevelDefinition {
  id: number; title: string; topic: string; syntax: string;
  parcels: Parcel[]; orders: LevelOrder[]; demo: Order; tutorial: TutorialStep[];
}

/** Authoring invariants fail explicitly instead of silently shipping missing parcels. */
function defineLevel(level: LevelDefinition): LevelDefinition {
  const ids = new Set(level.parcels.map(parcel => parcel.id));
  if (ids.size !== level.parcels.length) throw new Error(`Level ${level.id}: duplicate parcel id`);
  const recipients = level.parcels.map(parcel => `${parcel.first_name}\u0000${parcel.last_name}`);
  if (new Set(recipients).size !== recipients.length) throw new Error(`Level ${level.id}: recipient clues need an additional discriminator before duplicate names can be added`);
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
  parcels, demo: demoOrder, tutorial: sqlSteps,
  orders: orders.map((order, i) => {
    const parcel = parcels.find(row => row.id === order.parcelId)!;
    const clue = order.text.replace('єдина фіолетова', 'фіолетова').replace('Інших посилок такої ваги немає. ', '');
    return { ...order, text: `${parcel.first_name} ${parcel.last_name}. ${clue}`, cohort: i < 4 ? 'easy' : i < 8 ? 'medium' : i < 12 ? 'review' : 'bonus' };
  }),
});

const secondParcels: Parcel[] = [
  { id: 2000, first_name: 'Тарас', last_name: 'Наставченко', color: 'white', shelf: 'A1', weight_kg: 4.5 },
  { id: 2011, first_name: 'Олена', last_name: 'Гончар', color: 'brown', shelf: 'A2', weight_kg: 9.4 },
  { id: 2022, first_name: 'Марко', last_name: 'Дзюба', color: 'blue', shelf: 'A1', weight_kg: 0.15 },
  { id: 2033, first_name: 'Ірина', last_name: 'Левченко', color: 'green', shelf: 'B1', weight_kg: 1.8 },
  { id: 2044, first_name: 'Остап', last_name: 'Ковальчук', color: 'red', shelf: 'A2', weight_kg: 2.2 },
  { id: 2055, first_name: 'Соломія', last_name: 'Мороз', color: 'brown', shelf: 'B1', weight_kg: 3.6 },
  { id: 2066, first_name: 'Роман', last_name: 'Савка', color: 'blue', shelf: 'A1', weight_kg: 0.65 },
  { id: 2077, first_name: 'Дарина', last_name: 'Білик', color: 'green', shelf: 'A2', weight_kg: 5.1 },
  { id: 2088, first_name: 'Денис', last_name: 'Кравець', color: 'brown', shelf: 'B1', weight_kg: 1.25 },
  { id: 2099, first_name: 'Мирослава', last_name: 'Руденко', color: 'orange', shelf: 'A1', weight_kg: 0.9 },
  { id: 2110, first_name: 'Тимофій', last_name: 'Бойко', color: 'brown', shelf: 'A2', weight_kg: 2.6 },
  { id: 2121, first_name: 'Леся', last_name: 'Терещук', color: 'purple', shelf: 'B1', weight_kg: 1.1 },
  { id: 2132, first_name: 'Вадим', last_name: 'Козак', color: 'blue', shelf: 'A1', weight_kg: 6.3 },
  { id: 2143, first_name: 'Богдан', last_name: 'Яворський', color: 'gold', shelf: 'B1', weight_kg: 3.85 },
];
// Every clue has a stable recipient fallback. Additional heavier/lighter parcels remain solvable.
function secondOrder(id: number, cohort: Cohort, clue: string): LevelOrder {
  const parcel = secondParcels.find(row => row.id === id)!;
  return { parcelId: id, cohort, customer: (['tan-hat', 'redhead', 'red-beret'] as const)[secondParcels.indexOf(parcel) % 3],
    text: `${parcel.first_name} ${parcel.last_name}. ${clue}`,
    reward: cohort === 'bonus' ? 30 : cohort === 'medium' ? 20 : 10,
    // An example, never the acceptance criterion. Any SELECT returning this id works.
    solution: `SELECT id, shelf FROM parcels WHERE id = ${id};` };
}
const secondDemo: Order = { parcelId: 2000, customer: 'red-beret', reward: 0,
  text: 'Я Тарас Наставченко, навчальний клієнт. Моя посилка важча за 4 кг. Знайдемо її разом?',
  solution: 'SELECT id, first_name, last_name, weight_kg FROM parcels WHERE weight_kg > 4;' };
const secondTutorial: TutorialStep[] = [
  { title: 'Нульовий клієнт · WHERE', text: 'Сьогодні шукаємо за порівняннями. Спочатку навчальна видача Тарасові: він не входить до 13 клієнтів і не платить монети.', target: '.customer-panel', gesture: 'open-palm', writeDemo: true },
  { title: '> означає «більше»', text: 'weight_kg > 4 знаходить усі коробки важчі за 4 кг. Коробка рівно 4 кг сюди не потрапить.', target: '.editor-panel', gesture: 'point-right', phrase: 'weight_kg > 4' },
  { title: '< означає «менше»', text: 'weight_kg < 1 знаходить коробки легші за 1 кг. Вага в таблиці — кілограми: 200 грамів це 0.2 кг. Десятковий роздільник у SQL — крапка.', target: '.schema', gesture: 'raised-finger' },
  { title: '<> означає «не дорівнює»', text: "color <> 'brown' залишить коробки будь-якого кольору, крім коричневого. Текст беремо в одинарні лапки. Так само можна виключити полицю: shelf <> 'A1'.", target: '.editor-panel', gesture: 'raised-finger' },
  { title: 'Кілька збігів — це нормально', text: 'Подивись у preview: серед важких посилок знайди Тараса Наставченка й прочитай його id. У замовленнях є ім’я одержувача, тож додаткові коробки не завадять пошуку.', target: '.preview', gesture: 'point-right' },
  { title: 'Вибери знайдений номер', text: 'Тепер заміни умову на WHERE id = 2000. У preview залишиться одна коробка. Це два кроки пошуку; AND та OR вивчимо в наступній зміні.', target: '.editor-panel', gesture: 'point-right' },
  { title: 'Навчальна видача', text: 'Натисни Run, коли вибрано посилку Тараса. Оцінюється правильний id, а не спосіб, яким ти його знайшов.', target: '#run', gesture: 'both-hands', awaitDelivery: true },
];
const levelTwo = defineLevel({
  id: 2, title: 'Особливі прикмети', topic: 'WHERE', syntax: '>, <, <>, текстові значення',
  parcels: secondParcels, demo: secondDemo, tutorial: secondTutorial,
  orders: [
    secondOrder(2011, 'easy', 'Моя коробка важча за 8 кг. Знайдіть її серед важких посилок за моїм ім’ям.'),
    secondOrder(2022, 'easy', 'Чекаю легенький конверт — менше 0.2 кг. Перевірте одержувача.'),
    secondOrder(2033, 'easy', 'Моя коробка не коричнева. У каталозі коричневий записаний як brown.'),
    secondOrder(2044, 'easy', 'Мою посилку поклали не на A1. Подивіться на інших полицях.'),
    secondOrder(2055, 'medium', 'На квитанції лишилося «понад 3500 г». Відберіть важчі коробки й знайдіть моє ім’я.'),
    secondOrder(2066, 'medium', 'У мене невеликий пакунок, до 750 грамів, не рівно 750. У каталозі вага в кілограмах.'),
    secondOrder(2077, 'medium', 'Працівник спершу шукав синю коробку, але моя точно не blue. Серед решти знайдіть мою.'),
    secondOrder(2088, 'medium', 'Номер частково стерся. Пам’ятаю, що він більший за 2080. Звірте одержувача у знайденому списку.'),
    secondOrder(2099, 'review', 'Знайдіть посилку на моє ім’я — Мирослава.'),
    secondOrder(2110, 'review', 'Моя посилка №2110. Дякую!'),
    secondOrder(2121, 'review', 'Посилка на прізвище Терещук. Перевірте, будь ласка.'),
    secondOrder(2132, 'review', 'Шукайте за прізвищем Козак. Покажіть номер і полицю, щоб її забрати.'),
    secondOrder(2143, 'bonus', 'Загальна вага стерлася: два набори по 1250 г, книга 900 г і упаковка 450 г. Коробка не brown. Обчисліть вагу, знайдіть коробку та звірте одержувача — добре віддячу!'),
  ],
});

export const playableLevels: readonly LevelDefinition[] = [levelOne, levelTwo];
export function getLevel(id: number): LevelDefinition {
  const level = playableLevels.find(level => level.id === id);
  if (!level) throw new Error(`Невідомий рівень: ${id}`);
  return level;
}

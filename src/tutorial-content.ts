import type { Order } from './content.ts';

export const demoOrder: Order = {
  parcelId: 1001, customer: 'red-beret', reward: 0,
  text: 'Вітаю! Я Тарас. Допоможу потренуватися: моя посилка №1001.',
  solution: 'SELECT id, shelf FROM parcels WHERE id = 1001;',
};
export interface TutorialStep {
  title: string; text: string; target: string;
  gesture: 'open-palm' | 'point-right' | 'raised-finger' | 'both-hands';
  phrase?: string; writeDemo?: boolean; awaitDelivery?: boolean;
}
export const uiSteps: TutorialStep[] = [
  { title: 'Вітаю на пошті!', text: 'Я твій наставник. Клієнт описує посилку, ти знаходиш її в таблиці, а робот приносить зі складу. Почнемо з робочого місця.', target: '.warehouse', gesture: 'open-palm' },
  { title: 'Слухай клієнта', text: 'Тут портрет і замовлення. Номер, ім’я або прикмета коробки допоможуть знайти потрібний рядок. Зараз перед нами окремий навчальний клієнт.', target: '.customer-panel', gesture: 'point-right' },
  { title: 'Оплата і спроби', text: 'У зміні правильна видача приносить оплату. Помилка зменшує її на 5 монет; після трьох помилок клієнт іде. У цій вправі тренуємося без оплати.', target: '.attempts', gesture: 'raised-finger' },
  { title: 'Каталог посилок', text: 'parcels — таблиця складу. Кожен рядок — посилка, кожна колонка — її прикмета. Назви полів завжди перед тобою.', target: '.schema', gesture: 'point-right' },
  { title: 'Твій SQL-запит', text: 'У цьому редакторі ти пояснюєш роботу, яку посилку шукати. Можна вільно редагувати запит і під час моїх пояснень.', target: '.editor-panel', gesture: 'open-palm' },
  { title: 'Спочатку перевір результат', text: 'Preview оновлюється після введення SQL. Перевір номер і кількість рядків: робот перевозить одну коробку за раз.', target: '.preview', gesture: 'point-right' },
  { title: 'Команда роботу', text: 'Run відправляє робота за посилкою з результату. Порожній список або кілька рядків означають, що пошук треба уточнити.', target: '#run', gesture: 'raised-finger' },
  { title: 'Твоя зміна', text: 'Угорі — обслужені клієнти та монети. На тебе чекають 12 основних замовлень і бонусне. За всі 12 основних отримаєш три зірки.', target: '.hud', gesture: 'both-hands' },
];
export const sqlSteps: TutorialStep[] = [
  { title: 'SQL — мова запитів', text: 'Запит каже, які дані взяти, звідки та за якою умовою. Я впишу приклад для Тарасової посилки №1001. Потім ти сам надішлеш робота.', target: '.editor-panel', gesture: 'open-palm', writeDemo: true },
  { title: 'SELECT: які поля показати', text: 'SELECT id, shelf вибирає номер і полицю. Так результат легко читати. Зірочка * показує всі поля — її теж можна використовувати.', target: '.editor-panel', gesture: 'point-right', phrase: 'SELECT id, shelf' },
  { title: 'FROM: звідки взяти дані', text: 'FROM parcels означає «з таблиці посилок». SQL читає наш каталог і повертає вибрані колонки.', target: '.editor-panel', gesture: 'point-right', phrase: 'FROM parcels' },
  { title: 'WHERE: яку посилку знайти', text: 'WHERE id = 1001 залишає рядок із потрібним номером. Числа пишемо без лапок, текст — в одинарних: WHERE last_name = \'Вчитель\'.', target: '.editor-panel', gesture: 'raised-finger', phrase: 'WHERE id = 1001' },
  { title: 'Один рядок — одна коробка', text: 'У preview має бути id 1001 та полиця A1. Якщо ти змінив приклад, можеш повернути його кнопкою «Вписати приклад».', target: '.preview', gesture: 'point-right' },
  { title: 'Кольори коробок', text: 'Клієнт описує колір українською, а в color записані англійські значення: purple — фіолетовий, blue — синій, brown — коричневий. Текстову умову записуємо в одинарних лапках.', target: '.schema', gesture: 'raised-finger' },
  { title: 'Тепер натисни Run', text: 'Відправ робота за посилкою Тараса. Дочекайся доставки. Цей клієнт навчальний: монети, спроби зміни та зірки не змінюються.', target: '#run', gesture: 'point-right', awaitDelivery: true },
];

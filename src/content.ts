export const customers = ['tan-hat', 'redhead', 'red-beret', 'brown-haired-man', 'glasses-bob'] as const;
export type Customer = typeof customers[number];
export { parcels, schema, type Parcel } from './data/parcels.ts';
export interface Order {
  parcelId: number; customer: Customer; text: string; reward: number; solution: string;
}

export const orders: Order[] = [
  { parcelId: 1042, customer: 'tan-hat', text: 'Моя посилка №1042.', reward: 10, solution: 'SELECT * FROM parcels WHERE id = 1042;' },
  { parcelId: 1057, customer: 'redhead', text: 'Добрий день! Посилка №1057, будь ласка.', reward: 10, solution: 'SELECT * FROM parcels WHERE id = 1057;' },
  { parcelId: 1083, customer: 'red-beret', text: 'Заберу посилку №1083.', reward: 10, solution: 'SELECT * FROM parcels WHERE id = 1083;' },
  { parcelId: 1106, customer: 'tan-hat', text: 'У повідомленні вказано номер 1106.', reward: 10, solution: 'SELECT * FROM parcels WHERE id = 1106;' },
  { parcelId: 1124, customer: 'redhead', text: 'Добрий день! Заберу пакунок на прізвище Шевченко.', reward: 20, solution: "SELECT * FROM parcels WHERE last_name = 'Шевченко';" },
  { parcelId: 1148, customer: 'red-beret', text: 'Моє прізвище Кравчук. Заберу свій пакунок.', reward: 20, solution: "SELECT * FROM parcels WHERE last_name = 'Кравчук';" },
  { parcelId: 1172, customer: 'tan-hat', text: 'Посилка на ім’я Наталія, будь ласка.', reward: 20, solution: "SELECT * FROM parcels WHERE first_name = 'Наталія';" },
  { parcelId: 1195, customer: 'redhead', text: 'Мені надіслали фіолетову коробку. Заберу її, будь ласка.', reward: 20, solution: "SELECT * FROM parcels WHERE color = 'purple';" },
  { parcelId: 1211, customer: 'red-beret', text: 'Заберу посилку №1211.', reward: 10, solution: 'SELECT * FROM parcels WHERE id = 1211;' },
  { parcelId: 1236, customer: 'tan-hat', text: 'Добрий день, посилка на прізвище Романюк.', reward: 10, solution: "SELECT * FROM parcels WHERE last_name = 'Романюк';" },
  { parcelId: 1264, customer: 'red-beret', text: 'Моя посилка №1264. Дякую!', reward: 10, solution: 'SELECT * FROM parcels WHERE id = 1264;' },
  { parcelId: 1288, customer: 'redhead', text: 'Посилка на ім’я Катерина.', reward: 10, solution: "SELECT * FROM parcels WHERE first_name = 'Катерина';" },
  { parcelId: 1301, customer: 'red-beret', text: 'Номер стерся з квитанції… Залишилася тільки вага: 2800 грамів. Знайдете — щедро віддячу!', reward: 30, solution: 'SELECT * FROM parcels WHERE weight_kg = 2.8;' },
];

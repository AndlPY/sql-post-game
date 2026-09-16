export type Customer = 'tan-hat' | 'redhead' | 'red-beret';
export interface Parcel {
  id: number; first_name: string; last_name: string; color: string; shelf: string; weight_kg: number;
}
export interface Order {
  parcelId: number; customer: Customer; text: string; reward: number; solution: string;
}

export const parcels: Parcel[] = [
  { id: 1042, first_name: 'Олена', last_name: 'Коваль', color: 'blue', shelf: 'A2', weight_kg: 1.2 },
  { id: 1057, first_name: 'Марія', last_name: 'Бондар', color: 'brown', shelf: 'A1', weight_kg: 0.8 },
  { id: 1083, first_name: 'Андрій', last_name: 'Мельник', color: 'green', shelf: 'B1', weight_kg: 2.1 },
  { id: 1106, first_name: 'Софія', last_name: 'Ткачук', color: 'red', shelf: 'A2', weight_kg: 1.5 },
  { id: 1124, first_name: 'Ірина', last_name: 'Шевченко', color: 'blue', shelf: 'A1', weight_kg: 0.6 },
  { id: 1148, first_name: 'Дмитро', last_name: 'Кравчук', color: 'brown', shelf: 'B1', weight_kg: 2.4 },
  { id: 1172, first_name: 'Наталія', last_name: 'Савчук', color: 'green', shelf: 'A2', weight_kg: 0.9 },
  { id: 1195, first_name: 'Юлія', last_name: 'Олійник', color: 'purple', shelf: 'B1', weight_kg: 1.7 },
  { id: 1211, first_name: 'Максим', last_name: 'Лисенко', color: 'brown', shelf: 'A1', weight_kg: 1.1 },
  { id: 1236, first_name: 'Анна', last_name: 'Романюк', color: 'red', shelf: 'A2', weight_kg: 0.4 },
  { id: 1264, first_name: 'Олег', last_name: 'Петренко', color: 'blue', shelf: 'B1', weight_kg: 1.8 },
  { id: 1288, first_name: 'Катерина', last_name: 'Дорошенко', color: 'green', shelf: 'A1', weight_kg: 0.7 },
  { id: 1301, first_name: 'Богдан', last_name: 'Золотар', color: 'gold', shelf: 'B1', weight_kg: 2.8 },
  { id: 1001, first_name: 'Тарас', last_name: 'Вчитель', color: 'white', shelf: 'A1', weight_kg: 0.5 },
];

export const orders: Order[] = [
  { parcelId: 1042, customer: 'tan-hat', text: 'Моя посилка №1042.', reward: 10, solution: 'SELECT * FROM parcels WHERE id = 1042;' },
  { parcelId: 1057, customer: 'redhead', text: 'Добрий день! Посилка №1057, будь ласка.', reward: 10, solution: 'SELECT * FROM parcels WHERE id = 1057;' },
  { parcelId: 1083, customer: 'red-beret', text: 'Прийшов за посилкою №1083.', reward: 10, solution: 'SELECT * FROM parcels WHERE id = 1083;' },
  { parcelId: 1106, customer: 'tan-hat', text: 'У повідомленні вказано номер 1106.', reward: 10, solution: 'SELECT * FROM parcels WHERE id = 1106;' },
  { parcelId: 1124, customer: 'redhead', text: 'Посилка на прізвище Шевченко. Здається, бачу її в ряду A1.', reward: 20, solution: "SELECT * FROM parcels WHERE last_name = 'Шевченко';" },
  { parcelId: 1148, customer: 'red-beret', text: 'Моє прізвище Кравчук. У мене одна посилка.', reward: 20, solution: "SELECT * FROM parcels WHERE last_name = 'Кравчук';" },
  { parcelId: 1172, customer: 'tan-hat', text: 'Я Наталія. Тут має бути одна посилка на моє ім’я.', reward: 20, solution: "SELECT * FROM parcels WHERE first_name = 'Наталія';" },
  { parcelId: 1195, customer: 'redhead', text: 'Моя коробка єдина фіолетова — purple. Заберу її, будь ласка.', reward: 20, solution: "SELECT * FROM parcels WHERE color = 'purple';" },
  { parcelId: 1211, customer: 'red-beret', text: 'Заберу посилку №1211.', reward: 10, solution: 'SELECT * FROM parcels WHERE id = 1211;' },
  { parcelId: 1236, customer: 'tan-hat', text: 'Я Анна Романюк. Знайдіть посилку за прізвищем.', reward: 10, solution: "SELECT * FROM parcels WHERE last_name = 'Романюк';" },
  { parcelId: 1264, customer: 'red-beret', text: 'Моя посилка №1264. Дякую!', reward: 10, solution: 'SELECT * FROM parcels WHERE id = 1264;' },
  { parcelId: 1288, customer: 'redhead', text: 'Посилка на ім’я Катерина.', reward: 10, solution: "SELECT * FROM parcels WHERE first_name = 'Катерина';" },
  { parcelId: 1301, customer: 'red-beret', text: 'Номер стерся з квитанції… Залишилася тільки вага: 2800 грамів. Інших посилок такої ваги немає. Знайдете — щедро віддячу!', reward: 30, solution: 'SELECT * FROM parcels WHERE weight_kg = 2.8;' },
];

export const schema = ['id', 'first_name', 'last_name', 'color', 'shelf', 'weight_kg'];

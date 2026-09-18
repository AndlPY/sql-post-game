/** Shared warehouse for every level. Keep stable ids; review all clues after edits. */
export interface Parcel {
  id: number; first_name: string; last_name: string; color: string; shelf: string; weight_kg: number;
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
  { id: 2121, first_name: 'Леся', last_name: 'Терещук', color: 'pink', shelf: 'B1', weight_kg: 1.1 },
  { id: 2132, first_name: 'Вадим', last_name: 'Козак', color: 'blue', shelf: 'A1', weight_kg: 6.3 },
  { id: 2143, first_name: 'Богдан', last_name: 'Яворський', color: 'gold', shelf: 'B1', weight_kg: 3.85 },
  // Same recipients, different parcels: a name alone cannot solve level-two material.
  { id: 3011, first_name: 'Олена', last_name: 'Гончар', color: 'brown', shelf: 'B1', weight_kg: 8 },
  { id: 3022, first_name: 'Марко', last_name: 'Дзюба', color: 'blue', shelf: 'A2', weight_kg: 0.2 },
  { id: 3033, first_name: 'Ірина', last_name: 'Левченко', color: 'brown', shelf: 'A1', weight_kg: 1.8 },
  { id: 3044, first_name: 'Остап', last_name: 'Ковальчук', color: 'red', shelf: 'B1', weight_kg: 2 },
  { id: 3055, first_name: 'Соломія', last_name: 'Мороз', color: 'brown', shelf: 'A1', weight_kg: 3.5 },
  { id: 3066, first_name: 'Роман', last_name: 'Савка', color: 'blue', shelf: 'B1', weight_kg: 0.75 },
  { id: 3077, first_name: 'Дарина', last_name: 'Білик', color: 'blue', shelf: 'A1', weight_kg: 5.1 },
  { id: 2079, first_name: 'Денис', last_name: 'Кравець', color: 'brown', shelf: 'A2', weight_kg: 1.25 },
];
export const schema = ['id', 'first_name', 'last_name', 'color', 'shelf', 'weight_kg'];

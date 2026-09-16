import type { Order } from '../content.ts';
import type { QueryResult } from '../sql/client.ts';

export function starsFor(served: number): number {
  return served >= 12 ? 3 : served >= 10 ? 2 : served >= 6 ? 1 : 0;
}
/** Mistakes reduce only this customer's potential payment, never the saved wallet. */
export function customerPayment(baseReward: number, mistakes: number): number {
  return Math.max(0, baseReward - Math.max(0, mistakes) * 5);
}
export function shiftSummary(mainServed: number, bonusServed: boolean) {
  return { total: mainServed + Number(bonusServed), main: mainServed, bonus: bonusServed, stars: starsFor(mainServed) };
}
export function assess(result: QueryResult, order: Order) {
  if (result.rows.length === 0) return { kind: 'notice', message: 'Посилку не знайдено. Змініть умову WHERE. Спроба не витрачена.' } as const;
  if (result.rows.length > 1) return { kind: 'notice', message: 'Робот може підняти лише одну коробку. Уточніть WHERE. Спроба не витрачена.' } as const;
  if (!result.columns.includes('id')) return { kind: 'notice', message: 'Додайте id до SELECT: роботу потрібен номер посилки.' } as const;
  return { kind: 'delivery', correct: result.rows[0].id === order.parcelId } as const;
}

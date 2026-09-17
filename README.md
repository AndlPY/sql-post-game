# SQL Post — browser game

Навчальна browser game про SQL і поштове відділення. Поточна версія: **0.3.0**. Історія змін: [CHANGELOG.md](CHANGELOG.md). Repository: [AndlPY/sql-post-game](https://github.com/AndlPY/sql-post-game).

## Запуск робочої збірки

Потрібен Node.js 24 LTS. У корені проєкту:

```powershell
npm.cmd ci
npm.cmd run dev
```

Відкрити адресу, яку виведе Vite (типово http://127.0.0.1:5173).

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

Production output: `dist/`. PostgreSQL/PGlite працює локально у Web Worker; account і backend не потрібні. Збереження прив'язане до браузера та адреси сайту. Незавершена зміна після виходу починається спочатку; монети і найкращі зірки залишаються.

Версія 0.3.0 додає меню вибору рівня, музику, рух черги, покроковий tutorial, нульового клієнта, перемішування когорт і рівень 2 WHERE. Рівень 2 відкривається після 3★ першого. Playtest залишається за користувачем; GitHub Actions виконує tests і build перед deployment. [Статус](Docs/Design/implementation-status.md), [як влаштовані рівні й замовлення](Docs/Design/level-authoring.md). [Грати в SQL Post](https://andlpy.github.io/sql-post-game/).

## Навігація

Читай лише документ, потрібний для поточної задачі; докладні каталоги винесено в підпапки.

| Тема | Документ |
| --- | --- |
| Код, модулі, конфігурація та tests | [src/README.md](src/README.md) |
| **Пріоритетні зміни** | [**Backlog**](Docs/Design/mvp-backlog.md) |
| Дизайн, статус, навчальні матеріали | [Docs/README.md](Docs/README.md) |
| Versioning, перевірка й GitHub Pages | [Development](Docs/Development/README.md) |
| Assets, макети та prompts | [Img/README.md](Img/README.md) |
| Старі матеріали | [Archive/README.md](Archive/README.md) |

## Як працюємо

Одна невелика зміна → локальна перевірка → playtest користувача → виправлення → після підтвердження commit/push. Push у main запускає deployment. Не об'єднувати кілька неперевірених механік в одну ітерацію.

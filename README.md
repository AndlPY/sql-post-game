# SQL Post — browser game

Навчальна browser game про SQL і поштове відділення. Поточна версія: **0.2.0**. Історія змін: [CHANGELOG.md](CHANGELOG.md). Репозиторій для майбутньої публікації: `sql-post-game`.

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

Це початкова робоча збірка: покроковий tutorial, level selection і повні анімації ще в роботі. [Перевірки та обмеження](Docs/Design/implementation-status.md). Публічного URL поки немає.

## Карта коду та службових файлів

| Файл | Що містить / коли змінювати |
| --- | --- |
| [src/main.ts](src/main.ts) | DOM інтерфейс, початок/кінець зміни, поточний клієнт і спроби, Run, preview, нарахування оплати, діалоги й підсумок. З'єднує UI, DB та Phaser. |
| [src/content.ts](src/content.ts) | Навчальна таблиця parcels, 13 реплік, id правильних посилок, базові винагороди й еталонні SQL. Нові завдання починати тут. |
| [src/editor.ts](src/editor.ts) | CodeMirror SQL-editor: PostgreSQL highlighting, історія редагування, автоматичні парні лапки. Keyword autocomplete вимкнений. |
| [src/style.css](src/style.css) | Весь HTML/CSS UI: sidebar, typography, SQL/preview, кнопки, адаптація вікна, modal і зірки. |
| [src/profile.ts](src/profile.ts) | Один локальний профіль, перевірка saved data, localStorage. Ключ `sql-post.profile.v1`; це версія формату даних, не версія релізу. |
| [src/game/rules.ts](src/game/rules.ts) | Чисті правила: правильна посилка, оплата після помилок, зірки та підрахунок основних/бонусних клієнтів. |
| [src/game/scene.ts](src/game/scene.ts) | Phaser scene: assets, шари, позиції персонажів, маршрути/швидкість робота, pickup і повернення посилки. |
| [src/game/frames.json](src/game/frames.json) | Frame rectangles для spritesheets. Генерується скриптом; покадрова візуальна нормалізація ще потрібна. |
| [src/sql/database.ts](src/sql/database.ts) | Створення PostgreSQL/PGlite, seed, SELECT-only role та read-only виконання одного запиту. |
| [src/sql/worker.ts](src/sql/worker.ts) | Запуск DB у Web Worker, завантаження WASM/data, послідовна черга повідомлень. |
| [src/sql/client.ts](src/sql/client.ts) | Зв'язок UI з Worker: request id, результати/помилки, timeout і відновлення Worker. |
| [scripts/asset-manifest.py](scripts/asset-manifest.py) | Читає alpha PNG і генерує frames.json. Потребує Python + Pillow, не змінює оригінальні картинки. Для звичайного запуску не потрібен. |
| [tests/core.test.ts](tests/core.test.ts) | Реальні SQL-тести на PGlite, усі 13 відповідей, правила оплати/зірок, валідація профілю. |
| [index.html](index.html) | HTML entrypoint, мова сторінки, title, root element. |
| [package.json](package.json) | Версія гри, npm scripts та dependencies. Версія з цього файлу показана в грі. |
| [package-lock.json](package-lock.json) | Точні версії dependencies для відтворюваного `npm ci`; commit разом із package.json. |
| [tsconfig.json](tsconfig.json) | TypeScript strict mode і browser/Worker типи. |
| [vite.config.ts](vite.config.ts) | Bundler, ES Worker і відносний `base: './'`, потрібний також для `/sql-post-game/` на Pages. |
| [.github/workflows/pages.yml](.github/workflows/pages.yml) | GitHub Actions: push у main → npm ci → tests → build → GitHub Pages. Публікує тільки dist. |
| [.gitignore](.gitignore) | Виключає dependencies, build output, QA й тимчасові файли з Git. |
| [CHANGELOG.md](CHANGELOG.md) | Помітні зміни кожного релізу. |
| [Docs/Design/mvp-backlog.md](Docs/Design/mvp-backlog.md) | Актуальні рішення, впорядковані задачі, залежності, checkboxes. |
| [Docs/Design/implementation-status.md](Docs/Design/implementation-status.md) | Що реалізовано, що реально перевірено, відомі обмеження. |
| [Docs/Design/sound-backlog.md](Docs/Design/sound-backlog.md) | Майбутні звуки в порядку важливості; у MVP звуку немає. |
| [Img/Assets/UI/reward-star.png](Img/Assets/UI/reward-star.png) | Згенерована прозора pixel-art зірка для підсумку; незароблені зірки затемнюються CSS. |
| [Img/Prompts/reward-star-prompt.md](Img/Prompts/reward-star-prompt.md) | Точний prompt та походження зображення зірки. |

`Img/Assets/` — runtime art, `Img/Mockups/` — візуальні цілі, `Img/Prompts/` — історія генерації, `Docs/` — дизайн/навчальні матеріали, `Archive/` — старі варіанти. `node_modules/` встановлює npm; `dist/` створює build; їх вручну не редагувати. `asset-review.jpg` — контактний аркуш початкового аудиту, не використовується грою.

## Актуальні правила v0.2.0

- 12 основних клієнтів + 1 бонусний = 13. Зірки тільки за основних: 0–5 → 0★, 6–9 → 1★, 10–11 → 2★, 12 → 3★. UI показує також загальну кількість із 13.
- Помилка зменшує можливу оплату поточного клієнта на 5, а не баланс гравця: 20 → 15 → 10. Після третьої помилки клієнт іде без оплати. Оплата не нижча 0.
- 0 / більше 1 рядка, синтаксична помилка чи відсутній id — пояснення без штрафу та витрати спроби.
- Правильність — правильний id посилки. Клієнти не вимагають певних колонок; `SELECT *` поки допустимий. Навчальну мотивацію вибору колонок розробимо окремо.
- Монети нараховуються та зберігаються лише після успішної видачі; старі збереження не обнуляються.
- Рух робота вдвічі повільніший за v0.1.0, із паузами при pickup/handoff; видача поруч із працівником.

## Versioning і GitHub Pages

Пропозиція: `0.MINOR.PATCH` до стабільного релізу. Нові механіки/помітні зміни — minor, виправлення — patch. `main` містить перевірену версію для тестерів; зміни готувати у feature branches. Git tag `v0.2.0` позначає конкретний реліз, CHANGELOG описує його. Формат local save має незалежну версію; не міняти storage key при кожному release, інакше зникне видимий прогрес.

Підготовлено workflow, але repository та публічний сайт ще не створені. Після створення repository `sql-post-game`:

1. Завантажити проєкт у GitHub. Для безкоштовного GitHub Pages на GitHub Free потрібен public repository; приватні Docs/чернетки перед публікацією відокремити, якщо вони не призначені для відкритого доступу.
2. У repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push у `main` запускає `.github/workflows/pages.yml`. Після успішного workflow сайт буде за `https://<github-login>.github.io/sql-post-game/`.
4. Дати тестерам посилання. Просити разом із bug report вказувати версію внизу сцени, browser, очікувану/фактичну поведінку та SQL.
5. Перевірити публічний URL: cold load, Worker/WASM, SELECT із кирилицею, local save, reload, зірки. Успішний локальний build не замінює перевірку hosting.

GitHub Pages достатньо для поточного MVP: backend немає, PGlite працює локально. Сайт відкривається всім, але прогрес кожного залишається лише в його браузері. Прогрес із localhost автоматично не переноситься на github.io. Інші repository на тому самому `github-login.github.io` поділяють origin, тому storage key має префікс `sql-post`.

Для наступного релізу після перевірки змін:

```powershell
npm.cmd version patch --no-git-tag-version
npm.cmd test
npm.cmd run build
# Оновити CHANGELOG, зробити commit, tag і push у власний repository.
```

Збереження між пристроями, accounts та приватний прогрес у cloud — майбутній backend; сам Pages цього не додає. [Vite deployment](https://vite.dev/guide/static-deploy#github-pages), [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## Документи — Docs

- [MVP backlog і актуальні рішення](Docs/Design/mvp-backlog.md) — порядок реалізації, залежності й статус виконання; рішення від 16.09.2026 мають пріоритет над попереднім описом.
- [Звуки після MVP](Docs/Design/sound-backlog.md) — пріоритетний список для майбутньої генерації.

- [Робочий опис і механіки гри](<Docs/Design/Пр 1 .md>) — контекст і рішення з game design.
- [Анімації кодом](Docs/Design/code-animations.md) — короткий список за пріоритетом для MVP.
- [Оригінальна ПР №1](<Docs/Assignments/Пр 1 — оригінальне завдання.md>) — умови роботи.
- [Завдання №2](<Docs/Assignments/Пр 2.md>) — умови наступної роботи.
- [Передфінальна робота №1, DOCX](<Docs/Deliverables/Практична робота 1 game design  .docx>) — версія для здачі.
- [Презентація до ПР №1](https://www.canva.com/design/DAHVQU_d3mU/LnDzQfdte8U4Wb_7xswCGw/edit) — Canva.
- [Документ ПР №1](https://docs.google.com/document/d/1DfaYvJYa_BfBJ9e3DpE4VHXVKleMFXhntUrNEBfcS8s/edit?tab=t.0) — письмовий опис проєкту.

## Макети — Img/Mockups

- [Gameplay v3](Img/Mockups/Gameplay/gameplay-v3.png) — основний екран.
- [Level selection v2](Img/Mockups/Level-selection/levels-v2.png) — вибір рівня.

## Середовище — Img/Assets/Environment

- [Кімната v2](Img/Assets/Environment/post-office-gameplay-room-v2.png) — фон зі стелажами, без стола та персонажів.
- [Стіл](Img/Assets/Environment/post-office-service-counter.png) — окремий об’єкт із прозорим фоном.
- [Модулі стелажів](Img/Assets/Environment/post-office-shelving-modules.png) — три варіанти на одному аркуші.
- [Декор](Img/Assets/Environment/post-office-decor-set.png) — лампа, рослини та настінні елементи.
- [Порожня кімната](Img/Assets/Environment/post-office-empty-room.png) — попередній варіант фону.

## Предмети — Img/Assets/Props

- [Обладнання працівника](Img/Assets/Props/post-office-clerk-workstation.png) — монітор, миша та штамп.
- [Обладнання інструктора](Img/Assets/Props/post-office-instructor-workstation.png) — монітор, документи та ручки.

## Персонажі — Img/Assets/Characters

- [Працівниця](Img/Assets/Characters/postal-clerk-female-sheet.png) — idle і передача посилки з посмішкою.
- [Працівник](Img/Assets/Characters/postal-clerk-male-sheet.png) — idle і передача посилки з посмішкою.
- [Наставник](Img/Assets/Characters/postal-mentor-sheet.png) — idle і жести пояснення.
- [Клієнтка в капелюсі](Img/Assets/Characters/customer-tan-hat-sheet.png) — очікування та ходьба в 4 напрямках.
- [Рудоволоса клієнтка](Img/Assets/Characters/customer-redhead-sheet.png) — очікування та ходьба в 4 напрямках.
- [Клієнт в оливковій куртці](Img/Assets/Characters/customer-olive-jacket-sheet.png) — очікування та ходьба в 4 напрямках.

- [Робот без посилки](Img/Assets/Characters/postal-robot-empty-8-directions.png) — 8 напрямків.
- [Робот із посилкою](Img/Assets/Characters/postal-robot-loaded-8-directions.png) — 8 напрямків.
- [Взяття посилки](Img/Assets/Characters/postal-robot-pickup-west-sheet.png) — 4 кадри, ракурс ліворуч.

## Портрети — Img/Assets/Portraits

- Жести наставника: [відкрита долоня](Img/Assets/Portraits/Mentor-gestures/mentor-open-palm.png), [піднятий палець](Img/Assets/Portraits/Mentor-gestures/mentor-raised-finger.png), [вказування праворуч](Img/Assets/Portraits/Mentor-gestures/mentor-point-right.png), [обидві руки](Img/Assets/Portraits/Mentor-gestures/mentor-both-hands.png).

- [Наставник](Img/Assets/Portraits/postal-mentor-portrait.png) — великий портрет для пояснень.
- [Клієнтка в капелюсі](Img/Assets/Portraits/customer-tan-hat-portrait.png) — портрет для діалогу.
- [Рудоволоса клієнтка](Img/Assets/Portraits/customer-redhead-portrait.png) — портрет для діалогу.
- [Клієнт в оливковій куртці](Img/Assets/Portraits/customer-olive-jacket-portrait.png) — портрет для діалогу.

## Промпти — Img/Prompts

- [Жести наставника](Img/Prompts/mentor-gesture-portraits-prompts.md) — промпти чотирьох портретів.

- [Gameplay v3](Img/Prompts/gameplay-v3-prompt.md) та [prototype v2](Img/Prompts/prototype-prompts-v2.md) — промпти макетів.
- [Середовище](Img/Prompts/environment-assets-prompts.md) — початковий набір assets.
- [Кімната v2](Img/Prompts/post-office-gameplay-room-v2-prompt.md) — кімната зі стелажами.
- [Фон без стола та обладнання](Img/Prompts/post-office-layered-scene-prompts.md) — останні правки й робочі місця.
- [Персонажі та портрети](Img/Prompts/characters-and-portraits-prompts.md) — промпти та схема кадрів spritesheets.
- [Портрети v2](Img/Prompts/portraits-v2-prompts.md) — запасний стиль за [pixel-art reference](Img/References/portrait-pixel-style.png).

- [Робот і новий клієнт](Img/Prompts/robot-and-customer-prompts.md) — промпти генерації.

## Архів — Archive

- `Archive/Drafts` — проміжні тексти.
- `Archive/Img/Gameplay` — попередній gameplay.
- `Archive/Img/Backgrounds` — попередні фони, зокрема [кімната зі столом](Archive/Img/Backgrounds/post-office-gameplay-room-v2-with-counter.png).
- `Archive/Img/References` — старі references.

- [Запасний стиль портретів](Archive/Img/Portraits/alternate-pixel-style/) — альтернативний набір.


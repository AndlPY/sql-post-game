# Карта коду та службових файлів

[Головна](../README.md) · `../Docs/README.md` (локально)

Це карта відповідальностей, не журнал виконання. При зміні шляху або відповідальності редагуй наявний рядок; результати перевірок — лише в `../Docs/Design/implementation-status.md` (локально).

| Файл | Що містить / коли змінювати |
| --- | --- |
| [levels.ts](levels.ts) | Конфігурації рівнів 1/2: спільний склад, demo/tutorial, явні когорти, Fisher–Yates і змішування повторень, структурні обмеження контенту. [Правила авторства](../Docs/Design/level-authoring.md). |
| [tutorial.ts](tutorial.ts) | Спільний неблокувальний controller: кроки, стрілка за межами DOM, портрети, demo та повтор UI. |
| [tutorial-content.ts](tutorial-content.ts) | Спільний UI-вступ і початковий SQL-вступ рівня 1. Для інших тем tutorial задається у конфігурації рівня. |
| [menu.ts](menu.ts) | Меню 10 змін, профіль/зірки, назви тем із game design; музика меню й окремі збережені audio settings. |
| [src/main.ts](main.ts) | DOM інтерфейс, початок/кінець зміни, поточний клієнт і спроби, Run, preview, нарахування оплати, діалоги, gameplay Меню/Esc й підсумок. З'єднує UI, DB та Phaser. |
| [data/parcels.ts](data/parcels.ts) | Єдиний склад усіх рівнів, тип Parcel і список schema. Після зміни даних переглядати завдання всіх рівнів. |
| [src/content.ts](content.ts) | Customer/Order, п’ять customer-виглядів, замовлення рівня 1; сумісний re-export parcels/schema/Parcel із data/parcels.ts. |
| [src/editor.ts](editor.ts) | CodeMirror SQL-editor: PostgreSQL highlighting, історія редагування, автоматичні парні лапки. Keyword autocomplete вимкнений. |
| [src/style.css](style.css) | Весь HTML/CSS UI: sidebar, typography, SQL/preview, кнопки, адаптація вікна, modal і зірки. |
| [src/profile.ts](profile.ts) | Один локальний профіль, перевірка saved data, localStorage. Ключ `sql-post.profile.v1`; це версія формату даних, не версія релізу. |
| [src/game/rules.ts](game/rules.ts) | Чисті правила: правильна посилка, оплата після помилок, зірки та підрахунок основних/бонусних клієнтів. |
| [src/game/scene.ts](game/scene.ts) | Phaser scene: assets, шари, позиції персонажів, маршрути/швидкість робота, pickup і повернення посилки. |
| [src/game/frames.json](game/frames.json) | Frame rectangles для spritesheets. Генерується asset-manifest.py; customer bounds визначаються за alpha-проміжками окремого sheet. |
| [src/sql/database.ts](sql/database.ts) | Створення PostgreSQL/PGlite, спільний seed із data/parcels.ts, SELECT-only role та read-only виконання одного запиту. |
| [src/sql/worker.ts](sql/worker.ts) | Запуск DB у Web Worker, завантаження WASM/data, послідовна черга повідомлень; один склад для всіх рівнів без підміни каталогу. |
| [src/sql/client.ts](sql/client.ts) | Зв'язок UI з Worker: request id, результати/помилки, timeout і відновлення Worker. |
| [scripts/asset-manifest.py](../scripts/asset-manifest.py) | Читає alpha PNG і генерує frames.json; customer sheets розділяє за прозорими проміжками кожного PNG. Потребує Python + Pillow, не змінює оригінальні картинки. Для звичайного запуску не потрібен. |
| [tests/core.test.ts](../tests/core.test.ts) | SQL-тести на PGlite для 13 відповідей content.ts (рівень 1), правил оплати/зірок, профілю та tutorial. SQL-перевірки рівня 2 на спільному складі та повторних одержувачів; shuffle не покрито. Запускає користувач. |
| [index.html](../index.html) | HTML entrypoint, мова сторінки, title, root element. |
| [package.json](../package.json) | Версія гри, npm scripts та dependencies. Версія з цього файлу показана в грі. |
| [package-lock.json](../package-lock.json) | Точні версії dependencies для відтворюваного `npm ci`; commit разом із package.json. |
| [tsconfig.json](../tsconfig.json) | TypeScript strict mode і browser/Worker типи. |
| [vite.config.ts](../vite.config.ts) | Bundler, ES Worker і відносний `base: './'`, потрібний також для `/sql-post-game/` на Pages. |
| [.github/workflows/pages.yml](../.github/workflows/pages.yml) | GitHub Actions: push у main → npm ci → tests → build → GitHub Pages. Публікує тільки dist. |
| [.gitignore](../.gitignore) | Виключає dependencies, build output, QA й тимчасові файли з Git. |
| [CHANGELOG.md](../CHANGELOG.md) | Помітні зміни кожного релізу. |
| [Docs/Design/mvp-backlog.md](../Docs/Design/mvp-backlog.md) | Актуальні рішення, впорядковані задачі, залежності, checkboxes. |
| `../Docs/Design/implementation-status.md` (локально) | Що реалізовано, що реально перевірено, відомі обмеження. |
| [Img/Assets/UI/reward-star.png](../Img/Assets/UI/reward-star.png) | Згенерована прозора pixel-art зірка для підсумку; незароблені зірки затемнюються CSS. |
| [Img/Prompts/reward-star-prompt.md](../Img/Prompts/reward-star-prompt.md) | Точний prompt та походження зображення зірки. |


Зображення: [каталог](../Img/README.md). node_modules/ встановлює npm; dist/ створює build; їх вручну не редагувати. Archive/Img/asset-review.jpg — контактний аркуш початкового аудиту, не використовується грою.

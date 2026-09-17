# Карта коду та службових файлів

[Головна](../README.md)

| Файл | Що містить / коли змінювати |
| --- | --- |
| [levels.ts](levels.ts) | Конфігурації рівнів 1/2: власні каталоги, demo/tutorial, явні когорти, Fisher–Yates і змішування повторень, структурні обмеження контенту. [Правила авторства](../Docs/Design/level-authoring.md). |
| [tutorial.ts](tutorial.ts) | Спільний неблокувальний controller: кроки, стрілка за межами DOM, портрети, demo та повтор UI. |
| [tutorial-content.ts](tutorial-content.ts) | Спільний UI-вступ і початковий SQL-вступ рівня 1. Для інших тем tutorial задається у конфігурації рівня. |
| [menu.ts](menu.ts) | Меню 10 змін, профіль/зірки, назви тем із game design; музика меню й окремі збережені audio settings. |
| [src/main.ts](main.ts) | DOM інтерфейс, початок/кінець зміни, поточний клієнт і спроби, Run, preview, нарахування оплати, діалоги й підсумок. З'єднує UI, DB та Phaser. |
| [src/content.ts](content.ts) | Навчальна таблиця parcels, 13 реплік, id правильних посилок, базові винагороди й еталонні SQL. Нові завдання починати тут. |
| [src/editor.ts](editor.ts) | CodeMirror SQL-editor: PostgreSQL highlighting, історія редагування, автоматичні парні лапки. Keyword autocomplete вимкнений. |
| [src/style.css](style.css) | Весь HTML/CSS UI: sidebar, typography, SQL/preview, кнопки, адаптація вікна, modal і зірки. |
| [src/profile.ts](profile.ts) | Один локальний профіль, перевірка saved data, localStorage. Ключ `sql-post.profile.v1`; це версія формату даних, не версія релізу. |
| [src/game/rules.ts](game/rules.ts) | Чисті правила: правильна посилка, оплата після помилок, зірки та підрахунок основних/бонусних клієнтів. |
| [src/game/scene.ts](game/scene.ts) | Phaser scene: assets, шари, позиції персонажів, маршрути/швидкість робота, pickup і повернення посилки. |
| [src/game/frames.json](game/frames.json) | Frame rectangles для spritesheets. Генерується скриптом; покадрова візуальна нормалізація ще потрібна. |
| [src/sql/database.ts](sql/database.ts) | Створення PostgreSQL/PGlite, seed, SELECT-only role та read-only виконання одного запиту. |
| [src/sql/worker.ts](sql/worker.ts) | Запуск DB у Web Worker, завантаження WASM/data, послідовна черга повідомлень. |
| [src/sql/client.ts](sql/client.ts) | Зв'язок UI з Worker: request id, результати/помилки, timeout і відновлення Worker. |
| [scripts/asset-manifest.py](../scripts/asset-manifest.py) | Читає alpha PNG і генерує frames.json. Потребує Python + Pillow, не змінює оригінальні картинки. Для звичайного запуску не потрібен. |
| [tests/core.test.ts](../tests/core.test.ts) | Реальні SQL-тести на PGlite, усі 13 відповідей, правила оплати/зірок, валідація профілю. |
| [index.html](../index.html) | HTML entrypoint, мова сторінки, title, root element. |
| [package.json](../package.json) | Версія гри, npm scripts та dependencies. Версія з цього файлу показана в грі. |
| [package-lock.json](../package-lock.json) | Точні версії dependencies для відтворюваного `npm ci`; commit разом із package.json. |
| [tsconfig.json](../tsconfig.json) | TypeScript strict mode і browser/Worker типи. |
| [vite.config.ts](../vite.config.ts) | Bundler, ES Worker і відносний `base: './'`, потрібний також для `/sql-post-game/` на Pages. |
| [.github/workflows/pages.yml](../.github/workflows/pages.yml) | GitHub Actions: push у main → npm ci → tests → build → GitHub Pages. Публікує тільки dist. |
| [.gitignore](../.gitignore) | Виключає dependencies, build output, QA й тимчасові файли з Git. |
| [CHANGELOG.md](../CHANGELOG.md) | Помітні зміни кожного релізу. |
| [Docs/Design/mvp-backlog.md](../Docs/Design/mvp-backlog.md) | Актуальні рішення, впорядковані задачі, залежності, checkboxes. |
| [Docs/Design/implementation-status.md](../Docs/Design/implementation-status.md) | Що реалізовано, що реально перевірено, відомі обмеження. |
| [Img/Assets/UI/reward-star.png](../Img/Assets/UI/reward-star.png) | Згенерована прозора pixel-art зірка для підсумку; незароблені зірки затемнюються CSS. |
| [Img/Prompts/reward-star-prompt.md](../Img/Prompts/reward-star-prompt.md) | Точний prompt та походження зображення зірки. |


Зображення: [каталог](../Img/README.md). node_modules/ встановлює npm; dist/ створює build; їх вручну не редагувати. Archive/Img/asset-review.jpg — контактний аркуш початкового аудиту, не використовується грою.

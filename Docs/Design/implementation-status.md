# Статус реалізації — 2026-09-16

## v0.2.0 — актуальні зміни

- Штраф віднімається тільки від потенційної оплати клієнта. Wallet не зменшується. Старі записи нижче описують v0.1.0, де це було реалізовано неправильно.
- Рух ×2 за часом, pickup frames і pause/handoff поруч із clerk.
- Менші шрифти, більші preview/editor, Run унизу, автоматичні парні лапки.
- Репліки не вимагають колонок; бонус про 2800 g → weight_kg 2.8.
- Generated image stars; total /13, main /12, bonus і centered summary.
- README file map, версія в UI, CHANGELOG, готовий Pages workflow.
- Новий tutorial тільки в backlog, без реалізації.

### QA v0.2.0

- `npm test`: 3 suites успішні; усі еталонні SQL, SELECT * / id-only для клієнта №5, bonus 2800/1000.0, customer payment та основні/загальні лічильники.
- `npm run build`: успішний; dependency warnings PGlite eval/large chunk залишаються, не є errors.
- Browser: wallet 10 → помилка → wallet 10, оплата 5 → правильна видача → wallet 15. Три помилки наступного клієнта залишили wallet 15, клієнт пішов.
- Повний прохід із однією помилкою другого клієнта й відходом третього: total 12/13, main 11/12, bonus serviced, 2 image stars + 1 dim image, зароблено 175. Це очікувані 190 − 5 − 10.
- Введення одинарної й подвійної лапки створює пару; подальший текст вводиться між ними.
- Screenshot QA: 1280×720 і 1920×1080, Run унизу, робот поряд із clerk, centered summary. Full HD: editor content близько 188 px заввишки, preview content 252 px.
- Локальна симуляція Pages: статичний build за `/sql-post-game/`; картинки, Worker/WASM, SELECT із кирилицею працюють, browser error logs порожні. Це не перевірка реального github.io deployment.
- Зірка: 1254×1254 RGBA, alpha 0–255; скопійована в repository без зміни оригіналу.
- Public deployment виконано: https://andlpy.github.io/sql-post-game/. GitHub Actions успішно виконав tests, build і deploy. На реальному github.io перевірено cold load, assets, Worker/WASM, SELECT за прізвищем Коваль, правильну доставку, +10 монет і збереження nickname/монет після виходу та reload. Повний прохід і зірки на public hosting окремо не повторювалися.

## v0.1.0 — історичний звіт

Це початок реалізації за mvp-backlog.md, не фінальний MVP для публічного релізу.

## Реалізовано

- Vite + TypeScript + Phaser 3, CodeMirror SQL highlighting (без autocomplete).
- PostgreSQL/PGlite у Web Worker, in-memory seed, кириличні значення.
- Обмеження SELECT, restricted role, read-only transaction, single statement через extended query protocol; watchdog перезапускає Worker після 4 секунд.
- 13 фіксованих замовлень + tutorial-посилка в seed; реальний preview, snapshot result set при Run.
- Нуль і множина рядків без штрафу; неправильна одна посилка −5, floor 0, третя помилка завершує замовлення.
- 10/20/30 монет, 12 основних і 1 бонусний клієнт, зірки, підсумок.
- Локальний nickname/стать/монети/найкращі зірки, внутрішнє попередження виходу та beforeunload.
- HTML/CSS UI за композицією gameplay-v3, Phaser-сцена з наявних assets.
- Скрипт scripts/asset-manifest.py визначає 98 frame rectangles за alpha, не змінюючи оригінали.

## Перевірено

- `npm run build` і TypeScript пройшли.
- `npm test`: реальна PostgreSQL виконує всі 13 еталонів; перевірено кирилицю, неправильний SQL, заборону DROP/UPDATE/кількох statements/SELECT INTO та відновлення після помилки; пороги зірок і валідацію профілю.
- In-app Chromium: правильна доставка, перехід клієнта, нуль/множина без втрати спроби, три невдачі → клієнт іде, монети не нижче 0.
- Повний browser playthrough: 12/12, 3★, +190 монет, бонус видано.
- Після виходу й reload монети та nickname зберігаються, поточна зміна починається спочатку.
- Візуальний перегляд 1920×1080 і 1280×720; SQL highlighting виправлено для контрасту, працівники підняті над стільницею.
- Production preview на http://127.0.0.1:4173/: Worker/WASM завантажуються, SELECT за українським прізвищем працює, browser error logs порожні. Після повного проходу й reload підтверджено збереження 3★ та 190 монет.

## Відомі незавершені частини

- Tutorial поки одна текстова довідка. Потрібні покрокові UI → SQL → окрема демонстрація та повтор без демонстрації.
- Стартова форма замінює повноцінний level selection; повтор дозволений.
- Рух робота є, але pickup/dropoff, handoff, customer walk cycles і depth/occlusion ще не доведені. Поточний golden effect тонує всього робота — тимчасова заглушка, не готова золота посилка.
- Frame rectangles — початкова автоматична нарізка; потрібна нормалізація масштабу, baseline, візуальна playback QA, особливо при зміні напрямку.
- UI повторює композицію, але не є pixel-perfect: інші актуальні assets, простіші рамки/шрифти/coin icon. Потрібен окремий візуальний прохід.
- Фон не спорожнює, видані записи поки залишаються у DB за погодженим scope.
- Немає звуку, cloud saves, перемішування клієнтів, наступних рівнів.
- Немає окремої перевірки Chrome/Edge/Firefox і повного performance profiling. Публічний deploy перевірено у v0.2.0, див. QA вище.
- PGlite дає warnings про eval у dependency під час build; основний JS chunk великий. Це не build errors. Потрібні оптимізація assets та замір cold load перед релізом.

## Наступна робота

Спочатку E03 (tutorial) і E02 (вибір рівня), потім B02/D01–D04 (анімації й узгоджена сцена), F03/F04 (QA), F05 (deploy). Не позначати складені пункти виконаними, якщо готова лише частина.

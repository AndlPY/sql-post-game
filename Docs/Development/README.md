# Versioning і GitHub Pages

`../README.md` (локально) · `../Design/implementation-status.md` (локально) · `../../AGENTS.md` (локально)

## Межі роботи

Tests/build/typecheck, запуск гри та Computer Use виконує користувач, якщо не доручить інакше. Наведені нижче команди — для користувача. Агент може читати workflow/config, готувати документацію й зміни; commit/push/deploy потребують прямого доручення. Push у main запускає CI tests/build/deploy.

## Версія та перевірка

- Схема до стабільного релізу: 0.MINOR.PATCH; нові механіки/помітні зміни — minor, виправлення — patch. Версія коду — package.json, точні dependencies — package-lock.json, помітні зміни — CHANGELOG.
- При release синхронізувати package/lock, README і CHANGELOG. Handoff фіксує перевірений стан, pending QA та результат публікації; не вести другий release-status тут.
- Storage format має незалежну версію: не міняти ключ sql-post.profile.v1 через release. Прогрес прив'язаний до browser/origin; localhost не переноситься на github.io.
- main призначений для перевіреної версії, зміни готувати у feature branch (codex/ за замовчуванням). Tag vX.Y.Z позначає конкретний release; не заявляти, що tag існує, без перевірки.

## Процедура release

1. Отримати результат перевірок користувача й уточнити невирішені bugs у backlog. Старий QA не покриває нові зміни.
2. Оновити версію (якщо доручено release), README/CHANGELOG/lock. Користувач виконує tests/build та playtest.
3. За прямим дорученням зробити commit/tag/push. Workflow [pages.yml](../../.github/workflows/pages.yml): Node 24 → npm ci → npm test → npm run build → upload dist → Pages.
4. Перевірити фактичний результат GitHub Actions; зафіксувати commit/run URL та outcome в handoff. До отримання доказу писати «deployment не підтверджено».
5. Public smoke test виконує користувач: cold load, assets/Worker/WASM, SELECT із кирилицею, доставка, save/reload, зірки. Локальний build не доводить працездатність hosting.

Приклад команд користувача (тільки для дорученого patch release):

```powershell
npm.cmd version patch --no-git-tag-version
npm.cmd test
npm.cmd run build
```

## Hosting

Repository: [AndlPY/sql-post-game](https://github.com/AndlPY/sql-post-game). Адреса: [SQL Post](https://andlpy.github.io/sql-post-game/). Наявна конфігурація — GitHub Actions, output dist; поточний deployment визначається за CI, а не за цим текстом.

Для відновлення налаштування: Settings → Pages → Build and deployment → Source: GitHub Actions. Backend/accounts/cloud save поточний статичний проєкт не має. Для bug report потрібні версія UI, browser, SQL, очікувана й фактична поведінка.

Довідкові посилання, читати лише за потреби hosting: [Vite](https://vite.dev/guide/static-deploy#github-pages), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

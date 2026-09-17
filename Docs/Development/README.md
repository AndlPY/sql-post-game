# Versioning і GitHub Pages

[Головна](../../README.md)

Пропозиція: `0.MINOR.PATCH` до стабільного релізу. Нові механіки/помітні зміни — minor, виправлення — patch. `main` містить перевірену версію для тестерів; зміни готувати у feature branches. Git tag `v0.2.0` позначає конкретний реліз, CHANGELOG описує його. Формат local save має незалежну версію; не міняти storage key при кожному release, інакше зникне видимий прогрес.

Repository `AndlPY/sql-post-game` створено, GitHub Pages налаштовано на GitHub Actions. Workflow публікує `dist/` після успішних tests і build. Адреса: https://andlpy.github.io/sql-post-game/. Налаштування та перевірка deployment:

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

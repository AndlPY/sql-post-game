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

Версія 0.3.0 додає меню вибору рівня, музику, рух черги, покроковий tutorial, нульового клієнта, перемішування когорт і рівень 2 WHERE. Рівень 2 відкривається після 3★ першого. Playtest залишається за користувачем; GitHub Actions виконує tests і build перед deployment. `Docs/Design/implementation-status.md` (локально), [як влаштовані рівні й замовлення](Docs/Design/level-authoring.md). [Грати в SQL Post](https://andlpy.github.io/sql-post-game/).

## Документація

- [Карта коду](src/README.md), [рішення та backlog](Docs/Design/mvp-backlog.md), [правила рівнів](Docs/Design/level-authoring.md).
- [Development і публікація](Docs/Development/README.md), [каталог assets](Img/README.md), [історичні матеріали](Archive/README.md).

Локальні матеріали агента (`AGENTS.md`, `Docs/README.md`, `Docs/Design/implementation-status.md`, `Archive/Docs/`) зберігаються на диску й виключені через `.gitignore`. Вони не входять до Git clone; позначки «локально» в документації вказують на ці матеріали. Чинні вимоги, специфікації й каталоги assets залишаються в Git.

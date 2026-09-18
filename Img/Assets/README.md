# Assets

[Зображення](../README.md) · `../../Docs/README.md` (локально)

Каталоги містять статус, призначення, consumer і prompt. Позначки runtime звірено з кодом 2026-09-18; це не visual QA.

- [Environment](Environment/README.md) — кімната, стіл, декор, фон меню.
- [Props](Props/README.md) — обладнання робочих місць.
- [Characters](Characters/README.md) — sprites, робот, запасні персонажі.
- [Portraits](Portraits/README.md) — клієнти й жести наставника.

## UI та audio

| Asset / набір | Статус / призначення | Де підключено | Prompt / походження |
| --- | --- | --- | --- |
| [reward-star.png](UI/reward-star.png) | runtime: зірки меню й підсумку, незароблені затемнюються CSS | src/menu.ts, src/main.ts, src/style.css | [prompt](../Prompts/reward-star-prompt.md) |
| [menu-panels.png](UI/menu-panels.png) | runtime: atlas панелей/карток/кнопок без тексту; стара область дошки замінена hi-res | src/menu.ts (viewBox) | [prompt](../Prompts/prototype-prompts-v2.md) |
| [menu-icons.png](UI/menu-icons.png) | runtime: speaker/mute, lock, таблички | src/menu.ts (viewBox) | [prompt](../Prompts/prototype-prompts-v2.md) |
| [level-board-hires.png](UI/level-board-hires.png) | runtime: окрема дошка меню | src/menu.ts | [prompt](../Prompts/level-board-hires.md) |
| [Morning.mp3](../../Audio/Music/Morning.mp3) | runtime: loop лише в меню | src/menu.ts | Готовий audio; prompt та ліцензійне джерело в repository не знайдені |

Нарізка spritesheets: [asset-manifest.py](../../scripts/asset-manifest.py) → [frames.json](../../src/game/frames.json). Оригінали не змінювати. Читати manifest лише для роботи з кадрами; consumer — scene.ts. Spare, який потрапив у glob, не стає runtime без реального використання.

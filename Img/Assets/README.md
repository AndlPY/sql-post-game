# Assets

[Зображення](../README.md) · [Головна](../../README.md)

- [Environment](Environment/README.md) — кімната, стіл, стелажі, декор.
- [Props](Props/README.md) — обладнання робочих місць.
- [Characters](Characters/README.md) — персонажі та робот.
- [Portraits](Portraits/README.md) — діалоги та жести наставника.
- [Зірка винагороди](UI/reward-star.png) — прозорий PNG; незароблені зірки затемнюються CSS. [Prompt](../Prompts/reward-star-prompt.md).

Нарізка spritesheets: [scripts/asset-manifest.py](../../scripts/asset-manifest.py), результат: [frames.json](../../src/game/frames.json). Оригінальні картинки не змінювати під час генерації manifest.

- UI меню: [панелі](UI/menu-panels.png) і [динамік/замок/табличка](UI/menu-icons.png). Прозорі atlases, точні viewBox у src/menu.ts; [prompts](../Prompts/prototype-prompts-v2.md).

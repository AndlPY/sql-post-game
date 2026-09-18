# Середовище

[Каталог](../README.md)

| Asset | Статус / призначення | Підключення | Prompt |
| --- | --- | --- | --- |
| [Кімната v2](post-office-gameplay-room-v2.png) | runtime: фон зі стелажами, без стола/персонажів | src/game/scene.ts: room | [база](../../Prompts/post-office-gameplay-room-v2-prompt.md), [видалення стола](../../Prompts/post-office-layered-scene-prompts.md) |
| [Стіл](post-office-service-counter.png) | runtime: окремий прозорий counter | src/game/scene.ts, frames.json | [environment](../../Prompts/environment-assets-prompts.md) |
| [Стелажі](post-office-shelving-modules.png), [декор](post-office-decor-set.png) | spare: окремі модулі для майбутньої сцени | Підключення у src не знайдено | [environment](../../Prompts/environment-assets-prompts.md) |
| [Порожня кімната](post-office-empty-room.png) | retired: попередній фон, замінений room-v2 | У src не підключено; файл залишено на місці | [environment](../../Prompts/environment-assets-prompts.md) |
| [Фон меню](level-menu-background.png) | runtime: фон без UI та очей робота; очі SVG/CSS | src/style.css: .level-menu; очі src/menu.ts | [prototype v2](../../Prompts/prototype-prompts-v2.md) |

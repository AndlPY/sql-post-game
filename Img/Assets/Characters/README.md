# Персонажі

[Каталог](../README.md)

Consumer runtime-наборів: [scene.ts](../../../src/game/scene.ts), frame rectangles — src/game/frames.json, генератор — scripts/asset-manifest.py. Вибір клієнта — Customer/content.ts і levels.ts.

| Asset / набір | Статус / призначення | Підключення | Prompt |
| --- | --- | --- | --- |
| [Працівниця](postal-clerk-female-sheet.png), [працівник](postal-clerk-male-sheet.png) | runtime: працівник за профілем, idle/кадри передачі | scene.ts: clerk, setClerk; manifest | [персонажі](../../Prompts/characters-and-portraits-prompts.md) |
| [Наставник](postal-mentor-sheet.png) | runtime: персонаж біля стійки | scene.ts: figure; manifest | [персонажі](../../Prompts/characters-and-portraits-prompts.md) |
| [Капелюх](customer-tan-hat-sheet.png), [руда](customer-redhead-sheet.png), [червоний берет](customer-red-beret-sheet.png) | runtime: три повторно використовувані клієнти/черга/ходьба | scene.ts: people/customer texture/animations; manifest | [персонажі](../../Prompts/characters-and-portraits-prompts.md) |
| [Робот порожній](postal-robot-empty-8-directions.png), [з вантажем](postal-robot-loaded-8-directions.png), [pickup west](postal-robot-pickup-west-sheet.png) | runtime: 8 напрямків та pickup | scene.ts: robot texture; manifest | [робот](../../Prompts/robot-and-customer-prompts.md) |
| [Brown-haired man](customer-brown-haired-man-sheet.png), [glasses bob](customer-glasses-bob-sheet.png) | runtime: клієнти/черга/ходьба в обох рівнях | Customer/customers у content.ts → orders у levels.ts → frames/preload/animations у scene.ts | Відповідний prompt у repository не знайдено |
| [customer-zelenski](customer-zelenski.png) | spare: не показується | Лише Characters/*.png glob, немає frames/preload і Customer-варіанта | Відповідний prompt у repository не знайдено |

Оливкова куртка: історичний запасний варіант, але customer-olive-jacket-sheet.png **відсутній** у поточній папці. Залишились виключення glob у scene.ts, [портрет](../Portraits/customer-olive-jacket-portrait.png) і [prompt](../../Prompts/robot-and-customer-prompts.md). Не створювати посилання на неіснуючий sheet і не підключати його за назвою.

Нарізка п’яти customer sheets: окремі alpha-межі кожного PNG, спочатку прозорі проміжки між 4 рядами, потім між 5 персонажами в кожному ряду. Рівні частини canvas більше не використовуються для клієнтів. Скрипт зупиняється, якщо структура не відповідає 4 × 5, замість прихованого обрізання. PNG не змінено; scale постійний у межах sheet, origin унизу. Візуальну перевірку руху виконує користувач.

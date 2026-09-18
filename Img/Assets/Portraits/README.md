# Портрети

[Каталог](../README.md)

| Asset / набір | Статус / призначення | Підключення | Prompt |
| --- | --- | --- | --- |
| [Капелюх](customer-tan-hat-portrait.png), [руда](customer-redhead-portrait.png), [червоний берет](customer-red-beret-portrait.png) | runtime: репліки трьох клієнтів | src/game/scene.ts: asset glob; src/main.ts: portrait за order.customer | [персонажі](../../Prompts/characters-and-portraits-prompts.md) |
| [Долоня](Mentor-gestures/mentor-open-palm.png), [палець](Mentor-gestures/mentor-raised-finger.png), [праворуч](Mentor-gestures/mentor-point-right.png), [обидві руки](Mentor-gestures/mentor-both-hands.png) | runtime: жести tutorial | src/tutorial.ts: portraits glob; gesture у tutorial-content.ts/levels.ts | [жести](../../Prompts/mentor-gesture-portraits-prompts.md) |
| [Наставник](postal-mentor-portrait.png) | spare: одиночний портрет; зараз tutorial використовує жести | Підключення у src не знайдено | [персонажі](../../Prompts/characters-and-portraits-prompts.md) |
| [Оливкова куртка](customer-olive-jacket-portrait.png) | spare: запасний клієнт | У src не підключено | [робот і клієнт](../../Prompts/robot-and-customer-prompts.md) |
| [Brown-haired man](customer-brown-haired-man-portrait.png), [glasses bob](customer-glasses-bob-portrait.png) | runtime: репліки двох доданих клієнтів | scene.ts: portrait glob; main.ts: portrait за order.customer; обидва рівні | Відповідний prompt у repository не знайдено |

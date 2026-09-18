# Зображення

[Головна](../README.md) · `../Docs/README.md` (локально)

- [Assets](Assets/README.md) — scene/UI assets, статус і місце підключення, також audio.
- [Макети](Mockups/README.md) — reference для gameplay та меню.
- [Prompts](Prompts/README.md) — походження; читати лише пов'язаний із задачею prompt.
- [Pixel-art reference](References/portrait-pixel-style.png) — reference, runtime не підключений; [пов'язаний prompt](Prompts/portraits-v2-prompts.md).
- [Фон презентації](presentation-background.png) — reference для презентації, runtime не підключений; [prompt](Prompts/presentation-background-prompt.md).
- [Архів](../Archive/README.md) — retired варіанти; не поточні runtime assets.

Статуси: **runtime** — явно використовується кодом гри; **reference** — візуальний зразок; **spare** — запас без показу в грі; **retired** — замінений історичний варіант.

Перевіряти підключення пошуком у всьому src: scene.ts (glob + preload/frames + texture), main.ts (портрети/підсумок), menu.ts (UI/audio), tutorial.ts (жести), style.css (background). Включення в glob або наявність PNG не доводить показ; каталог фіксує статичне підключення, не результат browser QA.

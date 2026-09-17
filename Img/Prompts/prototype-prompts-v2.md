# SQL Post — прототипи v2

## UI assets і очі меню — 2026-09-17

Built-in imagegen. `menu-panels.png` і `menu-icons.png` — RGBA atlases 1254×1254; viewBox у src/menu.ts вибирає кожен елемент без зміни оригіналу. Тексти, hover, mute та blink — код. Фон level-menu-background.png оновлено: дисплей робота порожній для SVG-очей. Зірки беруться з наявного reward-star.png.

### ui

Reference: levels-v2.png

Exact prompt:

> Use case: stylized-concept. Generate production game UI SPRITE ATLAS based very closely on the attached SQL Post mockup (style reference). Genuine transparent RGBA background. Output 1536x1536 square, EXACT regular 2 columns by 3 rows grid; six cells each 768x512. Each asset centered in its cell with transparent padding and no overlaps, each uses almost entire cell width. No labels, letters, numbers, stars, padlocks or words anywhere. Row 1 left: the original wide burgundy fabric title banner with carved golden wooden top/bottom rails, brass corner rivets, tiny envelope ornaments left/right, blank center; aspect 4:1. Row 1 right: original dark walnut large rectangular level-selection board with deep inset dark brown center, thick layered carved wooden frame, brass square corner bolts; aspect 2.5:1, completely empty. Row 2 left: original parchment square level card, ivory paper texture, double wooden/bronze bevel edge, brass corner pins and small red wavy postal stamp upper right, blank center with no dotted divider; aspect 1:1, maximal height 460px. Row 2 right: exact same card with rich burgundy backing edge and highlighted bright gold corner brackets for selected state; blank parchment center; aspect 1:1, same size as adjacent card. Row 3 left: original wide bottom airmail description ticket with aged ivory parchment, thin wooden rim and red/blue diagonal postal stripes along border; totally blank with no button inside; aspect 4:1. Row 3 right: original wide burgundy PLAY button plate with beveled gold edge, corner highlights and dark drop shadow, NO text; aspect 3:1. Style: faithfully match original detailed warm crisp pixel art, visible pixel clusters, rich wood grain, realistic game-art material depth, not generic flat CSS rectangles. All are separate isolated assets seen perfectly front-on. Transparent space between assets. Exact cell layout matters because these will be sliced in code.

### icons

Reference: levels-v2.png, codex-clipboard-23403b51-902f-4c2b-84f1-f63bb7d25145.png

Exact prompt:

> Use case: stylized-concept. Production pixel-art game UI icon atlas on genuine transparent RGBA background. Image 1 is art-style reference, image 2 is shape reference for two speaker states. Output 1024x1024 square, exact 2 columns by 2 rows grid, cells 512x512 with large transparent margins, no overlapping. Top left: golden/cream speaker with 2 sound waves in a dark walnut SQUARE button housing, bronze/brass bevel rim and corner rivets; no letters. Top right: same exact speaker button at same size, but muted, with a clear red diagonal slash. Each top button should occupy x or y 56..456 inside its own cell. Bottom left: isolated small symmetric closed charcoal/steel padlock, chunky clean pixel silhouette, pale parchment keyhole, bronze highlights, matching locks in mockup; centered in cell, approximately 230 wide and 280 high, NO button/background panel. Bottom right: empty wide dark walnut profile/wallet plaque with layered bronze/brass frame, corner rivets, dark brown wood-grain center, aspect 2.4:1, approximately 460 wide by 192 high, centered in cell. No text or numbers or stars. Faithfully match rich textured warm pixel art of reference; not flat vector icons. Exact regular grid layout, genuine alpha transparency outside each asset.

### eyes

Reference: level-menu-background.png

Exact prompt:

> Use case: precise-object-edit. This is the edit target, keep it pixel-for-pixel compositionally identical. Remove ONLY the two glowing cyan eyes from the small robot's black face display on the right. Fill their pixels with the same dark navy-black glass as surrounding robot screen, smoothly restoring a blank unlit display. Keep screen shape, face bezel, head position/angle, robot body, antennas, cyan light on its arm, all shelves, lights, desk, plants, books, rug, framing and output dimensions EXACTLY unchanged. Do not redraw or move the robot. Do not add UI, text or any other objects. This empty display will have two eyes overlaid in code.


Створено built-in ImageGen за [старим референсом](../../Archive/Img/References/референс-old.png). Файли: [gameplay-v2.png](../../Archive/Img/Gameplay/gameplay-v2.png) і [levels-v2.png](../Mockups/Level-selection/levels-v2.png).

Верхня смуга gameplay містить тільки прогрес і монети. Профіль, рівні та зірки — на окремому екрані. Preview під редактором, одна кнопка Run.

## Gameplay prompt

Use case: ui-mockup. Create ONE polished landscape 16:9 raster screenshot prototype of SQL Post gameplay, based on the attached reference's cozy detailed pixel art postal warehouse, warm brown wooden shelves, burgundy accents, friendly small white-gray robot with blue eyes, mild sci-fi and gentle humor. Reference is STYLE inspiration, redesign layout completely. Ukrainian interface with English SQL.

Critical composition: full screen game UI, no device frame, no split screen. Thin top status bar contains ONLY progress "Обслужено 4/12" with a progress bar and a gold coin icon "120". Absolutely no level number, stars, profile/avatar, map, title, or other widgets in this top bar. Left 58% below bar: beautifully detailed warehouse shelves labeled A1 A2 B1, parcels, customer at wooden counter and robot holding a brown box, two waiting customers. Right 42%: a spacious dark slate terminal panel stacked vertically, all text large readable. Top of panel has customer portrait and speech "Моя посилка №1042." plus small "Спроби: 3/3". Below a compact schema label "parcels" and fields "id · first_name · last_name · color · shelf". Then code editor titled "SQL" with exact code on two lines: "SELECT * FROM parcels" and "WHERE id = 1042;". Under editor a clearly separate table titled "Попередній перегляд · 1 рядок", headers id, first_name, last_name, color, shelf; exactly one row 1042, Олена, Коваль, синя, A2. Table is AUTOMATIC preview, not a second button. Below the table ONE prominent burgundy button labeled exactly "Run" and small caption "Робот привезе вибрані посилки". No other action/submit/deliver button anywhere. No correctness checkmark on preview. No UPDATE. No stars anywhere on gameplay screen. Use coherent pixel art frames, precise readable modern monospace text on dark panels, crisp edges, warm inviting atmosphere. Fit all elements with generous margins; editor and preview must occupy meaningful space, not tiny text. This is actual in-game UI concept, not a poster.

## Level selection prompt

Use case: ui-mockup. Create ONE polished landscape 16:9 raster screenshot prototype of the LEVEL SELECTION SCREEN of SQL Post. Match the attached reference's cozy pixel-art postal warehouse aesthetic, warm brown wood, burgundy cloth, brass details, friendly white-gray blue-eyed robot. This is a separate menu screen, NOT gameplay; no SQL editor. Full screen no device frame. Use a wooden postal sorting board as a clean level selector rather than a geographic map. Header title "Робочі зміни". Upper left profile panel small postal-worker avatar, "Профіль" and name "Оператор". Upper right gold coin icon and "120". Below, ten evenly sized rectangular level cards arranged in TWO rows of FIVE, visually organized with strong readable spacing. Each looks like a postal route ticket with level number and concise SQL topic. Exact card labels: "01 SELECT", "02 WHERE", "03 AND / OR", "04 LIKE", "05 ORDER BY", "06 LIMIT", "07 COUNT", "08 GROUP BY", "09 HAVING", "10 JOIN". Cards 01 and 02 completed, each has exactly THREE filled gold stars. Card 03 selected, has exactly TWO filled gold stars plus ONE dim empty outlined star; highlight selected card with burgundy/brass border. Cards 04 through 10 visibly locked with padlock icon and subdued colors, not completed and no gold stars. This preserves rule next level opens after 3 stars. Above board show "Пройдено 2/10". Below board a selected-level detail panel: "Зміна 03 · Точне замовлення", smaller "AND, OR та дужки", then "13 клієнтів". One main burgundy button "Грати". A small note "Для наступної зміни потрібно 3 зірки". Optional small bottom navigation labels "Досягнення" and "Налаштування" with tasteful pixel icons. Background peripheral shelf and a small resting robot, keep center clean and functional. No giant decorative text, no dialogue, no gameplay terminal, no reward golden parcel in player inventory. Pixel art world and frames, sharp easily readable Ukrainian UI typography. Attractive coherent game production reference.


## Чистий фон меню — 2026-09-17

Built-in imagegen, edit reference: ../Mockups/Level-selection/levels-v2.png. Result: ../Assets/Environment/level-menu-background.png. Інтерактивні елементи відтворює src/menu.ts.

Exact prompt:

> Use case: precise-object-edit. Edit target: provided SQL Post level-selection mockup. Create the clean background plate for this exact game menu, wide 16:9. Keep the warm detailed pixel-art post office, peripheral parcel shelves, warm hanging lamps, left plant, lower left books, bottom rug and desk, and friendly small white blue-eyed postal robot on right. Remove ALL text, letters, numbers, signage lettering and ALL user interface: profile panel and avatar top left, burgundy title banner top center, progress plaque, coin HUD top right, central large board AND all ten level cards, bottom description/play panel, achievement/settings buttons. In their place reconstruct natural background: softly shaded wooden shelving/wall in the central broad area and unobstructed wooden desktop below. No empty UI frames, no cards, no buttons, no text, no logos, no stars, no icons. Keep peripheral composition and rich amber/burgundy/brown pixel-art style faithful to the reference. Central area should be quiet/dark enough to overlay a code-built board spanning x16%-84%, y23%-70%. Output final background image only.

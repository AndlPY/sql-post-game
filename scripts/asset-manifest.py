"""Read-only asset analysis. Produce frame rectangles; do not modify source PNGs."""
from pathlib import Path
import json
from PIL import Image

root = Path(__file__).resolve().parents[1]
layouts = {
    'Characters/postal-clerk-female-sheet.png': (5, 1),
    'Characters/postal-clerk-male-sheet.png': (5, 1),
    'Characters/postal-mentor-sheet.png': (5, 1),
    'Characters/customer-tan-hat-sheet.png': (5, 4),
    'Characters/customer-redhead-sheet.png': (5, 4),
    'Characters/customer-red-beret-sheet.png': (5, 4),
    'Characters/postal-robot-empty-8-directions.png': (4, 2),
    'Characters/postal-robot-loaded-8-directions.png': (4, 2),
    'Characters/postal-robot-pickup-west-sheet.png': (4, 1),
    'Environment/post-office-service-counter.png': (1, 1),
    'Props/post-office-clerk-workstation.png': (1, 1),
    'Props/post-office-instructor-workstation.png': (1, 1),
}
manifest = {}
for name, (cols, rows) in layouts.items():
    im = Image.open(root / 'Img/Assets' / name)
    frames = []
    for row in range(rows):
        for col in range(cols):
            box = (round(col*im.width/cols), round(row*im.height/rows), round((col+1)*im.width/cols), round((row+1)*im.height/rows))
            alpha = im.crop(box).getchannel('A').point(lambda x: 255 if x > 24 else 0)
            bounds = alpha.getbbox()
            if bounds is None: raise ValueError(f'Empty frame: {name} {row} {col}')
            left, top, right, bottom = bounds
            frames.append([box[0]+left, box[1]+top, right-left, bottom-top])
    manifest[name] = frames
(root / 'src/game/frames.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(f'Wrote rectangles for {sum(map(len, manifest.values()))} frames. Playback QA still required.')

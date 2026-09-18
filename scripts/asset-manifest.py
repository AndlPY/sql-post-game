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
    'Characters/customer-brown-haired-man-sheet.png': (5, 4),
    'Characters/customer-glasses-bob-sheet.png': (5, 4),
    'Characters/postal-robot-empty-8-directions.png': (4, 2),
    'Characters/postal-robot-loaded-8-directions.png': (4, 2),
    'Characters/postal-robot-pickup-west-sheet.png': (4, 1),
    'Environment/post-office-service-counter.png': (1, 1),
    'Props/post-office-clerk-workstation.png': (1, 1),
    'Props/post-office-instructor-workstation.png': (1, 1),
}
def occupied_runs(mask, axis):
    """Find occupied bands separated by transparent gutters, not equal cells."""
    size = mask.height if axis == 'y' else mask.width
    runs = []
    start = None
    for position in range(size + 1):
        box = ((0, position, mask.width, position + 1) if axis == 'y'
               else (position, 0, position + 1, mask.height))
        occupied = position < size and mask.crop(box).getbbox() is not None
        if occupied and start is None:
            start = position
        elif not occupied and start is not None:
            runs.append((start, position))
            start = None
    return runs


def customer_frames(im, cols, rows, name):
    mask = im.getchannel('A').point(lambda x: 255 if x > 24 else 0)
    bands = occupied_runs(mask, 'y')
    if len(bands) != rows:
        raise ValueError(f'{name}: expected {rows} separate rows, got {len(bands)}; author explicit bounds')
    result = []
    for top, bottom in bands:
        row_mask = mask.crop((0, top, im.width, bottom))
        columns = occupied_runs(row_mask, 'x')
        if len(columns) != cols:
            raise ValueError(f'{name}: expected {cols} separate sprites, got {len(columns)}; author explicit bounds')
        for left, right in columns:
            x0, y0, x1, y1 = row_mask.crop((left, 0, right, bottom - top)).getbbox()
            result.append([left + x0, top + y0, x1 - x0, y1 - y0])
    return result


manifest = {}
for name, (cols, rows) in layouts.items():
    im = Image.open(root / 'Img/Assets' / name)
    if name.startswith('Characters/customer-'):
        manifest[name] = customer_frames(im, cols, rows, name)
        continue
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

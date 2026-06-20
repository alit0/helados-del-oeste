from PIL import Image
import glob, os

def conv(path, max_w, out, quality, alpha):
    im = Image.open(path)
    if im.width > max_w:
        h = round(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    im = im.convert('RGBA' if alpha else 'RGB')
    im.save(out, 'WEBP', quality=quality, method=6)
    return os.path.getsize(out)

total_before = total_after = 0
# Promo/newsletter banners: photos
for f in glob.glob('public/promos/*.png'):
    before = os.path.getsize(f); out = f[:-4] + '.webp'
    after = conv(f, 1600, out, 80, False)
    total_before += before; total_after += after
    print(f"{os.path.basename(f)}: {before//1024}K -> {after//1024}K")
# Quick-filter icons: transparent
for f in glob.glob('public/icons/*.png'):
    before = os.path.getsize(f); out = f[:-4] + '.webp'
    after = conv(f, 160, out, 90, True)
    total_before += before; total_after += after
    print(f"{os.path.basename(f)}: {before//1024}K -> {after//1024}K")
# Hero + logo: transparent
for f, w in [('public/hero.png', 500), ('public/logo.png', 240)]:
    before = os.path.getsize(f); out = f[:-4] + '.webp'
    after = conv(f, w, out, 90, True)
    total_before += before; total_after += after
    print(f"{os.path.basename(f)}: {before//1024}K -> {after//1024}K")
print(f"TOTAL: {total_before//1024//1024}MB -> {total_after//1024}K")

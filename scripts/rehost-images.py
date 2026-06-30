#!/usr/bin/env python3
"""Rehost product images off La Montevideana onto our own server.

Reads src/data/catalog.json, downloads every product image still hotlinked from
montevideanahelados.com.ar, converts it to a transparent .webp under
public/productos/, and relinks the snapshot to the local path.

Run it whenever new products with montevideana image links are added to the
master Sheet:

    python scripts/rehost-images.py

The Apps Script (apps-script/Code.gs -> localImage) rewrites the same montevideana
URLs to /productos/<name>.webp at build time, so the live catalog and this local
snapshot stay in sync.
"""

import json
import os
import re
import ssl
import urllib.request
from io import BytesIO

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join(ROOT, "src", "data", "catalog.json")
OUT_DIR = os.path.join(ROOT, "public", "productos")
HOST = "montevideanahelados.com.ar"
MAX_WIDTH = 600

_ctx = ssl.create_default_context()
_ctx.check_hostname = False
_ctx.verify_mode = ssl.CERT_NONE


def local_path(url: str) -> str | None:
    m = re.search(r"/([^/?#]+)\.(?:png|jpe?g|webp)(?:[?#].*)?$", url, re.IGNORECASE)
    return f"/productos/{m.group(1)}.webp" if m else None


def download_webp(url: str, dest: str) -> int:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    data = urllib.request.urlopen(req, timeout=30, context=_ctx).read()
    im = Image.open(BytesIO(data)).convert("RGBA")
    if im.width > MAX_WIDTH:
        h = round(im.height * MAX_WIDTH / im.width)
        im = im.resize((MAX_WIDTH, h), Image.LANCZOS)
    im.save(dest, "WEBP", quality=85, method=6)
    return os.path.getsize(dest)


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(CATALOG, encoding="utf-8") as fh:
        catalog = json.load(fh)

    external = sorted(
        {
            p["imageUrl"]
            for p in catalog["products"]
            if p.get("imageUrl") and HOST in p["imageUrl"]
        }
    )
    if not external:
        print("No external images to rehost. Everything is already local.")
        return

    mapping: dict[str, str] = {}
    for url in external:
        local = local_path(url)
        if not local:
            print(f"SKIP (no filename) {url}")
            continue
        dest = os.path.join(OUT_DIR, os.path.basename(local))
        try:
            size = download_webp(url, dest)
            mapping[url] = local
            print(f"OK  {os.path.basename(local)} ({size // 1024}K)")
        except Exception as exc:  # noqa: BLE001 - report and continue
            print(f"ERR {url}: {exc}")

    relinked = 0
    for product in catalog["products"]:
        if product.get("imageUrl") in mapping:
            product["imageUrl"] = mapping[product["imageUrl"]]
            relinked += 1

    with open(CATALOG, "w", encoding="utf-8") as fh:
        json.dump(catalog, fh, ensure_ascii=False, indent=2)
        fh.write("\n")

    print(f"\nRehosted {len(mapping)}/{len(external)} images, relinked {relinked} products.")


if __name__ == "__main__":
    main()

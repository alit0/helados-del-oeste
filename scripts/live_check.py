from playwright.sync_api import sync_playwright
errs=[]; reqs=[]
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    pg=b.new_page(viewport={"width":1280,"height":900})
    pg.on("console", lambda m: errs.append(f"[{m.type}] {m.text}") if m.type=="error" else None)
    pg.on("pageerror", lambda e: errs.append(f"PAGEERROR {e}"))
    pg.on("response", lambda r: reqs.append((r.status, r.url)) if "script.google" in r.url else None)
    pg.goto("http://localhost:4200")
    pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
    has_product = pg.get_by_text("Summun Frutilla").count() > 0
    badges = pg.get_by_text("MÁS VENDIDO").count()
    print("apps-script requests:", reqs)
    print("product rendered:", has_product)
    print("badge ribbons visible:", badges, "(0 = live data, sin columna L)")
    print("console errors:", errs if errs else "none")
    b.close()

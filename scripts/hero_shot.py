from playwright.sync_api import sync_playwright
OUT = "C:/Users/Ale/Proyectos/Helados-del-oeste/docs/render"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    for w,name in [(1280,"desktop"),(390,"mobile")]:
        pg = b.new_page(viewport={"width": w, "height": 900})
        pg.goto("http://localhost:5173"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(400)
        el = pg.query_selector("section")  # first section = hero
        el.screenshot(path=f"{OUT}/hero_{name}.png")
        pg.close()
    b.close(); print("done")

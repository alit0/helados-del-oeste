from playwright.sync_api import sync_playwright
OUT = "C:/Users/Ale/Proyectos/Helados-del-oeste/docs/render"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    for w,name in [(1280,"desktop"),(390,"mobile")]:
        pg = b.new_page(viewport={"width": w, "height": 900})
        pg.goto("http://localhost:5173"); pg.wait_for_load_state("networkidle")
        el = pg.query_selector("section:has(form), section:has-text('Sumate a las promos')")
        if el:
            el.scroll_into_view_if_needed(); pg.wait_for_timeout(300)
            el.screenshot(path=f"{OUT}/news_{name}.png")
        pg.close()
    b.close(); print("done")

from playwright.sync_api import sync_playwright
OUT = "C:/Users/Ale/Proyectos/Helados-del-oeste/docs/render"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    for w,h,name in [(1280,900,"desktop"),(390,780,"mobile")]:
        pg = b.new_page(viewport={"width": w, "height": h})
        pg.goto("http://localhost:5173"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(500)
        pg.screenshot(path=f"{OUT}/top2_{name}.png")
        pg.close()
    b.close(); print("done")

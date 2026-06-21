from playwright.sync_api import sync_playwright
OUT="C:/Users/Ale/Proyectos/Helados-del-oeste/docs/render"
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    pg=b.new_page(viewport={"width":1280,"height":900})
    pg.goto("http://localhost:5173"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(400)
    pg.get_by_role("button", name="Categorías").click()
    pg.wait_for_timeout(300)
    pg.screenshot(path=f"{OUT}/dropdown.png")
    # click a category and verify scroll
    before=pg.evaluate("window.scrollY")
    pg.get_by_role("button", name="Postres y Tortas").click()
    pg.wait_for_timeout(900)
    after=pg.evaluate("window.scrollY")
    print("scrollY", before, "->", after)
    b.close()

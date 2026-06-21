from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    pg=b.new_page(viewport={"width":1280,"height":900})
    pg.goto("http://localhost:5173"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(400)
    def cards(): return pg.locator("h3").count()
    base=cards()
    pg.get_by_role("button", name="Más vendido").click(); pg.wait_for_timeout(500)
    mv=cards()
    pg.get_by_role("button", name="Nuevo").first.click(); pg.wait_for_timeout(300)  # toggles off masvendido? no, sets nuevo
    # actually click Más vendido again to clear, then Nuevo
    print("base cards:", base, "| after Más vendido:", mv)
    b.close()

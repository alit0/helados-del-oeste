from playwright.sync_api import sync_playwright
OUT="C:/Users/Ale/Proyectos/Helados-del-oeste/docs/render"
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    pg=b.new_page(viewport={"width":1280,"height":900})
    pg.goto("http://localhost:5173"); pg.wait_for_load_state("networkidle")
    pg.get_by_role("heading", name="Sabores por Peso").scroll_into_view_if_needed()
    pg.wait_for_timeout(600)
    pg.screenshot(path=f"{OUT}/peso.png")
    b.close(); print("done")

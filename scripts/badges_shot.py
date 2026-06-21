from playwright.sync_api import sync_playwright
OUT="C:/Users/Ale/Proyectos/Helados-del-oeste/docs/render"
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    pg=b.new_page(viewport={"width":1280,"height":2400})
    pg.goto("http://localhost:5173"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(600)
    # scroll to Bombones (has Bombón Croc! Nuevo) / postres
    pg.get_by_role("heading", name="Postres y Tortas").scroll_into_view_if_needed()
    pg.wait_for_timeout(500)
    pg.screenshot(path=f"{OUT}/badges.png")
    b.close(); print("done")

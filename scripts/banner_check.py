from playwright.sync_api import sync_playwright

OUT = "C:/Users/Ale/Proyectos/Helados-del-oeste/docs/render"

def shoot(p, w, name):
    page = p.new_page(viewport={"width": w, "height": 900})
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(700)
    # force the carousel to the first slide
    page.evaluate("const t=document.querySelector('#ofertas .overflow-x-auto'); if(t) t.scrollLeft=0;")
    page.wait_for_timeout(300)
    el = page.query_selector("#ofertas")
    if el:
        el.screenshot(path=f"{OUT}/banner_{name}.png")
    page.close()

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    shoot(b, 1280, "desktop")
    shoot(b, 390, "mobile")
    b.close()
    print("done")

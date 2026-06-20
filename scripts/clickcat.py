from playwright.sync_api import sync_playwright

OUT = "C:/Users/Ale/Proyectos/Helados-del-oeste/docs/render"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(400)

    # how many category section headings before click
    before = page.get_by_role("heading").count()
    page.get_by_role("button", name="Postres y Tortas").click()
    page.wait_for_timeout(400)
    after_headings = [h.inner_text() for h in page.get_by_role("heading").all()]

    page.screenshot(path=f"{OUT}/click_postres.png")
    print("headings before:", before)
    print("headings after click:", after_headings)
    browser.close()

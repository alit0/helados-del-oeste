from playwright.sync_api import sync_playwright

OUT = "C:/Users/Ale/Proyectos/Helados-del-oeste/docs/render"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(500)

    # Sabores por Peso section
    peso = page.get_by_role("heading", name="Sabores por Peso")
    peso.scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    page.screenshot(path=f"{OUT}/sec_peso.png")

    # Footer
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(300)
    page.screenshot(path=f"{OUT}/sec_footer.png")

    browser.close()
    print("done")

from playwright.sync_api import sync_playwright

OUT = "C:/Users/Ale/Proyectos/Helados-del-oeste/docs/render"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # Mobile view
    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    mobile.goto("http://localhost:4173")
    mobile.wait_for_load_state("networkidle")
    mobile.wait_for_timeout(500)
    mobile.screenshot(path=f"{OUT}/mobile.png", full_page=True)

    # Desktop view
    desktop = browser.new_page(viewport={"width": 1280, "height": 900})
    desktop.goto("http://localhost:4173")
    desktop.wait_for_load_state("networkidle")
    desktop.wait_for_timeout(500)
    desktop.screenshot(path=f"{OUT}/desktop.png")

    # Desktop with order drawer open
    desktop.get_by_role("button", name="Agregar Summun Frutilla al pedido").first.click()
    desktop.wait_for_timeout(400)
    desktop.screenshot(path=f"{OUT}/drawer.png")

    browser.close()
    print("screenshots saved")

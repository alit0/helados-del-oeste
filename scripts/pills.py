from playwright.sync_api import sync_playwright

OUT = "C:/Users/Ale/Proyectos/Helados-del-oeste/docs/render"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=2)
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(500)

    # Tight crop of the first few category pills
    pill = page.get_by_role("button", name="Palitos de Agua")
    pill.scroll_into_view_if_needed()
    page.wait_for_timeout(200)
    box = pill.bounding_box()
    page.screenshot(
        path=f"{OUT}/pills_zoom.png",
        clip={"x": box["x"] - 10, "y": box["y"] - 10, "width": 520, "height": box["height"] + 20},
    )
    print("pill box:", box)
    print("done")

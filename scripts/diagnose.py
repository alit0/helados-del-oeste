from playwright.sync_api import sync_playwright

OUT = "C:/Users/Ale/Proyectos/Helados-del-oeste/docs/render"
errors = []
console = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.on("console", lambda m: console.append(f"[{m.type}] {m.text}"))
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(800)

    # viewport-sized screenshot (top of page, readable)
    page.screenshot(path=f"{OUT}/diag_top.png")

    print("=== PAGE ERRORS ===")
    for e in errors:
        print(e)
    print("=== CONSOLE ===")
    for c in console:
        print(c)
    print("=== END ===")
    browser.close()

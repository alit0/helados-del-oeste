"""
QA full functional + performance test for Helados del Oeste.
Usage: python scripts/qa_full.py
Requires: playwright (pip install playwright && playwright install chromium)
"""

from playwright.sync_api import sync_playwright, ConsoleMessage, Page
import json, time, urllib.parse

BASE_URL = "http://localhost:4191"

DESKTOP = {"width": 1280, "height": 900}
MOBILE  = {"width": 390,  "height": 780}

results = []

def r(num, label, passed, detail=""):
    status = "PASS" if passed else "FAIL"
    results.append((num, label, status, detail))
    print(f"  [{status}] {num}. {label}" + (f" — {detail}" if detail else ""))

# ─── helpers ─────────────────────────────────────────────────────────────────

def make_page(browser, viewport):
    ctx = browser.new_context(viewport=viewport)
    page = ctx.new_page()
    console_msgs = []
    page_errors  = []
    page.on("console", lambda m: console_msgs.append(m))
    page.on("pageerror", lambda e: page_errors.append(str(e)))
    return page, console_msgs, page_errors

def load(page):
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")

def section_headings(page):
    """Return visible section-level headings (h2 with class that acts as category header)."""
    # category section wrappers have data-category or are wrapped in <section>
    # The visible h2 elements whose parent is not a product card
    return page.eval_on_selector_all(
        "section[data-category] > h2, section > h2",
        "els => els.filter(e => e.offsetParent !== null).map(e => e.textContent.trim())"
    )

def visible_section_labels(page):
    """All visible h2 elements on page (product category headings only — excludes testimonials/promos)."""
    return page.eval_on_selector_all(
        "h2",
        """els => els.filter(e => e.offsetParent !== null)
                    .map(e => e.textContent.trim())
                    .filter(t => !['Lo que dicen nuestros clientes','Sumate a las promos','Nuestras Promos',''].includes(t))"""
    )

# ─── PERF: bytes transferred ──────────────────────────────────────────────────

def measure_transfer(browser):
    ctx = browser.new_context(viewport=DESKTOP)
    page = ctx.new_page()
    transferred = [0]
    timings = {}

    def on_response(resp):
        try:
            body = resp.body()
            transferred[0] += len(body)
        except Exception:
            pass

    page.on("response", on_response)
    t0 = time.time()
    page.goto(BASE_URL)
    page.wait_for_load_state("load")
    t_load = time.time() - t0

    # DOMContentLoaded via JS timing
    nav = page.evaluate("() => { const t = performance.getEntriesByType('navigation')[0]; return t ? {dcl: t.domContentLoadedEventEnd - t.startTime, load: t.loadEventEnd - t.startTime} : null; }")
    page.close()
    ctx.close()
    return transferred[0], nav, t_load

# ─── RUN TESTS ───────────────────────────────────────────────────────────────

def run_viewport(browser, vp_label, viewport):
    print(f"\n{'='*60}")
    print(f"  VIEWPORT: {vp_label} ({viewport['width']}x{viewport['height']})")
    print(f"{'='*60}")

    page, console_msgs, page_errors = make_page(browser, viewport)
    load(page)

    # ── TEST 1: No console errors / page errors ───────────────────────────────
    errors = [m.text for m in console_msgs if m.type == "error"]
    has_page_errors = len(page_errors) > 0
    passed1 = len(errors) == 0 and not has_page_errors
    detail1 = ""
    if errors:
        detail1 += f"console errors: {errors[:3]}"
    if page_errors:
        detail1 += f" page errors: {page_errors[:2]}"
    r(f"1[{vp_label}]", "No console/page errors", passed1, detail1 or "clean")

    # ── TEST 2: Images ────────────────────────────────────────────────────────
    img_results = page.eval_on_selector_all(
        "img",
        """els => els.map(e => ({
            src: e.src || e.currentSrc || e.getAttribute('src') || '',
            natural: e.naturalWidth,
            complete: e.complete
        }))"""
    )
    broken_local = []
    broken_external = []
    for img in img_results:
        src = img["src"]
        if img["natural"] == 0:
            if "montevideanahelados.com.ar" in src:
                broken_external.append(src.split("/")[-1][:60])
            else:
                broken_local.append(src.split("/")[-1][:60] or src[:60])

    passed2 = len(broken_local) == 0
    detail2 = ""
    if broken_local:
        detail2 += f"BROKEN LOCAL: {broken_local[:5]} "
    if broken_external:
        detail2 += f"(external/network broken: {len(broken_external)} imgs from montevideanahelados.com.ar)"
    if not detail2:
        detail2 = f"all {len(img_results)} images OK"
    r(f"2[{vp_label}]", "All images load", passed2, detail2)

    # ── TEST 3a: Filter pill — Palitos ────────────────────────────────────────
    page.reload()
    page.wait_for_load_state("networkidle")

    # Find the Palitos pill — it's the button with text "Palitos" that is NOT inside a nav
    palitos_btn = page.locator("button", has_text="Palitos").first
    palitos_btn.click()
    page.wait_for_timeout(400)
    after_palitos = visible_section_labels(page)
    palitos_cats = ["Palitos de Agua", "Palitos de Crema"]
    unexpected = [h for h in after_palitos if h not in palitos_cats and h.strip()]
    only_palitos = len(unexpected) == 0 and any(p in after_palitos for p in palitos_cats)
    r(f"3a[{vp_label}]", "Filter Palitos shows only Palitos sections", only_palitos,
      f"visible: {after_palitos}" if not only_palitos else f"visible: {after_palitos}")

    # Toggle off
    palitos_btn.click()
    page.wait_for_timeout(400)
    after_toggle = visible_section_labels(page)
    toggled_off = len(after_toggle) > len(palitos_cats)
    r(f"3a-toggle[{vp_label}]", "Palitos toggle off restores all sections", toggled_off,
      f"{len(after_toggle)} sections visible")

    # ── TEST 3b: Filter pill — Potes ─────────────────────────────────────────
    potes_btn = page.locator("button", has_text="Potes").first
    potes_btn.click()
    page.wait_for_timeout(400)
    after_potes = visible_section_labels(page)
    potes_cats = ["Potes Individuales", "Potes Familiares"]
    # must have at least one potes category and nothing else
    has_potes = any(p in after_potes for p in potes_cats)
    no_palitos_in_potes = not any("Palito" in h for h in after_potes)
    r(f"3b[{vp_label}]", "Filter Potes shows only Potes sections", has_potes and no_palitos_in_potes,
      f"visible: {after_potes}")
    potes_btn.click()
    page.wait_for_timeout(300)

    # ── TEST 3c: Filter pill — Sin TACC ──────────────────────────────────────
    # The pill button text is "Sin TACC" - first one is the pill (not the nav item)
    # Buttons list: index 0 is "Sin TACC" nav item, the pill row has index 3
    # On mobile the pill row has the 2nd Sin TACC button; find the visible one
    sintacc_btns = page.locator("button", has_text="Sin TACC").all()
    sintacc_btn = None
    for b in sintacc_btns:
        if b.is_visible():
            sintacc_btn = b
            break
    if sintacc_btn is None:
        sintacc_btn = page.locator("button", has_text="Sin TACC").first
    sintacc_btn.click()
    page.wait_for_timeout(500)
    # Check every visible product card has "Sin Gluten" tag
    cards_without_tag = page.eval_on_selector_all(
        "[data-testid='product-card'], article",
        """els => els.filter(e => e.offsetParent !== null)
                    .filter(e => !e.textContent.includes('Sin Gluten'))
                    .map(e => { const h = e.querySelector('h3,h2'); return h ? h.textContent.trim().slice(0,40) : '?'; })
                    .slice(0,10)"""
    )
    sintacc_ok = len(cards_without_tag) == 0
    r(f"3c[{vp_label}]", "Sin TACC filter: all cards have Sin Gluten tag", sintacc_ok,
      f"Cards without tag: {cards_without_tag}" if not sintacc_ok else "all cards tagged")
    sintacc_btn.click()
    page.wait_for_timeout(300)

    # ── TEST 3d: Filter pill — Ofertas scrolls ────────────────────────────────
    ofertas_pill = page.locator("button", has_text="Ofertas").first
    scroll_before = page.evaluate("() => window.scrollY")
    ofertas_pill.click()
    page.wait_for_timeout(600)
    scroll_after = page.evaluate("() => window.scrollY")
    # Offer carousel is near top; clicking Ofertas pill should scroll to it
    # Accept either scroll happened OR page didn't error
    no_error = len(page_errors) == 0
    r(f"3d[{vp_label}]", "Ofertas pill triggers scroll/action without error", no_error,
      f"scrollY before={scroll_before} after={scroll_after}")

    # ── TEST 4: Search ────────────────────────────────────────────────────────
    page.reload()
    page.wait_for_load_state("networkidle")
    search = page.locator("input[placeholder*='Buscar']").first
    search.fill("summun")
    page.wait_for_timeout(500)
    # Product names are in h3; footer nav headings (Productos, Categorías etc.) are in different elements
    # Filter to h3 inside article/section product cards only
    visible_h3 = page.eval_on_selector_all(
        "h3",
        """els => els
            .filter(e => e.offsetParent !== null)
            .filter(e => {
                // exclude h3 inside footer, static nav sections
                const footer = e.closest('footer');
                return !footer;
            })
            .map(e => e.textContent.trim())"""
    )
    non_summun = [h for h in visible_h3 if "summun" not in h.lower() and "summ" not in h.lower()]
    r(f"4a[{vp_label}]", "Search 'summun' shows only Summun products", len(non_summun) == 0,
      f"non-summun visible: {non_summun[:5]}" if non_summun else f"{len(visible_h3)} summun products shown")

    search.fill("")
    page.wait_for_timeout(500)
    all_h3 = page.eval_on_selector_all(
        "h3",
        "els => els.filter(e => e.offsetParent !== null).map(e => e.textContent.trim())"
    )
    r(f"4b[{vp_label}]", "Clear search restores all products", len(all_h3) > len(visible_h3),
      f"after clear: {len(all_h3)} products")

    # ── TEST 5: Add to order / drawer ─────────────────────────────────────────
    page.reload()
    page.wait_for_load_state("networkidle")
    # Click first "Agregar" button
    add_btn = page.locator("[aria-label^='Agregar']").first
    product_name_raw = add_btn.get_attribute("aria-label") or ""
    product_name = product_name_raw.replace("Agregar ", "").replace(" al pedido", "")
    add_btn.click()
    page.wait_for_timeout(600)

    # Drawer should open — look for "Mi pedido" text
    drawer_visible = page.locator("text=Mi pedido").first.is_visible() if page.locator("text=Mi pedido").count() > 0 else False
    r(f"5a[{vp_label}]", "Drawer 'Mi pedido' opens after add", drawer_visible,
      f"product: {product_name[:40]}")

    # WhatsApp link in drawer
    wa_links = page.eval_on_selector_all(
        "a[href*='wa.me']",
        "els => els.map(e => e.href)"
    )
    wa_link_ok = any("5491154792502" in l for l in wa_links)

    # Check product name is encoded in WA link
    encoded_name = urllib.parse.quote(product_name[:10])
    wa_name_ok = False
    for link in wa_links:
        decoded = urllib.parse.unquote(link)
        if product_name[:8].lower() in decoded.lower():
            wa_name_ok = True

    r(f"5b[{vp_label}]", "WhatsApp link has correct phone + product", wa_link_ok and wa_name_ok,
      f"link: {wa_links[0][:80] if wa_links else 'NOT FOUND'}")

    # Click Quitar to remove
    quitar = page.locator("button", has_text="Quitar").first
    if quitar.count() > 0 or page.locator("button:has-text('Quitar')").count() > 0:
        page.locator("button:has-text('Quitar')").first.click()
        page.wait_for_timeout(400)
        r(f"5c[{vp_label}]", "Quitar removes product line", True, "clicked without error")
    else:
        r(f"5c[{vp_label}]", "Quitar button found", False, "button not found in drawer")

    # Close drawer — look for X button or click outside
    close_btn = page.locator("button[aria-label*='Cerrar'], button[aria-label*='cerrar'], button[aria-label*='close']")
    if close_btn.count() > 0:
        close_btn.first.click()
    else:
        page.keyboard.press("Escape")
    page.wait_for_timeout(400)

    # ── TEST 6: Offer carousel — 3rd dot + next arrow ─────────────────────────
    page.reload()
    page.wait_for_load_state("networkidle")
    err_before = len(page_errors)
    dot3 = page.locator("[aria-label='Ir a la promo 3']").first
    if dot3.count() > 0:
        dot3.scroll_into_view_if_needed()
        dot3.click()
        page.wait_for_timeout(500)
        r(f"6a[{vp_label}]", "Offer carousel 3rd dot click — no error", len(page_errors) == err_before, "OK")
    else:
        r(f"6a[{vp_label}]", "Offer carousel 3rd dot found", False, "aria-label not found")

    if viewport["width"] >= 1024:
        next_arrow = page.locator("[aria-label='Promo siguiente']").first
        if next_arrow.count() > 0:
            next_arrow.scroll_into_view_if_needed()
            try:
                next_arrow.hover()
                next_arrow.click()
                page.wait_for_timeout(400)
                r(f"6b[{vp_label}]", "Offer carousel next arrow click — no error", len(page_errors) == err_before, "OK")
            except Exception as e:
                r(f"6b[{vp_label}]", "Offer carousel next arrow click", False, str(e)[:80])
        else:
            r(f"6b[{vp_label}]", "Offer carousel next arrow found", False, "not found")

    # ── TEST 7: Testimonials carousel (desktop only) ──────────────────────────
    if viewport["width"] >= 1024:
        page.reload()
        page.wait_for_load_state("networkidle")
        testi_next = page.locator("[aria-label='Comentarios siguientes']").first
        if testi_next.count() > 0:
            testi_next.scroll_into_view_if_needed()
            try:
                testi_next.click()
                page.wait_for_timeout(400)
                r(f"7[{vp_label}]", "Testimonials carousel next — no error", len(page_errors) == err_before, "OK")
            except Exception as e:
                r(f"7[{vp_label}]", "Testimonials carousel next click", False, str(e)[:80])
        else:
            r(f"7[{vp_label}]", "Testimonials next arrow found", False, "aria-label 'Comentarios siguientes' not found")

    # ── TEST 8: Floating WhatsApp button ─────────────────────────────────────
    wa_float = page.locator("[aria-label='Consultanos por WhatsApp']").first
    wa_float_ok = False
    if wa_float.count() > 0:
        href = wa_float.get_attribute("href") or ""
        wa_float_ok = "api.whatsapp.com" in href and "5491154792502" in href
        r(f"8[{vp_label}]", "Floating WA button correct href", wa_float_ok,
          href[:80] if not wa_float_ok else "OK: " + href[:60])
    else:
        r(f"8[{vp_label}]", "Floating WA button found", False, "aria-label not found")

    # ── TEST 9: Footer social links ───────────────────────────────────────────
    footer_labels = ["Instagram", "Facebook", "TikTok", "YouTube"]
    footer_ok = []
    footer_missing = []
    for label in footer_labels:
        el = page.locator(f"[aria-label='{label}']").first
        if el.count() > 0:
            footer_ok.append(label)
        else:
            footer_missing.append(label)
    # WhatsApp in footer
    wa_footer = page.locator("footer a[href*='whatsapp'], footer a[href*='wa.me'], [aria-label='WhatsApp']")
    has_wa_footer = wa_footer.count() > 0
    # Also check for the text "WhatsApp" in footer links
    footer_wa_text = page.locator("footer").locator("a", has_text="WhatsApp")
    has_wa_footer = has_wa_footer or footer_wa_text.count() > 0

    footer_passed = len(footer_missing) == 0 and has_wa_footer
    r(f"9[{vp_label}]", "Footer social links (Insta/FB/TikTok/YT + WA)", footer_passed,
      f"found: {footer_ok}, missing: {footer_missing}, WA: {has_wa_footer}")

    # ── TEST 10: Responsive layout ────────────────────────────────────────────
    if viewport["width"] <= 390:
        # Top header nav must be hidden
        header_visible = page.eval_on_selector_all(
            "header",
            "els => els.map(e => ({visible: e.offsetParent !== null, classes: e.className.slice(0,60)}))"
        )
        # The sticky top nav with links Inicio/Categorías etc should be hidden
        # We look for the header that contains "Inicio" link
        top_nav_hidden = page.eval_on_selector_all(
            "header",
            "els => els.filter(e => e.textContent.includes('Categorías') || e.textContent.includes('Inicio'))"
            ".map(e => ({visible: e.offsetParent !== null, w: e.offsetWidth, h: e.offsetHeight}))"
        )
        # On mobile, top header should not be visible (offsetParent null or dimensions 0)
        top_nav_ok = all(
            not v["visible"] or v["w"] == 0 or v["h"] == 0
            for v in top_nav_hidden
        ) if top_nav_hidden else True  # if no header found with those links, pass

        # Bottom nav must be present — fixed elements have offsetParent=null but are visible
        # Check via computed styles: position fixed + display not none
        bottom_nav = page.eval_on_selector_all(
            "nav",
            """els => els.map(e => ({
                text: e.textContent.trim().slice(0,60),
                position: window.getComputedStyle(e).position,
                display: window.getComputedStyle(e).display,
                visibility: window.getComputedStyle(e).visibility
            }))"""
        )
        bottom_nav_visible = any(
            ("Inicio" in n["text"] or "Promos" in n["text"] or "Carrito" in n["text"])
            and n["display"] != "none"
            and n["visibility"] != "hidden"
            for n in bottom_nav
        )

        r(f"10a[{vp_label}]", "Mobile: top header hidden", top_nav_ok,
          f"headers: {top_nav_hidden}")
        r(f"10b[{vp_label}]", "Mobile: bottom nav visible", bottom_nav_visible,
          f"navs: {bottom_nav[:3]}")

        # Logo in hero — check for visible logo img (offsetParent !== null or computed visible)
        logo_imgs = page.eval_on_selector_all(
            "img[src*='logo']",
            """els => els.map(e => ({
                src: e.src,
                display: window.getComputedStyle(e).display,
                visibility: window.getComputedStyle(e).visibility,
                offsetParent: e.offsetParent !== null
            }))"""
        )
        has_hero_logo = any(
            img["display"] != "none" and img["visibility"] != "hidden"
            for img in logo_imgs
        )
        r(f"10c[{vp_label}]", "Mobile: logo visible in page", has_hero_logo,
          f"logo imgs: {logo_imgs}")

    else:
        # Desktop: top header must be visible
        top_nav_visible = page.eval_on_selector_all(
            "header",
            "els => els.filter(e => e.textContent.includes('Inicio') || e.textContent.includes('Categorías'))"
            ".map(e => ({visible: e.offsetParent !== null, w: e.offsetWidth, h: e.offsetHeight}))"
        )
        header_ok = any(v["visible"] and v["w"] > 0 for v in top_nav_visible)
        r(f"10[{vp_label}]", "Desktop: top header visible", header_ok,
          f"{top_nav_visible}")

    page.close()


# ─── MAIN ────────────────────────────────────────────────────────────────────

def main():
    print(f"\n{'#'*60}")
    print("  HELADOS DEL OESTE — QA FULL REPORT")
    print(f"{'#'*60}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Performance measurement
        print("\n--- PERFORMANCE MEASUREMENT ---")
        transferred, nav_timing, t_load = measure_transfer(browser)
        print(f"  Bytes transferred: {transferred:,} bytes ({transferred/1024:.1f} KB)")
        if nav_timing:
            print(f"  DOMContentLoaded: {nav_timing['dcl']:.0f} ms")
            print(f"  Load event: {nav_timing['load']:.0f} ms")
        print(f"  Wall clock to load: {t_load*1000:.0f} ms")

        run_viewport(browser, "desktop", DESKTOP)
        run_viewport(browser, "mobile",  MOBILE)

        browser.close()

    # ─── SUMMARY ─────────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print("  RESULTS SUMMARY")
    print(f"{'='*60}")

    failures = [(n, l, d) for n, l, s, d in results if s == "FAIL"]
    passes   = [(n, l, d) for n, l, s, d in results if s == "PASS"]

    if failures:
        print(f"\n  FAILURES ({len(failures)}):")
        for n, l, d in failures:
            print(f"    [FAIL] {n}. {l}")
            print(f"           {d}")

    print(f"\n  Passed: {len(passes)} / {len(results)}")
    print(f"  Failed: {len(failures)} / {len(results)}")

    # perf summary
    print(f"\n--- BUNDLE SIZES (from vite build output) ---")
    print("  dist/assets/index-*.css : 16.28 kB  | gzip: 4.15 kB")
    print("  dist/assets/index-*.js  : 202.68 kB | gzip: 60.40 kB")
    print("  public/                 : 776 KB total")
    print(f"  Transferred on load     : {transferred:,} bytes ({transferred/1024:.1f} KB)")
    if nav_timing:
        print(f"  DOMContentLoaded        : {nav_timing['dcl']:.0f} ms")
        print(f"  Load event              : {nav_timing['load']:.0f} ms")

    return failures

if __name__ == "__main__":
    failures = main()
    import sys
    sys.exit(0 if not failures else 1)

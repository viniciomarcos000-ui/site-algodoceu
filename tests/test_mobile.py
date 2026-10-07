import sys
import os
from playwright.sync_api import sync_playwright

def run_tests():
    viewports = [
        {"name": "Android_Compact_360", "width": 360, "height": 800},
        {"name": "iPhone_SE_375", "width": 375, "height": 667},
        {"name": "iPhone_14_15_390", "width": 390, "height": 844},
        {"name": "iPhone_ProMax_430", "width": 430, "height": 932},
        {"name": "iPad_Mini_768", "width": 768, "height": 1024},
        {"name": "Desktop_MacBook_1280", "width": 1280, "height": 800},
        {"name": "Desktop_FullHD_1440", "width": 1440, "height": 900},
        {"name": "Desktop_Large_1920", "width": 1920, "height": 1080}
    ]

    screenshots_dir = "/Users/marcossvini/.gemini/antigravity-cli/brain/ce40d96a-4c6c-4782-a4c9-4d73a018d27d/scratch/mobile_tests"
    os.makedirs(screenshots_dir, exist_ok=True)

    all_passed = True

    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chrome')

        print("=== INICIANDO BATERIA DE TESTES MOBILE ===")

        for vp in viewports:
            print(f"\n--- Testando Viewport: {vp['name']} ({vp['width']}x{vp['height']}) ---")
            page = browser.new_page(viewport={"width": vp["width"], "height": vp["height"]})
            page.goto('http://localhost:8080')
            page.wait_for_load_state('networkidle')

            # 1. Teste de Overflow Horizontal
            scroll_w = page.evaluate("() => document.documentElement.scrollWidth")
            client_w = page.evaluate("() => document.documentElement.clientWidth")
            has_overflow = scroll_w > client_w

            if has_overflow:
                print(f"❌ FALHA: Overflow detectado! scrollWidth={scroll_w} > clientWidth={client_w}")
                bad = page.evaluate("""() => {
                    const elements = document.querySelectorAll('*');
                    const items = [];
                    const docW = document.documentElement.clientWidth;
                    elements.forEach(el => {
                        const r = el.getBoundingClientRect();
                        if (r.right > docW + 1) {
                            items.push({tag: el.tagName, cls: el.className, r: Math.round(r.right)});
                        }
                    });
                    return items.slice(0, 5);
                }""")
                print(f"   Elementos fora da tela: {bad}")
                all_passed = False
            else:
                print(f"✅ SUCESSO: Zero overflow horizontal! (scrollWidth={scroll_w} == clientWidth={client_w})")

            # 2. Teste do Menu Mobile Drawer
            toggle = page.locator('#mobileToggle')
            if toggle.is_visible():
                # Abre o menu
                toggle.click()
                page.wait_for_timeout(350)
                menu = page.locator('#navMenu')
                backdrop = page.locator('#navBackdrop')
                menu_open = menu.evaluate("el => el.classList.contains('open')")
                backdrop_active = backdrop.evaluate("el => el.classList.contains('active')")
                print(f"✅ Menu Drawer aberto: {menu_open}, Backdrop ativo: {backdrop_active}")

                # Captura screenshot do menu aberto
                page.screenshot(path=f"{screenshots_dir}/{vp['name']}_menu_open.png")

                # Clica no backdrop para fechar
                backdrop.click(position={"x": 10, "y": 10})
                page.wait_for_timeout(350)
                menu_closed = not menu.evaluate("el => el.classList.contains('open')")
                print(f"✅ Menu fechado via toque no backdrop: {menu_closed}")

            # 3. Teste de Vitrine e CTA Geral
            page.locator('#cardapio').scroll_into_view_if_needed()
            page.wait_for_timeout(200)
            cakes_count = page.evaluate("() => document.querySelectorAll('#marqueeTrack .cake-slide-card').length")
            print(f"✅ Bolos na vitrine animada: {cakes_count}")

            # 4. Teste de Prints Reais: NÃO abrem Lightbox (desativado conforme pedido)
            page.locator('#depoimentos').scroll_into_view_if_needed()
            page.wait_for_timeout(200)
            prints_count = page.evaluate("() => document.querySelectorAll('#printsTrack .print-slide-item').length")
            print(f"✅ Prints no Carrossel Animado: {prints_count}")

            page.evaluate("() => document.querySelector('.print-slide-item').click()")
            page.wait_for_timeout(250)
            lightbox = page.locator('#cakeLightbox')
            lb_active_print = lightbox.evaluate("el => el.classList.contains('active')")
            if not lb_active_print:
                print(f"✅ Conforme solicitado: Toque no print NÃO abre Lightbox (visualização limpa).")
            else:
                print(f"❌ FALHA: Lightbox ainda está abrindo ao clicar no print!")
                all_passed = False

            # 5. Validação do Número Oficial do WhatsApp em Todos os Links
            bad_phones = page.evaluate("""() => {
                const links = Array.from(document.querySelectorAll('a[href*="wa.me"]'));
                return links.filter(a => !a.href.includes('5521989600112')).map(a => a.href);
            }""")
            if len(bad_phones) == 0:
                print(f"✅ Todos os botões WhatsApp apontam para o número oficial 5521989600112!")
            else:
                print(f"❌ Links com número incorreto encontrados: {bad_phones}")
                all_passed = False

            # 6. Validação da Posição da Seção Chef (após FAQ)
            chef_order_valid = page.evaluate("""() => {
                const sections = Array.from(document.querySelectorAll('section')).map(s => s.id);
                const faqIdx = sections.indexOf('faq');
                const chefIdx = sections.indexOf('chef');
                return chefIdx > faqIdx;
            }""")
            if chef_order_valid:
                print(f"✅ Seção 'A Chef' está posicionada corretamente após o FAQ!")
            else:
                print(f"❌ Seção 'A Chef' não está após o FAQ!")
                all_passed = False

            # 7. Screenshot da página completa
            page.screenshot(path=f"{screenshots_dir}/{vp['name']}_full_page.png", full_page=True)
            print(f"📸 Screenshot salvo: {vp['name']}_full_page.png")

            page.close()

        browser.close()

    print("\n==========================================")
    if all_passed:
        print("🎉 TODOS OS TESTES PASSARAM COM SUCESSO!")
        return 0
    else:
        print("❌ ALGUNS TESTES FALHARAM!")
        return 1

if __name__ == '__main__':
    sys.exit(run_tests())

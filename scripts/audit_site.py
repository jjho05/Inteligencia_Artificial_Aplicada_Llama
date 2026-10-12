import os
import re
from bs4 import BeautifulSoup
from urllib.parse import urlparse

site_dir = "/Users/lic.ing.jesusolvera/Documents/IA LLAMA META/Inteligencia_Artificial_Aplicada_Llama"

html_files = [f for f in os.listdir(site_dir) if f.endswith(".html")]
print(f"Total de archivos HTML encontrados: {len(html_files)}")

errors = []
warnings = []
stats = {
    "total_links": 0,
    "internal_links_checked": 0,
    "scripts_checked": 0,
    "css_checked": 0,
    "katex_formulas": 0
}

for html_file in sorted(html_files):
    path = os.path.join(site_dir, html_file)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    soup = BeautifulSoup(content, "html.parser")

    # 1. Verificar Scripts
    scripts = soup.find_all("script")
    for s in scripts:
        src = s.get("src")
        if src and not src.startswith("http") and not src.startswith("//"):
            stats["scripts_checked"] += 1
            script_path = os.path.join(site_dir, src)
            if not os.path.exists(script_path):
                errors.append(f"[{html_file}] Script no encontrado: {src}")

    # 2. Verificar CSS
    links_css = soup.find_all("link", rel="stylesheet")
    for l in links_css:
        href = l.get("href")
        if href and not href.startswith("http") and not href.startswith("//"):
            stats["css_checked"] += 1
            css_path = os.path.join(site_dir, href)
            if not os.path.exists(css_path):
                errors.append(f"[{html_file}] CSS no encontrado: {href}")

    # 3. Verificar Enlaces internos
    links = soup.find_all("a")
    for a in links:
        stats["total_links"] += 1
        href = a.get("href")
        if not href:
            continue

        if href.startswith("http") or href.startswith("mailto:") or href.startswith("tel:"):
            continue

        if href.startswith("#"):
            # Anchor local
            anchor_id = href[1:]
            if anchor_id and not soup.find(id=anchor_id):
                warnings.append(f"[{html_file}] Anchor '#{anchor_id}' no existe en el DOM.")
        else:
            # Archivo local con posible anchor
            stats["internal_links_checked"] += 1
            parts = href.split("#")
            target_file = parts[0]
            target_path = os.path.join(site_dir, target_file)
            if not os.path.exists(target_path):
                errors.append(f"[{html_file}] Enlace roto a archivo inexistente: {href}")
            elif len(parts) > 1 and parts[1]:
                # Verificar el anchor en el archivo destino
                with open(target_path, "r", encoding="utf-8") as tf:
                    target_soup = BeautifulSoup(tf.read(), "html.parser")
                    if not target_soup.find(id=parts[1]):
                        warnings.append(f"[{html_file}] Enlace '{href}': el id '#{parts[1]}' no existe en '{target_file}'.")

    # 4. Fórmulas KaTeX
    formulas_display = re.findall(r"\$\$([\s\S]*?)\$\$", content)
    stats["katex_formulas"] += len(formulas_display)

print("\n=== REPORTE DE AUDITORÍA ESTÁTICA ===")
print(f"Estadísticas:")
print(f"- Total enlaces analizados: {stats['total_links']}")
print(f"- Enlaces internos validados: {stats['internal_links_checked']}")
print(f"- Scripts JS locales verificados: {stats['scripts_checked']}")
print(f"- Hojas CSS locales verificadas: {stats['css_checked']}")
print(f"- Fórmulas display KaTeX ($$): {stats['katex_formulas']}")

print(f"\nErrores críticos encontrados: {len(errors)}")
for e in errors:
    print(f"  ❌ {e}")

print(f"\nAdvertencias (anchors): {len(warnings)}")
for w in warnings[:15]:
    print(f"  ⚠️ {w}")
if len(warnings) > 15:
    print(f"  ... y {len(warnings) - 15} advertencias más.")

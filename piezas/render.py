#!/usr/bin/env python3
"""Renderiza piezas HTML a PNG con Chrome headless.

Por qué existe: renderizar a mano se rompe fácil y en silencio. Si el server
levanta en el directorio equivocado, Chrome guarda un PNG BLANCO encima del bueno
y no te enterás hasta que abrís el archivo. Este script:
  · levanta el server en la raíz del proyecto y ESPERA a que responda 200
  · renderiza a un temporal
  · VERIFICA que el PNG no esté en blanco antes de moverlo al destino
  · escala configurable. OJO: renderizar a 2x NO agrega nitidez si el original mide menos
    que el destino — solo infla el archivo y mete un resampleo extra. Usar 1 salvo que la
    foto fuente tenga el doble de px que la pieza.

Uso:
  python3 piezas/render.py placa-wpc.html "p=1" out/wpc-placa-1.png 1080 1080
  python3 piezas/render.py post-ig.html  "n=1" out/ig-1.png        1080 1350
"""
import os, subprocess, sys, tempfile, time, urllib.request, urllib.error

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUERTO = 8899


def server_vivo():
    """No alcanza con que responda: tiene que estar sirviendo LA RAÍZ del proyecto.
    Un server de otra sesión en otro directorio contesta igual y devuelve 404 en todo."""
    try:
        r = urllib.request.urlopen(f"http://localhost:{PUERTO}/piezas/", timeout=1)
        return r.getcode() == 200
    except Exception:
        return False


def render(html, query, destino, w, h, escala=2):
    url = f"http://localhost:{PUERTO}/piezas/{html}" + (f"?{query}" if query else "")
    try:
        code = urllib.request.urlopen(url, timeout=5).getcode()
    except urllib.error.HTTPError as e:
        sys.exit(f"✗ {url} devolvió {e.code} — ¿el server está en la raíz del proyecto?")
    tmp = tempfile.mktemp(suffix=".png")
    subprocess.run([CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
                    f"--force-device-scale-factor={escala}",
                    f"--screenshot={tmp}", f"--window-size={w},{h}", url],
                   capture_output=True)
    if not os.path.exists(tmp):
        sys.exit(f"✗ Chrome no generó nada para {url}")
    from PIL import Image
    im = Image.open(tmp).convert("RGB")
    colores = len(im.getcolors(maxcolors=500000) or [])
    if colores < 20:
        os.remove(tmp)
        sys.exit(f"✗ {html}?{query} renderizó en BLANCO ({colores} colores). "
                 f"No piso {destino}.")
    os.replace(tmp, os.path.join(RAIZ, destino))
    print(f"   ✓ {destino}  {im.size[0]}x{im.size[1]}  ({colores} colores)")


if __name__ == "__main__":
    if len(sys.argv) < 6:
        sys.exit(__doc__)
    os.chdir(RAIZ)
    propio = None
    if not server_vivo():
        # si hay uno de otra sesión en el puerto, lo sacamos: sirve el directorio equivocado
        subprocess.run(f"lsof -ti:{PUERTO} | xargs kill -9", shell=True, capture_output=True)
        time.sleep(0.5)
        propio = subprocess.Popen(["python3", "-m", "http.server", str(PUERTO)],
                                  cwd=RAIZ, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(40):
            if server_vivo():
                break
            time.sleep(0.25)
        else:
            sys.exit("✗ el server no levantó")
    try:
        render(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5],
               int(sys.argv[6]) if len(sys.argv) > 6 else 2)
    finally:
        if propio:
            propio.terminate()

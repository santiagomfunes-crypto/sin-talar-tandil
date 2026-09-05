#!/usr/bin/env python3
"""Publica en @wpc.tandil la SIGUIENTE pieza pendiente de marketing/cola-feed.json.

Pensado para correr desde GitHub Actions dos veces por dia. Publica UNA por vez
y marca la pieza como publicada en el JSON (el workflow commitea el cambio).

  python3 publicar-siguiente.py            # publica
  python3 publicar-siguiente.py --dry-run  # valida y no publica

Token: variable de entorno META_TOKEN (secret) o, en local, meta-api/.env.meta
"""
import os, sys, json, time, urllib.request, urllib.parse, urllib.error

IG   = "17841435576809277"
BASE = "https://santiagomfunes-crypto.github.io/sin-talar-tandil/media/ig"
G    = "https://graph.facebook.com/v21.0"
HERE = os.path.dirname(os.path.abspath(__file__))
COLA = os.path.join(HERE, "..", "marketing", "cola-feed.json")
DRY  = "--dry-run" in sys.argv

def token():
    t = os.environ.get("META_TOKEN", "").strip()
    if t:
        return t
    sys.path.insert(0, HERE)
    from _meta import load_token
    return load_token()

def post(path, **p):
    p["access_token"] = TOKEN
    req = urllib.request.Request(f"{G}/{path}", data=urllib.parse.urlencode(p).encode())
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"✗ Meta rechazó la llamada a {path}: {e.read().decode()[:400]}")

def get(path, **p):
    p["access_token"] = TOKEN
    with urllib.request.urlopen(f"{G}/{path}?{urllib.parse.urlencode(p)}") as r:
        return json.load(r)

TOKEN = token()
cola = json.load(open(COLA, encoding="utf-8"))
pend = [e for e in cola if not e.get("publicado")]
if not pend:
    print("✓ La cola está vacía: no queda nada por publicar.")
    sys.exit(0)

e   = pend[0]
url = f"{BASE}/{e['archivo']}"
print(f"→ #{e['orden']} · {e['tipo']} · {e['archivo']}  ({len(pend)} pendientes)")

# 1) el archivo tiene que estar servido ANTES de pedirle a Meta que lo busque
try:
    with urllib.request.urlopen(urllib.request.Request(url, method="HEAD")) as r:
        print(f"   url {r.status} {r.headers.get('content-type')}")
except urllib.error.HTTPError as ex:
    sys.exit(f"✗ {url} devuelve {ex.code}. ¿GitHub Pages todavía no lo publicó?")

if DRY:
    print("   [dry-run] no publico. Primera línea del caption:")
    print("   " + e["caption"].splitlines()[0])
    sys.exit(0)

# 2) contenedor
if e["tipo"] == "reel":
    c = post(f"{IG}/media", media_type="REELS", video_url=url,
             caption=e["caption"], share_to_feed="true")
else:
    c = post(f"{IG}/media", image_url=url, caption=e["caption"])

# 3) esperar el procesado
for i in range(40):
    st = get(c["id"], fields="status_code,status")
    if st.get("status_code") == "FINISHED":
        break
    if st.get("status_code") == "ERROR":
        sys.exit("✗ Meta no pudo procesar el archivo: " + str(st.get("status")))
    time.sleep(10)
else:
    sys.exit("✗ timeout esperando el procesado del contenedor")

# 4) publicar y anotar
r  = post(f"{IG}/media_publish", creation_id=c["id"])
pl = get(r["id"], fields="permalink").get("permalink", "")
e["publicado"] = {"id": r["id"], "permalink": pl,
                  "fecha": time.strftime("%Y-%m-%d %H:%M", time.gmtime())}
json.dump(cola, open(COLA, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"✓ PUBLICADO #{e['orden']} → {pl}")
print(f"  quedan {len(pend)-1} en la cola")

#!/usr/bin/env python3
"""Publica un reel en Instagram (@wpc.tandil) por la API.
La API NO sube archivos: descarga el video de una URL publica (GitHub Pages).
Uso: python3 publicar-ig.py <archivo-sin-extension> <ruta-caption.txt>
"""
import sys, json, time, urllib.request, urllib.parse
from _meta import load_token

IG = "17841435576809277"
BASE = "https://santiagomfunes-crypto.github.io/sin-talar-tandil/media/ig"
G = "https://graph.facebook.com/v21.0"

def post(path, **params):
    params["access_token"] = TOKEN
    data = urllib.parse.urlencode(params).encode()
    with urllib.request.urlopen(urllib.request.Request(f"{G}/{path}", data=data)) as r:
        return json.load(r)

def get(path, **params):
    params["access_token"] = TOKEN
    with urllib.request.urlopen(f"{G}/{path}?{urllib.parse.urlencode(params)}") as r:
        return json.load(r)

TOKEN = load_token()
slug, capfile = sys.argv[1], sys.argv[2]
caption = open(capfile).read().strip()
url = f"{BASE}/{slug}.mp4"

print(f"→ contenedor para {url}")
c = post(f"{IG}/media", media_type="REELS", video_url=url,
         caption=caption, share_to_feed="true")
cid = c["id"]

for i in range(40):                      # Meta tarda en procesar el video
    st = get(cid, fields="status_code,status")
    print(f"   [{i:02}] {st.get('status_code')}")
    if st.get("status_code") == "FINISHED":
        break
    if st.get("status_code") == "ERROR":
        sys.exit("✗ Meta rechazó el video: " + str(st.get("status")))
    time.sleep(10)
else:
    sys.exit("✗ timeout esperando el procesado")

r = post(f"{IG}/media_publish", creation_id=cid)
print("✓ PUBLICADO id:", r["id"])
print("  https://instagram.com/wpc.tandil")

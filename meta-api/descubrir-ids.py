#!/usr/bin/env python3
"""WPC Tandil — con SOLO el token pegado en .env.meta, descubre el resto de los IDs
(cuenta publicitaria, página, Instagram, pixel) y te deja el .env.meta listo para completar.

No crea nada, no gasta nada. Uso: python3 descubrir-ids.py
"""
import os, sys
from _meta import api_get, HERE

os.chdir(HERE)
if not os.path.exists(".env.meta"):
    sys.exit("✗ Falta .env.meta — copiá .env.meta.example y pegá al menos el token.")
TOKEN = ""
for line in open(".env.meta"):
    if line.strip().startswith("META_ADS_TOKEN="):
        TOKEN = line.split("=", 1)[1].strip().strip('"').strip("'")
if not TOKEN:
    sys.exit("✗ META_ADS_TOKEN vacío en .env.meta")

MARCA = ("wpc", "tandil")   # palabras que identifican los activos de esta marca

def es_de_la_marca(nombre):
    n = (nombre or "").lower()
    return any(w in n for w in MARCA)

me = api_get(TOKEN, "me", fields="id,name")
if "error" in me:
    sys.exit(f"✗ Token inválido: {me['error'].get('message')}")
print(f"✓ Token OK — {me.get('name') or me.get('id')}\n")

sug = {}

print("▶ Cuentas publicitarias")
acts = api_get(TOKEN, "me/adaccounts", fields="account_id,name,account_status,currency", limit=50).get("data", [])
if not acts:
    print("   ✗ ninguna. Falta asignarle la cuenta publicitaria al usuario del sistema.")
for a in acts:
    activa = a.get("account_status") == 1
    marca = es_de_la_marca(a["name"])
    print(f"   {'★' if marca else ('✓' if activa else '·')} {a['name']}  →  act_{a['account_id']}  ({a.get('currency')}{'' if activa else ', NO activa'})")
    if activa and marca and "META_AD_ACCOUNT_ID" not in sug:
        sug["META_AD_ACCOUNT_ID"] = f"act_{a['account_id']}"

print("\n▶ Páginas de Facebook")
pages = api_get(TOKEN, "me/accounts", fields="id,name,link", limit=50).get("data", [])
if not pages:
    print("   ✗ ninguna. Falta asignarle la Página al usuario del sistema.")
for p in pages:
    marca = es_de_la_marca(p["name"])
    print(f"   {'★' if marca else '·'} {p['name']}  →  {p['id']}")
    if marca and "META_PAGE_ID" not in sug:
        sug["META_PAGE_ID"] = p["id"]

print("\n▶ Instagram conectado a cada página")
for p in pages:
    ig = api_get(TOKEN, p["id"], fields="instagram_business_account{id,username}")
    acc = ig.get("instagram_business_account")
    if acc:
        marca = es_de_la_marca(p["name"]) or es_de_la_marca(acc.get("username"))
        print(f"   {'★' if marca else '·'} {p['name']} → @{acc.get('username')}  →  {acc['id']}")
        if marca and "META_IG_USER_ID" not in sug:
            sug["META_IG_USER_ID"] = acc["id"]
    else:
        print(f"   ⚠ {p['name']}: sin Instagram conectado")

print("\n▶ WhatsApp conectado a cada página (necesario para Click-to-WhatsApp)")
for p in pages:
    wa = api_get(TOKEN, p["id"], fields="whatsapp_number")
    print(f"   {'✓' if wa.get('whatsapp_number') else '✗'} {p['name']}: {wa.get('whatsapp_number') or 'SIN WhatsApp conectado'}")

print("\n▶ Pixels (solo los de las cuentas de la marca)")
for a in acts:
    if not es_de_la_marca(a["name"]):
        continue   # un pixel de otra marca NO sirve: mide otro sitio y arma otro retargeting
    px = api_get(TOKEN, f"act_{a['account_id']}/adspixels", fields="id,name,last_fired_time").get("data", [])
    for p in px:
        print(f"   ★ {p['name']}  →  {p['id']}  (último evento: {p.get('last_fired_time', 'nunca')})")
        if "META_PIXEL_ID" not in sug:
            sug["META_PIXEL_ID"] = p["id"]
    if not px:
        print(f"   ⚠ {a['name']}: sin pixel todavía. Se crea con:")
        print(f"     curl -X POST 'https://graph.facebook.com/v21.0/act_{a['account_id']}/adspixels' \\")
        print(f"       -d 'name=WPC Tandil Pixel' -d \"access_token=$META_ADS_TOKEN\"")

faltan = [k for k in ("META_AD_ACCOUNT_ID","META_PAGE_ID","META_IG_USER_ID","META_PIXEL_ID") if k not in sug]
if faltan:
    print(f"\n⚠ No encontré activos de la marca para: {', '.join(faltan)}")
    print("  (★ = coincide con la marca. Si el activo existe con otro nombre, ajustá MARCA arriba.)")
if sug:
    print("\n── Pegá esto en .env.meta ─────────────────────────────────")
    for k, v in sug.items():
        print(f"{k}={v}")
    print("───────────────────────────────────────────────────────────")
    print("(y el META_PIXEL_ID va TAMBIÉN en index.html, en la línea `var META_PIXEL_ID = ''`)")

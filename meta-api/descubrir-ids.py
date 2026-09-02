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
    print(f"   {'✓' if activa else '·'} {a['name']}  →  act_{a['account_id']}  ({a.get('currency')}{'' if activa else ', NO activa'})")
    if activa and "META_AD_ACCOUNT_ID" not in sug:
        sug["META_AD_ACCOUNT_ID"] = f"act_{a['account_id']}"

print("\n▶ Páginas de Facebook")
pages = api_get(TOKEN, "me/accounts", fields="id,name,link", limit=50).get("data", [])
if not pages:
    print("   ✗ ninguna. Falta asignarle la Página al usuario del sistema.")
for p in pages:
    print(f"   · {p['name']}  →  {p['id']}")
    if "META_PAGE_ID" not in sug:
        sug["META_PAGE_ID"] = p["id"]

print("\n▶ Instagram conectado a cada página")
for p in pages:
    ig = api_get(TOKEN, p["id"], fields="instagram_business_account{id,username}")
    acc = ig.get("instagram_business_account")
    if acc:
        print(f"   · {p['name']} → @{acc.get('username')}  →  {acc['id']}")
        if "META_IG_USER_ID" not in sug:
            sug["META_IG_USER_ID"] = acc["id"]
    else:
        print(f"   ⚠ {p['name']}: sin Instagram conectado")

print("\n▶ WhatsApp conectado a cada página (necesario para Click-to-WhatsApp)")
for p in pages:
    wa = api_get(TOKEN, p["id"], fields="whatsapp_number")
    print(f"   {'✓' if wa.get('whatsapp_number') else '✗'} {p['name']}: {wa.get('whatsapp_number') or 'SIN WhatsApp conectado'}")

print("\n▶ Pixels")
for a in acts:
    px = api_get(TOKEN, f"act_{a['account_id']}/adspixels", fields="id,name,last_fired_time").get("data", [])
    for p in px:
        print(f"   · {p['name']}  →  {p['id']}  (último evento: {p.get('last_fired_time', 'nunca')})")
        if "META_PIXEL_ID" not in sug:
            sug["META_PIXEL_ID"] = p["id"]
    if not px:
        print(f"   ⚠ {a['name']}: sin pixel. Creá uno en Orígenes de datos.")

if sug:
    print("\n── Pegá esto en .env.meta ─────────────────────────────────")
    for k, v in sug.items():
        print(f"{k}={v}")
    print("───────────────────────────────────────────────────────────")
    print("(y el META_PIXEL_ID va TAMBIÉN en index.html, en la línea `var META_PIXEL_ID = ''`)")

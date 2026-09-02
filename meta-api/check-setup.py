#!/usr/bin/env python3
"""WPC Tandil — chequeo previo. NO crea nada, NO gasta un peso.
Verifica que el token, la cuenta, la página, el IG y el WhatsApp estén como corresponde.
Uso: python3 check-setup.py
"""
import json, os, sys
from _meta import load_token, load_cfg, api_get, HERE

TOKEN = load_token()
CFG = load_cfg()
ACT = CFG["ad_account_id"]; PAGE = CFG["page_id"]; IG = CFG.get("instagram_actor_id", "")
ok = True
def bad(m):
    global ok; ok = False; print(f"   ✗ {m}")

print("▶ Token")
me = api_get(TOKEN, "me", fields="id,name")
if "error" in me: bad(f"token inválido: {me['error'].get('message')}")
else: print(f"   ✓ {me.get('name', me.get('id'))}")

perms = api_get(TOKEN, "me/permissions").get("data", [])
tiene = {p["permission"] for p in perms if p.get("status") == "granted"}
for p in ("ads_management", "business_management"):
    print(f"   {'✓' if p in tiene else '✗'} permiso {p}")
    if p not in tiene and perms: bad(f"falta el permiso {p}")

print("▶ Cuenta publicitaria")
acc = api_get(TOKEN, ACT, fields="name,account_status,currency,amount_spent,disable_reason")
if "error" in acc: bad(acc["error"].get("message"))
else:
    estado = {1: "ACTIVA", 2: "DESHABILITADA", 3: "NO CONFIRMADA", 7: "EN REVISIÓN", 9: "EN GRACIA", 101: "CERRADA"}
    st = acc.get("account_status")
    print(f"   {'✓' if st == 1 else '✗'} {acc.get('name')} · {estado.get(st, st)} · moneda {acc.get('currency')}")
    if st != 1: bad("la cuenta no está activa (revisá método de pago / verificación)")

print("▶ Página de Facebook")
pg = api_get(TOKEN, PAGE, fields="name,link,is_published")
if "error" in pg: bad(pg["error"].get("message"))
else: print(f"   ✓ {pg.get('name')} · {pg.get('link')}")

print("▶ Instagram")
if not IG or "PEGAR" in IG:
    print("   ⚠ sin instagram_actor_id: los anuncios saldrán SOLO en Facebook")
else:
    ig = api_get(TOKEN, IG, fields="username,profile_picture_url")
    if "error" in ig: bad(f"IG id inválido: {ig['error'].get('message')}")
    else: print(f"   ✓ @{ig.get('username')}")

print("▶ WhatsApp conectado a la página (necesario para Click-to-WhatsApp)")
wa = api_get(TOKEN, PAGE, fields="whatsapp_number,connected_whatsapp_business_account")
num = wa.get("whatsapp_number") or ""
if num:
    print(f"   ✓ número conectado: {num}")
    esperado = CFG["whatsapp_phone_number"].replace("+", "").replace(" ", "").replace("-", "")
    if esperado[-8:] not in num.replace(" ", ""):
        print(f"   ⚠ ojo: config.json dice {CFG['whatsapp_phone_number']} y la página tiene {num}")
else:
    bad("la página NO tiene WhatsApp conectado → Meta Business Suite > Configuración > WhatsApp > Conectar")

print("▶ Pixel(s) de la cuenta")
px = api_get(TOKEN, f"{ACT}/adspixels", fields="id,name,last_fired_time").get("data", [])
if not px: print("   ⚠ no hay pixel en la cuenta (creá uno en Orígenes de datos)")
for p in px:
    print(f"   • {p['name']} · id={p['id']} · último evento: {p.get('last_fired_time', 'nunca')}")
    print(f"     ↳ pegá este id en index.html (META_PIXEL_ID)")

print("\n" + ("✅ Todo listo para crear la campaña." if ok else "❌ Hay cosas para resolver antes de crear la campaña."))
sys.exit(0 if ok else 1)

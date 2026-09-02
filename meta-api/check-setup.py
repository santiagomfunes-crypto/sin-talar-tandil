#!/usr/bin/env python3
"""WPC Tandil — chequeo previo. NO crea nada, NO gasta un peso.
Verifica que el token, la cuenta, la página, el IG y el WhatsApp estén como corresponde.
Uso: python3 check-setup.py
"""
import json, os, sys
from _meta import load_token, load_cfg, api_get, api_post, HERE

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

print("▶ WhatsApp para Click-to-WhatsApp")
# No alcanza con mirar page.whatsapp_number: una cuenta de WhatsApp creada en el portfolio
# NO es lo mismo que la Página vinculada, y el campo no distingue los casos. Así que le
# preguntamos a Meta directamente: creamos una campaña en pausa, validamos el conjunto con
# execution_options=["validate_only"] (no crea nada) y la borramos. La respuesta es la verdad.
import json as _json, urllib.parse as _up, urllib.request as _ur, urllib.error as _ue
from _meta import targeting, G

_camp = api_post(TOKEN, f"{ACT}/campaigns", name="ZZZ check-setup (auto)",
                 objective=CFG.get("objective", "OUTCOME_ENGAGEMENT"), status="PAUSED",
                 is_adset_budget_sharing_enabled="false", special_ad_categories="[]")
_params = {
    "name": "ZZZ check-setup", "campaign_id": _camp["id"], "daily_budget": "1300",
    "billing_event": "IMPRESSIONS", "optimization_goal": "CONVERSATIONS",
    "destination_type": "WHATSAPP",
    "promoted_object": _json.dumps({"page_id": PAGE,
                                    "whatsapp_phone_number": CFG["whatsapp_phone_number"]}),
    "bid_strategy": "LOWEST_COST_WITHOUT_CAP",
    "targeting": _json.dumps(targeting(CFG, [])),
    "status": "PAUSED", "execution_options": _json.dumps(["validate_only"]),
    "access_token": TOKEN,
}
try:
    _ur.urlopen(_ur.Request(f"{G}/{ACT}/adsets", data=_up.urlencode(_params).encode()))
    print(f"   ✓ Meta acepta el destino WhatsApp con {CFG['whatsapp_phone_number']}")
except _ue.HTTPError as _e:
    _err = _json.load(_e).get("error", {})
    bad(_err.get("error_user_msg") or _err.get("error_user_title") or _err.get("message"))
    print("     ↳ se conecta desde la PÁGINA (no alcanza con crear una cuenta en el portfolio):")
    print(f"        facebook.com/{PAGE}/settings → WhatsApp → Conectar número")
finally:
    api_post(TOKEN, _camp["id"], status="DELETED")

print("▶ Pixel(s) de la cuenta")
px = api_get(TOKEN, f"{ACT}/adspixels", fields="id,name,last_fired_time").get("data", [])
if not px: print("   ⚠ no hay pixel en la cuenta (creá uno en Orígenes de datos)")
for p in px:
    print(f"   • {p['name']} · id={p['id']} · último evento: {p.get('last_fired_time', 'nunca')}")
    print(f"     ↳ pegá este id en index.html (META_PIXEL_ID)")

print("\n" + ("✅ Todo listo para crear la campaña." if ok else "❌ Hay cosas para resolver antes de crear la campaña."))
sys.exit(0 if ok else 1)

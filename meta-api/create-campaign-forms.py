#!/usr/bin/env python3
"""WPC Tandil — campaña de FORMULARIO (Lead Ads / instant form).
El formulario se abre DENTRO de IG/FB (sin salto a WhatsApp) y viene pre-cargado
del perfil: la persona solo toca Enviar. Mínimo tipeo: nombre + teléfono.
Todo EN PAUSA. Uso: python3 create-campaign-forms.py
"""
import json, os, sys, urllib.parse
from _meta import load_token, load_cfg, api_get, api_post, die, targeting, G, HERE

os.chdir(HERE)
TOKEN = load_token(); CFG = load_cfg()
ACT = CFG["ad_account_id"]; PAGE = CFG["page_id"]; IG = CFG.get("instagram_actor_id", "")
if "PEGAR" in IG:
    IG = ""
BUDGET = "1000"   # USD 10/día (todo en pausa igual)
PRIVACY = "https://wpctandil.com.ar/privacidad.html"
WA_LINK = "https://wa.me/5492494209464?text=" + urllib.parse.quote("Hola! Quiero un presupuesto de deck 👍")

# token de Página (los formularios se crean con token de página)
pg = api_get(TOKEN, PAGE, fields="access_token,name")
PAGE_TOKEN = pg.get("access_token")
if not PAGE_TOKEN:
    sys.exit("✗ No pude obtener token de Página (¿el usuario del sistema tiene la Página con control total? "
             "¿el token tiene pages_manage_metadata / pages_manage_ads?). Detalle: " + json.dumps(pg)[:200])
print(f"▶ 1/4  Token de Página OK ({pg.get('name')})")

REUSE_FORM_ID = "1798619054495337"   # formulario ya creado (nombre + teléfono, prellenados)

# 1) crear el formulario (mínimo: nombre + teléfono, prellenados)
form_spec = {
    "name": "WPC Tandil · Presupuesto de deck",
    "locale": "es_LA",
    "questions": json.dumps([{"type": "FULL_NAME"}, {"type": "PHONE"}]),
    "privacy_policy": json.dumps({"url": PRIVACY, "link_text": "Política de privacidad"}),
    "context_card": json.dumps({
        "title": "Pedí tu presupuesto de deck WPC",
        "style": "PARAGRAPH_STYLE",
        "content": ["Deck de madera plástica en Tandil: cero mantenimiento, más de 25 años. "
                    "Dejanos tu contacto y te pasamos el presupuesto sin cargo."],
        "button_text": "Pedir presupuesto",
    }),
    "thank_you_page": json.dumps({
        "title": "¡Listo! Te contactamos con tu presupuesto.",
        "body": "Si querés, escribinos ahora mismo por WhatsApp.",
        "button_type": "VIEW_WEBSITE",
        "website_url": WA_LINK,
        "button_text": "Escribinos por WhatsApp",
    }),
    "follow_up_action_url": WA_LINK,
    "access_token": PAGE_TOKEN,
}
if REUSE_FORM_ID:
    FORM_ID = REUSE_FORM_ID
    print(f"▶ 2/4  Reuso formulario existente (form_id={FORM_ID})")
else:
    r = api_post(TOKEN, f"{PAGE}/leadgen_forms", **form_spec)
    FORM_ID = r.get("id")
    if not FORM_ID:
        die("POST leadgen_forms", r)
    print(f"▶ 2/4  Formulario creado (form_id={FORM_ID}) — nombre + teléfono, prellenados")

# 2) elegir los 5 videos más fuertes (reuso video_id ya subidos)
want = ["wpc-3.mp4", "wpc-1.mp4", "wpc-7.mp4", "wpc-4.mp4", "wpc-8.mp4"]
crees = []
for name in want:
    c = next((x for x in CFG["creatives"] if os.path.basename(x["video_path"]) == name and x.get("video_id")), None)
    if c:
        crees.append(c)
if not crees:
    sys.exit("✗ No hay video_id cacheados; corré primero la campaña de videos.")
# miniatura obligatoria para lead ads: la traigo de cada video
for c in crees:
    if not c.get("thumb"):
        th = api_get(TOKEN, f"{c['video_id']}/thumbnails", fields="uri,is_preferred").get("data", [])
        pref = [t for t in th if t.get("is_preferred")] or th
        c["thumb"] = pref[0]["uri"] if pref else ""
print(f"▶ 3/4  {len(crees)} videos reusados (con miniatura)")

# 3) campaña + adset + ads (OUTCOME_LEADS / formulario en el anuncio)
camp = api_post(TOKEN, f"{ACT}/campaigns", name="WPC Tandil | Prospecting | Lead Form",
                objective="OUTCOME_LEADS", status="PAUSED",
                is_adset_budget_sharing_enabled="false", special_ad_categories="[]")
CAMP = camp["id"]
adset = api_post(TOKEN, f"{ACT}/adsets", name="Formulario · Tandil 40km · abierto",
                 campaign_id=CAMP, daily_budget=BUDGET, billing_event="IMPRESSIONS",
                 optimization_goal="LEAD_GENERATION", destination_type="ON_AD",
                 promoted_object=json.dumps({"page_id": PAGE}),
                 bid_strategy="LOWEST_COST_WITHOUT_CAP",
                 targeting=json.dumps(targeting(CFG, [])), status="PAUSED")
print(f"▶ 4/4  Campaña {CAMP} · adset {adset['id']} · USD10/día · LEAD_GENERATION")

for c in crees:
    vd = {"video_id": c["video_id"], "message": c["primary_text"], "title": c["headline"],
          "link_description": c.get("description", ""),
          "call_to_action": {"type": "SIGN_UP", "value": {"lead_gen_form_id": FORM_ID, "link": WA_LINK}}}
    if c.get("thumb"):
        vd["image_url"] = c["thumb"]
    spec = {"page_id": PAGE, "video_data": vd}
    if IG:
        spec["instagram_user_id"] = IG
    crea = api_post(TOKEN, f"{ACT}/adcreatives", name=f"WPC form · {c['headline']}",
                    object_story_spec=json.dumps(spec))
    ad = api_post(TOKEN, f"{ACT}/ads", name=f"Form · {c['headline']}",
                  adset_id=adset["id"], creative=json.dumps({"creative_id": crea["id"]}), status="PAUSED")
    print(f"   ✓ {c['headline']} (ad {ad['id']})")

print(f"\n✅ LISTO — Formulario con {len(crees)} videos, EN PAUSA (USD10/día). form_id={FORM_ID} campaign={CAMP}")

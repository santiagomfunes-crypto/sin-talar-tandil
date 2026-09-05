#!/usr/bin/env python3
"""Agrega un conjunto de ESTÁTICOS (placas) a la campaña de FORMULARIO existente.
Baja el conjunto de videos a $10 y crea estáticos a $10 → total $20/día en Formulario.
Uso: python3 add-statics-to-forms.py
"""
import json, os, subprocess
from _meta import load_token, load_cfg, api_get, api_post, die, targeting, G, HERE

os.chdir(HERE)
TOKEN = load_token(); CFG = load_cfg()
ACT = CFG["ad_account_id"]; PAGE = CFG["page_id"]; IG = CFG.get("instagram_actor_id", "")
if "PEGAR" in IG:
    IG = ""
FORMS_CAMP = "120251440759520234"
VIDEO_ADSET = "120251440760070234"
FORM_ID = "1798619054495337"
LANDING = "https://wpctandil.com.ar/"
PLACADIR = os.path.abspath(os.path.join(HERE, "..", "placas"))

PLACAS = [
 ("p-3.png", "Invertís una sola vez", "Medición y presupuesto sin cargo",
  "Rehacer el deck cada cinco años es plata tirada. Con el deck de madera plástica invertís una vez y dura más de veinticinco años, sin mantenimiento. Presupuesto sin cargo en Tandil."),
 ("p-1.png", "Deck que no se mantiene", "Presupuesto sin cargo en Tandil",
  "¿Otra primavera lijando y barnizando el deck? El deck de madera plástica no se mantiene nunca: no se astilla, no se pudre, no se pinta. Instalamos en Tandil."),
 ("p-7.png", "Te lo dejamos listo", "Instalación en Tandil",
  "Te instalamos el deck de madera plástica en Tandil: prolijo, rápido y sin que lo mantengas nunca más. Pedí tu presupuesto sin cargo."),
 ("p-4.png", "No lo toca ni el clima", "Resiste el clima de Tandil",
  "Humedad, sol, heladas y termitas arruinan la madera común. El deck de madera plástica ni se inmuta: se ve nuevo por más de veinticinco años."),
 ("p-8.png", "El deck que no mantenés nunca", "Deck · Wall Panel · Perfilería",
  "Deck, wall panel y perfilería de madera plástica en Tandil. Se ve siempre nuevo por más de veinticinco años. Pedí tu presupuesto sin cargo."),
]

print("▶ 1/4  Bajo el conjunto de videos a USD 10…")
print("   ", api_post(TOKEN, VIDEO_ADSET, daily_budget="1000"))

print(f"▶ 2/4  Subiendo {len(PLACAS)} imágenes…")
hashes = {}
for fn, *_ in PLACAS:
    path = os.path.join(PLACADIR, fn)
    out = subprocess.run(["curl", "-s", "-X", "POST", f"{G}/{ACT}/adimages",
                          "-F", f"access_token={TOKEN}", "-F", f"file=@{path}"],
                         capture_output=True, text=True).stdout
    j = json.loads(out)
    if "error" in j:
        die("POST adimages", j)
    hashes[fn] = list(j["images"].values())[0]["hash"]
    print(f"   ✓ {fn}")

print("▶ 3/4  Creando conjunto Estáticos · Formulario (Feed, USD 10)…")
t = targeting(CFG, [])
t["facebook_positions"] = ["feed"]
t["instagram_positions"] = ["stream"]
adset = api_post(TOKEN, f"{ACT}/adsets", name="Estáticos · Formulario · Feed",
                 campaign_id=FORMS_CAMP, daily_budget="1000", billing_event="IMPRESSIONS",
                 optimization_goal="LEAD_GENERATION", destination_type="ON_AD",
                 promoted_object=json.dumps({"page_id": PAGE}),
                 bid_strategy="LOWEST_COST_WITHOUT_CAP",
                 targeting=json.dumps(t), status="ACTIVE")
print(f"   ✓ adset_id={adset['id']}")

print("▶ 4/4  Creando 5 anuncios estáticos de formulario…")
for fn, headline, desc, primary in PLACAS:
    link_data = {"image_hash": hashes[fn], "link": LANDING, "message": primary,
                 "name": headline, "description": desc,
                 "call_to_action": {"type": "SIGN_UP", "value": {"lead_gen_form_id": FORM_ID, "link": LANDING}}}
    spec = {"page_id": PAGE, "link_data": link_data}
    if IG:
        spec["instagram_user_id"] = IG
    crea = api_post(TOKEN, f"{ACT}/adcreatives", name=f"WPC form estático · {headline}",
                    object_story_spec=json.dumps(spec))
    ad = api_post(TOKEN, f"{ACT}/ads", name=f"Form estático · {headline}",
                  adset_id=adset["id"], creative=json.dumps({"creative_id": crea["id"]}), status="ACTIVE")
    print(f"   ✓ {headline} (ad {ad['id']})")

print("\n✅ LISTO — Formulario ahora: Videos $10 + Estáticos $10 = $20/día.")

#!/usr/bin/env python3
"""Agrega un conjunto de anuncios ESTÁTICOS (placas) a la campaña WhatsApp existente.
5 placas fuertes, Feed, botón → wa.me. Sube imágenes, crea adset + ads EN PAUSA.
También sube el presupuesto del conjunto de videos a USD 13.
Uso: python3 add-statics.py
"""
import json, os, subprocess, urllib.parse
from _meta import load_token, load_cfg, api_post, die, targeting, G, HERE

os.chdir(HERE)
TOKEN = load_token(); CFG = load_cfg()
ACT = CFG["ad_account_id"]; PAGE = CFG["page_id"]; IG = CFG.get("instagram_actor_id", "")
if "PEGAR" in IG:
    IG = ""
WA_NUM = CFG["whatsapp_phone_number"].lstrip("+")
WA_TEXT = "Hola! Vengo del anuncio del deck WPC. Quiero pedir un presupuesto en Tandil."
WA_LINK = f"https://wa.me/{WA_NUM}?text=" + urllib.parse.quote(WA_TEXT)

CAMP = "120251438753090234"                 # WPC Tandil | Prospecting | Traffic→WhatsApp
VIDEO_ADSET = "120251438753460234"          # conjunto de los 8 videos
PLACADIR = os.path.abspath(os.path.join(HERE, "..", "placas"))

# 5 placas fuertes: (archivo, headline, description, primary_text)
PLACAS = [
 ("p-3.png", "Invertís una sola vez", "Medición y presupuesto sin cargo",
  "Rehacer el deck cada cinco años es plata tirada. Con el deck de madera plástica invertís una vez y dura más de veinticinco años, sin mantenimiento. Presupuesto sin cargo en Tandil."),
 ("p-1.png", "Deck que no se mantiene", "Presupuesto sin cargo en Tandil",
  "¿Otra primavera lijando y barnizando el deck? El deck de madera plástica no se mantiene nunca: no se astilla, no se pudre, no se pinta. Instalamos en Tandil. Escribinos."),
 ("p-7.png", "Te lo dejamos listo", "Instalación en Tandil",
  "Te instalamos el deck de madera plástica en Tandil: prolijo, rápido y sin que lo mantengas nunca más. Pedí tu presupuesto sin cargo por WhatsApp."),
 ("p-4.png", "No lo toca ni el clima", "Resiste el clima de Tandil",
  "Humedad, sol, heladas y termitas arruinan la madera común en dos inviernos de sierra. El deck de madera plástica ni se inmuta: se ve nuevo por más de veinticinco años."),
 ("p-8.png", "El deck que no mantenés nunca", "Deck · Wall Panel · Perfilería",
  "Deck, wall panel y perfilería de madera plástica en Tandil. Se ve siempre nuevo por más de veinticinco años. Pedí tu presupuesto sin cargo por WhatsApp."),
]

print("▶ 0/3  Subiendo presupuesto del conjunto de videos a USD 13…")
r = api_post(TOKEN, VIDEO_ADSET, daily_budget="1300")
print(f"   ✓ videos adset -> {r}")

print(f"▶ 1/3  Subiendo {len(PLACAS)} imágenes…")
hashes = {}
for fn, *_ in PLACAS:
    path = os.path.join(PLACADIR, fn)
    if not os.path.exists(path):
        raise SystemExit(f"✗ no encuentro {path}")
    out = subprocess.run(["curl", "-s", "-X", "POST", f"{G}/{ACT}/adimages",
                          "-F", f"access_token={TOKEN}", "-F", f"file=@{path}"],
                         capture_output=True, text=True).stdout
    j = json.loads(out)
    if "error" in j:
        die("POST adimages", j)
    img = list(j["images"].values())[0]
    hashes[fn] = img["hash"]
    print(f"   ✓ {fn} -> {img['hash'][:14]}…")

print("▶ 2/3  Creando conjunto Estáticos (Feed, USD 7, EN PAUSA)…")
t = targeting(CFG, [])
t["facebook_positions"] = ["feed"]          # estáticos 4:5 = Feed
t["instagram_positions"] = ["stream"]
adset = api_post(TOKEN, f"{ACT}/adsets", name="Estáticos · Tandil 40km · Feed",
                 campaign_id=CAMP, daily_budget="700", billing_event="IMPRESSIONS",
                 optimization_goal="LINK_CLICKS", bid_strategy="LOWEST_COST_WITHOUT_CAP",
                 targeting=json.dumps(t), status="PAUSED")
print(f"   ✓ adset_id={adset['id']}")

print("▶ 3/3  Creando 5 anuncios estáticos…")
for fn, headline, desc, primary in PLACAS:
    link_data = {"image_hash": hashes[fn], "link": WA_LINK, "message": primary,
                 "name": headline, "description": desc,
                 "call_to_action": {"type": "LEARN_MORE", "value": {"link": WA_LINK}}}
    spec = {"page_id": PAGE, "link_data": link_data}
    if IG:
        spec["instagram_user_id"] = IG
    crea = api_post(TOKEN, f"{ACT}/adcreatives", name=f"WPC estático · {headline}",
                    object_story_spec=json.dumps(spec))
    ad = api_post(TOKEN, f"{ACT}/ads", name=f"Estático · {headline}",
                  adset_id=adset["id"], creative=json.dumps({"creative_id": crea["id"]}),
                  status="PAUSED")
    print(f"   ✓ {headline} (ad_id={ad['id']})")

print("\n✅ LISTO — conjunto Estáticos con 5 placas, EN PAUSA. Videos a USD13 + Estáticos USD7 = USD20/día.")

#!/usr/bin/env python3
"""WPC Tandil — crea la campaña de PROSPECTING Click-to-WhatsApp por la Marketing API.

Estructura: 1 campaña × N conjuntos × M creativos de video = N*M anuncios. TODO EN PAUSA.
Nada se publica hasta que lo aprobás a mano en Ads Manager.

Config obligatoria (lecciones Redacta, ya cableadas):
  · Audience Network OFF (publisher_platforms sin audience_network)
  · Advantage+ audiencia OFF
  · NUNCA optimización por Landing Page Views → acá va CONVERSATIONS
  · Destino WhatsApp (no landing): el lead entra al WhatsApp de Santi

Uso:  python3 create-campaign.py [--dry-run]
"""
import json, os, sys, time, subprocess
from _meta import (load_token, load_cfg, api_get, api_post, die,
                   resolve_interests, targeting, G, HERE)

DRY = "--dry-run" in sys.argv
os.chdir(HERE)
TOKEN = load_token()
CFG = load_cfg()

ACT = CFG["ad_account_id"]
PAGE = CFG["page_id"]
IG = CFG.get("instagram_actor_id", "")
if "PEGAR" in IG:
    IG = ""
WA = CFG["whatsapp_phone_number"]
BUDGET = int(round(float(CFG["daily_budget_usd"]) * 100))  # en centavos de la moneda de la cuenta

print(f"▶ 1/6  Validando cuenta {ACT}…")
acc = api_get(TOKEN, ACT, fields="name,account_status,currency")
if "error" in acc:
    die("GET cuenta", acc)
if acc.get("account_status") != 1:
    sys.exit(f"✗ La cuenta '{acc.get('name')}' no está activa (status={acc.get('account_status')}). Corré check-setup.py.")
print(f"   ✓ {acc['name']} · {acc.get('currency')} · IG={'sí' if IG else 'NO (solo Facebook)'}")
print(f"   ✓ presupuesto {CFG['daily_budget_usd']}/día por conjunto · {CFG['geo']['name']} + {CFG['geo']['radius_km']} km")

print("▶ 2/6  Intereses…")
for a in CFG["adsets"]:
    # IDs verificados a mano en config.json. NO se resuelven por nombre en runtime:
    # buscar "Construction" devolvía "Juguetes" (480M) y "Swimming pool" una película.
    ints = a.get("interests", [])
    a["_interests"] = [{"id": str(i["id"]), "name": i["name"]} for i in ints]
    if a["_interests"]:
        for i in a["_interests"]:
            print(f"   • {a['name']}: {i['name']} ({i['id']})")
    else:
        print(f"   • {a['name']}: sin intereses (audiencia abierta)")

print(f"▶ 3/6  Subiendo {len(CFG['creatives'])} videos…")
changed = False
for c in CFG["creatives"]:
    vp = os.path.abspath(c["video_path"])
    if not os.path.exists(vp):
        sys.exit(f"✗ No encuentro el video: {vp}")
    if c.get("video_id"):
        print(f"   • {os.path.basename(vp)}: reuso video_id={c['video_id']}")
    else:
        if DRY:
            print(f"   • (dry-run) subiría {os.path.basename(vp)}")
            c["video_id"] = "DRYRUN"
            continue
        print(f"   • Subiendo {os.path.basename(vp)}…")
        out = subprocess.run(["curl", "-s", "-X", "POST", f"{G}/{ACT}/advideos",
                              "-F", f"access_token={TOKEN}", "-F", f"source=@{vp}"],
                             capture_output=True, text=True).stdout
        j = json.loads(out)
        if "error" in j:
            die("POST advideos", j)
        c["video_id"] = j["id"]
        changed = True
        print(f"     video_id={c['video_id']}")
    if DRY:
        continue
    for _ in range(60):  # esperar el procesamiento del video
        st = api_get(TOKEN, c["video_id"], fields="status")
        if st.get("status", {}).get("video_status") == "ready":
            break
        time.sleep(6)
    th = api_get(TOKEN, f"{c['video_id']}/thumbnails", fields="uri,is_preferred").get("data", [])
    pref = [t for t in th if t.get("is_preferred")] or th
    c["thumb"] = pref[0]["uri"] if pref else ""
if changed:  # cacheo los video_id en config.json (sin volcar los IDs que vienen del .env)
    disco = json.load(open("config.json"))
    for i, c in enumerate(CFG["creatives"]):
        if c.get("video_id") and c["video_id"] != "DRYRUN":
            disco["creatives"][i]["video_id"] = c["video_id"]
    json.dump(disco, open("config.json", "w"), ensure_ascii=False, indent=2)

if DRY:
    print("\n▶ (dry-run) Targeting que se enviaría por conjunto:")
    for a in CFG["adsets"]:
        print(f"\n--- {a['name']} ---")
        print(json.dumps(targeting(CFG, a["_interests"]), indent=2, ensure_ascii=False))
    print(f"\n✅ dry-run OK — {len(CFG['adsets'])} conjuntos × {len(CFG['creatives'])} creativos "
          f"= {len(CFG['adsets']) * len(CFG['creatives'])} anuncios. No se creó nada.")
    sys.exit(0)

print(f"▶ 4/6  Creando campaña '{CFG['campaign_name']}' (EN PAUSA)…")
camp = api_post(TOKEN, f"{ACT}/campaigns",
                name=CFG["campaign_name"],
                objective=CFG.get("objective", "OUTCOME_ENGAGEMENT"),
                status="PAUSED",
                is_adset_budget_sharing_enabled="false",
                special_ad_categories="[]")
CAMP = camp["id"]
print(f"   ✓ campaign_id={CAMP}")

total = 0
for a in CFG["adsets"]:
    adset = api_post(TOKEN, f"{ACT}/adsets",
                     name=a["name"],
                     campaign_id=CAMP,
                     daily_budget=BUDGET,
                     billing_event="IMPRESSIONS",
                     optimization_goal="CONVERSATIONS",     # NO LANDING_PAGE_VIEWS
                     destination_type="WHATSAPP",
                     promoted_object=json.dumps({"page_id": PAGE, "whatsapp_phone_number": WA}),
                     bid_strategy="LOWEST_COST_WITHOUT_CAP",
                     targeting=json.dumps(targeting(CFG, a["_interests"])),
                     status="PAUSED")
    print(f"▶ 5/6  Conjunto '{a['name']}' (adset_id={adset['id']}) · AN OFF · Adv+ aud OFF · CONVERSATIONS")
    for c in CFG["creatives"]:
        cta = {"type": "WHATSAPP_MESSAGE", "value": {"app_destination": "WHATSAPP"}}
        vd = {"video_id": c["video_id"],
              "message": c["primary_text"],
              "title": c["headline"],
              "link_description": c.get("description", ""),
              "call_to_action": cta}
        if c.get("thumb"):
            vd["image_url"] = c["thumb"]
        spec = {"page_id": PAGE, "video_data": vd, "link": "https://api.whatsapp.com/send"}
        if IG:
            spec["instagram_user_id"] = IG
        crea = api_post(TOKEN, f"{ACT}/adcreatives",
                        name=f"WPC · {c['headline']}",
                        object_story_spec=json.dumps(spec))
        ad = api_post(TOKEN, f"{ACT}/ads",
                      name=f"{a['name']} · {c['headline']}",
                      adset_id=adset["id"],
                      creative=json.dumps({"creative_id": crea["id"]}),
                      status="PAUSED")
        total += 1
        print(f"      ✓ '{c['headline']}' (ad_id={ad['id']})")

print(f"\n▶ 6/6  ✅ LISTO — {len(CFG['adsets'])} conjuntos × {len(CFG['creatives'])} creativos = {total} anuncios, TODO EN PAUSA.")
print(f"   Revisá y publicá: https://adsmanager.facebook.com/adsmanager/manage/campaigns?act={ACT.replace('act_','')}")
print(f"   Campaña: {CFG['campaign_name']} ({CAMP})")

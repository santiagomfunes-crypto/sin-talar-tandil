#!/usr/bin/env python3
"""WPC Tandil — campaña de TRÁFICO cuyo botón abre WhatsApp (link wa.me).

Por qué esta y no la Click-to-WhatsApp nativa: el CTWA nativo exige el número
VINCULADO a la Página, y esa vinculación quedó trabada. Este anuncio es de
tráfico y su botón "Enviar mensaje" abre wa.me/<numero> con un texto ya escrito
→ el lead cae igual en el WhatsApp de Santi, SIN depender de la vinculación.

Mismas lecciones cableadas: Audience Network OFF, Advantage+ audiencia OFF,
optimización por LINK_CLICKS (NUNCA landing_page_views). TODO EN PAUSA.

Uso:  python3 create-campaign-traffic.py [--dry-run]
"""
import json, os, sys, time, subprocess, urllib.parse
from _meta import load_token, load_cfg, api_get, api_post, die, targeting, G, HERE

DRY = "--dry-run" in sys.argv
os.chdir(HERE)
TOKEN = load_token()
CFG = load_cfg()

ACT = CFG["ad_account_id"]
PAGE = CFG["page_id"]
IG = CFG.get("instagram_actor_id", "")
if "PEGAR" in IG:
    IG = ""
WA_NUM = CFG["whatsapp_phone_number"].lstrip("+")     # wa.me quiere sin '+'
WA_TEXT = "Hola! Vengo del anuncio del deck WPC. Quiero pedir un presupuesto en Tandil."
WA_LINK = f"https://wa.me/{WA_NUM}?text=" + urllib.parse.quote(WA_TEXT)
BUDGET = int(round(float(CFG["daily_budget_usd"]) * 100))
CAMP_NAME = "WPC Tandil | Prospecting | Traffic→WhatsApp"

print(f"▶ 1/6  Validando cuenta {ACT}…")
acc = api_get(TOKEN, ACT, fields="name,account_status,currency")
if "error" in acc:
    die("GET cuenta", acc)
if acc.get("account_status") != 1:
    sys.exit(f"✗ La cuenta '{acc.get('name')}' no está activa (status={acc.get('account_status')}).")
print(f"   ✓ {acc['name']} · {acc.get('currency')} · IG={'sí' if IG else 'NO'}")
print(f"   ✓ botón WhatsApp → {WA_LINK}")

print("▶ 2/6  Intereses…")
for a in CFG["adsets"]:
    a["_interests"] = [{"id": str(i["id"]), "name": i["name"]} for i in a.get("interests", [])]
    print(f"   • {a['name']}: {'sin intereses (abierto)' if not a['_interests'] else ', '.join(i['name'] for i in a['_interests'])}")

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
            c["video_id"] = "DRYRUN"; continue
        print(f"   • Subiendo {os.path.basename(vp)}…")
        out = subprocess.run(["curl", "-s", "-X", "POST", f"{G}/{ACT}/advideos",
                              "-F", f"access_token={TOKEN}", "-F", f"source=@{vp}"],
                             capture_output=True, text=True).stdout
        j = json.loads(out)
        if "error" in j:
            die("POST advideos", j)
        c["video_id"] = j["id"]; changed = True
        print(f"     video_id={c['video_id']}")
    if DRY:
        continue
    for _ in range(60):
        st = api_get(TOKEN, c["video_id"], fields="status")
        if st.get("status", {}).get("video_status") == "ready":
            break
        time.sleep(6)
    th = api_get(TOKEN, f"{c['video_id']}/thumbnails", fields="uri,is_preferred").get("data", [])
    pref = [t for t in th if t.get("is_preferred")] or th
    c["thumb"] = pref[0]["uri"] if pref else ""
if changed:
    disco = json.load(open("config.json"))
    for i, c in enumerate(CFG["creatives"]):
        if c.get("video_id") and c["video_id"] != "DRYRUN":
            disco["creatives"][i]["video_id"] = c["video_id"]
    json.dump(disco, open("config.json", "w"), ensure_ascii=False, indent=2)

if DRY:
    print("\n✅ dry-run OK — no se creó nada. Targeting:")
    print(json.dumps(targeting(CFG, CFG["adsets"][0]["_interests"]), indent=2, ensure_ascii=False))
    sys.exit(0)

print(f"▶ 4/6  Creando campaña '{CAMP_NAME}' (EN PAUSA)…")
camp = api_post(TOKEN, f"{ACT}/campaigns",
                name=CAMP_NAME, objective="OUTCOME_TRAFFIC", status="PAUSED",
                is_adset_budget_sharing_enabled="false", special_ad_categories="[]")
CAMP = camp["id"]
print(f"   ✓ campaign_id={CAMP}")

total = 0
for a in CFG["adsets"]:
    adset = api_post(TOKEN, f"{ACT}/adsets",
                     name=a["name"], campaign_id=CAMP, daily_budget=BUDGET,
                     billing_event="IMPRESSIONS",
                     optimization_goal="LINK_CLICKS",     # NO landing_page_views
                     bid_strategy="LOWEST_COST_WITHOUT_CAP",
                     targeting=json.dumps(targeting(CFG, a["_interests"])),
                     status="PAUSED")
    print(f"▶ 5/6  Conjunto '{a['name']}' (adset_id={adset['id']}) · AN OFF · LINK_CLICKS")
    for c in CFG["creatives"]:
        vd = {"video_id": c["video_id"],
              "message": c["primary_text"],
              "title": c["headline"],
              "link_description": c.get("description", ""),
              "call_to_action": {"type": "LEARN_MORE", "value": {"link": WA_LINK}}}
        if c.get("thumb"):
            vd["image_url"] = c["thumb"]
        spec = {"page_id": PAGE, "video_data": vd}
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

print(f"\n▶ 6/6  ✅ LISTO — {total} anuncios de tráfico→WhatsApp, TODO EN PAUSA.")
print(f"   Revisá y publicá: https://adsmanager.facebook.com/adsmanager/manage/campaigns?act={ACT.replace('act_','')}")
print(f"   Campaña: {CAMP_NAME} ({CAMP})")

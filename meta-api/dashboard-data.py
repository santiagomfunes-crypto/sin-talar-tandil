#!/usr/bin/env python3
"""Trae métricas en vivo de la campaña desde Meta Insights y las escribe a
dashboard/data.json (lo lee el dashboard HTML). Correr cada X minutos.
Uso: python3 dashboard-data.py
"""
import json, os, sys
from datetime import datetime, timezone, timedelta
from _meta import load_token, api_get, HERE

TOKEN = load_token()
CAMP = "120251438753090234"
OUT = os.path.abspath(os.path.join(HERE, "..", "dashboard", "data.json"))
os.makedirs(os.path.dirname(OUT), exist_ok=True)

INS = ("spend,impressions,reach,frequency,inline_link_clicks,"
       "cost_per_inline_link_click,ctr,cpm")

def fnum(x, d=0.0):
    try: return float(x)
    except: return d

# formato por conjunto
adsets = api_get(TOKEN, f"{CAMP}/adsets", fields="name,status,effective_status,daily_budget").get("data", [])
fmt_by_adset = {s["id"]: ("static" if "stático" in s["name"] or "Estático" in s["name"] else "video") for s in adsets}

# estado por anuncio
status = {}
adset_of = {}
for s in adsets:
    for a in api_get(TOKEN, f"{s['id']}/ads", fields="name,status,effective_status").get("data", []):
        status[a["id"]] = a.get("effective_status", a.get("status"))
        adset_of[a["id"]] = s["id"]

# insights por anuncio (desde el inicio)
rows = api_get(TOKEN, f"{CAMP}/insights", level="ad", date_preset="maximum",
               fields="ad_id,ad_name," + INS).get("data", [])

ads = []
for r in rows:
    aid = r.get("ad_id")
    ads.append({
        "id": aid,
        "name": r.get("ad_name", ""),
        "format": fmt_by_adset.get(adset_of.get(aid, ""), "video"),
        "status": status.get(aid, "?"),
        "spend": fnum(r.get("spend")),
        "impressions": int(fnum(r.get("impressions"))),
        "reach": int(fnum(r.get("reach"))),
        "frequency": fnum(r.get("frequency")),
        "link_clicks": int(fnum(r.get("inline_link_clicks"))),
        "cpc": fnum(r.get("cost_per_inline_link_click")),
        "ctr": fnum(r.get("ctr")),
        "cpm": fnum(r.get("cpm")),
    })

# los anuncios que aún no gastaron no vienen en insights: agregarlos en cero
seen = {a["id"] for a in ads}
for aid, st in status.items():
    if aid not in seen:
        ads.append({"id": aid, "name": "", "format": fmt_by_adset.get(adset_of.get(aid,""),"video"),
                    "status": st, "spend":0,"impressions":0,"reach":0,"frequency":0,
                    "link_clicks":0,"cpc":0,"ctr":0,"cpm":0})

# nombres para los que vinieron en cero (traer de status map si falta)
name_by_id = {}
for s in adsets:
    for a in api_get(TOKEN, f"{s['id']}/ads", fields="name").get("data", []):
        name_by_id[a["id"]] = a["name"]
for a in ads:
    if not a["name"]:
        a["name"] = name_by_id.get(a["id"], a["id"])

def tot(key): return round(sum(a[key] for a in ads), 2)
totals = {
    "spend": tot("spend"),
    "impressions": int(tot("impressions")),
    "reach": int(tot("reach")),
    "link_clicks": int(tot("link_clicks")),
    "cpc": round(tot("spend")/tot("link_clicks"), 2) if tot("link_clicks") else 0,
    "by_format": {},
}
for f in ("video", "static"):
    fads = [a for a in ads if a["format"] == f]
    sp = round(sum(a["spend"] for a in fads), 2)
    lc = sum(a["link_clicks"] for a in fads)
    totals["by_format"][f] = {"spend": sp, "link_clicks": lc,
                              "cpc": round(sp/lc, 2) if lc else 0,
                              "impressions": sum(a["impressions"] for a in fads)}

now = datetime.now(timezone.utc).astimezone(timezone(timedelta(hours=-3)))  # AR
data = {
    "updated": now.strftime("%Y-%m-%d %H:%M"),
    "campaign": "WPC Tandil · Traffic→WhatsApp",
    "daily_budget": 20,
    "ads": sorted(ads, key=lambda a: (-a["link_clicks"], a["cpc"] or 9e9)),
    "totals": totals,
}
json.dump(data, open(OUT, "w"), ensure_ascii=False, indent=2)
print(f"✓ {OUT} · gasto total ${totals['spend']} · {totals['link_clicks']} clics · {len(ads)} anuncios · {now:%H:%M}")

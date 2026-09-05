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

# Guarda: si el token venció o la campaña no responde, NO sobreescribir data.json
# con ceros — dejar el último snapshot bueno y salir.
_chk = api_get(TOKEN, CAMP, fields="name")
if "error" in _chk:
    sys.exit("✗ token/campaña no responde (¿token vencido?): " +
             str(_chk["error"].get("message", ""))[:90] + " — no toco data.json")
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

# ── Campaña de FORMULARIO (leads los mide Meta directamente) ──
FORMS_CAMP = "120251440759520234"
forms = {"active": False, "spend": 0.0, "impressions": 0, "leads": 0, "cost_per_lead": 0}
fc = api_get(TOKEN, FORMS_CAMP, fields="effective_status")
if "error" not in fc:
    forms["active"] = fc.get("effective_status") == "ACTIVE"
    fi = api_get(TOKEN, f"{FORMS_CAMP}/insights", date_preset="maximum",
                 fields="spend,impressions,actions").get("data", [])
    if fi:
        x = fi[0]
        forms["spend"] = fnum(x.get("spend"))
        forms["impressions"] = int(fnum(x.get("impressions")))
        lead = 0
        for a in x.get("actions", []):
            if "lead" in a.get("action_type", ""):
                lead = max(lead, int(fnum(a.get("value"))))
        forms["leads"] = lead
        forms["cost_per_lead"] = round(forms["spend"] / lead, 2) if lead else 0
    # traer los leads reales (nombre + teléfono) del formulario
    FORM_ID = "1798619054495337"
    lead_list = []
    by_ad = {}
    lr = api_get(TOKEN, f"{FORM_ID}/leads", fields="created_time,ad_id,field_data")
    for L in lr.get("data", []):
        fd = {f.get("name"): (f.get("values") or [""])[0] for f in L.get("field_data", [])}
        lead_list.append({"name": fd.get("full_name", ""), "phone": fd.get("phone_number", ""),
                          "date": (L.get("created_time", "") or "")[:10]})
        if L.get("ad_id"):
            by_ad[L["ad_id"]] = by_ad.get(L["ad_id"], 0) + 1
    forms["leads_list"] = lead_list
    # Insights AGREGA con retraso (horas): el endpoint /leads es el que manda para
    # contar. Si la lista tiene mas que insights, gana la lista.
    if len(lead_list) > forms["leads"]:
        forms["leads"] = len(lead_list)
        forms["cost_per_lead"] = round(forms["spend"] / len(lead_list), 2) if lead_list else 0
    # rendimiento por anuncio del Formulario (qué ángulo trae leads)
    frows = api_get(TOKEN, f"{FORMS_CAMP}/insights", level="ad", date_preset="maximum",
                    fields="ad_id,ad_name,spend,impressions,actions").get("data", [])
    fads = []
    for r in frows:
        lead = 0
        for a in r.get("actions", []):
            if "lead" in a.get("action_type", ""):
                lead = max(lead, int(fnum(a.get("value"))))
        lead = max(lead, by_ad.get(r.get("ad_id"), 0))   # mismo criterio: gana la lista real
        sp = fnum(r.get("spend"))
        fads.append({"name": r.get("ad_name", "").replace("Form · ", ""),
                     "spend": sp, "impressions": int(fnum(r.get("impressions"))),
                     "leads": lead, "cost_per_lead": round(sp / lead, 2) if lead else 0})
    forms["ads"] = sorted(fads, key=lambda a: (-a["leads"], a["cost_per_lead"] or 9e9))
forms["budget"] = 20


# ---- Presupuestos armados en la web (tabla wpc_cotizaciones de Supabase) ----
# Se guarda uno por cada presupuesto que alguien arma en el cotizador, lo mande
# o no por WhatsApp. La fila más reciente de cada sesión es la foto final.
cotiz = {"total": 0, "enviados": 0, "abandonados": 0, "con_telefono": 0, "lista": []}
try:
    import urllib.request
    _env = {}
    for _l in open(os.path.join(HERE, ".env.meta")):
        if "=" in _l and not _l.strip().startswith("#"):
            _k, _v = _l.strip().split("=", 1); _env[_k] = _v
    SB_URL, SB_KEY = _env.get("SUPABASE_URL"), _env.get("SUPABASE_SERVICE_KEY")
    if SB_URL and SB_KEY:
        q = (SB_URL + "/rest/v1/wpc_cotizaciones?select=creado_en,sesion,items,total_ars,"
             "nombre,telefono,zona,nota,enviado,paso_max,paso_label,segundos,calculos,calculo_suelto"
             "&order=creado_en.desc&limit=400")
        rq = urllib.request.Request(q, headers={"apikey": SB_KEY, "Authorization": "Bearer " + SB_KEY})
        filas = json.load(urllib.request.urlopen(rq, timeout=20))
        vistas, unicas = set(), []
        for f in filas:                      # ya vienen de la más nueva a la más vieja
            if f["sesion"] in vistas: continue
            vistas.add(f["sesion"]); unicas.append(f)
        for f in unicas:
            f["m2"] = None
            for it in (f.get("items") or []):
                d = (it.get("detalle") or "")
                if "m² netos" in d:
                    try: f["m2"] = float(d.split(" m² netos")[0].strip().split()[-1])
                    except Exception: pass
                    break
            f["productos"] = ", ".join(sorted({(i.get("prod") or "") for i in (f.get("items") or [])}))
            # el que calculó y se fue sin agregar: mostramos lo que llegó a ver
            cs = f.get("calculo_suelto")
            if not f.get("items") and cs:
                f["productos"] = cs.get("prod") or "—"
                f["m2"] = cs.get("m2")
                f["total_ars"] = cs.get("ars") or 0
                f["solo_miro"] = True
        # embudo: en qué paso se quedó cada visita.
        # La base son los que llegaron a ver un precio — antes de eso no se guarda fila.
        PASOS = ["Abrió el catálogo","Llegó al cotizador","Cargó una medida","Vio el total",
                 "Agregó al presupuesto","Llegó al resumen","Completó sus datos","Mandó por WhatsApp"]
        n = len(unicas)
        embudo = []
        for i in range(3, len(PASOS)):
            llegaron = sum(1 for f in unicas if (f.get("paso_max") or 0) >= i)
            quedaron = sum(1 for f in unicas if (f.get("paso_max") or 0) == i)
            embudo.append({"paso": i, "nombre": PASOS[i], "llegaron": llegaron,
                           "se_quedaron_aca": quedaron,
                           "pct": round(llegaron * 100 / n) if n else 0})
        cotiz["embudo"] = embudo
        # el escalón donde más gente se cae (sin contar a los que sí mandaron)
        perdidos = [e for e in embudo if e["paso"] < len(PASOS) - 1]
        peor = max(perdidos, key=lambda e: e["se_quedaron_aca"]) if perdidos else None
        cotiz["caida"] = peor if (peor and peor["se_quedaron_aca"]) else None
        cotiz["lista"] = unicas[:60]
        cotiz["total"] = len(unicas)
        cotiz["enviados"] = sum(1 for f in unicas if f.get("enviado"))
        cotiz["abandonados"] = sum(1 for f in unicas if not f.get("enviado"))
        cotiz["con_telefono"] = sum(1 for f in unicas if not f.get("enviado") and f.get("telefono"))
except Exception as e:
    print("  (presupuestos web: no se pudieron traer —", str(e)[:70], ")")

now = datetime.now(timezone.utc).astimezone(timezone(timedelta(hours=-3)))  # AR
data = {
    "updated": now.strftime("%Y-%m-%d %H:%M"),
    "campaign": "WPC Tandil · Traffic→WhatsApp",
    "daily_budget": 10,
    "ads": sorted(ads, key=lambda a: (-a["link_clicks"], a["cpc"] or 9e9)),
    "totals": totals,
    "forms": forms,
    "cotizaciones": cotiz,
}
json.dump(data, open(OUT, "w"), ensure_ascii=False, indent=2)
print(f"✓ {OUT} · gasto ${totals['spend']} · {totals['link_clicks']} clics · {len(ads)} anuncios · "
      f"{cotiz['total']} presupuestos web ({cotiz['abandonados']} sin enviar, {cotiz['con_telefono']} con teléfono) · {now:%H:%M}")

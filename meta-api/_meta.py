#!/usr/bin/env python3
"""Utilidades compartidas para los scripts de Meta de WPC Tandil."""
import json, os, sys, urllib.request, urllib.parse, urllib.error

GV = "v21.0"
G = f"https://graph.facebook.com/{GV}"
HERE = os.path.dirname(os.path.abspath(__file__))


def load_env():
    """Lee .env.meta (fuera de git): token + IDs de Meta."""
    p = os.path.join(HERE, ".env.meta")
    if not os.path.exists(p):
        sys.exit("✗ Falta .env.meta — copiá .env.meta.example y completalo. Ver README.")
    env = {}
    for line in open(p):
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    faltan = [k for k in ("META_ADS_TOKEN", "META_AD_ACCOUNT_ID", "META_PAGE_ID")
              if not env.get(k) or env[k] == "act_"]
    if faltan:
        sys.exit(f"✗ Falta completar en .env.meta: {', '.join(faltan)}")
    if not env["META_AD_ACCOUNT_ID"].startswith("act_"):
        env["META_AD_ACCOUNT_ID"] = "act_" + env["META_AD_ACCOUNT_ID"]
    return env


def load_token():
    return load_env()["META_ADS_TOKEN"]


def load_cfg():
    """config.json trae solo copy, presupuesto y targeting (va a git). Los IDs vienen del .env."""
    cfg = json.load(open(os.path.join(HERE, "config.json")))
    env = load_env()
    cfg["ad_account_id"] = env["META_AD_ACCOUNT_ID"]
    cfg["page_id"] = env["META_PAGE_ID"]
    cfg["instagram_actor_id"] = env.get("META_IG_USER_ID", "")
    cfg["pixel_id"] = env.get("META_PIXEL_ID", "")
    return cfg


def die(where, obj):
    print(f"✗ Error de Meta en {where}:")
    print(json.dumps(obj, indent=2, ensure_ascii=False))
    sys.exit(1)


def api_get(token, path, **params):
    params["access_token"] = token
    url = f"{G}/{path}?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        return json.load(e)


def api_post(token, path, **params):
    params["access_token"] = token
    data = urllib.parse.urlencode(params).encode()
    try:
        with urllib.request.urlopen(urllib.request.Request(f"{G}/{path}", data=data)) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        die(f"POST {path}", json.load(e))


def resolve_interests(token, nombres):
    """Nombre legible -> id de interés de Meta (targeting search)."""
    out = []
    for n in nombres:
        r = api_get(token, "search", type="adinterest", q=n, limit=5)
        data = r.get("data", [])
        if not data:
            print(f"   ⚠ interés no encontrado, lo salteo: {n}")
            continue
        best = data[0]
        out.append({"id": best["id"], "name": best["name"]})
        print(f"   • {n} -> {best['name']} ({best['id']}, audiencia {best.get('audience_size_lower_bound','?')}+)")
    return out


def targeting(cfg, interests):
    """Targeting común: radio alrededor de Tandil, Audience Network OFF, Advantage+ audiencia OFF."""
    geo = cfg["geo"]
    t = {
        "geo_locations": {
            "custom_locations": [{
                "latitude": geo["latitude"],
                "longitude": geo["longitude"],
                "radius": geo["radius_km"],
                "distance_unit": "kilometer",
            }],
            "location_types": ["home", "recent"],
        },
        "age_min": cfg["age_min"],
        "age_max": cfg["age_max"],
        # Audience Network y Messenger EXCLUIDOS a propósito (lección Redacta:
        # AN quema presupuesto en inventario basura).
        "publisher_platforms": ["facebook", "instagram"],
        "facebook_positions": ["feed", "facebook_reels", "story"],
        "instagram_positions": ["stream", "reels", "story"],
        "device_platforms": ["mobile"],
        "targeting_automation": {"advantage_audience": 0},
    }
    if interests:
        t["flexible_spec"] = [{"interests": interests}]
    return t

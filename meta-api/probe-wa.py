import json, urllib.parse as up, urllib.request as ur, urllib.error as ue, sys
from _meta import load_token, load_cfg, api_post, targeting, G
TOKEN = load_token(); CFG = load_cfg()
ACT = CFG["ad_account_id"]; PAGE = CFG["page_id"]; WA = CFG["whatsapp_phone_number"]
camp = api_post(TOKEN, f"{ACT}/campaigns", name="ZZZ probe wa", objective="OUTCOME_ENGAGEMENT",
                status="PAUSED", is_adset_budget_sharing_enabled="false", special_ad_categories="[]")
CID = camp["id"]
try:
    params = {"name":"ZZZ probe","campaign_id":CID,"daily_budget":"1300","billing_event":"IMPRESSIONS",
        "optimization_goal":"CONVERSATIONS","destination_type":"WHATSAPP",
        "promoted_object":json.dumps({"page_id":PAGE,"whatsapp_phone_number":WA}),
        "bid_strategy":"LOWEST_COST_WITHOUT_CAP","targeting":json.dumps(targeting(CFG, [])),
        "status":"PAUSED","execution_options":json.dumps(["validate_only"]),"access_token":TOKEN}
    try:
        ur.urlopen(ur.Request(f"{G}/{ACT}/adsets", data=up.urlencode(params).encode()))
        print("LINKED_OK"); sys.exit(0)
    except ue.HTTPError as e:
        err = json.load(e).get("error", {})
        print("STILL_FAILING:", (err.get("error_user_msg") or err.get("message",""))[:90]); sys.exit(1)
finally:
    api_post(TOKEN, CID, status="DELETED")

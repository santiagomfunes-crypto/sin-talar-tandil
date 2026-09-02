# WPC Tandil — Meta por API

Crea la campaña de **Click-to-WhatsApp** sin tocar Ads Manager. Todo se crea **EN PAUSA**:
nada sale al aire hasta que Santi lo aprueba a mano.

## Qué necesita Santi (una sola vez)

| Dato | Dónde sale |
|---|---|
| **Token** | **Camino corto (el que usamos):** [Graph API Explorer](https://developers.facebook.com/tools/explorer) → Meta App `wpc tandil ads` → permisos `ads_management`, `ads_read`, `business_management`, `pages_show_list`, `pages_read_engagement`, `instagram_basic` → Generate Access Token. Dura 1-2 h, alcanza para crear la campaña. **Camino durable:** usuario del sistema con vencimiento "Nunca" — solo hace falta si después querés un dashboard de métricas corriendo solo. |
| **Ad account ID**, **Page ID**, **Instagram user ID**, **Pixel ID** | No hace falta buscarlos: con el token pegado, `python3 descubrir-ids.py` los saca solo. (El Pixel ID va además en `index.html`.) |
| **WhatsApp conectado a la Página** | Meta Business Suite → Configuración → WhatsApp → Conectar `+54 9 2494 20-9464` |

## Pasos

```bash
cd ~/Desktop/sin-talar-tandil/meta-api
cp .env.meta.example .env.meta   # y pegar SOLO el token adentro

python3 descubrir-ids.py            # con el token solo: descubre cuenta, página, IG y pixel
                                    # y te imprime las líneas listas para pegar en .env.meta
python3 check-setup.py              # NO crea nada: valida token, cuenta, página, IG, WhatsApp y pixel
python3 create-campaign.py --dry-run  # muestra el targeting exacto que se enviaría
python3 create-campaign.py          # crea 2 conjuntos × 3 creativos = 6 anuncios, TODO EN PAUSA
```

> El repo es **público** (GitHub Pages). Por eso los IDs y el token viven en `.env.meta`
> (fuera de git) y `config.json` solo lleva copy, presupuesto y targeting.

## Estructura que crea

- **Campaña 1 — Prospecting** · objetivo `OUTCOME_ENGAGEMENT`, destino **WhatsApp**.
  - Conjunto **A · Abierto** — Tandil + 40 km, 30-60 años, sin intereses.
  - Conjunto **B · Intereses** — mismo geo + mejoras del hogar, jardín, pileta, construcción, interiorismo.
  - 3 creativos de video (los de `remotion/out/wpc-*.mp4`) en cada conjunto.
- Presupuesto: `daily_budget_usd` **por conjunto** (13 → USD 26/día en total). Bajalo a 6-7 si querés arrancar en ~13/día.

## Config que ya viene cableada (lecciones de la pauta de Redacta)

- **Audience Network OFF** — `publisher_platforms` solo `facebook` + `instagram`.
- **Advantage+ audiencia OFF** — `targeting_automation.advantage_audience = 0`.
- **NUNCA `LANDING_PAGE_VIEWS`** — optimización por `CONVERSATIONS`.
- Ubicaciones: Feed, Reels y Stories de IG y FB. Solo mobile.
- Todo `PAUSED` en la creación.

## Atribución — dónde está la verdad

El destino es WhatsApp, así que **no hay UTMs**. El ground-truth de leads es el
**inbox de WhatsApp de Santi**, no un dashboard: el webview de Meta rompe el tracking JS
y subcuenta. Para saber qué creativo trae conversaciones, mirar en Ads Manager la
métrica **"conversaciones de mensajes iniciadas" por anuncio** — ese sí es dato de Meta,
no de un pixel del navegador.

El Pixel de la landing (`index.html`) cumple otro rol: **armar el pool de retargeting**
(visitantes) para la Campaña 2, y medir `Contact` cuando alguien clickea WhatsApp desde el sitio.

## Campaña 2 — Retargeting (recién cuando haya pool)

No está scripteada todavía a propósito: necesita audiencias personalizadas que hoy están
vacías (visitantes del pixel, video-viewers 25%+, engagers de IG/FB). Se arma cuando el
prospecting haya corrido 2 semanas. Reparto: semana 1-2 = 100% prospecting; semana 3+ = 70/30.

# WPC Tandil — STATE

> Decisiones e instrucciones vivas del proyecto. Si una pestaña de Claude se envenena, esto sobrevive.
> Última actualización: **2 sep 2026**.

## Marca

- La marca de Santi es **WPC Tandil**. **NUNCA "Sin Talar"** — ese es el *fabricante*.
  (El repo se llama `sin-talar-tandil` por historia; no cambia la marca.)
- Identidad: **verde bosque `#2f5133`** + crema `#f4f1e6`. Tipos: Cormorant Garamond (titulares) + Inter.
- Logo: `img/logo-wpc-green.png` / `-cream.png`. Ojo: los originales venían con **alpha máximo 179**
  (translúcidos). La versión sólida normalizada está en `remotion/public/logo-wpc-*.png`.
- Handles: IG y FB **@wpc.tandil**. WhatsApp **+54 9 2494 20-9464**.

## Landing

- `index.html` → GitHub Pages: **https://santiagomfunes-crypto.github.io/sin-talar-tandil/**
- Deploy = `git push origin main`. `gh` está en `~/.local/bin/gh`, autenticado como `santiagomfunes-crypto`.
- **Meta Pixel ya instalado pero apagado**: en el `<head>` hay `var META_PIXEL_ID = ''`.
  Poné el ID ahí y pusheá → arranca a cargar. Con el ID vacío no hace ningún request.
- Evento **`Contact`** ya cableado en todos los clics a WhatsApp (botones + burbuja flotante).
- Pendiente: la landing todavía usa fotos generadas (`img/life-*.jpg`) teniendo fotos **reales**
  del fabricante en `img/reales/*-web.jpg`. Vale la pena reemplazarlas.

## Videos (Remotion — gratis, reemplaza a Higgsfield para piezas de marca)

- Proyecto: `remotion/`. Componente único: `src/ClipAd.tsx`. Config: `src/clips.ts`.
- **Para sumar un clip de Flow**: copiar el mp4 a `remotion/public/` + agregar una entrada en
  `src/clips.ts` (id, src, kicker, headline). No hay que tocar nada más.
  Render: `cd remotion && npx remotion render wpc-N out/wpc-N.mp4`
- Specs: 1080×1920, **24 fps** (los clips de Veo vienen a 24 — el timeline a 30 metía judder),
  8s de clip + 3s de placa final = 11s. **Se mantiene el audio del clip** (la VO de Flow),
  con fade-out en los últimos 0.6s.
- Las composiciones viejas (`Ad1`/`Ad2`/`Reel`/`Explainer`) usan la marca vieja "Sin Talar" y están
  **des-registradas a propósito** en `Root.tsx`. Los archivos siguen en disco.
- **Zonas seguras de Reels** (constantes `SAFE_TOP=250` / `SAFE_BOTTOM=480` en `ClipAd.tsx`):
  la UI de IG/FB tapa ~180px arriba y ~420px abajo. En la primera versión el titular entero
  caía debajo de la UI. Si cambiás el layout, respetá esas constantes.
- **El titular tiene `maxWidth: 800`** a propósito: sin tope, una línea larga llega a x~905 y se
  mete en el rail de botones de Reels (x~900-1050). Con el tope quedan 58px de aire.
- **El degradado del caption NO puede ser un `AbsoluteFill`**: con `inset:0` se resuelve contra el
  padding-box del padre y termina oscureciendo el frame entero (medido: 24% de oscurecimiento en
  el centro exacto — el deck se veía embarrado justo donde tiene que lucir). Va como div de altura
  fija anclado abajo, con sus stops en coordenadas propias.
- **Los PNG del logo vienen del export con TODO el trazo a alpha ~143** (translúcido) y solo
  15 píxeles llegan a 179 — normalizar por el máximo deja el cuerpo al 80%. Los de
  `remotion/public/` se regeneran con **`cd remotion && python3 regen-logos.py`** (knee en 143
  + relleno RGB del color de marca exacto). **No copiar `img/logo-wpc-*.png` crudo a `public/`.**
- ⚠ Los 3 clips en `clips/` son del **playbook viejo** (25/ago). La tanda nueva con voz en off
  (`GUIONES-FLOW.md`, 8 guiones) todavía no está generada en Flow.

## Meta / pauta

- Módulo por API en `meta-api/` (ver su README). Todo se crea **EN PAUSA**.
- **Objetivo = Click-to-WhatsApp** (`OUTCOME_ENGAGEMENT` + `destination_type: WHATSAPP` +
  `optimization_goal: CONVERSATIONS`). NO lead forms, NO landing como destino.
- Cableado por lección de Redacta: **Audience Network OFF**, **Advantage+ audiencia OFF**,
  **nunca optimizar por Landing Page Views**.
- Geo: **Tandil + 40 km** (custom location por lat/lon, no por ciudad). Edad 30-60. Solo mobile.
- Presupuesto: `daily_budget_usd` es **por conjunto**. Con 2 conjuntos a 13 → USD 26/día.
- **El repo es público**: token e IDs van en `meta-api/.env.meta` (gitignored). `config.json`
  solo lleva copy, presupuesto y targeting.
- **Ground-truth de leads = el WhatsApp de Santi**, no un dashboard. El webview de Meta rompe el
  tracking JS y subcuenta ~4x. Para atribuir por creativo: métrica nativa
  "conversaciones de mensajes iniciadas" por anuncio en Ads Manager.

## Lo que falta de Santi

1. **Pixel ID** → `index.html` + `meta-api/.env.meta`.
2. **Token de system user** (ads_management, business_management, pages_show_list, pages_read_engagement).
3. **Ad account ID**, **Page ID**, **IG user ID**.
4. **WhatsApp conectado a la Página** en Meta Business Suite (sin esto no hay Click-to-WhatsApp).
5. Generar en Flow la tanda nueva de `GUIONES-FLOW.md` y bajar los mp4 a `clips/`.

Con (1)-(4): `cd meta-api && python3 check-setup.py` valida todo sin gastar un peso.

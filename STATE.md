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
- Presupuesto: `daily_budget_usd` es **por conjunto**. Hoy hay **un solo conjunto, abierto, USD 13/día**.
- **Por qué un solo conjunto:** medido con `delivery_estimate`, Tandil + 40 km (30-60, mobile, FB+IG)
  tiene **90.100-106.000 personas/mes** abierto y **57.600-67.700** con los 7 intereses. El filtro
  saca apenas un tercio de un pozo ya chico; partir el presupuesto en dos conjuntos que se pisan
  frena el aprendizaje de Meta. Los intereses verificados quedaron en `config.json` bajo
  `adsets_guardados_para_despues`.
- **Los intereses NO se resuelven por nombre en runtime.** Buscar "Construction" devolvía
  *Juguetes* (480M personas) y "Swimming pool" una *película*. Los IDs están verificados a mano
  contra la API en español y viven en `config.json`.
- **El repo es público**: token e IDs van en `meta-api/.env.meta` (gitignored). `config.json`
  solo lleva copy, presupuesto y targeting.
- **Ground-truth de leads = el WhatsApp de Santi**, no un dashboard. El webview de Meta rompe el
  tracking JS y subcuenta ~4x. Para atribuir por creativo: métrica nativa
  "conversaciones de mensajes iniciadas" por anuncio en Ads Manager.

## Lo que falta de Santi

1. ~~Pixel ID~~ **HECHO** — `1063781786398885`, creado por API en `act_859031260510247` y ya vivo
   en la landing. (No confundir con el de Redacta ni con el de Real Estate.)
2. ~~Token~~ **HECHO** (Explorer, dura 1-2 h — si venció, se regenera igual).
3. ~~Ad account / Page / IG~~ **HECHO**: `act_859031260510247` · `1327636333759585` · `17841435576809277`.
4. **WhatsApp conectado a la Página de WPC Tandil** — ÚNICO BLOQUEANTE. Sin esto Meta rechaza el
   destino Click-to-WhatsApp. Se hace a mano en Business Suite; no hay API.
   ⚠ Ojo: si `+54 9 2494 20-9464` sigue registrado en la WhatsApp Business Platform (Wati),
   no se puede conectar como número de app común. Verificar antes.
5. Generar en Flow la tanda nueva de `GUIONES-FLOW.md` y bajar los mp4 a `clips/`.

`cd meta-api && python3 check-setup.py` valida los seis requisitos sin gastar un peso.
Hoy da 5 de 6 en verde; el que falta es el WhatsApp.

---
## Progreso 2-sep (sesión creativos/Flow)
- **Template video ClipAd FUNCIONA (8/10, publicable).** Fixes aplicados hoy: SAFE_BOTTOM=560 (caption más arriba, zona segura Reels), EndCard translateY -30 (placa centrada, no top-heavy), contacto WhatsApp/@ en CREAM (antes verde bajo contraste), caption fade-in antes (fps*0.4). Sumar clip = mp4 a remotion/public/ + entrada en clips.ts con `seconds` = duración REAL del clip (el #1 de Flow salió 10s, no 8).
- **REGLA VO CLAVE:** el clip de Flow tiene que generarse con la línea `Voz en off en español argentino ... dice: "..."` o sale MUDO. La VO nativa de Veo le gustó a Santi (mejor que macOS/ElevenLabs). El montaje conserva el audio del clip con fade-out.
- **Estado clips:** clip-1 (galería/hartazgo) se generó SIN voz (mudo, -49dB) → Santi lo REGENERA con la versión con VO. clip-3 generado. clip-2 (antes/después) NO se puede con Frames-to-Video (no aparece la opción en su Flow) → usar prompt text-to-video (guardado en GUIONES-FLOW.md). Faltan 2,4,5,6,7,8. Hay un "Deck_installation_at_sunrise" (18:00) en Downloads = candidato a clip-7 (obra).
- **Anuncio wpc-1 v2** renderizado en remotion/out/ (diseño aprobado, pero mudo hasta que llegue el clip con VO → re-montar).
- Flow dio error una vez al generar; se destrabó. Config Flow: Veo 3.1 Fast, "por 2", confirmar siempre, directriz del agente cargada, ingredientes real-svg + real-beta.

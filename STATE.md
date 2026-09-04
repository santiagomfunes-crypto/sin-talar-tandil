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

## 2 sep 2026 (noche) — Tanda 2 de videos montada (8 anuncios)
- Santi generó en Flow (Veo 3.1, voz "Locutor WPC", ingrediente real-svg) 8 clips → `~/Downloads/*_202609021955.mp4` + gallery_1936.
- QA por subagentes (frames, no en hilo principal): color caramelo/teca consistente, todos con VO. Calidades: wpc-3(rooftop)=9/10 el mejor; wpc-1/4/6(clip-7 obra)/8=8; wpc-5(mate)=7 (riesgo manos/caras, pasa rápido); wpc-6(reposeras)=7; wpc-2(antes/después)=6 (tabla nueva algo anaranjada/plástica).
- Mapeo clip→anuncio en `remotion/src/clips.ts` (8 entradas, seconds 8/10 según duración real). Fuentes copiadas a `remotion/public/clip-1..8.mp4`.
- Render Remotion (placa verde + CTA WhatsApp) → `remotion/out/wpc-1..8.mp4` → `~/Downloads/wpc-anuncio-1..8.mp4`.
- APRENDIZAJE Flow: usar **Veo 3.1** (no Omni — Omni es video-a-video/edición, generaba raro). Prompts largos-pero-cinematográficos (1 escena, 1 movimiento de cámara), no checklist de negativos. Pileta = elemento que sale peor (agua). Voz se ancla en Flow → Voces ("Locutor WPC" argentino rioplatense).
- HERRAMIENTA nueva a probar: **Pomelli** (labs.google/pomelli) para las placas estáticas IG/FB desde Business DNA de la landing.

## 2 sep 2026 (noche) — Lanzamiento pauta: 1 candado
- .env.meta con token FRESCO + IDs OK. Validado con check-setup.py:
  ✓ token (Santi Funes, ads_management+business_management) · ✓ cuenta act_859031260510247 ACTIVA USD
  ✓ Página WPC Tandil (id 1327636333759585) · ✓ IG @wpc.tandil · ✓ Pixel 1063781786398885 (firmando eventos)
- ⚠️ Los tokens del Graph Explorer duran ~1-2h. Si al lanzar está vencido, regenerar en developers.facebook.com/tools/explorer (app "wpc tandil ads").
- WhatsApp de los anuncios CONFIRMADO por Santi: **+5492494209464** (el de la landing). config.json ya corregido (antes tenía +5492494557754).
- Pixel YA cableado en index.html (META_PIXEL_ID=1063781786398885) y activo.
- 🚧 ÚNICO BLOQUEO: WhatsApp NO conectado a la Página → Meta rebota CTWA ("phone number is not linked"). Santi debe: facebook.com/1327636333759585/settings → WhatsApp → Conectar número +5492494209464 (código por WA). Solo lo puede hacer él.
- Al destrabar: crear campaña EN PAUSA con 4 videos (wpc-3/1/7/4; wpc-2 descartado x calidad 6/10), Tandil 40km, 30-60, USD13/día. Config solo tiene 3 creativos (wpc-1,2,3) → actualizar creatives a los 4 y escribir primary_text de wpc-7 y wpc-4 antes de crear.

## 2 sep 2026 (noche) — Campaña LISTA, falta 1 candado (WhatsApp→Página)
- config.json ya con 4 creativos: wpc-3 (Invertís una sola vez), wpc-1 (Deck que no se mantiene), wpc-7 (Te lo dejamos listo), wpc-4 (No lo toca ni el clima). primary_text escrito para los 4. wpc-2 descartado.
- check-setup.py: TODO ✓ (token, cuenta ACTIVA USD, Página, IG, Pixel firmando) SALVO WhatsApp.
- create-campaign.py --dry-run: ✅ 1 conjunto × 4 = 4 anuncios. Targeting OK (Tandil 40km, 30-60, FB+IG feed/reels/story, mobile, AN off, Adv+ aud off, CONVERSATIONS).
- 🚧 BLOQUEO ÚNICO: número +5492494209464 NO conectado a la Página (está como WhatsApp Business Platform/API en el portfolio, aprobado, calidad Alta — Santi dice que es su WhatsApp del cel). Meta exige conexión a la Página con CÓDIGO al celular → NO automatizable, lo tiene que hacer Santi.
- Camino elegido: Ads Manager → +Crear → Interacción → adset → "Ubicación de conversión = WhatsApp" → Conectar número → código. (Los links directos a settings de Página rebotaban al portfolio.)
- Al recibir "listo": correr `python3 create-campaign.py` (sube 4 videos, crea campaña+adset+4 ads EN PAUSA). Nada se publica hasta que Santi le da Publicar en Ads Manager.

## 4 sep 2026 — Pivote a TRÁFICO→WhatsApp (CTWA nativo trabado)
- CTWA nativo (destino WhatsApp) sigue dando "phone number is not linked" pese a que Santi conectó el número desde la Página. Probé 5 formatos del número + espera de 5 min → todos fallan. Es número WhatsApp Business Platform (API) en el portfolio; la vinculación a la Página para ads no engancha.
- DECISIÓN (Santi): lanzar con TRÁFICO cuyo botón abre wa.me. Nuevo script `meta-api/create-campaign-traffic.py`: OUTCOME_TRAFFIC, optimization LINK_CLICKS, CTA LEARN_MORE → wa.me/5492494209464?text=... (NO usa promoted_object/CTWA, así evita el candado). AN OFF, Adv+ aud OFF, mobile, Tandil 40km, 30-60, USD13/día, 4 videos (wpc-3,1,7,4), EN PAUSA.
- Corrida real: subió los 4 videos OK (video_ids cacheados en config.json), creó campaña+adset, FRENÓ en adcreatives con: "la app está en modo Desarrollo, debe estar en modo Público/Live". Campaña parcial borrada.
- 🚧 BLOQUEO ACTUAL: app "wpc tandil ads" en developers.facebook.com está en modo Development → Santi debe pasarla a LIVE (puede pedir URL de política de privacidad + categoría en Settings→Basic).
- Número: la landing (index.html) usa el VIEJO 5492494557754; el confirmado/vivo es 5492494209464. PENDIENTE: corregir la landing a 209464.
- Al pasar la app a Live: re-correr `python3 create-campaign-traffic.py` (no re-sube videos). Nada se publica hasta que Santi le dé Publicar.

## 4 sep 2026 — ✅ CAMPAÑA CREADA (en pausa)
- App "wpc tandil ads" pasada a LIVE (Santi) con política de privacidad en santiagomfunes-crypto.github.io/sin-talar-tandil/privacidad.html (privacidad.html deployado a GH Pages).
- `create-campaign-traffic.py` corrió OK: campaign_id=120251438666930234 "WPC Tandil | Prospecting | Traffic→WhatsApp", 1 adset (Tandil 40km abierto), 4 ads EN PAUSA. video_ids cacheados en config.json (wpc-3/1/7/4).
- Botón → wa.me/5492494209464 con texto pre-escrito. Optimización LINK_CLICKS, AN OFF, Adv+ aud OFF, mobile, 30-60, USD13/día.
- PENDIENTE: (1) Santi revisa vista previa + pasa switch a ON en Ads Manager (o pedir "prendela" y activar por API con status ACTIVE en campaign/adset/ads). (2) Corregir número en index.html (557754 → 5492494209464). (3) Ground-truth leads por WhatsApp. (4) Cuando se destrabe el WhatsApp nativo, migrar a CTWA real (create-campaign.py).

## 4 sep 2026 — Plan de pauta ACORDADO con Santi (verificado antes de activar)
- Decisión Santi: SOLO WhatsApp primero (Formulario = fase 2), 8 ángulos, USD 10/día.
- Campaña activa a crear/usar: id=120251438753090234 "WPC Tandil | Prospecting | Traffic→WhatsApp", 8 ads, adset 120251438753460234 a daily_budget=1000 (USD10). config.json daily_budget_usd=10.
- Audiencia: Tandil +40km, 30-60, ABIERTA (sin lookalike ni intereses; fase 2 = lookalike + retargeting cuando haya datos). AN OFF, Adv+ aud OFF, mobile. Ubicaciones Feed+Reels+Stories FB/IG (reels/carretes ya incluidos, videos 9:16).
- Optimización LINK_CLICKS. Todo EN PAUSA hasta que Santi pase switch a ON (o pida "prendela" → activar por API).
- Fase 2: campaña B Formulario (create-campaign-forms.py, sin construir aún) + lookalike/retargeting. Revisar a día 4-7, cortar ángulos flojos.
- Métrica de verdad = WhatsApp reales al 209464 (Meta subcuenta por webview).

## 4 sep 2026 — Campaña final: Videos + Estáticos (en pausa)
- Campaña 120251438753090234 "WPC Tandil | Prospecting | Traffic→WhatsApp" con 2 conjuntos:
  · Videos (adset 120251438753460234): 8 ads, Feed+Reels+Stories, $13/día.
  · Estáticos (adset 120251438887500234): 5 placas (p-3,1,7,4,8) link_data→wa.me, Feed, $7/día.
  · TOTAL $20/día. TODO EN PAUSA.
- 8 placas estáticas generadas en placas/p-1..8.png (Chrome headless + placa.html). Usadas las 5 fuertes.
- Scripts: create-campaign-traffic.py (videos) + add-statics.py (estáticos). Verificado por API: imagen+copy+botón OK en los 5 estáticos.
- "carrete" para Santi = imagen estática linda (no Reel). Reels/Stories los cubren los videos 9:16.
- Falta: Santi pasa switch a ON (o "prendela" → activo por API). Fase 2: Formulario + lookalike/retargeting.

## 4 sep 2026 — 🚀 CAMPAÑA LIVE + Dashboard
- Campaña 120251438753090234 ACTIVA. 8 videos ACTIVE, 5 estáticos (algunos PENDING_REVIEW→se aprueban solos). Gastando $20/día ($13 videos + $7 estáticos).
- Ojo: 2 borradores basura "Campaña de mensajes a medida" en la cuenta (de intentos manuales) → Santi debe "Descartar borradores" (NO "Revisar y publicar").
- DASHBOARD en vivo: `dashboard/index.html` (servido en :8124) lee `dashboard/data.json`. Motor: `meta-api/dashboard-data.py` (Insights nivel ad: gasto, clics link, cpc, ctr, video vs estático, ganador/perdedor). CRM manual de presupuestos WhatsApp en localStorage → costo por presupuesto real.
- Loop de refresco cada 10 min corriendo en background (task b9zgyw4tw) MIENTRAS viva la sesión + token. dashboard-data.py tiene guarda: si el token vence, NO pisa data.json con ceros.
- PENDIENTE para 24/7 real: token durable de usuario del sistema (no vence). Ofrecido a Santi.

## 4 sep 2026 — Dashboard 24/7 (launchd) + token durable
- Token de USUARIO DEL SISTEMA (no vence) guardado en .env.meta. Validado OK (ads_management, business_management, insights).
- Dashboard 24/7 vía launchd (macOS). RUNTIME COPIADO a ~/wpc-pauta/ (Escritorio está bloqueado por TCC para procesos de fondo):
  · ~/wpc-pauta/meta/ (_meta.py, .env.meta, config.json, dashboard-data.py)
  · ~/wpc-pauta/dashboard/ (index.html, data.json)
- Agentes: ~/Library/LaunchAgents/com.wpc.dashboard.fetch.plist (corre dashboard-data.py cada 600s) + com.wpc.dashboard.serve.plist (http.server 8124, KeepAlive). Ambos exit 0, server HTTP 200. Logs en ~/wpc-pauta/{fetch,serve}.log.
- URL dashboard: http://localhost:8124/ (mientras la Mac esté encendida/logueada).
- ⚠️ El runtime en ~/wpc-pauta es COPIA. Fuente = repo en Escritorio. Si se edita dashboard/index.html o dashboard-data.py, RE-COPIAR a ~/wpc-pauta. 
- Apagar: launchctl unload ~/Library/LaunchAgents/com.wpc.dashboard.*.plist
- Campaña ya gastando (primeros centavos 11:27). Loop de sesión viejo (task) quedó redundante, muere con la sesión.

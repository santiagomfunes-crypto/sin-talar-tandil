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

## 4 sep 2026 — Campaña FORMULARIO (Lead Ads) creada + dashboard comparativo
- Formulario instantáneo creado: form_id=1798619054495337 (nombre + teléfono prellenados, política privacidad, thank-you con botón WhatsApp). Requirió aceptar ToS de Lead Gen en la Página (Santi lo hizo).
- Campaña 120251440759520234 "WPC Tandil | Prospecting | Lead Form", adset 120251440760070234, 5 ads (wpc-3,1,7,4,8), OUTCOME_LEADS / LEAD_GENERATION / destination ON_AD, USD10/día. TODO EN PAUSA.
- Script: create-campaign-forms.py (reusa form_id via REUSE_FORM_ID; trae miniatura de cada video, obligatoria para lead ads).
- dashboard-data.py ahora también trae la campaña de formulario (forms: spend/impressions/leads/cost_per_lead/active). dashboard/index.html muestra sección "WhatsApp vs Formulario". Sincronizado a ~/wpc-pauta.
- PENDIENTE: Santi activa la campaña de Formulario (switch ON / "prendela") para arrancar el A/B WhatsApp vs Formulario. WhatsApp ya en 12 clics / $0.72.

## 4 sep 2026 — PIVOT: todo al Formulario
- PROBADO (siguiendo el redirect real de wa.me → api.whatsapp.com/send): link correcto, número válido y en WhatsApp (perfil "Santiago Funes | Real Estate"), PERO la página intermedia tiene botón "Abrir aplicación" = paso extra que el navegador in-app de Meta no completa → 19 clics / 0 mensajes. Techo estructural del wa.me, NO arreglable desde el link.
- DECISIÓN Santi: pausar WhatsApp, todo al Formulario.
- Ejecutado: campaña WhatsApp 120251438753090234 = PAUSED. Formulario 120251440759520234 adset a daily_budget=2000 ($20), ACTIVE. Total $20/día solo en Formulario.
- WhatsApp nativo (CTWA) queda para cuando Santi consiga teléfono spare para el 209659 o lo monte en Cloud API/Wati. iPhone no deja 3ra cuenta de WhatsApp; el 209659 necesita otro device o la API.
- Dashboard: sección WhatsApp queda como histórico congelado; Formulario es lo vivo (spend/leads/cost_per_lead + leads_list con nombre+teléfono+botón Escribirle, traídos por API del form 1798619054495337). Pendiente opcional: hacer el dashboard Forms-first.

## 4 sep 2026 — Dashboard Forms-first
- dashboard-data.py: agrega forms["ads"] (insights por anuncio del Formulario: spend/impressions/leads/cost_per_lead) + forms["budget"]=20.
- dashboard/index.html reescrito Forms-first: KPIs = Leads / Costo por lead (hero) / Gasto (vs $20) / Impresiones. Sección "Leads que entraron" (auto, nombre+tel+Escribirle). Tabla "Qué ángulo trae leads" (forms.ads, ganador verde). WhatsApp movido a <details> "histórico (pausado)" con funnel + CRM manual.
- Sincronizado a ~/wpc-pauta. Formulario activo, entregando (91 impresiones, 0 leads aún).
- PENDIENTE decisión con Santi cuando haya datos: cortar ángulos flojos, escalar ganador, y los 3 números de unit economics (ticket/margen deck, tasa de cierre, meta) para fijar techo de costo por lead.

## 4 sep 2026 — Contenido ORGÁNICO (separado de la pauta)
- Nuevo archivo **`GUIONES-ORGANICO.md`**: 14 guiones en 6 series (A "Lo que nadie te dice" / B "¿Cuánto sale?" / C "Test tandilense" / D Antes-Después 📱 / E ASMR sin voz / F los 2 que venden) + calendario de 4 semanas.
- Diferencia clave vs. `GUIONES-FLOW.md` (que es PAUTA): el orgánico **no cierra con CTA de WhatsApp** — el CTA duro marca el video como anuncio y corta el alcance. Placa final liviana = logo + @wpc.tandil.
- **Restricción que ordena todo:** Veo = 8s por clip ≈ 20-22 palabras de VO. Los guiones educativos van cortados en 2 clips de 8s que se empalman en Remotion.
- En los clips ASMR hay que escribir `Sin voz en off. Solo sonido ambiente.` o Veo narra igual.
- La serie D (antes/después) **NO se genera con IA a propósito**: sintético se nota y quema la credibilidad. Se filma con el celular desde el mismo punto exacto (marcar el piso con cinta) — y hay que grabar el "antes" SIEMPRE.
- Precios de la serie B quedaron como `[MONTO]`: los completa Santi, no se inventan.
- 🚧 PENDIENTE de código: variante orgánica de `ClipAd.tsx` (placa liviana sin CTA + hook de texto arriba en el primer segundo, que hoy no existe). No construida — esperando OK.

## 4 sep 2026 — Los guiones orgánicos v1 salieron mal en Flow. Causa y corrección.
Santi generó la serie A y los videos salieron horribles. Autopsia — v1 rompía 5 reglas que el proyecto YA tenía documentadas:
1. **Estructura de 2 clips por pieza (el error grande).** Dos generaciones separadas de Veo NO matchean color, luz ni encuadre: al empalmarlas se ve como dos videos distintos pegados. Los anuncios que funcionaron (tanda 2/sep) eran **1 clip = 1 escena = 1 movimiento de cámara**. Se partió en dos para meter más texto educativo → se forzó la herramienta para que entre el contenido. Al revés.
2. **Aperturas cerradas** (cenital cerrado en A1, macro en A4) contra la regla explícita "abrir SIEMPRE en plano medio/abierto, NUNCA close-up del deck".
3. **Manos como sujeto principal** en 2 de 8 prompts. Es el fallo #1 de Veo, ya medido (wpc-5 = 7/10 por riesgo manos/caras).
4. **Agua/pileta** en 2 prompts, siendo "el elemento que sale peor" según la propia bitácora.
5. **Checklist de negativos** ("no render 3D, sin morphing, nunca brillante") en los 8, cuando el aprendizaje del 2/sep dice prompt largo-cinematográfico y NO checklist.
**Corrección aplicada:** A2/A3/A4 reescritos como **1 clip de 8s, ~250 palabras**, estructura MATERIAL → ESCENA → CÁMARA (un solo movimiento) → LUZ Y COLOR → MÚSICA → AMBIENTE → VO, sin lista de negativos. A1 **sacado de Flow**: pasa a filmarse con celular (es un detalle técnico con manos, Veo no lo va a hacer nunca bien).
**Regla nueva:** si un guion necesita mostrar un detalle técnico, manos trabajando o un antes/después, **no es para Veo**: es para el celular en obra. Veo sirve para escena linda + una línea.

## 4 sep 2026 — Catálogo + Cotizador propio (copiado del proveedor, +15%)
- Nuevo: **`catalogo.html` + `cotizador.js` + `cotizador.css`** (3 archivos separados, NO monolito).
  Es la página de productos/precios/presupuestos de WPC Tandil, linkeada desde la nav y desde las
  3 cards de producto de `index.html`.
- **Fuente de la data:** sintalarwpc.com (el fabricante), scrapeada el 4-sep. De ahí salieron los
  4 productos con sus medidas reales, los 6 colores con hex exactos, las 3 terminaciones y la
  mecánica de cálculo (rinde por unidad, desperdicio, separación entre perfiles).
- **Precios: costo del proveedor × 1,15.** Deck USD 31,80/tabla · Wall Panel 38,70/panel ·
  Perfil 60×42 21,33/barra · Perfil 42×22 9,69/barra. Se pesifican al **dólar BNA venta del día**
  (bluelytics → criptoya → argentinadatos, con fallback $1420 si las tres fallan).
  ⚠️ **La base de costo y el margen están en `PRECIOS-INTERNO.md`, que está GITIGNOREADO** porque
  el repo es público. En `cotizador.js` solo viven los precios FINALES (ya con el margen adentro,
  no volver a multiplicar). Para cambiar el margen: recalcular y pisar `precioUSD`.
- **Cotizador (3 modos, todos verificados en browser):**
  · Deck por forma del espacio (9 formas: rect, cuadrado, L, U, círculo, semicírculo, pentágono,
    trapecio y personalizada de hasta 4 rectángulos) + SVG técnico con los números de cada campo.
  · Wall Panel por superficie de paño (rinde 0,638 m²/panel) con cantidad de paños.
  · Perfilería en 3 modos: metro lineal, separación fija (calcula cuántos entran y la separación
    real) y cantidad fija. Avisa si la pieza no entra en la barra comercial o si los perfiles no
    entran en el ancho.
- Presupuesto acumulativo con localStorage, envío por WhatsApp con el detalle en texto,
  copiar al portapapeles e imprimir/PDF (hay `@media print`). Evento `AddToQuote` al pixel.
- **También corregido en `index.html`:** el WhatsApp viejo `5492494557754` → **5492494209464**
  (era un pendiente que ya estaba anotado acá) y los 4 colores inventados (Teca/Caramelo/Coñac/
  Greige) → los **6 reales** (Caldén, Alerce, Arrayán, Sauce, Ombú, Silver Gray) con los hex del
  fabricante.
- 4 fotos de producto que faltaban bajadas a `img/` (perfil-40-2/3, perfil-60-2/3).
- 🚧 NO DEPLOYADO: probado en local (`python3 -m http.server 8131`), esperando OK de Santi para
  pushear a GitHub Pages.

## 5 sep 2026 — Dominio propio: wpctandil.com.ar
- Santi registró **wpctandil.com.ar** en NIC.ar (alta 05/09/2026, vence 05/09/2027). **Delegado: NO.**
- NIC.ar **no hospeda registros DNS** — solo delega a nameservers ajenos. Va **Cloudflare free**
  en el medio (cuenta que ya existe, la de Legarreta).
- Runbook completo en **`DOMINIO.md`**; el corte se hace con **`./configurar-dominio.sh`** (un
  comando: CNAME + URLs absolutas + Pages + HTTPS + verificación).
- **NO correr el script antes de que el dominio resuelva.** Si el CNAME se sube primero, GitHub
  redirige la URL vieja a un dominio muerto y el sitio queda caído.
- ⛔ **Trampa conocida:** SSL **Flexible** de Cloudflare + GitHub Pages = bucle infinito de
  redirects (GitHub fuerza HTTPS y CF le habla HTTP). Los registros van en **DNS only** hasta que
  GitHub emita el certificado; después, si se quiere proxy, **Full** — nunca Flexible.
- Al cortar, el sitio deja de vivir en `/sin-talar-tandil/` y pasa a la raíz del dominio. Todos
  los links internos son relativos: no hay nada que tocar.
- Pendiente post-corte: actualizar la URL de privacidad en la app de Meta y poner el dominio en
  las bios de IG/FB.

## 5 sep 2026 — Catálogo + cotizador: estado final
- Precios desde la **lista de distribuidor oficial** (placa que pasó Santi): costo neto × 1,15.
  **El IVA NO va en el precio de tapa** (decisión de Santi: acá casi nadie lo paga) — se muestra
  al costado como referencia para quien factura.
- Deck $40.197/tabla · Wall Panel $48.897/panel · Perfil 60-42 $26.941 · Perfil 42-22 $13.990
  (netos, al BNA $1.529; se actualizan solos con el dólar).
- Base de costo, margen y **benchmark contra todo el país** en `PRECIOS-INTERNO.md` (gitignoreado,
  el repo es público). Resumen: estamos ~3% por debajo del precio de lista de Kolertech y Hissuma
  en deck y panel, y somos los más baratos en perfilería. El flanco es el precio de contado de
  ellos (~20% abajo).
- Usabilidad: barra fija con el total, ejemplos de un toque en deck, modos de perfilería en
  castellano de obra, ayudas en los campos de jerga, teclado numérico en celular.

## 5 sep 2026 — CORRECCIÓN: el dominio va por Vercel, no Cloudflare
- Santi frenó la idea de Cloudflare. Verificado con `dig`: `santiagofunes.com.ar` y
  `redactacontratos.com.ar` están delegados a **ns1/ns2.vercel-dns.com**. Se replica eso.
- El sitio se **mudó a Vercel**: proyecto `wpc-tandil`, repo conectado (push a main = deploy).
  https://wpc-tandil.vercel.app
- **`.vercelignore`**: el dominio público sirve solo landing + catálogo + cotizador + privacidad.
  El dashboard de gasto de la pauta, los guiones y los scripts de Meta dejan de ser accesibles
  (en la URL de GitHub SÍ lo están). Verificado: `/dashboard/data.json` y `/STATE.md` → 404.
- **Falta solo que Santi delegue en NIC.ar** a ns1/ns2.vercel-dns.com. Vercel emite el cert solo.
- GitHub Pages queda vivo como espejo (la app de Meta apunta ahí para la privacidad). El canonical
  resuelve el duplicado.

## 5 sep 2026 — Números REALES de la pauta + investigación de ángulos
**Datos propios (API Meta, cuenta act_859031260510247, desde 31/ago):**
- Cuenta lifetime: **USD 19,58 · 5.175 impresiones · 3.857 personas · 49 clics** (CTR 2,34%).
- Campaña ACTIVA `WPC Tandil | Prospecting | Lead Form` (OUTCOME_LEADS): $18,63 · **5 leads reales** → **CPL USD 3,73**. (Ojo al contar: `lead`=4 y `onsite_conversion.lead_grouped`=4 son EL MISMO evento; sumar los `*_add_meta_leads` infla a 20. El número bueno es `action_type == "lead"`.)
- Campaña `Traffic→WhatsApp` PAUSADA, gastó $1,50.
- Reparto: **10 anuncios sobre $10/día = $1 por anuncio por día.**
- Por anuncio (impr/gasto/leads): no-mantenés-nunca 145/$1,12/**2** · estático-clima 984/$5,88/**1** · invertís-una-vez 343/$2,47/**1** · los otros 7 en cero.

**Veredicto: NO hay ángulo ganador identificable.** El benchmark pide $50-100 de gasto por creativo solo para señal preliminar y ~100 conversiones por variante para declarar ganador. Hay $1,12 en el "mejor" y 4 conversiones repartidas en 10 anuncios: es ruido, no señal. El CPL de $4,54 sí es bueno (comparable al 5,24 de real estate) → **los creativos no son el problema; la fragmentación sí.**

**Decisión recomendada:** NO cambiar creativos. Cortar de 10 a 3 (no-mantenés-nunca / clima / invertís-una-vez) para que junten datos. El feed se llena aparte con las 11 piezas ya hechas — es reparación de conversión, no crecimiento.

**Ángulos que la investigación externa marca como ganadores en decking compuesto** (ver fuentes en el chat 5/sep):
1. **La cuenta del mantenimiento CON NÚMEROS** (afuera: USD 540-1.050/año de madera vs 15-20 de compuesto; equilibrio a los 5-7 años). Hoy decimos "dura 25 años" = adjetivo. Falta el número en pesos.
2. **El calor** — objeción real y prioridad #1 de desarrollo del rubro. NINGUNO de los 8 la toca. El guion orgánico A2 (el honesto) ataca justo eso.
3. **Premium, no "sustituto barato"** — el mercado ya no lo ve como reemplazo económico de la madera sino como elemento de diseño. Los 8 venden defensa ("no lo mantenés"), falta deseo ("así queda tu casa").
4. **Antes/después real** = el formato más persuasivo del rubro remodelación. El nuestro (wpc-2) es generado y es el peor (6/10).
5. **Mito/verdad** — formato que sirve de anuncio y de contenido a la vez.

⚠️ **Corrección a la recomendación del 4/sep:** el precio visible tiende a atraer comparadores y bajar la calidad del lead. Va en el PERFIL (resuelve la duda del que ya mira), NO en pauta fría.

## 5 sep 2026 (mediodía) — BUG del panel: contaba 4 leads y eran 5
**Causa:** el panel tomaba el número de **Insights** (`action_type=lead`), que **agrega con retraso de horas**. El lead de Marcia Sturno entró 08:26 y a las 10:51 Insights seguía diciendo 4. El endpoint `{FORM_ID}/leads` ya lo tenía.
**Regla:** para CONTAR leads manda `/leads` (tiempo real, uno por fila). Insights sirve para gasto/impresiones, no para el conteo del día.
**Fix en `dashboard-data.py`:** (1) se piden los leads con `ad_id`, (2) si la lista cruda tiene más que Insights **gana la lista** (antes solo caía al fallback si Insights daba CERO), (3) el desglose por anuncio también usa `max(insights, conteo real por ad_id)` — si no, un lead de un anuncio nuevo sin gasto reportado desaparecía de la tabla.
**Números corregidos:** 5 leads · $18,63 · **CPL USD 3,73**. Por anuncio: *El deck que no mantenés nunca* **3** ($0,38) · *Invertís una sola vez* 1 ($2,58) · *estático No lo toca ni el clima* 1 ($6,09).
Los 5 son `is_organic=false` (todos de pauta, ninguno es test propio).

## 5 sep 2026 — Plan de feed (`marketing/plan-feed.md`)
12 piezas **ya existentes** (8 reels `remotion/out/wpc-*.mp4` + 3 posts `out/ig/presenta-*.png` + `out/placa-comparativa.png`), 2 por día × 6 días, con caption escrito para cada una. No hay que producir nada nuevo.
- **Se publica en orden inverso** (#12 → #1): IG pone lo último arriba a la izquierda, así la grilla termina leyéndose presentación → mejor video → comparativa.
- `wpc-2` queda **afuera** (QA 6/10; el antes/después generado se nota). Su lugar es para el antes/después REAL cuando se filme en obra.
- El feed no es para generar leads a esta escala: es para **cerrar la fuga** de la pauta (perfil vacío recibiendo tráfico pago).
- Después de los 6 días: cadencia 2 por semana con `GUIONES-ORGANICO.md` + material real de obra.

## 5 sep 2026 — 🚀 DOMINIO VIVO: https://wpctandil.com.ar
- Delegación registrada en NIC 11:51, publicada en la zona `.com.ar` cerca de las 13:00.
- Certificado Let's Encrypt emitido por Vercel (5-sep → 4-dic-2026, renueva solo).
- `wpctandil.com.ar` y `www.` → 200. HTTP redirige a HTTPS con 308.
- Canonical apuntando al dominio propio en las dos páginas; el espejo de GitHub Pages
  se auto-canonicaliza, así que no compite en Google.
- Verificado que lo interno NO se publica en el dominio: `dashboard/data.json`, `STATE.md`,
  `PRECIOS-INTERNO.md`, `meta-api/config.json`, guionario y estrategia de pauta → todos 404.
- Cotizador probado en vivo: 50 m² → 179 tablas → $7.195.263 sin IVA. Pixel cargando.
- ⚠️ **Gotcha del script:** `dig +short NS` contra el resolver local devolvía vacío por caché
  aunque el dominio ya estaba propagado. `configurar-dominio.sh` ahora pregunta a 1.1.1.1/8.8.8.8.
- Pendiente manual de Santi: (1) URL de privacidad en la app de Meta →
  `https://wpctandil.com.ar/privacidad.html`; (2) dominio en las bios de IG y FB.

## 5 sep 2026 — Instagram: PUBLICANDO POR API (funciona)
- Token de `.env.meta` es **SYSTEM_USER y NO expira** (`expires_at=0`) y ya trae **`instagram_content_publish`**. No hace falta regenerarlo para publicar.
- ❌ **Facebook NO se puede publicar por API**: falta `pages_manage_posts`. La Página se carga a mano (o se agrega el permiso en la app).
- **La API de IG no sube archivos**: descarga el video de una **URL pública**. Por eso los mp4 van a `media/ig/` del repo (público) y los sirve GitHub Pages en `https://santiagomfunes-crypto.github.io/sin-talar-tandil/media/ig/<slug>.mp4`. `remotion/out/` está gitignoreado, por eso hay que **copiar** el archivo ahí antes.
- ⏱ GitHub Pages tarda ~1-3 min en servir el archivo nuevo. Verificar con `curl -I` que devuelva `200 video/mp4` **antes** de crear el contenedor, o Meta rechaza.
- Script: **`meta-api/publicar-ig.py <slug> <caption.txt>`** → crea contenedor REELS, espera el `status_code=FINISHED` (tarda ~30-40 s) y publica.
- Cupo: 100 publicaciones cada 24 h. Sobra.
- **Estado de la cuenta antes de empezar: `media_count = 0`, 19 seguidores.** El perfil estaba literalmente vacío mientras la pauta traía gente.
- ✅ Publicado #12 `wpc-6` (medición sin cargo) → https://www.instagram.com/reel/Dc6Ka5pDCCi/
- Falta: #11 wpc-5 (tarde del día 1) y del #10 al #2 según el calendario de `marketing/plan-feed.md`.

## 5 sep 2026 — Feed de IG AUTOMATIZADO (GitHub Actions)
- **Cola:** `marketing/cola-feed.json` — 10 piezas pendientes (#11 → #2), cada una con archivo, tipo, caption y `publicado` (null hasta que sale). El #12 ya salió a mano.
- **Publicador:** `meta-api/publicar-siguiente.py` — toma la PRIMERA pendiente, verifica que la URL de GitHub Pages devuelva 200, crea el contenedor (REELS o imagen), espera `FINISHED` y publica. Después escribe el permalink en el JSON. Tiene `--dry-run`.
- **Workflow:** `.github/workflows/feed-ig.yml` — cron `0 13 * * *` y `0 22 * * *` (UTC) = **10:00 y 19:00 de Argentina**. Publica UNA por corrida y commitea el JSON actualizado. Cuando la cola se vacía, sale sin hacer nada. Tiene `workflow_dispatch` con input `dry_run`.
- **Assets:** todo en `media/ig/` (servido por GitHub Pages, los 10 verificados con 200 y content-type correcto). ⚠️ **Instagram solo acepta JPEG en imágenes**: los PNG se convirtieron con `sips` (la comparativa además bajada a 1440px).
- Se cambió el arranque del POST 3 en `posts-presentacion.md`: abría con el mismo gancho que el reel wpc-1 ("¿Otra primavera lijando...") y se iban a pisar con 2 días de diferencia.
- 🚧 **FALTA (solo lo puede hacer Santi):** cargar el secret `META_TOKEN` en el repo. Sin eso el workflow falla en el primer paso.
  `gh secret set META_TOKEN --repo santiagomfunes-crypto/sin-talar-tandil` (pegando el token de `meta-api/.env.meta`), o por la web en Settings → Secrets and variables → Actions.
  Después: `gh workflow run feed-ig.yml -f dry_run=true` para probar sin publicar.

## 5 sep 2026 — Tanda 2 de anuncios (`marketing/anuncios-tanda-2.md`)
Tres ángulos que los 8 actuales no tocan, con prompt de Flow en el estilo corregido (1 clip 8s, ~250 palabras, sin checklist de negativos) + texto de anuncio:
- **N1 · La cuenta** — ⚠️ tiene un `[MONTO]` sin llenar: cuánto sale por año mantener un deck de madera de ~20 m². No se inventa.
- **N2 · El calor (honesto)** — admite la contra. Es el más raro y probablemente el mejor.
- **N3 · Deseo, no defensa** — hora dorada, sin objeción ni comparación. El ángulo que falta para construir marca.
Del catálogo: **deck USD 85,36/m²**, **wall panel USD 50,13/m²** (material, sin IVA, sin instalación).
Recordatorio: entran de a UNO contra el ganador, no los tres juntos.
🚧 Secret `META_TOKEN` sigue sin cargar (el clasificador de permisos bloquea que lo haga Claude). Sin eso el feed automático no corre.

## 5 sep 2026 — Los presupuestos de la web se guardan y se ven
- **Problema que resuelve:** si alguien armaba un presupuesto de $7M y no apretaba enviar, se
  perdía entero. Era el tráfico más caliente del sitio yéndose sin dejar rastro.
- Tabla **`wpc_cotizaciones`** en Supabase `pgnmpxqljxrpnvexcygh`. Append-only: una fila por
  evento; la más reciente de cada `sesion` es la foto final.
- **Seguridad:** RLS con una sola política, INSERT para `anon`. La clave que viaja al navegador
  es la **publicable** (el repo es público). Verificado: con esa clave, `SELECT` devuelve `[]`.
  La service key para leer vive en `meta-api/.env.meta`, gitignoreado.
- Se guarda al agregar/quitar un ítem, al completar los datos de contacto, al enviar por
  WhatsApp y al cerrar la pestaña (**sendBeacon** — `fetch` no llega si la página se está yendo).
- Campo **Teléfono** en el resumen + aviso visible "guardamos tu presupuesto". El aviso no es
  decorativo: sin él, llamar a alguien que tipeó el número y no lo mandó es gris con la ley 25.326.
- Dashboard (`localhost:8124`): sección **"Presupuestos armados en la web"** con armados /
  enviados / sin enviar / con teléfono, y botón "Escribirle" por fila. Sincronizado a `~/wpc-pauta`.
- **De paso resuelve el problema de los m²:** mucha gente no sabe cuántos tiene, pero el cotizador
  se lo calcula y ese número queda guardado. Es el dato de calificación que el formulario de Meta
  no pide (solo pide nombre y teléfono).

## 5 sep 2026 (tarde) — Feed encendido + hallazgo: la infra de WhatsApp ya existe
- ✅ **Secret `META_TOKEN` cargado.** Ojo al nombre: en `.env.meta` la variable es `META_ADS_TOKEN`,
  pero el secret de GitHub se llama `META_TOKEN` (el script acepta los dos). Dry-run en Actions OK:
  token válido en CI, `wpc-5.mp4` sirve 200. **El feed publica solo desde hoy 19:00.**
- Aviso de leads por push CONSTRUIDO pero **sin pushear** (Santi frenó para ir por el bot):
  `meta-api/avisar-leads.py` + `.github/workflows/avisar-leads.yml`. Descubre los formularios solos
  derivando un Page Token; pide SOLO `created_time` (el repo es público y los logs de Actions
  también → nunca nombre ni teléfono). Tópico ntfy en `.env.meta`. Hay **6 leads**, no 5.
- 🔎 **HALLAZGO: el portfolio `wpc.tandil` ya tiene WABA** (`1364101685398268`) con el número
  **+5492494209464** en **CLOUD_API**, `CONNECTED`, calidad **GREEN**, 0 templates. Es la infra de
  Sofía, parada desde junio. **Por eso rebotaba el CTWA**: el número no está como WhatsApp común de
  la Página, está en la Plataforma. `code_verification_status: NOT_VERIFIED` (posible 2do candado).
- La app "wpc tandil ads" (`1381570386825161`) **ya está suscripta al WABA**, y el token tiene
  `whatsapp_business_messaging` + `whatsapp_business_management` sin target_ids. No falta permiso.
  También aparece suscripta "Business Agent" (IA de Meta) — revisar si intercepta.
- ❌ **`pages_manage_posts` NO está en el token** — confirmado con `debug_token`. Ese es el motivo
  exacto por el que no se puede publicar en Facebook por API. Se agrega el scope al system user;
  no debería requerir App Review porque la Página es propia.
- **DECISIÓN (Santi): el bot de WPC va en un NÚMERO NUEVO.** Un número en Cloud API no se puede usar
  a la vez desde la app del celular, y +5492494209464 está en la landing, en el perfil y en los 6 leads.
  Además el `verified_name` actual dice "Santiago Funes | Real Estate", que no sirve para WPC.
- **Principio de diseño del bot: NO inventa precios, ejecuta el cotizador.** El motor de
  `cotizador.js` (rinde, desperdicio, separación, dólar BNA) se extrae a un módulo compartido que
  usan el navegador y el webhook. Una sola verdad de precios. El LLM entiende y redacta; la plata
  la calcula el código. Es lo que hace defendible este bot y no el de Sofía (allá cada respuesta era
  un juicio; acá es una cuenta).
- ⚠️ **ACLARACIÓN (Santi, mismo día): NO se cambia el número todavía.** El +5492494209464 sigue tal
  cual en landing, bio de IG/FB y anuncios. La línea nueva entra como **segundo número del mismo
  WABA** (una WABA soporta varios, cada uno con su propio `verified_name`), así que es aditivo:
  el bot arranca en la línea nueva y el número de siempre queda intacto. Cuándo (y si) se pasa el
  tráfico público al número del bot es una decisión POSTERIOR y aparte.

## 5 sep 2026 — Embudo: en qué paso se cae la gente
- 8 pasos marcados en el cotizador: abrió el catálogo · llegó al cotizador · cargó una medida ·
  **vio el total** · agregó al presupuesto · llegó al resumen · completó sus datos · mandó por
  WhatsApp. Se guarda el más lejano de cada visita, con el segundo en que lo alcanzó.
- **Lo que se estaba perdiendo:** el que calculaba y se iba SIN agregar nada no dejaba fila, y es
  el segmento más grande. Ahora se guarda desde que ve un precio, con `calculo_suelto`: lo último
  que vio en pantalla ("80 m² de deck, $11.496.342, lo calculó y no lo agregó").
- La distinción que importa: *vio el total y se fue* = problema de **precio** (→ conversación de
  cuotas). *Completó los datos y no mandó* = problema del **formulario**.
- Dashboard: barra de embudo (llegaron / se quedaron acá por paso) + el escalón que más pierde +
  por fila el paso donde se cortó, el tiempo en la página y cuántas veces recalculó (recalcular
  mucho = está tanteando presupuesto).
- ⚠️ **Base del embudo:** son las visitas que llegaron a ver un precio. El que entra y nunca
  calcula no deja fila — para eso está el pixel, no esta tabla.
- Columnas nuevas: `paso_max`, `paso_label`, `pasos`, `segundos`, `calculos`, `calculo_suelto`.
  Ojo: `dashboard-data.py` pide columnas por nombre en el `select=` — si se agrega una, hay que
  sumarla ahí o llega vacía al dashboard.
- **Número del bot: +54 9 249 420-9659** (celular, chip nuevo). Script `meta-api/alta-numero.py`
  (estado / agregar / codigo / verificar / registrar).
- ⛔ **VERIFICADO 5-sep: NO se puede agregar un número por API.** `POST /{WABA}/phone_numbers`
  devuelve `code 200000 / subcode 3095008` con y sin el 9 — no es el formato. Esa ruta es solo para
  Solution Partners (BSP); el negocio `wpc.tandil` es directo (`verification_status: not_verified`,
  creado 31-ago-2026). Confirmado contra la doc oficial de Meta: un negocio directo agrega números
  por App Dashboard → WhatsApp → API Setup, o por WhatsApp Manager. El límite de números NO es el
  problema (permite 2, hay 1).
  **Lo que SÍ es API**: `register` en Cloud API, webhooks, y todo el bot.
- ✅ **CORRECCIÓN al párrafo anterior:** el alta por API SÍ funciona. El `subcode 3095008` no era la
  restricción de Solution Partner sino **número ocupado**: el +5492494209659 tenía registrado un bot
  viejo de Santi. Contra la WABA `wpc.tandil` (vacía) y con un número libre, `POST /{WABA}/phone_numbers`
  entra sin drama. Regla práctica: **3095008 = el número está en uso en otro lado.** Para liberarlo,
  registrarlo en la app de WhatsApp (eso lo expulsa de la Plataforma) y después borrar la cuenta.
- **Número definitivo del bot: +54 9 249 420-5273** — `phone_number_id 1226671373873063`, en la WABA
  `1822250112458981` (`wpc.tandil`). El PIN de 2 pasos está en `.env.meta` como `WPC_WA_PIN`.
  ⚠ Esa WABA NO tiene la app suscripta → sin `alta-numero.py suscribir` no llegan webhooks.

## 5 sep 2026 — Santi llamó a los leads: NINGUNO CALIFICADO. Diagnóstico.
El CPL de USD 3,73 era un espejismo. Causa raíz encontrada en el formulario (`1798619054495337`):
- Solo pide **FULL_NAME y PHONE**, y Meta los **autocompleta** del perfil → completarlo son dos toques y cero tipeo.
- **`is_optimized_for_quality: False`** = está en modo "más volumen", no en "mayor intención".
- **Mecanismo:** optimizamos por `LEAD_GENERATION` sobre el formulario más fácil que Meta permite. El algoritmo hizo exactamente lo pedido: encontró a la gente más propensa a **tocar dos veces**. Esa población no es la que compra un deck.
- (Al 5/sep el formulario ya va por **7 leads**, no 5.)

**Fixes por orden de palanca:**
1. **Formulario nuevo** — los lead forms de Meta son INMUTABLES: no se editan, hay que crear otro. Con `is_optimized_for_quality: True` (agrega paso de confirmación) + preguntas propias que exijan tipear/elegir: metros aproximados, cuándo lo va a hacer, localidad, si es casa propia.
2. **Decir el piso económico en el anuncio.** ⚠️ **Esto corrige la recomendación del 4-5/sep** (donde dije que el precio visible baja la calidad del lead): ese consejo aplica cuando los leads ya son buenos y querés protegerlos. Acá el problema es el inverso —5 de 5 sin calificar— así que el precio funciona de FILTRO. Dato disponible: material USD 85,36/m² sin IVA.
3. **NO subir el presupuesto a USD 27/día.** Con la calidad rota, escalar solo compra más de lo mismo, más rápido.
4. Fix más profundo (a futuro): optimizar por un evento que cueste esfuerzo — mensaje de WhatsApp (bloqueado por el candado de la Página) o cotización completada en el cotizador de la landing (el pixel ya está vivo). A USD 10/día ese evento es demasiado raro para optimizar; primero el formulario.

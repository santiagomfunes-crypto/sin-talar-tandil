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

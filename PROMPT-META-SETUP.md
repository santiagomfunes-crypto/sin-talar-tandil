# Prompt para nueva sesión — WPC Tandil: Meta + campañas + edición final de videos

Retomamos **WPC Tandil** (marca de deck y revestimientos WPC en Tandil; Santi = distribuidor local).
Proyecto en `~/Desktop/sin-talar-tandil/`. **Leé primero:** la memoria `project_sin_talar_wpc`, y en el proyecto: `GUIONES-FLOW.md`, `FLOW-PLAYBOOK.md`, `estrategia-pauta.html`, `index.html`.

## Estado actual
- **Marca:** "WPC Tandil" (NUNCA "Sin Talar" = ese es el fabricante). Identidad **verde bosque #2f5133 + crema**. Logo = `img/logo-wpc-green.png` / `-cream.png`. Handle IG y FB: **@wpc.tandil**. WhatsApp: **+54 9 2494 20-9464** (confirmar).
- **Landing** deployada en GitHub Pages: `santiagomfunes-crypto.github.io/sin-talar-tandil/` (repo `sin-talar-tandil`, deploy = git push a main; **gh CLI en `~/.local/bin/gh`**, autenticado como santiagomfunes-crypto).
- **Fotos reales del fabricante** en `img/reales/` (color madera + gris). **Placas** en `out/wpc-placa-*.png`. **Estrategia integral** en el artifact `estrategia-pauta.html`.
- **Videos:** Santi los está generando en **Google Flow** (Veo) con los guiones de `GUIONES-FLOW.md`. Los clips crudos van a `~/Desktop/sin-talar-tandil/clips/` (clip-1.mp4 … clip-8.mp4). Ya traen voz en off; NO dicen "WPC" (va en la placa final).

## Objetivo de esta sesión (3 frentes)

### 1. Terminar de editar los videos (Remotion, gratis)
Proyecto Remotion en `sin-talar-tandil/remotion/` (patrón ya usado: `Ad1.tsx`/`Ad2.tsx`). Por cada clip de Flow en `clips/`:
- Agregar arriba el **logo WPC verde** (marca de agua).
- Un **caption del ángulo** (opcional) + la **placa final de cierre**: fondo verde WPC Tandil + "Pedí tu presupuesto" + "WhatsApp · Tandil".
- Mantener la VO del clip. Render 1080×1920 → `remotion/out/` + copia a `~/Downloads/`.
- QA visual por subagente (regla: NO leer imágenes en el hilo principal).

### 2. Configurar Meta
- **Pixel en la landing:** Santi pasa el **Pixel ID** → agregar el snippet del Meta Pixel a `index.html` (en `<head>`) + evento en el clic de WhatsApp → `git push` (gh en ~/.local/bin). Es lo que arma el retargeting + mide.
- Verificar: **IG @wpc.tandil conectado a la Página de FB** en Meta Business Suite (lo hace Santi) + **ad account** + **WhatsApp Business** conectado (para Click-to-WhatsApp).

### 3. Campañas por API (como Redacta, con token)
Reutilizar/adaptar `~/Desktop/redacta-contenido/meta-api/create-campaign.py` para WPC Tandil. **Estructura decidida (ver estrategia):**
- **Objetivo = Mensajes / Click-to-WhatsApp** (NO lead forms — investigado: para local alta-consideración CTWA gana). Destino: WhatsApp.
- **Campaña 1 — Prospecting:** 1 conjunto amplio, **geo Tandil + 30-40 km**, edad 30-60, SIN lookalike (no hay semilla). 5 creativos (los 5 videos de frío). Test A (abierto) vs B (intereses: mejoras del hogar, jardín, piletas, construcción, casas de campo).
- **Campaña 2 — Retargeting (fase 2, cuando haya pool):** custom audiences (visitantes del pixel, video-viewers 25%+, engagers IG/FB, lista WhatsApp). 3 creativos directos.
- **Presupuesto arranque ~USD 12-15/día.** Reparto por tiempo: semana 1-2 = 100% prospecting; semana 3+ = 70/30.
- **Config obligatoria (lecciones Redacta):** Audience Network **OFF**, **NO** optimizar por Landing Page Views, ubicaciones Reels/Stories/Feed IG+FB, UTMs en las creatividades (`utm_content={{ad.name}}` etc.).

## Lo que Claude necesita de Santi para ejecutar
Pixel ID · Token de Meta (system user, durable) · Ad account ID · FB Page ID · IG user ID · WhatsApp Business conectado. (Los IDs de Redacta están en `redacta-contenido/meta-api/` como referencia del formato, NO reusar — son de otra cuenta/marca.)

## Guardrails (memoria)
- **Ground-truth de leads en WhatsApp**, no en el dashboard (el webview de Meta rompe el tracking → subcuenta).
- Frecuencia < 3 en 7 días; refrescar creativos cada 2-4 semanas.
- Verificar contenido real antes de dar algo por listo (no confiar en HTTP 200).

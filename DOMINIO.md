# wpctandil.com.ar — cómo se conecta

Estado al 5-sep-2026: **registrado en NIC.ar, sin delegar** (`dig NS wpctandil.com.ar` no
devuelve nada). Vence el 5-sep-2027.

NIC.ar **no hospeda registros DNS**: solo te deja apuntar el dominio a los nameservers de otro.
Por eso hace falta un DNS en el medio. Va Cloudflare, que es gratis y ya tenés cuenta (la usás
para Legarreta).

---

## Lo que tenés que hacer vos (10 minutos, dos pantallas)

### 1. Cloudflare — dar de alta el dominio
1. dash.cloudflare.com → **Add a site** → `wpctandil.com.ar` → plan **Free**.
2. Te va a dar **dos nameservers**, del estilo `xxx.ns.cloudflare.com`. Copialos.
3. En **DNS → Records**, cargá esto:

| Tipo | Nombre | Contenido | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153` | **DNS only** (nube gris) |
| A | `@` | `185.199.109.153` | **DNS only** |
| A | `@` | `185.199.110.153` | **DNS only** |
| A | `@` | `185.199.111.153` | **DNS only** |
| CNAME | `www` | `santiagomfunes-crypto.github.io` | **DNS only** |

### 2. NIC.ar — delegar
tramitesadistancia.gob.ar → Mis dominios → `wpctandil.com.ar` → **DELEGAR** → pegá los dos
nameservers de Cloudflare. Ahí la columna "Delegado" pasa de NO a SI.

### 3. Avisame
Cuando esté, corro `./configurar-dominio.sh` y queda listo: CNAME del repo, las URLs absolutas
al dominio nuevo, dominio y HTTPS en GitHub Pages, y verificación de que responde.

---

## ⛔ La trampa: el SSL de Cloudflare

En Legarreta usás **Flexible**. Con GitHub Pages, Flexible provoca un **bucle infinito de
redirects** y el sitio no abre: GitHub fuerza HTTPS y Cloudflare le habla por HTTP, así que se
redirigen entre sí para siempre.

Por eso arriba va todo en **DNS only (nube gris)**: GitHub necesita ver el origen real para
emitir su certificado de Let's Encrypt. Una vez que `https://wpctandil.com.ar` abra bien, si
querés el proxy de Cloudflare (caché, analytics), prendelo **con SSL en Full**, nunca Flexible.

---

## Qué cambia cuando se corte

- El sitio pasa a `wpctandil.com.ar` y la URL vieja de GitHub **redirige sola**, no se rompe
  ningún link que hayas mandado.
- Ojo con esto: hoy el sitio vive en `.../sin-talar-tandil/`, un subdirectorio. Con dominio
  propio pasa a la **raíz**: `wpctandil.com.ar/catalogo.html`. Todos los links internos son
  relativos, así que no hay nada que tocar.
- El **pixel de Meta** (`1063781786398885`) sigue funcionando; empieza a registrar el dominio
  nuevo. No hace falta recrearlo.
- La **política de privacidad** que la app de Meta tiene cargada apunta a la URL de GitHub.
  Sigue andando por el redirect, pero conviene actualizarla a
  `https://wpctandil.com.ar/privacidad.html` en developers.facebook.com → app "wpc tandil ads"
  → Settings → Basic.
- Los scripts de `meta-api/` que usan la landing y la privacidad se actualizan solos con el
  script de corte.

## Después del corte, opcional
- Mandar el sitio a Google Search Console con el dominio nuevo.
- Poner `wpctandil.com.ar` en las bios de IG y FB, que hoy no tienen link propio.

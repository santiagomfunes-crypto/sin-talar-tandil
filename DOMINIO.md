# wpctandil.com.ar — cómo se conecta

Estado al 5-sep-2026: **registrado en NIC.ar, sin delegar.** Vence el 5-sep-2027.

NIC.ar **no hospeda registros DNS**: solo te deja apuntar el dominio a los nameservers de otro.
Va por **Vercel**, igual que `santiagofunes.com.ar` y `redactacontratos.com.ar` — los dos ya
delegados a `ns1/ns2.vercel-dns.com`.

## Ya está hecho
- Proyecto **`wpc-tandil`** en Vercel, sirviendo el sitio: https://wpc-tandil.vercel.app
- Conectado al repo de GitHub: **cada push a `main` deploya solo**, igual que antes.
- Dominios `wpctandil.com.ar` y `www.wpctandil.com.ar` agregados al proyecto.
- `.vercelignore`: el dominio público sirve **solo** landing, catálogo, cotizador y privacidad.
  Lo interno (pauta, dashboard de gasto, guiones, fuentes de video, los `.md`) **no se publica**.
  Verificado: `/dashboard/data.json` y `/STATE.md` dan 404.

## Lo único que falta, y lo tenés que hacer vos
En **tramitesadistancia.gob.ar** → Mis dominios → `wpctandil.com.ar` → botón **DELEGAR**, y cargá:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

Son exactamente los mismos que ya usás en tus otros dos dominios. La columna "Delegado" pasa de
NO a SI. Vercel emite el certificado HTTPS solo, sin que toques nada.

Para ver cómo viene:
```bash
dig +short NS wpctandil.com.ar          # tiene que devolver ns1/ns2.vercel-dns.com
vercel domains inspect wpctandil.com.ar
```

## Cuando resuelva
Corré `./configurar-dominio.sh`: pasa el canonical y las URLs de compartir al dominio propio,
actualiza la política de privacidad que usan los scripts de Meta, y verifica que todo responda.

## Detalles
- **GitHub Pages queda vivo** como espejo. No se apaga porque la app de Meta todavía apunta ahí
  para la política de privacidad. El `canonical` le va a decir a Google cuál es el sitio real,
  así que no hay problema de contenido duplicado.
- El sitio deja de vivir en `/sin-talar-tandil/` y pasa a la **raíz** del dominio. Todos los links
  internos son relativos: no se rompe nada.
- El **pixel de Meta** (`1063781786398885`) sigue igual, empieza a registrar el dominio nuevo.
- Pendiente manual después: cambiar la URL de privacidad en developers.facebook.com → app
  "wpc tandil ads" → Settings → Basic, a `https://wpctandil.com.ar/privacidad.html`. Y poner el
  dominio en las bios de IG y FB.

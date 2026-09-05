#!/bin/bash
# Corte a wpctandil.com.ar — correr SOLO cuando el dominio ya esté delegado y resolviendo.
# Antes de esto, en la nube: Cloudflare con los registros + NIC.ar delegado. Ver DOMINIO.md.
set -e
DOM="wpctandil.com.ar"
REPO="santiagomfunes-crypto/sin-talar-tandil"
VIEJO="https://santiagomfunes-crypto.github.io/sin-talar-tandil"
export PATH="$HOME/.local/bin:$PATH"
cd "$(dirname "$0")"

echo "▸ 1/5 — ¿el dominio resuelve?"
IPS=$(dig +short A "$DOM" | tr '\n' ' ')
if [ -z "$IPS" ]; then
  echo "✗ $DOM todavía no resuelve. Falta delegarlo en NIC.ar o esperar la propagación."
  echo "  Probá de nuevo en un rato: dig +short A $DOM"
  exit 1
fi
echo "  resuelve a: $IPS"
case "$IPS" in
  *185.199.1*) echo "  ✓ apunta a GitHub Pages" ;;
  *) echo "  ⚠ no son las IP de GitHub Pages (185.199.108-111.153)."
     echo "    Si en Cloudflare está el proxy naranja encendido, esto es normal."
     echo "    Pero ojo: el modo SSL tiene que ser Full, NUNCA Flexible (bucle de redirects)." ;;
esac

echo "▸ 2/5 — archivo CNAME"
echo "$DOM" > CNAME

echo "▸ 3/5 — URLs absolutas al dominio nuevo"
sed -i '' "s|$VIEJO|https://$DOM|g" catalogo.html
sed -i '' "s|/sin-talar-tandil/catalogo.html|/catalogo.html|; s|/sin-talar-tandil/img/|/img/|" catalogo.html
sed -i '' "s|$VIEJO/|https://$DOM/|g" meta-api/create-campaign-forms.py meta-api/add-statics-to-forms.py 2>/dev/null || true
grep -n "$DOM" catalogo.html | head -3

echo "▸ 4/5 — commit y push"
git add CNAME catalogo.html meta-api/create-campaign-forms.py meta-api/add-statics-to-forms.py 2>/dev/null || git add CNAME catalogo.html
git commit -q -m "chore(dominio): el sitio pasa a wpctandil.com.ar

CNAME para GitHub Pages y las URLs absolutas (canonical, og:image y la política
de privacidad que usa la app de Meta) apuntando al dominio propio.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>" || echo "  (sin cambios que commitear)"
git push -q origin main

echo "▸ 5/5 — dominio y HTTPS en GitHub Pages"
gh api -X PUT "repos/$REPO/pages" -f "cname=$DOM" -F "https_enforced=true" >/dev/null 2>&1 \
  || gh api -X PUT "repos/$REPO/pages" -f "cname=$DOM" >/dev/null 2>&1 \
  || echo "  (la API rebotó; queda igual por el CNAME del repo)"

echo ""
echo "Esperando el certificado de GitHub (puede tardar unos minutos)..."
for i in $(seq 1 40); do
  CODE=$(curl -s -o /dev/null -w '%{http_code}' "https://$DOM/catalogo.html" --max-time 10 || echo 000)
  [ "$CODE" = "200" ] && break
  sleep 15
done
echo ""
echo "https://$DOM/            -> $(curl -s -o /dev/null -w '%{http_code}' https://$DOM/ --max-time 10)"
echo "https://$DOM/catalogo.html -> $(curl -s -o /dev/null -w '%{http_code}' https://$DOM/catalogo.html --max-time 10)"
echo "https://www.$DOM/        -> $(curl -s -o /dev/null -w '%{http_code}' -L https://www.$DOM/ --max-time 10)"
echo ""
echo "Si todavía da 404/525, es el certificado: GitHub tarda hasta ~15 min en emitirlo."

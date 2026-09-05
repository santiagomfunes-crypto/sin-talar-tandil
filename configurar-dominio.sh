#!/bin/bash
# Corte final a wpctandil.com.ar. Correr cuando el dominio ya resuelva (ver DOMINIO.md).
set -e
DOM="wpctandil.com.ar"
VIEJO="https://santiagomfunes-crypto.github.io/sin-talar-tandil"
export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:$PATH"
cd "$(dirname "$0")"

echo "▸ 1/4 — ¿está delegado?"
NS=$(dig +short NS "$DOM" | tr '\n' ' ')
if [ -z "$NS" ]; then
  echo "✗ $DOM todavía no está delegado."
  echo "  Falta el paso en NIC.ar: DELEGAR -> ns1.vercel-dns.com / ns2.vercel-dns.com"
  exit 1
fi
echo "  nameservers: $NS"

echo "▸ 2/4 — canonical y URLs de compartir al dominio propio"
sed -i '' "s|$VIEJO/catalogo.html|https://$DOM/catalogo.html|g; s|$VIEJO/img/|https://$DOM/img/|g; s|$VIEJO|https://$DOM|g" catalogo.html
sed -i '' "s|$VIEJO/|https://$DOM/|g" meta-api/create-campaign-forms.py meta-api/add-statics-to-forms.py 2>/dev/null || true
# la landing no tenía canonical: se lo agregamos para que el espejo de GitHub no compita
grep -q 'rel="canonical"' index.html || sed -i '' "s|<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">|<link rel=\"canonical\" href=\"https://$DOM/\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">|" index.html
grep -n "$DOM" index.html catalogo.html | head -5

echo "▸ 3/4 — commit y push (Vercel deploya solo)"
git add index.html catalogo.html meta-api/create-campaign-forms.py meta-api/add-statics-to-forms.py 2>/dev/null || git add index.html catalogo.html
git commit -q -m "chore(dominio): el sitio pasa a wpctandil.com.ar

Canonical, og:image y la política de privacidad que usa la app de Meta apuntando
al dominio propio. GitHub Pages queda como espejo, self-canonicalizado.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>" || echo "  (sin cambios)"
git push -q origin main

echo "▸ 4/4 — esperando el certificado de Vercel..."
for i in $(seq 1 40); do
  CODE=$(curl -s -o /dev/null -w '%{http_code}' "https://$DOM/catalogo.html" --max-time 10 || echo 000)
  [ "$CODE" = "200" ] && break
  sleep 15
done
echo ""
for u in "https://$DOM/" "https://$DOM/catalogo.html" "https://www.$DOM/" "https://$DOM/privacidad.html"; do
  printf "%-46s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' -L "$u" --max-time 10)"
done

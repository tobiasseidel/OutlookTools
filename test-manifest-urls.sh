#!/bin/bash

echo "=== Teste alle Manifest-URLs ==="
echo ""

URLS=(
  "https://tobiasseidel.github.io/OutlookTools/manifest.xml"
  "https://tobiasseidel.github.io/OutlookTools/taskpane.html"
  "https://tobiasseidel.github.io/OutlookTools/taskpane.js"
  "https://tobiasseidel.github.io/OutlookTools/functions.html"
  "https://tobiasseidel.github.io/OutlookTools/assets/icon-16.png"
  "https://tobiasseidel.github.io/OutlookTools/assets/icon-32.png"
  "https://tobiasseidel.github.io/OutlookTools/assets/icon-80.png"
)

FAILED=0

for url in "${URLS[@]}"; do
  echo -n "Teste: $url ... "
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  
  if [ "$STATUS" -eq 200 ]; then
    echo "✅ OK (HTTP $STATUS)"
  else
    echo "❌ FEHLER (HTTP $STATUS)"
    FAILED=$((FAILED + 1))
  fi
done

echo ""
if [ $FAILED -eq 0 ]; then
  echo "✅ Alle URLs sind erreichbar!"
  echo ""
  echo "Installation sollte über URL funktionieren:"
  echo "https://tobiasseidel.github.io/OutlookTools/manifest.xml"
else
  echo "❌ $FAILED URL(s) nicht erreichbar!"
  echo "Warten Sie auf GitHub Pages Deployment oder prüfen Sie die URLs."
fi

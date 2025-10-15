# OutlookTools
Tools für Outlook Online

## Ziel
- Minimal-invasiver Assistent für Outlook-Nutzer ohne Adminrechte.
- weiterleitung von E-Mail-Inhalten zur Verarbeitung in Agenten für Vereinfachung, zusammenfassung, Antwortentwurf
- Später optional LLM/Heuristiken lokal (Ollama), aber nicht Bestandteil des Hostings-Repos.

## Bausteine
- Outlook Web Add-in (Office.js): Liest das aktuell geöffnete Mail (Betreff, Absender, Body-Preview) und zeigt/übermittelt strukturierte Daten.
- Separates Hosting via GitHub Pages (eigenes Repo): Statische Dateien, keine Geheimnisse.
- Optional: Kleines CLI/Skript lokal, um kopierte Inhalte/Export-Dateien zusammenzufassen.

## Struktur
```
/ (root)
  manifest.xml
  taskpane.html
  taskpane.js
  functions.html
  assets/
    icon.png
  .nojekyll
  README.md
```

## Schritte zur Einrichtung
1) Neues Repo 
2) Dateien POC importieren
3) GitHub Pages aktivieren:
   - Settings → Pages → Source: `main` → `/root` (oder `/docs` bei Struktur "docs/").
4) URLs im `manifest.xml` auf die Pages-URL anpassen, z. B.:
   - Icon: `https://<user>.github.io/outlooktools/assets/icon.png`
   - Taskpane: `https://<user>.github.io/outlooktools/taskpane.html`
   - Functions: `https://<user>.github.io/ooutlooktools/functions.html`
5) Sideload in OWA:
   - Direktlink: `https://outlook.office.com/owa/?path=/options/manageapps`
   - „Benutzerdefiniertes Add-in hinzufügen“ → Manifest-Datei hochladen oder Manifest-URL verwenden.

## Nutzung
- E-Mail öffnen → Ribbon-Button „Mail anzeigen“ → Taskpane zeigt JSON mit Headern + Body-Preview.
- Kopiere die Inhalte oder erweitere die Taskpane später um einen „Export“-Button (z. B. Download einer JSON-Datei), die du lokal weiterverarbeitest.

## Erweiterungen (später)
- Zweiter Button „Nur Header“ (ohne Body), um Policies zu schonen.
- Optionales Client-Side-Parsing (regex/heuristisch) für schnelle Extraktion.
- Lokales Tool (separates Repo) für Summarization/Analyse (z. B. via Ollama). Add-in sendet keine Daten außer ins eigene Browser-Fenster; Kopieren/Herunterladen ist manuell.

## Was wir bewusst NICHT tun
- Kein Vollzugriff aufs Postfach, kein Crawling, keine serverseitige Speicherung.
- Keine Graph-/IMAP‑Scopes; damit entfallen Adminfreigaben.

## Risiken/Policies
- Sideload/Custom Add-ins können gesperrt sein. Fallback: OWA-Automation (Playwright) oder manueller Copy/Paste‑Workflow.
- GitHub Pages ist öffentlich: Keine sensiblen Daten ins Repo legen.

## Fehlersuche / Debugging

**Bei Problemen mit der Installation oder im Betrieb:**
- Siehe **[DEBUG.md](DEBUG.md)** für eine detaillierte Anleitung
- Das Taskpane enthält jetzt ein Debug-Panel mit Status-Informationen
- Öffnen Sie die Browser-Entwicklertools (F12) im Taskpane für detaillierte Logs

**Wichtigste Debug-Schritte:**
1. Rechtsklick im Taskpane → "Element untersuchen"
2. Console-Tab öffnen → Hier stehen alle Fehler
3. Network-Tab → Prüfen ob alle Dateien laden (Status 200)
4. Debug-Panel im Taskpane aufklappen für Quick-Check

## Nächste Schritte
- Pages aktivieren.
- Manifest-URLs anpassen und Sideload testen.
- Ggf. Mini‑Icon erstellen und UI leicht anpassen (Branding).
- Optional: Separates lokales Skript‑Repo vorbereiten (CLI, die JSON oder reinen Text verarbeitet).

# Erkenntnisse: Outlook Plugin API-Integration Test

**Datum:** 2025-10-21  
**Branch:** staging  
**Ziel:** Outlook-Plugin mit lokaler FastAPI-Verbindung testen

---

## Ausgangssituation

- FastAPI läuft lokal auf `http://localhost:8000`
- Outlook-Plugin ist auf GitHub Pages deployed
- Plugin hat bereits ein UI (`taskpane.html` und `taskpane-api.html`)
- `taskpane-api.html` enthält bereits API-Test-Buttons:
  - 🔌 API-Verbindung testen
  - 📬 E-Mail Daten auslesen
  - 🚀 An FastAPI senden

## Problem

**Installation des Manifests schlägt fehl**, sobald die URL von `taskpane.html` auf `taskpane-api.html` geändert wird.

---

## Wichtige Erkenntnisse

### 1. Manifest-Installation Validierung

**Outlook validiert bei der Installation NICHT NUR das Manifest, sondern auch die referenzierten Dateien!**

- Die Installation prüft, ob alle URLs im Manifest erreichbar sind
- Die Installation validiert möglicherweise auch den **Inhalt** der HTML-Dateien
- Komplexere HTML-Dateien führen zu Installationsfehlern

### 2. Funktionierende vs. Nicht-Funktionierende Versionen

#### ✅ Funktioniert - Version vom main Branch:
```xml
<Id>125e0b6b-15d6-4fda-ae8b-bd749f3f0001</Id>
<Version>1.0.0.0</Version>
<SourceLocation DefaultValue="https://tobiasseidel.github.io/OutlookTools/taskpane.html"/>
<RequestedHeight>250</RequestedHeight>
```
- Einfaches Manifest ohne VersionOverrides
- HTML-Datei: `taskpane.html` (~53 Zeilen)
- Kein Ribbon-Button, aber Plugin ist installierbar

#### ❌ Funktioniert NICHT:
```xml
<Version>1.0.0.2</Version>
<SourceLocation DefaultValue="https://tobiasseidel.github.io/OutlookTools/taskpane-api.html"/>
<RequestedHeight>600</RequestedHeight>
```
- HTML-Datei: `taskpane-api.html` (~220 Zeilen, komplex)
- Installation schlägt fehl: "Add-in installation failed"

#### ✅ Funktioniert - Minimal Version:
```xml
<Version>1.0.0.3</Version>
<SourceLocation DefaultValue="https://tobiasseidel.github.io/OutlookTools/taskpane-minimal.html"/>
```
- HTML-Datei: `taskpane-minimal.html` (~14 Zeilen, absolut minimal)
- Installation erfolgreich

### 3. VersionOverrides Problem

**Hinzufügen von VersionOverrides führt zu Installationsfehlern:**

- Manifest mit `VersionOverrides V1.0` → Installation failed
- Manifest mit verschachtelten `VersionOverrides V1.1` → Installation failed
- Nur einfaches Manifest ohne VersionOverrides ist installierbar

**Beobachtung:** User berichtete, dass "button-v2" (mit VersionOverrides) früher funktionierte, aber jetzt auch nicht mehr installierbar ist.

### 4. GitHub Pages und Branch-Unterschiede

- **main Branch:** Alte Version (taskpane.html)
- **staging Branch:** Neue Versionen (für Tests)
- GitHub Pages wurde auf staging Branch umgestellt
- Alle URLs sind erreichbar (HTTP 200), aber Installation scheitert trotzdem

### 5. Installations-Methode

**Wichtig:** User kann **KEINE URL-basierte Installation** nutzen, sondern nur **lokale Manifest-Dateien hochladen**.

Dies bedeutet:
- Manifest muss lokal heruntergeladen werden
- Outlook validiert dann die im Manifest referenzierten Online-URLs
- Dies könnte zusätzliche Validierungsschritte auslösen

---

## Technische Details

### Funktionierende HTML-Struktur (taskpane.html)

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <script src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"></script>
  <style>
    /* Einfaches CSS */
  </style>
</head>
<body>
  <h3>Aktuelles Mail lesen</h3>
  <button id="read">Mail lesen</button>
  <pre id="out">Noch nichts geladen.</pre>
  <script src="taskpane.js"></script>
</body>
</html>
```

### Nicht-funktionierende HTML-Struktur (taskpane-api.html)

- ~220 Zeilen
- Komplexes CSS mit vielen Klassen
- Mehrere Sektionen mit verschachtelten Elementen
- Inline-Event-Handler
- Umfangreiches JavaScript für API-Calls

**Hypothese:** Die Komplexität oder spezifische Elemente in der HTML-Datei führen zu Validierungsfehlern bei der Installation.

---

## Aktueller Stand (staging Branch)

### Dateien auf staging:

1. **manifest.xml** 
   - Version: 1.0.0.3
   - Zeigt auf: `taskpane-minimal.html`
   - Status: Installierbar ✅

2. **taskpane-minimal.html**
   - Aktuell: Ersetzt mit API-Version (inline JavaScript)
   - Enthält: API-Test-Buttons, E-Mail-Lese-Funktion, API-Integration
   - Status: Installiert, aber wurde nach Installation mit neuem Inhalt überschrieben

3. **taskpane.html** (funktioniert)
   - Einfache Version ohne API
   - 53 Zeilen

4. **taskpane-api.html** (funktioniert NICHT bei Installation)
   - Komplexe Version mit API-Integration
   - 220 Zeilen
   - Separate JS-Datei

5. **taskpane-simple-api.html + .js**
   - Vereinfachte API-Version (~50 Zeilen)
   - Status: Nicht getestet (Installation schlug fehl)

---

## FastAPI Backend

### Endpoints vorhanden:

```python
GET  /                    # Health check
GET  /health              # Detaillierter health check
GET  /api/test            # Test-Endpoint
POST /api/test            # Test-Endpoint mit Daten
POST /api/process-email   # E-Mail Verarbeitung
```

### CORS Konfiguration:

```python
allow_origins=[
    "https://tobiasseidel.github.io",
    "http://localhost:*",
    "http://127.0.0.1:*",
    "https://outlook.office.com",
    "https://outlook.office365.com",
    "https://*.outlook.com",
]
```

Status: FastAPI läuft und ist erreichbar ✅

---

## Offene Fragen

1. **Was genau validiert Outlook bei der Manifest-Installation?**
   - Nur URL-Erreichbarkeit?
   - HTML-Struktur?
   - Spezifische HTML-Elemente?
   - JavaScript-Komplexität?

2. **Warum funktionierte button-v2.xml früher, aber jetzt nicht mehr?**
   - Outlook-Update?
   - Geänderte Validierungsregeln?
   - Caching-Probleme?

3. **Kann eine komplexe HTML-Datei NACH der Installation geladen werden?**
   - Aktueller Test: taskpane-minimal.html wurde nach Installation ersetzt
   - Ergebnis: Noch nicht verifiziert

---

## Lösungsansätze (nicht vollständig getestet)

### Ansatz 1: Post-Installation HTML-Ersetzung
1. Installation mit minimaler HTML-Datei
2. Nach erfolgreicher Installation: HTML-Datei auf GitHub Pages ersetzen
3. Plugin lädt dann die aktualisierte HTML-Datei

**Status:** Implementiert auf staging, nicht verifiziert

### Ansatz 2: Schrittweise Komplexität erhöhen
1. Start mit absolut minimaler HTML
2. Schritt für Schritt Features hinzufügen
3. Testen, wo die Grenze liegt

**Status:** Nicht durchgeführt

### Ansatz 3: URL-basierte Installation (nicht möglich)
- User-Umgebung erlaubt nur lokale Manifest-Upload

---

## Archivierte Dateien

Alte Manifest-Varianten wurden in `archive/` verschoben:
- manifest-api-poc.xml
- manifest-button-v2.xml
- manifest-full-backup.xml
- manifest-localhost.xml
- manifest-simple.xml
- manifest-with-button.xml

---

## Empfehlungen für weitere Versuche

1. **HTML-Validierung:** 
   - HTML-Datei gegen Office Add-in Validator prüfen
   - Microsoft Office Add-in Validation Tool verwenden

2. **Schrittweise Debugging:**
   - Von taskpane.html ausgehen (funktioniert)
   - Einzelne Elemente aus taskpane-api.html hinzufügen
   - Nach jedem Schritt Installation testen
   - Herausfinden, welches Element den Fehler verursacht

3. **Alternative Architektur:**
   - Minimale HTML bei Installation
   - Dynamisches Nachladen von Inhalten via JavaScript
   - iFrame-Einbettung für komplexe UI

4. **Microsoft Support:**
   - Office Add-in Support kontaktieren
   - Detaillierte Fehler-Logs anfordern
   - Validierungsregeln erfragen

---

## Git-Historie (staging Branch)

```
370cd75 feat: Replace minimal HTML with API version (same filename)
459c539 test: Add minimal HTML for installation test
ae22981 feat: Add simple API version with minimal changes
1bad979 feat: Change URL to taskpane-api.html (version 1.0.0.1)
684f0ab Merge branch 'staging' of https://github.com/tobiasseidel/OutlookTools into staging
7ec1d09 revert: Back to working version 1.0.0.0 with taskpane.html
5fc58d9 feat: Update manifest to use taskpane-api.html with API integration
```

---

## Fazit

**Das Hauptproblem liegt bei der Manifest-Installation:**
- Einfache HTML-Dateien sind installierbar
- Komplexe HTML-Dateien (taskpane-api.html) führen zu Installationsfehlern
- VersionOverrides führen ebenfalls zu Installationsfehlern
- Die genaue Ursache der Validierungsfehler ist unklar

**Nächster Schritt sollte sein:**
Systematisches Debugging durch schrittweises Hinzufügen von Features zu einer funktionierenden Basis-HTML, um den exakten Auslöser zu identifizieren.

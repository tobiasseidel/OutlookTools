# Debug-Anleitung für Outlook Web Add-in

## 1. Manifest-Validierungsfehler beim Upload

Wenn Sie das Manifest hochladen und es fehlschlägt, zeigt Outlook meist eine Fehlermeldung an.

**Häufige Fehler:**
- "Manifest ist ungültig" → XML-Syntax oder Schema-Fehler
- "URL nicht erreichbar" → GitHub Pages nicht deployed oder URLs falsch
- "Unsichere URL" → HTTPS fehlt

**Lösung:**
- Validieren Sie das Manifest online: https://appsforoffice.microsoft.com/app-validator
- Testen Sie jede URL im Manifest einzeln im Browser

## 2. Browser-Entwicklertools im Taskpane öffnen

### In Outlook Web App (OWA):

**Methode 1: Rechtsklick im Taskpane**
1. Öffnen Sie eine E-Mail in OWA
2. Klicken Sie auf "Mail anzeigen" um das Taskpane zu öffnen
3. **Rechtsklick** im Taskpane → "Element untersuchen" oder "Inspect"
4. Die Browser-Entwicklertools öffnen sich

**Methode 2: F12 Tastenkombination**
1. Taskpane öffnen
2. Klicken Sie **in das Taskpane** (muss Fokus haben)
3. Drücken Sie **F12**
4. Entwicklertools öffnen sich

**Methode 3: Browser-Menü**
- Chrome: Menü → Weitere Tools → Entwicklertools (während Taskpane fokussiert ist)
- Edge: Menü → Weitere Tools → Entwicklertools (während Taskpane fokussiert ist)
- Firefox: Menü → Weitere Werkzeuge → Browser-Werkzeuge

## 3. Was Sie in den Entwicklertools sehen sollten

### Console-Tab (wichtigste Tab!)
Hier sehen Sie alle JavaScript-Fehler und Logs:

**Bei erfolgreicher Initialisierung:**
```
FunctionFile geladen für Host: Outlook
Office.js erfolgreich initialisiert.
```

**Bei Fehlern sehen Sie z.B.:**
```
Error: Office is not defined
CORS error: Access to ... has been blocked
Failed to load resource: net::ERR_CERT_AUTHORITY_INVALID
```

### Network-Tab
Zeigt alle geladenen Ressourcen:

1. Öffnen Sie den Network-Tab
2. Laden Sie das Taskpane neu (F5 im Taskpane)
3. Prüfen Sie, ob alle Dateien erfolgreich geladen werden:
   - ✅ taskpane.html (Status 200)
   - ✅ taskpane.js (Status 200)
   - ✅ office.js (Status 200)
   - ❌ Rote Einträge = Fehler beim Laden

**Häufige Fehler im Network-Tab:**
- Status 404 = Datei nicht gefunden
- Status 403 = Zugriff verweigert
- CORS error = Cross-Origin Problem

### Sources-Tab
Hier können Sie:
- Den JavaScript-Code durchgehen
- Breakpoints setzen
- Variablen inspizieren

## 4. Status-Anzeige im Taskpane nutzen

Das aktualisierte Taskpane zeigt jetzt einen Status an:

- "Lädt Office.js..." → Office.js wird noch geladen
- "Office.js geladen. Host: Outlook" → ✅ Erfolgreich geladen
- "Initialisierungsfehler: ..." → ❌ Fehler beim Laden

## 5. Fehler beim Klick auf "Mail lesen"

Wenn Sie auf den Button klicken, werden Fehler direkt im Taskpane angezeigt:

**Mögliche Meldungen:**
- "Fehler: Kein Mail-Item verfügbar. Bitte öffnen Sie eine E-Mail."
  → Sie haben keine E-Mail geöffnet oder sind nicht im Lesemodus
  
- "Fehler beim Laden des Body"
  → Berechtigungsproblem oder API-Fehler
  
- "Fehler beim Lesen: TypeError: ..."
  → JavaScript-Fehler (Details in der Console)

## 6. Add-in Verwaltung in OWA

**Add-in Status prüfen:**
1. Gehen Sie zu: https://outlook.office.com/owa/?path=/options/manageapps
2. Oder: Outlook → Einstellungen (⚙️) → Alle Outlook-Einstellungen anzeigen → Allgemein → Add-Ins verwalten
3. Hier sehen Sie:
   - Installierte Add-ins
   - Status (Aktiviert/Deaktiviert)
   - Fehlerhafte Add-ins werden rot markiert

**Add-in neu laden:**
- Deaktivieren Sie das Add-in
- Warten Sie 5 Sekunden
- Aktivieren Sie es wieder
- Laden Sie OWA neu (F5)

## 7. Häufige Debug-Szenarien

### Szenario A: Taskpane bleibt komplett leer
**Schritte:**
1. F12 im Taskpane drücken
2. Console-Tab öffnen
3. Schauen Sie nach Fehlern wie:
   - "Failed to load resource: taskpane.html"
   - "CORS policy error"
   
**Lösung:** GitHub Pages URLs prüfen

### Szenario B: "Office is not defined"
**Problem:** office.js wurde nicht geladen

**Schritte:**
1. Network-Tab öffnen
2. Nach "office.js" suchen
3. Prüfen ob Status 200 ist

**Lösung:** Internetverbindung prüfen oder CDN-Erreichbarkeit

### Szenario C: Button funktioniert nicht
**Schritte:**
1. Console-Tab öffnen
2. Button klicken
3. Fehlermeldung lesen

**Häufige Ursachen:**
- Keine E-Mail geöffnet
- Nicht im Lesemodus
- Berechtigungen fehlen

## 8. GitHub Pages Status prüfen

**Repository-Einstellungen:**
1. GitHub → Ihr Repository → Settings → Pages
2. Prüfen Sie: "Your site is live at https://tobiasseidel.github.io/OutlookTools/"
3. Klicken Sie auf "Visit site"

**Deployment-Status:**
1. GitHub → Actions Tab
2. Sehen Sie ob "pages build and deployment" erfolgreich war
3. Grünes ✅ = erfolgreich, Rotes ❌ = Fehler

**Direkte URL-Tests:**
Öffnen Sie diese URLs im Browser:
- https://tobiasseidel.github.io/OutlookTools/manifest.xml
- https://tobiasseidel.github.io/OutlookTools/taskpane.html
- https://tobiasseidel.github.io/OutlookTools/taskpane.js
- https://tobiasseidel.github.io/OutlookTools/functions.html

Alle sollten Inhalte anzeigen (nicht 404).

## 9. Manifest online validieren

**Office Add-in Validator:**
1. Gehen Sie zu: https://appsforoffice.microsoft.com/app-validator
2. Laden Sie Ihre manifest.xml hoch
3. Der Validator zeigt alle Fehler an

**Oder verwenden Sie yo office:**
```bash
npm install -g yo generator-office
yo office:validate
```

## 10. Logging verbessert

Das Add-in loggt jetzt ausführlich:

**In functions.html:**
```javascript
console.log('FunctionFile geladen für Host:', info.host);
```

**In taskpane.js:**
```javascript
console.log('Office.js erfolgreich initialisiert.');
console.error('Fehler beim Loggen:', e);
```

**Alle Logs erscheinen in der Browser-Console!**

## Quick Checklist beim Debuggen

- [ ] Browser-Entwicklertools geöffnet (F12)?
- [ ] Console-Tab aktiv?
- [ ] E-Mail im Lesemodus geöffnet?
- [ ] Alle URLs erreichbar (Network-Tab)?
- [ ] Status-Meldung im Taskpane prüfen?
- [ ] GitHub Pages deployed?
- [ ] Manifest validiert?

## Tipps

- **Immer Console zuerst prüfen** - 90% der Fehler stehen dort
- **Network-Tab** zeigt Lade-Probleme
- **Hard-Reload** im Taskpane: Strg+Shift+R (löscht Cache)
- **Private/Inkognito-Fenster** testen (vermeidet Cache-Probleme)

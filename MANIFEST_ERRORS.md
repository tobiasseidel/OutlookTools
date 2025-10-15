# Wie sehe ich den Installationsfehler in OWA?

## Fehler beim Manifest-Upload sehen

### Methode 1: Outlook Web App Interface
Wenn Sie versuchen, das Manifest in OWA hochzuladen:

1. Gehen Sie zu: https://outlook.office.com/owa/?path=/options/manageapps
2. Klicken Sie auf "+ Add-in hinzufügen" oder "Benutzerdefiniertes Add-in"
3. Wählen Sie "Aus Datei hinzufügen" oder "Aus URL hinzufügen"
4. Laden Sie das Manifest hoch

**Bei einem Fehler zeigt OWA eine Fehlermeldung!** Diese kann sein:
- "Das Manifest ist ungültig"
- "Die URL konnte nicht geladen werden"
- "Validierungsfehler: [Details]"
- Spezifische XML-Schema-Fehler

### Methode 2: Manifest online validieren (EMPFOHLEN!)

**Option A: Microsoft App Validator**
1. Gehen Sie zu: https://appsforoffice.microsoft.com/app-validator
2. Laden Sie Ihre `manifest.xml` hoch
3. Der Validator zeigt **alle** Fehler im Detail an

**Option B: Office Dev Tools**
```bash
# Installieren Sie die Tools
npm install -g office-addin-manifest

# Validieren Sie das Manifest
npx office-addin-manifest validate manifest.xml
```

### Methode 3: Browser-Entwicklertools während Upload

1. Öffnen Sie https://outlook.office.com/owa/?path=/options/manageapps
2. Drücken Sie **F12** um die Entwicklertools zu öffnen
3. Gehen Sie zum **Network-Tab**
4. Versuchen Sie das Manifest hochzuladen
5. Schauen Sie im Network-Tab nach Requests mit:
   - Fehlerstatus (400, 500, etc.)
   - Im Response sehen Sie manchmal Details

## Häufige Manifest-Fehler

### 1. XML-Syntax-Fehler
- Doppelte schließende Tags
- Falsche Verschachtelung
- Fehlende Namespaces

### 2. Schema-Validierungsfehler
- Falsche xmlns-Versionen
- Ungültige Element-Kombination
- Fehlende Pflichtfelder

### 3. URL-Probleme
- URLs nicht über HTTPS erreichbar
- CORS-Header fehlen
- 404 Fehler auf Icon/Taskpane URLs

### 4. Versions-Inkompatibilität
- Requirements zu hoch
- Falsche VersionOverrides Version
- Inkompatible Mailbox API Version

## Schnelltest vor dem Upload

**Testen Sie alle URLs im Browser:**
```
https://tobiasseidel.github.io/OutlookTools/manifest.xml
https://tobiasseidel.github.io/OutlookTools/taskpane.html
https://tobiasseidel.github.io/OutlookTools/functions.html
https://tobiasseidel.github.io/OutlookTools/assets/icon-16.png
https://tobiasseidel.github.io/OutlookTools/assets/icon-32.png
https://tobiasseidel.github.io/OutlookTools/assets/icon-80.png
```

Alle sollten **erfolgreich laden** (nicht 404 oder Fehler).

## Was sagt OWA genau?

Bitte teilen Sie die **genaue Fehlermeldung** mit, die OWA beim Upload anzeigt!

Mögliche Fehlermeldungen:
- "App-Manifestfehler" → XML-Problem
- "Validierungsfehler" → Schema-Problem  
- "Die Manifestdatei ist ungültig" → Syntax-Fehler
- "Unable to install custom add-in" → URL oder Netzwerk-Problem

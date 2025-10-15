# Fehlerbehebung: "Installation fehlgeschlagen"

## Problem
Die Fehlermeldung "Add-in installation failed" / "Installation fehlgeschlagen" ist sehr generisch und kann mehrere Ursachen haben.

## Lösungsansätze (in dieser Reihenfolge probieren)

### 1. Vereinfachtes Manifest verwenden

Ich habe ein **vereinfachtes Manifest** erstellt: `manifest-simple.xml`

**Unterschiede:**
- Keine VersionOverrides (einfacher)
- Keine FunctionFile (wird nicht benötigt)
- Keine Ribbon-Buttons (Add-in erscheint automatisch)
- Minimale Requirements

**Testen Sie dieses zuerst!**

### 2. Manifest über URL statt Datei-Upload installieren

Manchmal funktioniert der Datei-Upload nicht, aber URL-Installation schon:

**Schritte:**
1. Stellen Sie sicher, dass `manifest.xml` auf GitHub Pages deployed ist
2. In OWA: https://outlook.office.com/owa/?path=/options/manageapps
3. Wählen Sie "Aus URL hinzufügen" (nicht "Aus Datei")
4. Geben Sie ein: `https://tobiasseidel.github.io/OutlookTools/manifest.xml`

**Wichtig:** Die URL muss direkt auf die Datei zeigen und darf nicht umleiten!

### 3. Häufige Ursachen prüfen

#### A) Administratorrechte
**Problem:** Ihr Unternehmens-Tenant erlaubt keine benutzerdefinierten Add-ins

**Testen:**
1. Gehen Sie zu: https://outlook.office.com/owa/?path=/options/manageapps
2. Wenn Sie den Button "+ Add-in hinzufügen" NICHT sehen → Admin-Sperre
3. Oder der Button ist ausgegraut

**Lösung:** 
- Kontaktieren Sie Ihren IT-Admin
- Oder nutzen Sie einen privaten Outlook-Account zum Testen

#### B) Browser-Probleme
**Problem:** Browser blockiert oder cached alte Versionen

**Lösung:**
1. Öffnen Sie OWA in einem **Inkognito/Private-Fenster**
2. Versuchen Sie einen anderen Browser (Edge, Chrome, Firefox)
3. Löschen Sie den Browser-Cache komplett

#### C) GitHub Pages nicht vollständig deployed
**Problem:** Files sind noch nicht verfügbar

**Prüfen:**
1. GitHub → Ihr Repository → Actions Tab
2. Letzter "pages build and deployment" muss ✅ grün sein
3. Warten Sie 2-3 Minuten nach jedem Push

**Test:** Öffnen Sie diese URLs im Browser:
- https://tobiasseidel.github.io/OutlookTools/manifest.xml (muss XML anzeigen)
- https://tobiasseidel.github.io/OutlookTools/taskpane.html (muss HTML anzeigen)

### 4. Manifest-Größe reduzieren

Manchmal sind Manifests mit VersionOverrides zu komplex für OWA.

**Aktueller Status:**
- `manifest.xml` - Vollständiges Manifest mit Ribbon-Button
- `manifest-simple.xml` - Minimales Manifest (EMPFOHLEN ZUM TEST)

### 5. XML-Validierung durchführen

Obwohl die Syntax korrekt aussieht, können subtile Probleme existieren:

**Online-Validierung:**
```
https://appsforoffice.microsoft.com/app-validator
```

Laden Sie beide Manifests hoch und sehen Sie, ob Warnungen kommen.

### 6. Netzwerk-Debugging in OWA

**Schritte:**
1. Öffnen Sie: https://outlook.office.com/owa/?path=/options/manageapps
2. Öffnen Sie Browser DevTools (F12)
3. Gehen Sie zum **Network-Tab**
4. Aktivieren Sie "Preserve log"
5. Versuchen Sie das Manifest zu installieren
6. Schauen Sie nach fehlgeschlagenen Requests (rot markiert)

**Was Sie suchen:**
- Requests zu Ihrer manifest.xml URL
- HTTP-Statuscodes (404, 500, etc.)
- CORS-Fehler in der Console
- Timeout-Fehler

### 7. Alternatives Test-Szenario

**Test mit Microsoft 365 Developer Account:**

Wenn Ihr Firmen-Account nicht funktioniert:
1. Erstellen Sie einen kostenlosen M365 Developer Account: https://developer.microsoft.com/microsoft-365/dev-program
2. Testen Sie dort - dort sind Custom Add-ins definitiv erlaubt

### 8. Sideload in Desktop Outlook (Alternative)

Falls OWA nicht funktioniert, versuchen Sie Desktop Outlook:

**Windows Outlook:**
1. Outlook Desktop öffnen
2. Datei → Informationen → Add-Ins verwalten
3. "Meine Add-Ins" → "Benutzerdefiniertes Add-In hinzufügen"
4. "Aus Datei hinzufügen" → manifest.xml auswählen

## Empfohlene Vorgehensweise

**Schritt 1:** Verwenden Sie `manifest-simple.xml`
```bash
# Umbenennen
mv manifest.xml manifest-full.xml
mv manifest-simple.xml manifest.xml
git add .
git commit -m "Use simplified manifest"
git push
```

**Schritt 2:** Warten Sie 2 Minuten (GitHub Pages Deployment)

**Schritt 3:** Installieren Sie über URL (nicht Datei):
- URL: `https://tobiasseidel.github.io/OutlookTools/manifest.xml`

**Schritt 4:** Wenn es immer noch fehlschlägt:
- Inkognito-Browser verwenden
- IT-Admin kontaktieren (könnte Policy-Block sein)

## Debug-Checkliste

- [ ] GitHub Pages ist deployed (grünes ✅ in Actions)
- [ ] Manifest-URL öffnet sich im Browser
- [ ] Taskpane-URL öffnet sich im Browser  
- [ ] Icons laden im Browser
- [ ] Inkognito-Modus getestet
- [ ] Anderer Browser getestet
- [ ] URL-Installation statt Datei-Upload getestet
- [ ] Vereinfachtes Manifest getestet
- [ ] Online Validator zeigt keine Fehler
- [ ] Network-Tab in DevTools geprüft

## Wenn nichts funktioniert

Es könnte eine **Administrator-Policy** sein, die Custom Add-ins blockiert. In diesem Fall:

1. Kontaktieren Sie Ihren IT-Administrator
2. Oder verwenden Sie einen privaten Microsoft-Account
3. Oder nutzen Sie den M365 Developer Account (kostenlos)

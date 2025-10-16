# Installation des Add-ins MIT sichtbarem Button

Das neue Manifest `manifest-with-button.xml` fügt einen **sichtbaren Button** im Outlook Ribbon hinzu.

## Schritt 1: Altes Add-in entfernen

1. Gehen Sie zu: https://outlook.office.com/owa/?path=/options/manageapps
2. Oder: Outlook → Einstellungen (⚙️) → **Alle Outlook-Einstellungen anzeigen** → **Allgemein** → **Add-Ins verwalten**
3. Suchen Sie "Mail Reader" in der Liste
4. Klicken Sie auf das **Papierkorb-Symbol** oder **Entfernen**
5. Bestätigen Sie die Entfernung

## Schritt 2: Neues Manifest hochladen

### Option A: Datei hochladen (lokal)

1. Bleiben Sie in **Add-Ins verwalten**
2. Klicken Sie auf **"+ Add-Ins hinzufügen"** oder **"Benutzerdefiniertes Add-in"**
3. Wählen Sie **"Von Datei hinzufügen"**
4. Laden Sie die Datei `manifest-with-button.xml` hoch
5. Klicken Sie auf **Installieren**

### Option B: Von URL (wenn Sie es auf GitHub Pages hochgeladen haben)

1. Laden Sie `manifest-with-button.xml` in Ihr GitHub Repository hoch
2. Warten Sie ca. 1-2 Minuten (GitHub Pages Deployment)
3. Gehen Sie zu **Add-Ins verwalten**
4. Klicken Sie auf **"+ Add-Ins hinzufügen"** → **"Von URL hinzufügen"**
5. Geben Sie ein: `https://tobiasseidel.github.io/OutlookTools/manifest-with-button.xml`
6. Klicken Sie auf **Installieren**

## Schritt 3: Button finden

Nach der Installation:

1. **Laden Sie Outlook neu** (F5 oder Browser neu laden)
2. **Öffnen Sie eine E-Mail** im Lesemodus
3. **Schauen Sie im Ribbon** (obere Menüleiste) nach:
   - **"E-Mail lesen"** Button in der Gruppe **"Mail Reader"**
   - Der Button sollte mit Ihrem Icon angezeigt werden

### Wo genau ist der Button?

- **Im Standard-Tab** der E-Mail-Ansicht
- **Rechts** neben den normalen Outlook-Buttons (Antworten, Weiterleiten, etc.)
- In einer **eigenen Gruppe** mit dem Namen "Mail Reader"

## Schritt 4: Button testen

1. Klicken Sie auf den **"E-Mail lesen"** Button
2. Ein **Taskpane** (Seitenleiste) sollte sich rechts öffnen
3. Im Taskpane sollten die E-Mail-Daten angezeigt werden

## Troubleshooting

### Button erscheint nicht

**Prüfen Sie:**
- [ ] Haben Sie eine E-Mail geöffnet (nicht in der Liste, sondern wirklich GEÖFFNET)?
- [ ] Sind Sie im **Lesemodus** (nicht im Verfassen-Modus)?
- [ ] Haben Sie die Seite nach der Installation neu geladen?
- [ ] Ist das Add-in in den Einstellungen aktiviert?

**Wenn der Button trotzdem nicht erscheint:**
1. Öffnen Sie: https://outlook.office.com/owa/?path=/options/manageapps
2. Prüfen Sie, ob "Mail Reader" als **Aktiviert** markiert ist
3. Falls nicht: Klicken Sie auf den Schalter zum Aktivieren
4. Laden Sie Outlook neu (F5)

### Add-in Menü als Fallback

Falls der Button nicht im Ribbon erscheint, gibt es einen Fallback:

1. Öffnen Sie eine E-Mail
2. Suchen Sie nach dem **"..."** (Mehr) Menü oben rechts
3. Klicken Sie auf **"Add-ins"** oder **"Alle Add-ins"**
4. Wählen Sie **"Mail Reader"** aus der Liste

## Unterschied zum alten Manifest

| Feature | Altes Manifest | Neues Manifest (mit Button) |
|---------|----------------|------------------------------|
| Sichtbarer Button | ❌ Nein | ✅ Ja, im Ribbon |
| Position | Versteckt im Add-in Menü | Prominenter Button |
| Aktivierung | Automatisch (sollte) | Klick auf Button |
| Moderne UI | ❌ Alte FormSettings | ✅ VersionOverrides |

## Nächste Schritte

Wenn alles funktioniert:
1. Sie können das alte `manifest.xml` durch `manifest-with-button.xml` ersetzen
2. Oder beide behalten (für verschiedene Test-Szenarien)
3. Optional: `manifest-with-button.xml` nach `manifest.xml` umbenennen für GitHub Pages

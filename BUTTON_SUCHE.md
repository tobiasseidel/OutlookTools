# So finden Sie den Button - Schritt für Schritt

## WICHTIG: Wo Sie suchen müssen

Der Button erscheint **NUR** wenn Sie eine E-Mail geöffnet haben!

### Schritt 1: E-Mail richtig öffnen

❌ **FALSCH:** E-Mail nur in der Liste anklicken (Vorschau-Modus)
✅ **RICHTIG:** E-Mail durch **Doppelklick** oder **Enter** öffnen (eigenes Fenster/Tab)

**Alternative:** Klicken Sie auf eine E-Mail und schauen Sie, ob sie sich im Hauptfenster rechts öffnet.

### Schritt 2: Wo der Button erscheinen sollte

Wenn die E-Mail geöffnet ist, schauen Sie:

**Position 1: Im oberen Menüband (Ribbon)**
- Ganz oben in der E-Mail-Ansicht
- Zwischen den Standard-Buttons wie "Antworten", "Weiterleiten", etc.
- Suchen Sie nach "E-Mail lesen" oder "Mail Reader"

**Position 2: Im "..." Mehr-Menü**
- Falls das Menüband zu voll ist, werden Add-ins manchmal dort versteckt
- Oben rechts auf "..." (Drei Punkte) klicken
- Nach "Mail Reader" oder "E-Mail lesen" suchen

**Position 3: In der Add-in Leiste**
- Manche Outlook-Versionen zeigen Add-ins in einer separaten Leiste
- Schauen Sie nach einem Symbol mit einem Puzzle-Teil oder "Add-ins"

## Checkliste: Installation prüfen

Bitte gehen Sie diese Schritte durch:

### 1. Add-in ist installiert und aktiviert?

Gehen Sie zu: https://outlook.office.com/owa/?path=/options/manageapps

Prüfen Sie:
- [ ] "Mail Reader" erscheint in der Liste
- [ ] Status ist "Aktiviert" (grüner Schalter)
- [ ] Keine Fehlermeldung beim Add-in

**Screenshot machen:** Können Sie mir sagen, was Sie dort sehen?

### 2. Outlook neu laden

Nach der Installation:
1. Drücken Sie **F5** um Outlook neu zu laden
2. Oder schließen Sie den Browser-Tab und öffnen Sie Outlook erneut
3. Warten Sie 10-15 Sekunden nach dem Laden

### 3. Richtige E-Mail öffnen

Das Add-in funktioniert nur mit:
- ✅ E-Mails im **Lesemodus** (empfangene Mails)
- ❌ NICHT beim Verfassen neuer E-Mails
- ❌ NICHT in Kalender, Kontakte, etc.

Versuchen Sie:
1. Gehen Sie zum **Posteingang**
2. Öffnen Sie eine **empfangene E-Mail**
3. Warten Sie, bis die E-Mail vollständig geladen ist

### 4. Browser-Kompatibilität

Welchen Browser nutzen Sie?
- ✅ Chrome, Edge, Firefox (modern)
- ⚠️ Ältere Browser können Probleme haben

### 5. Outlook-Version prüfen

Welche Version nutzen Sie?
- **Outlook Web (outlook.office.com)** - sollte funktionieren
- **Outlook Desktop** - kann anders aussehen
- **Outlook App (mobile)** - wird nicht unterstützt

## Debug-Schritte

### Debug 1: Add-in Status prüfen

1. Gehen Sie zu: https://outlook.office.com/owa/?path=/options/manageapps
2. Klicken Sie auf "Mail Reader" 
3. Was steht unter "Status"?
4. Gibt es Fehlermeldungen?

### Debug 2: Browser Console öffnen

1. Öffnen Sie eine E-Mail
2. Drücken Sie **F12** (Entwicklertools)
3. Gehen Sie zum Tab **"Console"**
4. Gibt es rote Fehlermeldungen?
5. Laden Sie die Seite neu (F5) und beobachten Sie die Console

### Debug 3: Manifest-URL testen

Öffnen Sie diese URLs im Browser:
- https://tobiasseidel.github.io/OutlookTools/manifest-with-button.xml
- https://tobiasseidel.github.io/OutlookTools/taskpane.html
- https://tobiasseidel.github.io/OutlookTools/assets/icon-32.png

Funktionieren alle URLs? (Sollten Inhalte anzeigen, nicht 404)

## Mögliche Probleme

### Problem A: Manifest wurde nicht erkannt

**Symptom:** Add-in ist installiert, aber kein Button erscheint

**Lösung:**
1. Add-in deinstallieren
2. Browser-Cache leeren
3. Add-in neu installieren
4. Outlook komplett neu laden

### Problem B: VersionOverrides werden nicht unterstützt

**Symptom:** Alte Outlook Web Version unterstützt moderne Buttons nicht

**Lösung:** Ich erstelle eine Fallback-Version für ältere Outlook-Versionen

### Problem C: Add-in läuft nicht im richtigen Kontext

**Symptom:** Add-in ist installiert, aber wird nicht aktiviert

**Lösung:** Prüfen Sie, ob Sie wirklich eine E-Mail im Lesemodus geöffnet haben

## Was ich von Ihnen benötige

Bitte teilen Sie mir mit:

1. **Welche Outlook-Version nutzen Sie?**
   - Outlook Web (Browser)? → URL?
   - Outlook Desktop? → Windows/Mac?

2. **Was sehen Sie unter Add-ins verwalten?**
   - Ist "Mail Reader" dort aufgelistet?
   - Status "Aktiviert"?
   - Fehlermeldungen?

3. **Haben Sie eine E-Mail geöffnet?**
   - Wie haben Sie sie geöffnet? (Klick, Doppelklick, etc.)

4. **Browser?**
   - Chrome, Edge, Firefox, Safari?

5. **Fehlermeldungen?**
   - In der Browser-Console (F12)?
   - In Outlook?

Mit diesen Informationen kann ich Ihnen gezielt helfen!

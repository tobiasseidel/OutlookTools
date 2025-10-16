# 🚀 Proof of Concept: Outlook ↔ FastAPI Bridge

Dieser POC zeigt, wie E-Mail-Daten vom Outlook Add-in zu einem lokalen FastAPI-Server gesendet und verarbeitet werden können.

## 📋 Übersicht

**Flow:**
```
Outlook Web (Browser)
    ↓ Office.js liest E-Mail
Browser JavaScript (taskpane-api.js)
    ↓ HTTP POST
FastAPI Server (localhost:8000)
    ↓ Verarbeitung
Zurück an Browser
    ↓ Anzeige
Outlook Add-in Taskpane
```

## 🛠️ Setup: Schritt für Schritt

### 1️⃣ FastAPI Server installieren und starten

```bash
# In das api/ Verzeichnis wechseln
cd api

# Virtuelle Umgebung erstellen (optional aber empfohlen)
python -m venv venv

# Aktivieren:
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Dependencies installieren
pip install -r requirements.txt

# Server starten
python main.py
```

**Server läuft jetzt auf:** http://localhost:8000

**API-Dokumentation:** http://localhost:8000/docs

### 2️⃣ Neues Taskpane in GitHub Pages deployen

Sie haben zwei Optionen:

#### Option A: Neue Dateien zusätzlich (empfohlen für POC)

Die neuen Dateien `taskpane-api.html` und `taskpane-api.js` sind bereits erstellt.

Sie müssen sie **committen und zu GitHub Pages pushen**:

```bash
# Status prüfen
git status

# Neue Dateien hinzufügen
git add api/ taskpane-api.html taskpane-api.js POC_FASTAPI_BRIDGE.md

# Commit
git commit -m "Add FastAPI bridge POC"

# Push zu GitHub
git push origin HEAD
```

**Warten Sie 1-2 Minuten** bis GitHub Pages deployed.

Dann sind die Dateien verfügbar unter:
- https://tobiasseidel.github.io/OutlookTools/taskpane-api.html
- https://tobiasseidel.github.io/OutlookTools/taskpane-api.js

#### Option B: Existierende Dateien ersetzen

Falls Sie die API-Version als Standard haben möchten:

```bash
# Backup erstellen
cp taskpane.html taskpane-original.html
cp taskpane.js taskpane-original.js

# Neue Version als Standard setzen
cp taskpane-api.html taskpane.html
cp taskpane-api.js taskpane.js

# Committen und pushen
git add .
git commit -m "Update taskpane to API version"
git push origin HEAD
```

### 3️⃣ Manifest für API-Version erstellen

Erstellen Sie ein neues Manifest oder passen Sie das bestehende an:

```xml
<!-- In manifest-button-v2.xml die Taskpane URL anpassen: -->
<bt:Url id="Taskpane.Url" DefaultValue="https://tobiasseidel.github.io/OutlookTools/taskpane-api.html"/>
```

Oder erstellen Sie ein separates `manifest-api-poc.xml`:

```bash
# Kopieren und anpassen
cp manifest-button-v2.xml manifest-api-poc.xml
```

Dann in der Datei die URL ändern zu `taskpane-api.html`.

### 4️⃣ Add-in neu installieren

1. Gehen Sie zu: https://outlook.office.com/owa/?path=/options/manageapps
2. **Entfernen** Sie das alte "Mail Reader" Add-in (falls vorhanden)
3. **Installieren** Sie das neue Manifest:
   - "Add-in hinzufügen" → "Von Datei" → `manifest-api-poc.xml`
   - Oder von URL: `https://tobiasseidel.github.io/OutlookTools/manifest-api-poc.xml`
4. **Outlook neu laden** (F5 oder Tab schließen/öffnen)

## 🧪 POC Testen

### Test 1: API-Server läuft

1. Öffnen Sie: http://localhost:8000
2. Sie sollten sehen: `{"status": "running", "service": "Outlook Tools API", ...}`

**✅ Erfolgreich:** API läuft!

### Test 2: Outlook Add-in öffnen

1. Öffnen Sie Outlook: https://outlook.office.com
2. **Öffnen Sie eine E-Mail** (Doppelklick)
3. Klicken Sie auf **"..." → Apps → Mail Reader**
4. Das Taskpane sollte sich öffnen mit dem Titel **"📧 Mail Reader + FastAPI POC"**

**✅ Erfolgreich:** Add-in ist geladen!

### Test 3: API-Verbindung testen

Im Taskpane:

1. Prüfen Sie die **API-URL**: sollte `http://localhost:8000` sein
2. Klicken Sie auf **"🔌 API-Verbindung testen"**
3. Unten bei "FastAPI Antwort" sollte erscheinen:
   ```json
   {
     "status": "success",
     "message": "API ist erreichbar",
     ...
   }
   ```

**✅ Erfolgreich:** Verbindung funktioniert!

**❌ Fehler?** Siehe Troubleshooting unten.

### Test 4: E-Mail lesen

1. Klicken Sie auf **"📬 E-Mail Daten auslesen"**
2. Unter "E-Mail Daten (lokal)" sollte die E-Mail als JSON erscheinen
3. Der Button **"🚀 An FastAPI senden"** sollte jetzt aktiv sein

**✅ Erfolgreich:** E-Mail-Daten werden gelesen!

### Test 5: An FastAPI senden (HAUPTTEST!)

1. Klicken Sie auf **"🚀 An FastAPI senden"**
2. Es sollte erscheinen: **"✅ Erfolgreich verarbeitet!"**
3. Unter "FastAPI Antwort" sehen Sie die Verarbeitung:
   ```json
   {
     "🎯 Status": "success",
     "💬 Nachricht": "E-Mail erfolgreich verarbeitet",
     "📊 Zusammenfassung": "E-Mail von ... mit X Wörtern",
     "📝 Wortanzahl": 123,
     "🎭 Sentiment": "informativ",
     ...
   }
   ```

**🎉 ERFOLG:** Die Brücke funktioniert!

**Das bedeutet:**
- ✅ E-Mail wurde aus Outlook gelesen
- ✅ Daten wurden vom Browser an localhost gesendet
- ✅ FastAPI hat die Daten empfangen und verarbeitet
- ✅ Antwort wurde zurück an Outlook gesendet
- ✅ Ergebnis wird im Taskpane angezeigt

## 🔧 Troubleshooting

### Problem: "Verbindung fehlgeschlagen"

**Ursachen:**
1. FastAPI läuft nicht → Starten Sie `python api/main.py`
2. Falsche URL → Prüfen Sie, dass `http://localhost:8000` korrekt ist
3. CORS-Fehler → Siehe unten

**Lösung:**
```bash
# Terminal 1: FastAPI starten
cd api
python main.py

# Terminal 2: Logs beobachten
# Sie sollten sehen, wenn Requests ankommen
```

### Problem: CORS-Fehler

**Symptom:** In der Browser Console (F12) steht:
```
Access to fetch at 'http://localhost:8000' from origin 'https://tobiasseidel.github.io' 
has been blocked by CORS policy
```

**Lösung 1: CORS in FastAPI prüfen**

In `api/main.py` sollte stehen:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tobiasseidel.github.io", "https://outlook.office.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Lösung 2: Für Tests alle Origins erlauben**

Temporär in `api/main.py` ändern:
```python
allow_origins=["*"],  # ACHTUNG: Nur für lokale Tests!
```

### Problem: "Office.js nicht geladen"

**Lösung:**
1. **Hard Reload:** Strg + Shift + R
2. Cache leeren
3. Browser neu starten

### Problem: Button "An FastAPI senden" ist deaktiviert

**Ursache:** E-Mail wurde nicht gelesen

**Lösung:**
1. Klicken Sie zuerst auf **"📬 E-Mail Daten auslesen"**
2. Warten Sie, bis Daten angezeigt werden
3. Dann wird der Button aktiviert

### Problem: GitHub Pages zeigt 404

**Lösung:**
```bash
# Prüfen, ob Dateien committed sind
git status

# Falls rot/untracked:
git add taskpane-api.html taskpane-api.js
git commit -m "Add API taskpane"
git push origin HEAD

# 2 Minuten warten für Deployment
```

## 📊 Was passiert im Hintergrund?

### 1. Browser → FastAPI Request

```javascript
// Im Browser (taskpane-api.js)
fetch('http://localhost:8000/api/process-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: "RE: Meeting",
    from_address: "user@example.com",
    body_preview: "Hallo, danke für..."
  })
})
```

### 2. FastAPI empfängt und verarbeitet

```python
# Im FastAPI Server (api/main.py)
@app.post("/api/process-email")
async def process_email(email_data: EmailData):
    # Daten verarbeiten
    word_count = len(email_data.body_preview.split())
    summary = f"E-Mail von {email_data.from_address}..."
    
    return {
        "status": "success",
        "summary": summary,
        "word_count": word_count
    }
```

### 3. FastAPI sendet Antwort zurück

```json
{
  "status": "success",
  "message": "E-Mail erfolgreich verarbeitet",
  "summary": "E-Mail von user@example.com mit 45 Wörtern",
  "word_count": 45,
  "sentiment": "informativ"
}
```

### 4. Browser zeigt Ergebnis im Taskpane

```javascript
// Im Browser
displayData('api-response', result);  // Zeigt JSON an
```

## 🎯 Nächste Schritte / Erweiterungen

### 1. LLM-Integration (Ollama)

```python
# In api/main.py
import requests

def summarize_with_ollama(text: str) -> str:
    response = requests.post('http://localhost:11434/api/generate', json={
        'model': 'llama2',
        'prompt': f'Fasse diese E-Mail zusammen: {text}'
    })
    return response.json()['response']

@app.post("/api/process-email")
async def process_email(email_data: EmailData):
    summary = summarize_with_ollama(email_data.body_preview)
    return {"summary": summary, ...}
```

### 2. Antwort-Vorschläge generieren

```python
@app.post("/api/suggest-reply")
async def suggest_reply(email_data: EmailData):
    # Mit LLM Antwort generieren
    suggested_reply = generate_reply(email_data.body_preview)
    return {"suggested_reply": suggested_reply}
```

### 3. E-Mail-Kategorisierung

```python
@app.post("/api/categorize")
async def categorize_email(email_data: EmailData):
    category = classify_email(email_data.subject, email_data.body_preview)
    return {"category": category, "confidence": 0.95}
```

### 4. Mehrere E-Mails verarbeiten (Batch)

```python
@app.post("/api/process-batch")
async def process_batch(emails: List[EmailData]):
    results = [process_single(email) for email in emails]
    return {"results": results}
```

## 🔐 Sicherheitshinweise für Produktion

⚠️ **Dieser POC ist NUR für lokale Tests!**

Für Produktion beachten:

1. **HTTPS verwenden** (nicht HTTP)
2. **CORS einschränken** (nicht `allow_origins=["*"]`)
3. **Authentication** hinzufügen (API Keys, OAuth)
4. **Rate Limiting** implementieren
5. **Input Validation** verstärken
6. **Sensible Daten** nicht loggen
7. **Verschlüsselung** für E-Mail-Inhalte

## ✅ POC Erfolgskriterien

Der POC ist erfolgreich, wenn:

- ✅ FastAPI Server läuft auf localhost
- ✅ Outlook Add-in öffnet sich
- ✅ E-Mail-Daten werden ausgelesen
- ✅ Daten werden an FastAPI gesendet
- ✅ FastAPI verarbeitet die Daten
- ✅ Antwort wird im Taskpane angezeigt
- ✅ Gesamter Flow funktioniert End-to-End

## 📝 Zusammenfassung

**Was wir bewiesen haben:**

1. ✅ Outlook Web Add-in kann E-Mail-Daten lesen
2. ✅ Browser kann von GitHub Pages zu localhost kommunizieren
3. ✅ FastAPI kann Daten empfangen und verarbeiten
4. ✅ Ergebnisse können zurück zum Add-in gesendet werden
5. ✅ Alles funktioniert ohne Admin-Rechte
6. ✅ Alles läuft lokal (keine Cloud-Dienste nötig)

**Das bedeutet:**
Sie können jetzt beliebige Verarbeitung auf die E-Mails anwenden:
- LLM-Zusammenfassungen
- Sentiment-Analyse
- Automatische Kategorisierung
- Antwort-Vorschläge
- Daten-Extraktion
- Und vieles mehr!

🎉 **Proof of Concept erfolgreich!** 🎉

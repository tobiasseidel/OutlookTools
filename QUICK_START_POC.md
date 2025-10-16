# 🚀 Quick Start: POC in 5 Minuten testen

## Schritt 1: FastAPI starten (2 Minuten)

```bash
# Terminal öffnen im Projekt-Verzeichnis
cd api

# Dependencies installieren (einmalig)
pip install -r requirements.txt

# Server starten
python main.py
```

✅ Server läuft auf: http://localhost:8000

**Test:** Öffnen Sie http://localhost:8000 im Browser → sollte JSON anzeigen

---

## Schritt 2: Dateien zu GitHub pushen (1 Minute)

```bash
# Im Projekt-Root
git add .
git commit -m "Add FastAPI POC"
git push origin HEAD
```

⏳ **Warten Sie 2 Minuten** bis GitHub Pages deployed.

---

## Schritt 3: Add-in installieren (1 Minute)

1. **Altes Add-in entfernen:**
   - https://outlook.office.com/owa/?path=/options/manageapps
   - "Mail Reader" entfernen (falls vorhanden)

2. **Neues Manifest installieren:**
   - "Add-in hinzufügen" → "Von Datei"
   - Datei wählen: `manifest-api-poc.xml`
   - Oder von URL: `https://tobiasseidel.github.io/OutlookTools/manifest-api-poc.xml`

3. **Outlook neu laden:** F5

---

## Schritt 4: POC testen (1 Minute)

1. **E-Mail öffnen** in Outlook (Doppelklick)
2. **Add-in öffnen:** `...` → Apps → "Mail Reader API"
3. **API testen:** Klick auf "🔌 API-Verbindung testen"
   - ✅ Sollte "API ist erreichbar" zeigen
4. **E-Mail lesen:** Klick auf "📬 E-Mail Daten auslesen"
   - ✅ Sollte E-Mail-Daten anzeigen
5. **An API senden:** Klick auf "🚀 An FastAPI senden"
   - ✅ Sollte "Erfolgreich verarbeitet" zeigen

---

## ✅ Erfolg!

Wenn alle Schritte funktionieren, haben Sie bewiesen:

- ✅ Outlook → Browser → localhost:8000 Kommunikation funktioniert
- ✅ E-Mail-Daten können ausgelesen werden
- ✅ FastAPI kann die Daten verarbeiten
- ✅ Ergebnisse werden zurück an Outlook gesendet

---

## ❌ Probleme?

### FastAPI läuft nicht
```bash
# Prüfen, ob Port 8000 frei ist
# Windows:
netstat -ano | findstr :8000
# Linux/Mac:
lsof -i :8000

# Server neu starten
cd api
python main.py
```

### API nicht erreichbar
- Firewall blockiert localhost?
- Browser Console öffnen (F12) → Fehler prüfen
- CORS-Fehler? → In `api/main.py` temporär `allow_origins=["*"]` setzen

### Add-in lädt nicht
- GitHub Pages deployed? → Prüfen: https://tobiasseidel.github.io/OutlookTools/taskpane-api.html
- Outlook neu laden (F5)
- Cache leeren (Strg+Shift+R)

---

## 📖 Vollständige Dokumentation

Siehe: **POC_FASTAPI_BRIDGE.md**

---

## 🎯 Nächste Schritte

Jetzt wo die Brücke funktioniert:

1. **LLM integrieren** (z.B. Ollama)
2. **E-Mail-Zusammenfassungen** generieren
3. **Antwort-Vorschläge** erstellen
4. **Sentiment-Analyse** hinzufügen

Alle Verarbeitungen passieren in `api/main.py` → `process_email()` Funktion!

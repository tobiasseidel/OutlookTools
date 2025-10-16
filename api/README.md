# FastAPI Server für Outlook Add-in POC

Dieser Server empfängt E-Mail-Daten vom Outlook Add-in und sendet verarbeitete Ergebnisse zurück.

## Installation

```bash
# Virtuelle Umgebung erstellen (optional aber empfohlen)
python -m venv venv

# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# Dependencies installieren
pip install -r requirements.txt
```

## Server starten

```bash
python main.py
```

Der Server läuft dann auf: http://localhost:8000

## API Dokumentation

Nach dem Start ist die interaktive API-Dokumentation verfügbar unter:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

### GET /
Health Check - zeigt verfügbare Endpoints

### GET /health
Detaillierter Health Check mit Timestamp

### POST /api/process-email
Empfängt E-Mail-Daten und gibt verarbeitete Ergebnisse zurück

**Request Body:**
```json
{
  "subject": "Betreff der E-Mail",
  "from_address": "absender@example.com",
  "to_recipients": "empfaenger@example.com",
  "body_preview": "E-Mail Inhalt...",
  "received_time": "2024-01-01T12:00:00",
  "item_id": "ABC123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "E-Mail erfolgreich verarbeitet",
  "processed_at": "2024-01-01T12:00:01",
  "summary": "E-Mail von absender@example.com mit 15 Wörtern",
  "word_count": 15,
  "sentiment": "neutral",
  "original_subject": "Betreff der E-Mail"
}
```

### POST /api/test
Test-Endpoint zum Prüfen der Verbindung

## CORS Konfiguration

Der Server ist konfiguriert für:
- GitHub Pages (https://tobiasseidel.github.io)
- Outlook Web (https://outlook.office.com)
- Localhost (für lokale Tests)

## Entwicklung / Erweiterung

In `main.py` können Sie die Verarbeitung in der Funktion `process_email()` anpassen:

```python
@app.post("/api/process-email")
async def process_email(email_data: EmailData):
    # Hier eigene Logik implementieren:
    # - LLM-Integration (z.B. Ollama)
    # - Sentiment-Analyse
    # - Zusammenfassungen
    # - etc.
    pass
```

## Sicherheit

⚠️ **WICHTIG für Produktion:**
- CORS-Origins auf spezifische Domains einschränken
- Authentication/Authorization hinzufügen
- HTTPS verwenden
- Rate Limiting implementieren
- Input-Validierung verstärken

Dieser POC ist für lokale Tests gedacht!

"""
FastAPI Server für Outlook Add-in POC
Empfängt E-Mail-Daten vom Outlook Add-in und sendet verarbeitete Daten zurück
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uvicorn
import nest_asyncio

# Erlaubt verschachtelte Event Loops (z.B. für Jupyter Notebooks)
nest_asyncio.apply()

app = FastAPI(
    title="Outlook Tools API",
    description="API für Outlook Add-in zur Verarbeitung von E-Mail-Daten",
    version="1.0.0"
)

# CORS Konfiguration - WICHTIG für localhost-Zugriff vom Browser!
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tobiasseidel.github.io",  # GitHub Pages
        "http://localhost:*",
        "http://127.0.0.1:*",
        "https://outlook.office.com",  # Outlook Web
        "https://outlook.office365.com",
        "https://*.outlook.com",  # Alle Outlook-Subdomains
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Alle HTTP-Methoden erlauben
    allow_headers=["*"],  # Alle Headers erlauben
)


# Datenmodelle
class EmailData(BaseModel):
    """E-Mail Daten vom Outlook Add-in"""
    subject: Optional[str] = None
    from_address: Optional[str] = None
    to_recipients: Optional[str] = None
    body_preview: Optional[str] = None
    received_time: Optional[str] = None
    item_id: Optional[str] = None


class ProcessedResponse(BaseModel):
    """Antwort nach Verarbeitung"""
    status: str
    message: str
    processed_at: str
    summary: Optional[str] = None
    word_count: Optional[int] = None
    sentiment: Optional[str] = None
    original_subject: Optional[str] = None


# Endpoints

@app.get("/")
async def root():
    """Health Check Endpoint"""
    return {
        "status": "running",
        "service": "Outlook Tools API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "process_email": "/api/process-email",
            "test": "/api/test"
        }
    }


@app.get("/health")
async def health_check():
    """Detaillierter Health Check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Outlook Tools API"
    }


@app.post("/api/process-email", response_model=ProcessedResponse)
async def process_email(email_data: EmailData):
    """
    Empfängt E-Mail-Daten vom Outlook Add-in und verarbeitet sie
    
    Dies ist ein POC - hier würde die eigentliche Verarbeitung stattfinden:
    - Zusammenfassung generieren
    - Sentiment-Analyse
    - Extraktion wichtiger Informationen
    - LLM-Integration (z.B. Ollama)
    """
    
    try:
        # Einfache Verarbeitung für POC
        word_count = len(email_data.body_preview.split()) if email_data.body_preview else 0
        
        # Dummy-Sentiment basierend auf Wortanzahl
        if word_count < 20:
            sentiment = "neutral"
        elif word_count < 50:
            sentiment = "informativ"
        else:
            sentiment = "ausführlich"
        
        # Einfache Zusammenfassung
        summary = f"E-Mail von {email_data.from_address or 'Unbekannt'} mit {word_count} Wörtern"
        
        response = ProcessedResponse(
            status="success",
            message="E-Mail erfolgreich verarbeitet",
            processed_at=datetime.now().isoformat(),
            summary=summary,
            word_count=word_count,
            sentiment=sentiment,
            original_subject=email_data.subject
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Fehler bei der Verarbeitung: {str(e)}"
        )


@app.post("/api/test")
async def test_connection(data: dict):
    """
    Test-Endpoint zum Prüfen der Verbindung
    """
    return {
        "status": "success",
        "message": "Verbindung erfolgreich!",
        "received_data": data,
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/test")
async def test_get():
    """
    GET Test-Endpoint
    """
    return {
        "status": "success",
        "message": "API ist erreichbar",
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Outlook Tools FastAPI Server")
    print("=" * 60)
    print("Server startet auf: http://localhost:8000")
    print("API Dokumentation: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    print("=" * 60)
    print("\nDrücken Sie STRG+C zum Beenden\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )

"""
Test-Skript für die FastAPI
Kann unabhängig von Outlook verwendet werden, um die API zu testen
"""

import requests
import json
from datetime import datetime

# API Base URL
API_URL = "http://localhost:8000"

def print_section(title):
    """Gibt einen schönen Section-Header aus"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_health_check():
    """Testet den Health-Check Endpoint"""
    print_section("Test 1: Health Check")
    
    try:
        response = requests.get(f"{API_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Health Check erfolgreich!")
            return True
        else:
            print("❌ Health Check fehlgeschlagen!")
            return False
    except Exception as e:
        print(f"❌ Fehler: {e}")
        print("Läuft der FastAPI Server?")
        return False

def test_root():
    """Testet den Root Endpoint"""
    print_section("Test 2: Root Endpoint")
    
    try:
        response = requests.get(f"{API_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Root Endpoint erfolgreich!")
            return True
        else:
            print("❌ Root Endpoint fehlgeschlagen!")
            return False
    except Exception as e:
        print(f"❌ Fehler: {e}")
        return False

def test_simple_connection():
    """Testet den Test-Endpoint"""
    print_section("Test 3: Test-Connection Endpoint")
    
    test_data = {
        "test": "Hallo von Python",
        "timestamp": datetime.now().isoformat()
    }
    
    try:
        response = requests.post(
            f"{API_URL}/api/test",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Request:\n{json.dumps(test_data, indent=2)}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Test-Connection erfolgreich!")
            return True
        else:
            print("❌ Test-Connection fehlgeschlagen!")
            return False
    except Exception as e:
        print(f"❌ Fehler: {e}")
        return False

def test_process_email():
    """Testet den Process-Email Endpoint mit Dummy-Daten"""
    print_section("Test 4: Process Email Endpoint")
    
    # Simulierte E-Mail-Daten
    email_data = {
        "subject": "Meeting morgen um 10 Uhr",
        "from_address": "chef@firma.de",
        "to_recipients": "ich@firma.de",
        "body_preview": "Hallo, ich würde gern morgen um 10 Uhr ein kurzes Meeting "
                       "mit dir haben, um die Quartalszahlen zu besprechen. "
                       "Passt dir das? Wir können auch gern online machen falls du "
                       "im Homeoffice bist. Bitte gib mir kurz Bescheid. "
                       "Viele Grüße",
        "received_time": datetime.now().isoformat(),
        "item_id": "ABC123XYZ789"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/api/process-email",
            json=email_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        print(f"\nE-Mail Daten:")
        print(f"  Betreff: {email_data['subject']}")
        print(f"  Von: {email_data['from_address']}")
        print(f"  Text: {email_data['body_preview'][:80]}...")
        
        print(f"\nAPI Antwort:\n{json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Process Email erfolgreich!")
            
            # Verarbeitete Daten anzeigen
            result = response.json()
            print("\n📊 Verarbeitete Informationen:")
            print(f"  Status: {result.get('status')}")
            print(f"  Zusammenfassung: {result.get('summary')}")
            print(f"  Wortanzahl: {result.get('word_count')}")
            print(f"  Sentiment: {result.get('sentiment')}")
            
            return True
        else:
            print("❌ Process Email fehlgeschlagen!")
            return False
    except Exception as e:
        print(f"❌ Fehler: {e}")
        return False

def test_long_email():
    """Testet mit einer längeren E-Mail"""
    print_section("Test 5: Längere E-Mail verarbeiten")
    
    long_body = """
    Sehr geehrte Damen und Herren,
    
    ich möchte mich hiermit für Ihr Angebot bedanken und gleichzeitig einige 
    Rückfragen stellen. Zunächst wäre es wichtig zu wissen, ob die genannten 
    Konditionen auch für Bestandskunden gelten oder nur für Neukunden.
    
    Weiterhin interessiert mich, welche Zahlungsmodalitäten Sie anbieten und 
    ob es möglich ist, eine Ratenzahlung zu vereinbaren. Falls ja, welche 
    Laufzeiten sind möglich und fallen dabei zusätzliche Gebühren an?
    
    Bezüglich der Lieferzeit hatte ich verstanden, dass Sie von 4-6 Wochen 
    ausgehen. Gibt es eine Möglichkeit, diese zu verkürzen, falls wir bereit 
    sind, einen Aufpreis zu zahlen?
    
    Ich würde mich über eine baldige Rückmeldung freuen, da wir zeitnah eine 
    Entscheidung treffen müssen. Am besten per E-Mail, alternativ können Sie 
    mich auch unter 0123-456789 erreichen.
    
    Mit freundlichen Grüßen
    Max Mustermann
    Geschäftsführer
    Musterfirma GmbH
    """
    
    email_data = {
        "subject": "Rückfragen zu Ihrem Angebot vom 15.10.2025",
        "from_address": "max.mustermann@musterfirma.de",
        "to_recipients": "vertrieb@firma.de",
        "body_preview": long_body,
        "received_time": datetime.now().isoformat(),
        "item_id": "LONG123"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/api/process-email",
            json=email_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Längere E-Mail erfolgreich verarbeitet!")
            print(f"\n📊 Ergebnis:")
            print(f"  Wortanzahl: {result.get('word_count')}")
            print(f"  Sentiment: {result.get('sentiment')}")
            print(f"  Zusammenfassung: {result.get('summary')}")
            return True
        else:
            print("❌ Verarbeitung fehlgeschlagen!")
            return False
    except Exception as e:
        print(f"❌ Fehler: {e}")
        return False

def run_all_tests():
    """Führt alle Tests aus"""
    print("\n" + "🧪"*30)
    print("  FastAPI Test Suite")
    print("🧪"*30)
    
    results = []
    
    # Test 1: Health Check
    results.append(("Health Check", test_health_check()))
    
    # Test 2: Root Endpoint
    results.append(("Root Endpoint", test_root()))
    
    # Test 3: Test Connection
    results.append(("Test Connection", test_simple_connection()))
    
    # Test 4: Process Email
    results.append(("Process Email", test_process_email()))
    
    # Test 5: Long Email
    results.append(("Long Email", test_long_email()))
    
    # Zusammenfassung
    print_section("Zusammenfassung")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
    
    print(f"\n📊 Ergebnis: {passed}/{total} Tests bestanden")
    
    if passed == total:
        print("\n🎉 Alle Tests erfolgreich! API funktioniert einwandfrei!")
    else:
        print("\n⚠️ Einige Tests sind fehlgeschlagen. Bitte prüfen Sie die Logs.")
    
    return passed == total

if __name__ == "__main__":
    try:
        success = run_all_tests()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️ Tests abgebrochen.")
        exit(1)

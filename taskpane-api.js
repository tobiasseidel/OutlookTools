(function(){
  // Globale Variable für E-Mail-Daten
  let currentEmailData = null;
  
  /**
   * Zeigt Daten in einem Element an
   */
  function displayData(elementId, data, asJSON = true) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = asJSON && typeof data === 'object' 
        ? JSON.stringify(data, null, 2) 
        : String(data);
    }
  }
  
  /**
   * Zeigt Status-Meldung an
   */
  function showStatus(message, type = 'info') {
    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.className = `status ${type}`;
    }
  }
  
  /**
   * Zeigt Inline-Status in einem Section an
   */
  function showSectionStatus(sectionId, message, type = 'info') {
    const statusElement = document.getElementById(sectionId);
    if (statusElement) {
      statusElement.className = `status ${type}`;
      statusElement.textContent = message;
      statusElement.classList.remove('hidden');
    }
  }
  
  /**
   * Aktualisiert Status-Badge
   */
  function updateBadge(badgeId, text, type) {
    const badge = document.getElementById(badgeId);
    if (badge) {
      badge.textContent = text;
      badge.className = `badge ${type}`;
      badge.classList.remove('hidden');
    }
  }
  
  /**
   * Liest E-Mail-Daten aus Outlook
   */
  function readEmail() {
    try {
      if (!Office.context || !Office.context.mailbox || !Office.context.mailbox.item) {
        showStatus('❌ Keine E-Mail geöffnet. Bitte öffnen Sie eine E-Mail.', 'error');
        displayData('email-data', 'Fehler: Kein Mail-Item verfügbar.');
        return;
      }
      
      showSectionStatus('email-status', '⏳ Lese E-Mail Daten...', 'info');
      
      const item = Office.context.mailbox.item;
      
      // Basis-Daten sammeln
      const emailData = {
        subject: item.subject || 'Kein Betreff',
        item_id: item.itemId || 'Keine ID',
        received_time: item.dateTimeCreated ? item.dateTimeCreated.toISOString() : new Date().toISOString()
      };
      
      // From-Adresse
      if (item.from) {
        if (item.from.emailAddress) {
          emailData.from_address = item.from.emailAddress;
        } else if (item.from.displayName) {
          emailData.from_address = item.from.displayName;
        }
      }
      
      // To-Recipients
      if (item.to && Array.isArray(item.to)) {
        emailData.to_recipients = item.to.map(r => r.emailAddress || r.displayName).join(', ');
      }
      
      // Body async laden
      if (item.body) {
        item.body.getAsync(Office.CoercionType.Text, function(result) {
          if (result && result.status === Office.AsyncResultStatus.Succeeded) {
            emailData.body_preview = result.value ? result.value.slice(0, 1000) : '';
            emailData.full_body_length = result.value ? result.value.length : 0;
          } else {
            emailData.body_preview = 'Fehler beim Laden';
            emailData.error = result && result.error ? result.error.message : 'Unbekannt';
          }
          
          // Speichern und anzeigen
          currentEmailData = emailData;
          displayData('email-data', emailData);
          showSectionStatus('email-status', '✅ E-Mail erfolgreich gelesen!', 'success');
          
          // "An API senden" Button aktivieren
          const sendBtn = document.getElementById('send-to-api');
          if (sendBtn) {
            sendBtn.disabled = false;
          }
          updateBadge('api-status-badge', 'Bereit', 'success');
        });
      } else {
        // Kein Body verfügbar
        emailData.body_preview = 'Body nicht verfügbar';
        currentEmailData = emailData;
        displayData('email-data', emailData);
        showSectionStatus('email-status', '⚠️ E-Mail gelesen (Body nicht verfügbar)', 'warning');
        
        const sendBtn = document.getElementById('send-to-api');
        if (sendBtn) {
          sendBtn.disabled = false;
        }
      }
      
    } catch (e) {
      console.error('Fehler beim Lesen der E-Mail:', e);
      showSectionStatus('email-status', '❌ Fehler: ' + String(e), 'error');
      displayData('email-data', 'Fehler beim Lesen: ' + String(e));
    }
  }
  
  /**
   * Testet die API-Verbindung
   */
  async function testApiConnection() {
    const apiUrlInput = document.getElementById('api-url');
    const apiUrl = apiUrlInput ? apiUrlInput.value : 'http://localhost:8000';
    
    showStatus('⏳ Teste API-Verbindung...', 'info');
    
    try {
      const response = await fetch(`${apiUrl}/api/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        showStatus('✅ API-Verbindung erfolgreich!', 'success');
        displayData('api-response', data);
        return true;
      } else {
        showStatus(`❌ API-Fehler: ${response.status} ${response.statusText}`, 'error');
        displayData('api-response', `Fehler: ${response.status} - ${response.statusText}`);
        return false;
      }
    } catch (e) {
      console.error('API-Verbindungsfehler:', e);
      showStatus('❌ Verbindung fehlgeschlagen. Läuft der FastAPI Server?', 'error');
      displayData('api-response', 
        `Verbindungsfehler: ${e.message}\n\n` +
        `Stellen Sie sicher, dass:\n` +
        `1. FastAPI läuft auf: ${apiUrl}\n` +
        `2. CORS ist korrekt konfiguriert\n` +
        `3. Keine Firewall blockiert localhost`
      );
      return false;
    }
  }
  
  /**
   * Sendet E-Mail-Daten an FastAPI
   */
  async function sendToApi() {
    if (!currentEmailData) {
      showSectionStatus('api-status', '❌ Keine E-Mail-Daten vorhanden. Bitte zuerst E-Mail lesen!', 'error');
      return;
    }
    
    const apiUrlInput = document.getElementById('api-url');
    const apiUrl = apiUrlInput ? apiUrlInput.value : 'http://localhost:8000';
    
    showSectionStatus('api-status', '⏳ Sende Daten an FastAPI...', 'info');
    updateBadge('api-status-badge', 'Sendet...', 'pending');
    displayData('api-response', 'Warte auf API-Antwort...');
    
    try {
      console.log('Sende an API:', apiUrl);
      console.log('Daten:', currentEmailData);
      
      const response = await fetch(`${apiUrl}/api/process-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(currentEmailData)
      });
      
      console.log('API Response Status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result);
        
        showSectionStatus('api-status', '✅ Erfolgreich verarbeitet!', 'success');
        updateBadge('api-status-badge', 'Erfolg', 'success');
        
        // Formatierte Anzeige
        const formattedResult = {
          '🎯 Status': result.status,
          '💬 Nachricht': result.message,
          '📊 Zusammenfassung': result.summary,
          '📝 Wortanzahl': result.word_count,
          '🎭 Sentiment': result.sentiment,
          '📧 Original Betreff': result.original_subject,
          '⏰ Verarbeitet am': result.processed_at
        };
        
        displayData('api-response', formattedResult);
      } else {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        
        showSectionStatus('api-status', `❌ API-Fehler: ${response.status}`, 'error');
        updateBadge('api-status-badge', 'Fehler', 'error');
        displayData('api-response', `Fehler ${response.status}:\n${errorText}`);
      }
    } catch (e) {
      console.error('Fehler beim API-Aufruf:', e);
      
      showSectionStatus('api-status', '❌ Verbindung fehlgeschlagen!', 'error');
      updateBadge('api-status-badge', 'Fehler', 'error');
      
      displayData('api-response', 
        `Verbindungsfehler: ${e.message}\n\n` +
        `Troubleshooting:\n` +
        `1. Läuft FastAPI auf ${apiUrl}?\n` +
        `2. Prüfen Sie die Browser Console (F12)\n` +
        `3. CORS-Fehler? Siehe FastAPI Logs\n` +
        `4. Firewall blockiert localhost?`
      );
    }
  }
  
  /**
   * Office.js Initialisierung
   */
  Office.onReady(function(info){
    try {
      showStatus('✅ Office.js geladen. Host: ' + (info.host || 'unbekannt'), 'success');
      console.log('Office.js initialisiert:', info);
      
      // Event Listeners
      const readBtn = document.getElementById('read');
      if (readBtn) {
        readBtn.onclick = readEmail;
      }
      
      const sendBtn = document.getElementById('send-to-api');
      if (sendBtn) {
        sendBtn.onclick = sendToApi;
      }
      
      const testApiBtn = document.getElementById('test-api');
      if (testApiBtn) {
        testApiBtn.onclick = testApiConnection;
      }
      
      console.log('Event Listeners registriert');
      
    } catch (e) {
      console.error('Initialisierungsfehler:', e);
      showStatus('❌ Initialisierungsfehler: ' + String(e), 'error');
    }
  }).catch(function(err){
    console.error('Office.onReady Fehler:', err);
    showStatus('❌ Office.onReady Fehler: ' + String(err), 'error');
  });
})();

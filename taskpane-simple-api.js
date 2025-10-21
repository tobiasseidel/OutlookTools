(function(){
  let emailData = null;
  
  function log(obj){
    const outElement = document.getElementById('out');
    if (outElement) {
      outElement.textContent = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
    }
  }
  
  function updateStatus(msg, type = 'status'){
    const statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.textContent = msg;
      statusEl.className = type;
    }
  }
  
  async function testAPI(){
    const apiUrl = document.getElementById('api-url').value;
    updateStatus('⏳ Teste API...', 'status');
    
    try {
      const response = await fetch(`${apiUrl}/api/test`);
      if (response.ok) {
        const data = await response.json();
        updateStatus('✅ API erreichbar!', 'status success');
        log(data);
      } else {
        updateStatus(`❌ API Fehler: ${response.status}`, 'status error');
        log(`Fehler: ${response.status}`);
      }
    } catch (e) {
      updateStatus('❌ API nicht erreichbar', 'status error');
      log(`Fehler: ${e.message}\n\nPrüfen Sie:\n- Läuft FastAPI auf ${apiUrl}?\n- CORS korrekt konfiguriert?`);
    }
  }
  
  function readEmail(){
    if (!Office.context || !Office.context.mailbox || !Office.context.mailbox.item) {
      updateStatus('❌ Keine E-Mail geöffnet', 'status error');
      log('Fehler: Kein Mail-Item verfügbar.');
      return;
    }
    
    const item = Office.context.mailbox.item;
    emailData = {
      subject: item.subject || 'Kein Betreff',
      from_address: item.from ? (item.from.emailAddress || item.from.displayName) : 'Unbekannt',
      received_time: item.dateTimeCreated ? item.dateTimeCreated.toISOString() : new Date().toISOString()
    };
    
    if (item.body) {
      item.body.getAsync(Office.CoercionType.Text, function(result){
        if (result && result.status === Office.AsyncResultStatus.Succeeded) {
          emailData.body_preview = result.value ? result.value.slice(0, 1000) : '';
        }
        log(emailData);
        updateStatus('✅ E-Mail gelesen', 'status success');
      });
    } else {
      log(emailData);
      updateStatus('✅ E-Mail gelesen (Body nicht verfügbar)', 'status success');
    }
  }
  
  async function sendToAPI(){
    if (!emailData) {
      updateStatus('❌ Keine E-Mail-Daten. Bitte zuerst Mail lesen!', 'status error');
      return;
    }
    
    const apiUrl = document.getElementById('api-url').value;
    updateStatus('⏳ Sende an API...', 'status');
    
    try {
      const response = await fetch(`${apiUrl}/api/process-email`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(emailData)
      });
      
      if (response.ok) {
        const result = await response.json();
        updateStatus('✅ Erfolgreich verarbeitet!', 'status success');
        log(result);
      } else {
        updateStatus(`❌ API Fehler: ${response.status}`, 'status error');
        log(`Fehler: ${response.status}`);
      }
    } catch (e) {
      updateStatus('❌ Fehler beim Senden', 'status error');
      log(`Fehler: ${e.message}`);
    }
  }
  
  Office.onReady(function(info){
    updateStatus('✅ Office.js geladen', 'status success');
    
    document.getElementById('test-api').onclick = testAPI;
    document.getElementById('read').onclick = readEmail;
    document.getElementById('send-to-api').onclick = sendToAPI;
  }).catch(function(err){
    updateStatus('❌ Office.onReady Fehler', 'status error');
    log('Fehler: ' + String(err));
  });
})();

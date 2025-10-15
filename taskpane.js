(function(){
  function log(obj){
    try {
      var outElement = document.getElementById('out');
      if (outElement) {
        outElement.textContent = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
      }
    } catch (e) {
      console.error('Fehler beim Loggen:', e);
    }
  }
  
  Office.onReady(function(info){
    try {
      var statusElement = document.getElementById('status');
      if (statusElement) {
        statusElement.textContent = 'Office.js geladen. Host: ' + (info.host || 'unbekannt');
      }
      log('Office.js erfolgreich initialisiert.');
      
      var btn = document.getElementById('read');
      if (!btn) {
        log('Fehler: Button nicht gefunden');
        return;
      }
      
      btn.onclick = function(){
        try {
          if (!Office.context || !Office.context.mailbox || !Office.context.mailbox.item) {
            log('Fehler: Kein Mail-Item verfügbar. Bitte öffnen Sie eine E-Mail.');
            return;
          }
          
          var item = Office.context.mailbox.item;
          var subject = item.subject || '';
          var from = '';
          
          if (item.from && item.from.emailAddress) {
            from = item.from.emailAddress;
          } else if (item.from && item.from.displayName) {
            from = item.from.displayName;
          }
          
          if (!item.body) {
            log({ subject: subject, from: from, bodyPreview: 'Body nicht verfügbar' });
            return;
          }
          
          item.body.getAsync(Office.CoercionType.Text, function(res){
            if (res && res.status === Office.AsyncResultStatus.Succeeded) {
              var body = res.value || '';
              log({ 
                subject: subject, 
                from: from, 
                bodyPreview: body.slice(0, 1000),
                timestamp: new Date().toISOString()
              });
            } else {
              log({ 
                subject: subject, 
                from: from, 
                bodyPreview: 'Fehler beim Laden des Body',
                error: res && res.error ? res.error.message : 'Unbekannter Fehler'
              });
            }
          });
        } catch (e) {
          log('Fehler beim Lesen: ' + String(e));
        }
      };
    } catch (e) {
      log('Initialisierungsfehler: ' + String(e));
    }
  }).catch(function(err){
    log('Office.onReady Fehler: ' + String(err));
  });
})();

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
  
  function updateDebugInfo() {
    var debugElement = document.getElementById('debug-context');
    if (!debugElement) return;
    
    var info = [];
    info.push('Office: ' + (typeof Office !== 'undefined' ? '✅' : '❌'));
    
    if (typeof Office !== 'undefined' && Office.context) {
      info.push('Context: ✅');
      if (Office.context.mailbox) {
        info.push('Mailbox: ✅');
        if (Office.context.mailbox.item) {
          info.push('Item: ✅ (E-Mail geöffnet)');
        } else {
          info.push('Item: ❌ (Keine E-Mail)');
        }
      } else {
        info.push('Mailbox: ❌');
      }
    } else {
      info.push('Context: ❌');
    }
    
    debugElement.innerHTML = info.join('<br>');
  }
  
  Office.onReady(function(info){
    try {
      var statusElement = document.getElementById('status');
      if (statusElement) {
        statusElement.textContent = '✅ Office.js geladen. Host: ' + (info.host || 'unbekannt');
        statusElement.className = 'status success';
      }
      log('Office.js erfolgreich initialisiert.');
      
      updateDebugInfo();
      
      var btn = document.getElementById('read');
      if (!btn) {
        log('Fehler: Button nicht gefunden');
        return;
      }
      
      var testBtn = document.getElementById('test-context');
      if (testBtn) {
        testBtn.onclick = function() {
          updateDebugInfo();
          log('Context-Test durchgeführt. Siehe Debug-Info oben.');
        };
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
      var statusElement = document.getElementById('status');
      if (statusElement) {
        statusElement.textContent = '❌ Fehler: ' + String(e);
        statusElement.className = 'status error';
      }
    }
  }).catch(function(err){
    log('Office.onReady Fehler: ' + String(err));
    var statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = '❌ Office.onReady Fehler: ' + String(err);
      statusElement.className = 'status error';
    }
  });
})();

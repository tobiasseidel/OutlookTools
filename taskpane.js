(function(){
  function log(obj){
    document.getElementById('out').textContent = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
  }
  Office.onReady(function(){
    var btn = document.getElementById('read');
    btn.onclick = function(){
      try {
        var item = Office.context.mailbox.item;
        var subject = item && item.subject ? item.subject : '';
        var from = (item && item.from && item.from.emailAddress) ? item.from.emailAddress : '';
        item.body.getAsync(Office.CoercionType.Text, function(res){
          var body = res && res.status === Office.AsyncResultStatus.Succeeded ? res.value : '';
          log({ subject: subject, from: from, bodyPreview: (body||'').slice(0, 1000) });
        });
      } catch (e) {
        log(String(e));
      }
    };
  });
})();

// Directory-listing size auto-fill: for each file row this does a HEAD
// request on the row's link and swaps the file's actual size into the Size
// column, so nobody has to hand-edit the listing after dropping a real file
// into /projects/.
(function(){
  function formatBytes(bytes){
    if(bytes < 1024) return bytes + ' B';
    var units = ['KB', 'MB', 'GB'];
    var val = bytes, i = -1;
    do { val /= 1024; i++; } while(val >= 1024 && i < units.length - 1);
    return (val < 10 ? val.toFixed(1) : Math.round(val)) + ' ' + units[i];
  }

  var rows = document.querySelectorAll('table.listing tbody tr');
  Array.prototype.forEach.call(rows, function(row){
    var tag = row.querySelector('.tag');
    if(!tag || tag.textContent.trim() === '[UP]' || tag.textContent.trim() === '[DIR]') return;

    var link = row.querySelector('a[href]');
    var sizeCell = row.children[2];
    if(!link || !sizeCell) return;

    var href = link.getAttribute('href');
    if(!href) return;

    fetch(href, { method: 'HEAD' }).then(function(res){
      if(!res.ok) return;
      var len = res.headers.get('Content-Length');
      if(!len) return;
      sizeCell.textContent = formatBytes(parseInt(len, 10));
    }).catch(function(){ /* file isn't there yet, keep the placeholder */ });
  });
})();

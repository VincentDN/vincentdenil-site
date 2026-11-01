// Shared procedural ASCII tunnel for the FTP-style index pages (copied from /projects/index.html).
    // Procedural ASCII tunnel effect (classic demoscene technique):
    // each cell's polar coordinates are precomputed once, then a rotating,
    // scrolling checker pattern sampled through them each frame. The grid
    // is sized from the container's actual pixel size (not a fixed count)
    // so the art always fills the box edge to edge.
    (function(){
      var pre = document.getElementById('tunnel');
      if(!pre) return;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      var CHARS = ' .:-=+*#%@';
      var TEX_ANGLE = 12;
      var COLS, ROWS, cx, cy, cells;

      function measureChar(){
        var probe = document.createElement('span');
        probe.style.position = 'absolute';
        probe.style.visibility = 'hidden';
        probe.style.whiteSpace = 'pre';
        probe.style.font = getComputedStyle(pre).font;
        probe.textContent = 'M'.repeat(40);
        document.body.appendChild(probe);
        var w = probe.getBoundingClientRect().width / 40;
        document.body.removeChild(probe);
        var lh = parseFloat(getComputedStyle(pre).lineHeight);
        if(!lh) lh = parseFloat(getComputedStyle(pre).fontSize) * 1.15;
        return { w: w, h: lh };
      }

      function rebuild(){
        var rect = pre.getBoundingClientRect();
        var ch = measureChar();
        COLS = Math.max(20, Math.floor(rect.width / ch.w));
        ROWS = Math.max(10, Math.floor(rect.height / ch.h));
        cx = COLS / 2; cy = ROWS / 2;
        cells = new Array(COLS * ROWS);
        for(var y = 0; y < ROWS; y++){
          for(var x = 0; x < COLS; x++){
            var dx = (x - cx) / COLS;
            var dy = ((y - cy) / ROWS) * 0.62; // squash for monospace char aspect ratio
            var dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;
            cells[y * COLS + x] = { dist: dist, angle: Math.atan2(dy, dx) };
          }
        }
      }

      var t = 0;
      function render(){
        t += 0.09;
        var out = '';
        for(var y = 0; y < ROWS; y++){
          var row = '';
          for(var x = 0; x < COLS; x++){
            var c = cells[y * COLS + x];
            var u = (1 / c.dist) * 2.4 - t * 2.2;      // scroll toward viewer
            var a = c.angle + t * 0.12;                 // slow swirl
            var depthIdx = Math.floor(u);
            var angleIdx = Math.floor(((a / (Math.PI * 2)) + 1) * TEX_ANGLE);
            var checker = (depthIdx + angleIdx) & 1;
            var fog = Math.min(1, 1 / (c.dist * 3.4));   // fades into the dark at range
            var level = checker ? fog : fog * 0.28;
            var idx = Math.max(0, Math.min(CHARS.length - 1, Math.round(level * (CHARS.length - 1))));
            row += CHARS[idx];
          }
          out += row + (y < ROWS - 1 ? '\n' : '');
        }
        pre.textContent = out;
      }

      rebuild();
      render();
      if(reduce) return;

      var resizeTimer;
      window.addEventListener('resize', function(){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(rebuild, 150);
      });

      setInterval(render, 80);
    })();
  
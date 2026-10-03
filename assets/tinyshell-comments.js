/*!
 * vTinyShell Comments — select-text-and-comment widget.
 *
 * Drop-in port of the comment engine from vdn-internal's ops-wiki/FMP_VA_Wiki.html,
 * generalized to work across many separate pages sharing one comments store
 * instead of many sections inside one page. Filename kept as
 * tinyshell-comments.js (referenced by 32 pages) even though the tool itself
 * was renamed to vTinyShell. Include with a single tag:
 *
 *   <script src="/assets/tinyshell-comments.js" defer></script>
 *
 * Needs vTinyShell (tools/vTinyShell.bat / .sh) running for comments to
 * persist to disk (feedback/comments.json + .md) and for image attachments /
 * "Show on disk" to work. Opened directly as a file:// page, comments still
 * work but fall back to this browser's localStorage.
 *
 * Every comment is tagged with the page it was left on (location.pathname),
 * so a single shared feedback/comments.json can hold comments from every page
 * that includes this script, while each page only shows and highlights its
 * own.
 */
(function () {
  'use strict';

  var PAGE_ID = location.pathname;
  var PAGE_TITLE = document.title || PAGE_ID;
  var STORAGE_KEY = 'tinyshell_comments_v1';

  // ── inject styles ────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '::highlight(va-comment) { background-color: #fff176; color: #1a1a1a; }',
    '.va-select-btn{position:absolute;z-index:200;display:none;align-items:center;gap:6px;background:var(--panel-3,#0f4a70);color:#fff;border:none;border-radius:20px;padding:7px 14px 7px 12px;font-size:12.5px;font-weight:700;font-family:var(--font-sans,sans-serif);cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.35)}',
    '.va-select-btn:hover{background:var(--accent,#7ab0d6);color:#04202f}',
    '.va-comment-editor{position:absolute;z-index:201;display:none;width:300px;max-width:88vw;background:var(--panel,#061f30);border:1px solid var(--line-strong,rgba(122,170,205,.4));border-radius:8px;box-shadow:0 14px 34px rgba(0,0,0,.4);padding:12px}',
    '.va-comment-editor .quote{font-size:12px;color:var(--text-dim,#7ab0d6);background:rgba(122,170,205,.08);border-left:3px solid #fbc02d;padding:6px 8px;margin-bottom:8px;max-height:70px;overflow-y:auto;font-style:italic}',
    '.va-comment-editor textarea{width:100%;min-height:70px;resize:vertical;border:1px solid var(--line-strong,rgba(122,170,205,.4));border-radius:4px;padding:7px 9px;font-family:var(--font-sans,sans-serif);font-size:13px;color:var(--text,#f2f7fb);background:var(--flat,#002b43);box-sizing:border-box}',
    '.va-comment-editor .row{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:8px}',
    '.va-comment-editor .row .spacer{flex:1}',
    '.va-comment-editor button{font-family:var(--font-sans,sans-serif);font-size:12.5px;font-weight:700;border-radius:4px;padding:6px 12px;cursor:pointer;border:1px solid transparent}',
    '.va-comment-editor .save-btn{background:var(--accent,#7ab0d6);color:#04202f}',
    '.va-comment-editor .save-btn:hover{background:var(--accent-strong,#a7cbe8)}',
    '.va-comment-editor .cancel-btn{background:transparent;color:var(--text-dim,#7ab0d6);border-color:var(--line-strong,rgba(122,170,205,.4))}',
    '.va-comment-editor .cancel-btn:hover{color:var(--text,#f2f7fb)}',
    '.va-comment-editor .attach-btn{background:transparent;color:var(--text-dim,#7ab0d6);border-color:var(--line-strong,rgba(122,170,205,.4));font-weight:600}',
    '.va-comment-editor .attach-btn:hover{color:var(--text,#f2f7fb)}',
    '.va-editor-images,.va-item-images{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}',
    '.va-editor-images:empty,.va-item-images:empty{margin-top:0}',
    '.va-img-thumb{position:relative;width:56px;height:56px;border-radius:4px;overflow:hidden;border:1px solid var(--line-strong,rgba(122,170,205,.4));background:rgba(122,170,205,.08)}',
    '.va-img-thumb img{width:100%;height:100%;object-fit:cover;display:block;cursor:pointer}',
    '.va-img-thumb .rm-btn{position:absolute;top:1px;right:1px;width:16px;height:16px;line-height:14px;text-align:center;background:rgba(0,0,0,.6);color:#fff;border-radius:50%;font-size:11px;cursor:pointer;border:none;padding:0}',
    '.va-img-thumb.uploading{opacity:.5}',
    '.va-comment-fab{position:fixed;right:22px;bottom:22px;z-index:190;display:flex;align-items:center;gap:8px;background:var(--panel-3,#0f4a70);color:#fff;border:none;border-radius:24px;padding:11px 18px 11px 15px;font-family:var(--font-sans,sans-serif);font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 8px 22px rgba(0,0,0,.4)}',
    '.va-comment-fab:hover{background:var(--accent,#7ab0d6);color:#04202f}',
    '.va-comment-fab .count{background:var(--accent,#7ab0d6);color:#04202f;border-radius:10px;padding:1px 8px;font-size:11.5px}',
    '.va-comment-panel{position:fixed;top:0;right:0;width:380px;max-width:92vw;height:100vh;background:var(--panel,#061f30);color:var(--text,#f2f7fb);z-index:250;display:none;flex-direction:column;box-shadow:-10px 0 34px rgba(0,0,0,.4)}',
    '.va-comment-panel-header{padding:18px 18px 14px;border-bottom:1px solid var(--line,rgba(122,170,205,.22));display:flex;align-items:baseline;justify-content:space-between;gap:8px}',
    '.va-comment-panel-header h2{font-size:15px;font-weight:800;color:var(--text,#f2f7fb);margin:0}',
    '.va-comment-panel-header .close-btn{background:none;border:none;font-size:20px;line-height:1;cursor:pointer;color:var(--text-dim,#7ab0d6)}',
    '.va-comment-panel-sub{padding:0 18px 12px;font-size:12px;color:var(--text-dim,#7ab0d6)}',
    '.va-comment-panel-actions{display:flex;gap:8px;padding:0 18px 14px;flex-wrap:wrap}',
    '.va-comment-panel-actions button{font-family:var(--font-sans,sans-serif);font-size:12px;font-weight:700;border-radius:4px;padding:7px 11px;cursor:pointer;border:1px solid var(--line-strong,rgba(122,170,205,.4));background:rgba(122,170,205,.08);color:var(--text,#f2f7fb)}',
    '.va-comment-panel-actions button:hover{background:rgba(122,170,205,.18)}',
    '.va-comment-panel-actions button.primary{background:var(--accent,#7ab0d6);color:#04202f;border-color:var(--accent,#7ab0d6)}',
    '.va-comment-panel-actions button.primary:hover{background:var(--accent-strong,#a7cbe8)}',
    '.va-comment-panel-actions button:disabled{opacity:.45;cursor:not-allowed}',
    '.va-comment-list{flex:1;overflow-y:auto;padding:4px 18px 18px}',
    '.va-comment-empty{color:var(--text-dim,#7ab0d6);font-size:13px;padding:20px 0;text-align:center}',
    '.va-comment-item{border:1px solid var(--line,rgba(122,170,205,.22));border-radius:6px;padding:10px 12px;margin-bottom:10px}',
    '.va-comment-item .section-label{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--accent,#7ab0d6);margin-bottom:4px}',
    '.va-comment-item .quote{font-size:12px;font-style:italic;color:var(--text-dim,#7ab0d6);background:rgba(122,170,205,.08);border-left:3px solid #fbc02d;padding:5px 7px;margin-bottom:6px}',
    '.va-comment-item .text{font-size:13px;color:var(--text,#f2f7fb);margin-bottom:6px;white-space:pre-wrap}',
    '.va-comment-item .meta{font-size:10.5px;color:var(--text-dimmer,#5f8fae);margin-bottom:6px}',
    '.va-comment-item .item-actions{display:flex;gap:8px;flex-wrap:wrap}',
    '.va-comment-item .item-actions button{font-family:var(--font-sans,sans-serif);font-size:11px;font-weight:700;border-radius:3px;padding:4px 9px;cursor:pointer;border:1px solid var(--line-strong,rgba(122,170,205,.4));background:transparent;color:var(--text-dim,#7ab0d6)}',
    '.va-comment-item .item-actions button:hover{color:var(--text,#f2f7fb)}',
    '.va-comment-item .item-actions button.edit-btn:hover{color:var(--accent,#7ab0d6);border-color:var(--accent,#7ab0d6)}',
    '.va-comment-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:240;display:none}',
    '.va-comment-flash{outline:3px solid #fbc02d;outline-offset:3px;transition:outline-color 1.2s ease}',
    '.va-export-box{width:100%;min-height:140px;font-family:var(--font-mono,monospace);font-size:11.5px;border:1px solid var(--line-strong,rgba(122,170,205,.4));border-radius:4px;padding:8px;box-sizing:border-box;background:var(--flat,#002b43);color:var(--text,#f2f7fb)}',
    '.va-hover-tip{position:absolute;z-index:195;display:none;max-width:300px;background:var(--panel,#061f30);color:var(--text,#f2f7fb);font-size:12.5px;line-height:1.5;padding:10px 12px;border-radius:6px;border:1px solid #fbc02d;border-left:4px solid #fbc02d;box-shadow:0 10px 26px rgba(0,0,0,.4);pointer-events:none}',
    '.va-hover-tip .section-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#fbc02d;margin-bottom:4px}',
    '.va-hover-tip .text{white-space:pre-wrap}',
    '.va-hover-tip .edit-hint{margin-top:6px;font-size:10.5px;color:var(--text-dimmer,#5f8fae);font-style:italic}',
    '.va-hover-tip .thumbs{display:flex;gap:4px;margin-top:6px}',
    '.va-hover-tip .thumbs img{width:32px;height:32px;object-fit:cover;border-radius:3px;border:1px solid var(--line-strong,rgba(122,170,205,.4))}',
    '@media print{.va-comment-fab,.va-select-btn,.va-comment-editor,.va-comment-panel{display:none!important}}'
  ].join('\n');
  document.head.appendChild(style);

  // ── inject DOM scaffold ──────────────────────────────────
  var scaffold = document.createElement('div');
  scaffold.innerHTML =
    '<button type="button" class="va-select-btn" id="vaSelectBtn">💬 Comment</button>' +
    '<div class="va-comment-editor" id="vaCommentEditor">' +
      '<div class="quote" id="vaEditorQuote"></div>' +
      '<textarea id="vaEditorText" placeholder="Your note on this text…"></textarea>' +
      '<div class="va-editor-images" id="vaEditorImages"></div>' +
      '<input type="file" id="vaFileInput" accept="image/*" multiple style="display:none">' +
      '<div class="row">' +
        '<button type="button" class="attach-btn" id="vaAttachBtn">📎 Attach image</button>' +
        '<span class="spacer"></span>' +
        '<button type="button" class="cancel-btn" id="vaEditorCancel">Cancel</button>' +
        '<button type="button" class="save-btn" id="vaEditorSave">Save comment</button>' +
      '</div>' +
    '</div>' +
    '<div class="va-hover-tip" id="vaHoverTip"></div>' +
    '<button type="button" class="va-comment-fab" id="vaFab">📝 Comments <span class="count" id="vaFabCount">0</span></button>' +
    '<div class="va-comment-overlay" id="vaOverlay"></div>' +
    '<div class="va-comment-panel" id="vaPanel">' +
      '<div class="va-comment-panel-header"><h2>Comments on this page</h2><button type="button" class="close-btn" id="vaPanelClose">&times;</button></div>' +
      '<div class="va-comment-panel-sub" id="vaStorageStatus">Checking storage…</div>' +
      '<div class="va-comment-panel-actions">' +
        '<button type="button" class="primary" id="vaCopyBtn">Copy all as text</button>' +
        '<button type="button" id="vaDownloadBtn">Download .txt</button>' +
        '<button type="button" id="vaRevealBtn">📂 Show on disk</button>' +
        '<button type="button" id="vaClearBtn">Clear this page’s comments</button>' +
      '</div>' +
      '<div class="va-comment-list" id="vaCommentList"></div>' +
    '</div>';
  while (scaffold.firstChild) document.body.appendChild(scaffold.firstChild);

  // ── wire up ──────────────────────────────────────────────
  var content = document.querySelector('main') || document.body;
  var selectBtn = document.getElementById('vaSelectBtn');
  var editor = document.getElementById('vaCommentEditor');
  var editorQuote = document.getElementById('vaEditorQuote');
  var editorText = document.getElementById('vaEditorText');
  var editorSave = document.getElementById('vaEditorSave');
  var editorCancel = document.getElementById('vaEditorCancel');
  var fab = document.getElementById('vaFab');
  var fabCount = document.getElementById('vaFabCount');
  var overlay = document.getElementById('vaOverlay');
  var panel = document.getElementById('vaPanel');
  var panelClose = document.getElementById('vaPanelClose');
  var list = document.getElementById('vaCommentList');
  var copyBtn = document.getElementById('vaCopyBtn');
  var downloadBtn = document.getElementById('vaDownloadBtn');
  var revealBtn = document.getElementById('vaRevealBtn');
  var clearBtn = document.getElementById('vaClearBtn');
  var hoverTip = document.getElementById('vaHoverTip');
  var editorImagesBox = document.getElementById('vaEditorImages');
  var attachBtn = document.getElementById('vaAttachBtn');
  var fileInput = document.getElementById('vaFileInput');

  var supportsHighlight = !!(window.Highlight && window.CSS && CSS.highlights);
  var pendingRange = null; // Range captured when the select-button was clicked
  var editorImages = []; // image URLs staged in the currently-open editor

  // ── storage ──────────────────────────────────────────────
  // Source of truth is the local server's /api/comments (writes to disk under
  // feedback/), when this page is opened via tools/vTinyShell.bat/.sh. Opened
  // directly as a file:// page, there's no server to talk to, so we fall back
  // to this browser's localStorage — same UI either way. One comments store
  // is shared by every page that includes this script; each page filters to
  // its own comments (matched by PAGE_ID) for display, but always persists
  // the full cross-page list so other pages' comments are never clobbered.
  var storageStatusEl = document.getElementById('vaStorageStatus');
  var serverAvailable = false;
  var allComments = []; // every comment, from every page, as last loaded/saved
  var comments = [];    // this page's own comments — what render* functions read

  function syncFromAll() {
    comments = allComments.filter(function (c) { return c.sectionId === PAGE_ID; });
  }

  function loadLocal() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  function saveLocal(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function updateStorageStatus() {
    if (storageStatusEl) {
      storageStatusEl.innerHTML = serverAvailable
        ? 'Saved to disk in <code>feedback/</code> (comments.json + comments.md) — nothing leaves your machine.'
        : 'Saved only in this browser (<code>localStorage</code>) — start <code>tools/vTinyShell.bat</code> / <code>.sh</code> to save to disk instead (also needed for image attachments and "Show on disk"). Export below meanwhile.';
    }
    if (revealBtn) revealBtn.disabled = !serverAvailable;
  }
  function saveComments(list) {
    saveLocal(list); // always keep a local copy as a safety net
    if (!serverAvailable) return;
    fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments: list, exportText: buildExportText(list) })
    }).catch(function () {
      serverAvailable = false;
      updateStorageStatus();
    });
  }
  var SYNCED_KEY = STORAGE_KEY + '_synced';
  allComments = loadLocal(); // provisional, replaced once initComments() resolves
  syncFromAll();

  // A comment's anchor is a (sectionId, start, end) character-offset span
  // into this page's own text, not a match on its actual content — so once
  // the page is edited (e.g. its feedback gets incorporated during a review
  // pass), old offsets just point at whatever new text now occupies that
  // span. That's how a resolved comment appears to "jump" onto unrelated
  // nearby text instead of disappearing: nothing detects the drift on its
  // own. Each comment keeps its original selected text in `quote`, so we can
  // check the live text at its saved offsets still matches, and drop it if
  // not. Only comments belonging to *this* page can be checked here (other
  // pages' comments pass through untouched — each validates its own on its
  // own load). Deleted outright rather than just hidden — git history is the
  // rollback path, not a soft-delete flag in this store.
  function pruneOrphanedComments(list) {
    return list.filter(function (c) {
      if (c.sectionId !== PAGE_ID) return true;
      if (!c.quote || c.start === null || c.start === undefined || c.end === null || c.end === undefined) return true;
      var live = getFilteredText(content).slice(c.start, c.end).trim();
      return live === c.quote;
    });
  }

  function initComments() {
    fetch('/api/comments', { cache: 'no-store' })
      .then(function (res) { if (!res.ok) throw new Error('no api'); return res.json(); })
      .then(function (serverList) {
        serverAvailable = true;
        var local = loadLocal();
        var everSynced = false;
        try { everSynced = localStorage.getItem(SYNCED_KEY) === '1'; } catch (e) {}
        var migrated = false;
        if (!everSynced && (!serverList || !serverList.length) && local.length) {
          // genuinely the first time this browser has ever talked to a
          // server — preserve locally-drafted comments by pushing them up.
          allComments = local;
          migrated = true;
        } else {
          // The server is authoritative from here on, including when it's
          // empty: once we've synced at least once, an empty server list
          // means comments were resolved and cleared, not that this browser
          // has unsynced local work to push back up. Re-migrating stale
          // localStorage comments every load was the actual bug — resolved
          // comments kept resurrecting themselves after being cleared.
          allComments = Array.isArray(serverList) ? serverList : [];
        }
        try { localStorage.setItem(SYNCED_KEY, '1'); } catch (e) {}
        var before = allComments.length;
        allComments = pruneOrphanedComments(allComments);
        if (migrated || allComments.length !== before) {
          saveComments(allComments);
        } else {
          saveLocal(allComments); // keep the local cache in sync with the server even when nothing changed
        }
        syncFromAll();
        updateStorageStatus();
        renderHighlights();
        renderPanel();
      })
      .catch(function () {
        serverAvailable = false;
        var loaded = loadLocal();
        allComments = pruneOrphanedComments(loaded);
        if (allComments.length !== loaded.length) saveLocal(allComments);
        syncFromAll();
        updateStorageStatus();
        renderHighlights();
        renderPanel();
      });
  }

  // ── DOM helpers ──────────────────────────────────────────
  // Text nodes that participate in offset counting for comments. Excludes the
  // comment UI itself so a selection dragged across the page never sweeps in
  // any of that hidden/floating markup.
  function textNodesIn(container) {
    var nodes = [];
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentElement;
        if (p && p.closest('.va-comment-editor, .va-select-btn, .va-comment-panel, .va-comment-fab, .tip')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }
  // The same filtered text as one string, in document order — matches the
  // coordinate space rangeToOffsets/offsetsToRange use, so slicing this by
  // {start, end} always agrees with what those offsets actually point at.
  function getFilteredText(container) {
    return textNodesIn(container).map(function (n) { return n.textContent; }).join('');
  }
  // Resolve a Range boundary (which may land on an element, not a text node) to a {node, offset} on a text node.
  function resolveBoundary(container, node, offset) {
    if (node.nodeType === Node.TEXT_NODE) return { node: node, offset: offset };
    var kids = node.childNodes;
    if (offset >= kids.length) {
      var nodes = textNodesIn(container);
      return nodes.length ? { node: nodes[nodes.length - 1], offset: nodes[nodes.length - 1].length } : null;
    }
    var target = kids[offset];
    var walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, null);
    var first = walker.nextNode();
    if (first) return { node: first, offset: 0 };
    // no text inside target — fall back to first text node at/after target in the whole container
    var all = textNodesIn(container);
    for (var i = 0; i < all.length; i++) {
      if (target.compareDocumentPosition(all[i]) & Node.DOCUMENT_POSITION_FOLLOWING || target === all[i]) return { node: all[i], offset: 0 };
    }
    return all.length ? { node: all[0], offset: 0 } : null;
  }
  // Character offset of a specific text node + in-node offset, counted within container.
  function nodeOffsetToCharOffset(container, node, offset) {
    var nodes = textNodesIn(container);
    var count = 0;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i] === node) return count + offset;
      count += nodes[i].length;
    }
    return null;
  }
  function rangeToOffsets(range, container) {
    try {
      var start = resolveBoundary(container, range.startContainer, range.startOffset);
      var end = resolveBoundary(container, range.endContainer, range.endOffset);
      if (!start || !end) return null;
      var startOffset = nodeOffsetToCharOffset(container, start.node, start.offset);
      var endOffset = nodeOffsetToCharOffset(container, end.node, end.offset);
      if (startOffset === null || endOffset === null) return null;
      if (endOffset < startOffset) { var t = startOffset; startOffset = endOffset; endOffset = t; }
      return { start: startOffset, end: endOffset };
    } catch (e) { return null; }
  }
  // Resolve the comment (if any) whose highlighted range covers the point (clientX, clientY).
  function getCommentAtPoint(clientX, clientY) {
    if (!comments.length) return null;
    var pos = null;
    if (document.caretPositionFromPoint) {
      var p = document.caretPositionFromPoint(clientX, clientY);
      if (p && p.offsetNode) pos = { node: p.offsetNode, offset: p.offset };
    } else if (document.caretRangeFromPoint) {
      var r = document.caretRangeFromPoint(clientX, clientY);
      if (r) pos = { node: r.startContainer, offset: r.startOffset };
    }
    if (!pos || !content.contains(pos.node)) return null;
    var resolved = resolveBoundary(content, pos.node, pos.offset);
    if (!resolved) return null;
    var charOffset = nodeOffsetToCharOffset(content, resolved.node, resolved.offset);
    if (charOffset === null) return null;
    for (var i = 0; i < comments.length; i++) {
      var c = comments[i];
      if (c.start === null || c.start === undefined || c.end === null || c.end === undefined) continue;
      if (charOffset >= c.start && charOffset <= c.end) return c;
    }
    return null;
  }
  // A single (start,end) offset span can't always become one DOM Range: if a
  // hidden element sits inside it, a Range from before it to after it would
  // still geometrically include that hidden subtree (Range boundaries are
  // just two points — they can't "skip" what's structurally between them,
  // even though textNodesIn's offset counting already did). So this returns
  // an array of Ranges, splitting wherever there's a real DOM gap between two
  // logically-adjacent filtered text nodes.
  function offsetsToRanges(container, start, end) {
    try {
      var nodes = textNodesIn(container);
      var count = 0;
      var segments = [];
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var len = node.length;
        var nodeStart = count, nodeEnd = count + len;
        count = nodeEnd;
        if (nodeEnd <= start || nodeStart >= end) continue;
        segments.push({ node: node, start: Math.max(0, start - nodeStart), end: Math.min(len, end - nodeStart) });
      }
      if (!segments.length) return [];
      var ranges = [];
      var curStartNode = segments[0].node, curStartOff = segments[0].start;
      var curEndNode = segments[0].node, curEndOff = segments[0].end;
      for (var j = 1; j < segments.length; j++) {
        var prev = segments[j - 1], seg = segments[j];
        var gap = document.createRange();
        gap.setStart(prev.node, prev.end);
        gap.setEnd(seg.node, seg.start);
        if (gap.toString() === '') {
          curEndNode = seg.node; curEndOff = seg.end; // contiguous — extend
        } else {
          var closed = document.createRange();
          closed.setStart(curStartNode, curStartOff);
          closed.setEnd(curEndNode, curEndOff);
          ranges.push(closed);
          curStartNode = seg.node; curStartOff = seg.start;
          curEndNode = seg.node; curEndOff = seg.end;
        }
      }
      var last = document.createRange();
      last.setStart(curStartNode, curStartOff);
      last.setEnd(curEndNode, curEndOff);
      ranges.push(last);
      return ranges;
    } catch (e) { return []; }
  }
  // Convenience for callers that only need one Range (positioning/scrolling) —
  // the first segment is always the leftmost, so it's the natural choice.
  function offsetsToRange(container, start, end) {
    var ranges = offsetsToRanges(container, start, end);
    return ranges.length ? ranges[0] : null;
  }

  // ── highlight rendering ──────────────────────────────────
  function renderHighlights() {
    if (!supportsHighlight) return;
    try {
      var ranges = [];
      comments.forEach(function (c) {
        ranges = ranges.concat(offsetsToRanges(content, c.start, c.end));
      });
      if (!ranges.length) {
        CSS.highlights.delete('va-comment');
        return;
      }
      var hl = new Highlight();
      ranges.forEach(function (r) { hl.add(r); });
      CSS.highlights.set('va-comment', hl);
    } catch (e) { /* non-fatal: comments still work without visual highlight */ }
  }

  // ── hover preview + click-to-edit on highlighted text ────
  var hoverThrottled = false;
  function hideHoverTip() { hoverTip.style.display = 'none'; }
  function showHoverTip(c, clientX, clientY) {
    var imgs = (c.images || []).slice(0, 4)
      .map(function (u) { return '<img src="' + escapeHtml(u) + '">'; }).join('');
    hoverTip.innerHTML =
      '<div class="section-label">' + escapeHtml(c.sectionTitle || PAGE_TITLE) + '</div>' +
      '<div class="text">' + escapeHtml(c.text) + '</div>' +
      (imgs ? '<div class="thumbs">' + imgs + '</div>' : '') +
      '<div class="edit-hint">Click to edit</div>';
    hoverTip.style.display = 'block';
    var left = window.scrollX + clientX + 12;
    var maxLeft = window.scrollX + window.innerWidth - hoverTip.offsetWidth - 12;
    if (maxLeft > 0 && left > maxLeft) left = maxLeft;
    hoverTip.style.left = Math.max(8, left) + 'px';
    hoverTip.style.top = (window.scrollY + clientY + 18) + 'px';
  }
  content.addEventListener('mousemove', function (e) {
    if (hoverThrottled) return;
    hoverThrottled = true;
    requestAnimationFrame(function () { hoverThrottled = false; });
    if (!comments.length || editor.style.display === 'block' || selectBtn.style.display !== 'none') {
      hideHoverTip();
      return;
    }
    var match = getCommentAtPoint(e.clientX, e.clientY);
    if (match) showHoverTip(match, e.clientX, e.clientY);
    else hideHoverTip();
  });
  content.addEventListener('mouseleave', hideHoverTip);
  content.addEventListener('click', function (e) {
    if (editor.style.display === 'block') return;
    var sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.toString().trim()) return; // a drag-selection is in progress/just finished
    if (e.target.closest && e.target.closest('a, button, .va-select-btn')) return;
    var match = getCommentAtPoint(e.clientX, e.clientY);
    if (!match) return;
    hideHoverTip();
    openEditorForEdit(match, e.clientX, e.clientY);
  });

  // ── selection → floating "Comment" button ────────────────
  function hideSelectBtn() { selectBtn.style.display = 'none'; }
  content.addEventListener('mouseup', function () {
    setTimeout(function () {
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) { hideSelectBtn(); return; }
      var range = sel.getRangeAt(0);
      if (!content.contains(range.commonAncestorContainer)) { hideSelectBtn(); return; }
      var text = sel.toString().trim();
      if (!text) { hideSelectBtn(); return; }
      var rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) { hideSelectBtn(); return; }
      pendingRange = range.cloneRange();
      selectBtn.style.display = 'inline-flex';
      selectBtn.style.top = (window.scrollY + rect.top - 40) + 'px';
      selectBtn.style.left = Math.max(8, window.scrollX + rect.left) + 'px';
    }, 0);
  });
  document.addEventListener('mousedown', function (e) {
    if (e.target === selectBtn) return;
    hideSelectBtn();
    if (editor.style.display === 'block' && !editor.contains(e.target)) closeEditor();
  });

  function positionEditorAt(clientX, clientY, anchorRect) {
    editor.style.display = 'block';
    var top, left;
    if (anchorRect) {
      top = window.scrollY + anchorRect.bottom + 8;
      left = window.scrollX + anchorRect.left;
    } else {
      top = window.scrollY + clientY + 12;
      left = window.scrollX + clientX;
    }
    left = Math.min(left, window.scrollX + window.innerWidth - 320);
    editor.style.top = top + 'px';
    editor.style.left = Math.max(8, left) + 'px';
  }

  selectBtn.addEventListener('click', function () {
    if (!pendingRange) return;
    var offsets = rangeToOffsets(pendingRange, content);
    var quote = offsets
      ? getFilteredText(content).slice(offsets.start, offsets.end).trim()
      : pendingRange.toString().trim(); // fallback only if offset math somehow failed
    editor.dataset.mode = 'create';
    editor.dataset.commentId = '';
    editorQuote.textContent = quote.length > 300 ? quote.slice(0, 300) + '…' : quote;
    editor.dataset.quote = quote;
    editor.dataset.start = offsets ? offsets.start : '';
    editor.dataset.end = offsets ? offsets.end : '';
    positionEditorAt(0, 0, pendingRange.getBoundingClientRect());
    editorText.value = '';
    editorImages = [];
    renderEditorImages();
    editorSave.textContent = 'Save comment';
    hideSelectBtn();
    window.getSelection().removeAllRanges();
    setTimeout(function () { editorText.focus(); }, 30);
  });

  // Open the editor pre-filled to edit an existing comment (from a click on its
  // highlight, the hover tip, or the panel's Edit button).
  function openEditorForEdit(c, clientX, clientY, anchorRect) {
    pendingRange = null;
    editor.dataset.mode = 'edit';
    editor.dataset.commentId = c.id;
    editor.dataset.quote = c.quote || '';
    editor.dataset.start = (c.start === null || c.start === undefined) ? '' : c.start;
    editor.dataset.end = (c.end === null || c.end === undefined) ? '' : c.end;
    editorQuote.textContent = c.quote
      ? (c.quote.length > 300 ? c.quote.slice(0, 300) + '…' : c.quote)
      : '(comment on ' + (c.sectionTitle || PAGE_TITLE) + ')';
    editorText.value = c.text || '';
    editorImages = (c.images || []).slice();
    renderEditorImages();
    editorSave.textContent = 'Save changes';
    positionEditorAt(clientX, clientY, anchorRect);
    setTimeout(function () { editorText.focus(); editorText.select(); }, 30);
  }

  // Called from the panel's Edit button: scroll the comment into view first
  // (the panel may have been opened after scrolling away), then open the editor.
  function editComment(c) {
    closePanel();
    var hasRange = c.start !== null && c.start !== undefined && c.end !== null && c.end !== undefined;
    if (hasRange) {
      var r = offsetsToRange(content, c.start, c.end);
      if (r) {
        var target = r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement;
        if (target) target.scrollIntoView({ block: 'center' });
      }
    }
    setTimeout(function () {
      var rect = null;
      if (hasRange) {
        var r2 = offsetsToRange(content, c.start, c.end);
        if (r2) rect = r2.getBoundingClientRect();
      }
      openEditorForEdit(c, 60, 100, rect);
    }, hasRange ? 150 : 0);
  }

  function closeEditor() {
    editor.style.display = 'none';
    pendingRange = null;
    editor.dataset.mode = 'create';
    editor.dataset.commentId = '';
    editorImages = [];
    renderEditorImages();
    editorSave.textContent = 'Save comment';
  }
  editorCancel.addEventListener('click', closeEditor);
  editorSave.addEventListener('click', function () {
    var noteText = editorText.value.trim();
    if (!noteText) { editorText.focus(); return; }
    if (editor.dataset.mode === 'edit') {
      var id = editor.dataset.commentId;
      for (var i = 0; i < allComments.length; i++) {
        if (allComments[i].id === id) {
          allComments[i].text = noteText;
          allComments[i].images = editorImages.slice();
          allComments[i].editedAt = new Date().toISOString();
          break;
        }
      }
    } else {
      allComments.push({
        id: 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        sectionId: PAGE_ID,
        sectionTitle: PAGE_TITLE,
        quote: editor.dataset.quote || '',
        start: editor.dataset.start === '' ? null : parseInt(editor.dataset.start, 10),
        end: editor.dataset.end === '' ? null : parseInt(editor.dataset.end, 10),
        text: noteText,
        images: editorImages.slice(),
        createdAt: new Date().toISOString()
      });
    }
    syncFromAll();
    saveComments(allComments);
    renderHighlights();
    renderPanel();
    closeEditor();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeEditor(); closePanel(); }
  });

  // ── image attachments ─────────────────────────────────────
  function renderEditorImages() {
    editorImagesBox.innerHTML = '';
    editorImages.forEach(function (url, idx) {
      var thumb = document.createElement('div');
      thumb.className = 'va-img-thumb';
      thumb.innerHTML = '<img src="' + escapeHtml(url) + '" alt=""><button type="button" class="rm-btn" title="Remove">&times;</button>';
      thumb.querySelector('img').addEventListener('click', function () { window.open(url, '_blank'); });
      thumb.querySelector('.rm-btn').addEventListener('click', function () {
        editorImages.splice(idx, 1);
        renderEditorImages();
      });
      editorImagesBox.appendChild(thumb);
    });
  }
  function uploadImage(file) {
    if (!serverAvailable) {
      alert('Image attachments need the local server running — start tools/vTinyShell.bat (Windows) or tools/vTinyShell.sh (Mac/Linux) first.');
      return;
    }
    var placeholder = document.createElement('div');
    placeholder.className = 'va-img-thumb uploading';
    placeholder.textContent = '…';
    editorImagesBox.appendChild(placeholder);
    var reader = new FileReader();
    reader.onload = function () {
      var base64 = String(reader.result).split(',')[1] || '';
      fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, dataBase64: base64 })
      }).then(function (res) { return res.json(); })
        .then(function (data) {
          placeholder.remove();
          if (data && data.ok && data.url) {
            editorImages.push(data.url);
            renderEditorImages();
          } else {
            alert('Image upload failed: ' + ((data && data.error) || 'unknown error'));
          }
        }).catch(function () {
          placeholder.remove();
          alert('Image upload failed — is the local server still running?');
        });
    };
    reader.onerror = function () { placeholder.remove(); alert('Could not read that file.'); };
    reader.readAsDataURL(file);
  }
  attachBtn.addEventListener('click', function () { fileInput.click(); });
  fileInput.addEventListener('change', function () {
    var files = Array.prototype.slice.call(fileInput.files || []);
    files.forEach(uploadImage);
    fileInput.value = '';
  });

  // ── panel ────────────────────────────────────────────────
  function openPanel() { renderPanel(); panel.style.display = 'flex'; overlay.style.display = 'block'; }
  function closePanel() { panel.style.display = 'none'; overlay.style.display = 'none'; }
  fab.addEventListener('click', openPanel);
  panelClose.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  function fmtDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return iso; }
  }

  function renderPanel() {
    fabCount.textContent = comments.length;
    if (!comments.length) {
      list.innerHTML = '<div class="va-comment-empty">No comments yet on this page — select any text to leave one.</div>';
      return;
    }
    var sorted = comments.slice().sort(function (a, b) { return (a.createdAt || '').localeCompare(b.createdAt || ''); });
    list.innerHTML = '';
    sorted.forEach(function (c) {
      var item = document.createElement('div');
      item.className = 'va-comment-item';
      var quoteHtml = c.quote ? '<div class="quote">' + '“' + escapeHtml(c.quote.length > 220 ? c.quote.slice(0, 220) + '…' : c.quote) + '”</div>' : '';
      var imagesHtml = (c.images && c.images.length)
        ? '<div class="va-item-images">' + c.images.map(function (u) {
            return '<div class="va-img-thumb"><img src="' + escapeHtml(u) + '" alt=""></div>';
          }).join('') + '</div>'
        : '';
      item.innerHTML =
        quoteHtml +
        '<div class="text">' + escapeHtml(c.text) + '</div>' +
        imagesHtml +
        '<div class="meta">' + fmtDate(c.createdAt) + (c.editedAt ? ' · edited ' + fmtDate(c.editedAt) : '') + '</div>' +
        '<div class="item-actions">' +
          (c.start !== null && c.start !== undefined ? '<button type="button" class="go-btn">Go to</button>' : '') +
          '<button type="button" class="edit-btn">Edit</button>' +
          '<button type="button" class="del-btn">Delete</button>' +
        '</div>';
      var goBtn = item.querySelector('.go-btn');
      if (goBtn) goBtn.addEventListener('click', function () { goToComment(c); });
      item.querySelector('.edit-btn').addEventListener('click', function () { editComment(c); });
      item.querySelector('.del-btn').addEventListener('click', function () {
        allComments = allComments.filter(function (x) { return x.id !== c.id; });
        syncFromAll();
        saveComments(allComments);
        renderHighlights();
        renderPanel();
      });
      var thumbs = item.querySelectorAll('.va-item-images img');
      for (var i = 0; i < thumbs.length; i++) {
        thumbs[i].style.cursor = 'pointer';
        thumbs[i].addEventListener('click', function () { window.open(this.src, '_blank'); });
      }
      list.appendChild(item);
    });
  }

  function goToComment(c) {
    var target = content;
    if (c.start !== null && c.start !== undefined && c.end !== null) {
      var r = offsetsToRange(content, c.start, c.end);
      if (r) target = r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement;
    }
    closePanel();
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var flashEl = target.nodeType === 1 ? target : target.parentElement;
    if (flashEl) {
      flashEl.classList.add('va-comment-flash');
      setTimeout(function () { flashEl.classList.remove('va-comment-flash'); }, 1300);
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ── export ───────────────────────────────────────────────
  // Exports every comment across every page (not just this page's), since
  // comments.md is one shared file backing the whole site — matches what
  // gets written to disk on every save regardless of which page triggered it.
  function buildExportText(list) {
    var sorted = (list || allComments).slice().sort(function (a, b) { return (a.createdAt || '').localeCompare(b.createdAt || ''); });
    var lines = [];
    lines.push('vincentdenil-site — Comments export');
    lines.push('Generated: ' + new Date().toLocaleString());
    lines.push(sorted.length + ' comment' + (sorted.length === 1 ? '' : 's'));
    lines.push('');
    sorted.forEach(function (c, i) {
      lines.push('────────────────────────────────────');
      lines.push((i + 1) + '. [' + (c.sectionTitle || 'Page') + ' — ' + (c.sectionId || '') + ']');
      if (c.quote) lines.push('Quoted: "' + c.quote + '"');
      lines.push('Comment: ' + c.text);
      if (c.images && c.images.length) lines.push('Images: ' + c.images.join(', '));
      lines.push('Added: ' + fmtDate(c.createdAt) + (c.editedAt ? ' (edited ' + fmtDate(c.editedAt) + ')' : ''));
      lines.push('');
    });
    return lines.join('\n');
  }

  copyBtn.addEventListener('click', function () {
    var textOut = buildExportText(allComments);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textOut).then(function () {
        copyBtn.textContent = 'Copied!';
        setTimeout(function () { copyBtn.textContent = 'Copy all as text'; }, 1500);
      }).catch(function () { fallbackCopy(textOut); });
    } else {
      fallbackCopy(textOut);
    }
  });
  function fallbackCopy(textOut) {
    var box = document.createElement('textarea');
    box.className = 'va-export-box';
    box.value = textOut;
    list.innerHTML = '';
    var note = document.createElement('div');
    note.className = 'va-comment-panel-sub';
    note.style.padding = '0 0 8px';
    note.textContent = 'Clipboard access was blocked — select the text below and copy manually (Ctrl/Cmd+C).';
    list.appendChild(note);
    list.appendChild(box);
    box.focus();
    box.select();
  }

  downloadBtn.addEventListener('click', function () {
    var textOut = buildExportText(allComments);
    var blob = new Blob([textOut], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'vincentdenil-site-comments-' + new Date().toISOString().slice(0, 10) + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  });

  revealBtn.addEventListener('click', function () {
    if (!serverAvailable) return; // button is disabled in this state, but guard anyway
    fetch('/api/reveal', { method: 'POST' }).catch(function () {
      alert('Could not open the folder — is the local server still running?');
    });
  });

  clearBtn.addEventListener('click', function () {
    if (!comments.length) return;
    if (!confirm('Delete all ' + comments.length + ' saved comment(s) on this page? Other pages’ comments are untouched. This cannot be undone (export first if you want a copy).')) return;
    var ids = comments.map(function (c) { return c.id; });
    allComments = allComments.filter(function (c) { return ids.indexOf(c.id) === -1; });
    syncFromAll();
    saveComments(allComments);
    renderHighlights();
    renderPanel();
  });

  // ── init ─────────────────────────────────────────────────
  hideSelectBtn(); // set the inline style explicitly so the hover guard below reads correctly from the first hover, not just after the first selection
  renderHighlights(); // paint whatever we have locally immediately, no flash of empty state
  fabCount.textContent = comments.length;
  updateStorageStatus();
  initComments(); // then check for the server and reconcile
})();

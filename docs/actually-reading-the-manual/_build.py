#!/usr/bin/env python3
"""Rebuild index.html and the combined full-text file for the series. Run from this folder."""
import glob, html, re, pathlib
here = pathlib.Path(__file__).resolve().parent
eps = sorted(p for p in here.glob('[0-9][0-9]-*.md'))
full = ['# The Founder\'s Curriculum: Actually Reading the Manual\n\n*All published episodes in order, narrated by Claudine. Each episode keeps its own source list below its closing rule.*\n']
rows = []
for p in eps:
    s = p.read_text()
    full.append('\n\n' + s.strip() + '\n')
    title = re.search(r'^# (.+)$', s, re.M).group(1)
    date = re.search(r'Written on (\d+ \w+ \d{4})', s)
    rows.append((p.name, title.replace('Actually Reading the Manual, ', ''), date.group(1) if date else ''))
(here / 'actually-reading-the-manual-full-text.md').write_text(''.join(full))
tr = lambda tag, href, label, date: f'            <tr>\n              <td><span class="tag">[{tag}]</span><a href="{href}">{html.escape(label)}</a></td>\n              <td>{date}</td><td>&#8212;</td>\n            </tr>\n'
body = tr('UP', '../', '../', '&#8212;') + tr('TXT', 'series-map.md', 'series-map.md', '') + tr('TXT', 'actually-reading-the-manual-full-text.md', 'actually-reading-the-manual-full-text.md', '')
for name, title, date in rows:
    body += tr('TXT', name, f'{name}  ({title})', date)
page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Index of /docs/actually-reading-the-manual/ | Atelier Vincent De Nil</title>
<meta name="robots" content="noindex">
<meta name="seo_hidden" content="true">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/ftp.css">
</head>
<body>
  <main class="wrap">
    <a class="brand" href="/">🦌 AVDN - EXPERIMENTS AND PROJECTS</a>
    <section class="term">
      <div class="term-body">
        <p class="line dim"><strong>/docs/actually-reading-the-manual/</strong></p>
        <p class="line dim">The Founder's Curriculum: Actually Reading the Manual. Anthropic's documentation for Claude, walked through by Claudine, one chapter at a time.</p>
        <table class="listing">
          <thead>
            <tr><th>Name</th><th>Written</th><th>Size</th></tr>
          </thead>
          <tbody>
{body}          </tbody>
        </table>
        <p class="line dim">{len(rows)} episodes published.</p>
      </div>
    </section>
    <a class="back" href="../">docs</a>
  </main>
</body>
</html>
'''
(here / 'index.html').write_text(page)
print(len(rows), 'episodes')

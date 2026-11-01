# Turn a Walking Through markdown file (or one "## Episode N" section) into plain narration text for TTS.
import re,sys
def narration(md, episode=None):
    body = re.split(r'\n---\n', md, maxsplit=1)[0]
    if episode is not None:
        parts = re.split(r'\n(?=## Episode \d+)', body)
        body = [p for p in parts if p.startswith(f'## Episode {episode}')][0]
    out=[]
    for para in re.split(r'\n\s*\n', body):
        p=para.strip()
        if not p: continue
        if re.fullmatch(r'\*[^*].*\*', p, re.S): continue          # italic front matter
        p=re.sub(r'^#+\s*','',p,flags=re.M)                          # headings become spoken lines
        p=re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',p)                    # links -> text
        p=re.sub(r'https?://\S+','',p)
        p=re.sub(r'^\s*[-*]\s+','',p,flags=re.M)
        p=p.replace('**','').replace('`','')
        p=re.sub(r'(?<!\w)\*(?!\s)|(?<!\s)\*(?!\w)','',p)
        p=re.sub(r'(?<!\w)_(.+?)_(?!\w)',r'\1',p)
        lines=[l.strip() for l in p.split('\n') if l.strip()]
        lines=[l if l[-1] in '.!?:;,"”’)' else l+'.' for l in lines]
        out.append(' '.join(lines))
    return '\n\n'.join(out)
if __name__=='__main__':
    ep=int(sys.argv[3]) if len(sys.argv)>3 else None
    open(sys.argv[2],'w').write(narration(open(sys.argv[1]).read(), ep))

# Rebuilds fonts/GlowSansUI-*.woff2: Glow Sans TC cut down to the Chinese characters used in the app UI.
# Source: npm @vp-tw/cjk-web-fonts-glow-sans-tc-normal (OFL). Run after adding new UI text:
#   cat index.html flowers.js > /tmp/src.txt && python3 tools/glow-subset.py /tmp/src.txt <pkg>/dist fonts-out Medium Bold
import glob, os, sys
from fontTools.ttLib import TTFont, newTable
from fontTools import subset
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.merge import Merger
html, src, out = sys.argv[1], sys.argv[2], sys.argv[3]
s=open(html,encoding='utf8').read()
chars=set(c for c in s if '　'<=c<='鿿' or '＀'<=c<='￯' or c in '·…—')
os.makedirs(out,exist_ok=True)
def to_ttf(t):
    gs=t.getGlyphSet(); order=t.getGlyphOrder(); glyf={}
    for g in order:
        pen=TTGlyphPen(gs); gs[g].draw(Cu2QuPen(pen, 1.0, reverse_direction=True)); glyf[g]=pen.glyph()
    del t['CFF ']
    for k in ('VORG','BASE'):
        if k in t: del t[k]
    t['loca']=newTable('loca'); t['glyf']=g_=newTable('glyf'); g_.glyphOrder=order; g_.glyphs=glyf
    t['maxp'].tableVersion=0x00010000
    for a in ('maxZones','maxTwilightPoints','maxStorage','maxFunctionDefs','maxInstructionDefs','maxStackElements','maxSizeOfInstructions','maxComponentElements'): setattr(t['maxp'],a,0)
    t['maxp'].maxZones=1
    t['head'].glyphDataFormat=0; t['post'].formatType=2.0; t['post'].extraNames=[]; t['post'].mapping={}
    t.sfntVersion='\x00\x01\x00\x00'
    return t
for w in sys.argv[4:]:
    parts=[]
    for i,f in enumerate(sorted(glob.glob(f'{src}/{w}/*.woff2'))):
        t=TTFont(f); cm=t.getBestCmap(); have=[ord(c) for c in chars if ord(c) in cm]
        if not have: continue
        o=subset.Options(); o.desubroutinize=True; o.hinting=False; o.layout_features=[]; o.notdef_outline=True
        sb=subset.Subsetter(o); sb.populate(unicodes=have); sb.subset(t)
        for k in ('GPOS','GSUB','vhea','vmtx'):
            if k in t: del t[k]
        t=to_ttf(t); t.flavor=None
        # unique glyph names so merge doesn't clash
        p=f'{out}/{w}-{i}.ttf'; t.save(p); parts.append(p)
    m=Merger().merge(parts)
    m['name'].setName('Glow Sans UI',1,3,1,0x409); m['name'].setName('Glow Sans UI',1,1,0,0)
    m.flavor='woff2'; dst=f'{out}/GlowSansUI-{w}.woff2'; m.save(dst)
    print(w, len(parts), os.path.getsize(dst), len(m.getBestCmap()))

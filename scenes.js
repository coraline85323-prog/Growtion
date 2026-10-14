/* Growtion — news-TV side scenes. Six hand-drawn scenes that all feature the newest flower,
   two frames each (they swap to make the drawing "boil"), drawn as SVG and rasterised once.
   window.Scenes = {build(flowerURL, bareURL) -> [{key, ch, kick, head, frames:[svg, svg]}]} */
(() => {
const INK = '#2b2522', CREAM = '#fdf7ea', RED = '#e8402c', BLUE = '#2d5fd0', YEL = '#f3c230',
      GRN = '#3f9b4f', CHEEK = '#f6aaa0', WHITE = '#ffffff';
const L = `stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
const LN = `fill="none" ${L}`;

/* ---------- people ---------- */
// a face centred on 0,0 (head radius 13). mouth: smile | o | O | flat | open. eyes: dot | shut | look-l | look-r | up
function face({mouth='smile', eyes='dot', cheeks=true}={}){
  let e = '';
  const dx = eyes==='look-l' ? -2 : eyes==='look-r' ? 2 : 0, dy = eyes==='up' ? -2 : 0;
  if(eyes==='shut') e = `<path d="M-7 0 Q-4.5 -3 -2 0 M2 0 Q4.5 -3 7 0" ${LN} stroke-width="1.6"/>`;
  else e = `<ellipse cx="${-4.5+dx}" cy="${dy}" rx="1.4" ry="1.8" fill="${INK}"/><ellipse cx="${4.5+dx}" cy="${dy}" rx="1.4" ry="1.8" fill="${INK}"/>`;
  const c = cheeks ? `<ellipse cx="-8" cy="4" rx="2.6" ry="1.6" fill="${CHEEK}"/><ellipse cx="8" cy="4" rx="2.6" ry="1.6" fill="${CHEEK}"/>` : '';
  const m = {
    smile: `<path d="M-2.5 5 Q0 7.5 2.5 5" ${LN} stroke-width="1.6"/>`,
    o: `<ellipse cx="0" cy="6" rx="1.6" ry="1.9" fill="#c23a2c" stroke="${INK}" stroke-width="1.3"/>`,
    O: `<ellipse cx="0" cy="6.5" rx="2.6" ry="3.4" fill="#c23a2c" stroke="${INK}" stroke-width="1.4"/>`,
    flat: `<path d="M-2 6 H2" ${LN} stroke-width="1.6"/>`,
    open: `<path d="M-3 4.5 Q0 10 3 4.5 Z" fill="#c23a2c" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`,
  }[mouth];
  return c + e + m;
}
// hair / hats drawn over the head. Head is a circle r=13 at 0,0
const HAIR = {
  none: () => '',
  bob: col => `<path d="M-14 8 C-17 -16 17 -16 14 8 L10 8 L10 -3 Q0 -6 -10 -3 L-10 8 Z" fill="${col||INK}" ${L}/>`,
  short: col => `<path d="M-13 -1 C-14 -17 14 -17 13 -1 Q6 -9 -3 -6 Q-8 -5 -13 -1 Z" fill="${col||INK}" ${L}/>`,
  pig: col => `<circle cx="-15" cy="2" r="5.5" fill="${col||INK}" ${L}/><circle cx="15" cy="2" r="5.5" fill="${col||INK}" ${L}/><path d="M-13 -1 C-14 -17 14 -17 13 -1 Q0 -8 -13 -1 Z" fill="${col||INK}" ${L}/>`,
  tuft: () => `<path d="M-3 -13 L-5 -19 M0 -13.5 V-21 M3 -13 L5 -19" ${LN}/>`,
  beanie: col => `<path d="M-13.5 -2 C-14 -18 14 -18 13.5 -2 Z" fill="${col}" ${L}/><rect x="-14.5" y="-4" width="29" height="5" rx="2" fill="${col}" ${L}/><circle cx="0" cy="-17" r="4" fill="${col}" ${L}/>`,
  cap: col => `<path d="M-13 -3 C-13 -18 13 -18 13 -3 Z" fill="${col}" ${L}/><path d="M-3 -3 H20 Q20 0 13 0 H-3 Z" fill="${col}" ${L}/>`,
  straw: () => `<ellipse cx="0" cy="-5" rx="22" ry="5" fill="#ecc767" ${L}/><path d="M-11 -5 C-11 -20 11 -20 11 -5 Z" fill="#ecc767" ${L}/><path d="M-11 -8 H11" stroke="${RED}" stroke-width="3"/>`,
};
function head({hair='none', hairCol, mouth, eyes, glasses=false, tilt=0, skin=CREAM}={}){
  const g = glasses ? `<circle cx="-4.5" cy="0" r="4.2" fill="none" ${L} stroke-width="1.6"/><circle cx="4.5" cy="0" r="4.2" fill="none" ${L} stroke-width="1.6"/><path d="M-0.3 0 H0.3" ${LN} stroke-width="1.6"/>` : '';
  const back = hair==='bob' ? HAIR.bob(hairCol) : '';
  const front = hair==='bob' ? `<path d="M-11 -2 C-11 -15 11 -15 11 -2 Q0 -6 -11 -2 Z" fill="${hairCol||INK}" ${L} stroke-width="1.6"/>` : HAIR[hair](hairCol);
  return `<g transform="rotate(${tilt})">${back}<circle r="13" fill="${skin}" ${L}/>${face({mouth, eyes})}${g}${front}</g>`;
}
// a whole person at x,y (y = head centre). arms: [[x1,y1,x2,y2,...], ...] relative polylines from the shoulders
function person(x, y, o={}){
  const s = o.s || 1, col = o.body || CREAM;
  const body = o.coat
    ? `<path d="M-10 11 Q-15 16 -15 42 H15 Q15 16 10 11 Z" fill="${WHITE}" ${L}/><path d="M-4 12 L0 22 L4 12 M0 22 V42" ${LN} stroke-width="1.5"/><circle cx="2.6" cy="28" r=".9" fill="${INK}"/><circle cx="2.6" cy="35" r=".9" fill="${INK}"/>`
    : o.overalls
    ? `<path d="M-10 11 Q-14 16 -14 40 H14 Q14 16 10 11 Z" fill="${CREAM}" ${L}/><path d="M-11 24 H11 V40 H-11 Z" fill="${o.overalls}" ${L}/><path d="M-8 24 L-7 12 M8 24 L7 12" stroke="${o.overalls}" stroke-width="3"/><path d="M-8 24 L-7 12 M8 24 L7 12" ${LN} stroke-width="1"/>`
    : `<path d="M-10 11 Q-14 16 -14 40 H14 Q14 16 10 11 Z" fill="${col}" ${L}/>` + (o.collar ? `<path d="M-6 12 L0 19 L6 12" fill="${WHITE}" ${L} stroke-width="1.5"/>` : '');
  const legs = o.sit ? '' : (o.legs || `<path d="M-5 40 V53 H-9 M5 40 V53 H9" ${LN}/>`);
  const arms = (o.arms || [[-12,15,-17,32],[12,15,17,32]]).map(a => `<polyline points="${a.join(' ')}" ${LN}/>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${s})">${legs}${body}${arms}${o.hold||''}${head(o)}${o.over||''}</g>`;
}

/* ---------- shared bits ---------- */
const img = (href, x, y, w, h, extra='') => `<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none" ${extra}/>`;
const note = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 0 V-14 L8 -16 V-3" ${LN}/><ellipse cx="-2.5" cy="0" rx="3.3" ry="2.5" fill="${INK}"/><ellipse cx="5.5" cy="-3" rx="3.3" ry="2.5" fill="${INK}"/></g>`;
const dots = (n, seed, col, w, h, r=1.4) => { let a = seed, s = ''; const R = () => (a = (a*9301+49297)%233280)/233280;
  for(let i=0;i<n;i++) s += `<circle cx="${(R()*w).toFixed(1)}" cy="${(R()*h).toFixed(1)}" r="${(r*(.6+R()*.8)).toFixed(1)}" fill="${col}"/>`; return s; };
const pot = (x, y, w=40) => `<path d="M${x-w/2} ${y} H${x+w/2} L${x+w*.38} ${y+w*.8} H${x-w*.38} Z" fill="#c8794a" ${L}/><rect x="${x-w/2-3}" y="${y-6}" width="${w+6}" height="8" rx="2" fill="#d8895a" ${L}/>`;

// wrap a scene: background colour, grain, wobble filter seeded per frame so the lines boil
function frame(bg, f, body){
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 240 240" width="480" height="480">
<defs>
<filter id="w" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="${f?7:2}"/><feDisplacementMap in="SourceGraphic" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${f?3:9}" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 -.18"/></filter>
</defs>
<rect width="240" height="240" fill="${bg}"/>
${body}
<rect width="240" height="240" filter="url(#grain)" opacity=".5"/>
</svg>`;
}
const W = s => `<g filter="url(#w)">${s}</g>`;
// tags here stack a shared style then override bits of it (stroke-width, stroke); XML allows each attribute once, so keep the last one
const tidy = svg => svg.replace(/<[a-zA-Z][^<>]*>/g, tag => {
  const seen = new Map(), head = tag.match(/^<[a-zA-Z]+/)[0], close = /\/>$/.test(tag) ? '/>' : '>';
  tag.replace(/\s([\w:-]+)="([^"]*)"/g, (_, k, v) => { seen.delete(k); seen.set(k, v); });
  return head + [...seen].map(([k, v]) => ` ${k}="${v}"`).join('') + close;
});

/* ---------- 1. choir sings in front of the flower ---------- */
function choir(F, f){
  const curtain = side => { const x0 = side<0 ? 0 : 240, d = side<0 ? 1 : -1;
    return `<path d="M${x0} 0 H${x0+d*34} Q${x0+d*24} 70 ${x0+d*30} 150 Q${x0+d*20} 200 ${x0+d*26} 240 H${x0} Z" fill="#b8231a" ${L}/>
      <path d="M${x0+d*12} 6 Q${x0+d*8} 90 ${x0+d*14} 236 M${x0+d*22} 6 Q${x0+d*16} 90 ${x0+d*20} 236" ${LN} stroke-width="1.4"/>`; };
  const sing = (i, row) => {
    const shut = (i+f)%3===0, m = f ? (i%2 ? 'O' : 'o') : (i%2 ? 'o' : 'O');
    const hair = ['bob','short','pig','tuft','short','bob','tuft','pig','short'][i];
    return person(row ? 72+i%4*32 : 56+i*32, row ? 156 : 136, {body: row ? RED : BLUE, collar:true, hair, mouth:m, eyes: shut?'shut':'up', tilt:(i%2?1:-1)*(f?5:-3), s:.92,
      arms: row ? [[-11,15,-6,28,4,27],[11,15,6,28,-4,27]] : [[-12,15,-15,30],[12,15,15,30]], legs:''});
  };
  return frame('#f0532c', f, `
    ${W(`<path d="M30 200 H210 V240 H30 Z" fill="#7a3f22" ${L}/><path d="M30 214 H210 M30 228 H210" ${LN} stroke-width="1.2"/>`)}
    ${W(`<rect x="72" y="22" width="96" height="96" fill="${CREAM}" ${L}/>`)}
    ${img(F.full, 78, 28, 84, 84)}
    ${W(`<rect x="78" y="28" width="84" height="84" fill="none" ${L}/>`)}
    ${W(`${note(f?52:48, f?60:68)}${note(f?186:192, f?74:64)}${note(f?40:46, f?104:96)}${note(f?198:194, f?108:116)}`)}
    ${W([0,1,2,3,4].map(i=>sing(i,0)).join(''))}
    ${W([0,1,2,3].map(i=>sing(i+5,1)).join(''))}
    ${W(curtain(-1)+curtain(1)+`<path d="M0 0 H240 V14 Q220 24 200 14 Q180 24 160 14 Q140 24 120 14 Q100 24 80 14 Q60 24 40 14 Q20 24 0 14 Z" fill="#b8231a" ${L}/>`)}`);
}

/* ---------- 2. schoolkids sketch the flower ---------- */
function kids(F, f){
  const board = (w, h, rot) => `<g transform="rotate(${rot})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" fill="${WHITE}" ${L}/>${img(F.full, -w/2+3, -h/2+3, w-6, h-6)}<rect x="${-w/2+3}" y="${-h/2+3}" width="${w-6}" height="${h-6}" fill="none" stroke="${INK}" stroke-width="1"/></g>`;
  const kid = (x, y, o, side, k) => {
    const up = (f+k)%2 === 0;
    const hold = `<g transform="translate(${side*-2} ${up?24:28})">${board(30, 26, side*-6)}</g>`;
    const pencil = `<g transform="translate(${side*16} ${up?16:22}) rotate(${side*(up?-30:-10)})"><rect x="-1.6" y="-11" width="3.2" height="13" fill="${YEL}" ${L} stroke-width="1.2"/><path d="M-1.6 2 L0 6 L1.6 2" fill="${CREAM}" ${L} stroke-width="1.2"/></g>`;
    return person(x, y, {...o, eyes: up ? (side>0?'look-l':'look-r') : 'dot', arms:[[-11,15,-12,26],[11,15,12,26]], hold: hold+pencil});
  };
  return frame('#f3a58f', f, `
    ${W(`<path d="M0 168 H240" ${LN} stroke-width="1.4"/>`)}
    ${W(`<path d="M92 132 H148 V138 H92 Z M98 138 V170 M142 138 V170" fill="#c99a5b" ${L}/>`)}
    ${W(pot(120, 108, 34))}
    ${img(F.bare, 74, 18, 92, 92)}
    ${kid(40, 92, {hair:'cap', hairCol:YEL, body:'#ffffff', collar:true, mouth:'smile'}, 1, 0)}
    ${kid(200, 92, {hair:'beanie', hairCol:RED, body:BLUE, mouth:'o'}, -1, 1)}
    ${kid(66, 150, {hair:'pig', body:YEL, mouth:'open'}, 1, 1)}
    ${kid(174, 150, {hair:'bob', body:RED, mouth:'smile'}, -1, 0)}
    ${W(`<path d="M${f?118:121} 14 l3 -8 M${f?104:101} 20 l-5 -6 M${f?134:137} 20 l5 -6" ${LN} stroke="${YEL}" stroke-width="2.4"/>`)}`);
}

/* ---------- 3. scientists study the flower ---------- */
function lab(F, f){
  const flask = `<g transform="translate(20 ${f?16:20}) rotate(${f?-14:-6})"><path d="M-3 -16 H3 V-6 L11 8 Q12 11 9 11 H-9 Q-12 11 -11 8 L-3 -6 Z" fill="${WHITE}" ${L}/><path d="M-8.5 3 H8.5 L10.5 8 Q11 10 9 10 H-9 Q-11 10 -10.5 8 Z" fill="#7fd46a"/><path d="M-3 -16 H3 V-6 L11 8 Q12 11 9 11 H-9 Q-12 11 -11 8 L-3 -6 Z" fill="none" ${L}/>
    <circle cx="${f?2:-1}" cy="${f?-24:-21}" r="2" fill="${WHITE}" ${L} stroke-width="1.2"/><circle cx="${f?-3:3}" cy="${f?-32:-28}" r="2.6" fill="${WHITE}" ${L} stroke-width="1.2"/><circle cx="${f?3:0}" cy="${f?-40:-37}" r="1.6" fill="${WHITE}" ${L} stroke-width="1.2"/></g>`;
  const scope = `<g transform="translate(190 150)"><rect x="-16" y="-4" width="30" height="5" rx="1.5" fill="${CREAM}" ${L}/><path d="M6 -4 Q14 -18 6 -34" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M6 -4 Q14 -18 6 -34" fill="none" stroke="${CREAM}" stroke-width="2.6" stroke-linecap="round"/><path d="M-6 -12 H6" ${LN}/><rect x="-6" y="-46" width="8" height="26" rx="2" transform="rotate(-24 -2 -33)" fill="${BLUE}" ${L}/></g>`;
  return frame('#d8efe6', f, `
    ${W(`<path d="M0 60 H240 M0 100 H240 M40 0 V150 M80 0 V150 M120 0 V150 M160 0 V150 M200 0 V150" stroke="#b7dccd" stroke-width="1.4"/>`)}
    ${W(`<rect x="22" y="32" width="38" height="46" rx="3" fill="${CREAM}" ${L}/><rect x="34" y="28" width="14" height="7" rx="2" fill="${INK}"/><path d="M28 70 L36 60 L44 64 L54 46" ${LN} stroke="${RED}" stroke-width="2.4"/><path d="M28 44 H48 M28 50 H42" ${LN} stroke-width="1.2"/>`)}
    ${W(`<path d="M120 0 V16 M106 26 Q120 8 134 26 Z" fill="${YEL}" ${L}/>${f?`<path d="M112 34 L108 42 M120 34 V44 M128 34 L132 42" ${LN} stroke="${YEL}" stroke-width="2"/>`:''}`)}
    ${person(196, 112, {coat:true, hair:'short', glasses:true, mouth:f?'o':'flat', eyes:'shut', tilt:f?-12:-6, arms:[[-12,15,-18,30,-12,36],[12,15,15,30]], legs:''})}
    ${W(`<rect x="0" y="150" width="240" height="90" fill="#9fb3bf" ${L}/><path d="M0 160 H240" ${LN} stroke-width="1.2"/>`)}
    ${W(scope)}
    ${W(`<ellipse cx="120" cy="150" rx="32" ry="5" fill="${CREAM}" ${L}/>`)}
    ${img(F.bare, 86, 76, 68, 68)}
    ${W(`<path d="M92 148 V98 Q92 66 120 66 Q148 66 148 98 V148" fill="#bfe6f2" fill-opacity=".28" ${L}/><circle cx="120" cy="62" r="4" fill="${CREAM}" ${L}/><path d="M100 90 Q100 76 110 72" fill="none" stroke="${WHITE}" stroke-width="3" stroke-linecap="round"/>`)}
    ${person(48, 104, {coat:true, hair:'bob', glasses:true, mouth:f?'open':'smile', eyes:'look-r', tilt:f?4:0, arms:[[-12,15,-15,32],[12,15,20,22]], hold:W(flask), legs:''})}
    ${f ? W(`<path d="M168 92 l-4 -6 M174 88 l2 -8 M180 92 l5 -5" ${LN} stroke="${RED}" stroke-width="2"/>`) : ''}`);
}

/* ---------- 4. a farmer tries growing it ---------- */
function farm(F, f){
  const rays = Array.from({length:8}, (_,i) => { const a = (i*45 + (f?22:0)) * Math.PI/180;
    return `<path d="M${(200+Math.cos(a)*19).toFixed(1)} ${(42+Math.sin(a)*19).toFixed(1)} L${(200+Math.cos(a)*27).toFixed(1)} ${(42+Math.sin(a)*27).toFixed(1)}" ${LN} stroke="${INK}"/>`; }).join('');
  const drops = (f ? [[98,96],[106,108],[96,114],[110,120]] : [[96,102],[104,114],[94,120],[108,92]]).map(([x,y]) => `<path d="M${x} ${y-4} Q${x+3} ${y} ${x} ${y+2} Q${x-3} ${y} ${x} ${y-4} Z" fill="#7cc7f2" ${L} stroke-width="1.2"/>`).join('');
  const can = `<g transform="translate(22 ${f?16:20}) rotate(${f?28:14})"><rect x="-10" y="-8" width="20" height="18" rx="3" fill="${GRN}" ${L}/><path d="M10 -2 L26 -10" ${LN} stroke-width="3.4"/><path d="M10 -2 L26 -10" fill="none" stroke="${GRN}" stroke-width="1.6"/><path d="M-6 -8 Q0 -18 6 -8" ${LN}/></g>`;
  return frame('#a7d8f2', f, `
    ${W(`<circle cx="200" cy="42" r="14" fill="${YEL}" ${L}/>${rays}`)}
    ${W(`<path d="M24 44 Q24 32 36 34 Q42 22 56 30 Q68 28 66 42 Q66 50 56 48 H32 Q24 50 24 44 Z" fill="${WHITE}" ${L}/>`)}
    ${W(`<path d="M0 112 Q40 92 90 108 Q140 90 190 104 Q220 96 240 104 V240 H0 Z" fill="#7cc46a" ${L}/>`)}
    ${W(`<path d="M0 126 H240 V240 H0 Z" fill="#c98a4b" ${L}/><path d="M120 126 L40 240 M120 126 L90 240 M120 126 L150 240 M120 126 L200 240 M0 150 H240 M0 182 H240" ${LN} stroke-width="1.3" stroke="#8a5a2c"/>`)}
    ${img(F.bare, 150, 98, 30, 30)}${img(F.bare, 182, 100, 30, 30)}${img(F.bare, 212, 102, 28, 28)}
    ${img(F.bare, 92, 64, 88, 88)}
    ${W(`<rect x="196" y="150" width="30" height="16" rx="2" fill="${CREAM}" ${L}/><path d="M211 166 V182" ${LN} stroke-width="2.6"/><path d="M201 156 H221 M201 161 H214" ${LN} stroke-width="1.2"/>`)}
    ${W(drops)}
    ${person(62, 104, {overalls:BLUE, hair:'straw', mouth:'smile', eyes:'look-r', tilt:f?6:2, arms:[[-12,15,-14,32],[12,15,20,22]], hold:can})}
    ${W(`<path d="M${f?40:44} 160 q4 -10 8 0 M${f?24:20} 176 q4 -10 8 0" ${LN} stroke="#3c7a2d"/>`)}`);
}

/* ---------- 5. the flower hangs in someone's living room ---------- */
function home(F, f){
  const steam = x => `<path d="M${x} ${f?96:98} q-4 -6 0 -12 q4 -6 0 -12" ${LN} stroke-width="1.5" opacity=".8"/>`;
  const mug = col => `<rect x="-5" y="-6" width="10" height="10" rx="2" fill="${col}" ${L} stroke-width="1.5"/><path d="M5 -3 q4 0 4 3 q0 3 -4 3" ${LN} stroke-width="1.5"/>`;
  const stripes = Array.from({length:12}, (_,i) => `<rect x="${i*20+6}" y="0" width="8" height="170" fill="#f2dcb0"/>`).join('');
  return frame('#f8ead0', f, `
    ${stripes}
    ${W(`<path d="M0 170 H240 V240 H0 Z" fill="#b5764a" ${L}/><path d="M0 190 H240 M0 214 H240" ${LN} stroke-width="1.2" stroke="#7d4a28"/>`)}
    ${W(`<path d="M104 22 H136" ${LN} stroke-width="4"/><path d="M110 22 L120 30 L130 22" ${LN} stroke-width="1.2"/>`)}
    ${W(`<rect x="76" y="30" width="88" height="80" fill="#d9a33a" ${L}/>`)}
    ${img(F.full, 84, 38, 72, 64)}
    ${W(`<rect x="84" y="38" width="72" height="64" fill="none" ${L}/>`)}
    ${W(`<rect x="22" y="110" width="22" height="4" fill="${INK}"/><path d="M33 114 V170 M24 170 H42" ${LN}/><path d="M18 110 L24 82 H42 L48 110 Z" fill="${YEL}" ${L}/>`)}
    ${W(`<path d="M196 150 Q190 120 204 104 M206 150 Q212 118 222 106 M200 150 Q200 128 196 118" ${LN} stroke="#2f7a3a" stroke-width="2.4"/><ellipse cx="204" cy="104" rx="7" ry="4" fill="${GRN}" ${L} stroke-width="1.4" transform="rotate(-40 204 104)"/><ellipse cx="222" cy="106" rx="7" ry="4" fill="${GRN}" ${L} stroke-width="1.4" transform="rotate(30 222 106)"/><ellipse cx="196" cy="118" rx="6" ry="3.4" fill="${GRN}" ${L} stroke-width="1.4" transform="rotate(-70 196 118)"/>`)}
    ${W(pot(206, 150, 26))}
    ${W(`<path d="M56 140 Q56 124 72 124 H168 Q184 124 184 140 V150 H56 Z" fill="#d9452f" ${L}/>`)}
    ${person(96, 126, {hair:'bob', body:BLUE, mouth:'smile', eyes: f?'up':'shut', tilt:f?-8:0, sit:true, arms:[[-12,15,-8,26,2,25],[12,15,8,26,2,25]], hold:`<g transform="translate(2 24)">${mug(WHITE)}</g>`})}
    ${person(144, 126, {hair:'short', body:YEL, glasses:true, mouth:f?'open':'smile', eyes:'up', tilt:f?6:2, sit:true, arms:[[-12,15,-8,26,-2,25],[12,15,18,8]], hold:`<g transform="translate(-2 24)">${mug(RED)}</g>`})}
    ${W(steam(f?97:99)+steam(f?141:143))}
    ${W(`<path d="M44 144 Q44 132 56 132 V172 H44 Z M184 132 Q196 132 196 144 V172 H184 Z" fill="#c23a28" ${L}/><path d="M50 150 H190 V172 H50 Z" fill="#d9452f" ${L}/><path d="M120 150 V172" ${LN} stroke-width="1.4"/>`)}
    ${W(`<g transform="translate(176 116)"><ellipse cx="0" cy="12" rx="11" ry="7" fill="${WHITE}" ${L}/><circle cx="-8" cy="4" r="7" fill="${WHITE}" ${L}/><path d="M-14 -1 L-13 -8 L-9 -3 M-7 -3 L-3 -8 L-2 -1" fill="${WHITE}" ${L} stroke-width="1.6"/><circle cx="-10" cy="4" r=".9" fill="${INK}"/><circle cx="-5.5" cy="4" r=".9" fill="${INK}"/><path d="M10 12 Q${f?22:18} ${f?0:6} ${f?14:22} ${f?-6:0}" ${LN}/></g>`)}`);
}

/* ---------- 6. a model wears it as a print ---------- */
function model(F, f){
  const flash = (x, y, on) => on ? `<path d="M${x} ${y-12} L${x+3} ${y-3} L${x+12} ${y} L${x+3} ${y+3} L${x} ${y+12} L${x-3} ${y+3} L${x-12} ${y} L${x-3} ${y-3} Z" fill="${YEL}" ${L} stroke-width="1.4"/>` : '';
  const cam = side => `<rect x="${side>0?-2:-14}" y="-2" width="16" height="11" rx="2" fill="${INK}"/><circle cx="${side>0?6:-6}" cy="3.5" r="3.4" fill="#5a6070" stroke="${WHITE}" stroke-width="1"/>`;
  const sway = f ? 2 : -2;
  const legs = f ? `<path d="M-4 0 L-7 22 M4 0 L6 22" ${LN} stroke-width="2.2"/><path d="M-7 22 H-11 M6 22 H10" ${LN} stroke-width="2.6"/>`
                 : `<path d="M-4 0 L-2 22 M4 0 L9 21" ${LN} stroke-width="2.2"/><path d="M-2 22 H-6 M9 21 H13" ${LN} stroke-width="2.6"/>`;
  return frame('#1f48b8', f, `
    <defs><pattern id="print" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><rect width="22" height="22" fill="${CREAM}"/>${img(F.bare, 1, 1, 20, 20)}</pattern></defs>
    ${dots(26, f?11:23, WHITE, 240, 120, 1.5)}
    <path d="M96 0 H144 L210 240 H30 Z" fill="${CREAM}" opacity=".9"/>
    ${W(`<path d="M74 168 H166 L200 240 H40 Z" fill="${WHITE}" ${L}/><path d="M120 168 V240" ${LN} stroke-width="1" stroke-dasharray="4 5"/>`)}
    ${W(`<g transform="translate(${120+sway} 150)">${legs}</g>`)}
    ${W(`<g transform="translate(${120+sway} 0)"><path d="M-9 64 Q-14 64 -16 74 L-30 152 Q0 160 30 152 L16 74 Q14 64 9 64 Z" fill="url(#print)" ${L}/>
      <path d="M-14 72 Q-24 98 -14 112 M14 72 Q22 92 ${f?10:18} ${f?102:108}" ${LN}/>
      <path d="M-4 54 V64 M4 54 V64" ${LN}/>
      <g transform="translate(0 44)">${head({hair:'bob', mouth:'smile', eyes:f?'look-l':'dot', tilt:f?-4:4})}</g></g>`)}
    ${W(`${person(26, 196, {hair:'cap', hairCol:RED, body:'#364a6e', mouth:'flat', eyes:'look-r', arms:[[-12,15,-6,4],[12,15,8,4]], hold:`<g transform="translate(0 -2)">${cam(1)}</g>`, legs:'', s:.95})}
      ${person(214, 200, {hair:'short', body:'#6e3a5a', mouth:'o', eyes:'look-l', arms:[[-12,15,-8,4],[12,15,6,4]], hold:`<g transform="translate(0 -2)">${cam(-1)}</g>`, legs:'', s:.95})}`)}
    ${W(flash(f?44:200, f?178:182, true) + flash(f?190:30, f?120:132, f))}`);
}

const SCENES = [
  {key:'choir', ch:'CH.07 音樂台', kick:'藝文現場', head:'市民合唱團獻唱', draw:choir},
  {key:'kids',  ch:'CH.12 教育台', kick:'校園報導', head:'全校小朋友寫生', draw:kids},
  {key:'lab',   ch:'CH.21 科學台', kick:'科學新知', head:'研究室全力分析中', draw:lab},
  {key:'farm',  ch:'CH.05 農業台', kick:'農業報導', head:'農友試種成功', draw:farm},
  {key:'home',  ch:'CH.33 生活台', kick:'居家生活', head:'客廳掛畫新寵兒', draw:home},
  {key:'model', ch:'CH.18 時尚台', kick:'時尚快訊', head:'印花登上伸展台', draw:model},
];
window.Scenes = {
  list: SCENES,
  build: F => SCENES.map(s => ({...s, frames:[tidy(s.draw(F, 0)), tidy(s.draw(F, 1))]})),
};
})();

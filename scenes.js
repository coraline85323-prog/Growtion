/* Growtion — news-TV side scenes. Six pixel scenes (scenes/s1a.webp … s6b.webp), two frames each that
   swap to animate, with the newest flower dropped in: standing in the scene, hung as the painting,
   or printed on the model's dress (s6am/s6bm.png mark the dress).
   window.Scenes = {list, build(full, bare) -> Promise<[{key, ch, kick, head, ims:[canvas, canvas]}]>} */
(() => {
// f: where the flower stands in the 286px scene (x = centre, y = centre, s = size); full = with its background
const SCENES = [
  {key:'choir', ch:'CH.07 音樂台', kick:'藝文現場', head:'合唱團為它獻唱', f:{x:140, y:82, s:104}},
  {key:'kids',  ch:'CH.12 教育台', kick:'校園報導', head:'小學生集體寫生', f:{x:133, y:210, s:96}},
  {key:'lab',   ch:'CH.21 科學台', kick:'科學新知', head:'研究室全力分析中', f:{x:158, y:180, s:96}},
  {key:'farm',  ch:'CH.05 農業台', kick:'農業報導', head:'農友試種中', f:{x:203, y:224, s:84}},
  {key:'home',  ch:'CH.33 生活台', kick:'居家生活', head:'客廳掛畫新寵兒', f:{x:150, y:66, s:84, full:true}},
  {key:'model', ch:'CH.18 時尚台', kick:'時尚快訊', head:'印花登上伸展台', print:true},
];
const SZ = 480, K = SZ / 286;
const load = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });

// crop the background-less flower to the pixels it actually uses
function trim(src){
  const w = src.width, h = src.height, d = src.getContext('2d').getImageData(0, 0, w, h).data;
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for(let y = 0; y < h; y++) for(let x = 0; x < w; x++) if(d[(y*w + x)*4 + 3] > 20){ x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  if(x1 < 0) return src;
  const c = document.createElement('canvas'); c.width = x1 - x0 + 1; c.height = y1 - y0 + 1;
  c.getContext('2d').drawImage(src, -x0, -y0); return c;
}
function compose(s, im, mask, j, full, bare){
  const c = document.createElement('canvas'); c.width = c.height = SZ;
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = true; x.drawImage(im, 0, 0, SZ, SZ);
  x.imageSmoothingEnabled = false;
  if(s.f){
    const {x:cx, y:cy, s:sz} = s.f;
    x.save(); x.translate(cx*K, (cy + sz/2)*K);
    if(!s.f.full) x.rotate(j ? .04 : -.03);          // the flower sways from its base between the two frames
    if(s.f.full) x.drawImage(full, -sz/2*K, -sz*K, sz*K, sz*K);
    else { const w = sz * bare.width / bare.height; x.drawImage(bare, -w/2*K, -sz*K, w*K, sz*K); }
    x.restore();
  }
  if(mask){                                           // tile the flower, keep only the dress, lay it on
    const p = document.createElement('canvas'); p.width = p.height = SZ;
    const q = p.getContext('2d'), T = 44; q.imageSmoothingEnabled = false;
    for(let r = 0, y = -T/2; y < SZ; y += T*.8, r++) for(let xx = (r % 2 ? 0 : -T/2) - T; xx < SZ; xx += T) q.drawImage(bare, xx + (T - T*bare.width/bare.height)/2, y, T*bare.width/bare.height, T);
    q.globalCompositeOperation = 'destination-in'; q.imageSmoothingEnabled = true; q.drawImage(mask, 0, 0, SZ, SZ);
    x.globalAlpha = .9; x.drawImage(p, 0, 0); x.globalAlpha = 1;
  }
  return c;
}
window.Scenes = {
  list: SCENES,
  build: (full, bare) => (bare = trim(bare), Promise.all(SCENES.map(async (s, k) => {
    const ims = await Promise.all(['a','b'].map(n => load(`scenes/s${k+1}${n}.webp`)));
    const masks = s.print ? await Promise.all(['a','b'].map(n => load(`scenes/s${k+1}${n}m.png`))) : [null, null];
    return {...s, ims: ims.map((im, j) => compose(s, im, masks[j], j, full, bare))};
  }))),
};
})();

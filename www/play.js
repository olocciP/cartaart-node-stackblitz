'use strict';

const js = document.createElement('script');
js.async = false;
js.src = './hexjs.js';
document.querySelector('head').appendChild(js);

document.addEventListener('DOMContentLoaded', () => { });
document.addEventListener('contextmenu', e => { e.preventDefault(); }, false);

(() => { /*/ Cross events - Events appear out of order depending on the environment. /*/
  window.addEventListener('load', () => window.addEventListener('message', e => setload({ xml: e.data.xml })));
  window.addEventListener('message', e => window.addEventListener('load', () => setload({ xml: e.data.xml })));
})();

let hPlan, hPlot, hPack, hPart, hPage, hPlay;

/*/ Page Drop > /*/
const setdrop = v => {
  const {} = v;

  const behave = hPlan.behave;
  // console.clear();
  console.log(`#Drop ${hPlot.domain}, get ${behave}`);

  hPack = null;
  hPart = null;
  hPlay = null;
  hPage = null;
  hPlot = null;
  hPlan = null;

  const icon = document.head.querySelector('link');
  icon.setAttribute( 'href', `./work/${behave}icon.svg` );

  const title = document.head.querySelector('title');
  const page = behave.match(/(?<=\.\/)(.*)(?=\/)/g).join('');
  title.innerText = 'GoStop.TV - ' + page.replace(/^[a-z]/, char => char.toUpperCase());

  const iframe = document.createElement('iframe');
  iframe.hidden = true;
  iframe.src = `./work/${behave}pack.html`;
  document.body.prepend(iframe);
}
/*/ Page Drop < /*/

/*/ Page Load > /*/
const setload = v => {
  const { xml } = v;

  /*/ First Plan /*/ 
  hPlan = new HEX.Plan();
  hPlan.init({ func: () => { return setframe({}); }, status: true });

  /*/ Second Plot /*/
  hPlot = new HEX.Plot(); 
  hPlot.init({ xml: xml });
  const stage = hPlot.stage;
  const stuff = hPlot.stuff;
  const scene = hPlot.scene;
  const svg = hPlot.svg;
  const cs = /*/ canvas /*/ hPlot.cs

  console.log('#Load', hPlot.domain);
  document.body.querySelector('iframe').remove();

  /*/ Third Page /*/
  hPage = new HEX.Page();
  hPage.init({ name: 'hex', id: 'hex', type: '2d', width: cs.w, height: cs.h, color: cs.c, body: hPlot.c });
  hPage.set({ dpr: hPlan.wds.dpr, s: cs.s });
  const cx = /*/ context /*/ hPage.cx;

  /*/ Fourth Play /*/
  hPlay = new HEX.Play();
  const touch = hPlan.wds.mob;
  hPlay.init({ width: cs.w, height: cs.h, cs: hPage.cs, cx: cx, touch: touch });

  window.addEventListener('resize', () => { hPage.setsize({ dpr: hPlan.wds.dpr, s: cs.s }) });
  hPage.cs.addEventListener(hPlay.touch.start, e => hPlay.setpos({ e: e, type: 'start', touch: touch, bcr: hPage.bcr }), false);
  hPage.cs.addEventListener(hPlay.touch.move, e => hPlay.setpos({ e: e, type: 'move', touch: touch, bcr: hPage.bcr }), false);
  hPage.cs.addEventListener(hPlay.touch.end, e => hPlay.setpos({ e: e, type: 'end', touch: touch, bcr: hPage.bcr }), false);

  /*/ Fifth  Part /*/
  hPart = new HEX.Part();
  hPart.init({ width: cs.w, height: cs.h, cx: cx });

  /*/ stage > part /*/
  Object.keys(stage.part).forEach(e => {
    const v = {};
    for (let key in stage.part[e]) { v[key] = stage.part[e][key]; }

    hPart[e] = v;
  });

  /*/ stuff > part /*/
  Object.keys(stuff.part).forEach(e => {
    const v = {};
    for (let key in stuff.part[e]) { v[key] = stuff.part[e][key]; }

    hPart[e] = v;
  });

  /*/ stuff > part > flipbook /*/
  Object.keys(stuff.flipbook).forEach(e => {
    const v = {};

    for (let key in stuff.flipbook[e]) { v[key] = stuff.flipbook[e][key]; }

    hPlay.fb.on = false; /*/ true, false /*/
    hPlay.fb.off = 0; /*/ -1, 0 ,1 /*/
    hPlay.fb.page = 0;
    if(v.objs.length%2 /*/ Must be even /*/){ v.objs.push(''); }
    hPlay.fb.len = v.objs.length;
    hPlay.fb.gf = 0.8; /*/ Gravitational Force /*/
    hPlay.fb.xy = v.xy;
    hPlay.fb.wh = v.wh;
    hPlay.fb.hv = v.hv;
    const xy = { x: cs.w*0.5, y: (cs.h - v.wh[1].h)*0.5 + v.wh[1].h };
    hPlay.fb.pivot = { x: xy.x, y: xy.y, pow: v.wh[1].w*v.wh[1].w };
    hPlay.fb.cc = v.cc;
    hPlay.fb.skip = [1, 5, 15, 25, 35, 55, 85, 135];
    hPlay.fb.mark = [];

    v.objs.forEach((e, i) => {
      e = e.length ? e : String.fromCharCode(v.cc.code + i); /*/ Index Image String /*/
      // const c = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      const c = `hsla(${parseInt(36*Math.random())*10}, 100%, 80%, 1)`; /*/ Pastel /*/
      hPart.fbps.push(new hPart.fbp({ x: xy.x, y: xy.y - v.wh[1].h, w: v.wh[1].w, h: v.wh[1].h, c: c, str: e }));
    });
  });

  /*/ stuff > part > trace /*/
  Object.keys(stuff.trace).forEach(e => {
    const v = hPart.setpath({ svg: svg.obj, obj: stuff.trace[e].obj });

    for (let key in stuff.trace[e]) { v[key] = stuff.trace[e][key]; }
    v.ss.cnt = 1;
    v.ss.len = Object.keys(v.p2s).length - 1;
    v.drag = {};
    v.code = v.obj.split('_')[1].charCodeAt(); /*/ code for English, Korean... /*/

    hPlay.trace.str.push(v.code);
    hPart.traces[v.code] = v;
  });
  hPlay.trace.len = hPlay.trace.str.length;

  /*/ Sixth Pack /*/
  hPack = new HEX.Pack(); 
  hPack.init({ width: cs.w, height: cs.h, cx: cx });

  /*/ stage > pack > gradient /*/
  Object.keys(stage.gradient).forEach((e, i, k) => {
    const v = {};
    for (let key in stage.gradient[e]) { v[key] = stage.gradient[e][key]; }
    v.fn = hPack['set' + stage.gradient[e].type];

    if(stage.gradient[e].g.length) { hPart[stage.gradient[e].g].rsc.push(e); }
    hPack.gradients[k[i]] = v;
  });

  /*/ stage > pack > face /*/
  Object.keys(stage.face).forEach((e, i, k) => {
    const v = hPack.setsvg({ prefix: 'data:image/svg+xml;charset=utf-8,', svg: svg.obj, obj: stage.face[e].obj });
    
    for (let key in stage.face[e]) { v[key] = stage.face[e][key]; }
    
    if(stage.face[e].g.length) { hPart[stage.face[e].g].rsc.push(e); }
    hPack.faces[k[i]] = v;
  });

  /*/ stage > pack > shape /*/
  Object.keys(stage.shape).forEach((e, i, k) => {
    const v = {};
    for (let key in stage.shape[e]) { v[key] = stage.shape[e][key]; }
    v.fn = hPack['set' + stage.shape[e].type];

    if(stage.shape[e].g.length) { hPart[stage.shape[e].g].rsc.push(e); }
    hPack.shapes[k[i]] = v;
  });

  /*/ stage > pack > button /*/
  Object.keys(stage.btn).forEach((e, i, k) => {
    const v = hPack.setsvg({ prefix: 'data:image/svg+xml;charset=utf-8,', svg: svg.obj, obj: stage.btn[e].obj });
 
    stage.btn[e].xy.push({ x: stage.btn[e].xy[1].x + stage.btn[e].xy[0].x, y: stage.btn[e].xy[1].y + stage.btn[e].xy[0].y });
    stage.btn[e].wh.push({ w: stage.btn[e].wh[1].w + stage.btn[e].wh[0].w, h: stage.btn[e].wh[1].h + stage.btn[e].wh[0].h });
    for (let key in stage.btn[e]) { v[key] = stage.btn[e][key]; }

    if(stage.btn[e].g.length) { hPart[stage.btn[e].g].rsc.push(e); }
    v.bvr = new Path2D(); /*/ Button Virtual Rect /*/
    hPack.btns[k[i]] = v;
  });

  /*/ stage > pack > string /*/
  Object.keys(stage.str).forEach((e, i, k) => {
    const v = {};
    for (let key in stage.str[e]) { v[key] = stage.str[e][key]; }

    if(stage.str[e].g.length) { hPart[stage.str[e].g].rsc.push(e); }
    hPack.strs[k[i]] = v;
  });

  /*/ stage > pack > event - button /*/
  Object.keys(stage.evt).forEach((e, i, k) => {
    const v = {};
    for (let key in stage.evt[e]) { v[key] = stage.evt[e][key]; }

    v.dpr = hPlan.wds.dpr; /*/ devicePixelRatio for position x, y /*/
    hPack.evts[k[i]] = v;
  });

  /*/ stage > pack > event - timer /*/
  Object.keys(stage.time).forEach((e, i, k) => {
    const v = {};
    for (let key in stage.time[e]) { v[key] = stage.time[e][key]; }

    hPack.times[k[i]] = v;
  });

  /*/  stuff > pack > /*/
  Object.keys(stuff.part).forEach(e => {
    const v = {};
    for (let key in stuff.part[e]) { v[key] = stuff.part[e][key]; }

    hPart[e] = v;
  });

  /*/  stuff > pack > prop /*/
  Object.keys(stuff.prop).forEach((e, i, k) => {
    const v = hPack.setsvg({ prefix: 'data:image/svg+xml;charset=utf-8,', svg: svg.obj, obj: stuff.prop[e].obj });
    for (let key in stuff.prop[e]) { v[key] = stuff.prop[e][key]; }
    
    const d = stuff.prop[e].path;
    if(d.length) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttributeNS(null, 'd', d);
      const pathLength = Math.floor(path.getTotalLength());

      hPlay.paths[k[i]] = {d: path, l: pathLength};
    }
    hPack.props[k[i]] = v;
  });

  /*/  stuff > pack > cast /*/
  Object.keys(stuff.cast).forEach((e, i, k) => {
    const v = hPack.setsvg({ prefix: 'data:image/svg+xml;charset=utf-8,', svg: svg.obj, obj: stuff.cast[e].objs });
    for (let key in stuff.cast[e]) { v[key] = stuff.cast[e][key]; }

    const d = stuff.cast[e].path;
    if(d.length) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttributeNS(null, 'd', d);
      const pathLength = Math.floor(path.getTotalLength());

      hPlay.paths[k[i]] = {d: path, l: pathLength};
    }
    hPack.casts[k[i]] = v;
  });

  /*/ stuff > pack > effect /*/
  Object.keys(stuff.eft).forEach((e, i, k) => {
    const v = {};
    for (let key in stuff.eft[e]) { v[key] = stuff.eft[e][key]; }

    v.fn = hPack['set' + stuff.eft[e].type];
    hPack.efts[k[i]] = v;
  });
  /*/  Pack > scene /*/

  /*/ setframe > /*/
  const faces = hPack.faces;
  const btns = hPack.btns;
  const props = hPack.props;
  const casts = hPack.casts;

  const setframe = v => {
    const {} = v;

    hPlay.setclear({ cs: /*/ hPlot.cs /*/ cs, pg: hPage, dpr: hPlan.wds.dpr });
    const xy = hPlay.pos;
    Object.keys(hPack.gradients).forEach(e => { hPack.gradients[e].fn(hPack.gradients[e]); });
    Object.keys(faces).forEach(e => {
      cx.drawImage(faces[e].img, faces[e].xy[1].x, faces[e].xy[1].y, faces[e].wh[1].w, faces[e].wh[1].h);
    });
    
    Object.keys(hPack.shapes).forEach(e => { hPack.shapes[e].fn(hPack.shapes[e]); });
    Object.keys(hPack.strs).forEach(e => { hPack.setstr(hPack.strs[e]); });

    Object.keys(btns).forEach(e => {
      if(parseInt(btns[e].opt.ot*10)){
        const n = btns[e].opt.or ? 2 : 1;
        cx.drawImage(btns[e].img, btns[e].xy[n].x, btns[e].xy[n].y, btns[e].wh[n].w, btns[e].wh[n].h);
      }
    });
    
    Object.keys(props).forEach(e => {
      hPlay.setmove({xy: props[e].xy, hv: props[e].hv, by: "", path: hPlay.paths[e], p: props[e].p});
      hPlay.setdraw({img: props[e].img, xy: props[e].xy[1], wh: props[e].wh[1], hv: props[e].hv[1]});
    });

    Object.keys(casts).forEach(e => {
      hPlay.setmove({xy: casts[e].xy, hv: casts[e].hv, by: casts[e].by, path: hPlay.paths[e], p: casts[e].p});
      const n = casts[e].by.n;
      hPlay.setdraw({img: casts[e].img[n], xy: casts[e].xy[1], wh: casts[e].wh[1], hv: casts[e].hv[1]});
    });

    Object.keys(hPack.evts /*/ EVenTS /*/).forEach(e => hPlay['put'+hPack.evts[e].type](hPack.evts[e]));
    Object.keys(hPack.efts /*/ EFfecTS /*/).forEach(e => hPlay['set'+hPack.efts[e].type](hPack.efts[e]));
    
    hPlay.fb.set({ ps: hPart.fbps /*/ Flip Book PageS - array /*/, cx: cx, pos: hPlay.pos, r: hPage.r });

    Object.keys(hPart.traces /*/ tracing alphabets /*/).forEach(e => {
      hPlay.trace.set({ tr: hPart.traces[e], cx: cx, pos: hPlay.pos, scale: hPage.scale, dpr: hPlan.wds.dpr });
    });

    hPlay.pos.start = {};
    hPlay.pos.end = {}; 

    if(!hPlan.status) { hPlan.func = () => { return setdrop({}); }; }
    requestAnimationFrame(hPlan.func);
  };
  /*/ setframe < /*/
  
  requestAnimationFrame(hPlan.func);
};
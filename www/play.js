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

const h = {};

/*/ Page Drop > /*/
const setdrop = v => {
  const {} = v;

  const behave = h.plan.behave;
  // console.clear();
  console.log(`#Drop ${h.plot.domain}, get ${behave}`);

  h.pack = null;
  h.part = null;
  h.play = null;
  h.page = null;
  h.plot = null;
  h.plan = null;

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
  h.plan = new HEX.Plan();
  h.plan.init({ func: () => { return setframe({}); }, status: true });

  /*/ Second Plot /*/
  h.plot = new HEX.Plot(); 
  h.plot.init({ xml: xml });
  const stage = h.plot.stage;
  const stuff = h.plot.stuff;
  const scene = h.plot.scene;
  const svg = h.plot.svg;
  const cs = /*/ canvas /*/ h.plot.cs

  console.log('#Load', h.plot.domain);
  document.body.querySelector('iframe').remove();

  /*/ Third Page /*/
  h.page = new HEX.Page();
  h.page.init({ name: 'hex', id: 'hex', type: '2d', width: cs.w, height: cs.h, color: cs.c, body: h.plot.c });
  h.page.set({ dpr: h.plan.wds.dpr, s: cs.s });
  const cx = /*/ context /*/ h.page.cx;

  /*/ Fourth Play /*/
  h.play = new HEX.Play();
  const touch = h.plan.wds.mob;
  h.play.init({ width: cs.w, height: cs.h, cs: h.page.cs, cx: cx, touch: touch });

  window.addEventListener('resize', () => { h.page.setsize({ dpr: h.plan.wds.dpr, s: cs.s }) });
  h.page.cs.addEventListener(h.play.touch.start, e => h.play.setpos({ e: e, type: 'start', touch: touch, bcr: h.page.bcr }), false);
  h.page.cs.addEventListener(h.play.touch.move, e => h.play.setpos({ e: e, type: 'move', touch: touch, bcr: h.page.bcr }), false);
  h.page.cs.addEventListener(h.play.touch.end, e => h.play.setpos({ e: e, type: 'end', touch: touch, bcr: h.page.bcr }), false);

  /*/ Fifth  Part /*/
  h.part = new HEX.Part();
  h.part.init({ width: cs.w, height: cs.h, cx: cx });

  /*/ stage > part /*/
  Object.keys(stage.part).forEach(e => {
    const v = {};
    for (let key in stage.part[e]) { v[key] = stage.part[e][key]; }

    h.part[e] = v;
  });

  /*/ stuff > part /*/
  Object.keys(stuff.part).forEach(e => {
    const v = {};
    for (let key in stuff.part[e]) { v[key] = stuff.part[e][key]; }

    h.part[e] = v;
  });

  /*/ stuff > part > flipbook /*/
  Object.keys(stuff.flipbook).forEach(e => {
    const v = {};

    for (let key in stuff.flipbook[e]) { v[key] = stuff.flipbook[e][key]; }

    h.play.fb.on = false; /*/ true, false /*/
    h.play.fb.off = 0; /*/ -1, 0 ,1 /*/
    h.play.fb.page = 0;
    if(v.objs.length%2 /*/ Must be even /*/){ v.objs.push(''); }
    h.play.fb.len = v.objs.length;
    h.play.fb.gf = 0.8; /*/ Gravitational Force /*/
    h.play.fb.xy = v.xy;
    h.play.fb.wh = v.wh;
    h.play.fb.hv = v.hv;
    const xy = { x: cs.w*0.5, y: (cs.h - v.wh[1].h)*0.5 + v.wh[1].h };
    h.play.fb.pivot = { x: xy.x, y: xy.y, pow: v.wh[1].w*v.wh[1].w };
    h.play.fb.cc = v.cc;
    h.play.fb.skip = [1, 5, 15, 25, 35, 55, 85, 135];
    h.play.fb.mark = [];

    v.objs.forEach((e, i) => {
      e = e.length ? e : String.fromCharCode(v.cc.code + i); /*/ Index Image String /*/
      // const c = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      const c = `hsla(${parseInt(36*Math.random())*10}, 100%, 80%, 1)`; /*/ Pastel /*/
      h.part.fbps.push(new h.part.fbp({ x: xy.x, y: xy.y - v.wh[1].h, w: v.wh[1].w, h: v.wh[1].h, c: c, str: e }));
    });
  });

  /*/ stuff > part > trace /*/
  Object.keys(stuff.trace).forEach(e => {
    const v = h.part.setpath({ svg: svg.obj, obj: stuff.trace[e].obj });

    for (let key in stuff.trace[e]) { v[key] = stuff.trace[e][key]; }
    v.ss.cnt = 1;
    v.ss.len = Object.keys(v.p2s).length - 1;
    v.drag = {};
    v.code = v.obj.split('_')[1].charCodeAt(); /*/ code for English, Korean... /*/

    h.play.trace.str.push(v.code);
    h.part.traces[v.code] = v;
  });
  h.play.trace.len = h.play.trace.str.length;

  /*/ Sixth Pack /*/
  h.pack = new HEX.Pack(); 
  h.pack.init({ width: cs.w, height: cs.h, cx: cx });

  /*/ stage > pack > gradient /*/
  Object.keys(stage.gradient).forEach((e, i, k) => {
    const v = {};
    for (let key in stage.gradient[e]) { v[key] = stage.gradient[e][key]; }
    v.fn = h.pack['set' + stage.gradient[e].type];

    if(stage.gradient[e].g.length) { h.part[stage.gradient[e].g].rsc.push(e); }
    h.pack.gradients[k[i]] = v;
  });

  /*/ stage > pack > face /*/
  Object.keys(stage.face).forEach((e, i, k) => {
    const v = h.pack.setsvg({ prefix: 'data:image/svg+xml;charset=utf-8,', svg: svg.obj, obj: stage.face[e].obj });
    
    for (let key in stage.face[e]) { v[key] = stage.face[e][key]; }
    
    if(stage.face[e].g.length) { h.part[stage.face[e].g].rsc.push(e); }
    h.pack.faces[k[i]] = v;
  });

  /*/ stage > pack > shape /*/
  Object.keys(stage.shape).forEach((e, i, k) => {
    const v = {};
    for (let key in stage.shape[e]) { v[key] = stage.shape[e][key]; }
    v.fn = h.pack['set' + stage.shape[e].type];

    if(stage.shape[e].g.length) { h.part[stage.shape[e].g].rsc.push(e); }
    h.pack.shapes[k[i]] = v;
  });

  /*/ stage > pack > button /*/
  Object.keys(stage.btn).forEach((e, i, k) => {
    const v = h.pack.setsvg({ prefix: 'data:image/svg+xml;charset=utf-8,', svg: svg.obj, obj: stage.btn[e].obj });
 
    stage.btn[e].xy.push({ x: stage.btn[e].xy[1].x + stage.btn[e].xy[0].x, y: stage.btn[e].xy[1].y + stage.btn[e].xy[0].y });
    stage.btn[e].wh.push({ w: stage.btn[e].wh[1].w + stage.btn[e].wh[0].w, h: stage.btn[e].wh[1].h + stage.btn[e].wh[0].h });
    for (let key in stage.btn[e]) { v[key] = stage.btn[e][key]; }

    if(stage.btn[e].g.length) { h.part[stage.btn[e].g].rsc.push(e); }
    v.bvr = new Path2D(); /*/ Button Virtual Rect /*/
    h.pack.btns[k[i]] = v;
  });

  /*/ stage > pack > string /*/
  Object.keys(stage.str).forEach((e, i, k) => {
    const v = {};
    for (let key in stage.str[e]) { v[key] = stage.str[e][key]; }

    if(stage.str[e].g.length) { h.part[stage.str[e].g].rsc.push(e); }
    h.pack.strs[k[i]] = v;
  });

  /*/ stage > pack > event - button /*/
  Object.keys(stage.evt).forEach((e, i, k) => {
    const v = {};
    for (let key in stage.evt[e]) { v[key] = stage.evt[e][key]; }

    v.dpr = h.plan.wds.dpr; /*/ devicePixelRatio for position x, y /*/
    h.pack.evts[k[i]] = v;
  });

  /*/ stage > pack > event - timer /*/
  Object.keys(stage.time).forEach((e, i, k) => {
    const v = {};
    for (let key in stage.time[e]) { v[key] = stage.time[e][key]; }

    h.pack.times[k[i]] = v;
  });

  /*/  stuff > pack > /*/
  Object.keys(stuff.part).forEach(e => {
    const v = {};
    for (let key in stuff.part[e]) { v[key] = stuff.part[e][key]; }
    h.part[e] = v;
  });

  /*/  stuff > pack > prop /*/
  Object.keys(stuff.prop).forEach((e, i, k) => {
    const v = h.pack.setsvg({ prefix: 'data:image/svg+xml;charset=utf-8,', svg: svg.obj, obj: stuff.prop[e].obj });
    for (let key in stuff.prop[e]) { v[key] = stuff.prop[e][key]; }
    
    const d = stuff.prop[e].path;
    if(d.length) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttributeNS(null, 'd', d);
      const pathLength = Math.floor(path.getTotalLength());

      h.play.paths[k[i]] = {d: path, l: pathLength};
    }
    h.pack.props[k[i]] = v;
  });

  /*/  stuff > pack > cast /*/
  Object.keys(stuff.cast).forEach((e, i, k) => {
    const v = h.pack.setsvg({ prefix: 'data:image/svg+xml;charset=utf-8,', svg: svg.obj, obj: stuff.cast[e].objs });
    for (let key in stuff.cast[e]) { v[key] = stuff.cast[e][key]; }

    const d = stuff.cast[e].path;
    if(d.length) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttributeNS(null, 'd', d);
      const pathLength = Math.floor(path.getTotalLength());

      h.play.paths[k[i]] = {d: path, l: pathLength};
    }
    h.pack.casts[k[i]] = v;
  });

  /*/ stuff > pack > effect /*/
  Object.keys(stuff.eft).forEach((e, i, k) => {
    const v = {};
    for (let key in stuff.eft[e]) { v[key] = stuff.eft[e][key]; }

    v.fn = h.pack['set' + stuff.eft[e].type];
    h.pack.efts[k[i]] = v;
  });
  /*/  Pack > scene /*/

  /*/ setframe > /*/
  const faces = h.pack.faces;
  const btns = h.pack.btns;
  const props = h.pack.props;
  const casts = h.pack.casts;

  const setframe = v => {
    const {} = v;

    h.play.setclear({ cs: /*/ h.plot.cs /*/ cs, pg: h.page, dpr: h.plan.wds.dpr });
    const xy = h.play.pos;

    Object.keys(h.pack.gradients).forEach(e => { h.pack.gradients[e].fn(h.pack.gradients[e]); });
    Object.keys(faces).forEach(e => {
      cx.drawImage(faces[e].img, faces[e].xy[1].x, faces[e].xy[1].y, faces[e].wh[1].w, faces[e].wh[1].h);
    });
    
    Object.keys(h.pack.shapes).forEach(e => { h.pack.shapes[e].fn(h.pack.shapes[e]); });
    Object.keys(h.pack.strs).forEach(e => { h.pack.setstr(h.pack.strs[e]); });

    Object.keys(btns).forEach(e => {
      if(parseInt(btns[e].opt.ot*10)){
        const n = btns[e].opt.or ? 2 : 1;
        cx.drawImage(btns[e].img, btns[e].xy[n].x, btns[e].xy[n].y, btns[e].wh[n].w, btns[e].wh[n].h);
      }
    });
    
    Object.keys(props).forEach(e => {
      h.play.setmove({xy: props[e].xy, hv: props[e].hv, by: "", path: h.play.paths[e], p: props[e].p});
      h.play.setdraw({img: props[e].img, xy: props[e].xy[1], wh: props[e].wh[1], hv: props[e].hv[1]});
    });

    Object.keys(casts).forEach(e => {
      h.play.setmove({xy: casts[e].xy, hv: casts[e].hv, by: casts[e].by, path: h.play.paths[e], p: casts[e].p});
      const n = casts[e].by.n;
      h.play.setdraw({img: casts[e].img[n], xy: casts[e].xy[1], wh: casts[e].wh[1], hv: casts[e].hv[1]});
    });

    Object.keys(h.pack.evts /*/ EVenTS /*/).forEach(e => {
      const clone = Object.assign({}, h.pack.evts[e]);
      clone.hplot = h.plot;
      clone.hplan = h.plan;
      clone.hpack = h.pack;
      clone.hpage = h.page;
      h.play['put'+h.pack.evts[e].type](clone);
    });
    Object.keys(h.pack.efts /*/ EFfecTS /*/).forEach(e => h.play['set'+h.pack.efts[e].type](h.pack.efts[e]));
    
    h.play.fb.set({ ps: h.part.fbps /*/ Flip Book PageS - array /*/, cx: cx, pos: h.play.pos, r: h.page.r });

    Object.keys(h.part.traces /*/ tracing alphabets /*/).forEach(e => {
      h.play.trace.set({ tr: h.part.traces[e], cx: cx, pos: h.play.pos, scale: h.page.scale, dpr: h.plan.wds.dpr });
    });

    h.play.pos.start = {};
    h.play.pos.end = {}; 

    if(!h.plan.status) { h.plan.func = () => { return setdrop({}); }; }
    requestAnimationFrame(h.plan.func);
  };
  /*/ setframe < /*/
  
  requestAnimationFrame(h.plan.func);
};
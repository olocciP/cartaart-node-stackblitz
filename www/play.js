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

const hP = {}; /*/ HEX 6Ps /*/

/*/ Page Drop > /*/
const setdrop = v => {
  const {} = v;

  const behave = hP.lan.behave;
  // console.clear();
  console.log(`#Drop ${hP.lot.domain}, get ${behave}`);

  hP.lay = null;
  hP.age = null;
  hP.art = null;
  hP.ack = null;
  hP.lot = null;
  hP.lan = null;

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
  hP.lan = new HEX.Plan();
  hP.lan.init({ func: () => { return setframe({}); }, status: true });

  /*/ Second Plot /*/
  hP.lot = new HEX.Plot(); 
  hP.lot.init({ xml: xml });
  const stage = hP.lot.stage;
  const stuff = hP.lot.stuff;
  const scene = hP.lot.scene;
  const svg = hP.lot.svg;
  const cs = /*/ canvas /*/ hP.lot.cs

  console.log('#Load', hP.lot.domain);
  document.body.querySelector('iframe').remove();

  /*/ Third Page /*/
  hP.age = new HEX.Page();
  hP.age.init({ name: 'hex', id: 'hex', type: '2d', width: cs.w, height: cs.h, color: cs.c, body: hP.lot.c });
  hP.age.set({ dpr: hP.lan.wds.dpr, s: cs.s });
  const cx = /*/ context /*/ hP.age.cx;

  /*/ Fourth Play /*/
  hP.lay = new HEX.Play();
  const touch = hP.lan.wds.mob;
  hP.lay.init({ width: cs.w, height: cs.h, cs: hP.age.cs, cx: cx, touch: touch });

  window.addEventListener('resize', () => { hP.age.setsize({ dpr: hP.lan.wds.dpr, s: cs.s }) });
  hP.age.cs.addEventListener(hP.lay.touch.start, e => hP.lay.setpos({ e: e, type: 'start', touch: touch, bcr: hP.age.bcr }), false);
  hP.age.cs.addEventListener(hP.lay.touch.move, e => hP.lay.setpos({ e: e, type: 'move', touch: touch, bcr: hP.age.bcr }), false);
  hP.age.cs.addEventListener(hP.lay.touch.end, e => hP.lay.setpos({ e: e, type: 'end', touch: touch, bcr: hP.age.bcr }), false);

  /*/ Fifth  Part /*/
  hP.art = new HEX.Part();
  hP.art.init({ width: cs.w, height: cs.h, cx: cx });

  /*/ stage > part /*/
  Object.keys(stage.part).forEach(e => {
    const v = {};
    for (let key in stage.part[e]) { v[key] = stage.part[e][key]; }

    hP.art[e] = v;
  });

  /*/ stuff > part /*/
  Object.keys(stuff.part).forEach(e => {
    const v = {};
    for (let key in stuff.part[e]) { v[key] = stuff.part[e][key]; }

    hP.art[e] = v;
  });

  /*/ stuff > part > flipbook /*/
  Object.keys(stuff.flipbook).forEach(e => {
    const v = {};

    for (let key in stuff.flipbook[e]) { v[key] = stuff.flipbook[e][key]; }

    hP.lay.fb.on = false; /*/ true, false /*/
    hP.lay.fb.off = 0; /*/ -1, 0 ,1 /*/
    hP.lay.fb.page = 0;
    if(v.objs.length%2 /*/ Must be even /*/){ v.objs.push(''); }
    hP.lay.fb.len = v.objs.length;
    hP.lay.fb.gf = 0.8; /*/ Gravitational Force /*/
    hP.lay.fb.xy = v.xy;
    hP.lay.fb.wh = v.wh;
    hP.lay.fb.hv = v.hv;
    const xy = { x: cs.w*0.5, y: (cs.h - v.wh[1].h)*0.5 + v.wh[1].h };
    hP.lay.fb.pivot = { x: xy.x, y: xy.y, pow: v.wh[1].w*v.wh[1].w };
    hP.lay.fb.cc = v.cc;
    hP.lay.fb.skip = [1, 5, 15, 25, 35, 55, 85, 135];
    hP.lay.fb.mark = [];

    v.objs.forEach((e, i) => {
      e = e.length ? e : String.fromCharCode(v.cc.code + i); /*/ Index Image String /*/
      // const c = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      const c = `hsla(${parseInt(36*Math.random())*10}, 100%, 80%, 1)`; /*/ Pastel /*/
      hP.art.fbps.push(new hP.art.fbp({ xy: { x: xy.x, y: xy.y - v.wh[1].h }, wh: { w: v.wh[1].w, h: v.wh[1].h }, c: c, str: e }));
    });
  });

  /*/ stuff > part > trace /*/
  Object.keys(stuff.trace).forEach(e => {
    const v = hP.art.setpath({ svg: svg.obj, obj: stuff.trace[e].obj });

    for (let key in stuff.trace[e]) { v[key] = stuff.trace[e][key]; }
    v.ss.cnt = 1;
    v.ss.len = Object.keys(v.p2s).length - 1;
    v.drag = {};
    v.code = v.obj.split('_')[1].charCodeAt(); /*/ code for English, Korean... /*/

    hP.lay.trace.str.push(v.code);
    hP.art.traces[v.code] = v;
  });
  hP.lay.trace.len = hP.lay.trace.str.length;

  /*/ Sixth Pack /*/
  hP.ack = new HEX.Pack(); 
  hP.ack.init({ width: cs.w, height: cs.h, cx: cx });

  /*/ stage > pack > gradient /*/
  Object.keys(stage.gradient).forEach(e  => {
    const v = {};
    for (let key in stage.gradient[e]) { v[key] = stage.gradient[e][key]; }
    v.fn = hP.ack['set' + stage.gradient[e].type];

    if(stage.gradient[e].g.length) { hP.art[stage.gradient[e].g].rsc.push(e); }

    hP.ack.gradients[e] = v;
  });

  /*/ stage > pack > face /*/
  Object.keys(stage.face).forEach(e => {
    const v = hP.ack.setsvg({ prefix: 'data:image/svg+xml;charset=utf-8,', svg: svg.obj, obj: stage.face[e].obj });
    
    for (let key in stage.face[e]) { v[key] = stage.face[e][key]; }
    
    if(stage.face[e].g.length) { hP.art[stage.face[e].g].rsc.push(e); }
    hP.ack.faces[e] = v;
  });

  /*/ stage > pack > shape /*/
  Object.keys(stage.shape).forEach(e => {
    const v = {};
    for (let key in stage.shape[e]) { v[key] = stage.shape[e][key]; }
    v.fn = hP.ack['set' + stage.shape[e].type];

    if(stage.shape[e].g.length) { hP.art[stage.shape[e].g].rsc.push(e); }
    hP.ack.shapes[e] = v;
  });

  /*/ stage > pack > button /*/
  Object.keys(stage.btn).forEach(e => {
    const v = hP.ack.setsvg({ prefix: 'data:image/svg+xml;charset=utf-8,', svg: svg.obj, obj: stage.btn[e].obj });
 
    stage.btn[e].xy.push({ x: stage.btn[e].xy[1].x + stage.btn[e].xy[0].x, y: stage.btn[e].xy[1].y + stage.btn[e].xy[0].y });
    stage.btn[e].wh.push({ w: stage.btn[e].wh[1].w + stage.btn[e].wh[0].w, h: stage.btn[e].wh[1].h + stage.btn[e].wh[0].h });
    for (let key in stage.btn[e]) { v[key] = stage.btn[e][key]; }

    if(stage.btn[e].g.length) { hP.art[stage.btn[e].g].rsc.push(e); }
    v.bvr = new Path2D(); /*/ Button Virtual Rect /*/
    hP.ack.btns[e] = v;
  });

  /*/ stage > pack > string /*/
  Object.keys(stage.str).forEach(e => {
    const v = {};
    for (let key in stage.str[e]) { v[key] = stage.str[e][key]; }

    if(stage.str[e].g.length) { hP.art[stage.str[e].g].rsc.push(e); }
    hP.ack.strs[e] = v;
  });

  /*/ stage > pack > event - button /*/
  Object.keys(stage.evt).forEach(e => {
    const v = {};
    for (let key in stage.evt[e]) { v[key] = stage.evt[e][key]; }

    v.dpr = hP.lan.wds.dpr; /*/ devicePixelRatio for position x, y /*/
    hP.ack.evts[e] = v;
  });

  /*/ stage > pack > event - timer /*/
  Object.keys(stage.time).forEach(e => {
    const v = {};
    for (let key in stage.time[e]) { v[key] = stage.time[e][key]; }

    hP.ack.times[e] = v;
  });

  /*/  stuff > pack > /*/
  Object.keys(stuff.part).forEach(e => {
    const v = {};
    for (let key in stuff.part[e]) { v[key] = stuff.part[e][key]; }
    hP.art[e] = v;
  });

  /*/  stuff > pack > prop /*/
  Object.keys(stuff.prop).forEach(e => {
    const v = hP.ack.setsvg({ prefix: 'data:image/svg+xml;charset=utf-8,', svg: svg.obj, obj: stuff.prop[e].obj });
    for (let key in stuff.prop[e]) { v[key] = stuff.prop[e][key]; }
    
    const d = stuff.prop[e].path;
    if(d.length) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttributeNS(null, 'd', d);
      const pathLength = Math.floor(path.getTotalLength());

      hP.lay.paths[e] = {d: path, l: pathLength};
    }
    hP.ack.props[e] = v;
  });

  /*/  stuff > pack > cast /*/
  Object.keys(stuff.cast).forEach(e => {
    const v = hP.ack.setsvg({ prefix: 'data:image/svg+xml;charset=utf-8,', svg: svg.obj, obj: stuff.cast[e].objs });
    for (let key in stuff.cast[e]) { v[key] = stuff.cast[e][key]; }

    const d = stuff.cast[e].path;
    if(d.length) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttributeNS(null, 'd', d);
      const pathLength = Math.floor(path.getTotalLength());

      hP.lay.paths[e] = {d: path, l: pathLength};
    }
    hP.ack.casts[e] = v;
  });

  /*/ stuff > pack > effect /*/
  Object.keys(stuff.eft).forEach(e => {
    const v = {};
    for (let key in stuff.eft[e]) { v[key] = stuff.eft[e][key]; }
    console.log(v);
    hP.lay.particle.g = {};
    hP.lay.particle.g.len = v.len;
    hP.lay.particle.g.type = v.type;

    // v.fn = hP.ack['set' + stuff.eft[e].type];
    hP.ack.efts[e] = v;
  });
  /*/  Pack > scene /*/

  /*/ setframe > /*/
  const faces = hP.ack.faces;
  const btns = hP.ack.btns;
  const props = hP.ack.props;
  const casts = hP.ack.casts;

  const setframe = v => {
    const {} = v;

    hP.lay.setclear({ cs: /*/ hP.lot.cs /*/ cs, pg: hP.age, dpr: hP.lan.wds.dpr });
    const xy = hP.lay.pos;

    Object.keys(hP.ack.gradients).forEach(e => { hP.ack.gradients[e].fn(hP.ack.gradients[e]); });
    Object.keys(faces).forEach(e => {
      cx.drawImage(faces[e].img, faces[e].xy[1].x, faces[e].xy[1].y, faces[e].wh[1].w, faces[e].wh[1].h);
    });
    
    Object.keys(hP.ack.shapes).forEach(e => { hP.ack.shapes[e].fn(hP.ack.shapes[e]); });
    Object.keys(hP.ack.strs).forEach(e => { hP.ack.setstr(hP.ack.strs[e]); });

    Object.keys(btns).forEach(e => {
      if(parseInt(btns[e].opt.ot*10)){
        const n = btns[e].opt.or ? 2 : 1;
        cx.drawImage(btns[e].img, btns[e].xy[n].x, btns[e].xy[n].y, btns[e].wh[n].w, btns[e].wh[n].h);
      }
    });
    
    Object.keys(props).forEach(e => {
      hP.lay.setmove({xy: props[e].xy, hv: props[e].hv, by: "", path: hP.lay.paths[e], p: props[e].p});
      hP.lay.setdraw({img: props[e].img, xy: props[e].xy[1], wh: props[e].wh[1], hv: props[e].hv[1]});
    });

    Object.keys(casts).forEach(e => {
      hP.lay.setmove({xy: casts[e].xy, hv: casts[e].hv, by: casts[e].by, path: hP.lay.paths[e], p: casts[e].p});
      const n = casts[e].by.n;
      hP.lay.setdraw({img: casts[e].img[n], xy: casts[e].xy[1], wh: casts[e].wh[1], hv: casts[e].hv[1]});
    });

    Object.keys(hP.ack.evts /*/ EVenTS /*/).forEach(e => {
      const v = { ...hP.ack.evts[e], domain: hP.lot.domain, btns: hP.ack[hP.ack.evts[e].g], cx: hP.age.cx, hplan: hP.lan };
      hP.lay['put'+hP.ack.evts[e].type](v);
    });
    Object.keys(hP.ack.efts /*/ EFfecTS /*/).forEach(e => hP.lay[hP.ack.efts[e].type].set(hP.ack.efts[e]));
    
    hP.lay.fb.set({ ps: hP.art.fbps /*/ Flip Book PageS - array /*/, cx: cx, pos: xy, r: hP.age.r });

    Object.keys(hP.art.traces /*/ tracing alphabets /*/).forEach(e => {
      hP.lay.trace.set({ tr: hP.art.traces[e], trs: hP.art.traces, cx: cx, pos: xy, scale: hP.age.scale, dpr: hP.lan.wds.dpr });
    });

    xy.start = {};
    xy.end = {};

    if(!hP.lan.status) { hP.lan.func = () => { return setdrop({}); }; }
    requestAnimationFrame(hP.lan.func);
  };
  /*/ setframe < /*/
  
  requestAnimationFrame(hP.lan.func);
};
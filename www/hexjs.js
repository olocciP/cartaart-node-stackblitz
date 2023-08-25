/*/ HEXJS /*/
/*/ 0.5.0 /*/

(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if (typeof define === 'function' && define.amd)
    define('hexjs', [], factory);
  else if (typeof exports === 'object') exports['hexjs'] = factory();
  else root['HEX'] = factory();
})(typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this, () => {
  return (() => {
    'use strict';

    /*/ Modules Function Registry > /*/
    const ms = {}; /*/ ModuleS /*/
    ms.legacy = v => {
      const { m, es, req } = v; /*/ Module, ExpotrS, REQuire /*/

      req.d(es, {
        Play: (/*/ Imported Module /*/) => im.Play,
        Page: (/*/ Imported Module /*/) => im.Page,
        Part: (/*/ Imported Module /*/) => im.Part,
        Pack: (/*/ Imported Module /*/) => im.Pack,
        Plot: (/*/ Imported Module /*/) => im.Plot,
        Plan: (/*/ Imported Module /*/) => im.Plan
      });
      const im = req('commom');

      const globalObject =
        typeof req.g !== 'undefined'
          ? req.g
          : typeof window !== 'undefined'
            ? window
            : undefined;
      if (typeof globalObject !== 'undefined') {
        globalObject.HEX = globalObject.HEX || {};
        const HEXGLOBAL = globalObject.HEX;

        for (let key in im) {
          if (!HEXGLOBAL[key]) {
            HEXGLOBAL[key] = im[key];
          }
        }
      }
    };
    /*/ < Modules Function Registry /*/

    /*/ Modules Function Structure > /*/
    ms.commom = v => { 
      const { m, es, req } = v; /*/ Module, ExpotrS, REQuire /*/

      req.r(es);
      req.d(es, {
        Play: () => Play,
        Page: () => Page,
        Part: () => Part,
        Pack: () => Pack,
        Plot: () => Plot,
        Plan: () => Plan
      });

      /*/ Modules Function Structure > Play > /*/
      const Play = function () {}
      Play.prototype.paths = {};
      Play.prototype.moves = {};
      Play.prototype.touch = { start: '', move: '', end: '' };
      Play.prototype.pos = { start: {}, move: {}, end: {} };

      Play.prototype.init = function(v){
        const { width, height, cs, cx, touch } = v;

        this.width = width;
        this.height = height;
        this.cs = cs; /*/ hPage.cs - CanvaS element /*/
        this.cx = cx; /*/ hPage.cx - ConteXt element /*/


        this.touch.start = touch ? 'touchstart' : 'mousedown';
        this.touch.move = touch ? 'touchmove' : 'mousemove';
        this.touch.end = touch ? 'touchend' : 'mouseup';

        this.setclear = function (v) {
          const { cs /*/ hPlot.cs - CanvaS Data /*/, pg /*/ hPage /*/, dpr /*/ hPlan.wds.dpr /*/ } = v;
          
          /// this.cs.style.left = `${pg.x*0.5}px`;
          /// this.cs.style.top = `${pg.y*0.5}px`;

          this.cs.style.width = `${pg.width*pg.r}px`;
          this.cs.style.height = `${pg.height*pg.r}px`;

          // this.cs.width = pg.width*dpr*pg.r;
          // this.cs.height = pg.height*dpr*pg.r;

          // this.cx.scale(1, 1);

          /// this.cx.shadowColor = cs.s.c;
          /// this.cx.shadowBlur = cs.s.b; /*/ Avoid the shadowBlur property whenever possible /*/
          /// this.cx.shadowOffsetX = cs.s.xy.x;
          /// this.cx.shadowOffsetY = cs.s.xy.y;

          this.cx.clearRect(0, 0, pg.width, pg.height);
          this.cx.fillStyle = cs.c || '#fff';
          // cx.fillRect(0, 0, width, height);
        };
      }

      /*/ Modules Function Structure > Play > Mouse or Touch Pos > /*/
      Play.prototype.setpos = function (v) {
        const { e, type, touch, bcr } = v;

        if(type === 'end'){ /*/ Position value does not come in touch end event /*/
          this.pos[type].x = this.pos.move.x ;
          this.pos[type].y = this.pos.move.y ;

        }else{
          const xy = { x: touch ? e.touches[0].clientX : e.clientX, y: touch ? e.touches[0].clientY : e.clientY };
          this.pos[type].x = parseInt(xy.x - bcr.left);
          this.pos[type].y = parseInt(xy.y - bcr.top);

          if(type === 'start') { 
            this.pos.move.x = this.pos[type].x;
            this.pos.move.y = this.pos[type].y;  
          }
        }
      };
      /*/ Modules Function Structure > Play > Mouse or Touch Pos < /*/

      /*/ Modules Function Structure > Play > Button > /*/
      Play.prototype.putbtns = function (v) {
        const { g, key, behave, target, path, freq, dpr } = v;

        const k = key.replace(/\./g, '');
        if (!parseInt(hPack[g][k].opt.ot * 10)) return;
        
        /*/ Play > Button > Navigation > /*/
        if (typeof target === 'string') {
          const domain = behave.match(/(?<=\.\/)(.*)(?=\/)/g).join('');
          if (hPlot.domain === domain) return;
          
          const p = hPack[g][k].bvr; /*/ Button Virtual Rect - path2D /*/
          p.rect(path.x, path.y, path.w, path.h);
          
          if (!Object.keys(this.pos.start).length) {
            const x = this.pos.move.x;
            const y = this.pos.move.y;
            if (isNaN(x) || isNaN(y)) return;

            if (hPage.cx.isPointInPath(p, x*dpr, y*dpr)) {
              hPack[g][k].opt.or = true;
            } else {
              hPack[g][k].opt.or = false;
            }
          }
          
          if (Object.keys(this.pos.end).length) {
            const x = this.pos.end.x;
            const y = this.pos.end.y;
            if (isNaN(x) || isNaN(y)) return;
            
            if (hPage.cx.isPointInPath(p, x*dpr, y*dpr)) {
              hPlan.behave = behave;
              hPlan.status = false;
            }
          }
        }
        /*/ Play > Button > Navigation < /*/
      };
      /*/ Modules Function Structure > Play > Button < /*/

      /*/ Modules Function Structure > Play > Move > /*/
      Play.prototype.setmove = function (v) {
       const { xy, hv, by, path, p } = v;
       
       if (!p.launch) return;

        p.gravity.speed.x += p.gravity.x;
        p.gravity.speed.y += p.gravity.y;

        if(path !== undefined){ // When the path move, x,y are the progress rates
          xy[0].x += p.speed.x + p.gravity.speed.x;
          xy[0].y += p.speed.y + p.gravity.speed.y;
          
          const xyp = ((xy[0].x + xy[0].y)*path.l) / 100;
          const xyd = path.d.getPointAtLength(xyp);
          xy[1].x = Math.round(xyd.x);
          xy[1].y = Math.round(xyd.y);
          
          if(xyp > path.l) {
            p.gravity.speed.x = 0;
            p.gravity.speed.y = 0;
            xy[0].x = 0;
            xy[0].y = 0;
            hv[1].h = 0;
            hv[1].v = 0;
          }   
          
          const x = xy[0].x + (p.speed.x + p.gravity.speed.x)*10;
          const y = xy[0].y + (p.speed.y + p.gravity.speed.y)*10;

          const hvp = ((x + y)*path.l) / 100;
          const hvd = path.d.getPointAtLength(hvp);
          hv[1].h = Math.round(hvd.x);
          hv[1].v = Math.round(hvd.y);

        } else {
          xy[1].x += p.speed.x + p.gravity.speed.x;
          xy[1].y += p.speed.y + p.gravity.speed.y;

          if(xy[1].x > xy[0].x + this.width || xy[1].x < xy[0].x - this.width || xy[1].y > xy[0].y + this.height || xy[1].y < xy[0].y - this.height){
            p.gravity.speed.x = 0;
            p.gravity.speed.y = 0;
            xy[1].x = xy[0].x;
            xy[1].y = xy[0].y;
          }

          hv[1].h = xy[1].x + p.speed.x + p.gravity.speed.x;
          hv[1].v = xy[1].y + p.speed.y + p.gravity.speed.y;
        }

        if(typeof by === 'object'){
          let is = by.i;
          let cs = by.c;
          let n = by.n;

          if (cs.length) {
            cs[n] = cs[n] + Math.abs(hv[1].h) + Math.abs(hv[1].v);
            if(cs[n] > is[n]*2000) {
              cs[n] = 0;
              ++n;
              n = n < cs.length ? n : 0;
              by.n = n;
            }
          }
        }
      }
      /*/ Modules Function Structure > Play > Move < /*/

      /*/ Modules Function Structure > Play > Draw > /*/
      Play.prototype.setdraw = function(v) {
        const { img, xy, wh, hv } = v;

        const r = Math.atan2(hv.v - xy.y, hv.h - xy.x) + Math.PI*0.5;

        // this.cx.save();
        this.cx.translate(xy.x, xy.y);
        this.cx.rotate(r);
        this.cx.drawImage(img, -wh.w*0.5, -wh.h*0.5, wh.w, wh.h);
        this.cx.rotate(-r);
        this.cx.translate(-xy.x, -xy.y);
        // this.cx.restore();
      }
      /*/ Modules Function Structure > Play > Draw < /*/

      /*/ Modules Function Structure > Play > Flip Book > /*/
      Play.prototype.fb = {
        on: false, /*/ true, false /*/
        off: 0, /*/ -1, 0 ,1 /*/
        page: 0,
        len: 0,
        gf: 0.8, /*/ Gravitational Force /*/
        xy: [],
        wh: [],
        hv: [],
        pivot: {},
        cc: {},
        skip: [],
        mark: []
      };

      Play.prototype.fb.set = function(v) {
        const { ps, cx, pos, r } = v; 

        /*/ Play > Flip Book > pos /*/
        const getpow = (dx, dy) => { return dx*dx + dy*dy; };
        const setmousedown = v => {
          const { xy } = v;
          
          if (!Object.keys(xy).length) return;
          
          if (this.pivot.pow*r < getpow(this.pivot.x*r - xy.x, this.pivot.y*r - xy.y)) return;
          if (this.page === this.len - 1 && this.pivot.x*r < xy.x) return; /// Last Right none pape
          if (this.page === 0 && this.pivot.x*r > xy.x) return; /// First left none page

          this.on = true;
          this.xy[0].x = this.xy[1].x = xy.x;
          this.xy[0].y = this.xy[1].y = xy.y;
        
          if (this.pivot.x*r < xy.x) { this.page = this.page ? this.page + 1 : this.page; }
          this.off = ps[this.page].xy[0].x === this.pivot.x*r ? 1 : -1;
          
        };  
        setmousedown({ xy: pos.start });

        const setmouseup = v => {
          const { xy } = v;
          
          if (!Object.keys(xy).length) return;

          this.on = true; /// Auto position
          if (this.page%2 && this.xy[0].x > this.xy[1].x || !(this.page%2) && this.xy[0].x < this.xy[1].x) { /// Cancel flip
            this.xy[0].x = 0;
            this.xy[0].y = 0;
            
          } else { /// Continue flip - Current mouse position
            this.xy[1].x = this.pivot.x*r + ps[this.page].wh[0].w*this.off - this.xy[1].x;
            this.xy[1].y = xy.y > this.pivot.y*r ? this.pivot.y*r - 0.1 : xy.y;
            this.xy[1].y = this.pivot.y*r - this.xy[1].y;
          }
          this.on = false; /// Tracking mouse position
        
          console.log(this.page, ' : current left page');
        };

        setmouseup({ xy: pos.end });

        const setmousemove = v => {
          const { xy } = v;

          if (!this.on) return;

          if (this.pivot.pow*r > getpow(this.pivot.x*r - xy.x, this.pivot.y*r - xy.y)) {
            if(this.page%2 && xy.x > this.pivot.x*r || !(this.page%2) && xy.x < this.pivot.x*r || xy.y > this.pivot.y*r){
              setmouseup({ xy: pos.move });
              
            }else{
              this.xy[1].x = xy.x;
              this.xy[1].y = xy.y;
            }
            
          } else {
            setmouseup({ xy: pos.move });
          }
        };
        setmousemove({ xy: pos.move });

        /*/ Play > Flip Book > POSition of mouse /*/
        const setfbp = v => {
          const { e, n } = v;

          if (!this.off) return;

          /*/ Tracking mouse position and flipping /*/
          if (this.on) {
            const xy = { x: 0, y: 0 };

            if (this.off > 0) { xy.x = this.xy[1].x > e.xy[0].x + e.wh[0].w ? e.wh[0].w - 0.1 : this.xy[1].x - e.xy[0].x; } 
            else { xy.x = this.xy[1].x > e.xy[0].x ? this.xy[1].x - e.xy[0].x : 0.1; }
            xy.y = this.xy[1].y > e.xy[0].y + e.wh[0].h ? e.wh[0].h - 0.1 : this.xy[1].y - e.xy[0].y;

            e.xy[1].x = e.wh[0].w*((n + 1)%2) - xy.x*this.off;
            e.xy[1].y = e.wh[0].h - xy.y;

          /*/ Continue Flip or Cancel Flip position /*/
          } else {
            if (Math.abs(this.off)) { /// Continue Flip
              if (this.xy[0].x * this.xy[0].y) {
                this.xy[1].x = this.xy[1].x*this.gf;
                this.xy[1].y = this.xy[1].y*this.gf;

                const xy = { x: 0, y: 0 };
                xy.x = (this.pivot.x - e.wh[0].w*this.off + this.xy[1].x) - e.xy[0].x;
                xy.y = (this.pivot.y - this.xy[1].y) - e.xy[0].y;

                e.xy[1].x = e.wh[0].w*((n + 1)%2) - xy.x*this.off;
                e.xy[1].y = e.wh[0].h - xy.y;

                if (Math.abs(this.xy[1].x) < 1 && this.xy[1].y < 1) {
                  const osp = this.page; /// Other Side Page
                  this.page = (this.len + this.page + this.off)%this.len;

                  const odd = this.page%2; /// Odd : 1, Even : 0
                  ps[osp].xy[0].x = this.pivot.x - ps[osp].wh[0].w*odd;
                  ps[this.page].xy[0].x = this.pivot.x - ps[this.page].wh[0].w*odd;

                  ps[this.page].xy[1].x = 0;
                  ps[this.page].xy[1].y = 0;

                  this.page = odd ? this.page : this.page ? this.page - 1 : this.page; /// Default odd pages, First page zero

                  e.xy[1].x = 0;
                  e.xy[1].y = 0;
                  this.off = 0;
                  this.on = false;
                }

              } else { /// Cancel Flip
                e.xy[1].x = e.xy[1].x*this.gf + 1;
                e.xy[1].y = e.xy[1].y*this.gf + 1;

                if (e.xy[1].x < this.gf*10 + 1 && e.xy[1].y < this.gf*10 + 1) {
                  this.page = this.page%2 ? this.page : this.page ? this.page - 1 : this.page; /// Default odd pages, First page zero

                  e.xy[1].x = 0;
                  e.xy[1].y = 0;
                  this.off = 0;
                  this.on = false;
                }
              }
            }
          }
        };
        setfbp({ e: ps[this.page], n: this.page });

        /*/ Play > Flip Book > Sheet /*/
        const setdraw = v => {
          const { c, t, xy, wh } = v;
          cx.fillStyle = `${c}`; /*/ hsl /*/
          cx.fillRect(xy.x, xy.y, wh.w, wh.h);

          this.cc.xy.x = wh.w*0.5;
          this.cc.xy.y = wh.h*0.5 + this.cc.fs*0.25;

          cx.font = this.cc.ff;
          cx.fillStyle = this.cc.fc; /*/ rgba /*/
          cx.textAlign = this.cc.align;
          cx.fillText(t, this.cc.xy.x + xy.x, this.cc.xy.y + xy.y);
        };

        const setsheet = v => {
          const { n } = v;

          cx.save();
          const l = this.len;

          /*/ Static Page /*/ 
          /*/ Left page : '' & Right page : 'C' /*/
          const sp = {};
          if (Math.abs(this.off)) {
            sp.l = this.off > 0 ? ps[(l + n - 1) % l] : ps[(l + n - 2) % l];
            sp.r = this.off > 0 ? ps[(l + n + 2) % l] : ps[(l + n + 1) % l];

          } else {
            sp.l = ps[(l + n + 1) % l];
            sp.r = ps[(l + n) % l];
          }

          setdraw({ c: sp.l.c[0], t: sp.l.str[0], xy: sp.l.xy[0], wh: sp.l.wh[0] });
          if((Math.abs(this.off) && n === l - 2) || (Math.abs(this.off) && n === l - 1)) { /* Doesn't draw 0 page at mouse move - A */ } 
          else { setdraw({ c: sp.r.c[0], t: sp.r.str[0], xy: sp.r.xy[0], wh: sp.r.wh[0] }); }

          /*/ Current page : '' /*/
          if (Math.abs(this.off)) {
            const fp /*/ Front Page /*/ = ps[n];
          
            const xy = fp.xy[0];
            const wh = fp.wh[0];

            const dxy = fp.xy[1];
            const dx = (dxy.y*dxy.y*0.5) / dxy.x + dxy.x*0.5;
            const dy = (dxy.x*dxy.x*0.5) / dxy.y + dxy.y*0.5;
            
            /*/ Current sheet front page: 'A' /*/
            cx.beginPath();
            cx.translate(xy.x, xy.y);
            
            const w1 = wh.w*((this.page + 1)%2);
            const w2 = wh.w*this.off*-1 + wh.w*this.off*-1*((this.page)%2);
            cx.moveTo(w1 + dx*this.off*-1, wh.h);
            cx.lineTo(w2, wh.h);
            cx.lineTo(w2, -wh.h);
            cx.lineTo(w1, -wh.h);
            cx.lineTo(w1, wh.h - dy);

            cx.clip();
            setdraw({ c: fp.c[0], t: fp.str[0], xy: { x: 0, y: 0 }, wh: wh });
            
            /*/ Current sheet back page: 'B' /*/
            const dr = Math.atan2(dxy.y*this.off, dxy.x)*2;
            const dw = dxy.x*this.off*-1 + Math.sin(dr)*wh.h;
            const dh = wh.h - dxy.y - Math.cos(dr)*wh.h;
            cx.translate(wh.w*((this.page + 1)%2) + dw - Math.cos(dr)*wh.w*(this.page%2), dh - Math.sin(dr)*wh.w*(this.page%2));
            cx.rotate(dr);
            const bp /*/ Back Page /*/ = ps[(l + n + this.off)%l];
            setdraw({ c: bp.c[0], t: bp.str[0], xy: { x: 0, y: 0 }, wh: bp.wh[0] });
            
            cx.restore();
          }
        };
        setsheet({ n: this.page });
      };
      /*/ Modules Function Structure > Play > Flip Book < /*/

      /*/ play > TRACE > /*/
      Play.prototype.trace = { str: [], len: 0, cnt: 0 }; /*/ Alphabet STRing: ['a', 'l', 'p', ...], LENgth, CouNT /*/
      
      Play.prototype.trace.set = function(v) {
        const { tr, cx, pos, scale, dpr } = v;

        cx.save();
        cx.beginPath();
        
        // cx.lineCap = 'butt'
        Object.keys(tr.p2s).forEach((k, i) => {
          if(i){ /*/ 0: Alphabet, 1~: Stroke /*/
            const t = tr.p2s[k].t; /*/ Tracing shape - Path2d & Style /*/
            if(t.s['stroke-width'] !== undefined){ /*/ Tracing Style /*/
              cx.lineWidth = t.s['stroke-width'];
              if (t.s.fill === '#fff') { cx.setLineDash([5, 15]); } else { cx.setLineDash([]); }
              cx.strokeStyle = t.s.stroke;
              cx.stroke(t.p); /*/ Tracing Path /*/
            }
            cx.fillStyle = t.s.fill;
            cx.fill(t.p);
          }
        });

        if(this.str[this.cnt] !== tr.code) return; /*/ Current tracing shape - Current Alphabet /*/

        const p = tr.p2s['l'+ tr.ss.cnt].p; /*/ Tracing stroke - path2d /*/
        cx.lineWidth = p.s['stroke-width'];
        cx.setLineDash([5, 15]);
        cx.strokeStyle = p.s.stroke;
        cx.stroke(p.p); /*/ Tracing Path /*/
        cx.restore();

        const len = tr.tps.ss.length;

        if (Object.keys(pos.start).length) { tr.drag = { x: pos.start.x , y: pos.start.y }; }

        if (Object.keys(tr.drag).length) {
          if(!len){ /*/ start tracing /*/
            const x = p.t.getPointAtLength(0).x;
            const y = p.t.getPointAtLength(0).y;
            tr.tps.ss.push({ x: x, y: y });
            tr.tps.len = parseInt(p.t.getTotalLength()/tr.tps.dis);
            tr.sdr = p.t.getTotalLength()/tr.tps.len; /*/ Shifting Distance Rate /*/
            tr.drag = { x: x , y: y };

          } else { /*/ continue tracing /*/
            const x = tr.tps.ss[len - 1].x;
            const y = tr.tps.ss[len - 1].y;
            const d = Math.sqrt(Math.pow(x - pos.move.x*dpr/scale, 2) + Math.pow(y - pos.move.y*dpr/scale, 2));
            
            if (d < tr.tps.dis*3*dpr) { tr.drag = { x: x , y: y }; }
            else { tr.drag = {}; }
          }
        }

        if (Object.keys(tr.drag).length && Object.keys(pos.move).length && len && len < tr.tps.len) {
          const t = tr.p2s['l'+ tr.ss.cnt].t; /*/ Tracing shape - path2d /*/

          if(cx.isPointInPath(t.p, pos.move.x*dpr, pos.move.y*dpr)) {
            const x = tr.tps.ss[len - 1].x;
            const y = tr.tps.ss[len - 1].y;

            const d = Math.sqrt(Math.pow(x - pos.move.x*dpr/scale, 2) + Math.pow(y - pos.move.y*dpr/scale, 2));
            if (d > tr.tps.dis) {
              const x = p.t.getPointAtLength(tr.sdr*len).x; /*/ Shifting Distance x /*/
              const y = p.t.getPointAtLength(tr.sdr*len).y; /*/ Shifting Distance y /*/
              const dx = p.t.getPointAtLength(tr.sdr*(len + 1)).x;
              const dy = p.t.getPointAtLength(tr.sdr*(len + 1)).y;
              const dd = Math.sqrt(Math.pow(dx - pos.move.x*dpr/scale, 2) + Math.pow(dy - pos.move.y*dpr/scale, 2));
              if(d > dd) {
                tr.tps.ss.push({ x: x, y: y });
              }
            }
          } else {

            tr.drag = {};
          }
        }
        
        if (len) {
          cx.save();
          const t = tr.p2s['l'+ tr.ss.cnt].t;
          cx.clip(t.p);
         
          if(len > 1){ /*/ at least two /*/
            cx.setLineDash([]);
            cx.lineWidth = tr.tps.thick;
            cx.lineCap = 'round';
            cx.lineJoin = 'round';
            cx.strokeStyle = 'red';
            
            cx.beginPath();
            tr.tps.ss.forEach((e, i) => {
              if (i) {
                cx.lineTo(e.x, e.y);
              } else {
                cx.moveTo(e.x, e.y);
              }
            });
            cx.stroke();
          }
          cx.restore();

          if (Object.keys(tr.drag).length && Object.keys(pos.move).length && len === tr.tps.len) {
            tr.p2s['l'+ tr.ss.cnt].t.s.fill = '#dae';
            tr.ss.cnt = (tr.ss.cnt + 1)%(tr.ss.len + 1); /*/ count strokes - 1 ~ /*/
            
            if(!tr.ss.cnt){ /*/ each alphabets done /*/
              this.cnt = (this.cnt + 1)%this.len; /*/ count alphabet - 0 ~ /*/

              tr.ss.cnt = 1;
              //tr.ss.len = Object.keys(tr.tas[this.str[this.cnt]]).length;
              
              if (!this.cnt) { /*/ all alphabets done /*/
                this.str.forEach(e => { /*/ 'A', 'B', ... /*/
                  const t = hPart.traces[e].p2s;
                  Object.keys(t).forEach((k, i) => { t[k].t.s.fill = '#fff' });
                });
              }
            }

            tr.drag = {};
            tr.tps.ss = [];
          }
        }
        
        if(Object.keys(pos.end).length){ tr.drag = {}; }
      }
      /*/ play > trace < /*/

      /*/ play > setparticle > /*/
      Play.prototype.setparticle = function (a) {
       
      }
      /*/ Modules Function Structure > Play < /*/

      /*/ Modules Function Structure > Page > /*/
      const Page = function () {};

      Page.prototype.init = function (v) {
        const { name, id, type, width, height, color, body } = v;

        this.name = name;
        this.id = id;
        this.type = type;
        this.width = width;
        this.height = height;
        this.scale = 1;
        this.color = color;
        this.body = body;
        this.cs = document.body.querySelector('canvas');
        // this.cx = this.cs.getContext(this.type, { alpha: false });
        this.cx = this.cs.getContext(this.type);
        this.bcr = this.cs.getBoundingClientRect();

        document.body.appendChild(this.cs);

        this.set = v => {
          const { dpr, s } = v;

          const style = document.body.style;
          style.width = '100%';
          style.height = '100%';
          style['background-color'] = this.body;
          style.margin = '0px';
          style.padding = '0px';
          style['overscroll-behavior'] = 'contain';
          style.overflow = 'hidden';

          this.cs.style.position = 'absolute';
          this.setsize({ dpr: dpr, s: s });
        };

        this.setsize = v => {
          const { dpr, s } = v;

          this.w = window.innerWidth/this.width;
          this.h = window.innerHeight/this.height;
          this.r = this.w < this.h ? this.w : this.h;
          this.x = window.innerWidth - this.width*this.r;
          this.y = window.innerHeight - this.height*this.r;

          this.cs.style.left = `${this.x*0.5}px`;
          this.cs.style.top = `${this.y*0.5}px`;

          this.cs.style.width = `${this.width*this.r}px`;
          this.cs.style.height = `${this.height*this.r}px`;

          this.cs.width = this.width*dpr*this.r;
          this.cs.height = this.height*dpr*this.r;

          this.scale = dpr*this.r; /*/ Needed to adjust mouse position /*/
          this.cx.scale(this.scale, this.scale);
          this.bcr = this.cs.getBoundingClientRect();

          this.cx.shadowColor = s.c;
          this.cx.shadowBlur = s.b; /*/ Avoid the shadowBlur property whenever possible /*/
          this.cx.shadowOffsetX = s.xy.x;
          this.cx.shadowOffsetY = s.xy.y;

          // this.cs.style.transformOrigin = '0 0'; //scale from top left
          // this.cs.style.transform = `scale(${this.scale})`;
        };
      }
      /*/ Modules Function Structure > Page < /*/

      /*/ Modules Function Structure > Part > /*/
      const Part = function () {};
      Part.prototype.fbps = []; /*/ Flip Book PageS /*/
      Part.prototype.traces = {}; /*/ TRACE alphabet /*/

      /*/ Modules Function Structure > Part > init > /*/ 
      Part.prototype.init = function (v) {
        const { width, height, cx } = v;

        this.width = width;
        this.height = height;
        this.cx = cx;
      };
      /*/ Modules Function Structure > Part > init < /*/

      /*/ Modules Function Structure > Part > fbp > /*/
      Part.prototype.fbp = function (v) { /*/ Flip Book Page /*/
        const { x, y, w, h, c, str} = v;

        this.img = [];
        this.xy = [{ x: x, y: y }, { x: 0, y: 0 }];
        this.wh = [{ w: w, h: h }, { w: 0, h: 0 }];
        this.c = [c, 0];
        this.r = [0, 0];
        this.str = [str, '']; /*/ Index Image String /*/
      };
      /*/ Modules Function Structure > Part > fbp < /*/

      // Part.prototype.setbtns = function (v) {
      //   const { packs, whs, sizes, freq } = v;
      // };

      /*/ Modules Function Structure > Part > setpath > /*/
      Part.prototype.setpath = function (v) {
        const { svg, obj } = v;
          v.parser = new DOMParser(); 
          v.svg = v.parser.parseFromString(svg[obj].data, "image/svg+xml");
          const arr = v.svg.querySelectorAll('path');

          /*/ Style to Json > /*/
          const getjson = v => {
            const { type, str } = v;
            
            if(type === 'style'){ /*/ style - 'fill:#fff;stroke-width:0' /*/
              v.r = str.replace(/\s/g, '');
              v.r = `"${v.r}"`;
              v.r = v.r.replace(/:/g, '":"');
              v.r = v.r.replace(/;/g, '","');
              
              const arr = v.r.match(/(?<=\")(.*?)(?=")/g, '$1');
              v.r = '{';
              arr.forEach(e => {
                if (!isNaN(e) || e === ':' || e === ',' || e === 'true' || e === 'false') { v.r += e; }
                else { v.r += `"${e}"`; }
              });
              v.r += '}';
          
            }else{ /*/ text - '{"result":true, "count":42}' /*/
              v.r = str;
            };
            
            return JSON.parse(v.r);
          };
          /*/ < Style to Json /*/

          const p2s = {}; /*/ Path2D & Style /*/
          arr.forEach(e => {
            const k = e.getAttribute('id');
            const s = e.getAttribute('style');
            const r  = getjson({ type:'style', str: s });
            const d = e.getAttribute('d');
            const p = new Path2D(d);
            const a = k.split('|');
            const t = e; /*/ svg path Tracing /*/

            p2s[a[1]] = { ...p2s[a[1]], [a[2]]: { p: p, s: r, t: t } };
          });

        return {p2s: p2s};
      };
      /*/ Modules Function Structure > Part > setpath < /*/

      Part.prototype.setparticles = function (v) {
        const { packs, whs, sizes, freq } = v;

      };
      /*/ Modules Function Structure > Part < /*/

      /*/ Modules Function Structure > Pack > /*/
      const Pack = function () {};
      Pack.prototype.gradients = {};
      Pack.prototype.faces = {};
      Pack.prototype.shapes = {};
      Pack.prototype.btns = {};
      Pack.prototype.strs = {};
      Pack.prototype.props = {};
      Pack.prototype.casts = {};
      Pack.prototype.evts = {};
      Pack.prototype.efts = {};
      Pack.prototype.times = {};

      Pack.prototype.init = function (v) {
        const { width, height, cx } = v;

        this.width = width;
        this.height = height;
        this.cx = cx;

        /*/ Modules Function Structure > Pack > SVG > /*/
        this.setsvg = v => {
          const { prefix, svg, obj } = v;

          const setimg = (type, data) => {
            const img = new Image();
            if (type === 'data') {
              const fix = prefix || 'data:image/svg+xml;charset=utf-8,';
              img.src = fix + encodeURIComponent(data);
            } else {
  
              img.src = data;
            }

            return img;
          };

          if(Array.isArray(obj)){
            const img = [];
            for (let key in obj) { img.push(setimg(svg[obj[key]].type, svg[obj[key]].data)); }
            return { img: img };

          } else {

            const img = setimg(svg[obj].type, svg[obj].data);
            return { img: img };
          }
        };
        /*/ Modules Function Structure > Pack > SVG < /*/

        /*/ Modules Function Structure > Pack > Gradient > /*/
        this.setlinear = v => {
          const { g, xy, wh, hv, acs } = v;

          const gradient = cx.createLinearGradient(xy[1].x, xy[1].y, hv[1].h, hv[1].v);
          acs.forEach((e, i) => gradient.addColorStop(acs[i].a, acs[i].c));

          cx.beginPath();
          cx.fillStyle = gradient;
          cx.fillRect(wh[0].w, wh[0].h, wh[1].w, wh[1].h);
        };

        this.setradial = v => {
          const { g, xy, wh, hv, acs } = v;

          const gradient = cx.createRadialGradient(xy[1].x, xy[1].y, hv[1].h, xy[2].x, xy[2].y, hv[2].h);
          acs.forEach((e, i) => gradient.addColorStop(acs[i].a, acs[i].c));

          cx.beginPath();
          cx.fillStyle = gradient;
          cx.fillRect(wh[0].w, wh[0].h, wh[1].w, wh[1].h);
        };
        /*/ Modules Function Structure > Pack > Gradient < /*/

        /*/ Modules Function Structure > Pack > Shape > /*/
        this.setline = v => {
          const { flc, skc, skw, sklc, sklj, close, path, count, offset } = v;

          cx.strokeStyle = skc;
          cx.lineWidth = skw;
          cx.lineCap = sklc; // butt, round, square
          cx.lineJoin = sklj; // bevel, round, miter

          cx.beginPath();
          path.forEach((e, i) => {
            if (i) cx.lineTo(e.x, e.y);
            else cx.moveTo(e.x, e.y);
          });

          if (close) cx.closePath();

          cx.stroke();
          if (flc.length) {
            cx.fillStyle = flc;
            cx.fill();
          }
        };

        this.setarc = v => {
          const { flc, skc, skw, ccw, path, count, offset } = v;

          cx.strokeStyle = skc;
          cx.lineWidth = skw;
          cx.fillStyle = flc;

          cx.beginPath();
          path.forEach(e => {
            cx.moveTo(e.x, e.y);
            cx.arc(e.x, e.y, e.r, e.a * Math.PI, (e.pi + e.a) * Math.PI, ccw);
          });

          cx.stroke();
          if (flc.length) {
            cx.fillStyle = flc;
            cx.fill();
          }
        };

        this.setstr = v => {
          const { ff, t, xy, flc, skc, skw } = v;

          cx.font = ff;

          if (this.width) {
            cx.lineJoin = 'round';
            cx.miterLimit = 2;
            cx.strokeStyle = skc;
            cx.lineWidth = skw;
            cx.strokeText(t, xy[1].x, xy[1].y);
          }

          cx.fillStyle = flc;
          cx.fillText(t, xy[1].x, xy[1].y);
        };

        this.setrect = v => {
          const { ps, color } = v;
          cx.fillStyle = color;
          cx.fillRect(ps[0], ps[1], ps[2], ps[3]);
        };
        /*/ Modules Function Structure > Pack > Shape < /*/
      };
      /*/ Modules Function Structure > Pack < /*/

      /*/ Modules Function Structure > Plot > /*/
      const Plot = function () {};

      Plot.prototype.init = function (v) { 
        let { xml } = v;

        // xml = xml.replace(/^"+|"+$/g, ''); /// TEXT: quotation marks before and after sentences, Remove quotation marks
        xml = xml.replace(/<!--(.*?)-->/g, ''); /// COMMENT: Remove domments
        this.xml = xml.replace(/\s{2,}/g, ''); /// SPACE: Remove two or more spaces
        const doc = new DOMParser().parseFromString(this.xml, 'text/xml');
        this.domain = doc.querySelector('pack').getAttribute('domain');

        /*/ Modules Function Structure > Plot > body /*/
        this.w = parseInt(doc.querySelector('w').textContent);
        this.h = parseInt(doc.querySelector('h').textContent);
        this.c = doc.querySelector('c').textContent;
        this.img = doc.querySelector('img').textContent;

        /*/ Modules Function Structure > Plot > canvas /*/
        this.cs = {};
        v.cs = doc.querySelector('cs');
        this.cs.w = parseInt(v.cs.querySelector('w').textContent);
        this.cs.h = parseInt(v.cs.querySelector('h').textContent);
        this.cs.c = v.cs.querySelector('c').textContent;
        this.cs.s = JSON.parse(v.cs.querySelector('s').textContent);
        
        /*/ Modules Function Structure > Plot > stage /*/
        const stage = doc.querySelector('stage');
        this.stage = {};
        v.stage = {};

        /*/ Modules Function Structure > Plot > stage > part/*/
        this.stage.part = {};
        v.stage.part = stage.querySelectorAll('part');
        v.stage.part.forEach(e => {
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          this.stage.part[key] = {
            xy: JSON.parse(e.querySelector('xy').textContent),
            wh: JSON.parse(e.querySelector('wh').textContent),
            hv: JSON.parse(e.querySelector('hv').textContent),
            rsc: JSON.parse(e.querySelector('rsc').textContent),
            type: e.getAttribute('type')
          };
        });

        /*/ Modules Function Structure > Plot > stage > gradient /*/
        this.stage.gradient = {};
        v.stage.gradient = stage.querySelectorAll('gradient');
        v.stage.gradient.forEach(e => {
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          this.stage.gradient[key] = {
            g: e.querySelector('g').textContent,
            xy: JSON.parse(e.querySelector('xy').textContent),
            wh: JSON.parse(e.querySelector('wh').textContent),
            hv: JSON.parse(e.querySelector('hv').textContent),
            acs: JSON.parse(e.querySelector('acs').textContent),
            type: e.getAttribute('type')
          };
        });

        /*/ Modules Function Structure > Plot > stage > face /*/
        this.stage.face = {};
        v.stage.face = stage.querySelectorAll('face');
        v.stage.face.forEach(e => {
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          this.stage.face[key] = {
            g: e.querySelector('g').textContent,
            obj: e.querySelector('obj').textContent,
            xy: JSON.parse(e.querySelector('xy').textContent),
            wh: JSON.parse(e.querySelector('wh').textContent),
            opt: JSON.parse(e.querySelector('opt').textContent)
          };
        });

        /*/ Modules Function Structure > Plot > stage > shape /*/
        this.stage.shape = {};
        v.stage.shape = stage.querySelectorAll('shape');
        v.stage.shape.forEach(e => {
          const type = e.getAttribute('type');
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          if (type === 'arc') {
            this.stage.shape[key] = {
              g: e.querySelector('g').textContent,
              flc: e.querySelector('flc').textContent,
              skc: e.querySelector('skc').textContent,
              skw: parseInt(e.querySelector('skw').textContent),
              ccw: JSON.parse(e.querySelector('ccw').textContent),
              path: JSON.parse(e.querySelector('path').textContent),
              count: parseInt(e.querySelector('count').textContent),
              offset: JSON.parse(e.querySelector('offset').textContent),
              type: type
            };
          } else {
            this.stage.shape[key] = {
              g: e.querySelector('g').textContent,
              flc: e.querySelector('flc').textContent,
              skc: e.querySelector('skc').textContent,
              skw: parseInt(e.querySelector('skw').textContent),
              sklc: e.querySelector('sklc').textContent,
              sklj: e.querySelector('sklj').textContent,
              close: JSON.parse(e.querySelector('close').textContent),
              path: JSON.parse(e.querySelector('path').textContent),
              count: parseInt(e.querySelector('count').textContent),
              offset: JSON.parse(e.querySelector('offset').textContent),
              type: type
            };
          }
        });

        /*/ Modules Function Structure > Plot > stage > btn /*/
        this.stage.btn = {};
        v.stage.btn = stage.querySelectorAll('btn');
        v.stage.btn.forEach(e => {
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          this.stage.btn[key] = {
            g: e.querySelector('g').textContent,
            obj: e.querySelector('obj').textContent,
            xy: JSON.parse(e.querySelector('xy').textContent),
            wh: JSON.parse(e.querySelector('wh').textContent),
            opt: JSON.parse(e.querySelector('opt').textContent)
          };
        });

        /*/ Modules Function Structure > Plot > stage > string /*/
        this.stage.str = {};
        v.stage.str = stage.querySelectorAll('str');
        v.stage.str.forEach(e => {
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          this.stage.str[key] = {
            g: e.querySelector('g').textContent,
            ff: e.querySelector('ff').textContent,
            t: e.querySelector('t').textContent,
            xy: JSON.parse(e.querySelector('xy').textContent),
            flc: e.querySelector('flc').textContent,
            skc: e.querySelector('skc').textContent,
            skw: parseInt(e.querySelector('skw').textContent)
          };
        });

        /*/ Modules Function Structure > Plot > stage > event /*/
        this.stage.evt = {};
        this.stage.time = {};
        v.stage.evt = stage.querySelectorAll('evt');
        v.stage.evt.forEach(e => {
          const type = e.getAttribute('type');
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          if (type === 'time') {
            this.stage.time[key] = {};
          } else {
            this.stage.evt[key] = {
              g: e.querySelector('g').textContent,
              key: e.querySelector('key').textContent,
              behave: JSON.parse(e.querySelector('behave').textContent),
              target: JSON.parse(e.querySelector('target').textContent),
              path: JSON.parse(e.querySelector('path').textContent),
              freq: parseInt(e.querySelector('freq').textContent),
              type: type
            };
          }
        });

        /*/ Modules Function Structure > Plot > stuff /*/
        const stuff = doc.querySelector('stuff');
        this.stuff = {};
        v.stuff = {};

        /*/ Modules Function Structure > Plot > stuff > part /*/
        this.stuff.part = {};
        v.stuff.part = stuff.querySelectorAll('part');
        v.stuff.part.forEach(e => {
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          this.stuff.part[key] = {
            form: e.querySelector('form').textContent,
            type: e.getAttribute('type')
          };
        });

        /*/ Modules Function Structure > Plot > stuff > prop /*/
        v.stuff.prop = stuff.querySelectorAll('prop');
        this.stuff.prop = {};
        v.stuff.prop.forEach(e => {
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          this.stuff.prop[key] = {
            g: e.querySelector('g').textContent,
            obj: e.querySelector('obj').textContent,
            xy: JSON.parse(e.querySelector('xy').textContent),
            wh: JSON.parse(e.querySelector('wh').textContent),
            hv: JSON.parse(e.querySelector('hv').textContent),
            path: e.querySelector('path').textContent,
            p: JSON.parse(e.querySelector('p').textContent),
            l: e.querySelector('l').textContent
          };
        });

        /*/ Modules Function Structure > Plot > stuff > cast /*/
        this.stuff.cast = {};
        v.stuff.cast = stuff.querySelectorAll('cast');
        v.stuff.cast.forEach(e => {
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          this.stuff.cast[key] = {
            g: e.querySelector('g').textContent,
            objs: JSON.parse(e.querySelector('objs').textContent),
            by: JSON.parse(e.querySelector('by').textContent), // by.m is object or string, when object p.launch must be false
            xy: JSON.parse(e.querySelector('xy').textContent),
            wh: JSON.parse(e.querySelector('wh').textContent),
            hv: JSON.parse(e.querySelector('hv').textContent),
            path: e.querySelector('path').textContent,
            p: JSON.parse(e.querySelector('p').textContent),
            l: e.querySelector('l').textContent
          };
        });

        /*/ Modules Function Structure > Plot > stuff > eft /*/
        this.stuff.eft = {};
        v.stuff.eft = stuff.querySelectorAll('eft');
        v.stuff.eft.forEach(e => {
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          this.stuff.eft[key] = {
            g: e.querySelector('g').textContent,
            obj: e.querySelector('obj').textContent,
            key: e.querySelector('key').textContent,
            loop: JSON.parse(e.querySelector('loop').textContent),
            amount: parseInt(e.querySelector('amount').textContent),
            freq: parseInt(e.querySelector('freq').textContent),
            const: parseFloat(e.querySelector('const').textContent),
            dpt: JSON.parse(e.querySelector('dpt').textContent),
            arv: JSON.parse(e.querySelector('arv').textContent),
            type: e.getAttribute('type')
          };
        });

        /*/ Modules Function Structure > Plot > stuff > flipbook /*/
        this.stuff.flipbook = {};
        v.stuff.flipbook = stuff.querySelectorAll('flipbook');
        v.stuff.flipbook.forEach(e => {
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          this.stuff.flipbook[key] = {
            g: e.querySelector('g').textContent,
            objs: JSON.parse(e.querySelector('objs').textContent),
            by: JSON.parse(e.querySelector('by').textContent),
            xy: JSON.parse(e.querySelector('xy').textContent),
            wh: JSON.parse(e.querySelector('wh').textContent),
            hv: JSON.parse(e.querySelector('hv').textContent),
            cc: /*/ Char Code & font style - for default image /*/ JSON.parse(e.querySelector('cc').textContent), 
          };
        });

        /*/ Modules Function Structure > Plot > stuff > trace /*/
        this.stuff.trace = {};
        v.stuff.trace = stuff.querySelectorAll('trace');
        v.stuff.trace.forEach(e => {
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          this.stuff.trace[key] = {
            g: e.querySelector('g').textContent,
            obj: e.querySelector('obj').textContent,
            by: JSON.parse(e.querySelector('by').textContent),
            xy: JSON.parse(e.querySelector('xy').textContent),
            wh: JSON.parse(e.querySelector('wh').textContent),
            hv: JSON.parse(e.querySelector('hv').textContent),
            tps: /*/ Tracing positionS /*/ JSON.parse(e.querySelector('tps').textContent), 
            ss: /*/ StrokeS /*/ JSON.parse(e.querySelector('ss').textContent)
          };
        });
        
        /*/ Modules Function Structure > Plot > scene /*/
        const scene = doc.querySelector('scene');
        this.scene = {};
        v.scene = {};

        /*/ Modules Function Structure > Plot > scene > face /*/
        this.scene.face = {};
        v.scene.face = scene.querySelectorAll('face');
        v.scene.face.forEach(e => {
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          this.scene.face[key] = {
            g: e.querySelector('g').textContent,
            obj: e.querySelector('obj').textContent,
            xy: JSON.parse(e.querySelector('xy').textContent),
            wh: JSON.parse(e.querySelector('wh').textContent),
            opt: JSON.parse(e.querySelector('opt').textContent)
          };
        });

        /*/ Modules Function Structure > Plot > scene > btn /*/
        this.scene.btn = {};
        v.scene.btn = scene.querySelectorAll('btn');
        v.scene.btn.forEach(e => {
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          this.scene.btn[key] = {
            g: e.querySelector('g').textContent,
            obj: e.querySelector('obj').textContent,
            xy: JSON.parse(e.querySelector('xy').textContent),
            wh: JSON.parse(e.querySelector('wh').textContent),
            opt: JSON.parse(e.querySelector('opt').textContent)
          };
        });

        /*/ Modules Function Structure > Plot > scene > svgs /*/
        const svg = doc.querySelector('svgs');
        this.svg = {};
        v.svg = {};

        this.svg.obj = {};
        v.svg.objs = svg.querySelectorAll('obj');
        v.svg.objs.forEach(e => {
          const type = e.getAttribute('type');
          const key = (e.childNodes[0].textContent).replace(/\./g, '');
          if (type === 'data') {
            this.svg.obj[key] = {
              data: e.querySelector('svg').outerHTML,
              type: type
            };
          } else {
            this.svg.obj[key] = {
              data: `./ware/svg/${e.childNodes[0].textContent}.svg`,
              type: type
            };
          }
        });

        // v = null;
      };
      /*/ Modules Function Structure > Plot < /*/

      /*/ Modules Function Structure > Plan > /*/
      const Plan = function () {}

      Plan.prototype.ver = '#0.0.0';
      Plan.prototype.date = '23-0505-1746';
      Plan.prototype.dev = false;
      Plan.prototype.wds = {};
      Plan.prototype.status = false;
      Plan.prototype.behave = '';
      Plan.prototype.url = window.URL || window.webkitURL || window;
      Plan.prototype.func = new Function();
      Plan.prototype.gnb = [];
      Plan.prototype.lnb = [];

      // Object.defineProperty(Plan.prototype, 'setstep', {
      //   get() {
      //     return this.step;
      //   },
      //   set(v) {
      //     if (this.step === v) return;
      //     this.step = v;
      //   },
      //   enumerable: false,
      //   configurable: true,
      // });

      Plan.prototype.init = function (v) {
        const { func, status  } = v;

        this.func = func;
        this.status = status;

        this.wds.wh = window.scale || 1;
        this.wds.dpr = window.devicePixelRatio;
  
        // const ua = navigator.userAgent.toLowerCase();
        // this.wds.mob = /iphone|android/i.test(ua);
        this.wds.mob = navigator.userAgentData.mobile;
        // this.wds.tab = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua);
        console.log(this.wds);
      }

      /*/ Modules Function Structure > Plan < /*/

    };
    /*/ Modules Function Structure < /*/



    /*/ Modules Function Define > /*/
    let mc = {}; /*/ Modules Cache /*/
    const req = id => { /*/ REQuire /*/
      // let cachedModule = mc[id];
      // if (cachedModule !== undefined) return cachedModule.exports;

      let m = (mc[id] = { es: {}, }); /*/ Module, ExpotrS /*/
      ms[id]({ m: m, es: m.es, req: req });

      return m.es;
    };

    (() => {
      req.d = (es, def) => {
        for (var key in def) {
          if (req.o(def, key) && !req.o(es, key)) {
            Object.defineProperty(es, key, {
              enumerable: true,
              get: def[key],
            });
          }
        }
      };
    })();

    (() => {
      req.g = (function () {
        if (typeof globalThis === 'object') return globalThis;
        try {
          return this || new Function('return this')();
        } catch (e) {
          if (typeof window === 'object') return window;
        }
      })();
    })();

    (() => {
      req.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    })();

    (() => {
      req.r = es => {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
          Object.defineProperty(es, Symbol.toStringTag, {
            value: 'Module',
          });
        }
        // Object.defineProperty(es, '_esModule', { value: true });
      };
    })();

    let es = {}; /*/ ExportS /*/
    (() => {
      req.r(es);
      req.d(es, {
        core: (/*/ Imported Module Legacy /*/) => iml,
        default: (/*/ Default Export /*/) => de,
      });

      const iml = req('legacy');
      const de = iml;
    })();
    /*/ Modules Function Define > /*/

    es = es['default'];
    return es;
  })();
});

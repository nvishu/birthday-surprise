/* =========================================================
   V3 UPGRADE: balloon groups, gate balloon pop-outs, sparkles,
   bunting, last-page ambience.  Loads after script.js + slides.js
   ========================================================= */
(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const mk = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];
  const body = document.body, main = $("main"), calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PAL = [["#ff7aa2", "#e5102f"], ["#ffc46b", "#ff7a18"], ["#fff07a", "#f5b700"], ["#7af0c0", "#14b87a"],
               ["#7fd4ff", "#1d7df0"], ["#c9a2ff", "#7b3df0"], ["#ffa3dc", "#e83fa6"], ["#ff9b7a", "#e63b2e"]];
  let ac;
  const pop = () => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = "square"; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(120, t + .08);
    g.gain.setValueAtTime(.09, t); g.gain.exponentialRampToValueAtTime(.001, t + .09); o.connect(g).connect(ac.destination); o.start(); o.stop(t + .1); } catch (e) {} };

  /* little burst when a balloon pops */
  function burst(x, y, c) {
    pop();
    for (let i = 0; i < 12; i++) {
      const p = mk("i"); p.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${rnd(5, 10)}px;height:${rnd(5, 10)}px;border-radius:${Math.random() > .5 ? "50%" : "2px"};background:${i % 3 ? c : "#fff"};z-index:1500;pointer-events:none`;
      body.appendChild(p); const a = Math.random() * 6.283, d = rnd(30, 90);
      p.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 30}px) scale(.2)`, opacity: 0 }],
        { duration: rnd(500, 900), easing: "ease-out" }).onfinish = () => p.remove();
    }
  }

  /* one balloon, tap to pop (it grows back later) */
  function balloon(g, x, y, w) {
    const pal = pick(PAL), b = mk("i", "bl");
    b.style.cssText = `left:${x}px;top:${y}px;--w:${w}px;--c1:${pal[0]};--c2:${pal[1]};--s:${rnd(50, 90)}px;--dur:${rnd(4, 7)}s;--dly:${-rnd(0, 5)}s;--r0:${rnd(-5, -1)}deg;--r1:${rnd(1, 5)}deg`;
    b.addEventListener("pointerdown", e => {
      e.stopPropagation(); const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, pal[1]);
      b.style.visibility = "hidden"; b.style.pointerEvents = "none";
      setTimeout(() => { b.style.visibility = ""; b.style.pointerEvents = ""; b.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 700, easing: "cubic-bezier(.3,1.6,.5,1)" }); }, 5000);
    });
    g.appendChild(b);
  }
  function group(n, cls, W, H) {
    const g = mk("div", "bgroup " + cls);
    for (let i = 0; i < n; i++) { const w = rnd(34, 62); balloon(g, rnd(0, W - w), rnd(0, H * .55) + (i % 2) * 8, w); }
    return g;
  }

  /* ---------- balloons on every page (5-10 per group) ---------- */
  const SPOTS = [["rt", { right: "1.5%", top: "78px" }], ["lb", { left: "1.5%", bottom: "96px" }], ["lt", { left: "1.5%", top: "34%" }], ["rb", { right: "1.5%", bottom: "100px" }]];
  const pages = $$("main > section");
  pages.forEach((s, i) => {
    [[i % 4, 5 + ((i * 3) % 6)], [(i + 2) % 4, 5 + ((i * 2 + 1) % 5)]].forEach(([k, n]) => {
      const g = group(n, "fixed " + SPOTS[k][0], 230, 190); Object.assign(g.style, SPOTS[k][1]); s.appendChild(g);
    });
  });
  const eyebrow = $("#home .eyebrow");                 // big cluster above "Happy Birthday, Kuku"
  if (eyebrow) eyebrow.parentNode.insertBefore(group(9, "inline", 440, 150), eyebrow);

  /* ---------- sparkles + bunting ---------- */
  const sp = mk("div"); sp.id = "sparkles";
  for (let i = 0; i < 36; i++) {
    const s = mk("i", "", pick(["&#10022;", "&#10023;", "&#10038;", "&#10084;"]));
    s.style.cssText = `left:${rnd(0, 100)}%;top:${rnd(0, 100)}%;font-size:${rnd(10, 24)}px;color:${pick(["#ffc83d", "#fff", "#ff8fb0", "#b57cff", "#7fd4ff"])};opacity:.7;animation-delay:${-rnd(0, 3)}s;animation-duration:${rnd(2, 5)}s`;
    sp.appendChild(s);
  }
  body.insertBefore(sp, main);
  const bunting = mk("div"); bunting.id = "bunting"; body.appendChild(bunting);

  /* ---------- balloons rising out of a gate / from the bottom ---------- */
  function rise(rect, n, fromBottom) {
    if (calm) return;
    for (let i = 0; i < n; i++) {
      const pal = pick(PAL), w = rnd(38, 72), b = mk("i", "bl rising");
      const x = rect.left + rect.width * rnd(.1, .9) - w / 2, y = fromBottom ? innerHeight + 20 : rect.bottom - rnd(80, 230);
      b.style.cssText = `left:${x}px;top:${y}px;--w:${w}px;--c1:${pal[0]};--c2:${pal[1]};--s:${rnd(50, 90)}px`;
      body.appendChild(b);
      const dur = rnd(3400, 5600), delay = i * 85, dx = rnd(-140, 140), up = fromBottom ? -(innerHeight + 260) : -(y + 220);
      const a = b.animate([{ transform: "translate(0,40px) scale(.15)", opacity: 0 }, { transform: "translate(0,0) scale(1)", opacity: 1, offset: .1 },
        { transform: `translate(${dx}px,${up}px) rotate(${rnd(-25, 25)}deg)`, opacity: 1 }], { duration: dur, delay, easing: "cubic-bezier(.3,.1,.35,1)", fill: "both" });
      a.onfinish = () => b.remove();
      if (Math.random() < .5) setTimeout(() => { if (!b.isConnected) return; const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, pal[1]); b.remove(); }, delay + dur * rnd(.3, .8));
    }
  }
  function ring(rect) {
    const r = mk("i"); r.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;width:60px;height:60px;margin:-30px;border-radius:50%;border:5px solid #ffd27a;z-index:1400;pointer-events:none;box-shadow:0 0 30px #ffd27a`;
    body.appendChild(r); r.animate([{ transform: "scale(.3)", opacity: 1 }, { transform: "scale(14)", opacity: 0 }], { duration: 1300, easing: "ease-out" }).onfinish = () => r.remove();
  }
  $$(".gate").forEach(gate => {
    const scene = gate.querySelector(".gate-scene");
    [["left", -96], ["right", -96]].forEach(([side, off]) => {
      const g = group(7, "gside", 120, 130); g.style[side] = off + "px"; g.style.top = "-10px"; g.style.zIndex = "5"; scene.appendChild(g);
    });
    new MutationObserver(() => {
      if (!gate.classList.contains("opening") || gate._done) return; gate._done = 1;
      const rect = scene.getBoundingClientRect();
      gate.querySelectorAll(".gside").forEach(x => x.classList.add("fly"));
      setTimeout(() => { ring(rect); rise(rect, 20); }, 500);
      setTimeout(() => rise(rect, 10), 1300);
    }).observe(gate, { attributes: true, attributeFilter: ["class"] });
  });

  /* ---------- last page: ambient falling hearts & petals ---------- */
  const letter = $("#letter");
  for (let i = 0; i < 22; i++) {
    const f = mk("i", "gl-fall", pick(["&#10084;", "&#10084;", "&#10047;", "&#10022;"]));
    f.style.cssText = `left:${rnd(0, 100)}%;font-size:${rnd(12, 26)}px;color:${pick(["#ff5c8a", "#ffc83d", "#fff", "#b57cff", "#ff8a3d"])};opacity:.75;animation-duration:${rnd(7, 14)}s;animation-delay:${-rnd(0, 12)}s;--sw:${rnd(-120, 120)}px;--rt:${rnd(180, 540)}deg;font-style:normal`;
    letter.appendChild(f);
  }

  /* ---------- final surprise: balloon waves from the bottom ---------- */
  const fp = $("#final-pop");
  new MutationObserver(() => { if (!fp.classList.contains("show")) return;
    [0, 1800, 3800].forEach(t => setTimeout(() => fp.classList.contains("show") && rise({ left: 0, width: innerWidth, top: innerHeight, bottom: innerHeight }, 18, true), t)); })
    .observe(fp, { attributes: true, attributeFilter: ["class"] });
})();

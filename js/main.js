/* APNA KAAJ — main.js: CONFIG + shared helpers + header/splash behaviour. Loaded on every page. */
document.documentElement.classList.add("js");
/* ===== YOUR DETAILS + REQUEST ENDPOINT (only place to change these) ===== */
const CONFIG = {
  requestEndpoint: "https://script.google.com/macros/s/AKfycbwJup7lshgCBd7ZClaUw7rfXWz3Qgxq-2y-s0MAWwcVg-VZIsb2Acm7Sv0N3-ImXn1_4Q/exec", // Google Apps Script web app (production)
  phone: "1234567890",     // 10 digits, e.g. "7651012345"
  whatsappNumber: "7651951715", // 10 digits (+91 added automatically)
  email: "rahulro1@yahoo.com",
  location: "Lokaiyapur, Antu, Pratapgarh, Uttar Pradesh"
};
const AK = (() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ok = v => /^\d{10}$/.test(v || "");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const root = document.body.dataset.root || "";   // "" on top pages, "../" inside /services/
  let tt;
  function toast(m) { let t = $("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; t.setAttribute("role", "status"); document.body.append(t); } t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 3500); }
  function openWA(msg) {
    if (!ok(CONFIG.whatsappNumber)) return toast("WhatsApp number is not set yet (see CONFIG in js/main.js).");
    window.open("https://wa.me/91" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(msg || "Hello"), "_blank", "noopener,noreferrer");
  }
  function img(src, alt, ar = "4/3", cls = "") { // image slot with graceful placeholder
    const [a, b] = ar.split("/").map(Number);
    return `<div class="im ${cls}" style="--ar:${ar}"><img loading="lazy" src="${root + src}" alt="${esc(alt)}" width="1200" height="${Math.round(1200 * b / a)}" data-ph="${esc(src)}"></div>`;
  }
  const CAM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  function fallbacks(rootEl = document) {
    $$("img[data-ph],img[data-bare]", rootEl).forEach(i => {
      if (i.dataset.fb) return; i.dataset.fb = "1";
      const fix = () => {
        if (i.hasAttribute("data-bare")) return i.remove();
        const d = document.createElement("div"); d.className = "ph"; d.setAttribute("role", "img"); d.setAttribute("aria-label", i.alt);
        d.innerHTML = CAM + "<span>Replace with your photo</span><code>" + esc(i.dataset.ph) + "</code>"; i.replaceWith(d);
      };
      if (i.complete && i.naturalWidth === 0 && i.getAttribute("loading") !== "lazy") fix(); else i.addEventListener("error", fix, { once: true });
    });
  }
  function bind() {
    document.addEventListener("click", e => {
      const w = e.target.closest("[data-wa]"), r = e.target.closest("[data-req]");
      if (w) { e.preventDefault(); openWA(w.dataset.wa); }
      if (r) { e.preventDefault(); const [b, s] = r.dataset.req.split("|"); AK.openRequest(b, s); }
    });
    $$("[data-call]").forEach(a => { if (ok(CONFIG.phone)) a.href = "tel:+91" + CONFIG.phone; else { a.style.display = "none"; const r = a.closest(".row"); if (r) r.style.display = "none"; } });
    $$("[data-phone]").forEach(p => p.textContent = ok(CONFIG.phone) ? CONFIG.phone : "Number coming soon");
    $$("[data-mail]").forEach(a => { a.href = "mailto:" + CONFIG.email; a.textContent = CONFIG.email; });
    $$("[data-loc]").forEach(p => p.textContent = CONFIG.location);
    $$("[data-yr]").forEach(s => s.textContent = new Date().getFullYear());
  }
  function nav() {
    const nv = $("#nav"), bg = $("#burger"), dd = $(".dd"), hd = $("#hdr"); if (!nv) return;
    const close = () => { nv.classList.remove("open"); bg.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; dd.classList.remove("open"); };
    bg.onclick = () => { const o = nv.classList.toggle("open"); bg.setAttribute("aria-expanded", o); document.body.style.overflow = o ? "hidden" : ""; };
    $(".ddb").onclick = e => { const o = dd.classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", o); };
    nv.addEventListener("click", e => { if (e.target.closest("a,[data-req],[data-wa]")) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    document.addEventListener("click", e => { if (!e.target.closest(".dd")) dd.classList.remove("open"); });
    addEventListener("scroll", () => hd.classList.toggle("sm", scrollY > 40), { passive: true });
  }
  function reveal() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .08 });
    $$(".sec-head,.svc,.upd,.tile,.why-i,.cat,.cc,.feat>div,.gi").forEach(el => { el.classList.add("rv"); io.observe(el); });
  }
  function splash() { // brand intro: index.html only, once per browser session
    const sp = $("#splash"); if (!sp) return; let seen = null;
    try { seen = sessionStorage.getItem("ak-splash"); } catch (e) {}
    if (seen) { document.body.classList.add("nosplash"); return; }
    document.body.style.overflow = "hidden";
    setTimeout(() => { sp.classList.add("out"); document.body.style.overflow = ""; try { sessionStorage.setItem("ak-splash", "1"); } catch (e) {} }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 700 : 2000);
  }
  function toTop() { // floating back-to-top button, shown after ~600px of scrolling
    const b = document.createElement("button"); b.type = "button"; b.className = "totop"; b.setAttribute("aria-label", "Scroll to top"); b.title = "Back to top";
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'; document.body.append(b);
    let tick = false; const upd = () => { tick = false; b.classList.toggle("show", scrollY > 600); };
    addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    b.onclick = () => scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); upd();
  }
  function init() {
    splash(); nav(); toTop(); bind();
    ["renderServices", "renderFeatured", "renderUpdates", "renderGallery"].forEach(f => { try { AK[f] && AK[f](); } catch (e) { console.warn(f, e); } });
    fallbacks(); reveal();
  }
  return { $, $$, esc, toast, img, fallbacks, init, openWA };
})();

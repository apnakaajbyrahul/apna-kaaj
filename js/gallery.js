/* APNA KAAJ — gallery.js
   TO ADD A PHOTO: save it in assets/gallery/ then add one line below.
   category: Photography | Cards | Printing | Albums | Events */
const galleryItems = [
  { image: "assets/gallery/wedding-01.webp", title: "Wedding Photography", category: "Photography" },
  { image: "assets/gallery/wedding-card-01.webp", title: "Wedding Cards", category: "Cards" },
  { image: "assets/gallery/invitation-01.webp", title: "Invitation Cards", category: "Cards" },
  { image: "assets/gallery/flex-01.webp", title: "Flex & Poster", category: "Printing" },
  { image: "assets/gallery/album-01.webp", title: "Album Design", category: "Albums" },
  { image: "assets/gallery/drone-01.webp", title: "Drone Shoot", category: "Events" },
  { image: "assets/gallery/prewedding-01.webp", title: "Pre-Wedding Shoot", category: "Photography" },
  { image: "assets/gallery/event-01.webp", title: "Event Coverage", category: "Events" },
  { image: "assets/gallery/wedding-card-02.webp", title: "Wedding Cards", category: "Cards" },
  { image: "assets/gallery/wedding-card-03.webp", title: "Wedding Cards", category: "Cards" },
  { image: "assets/gallery/wedding-card-04.webp", title: "Wedding Cards", category: "Cards" },
  { image: "assets/gallery/wedding-card-05.webp", title: "Wedding Cards", category: "Cards" },
  { image: "assets/gallery/wedding-card-06.webp", title: "Wedding Cards", category: "Cards" },
  { image: "assets/gallery/wedding-card-07.webp", title: "Wedding Cards", category: "Cards" },
  { image: "assets/gallery/wedding-card-08.webp", title: "Wedding Cards", category: "Cards" },
  { image: "assets/gallery/wedding-card-09.webp", title: "Wedding Cards", category: "Cards" },
  { image: "assets/gallery/wedding-card-10.webp", title: "Wedding Cards", category: "Cards" },
  { image: "assets/gallery/wedding-card-11.webp", title: "Wedding Cards", category: "Cards" }
];
(() => {
  const { $, $$, esc } = AK, CATS = ["All", "Photography", "Cards", "Printing", "Albums", "Events"];
  let list = [], idx = 0, lb;
  function lightbox() {
    if (lb) return lb; lb = document.createElement("div"); lb.id = "lb"; lb.hidden = true; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML = '<button id="lbx" aria-label="Close">✕</button><button id="lbp" aria-label="Previous">‹</button><figure><img alt=""><figcaption></figcaption></figure><button id="lbn" aria-label="Next">›</button>'; document.body.append(lb);
    const close = () => { lb.hidden = true; }; $("#lbx").onclick = close; $("#lbp").onclick = () => show(idx - 1); $("#lbn").onclick = () => show(idx + 1); lb.onclick = e => { if (e.target === lb) close(); };
    document.addEventListener("keydown", e => { if (lb.hidden) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1); });
    return lb;
  }
  function show(i) { idx = (i + list.length) % list.length; const g = list[idx], im = $("#lb img"); im.src = (document.body.dataset.root || "") + g.image; im.alt = g.title; $("#lb figcaption").textContent = g.title; }
  AK.renderGallery = () => {
    const out = $("#galGrid"); if (!out) return; const limit = +out.dataset.limit || 999, fEl = $("#galFilters"); let f = "All";
    const draw = () => {
      list = galleryItems.filter(g => f === "All" || g.category === f);
      out.innerHTML = list.slice(0, limit).map((g, i) => `<button class="gi" data-i="${i}" aria-label="Open ${esc(g.title)}">${AK.img(g.image, g.title, out.dataset.ar || "4/3")}<span>${esc(g.title)}</span></button>`).join("") || '<p class="empty">No photos in this category yet.</p>';
      AK.fallbacks(out);
    };
    out.onclick = e => { const b = e.target.closest(".gi"); if (!b) return; lightbox(); show(+b.dataset.i); lb.hidden = false; $("#lbx").focus(); };
    if (fEl) { fEl.innerHTML = CATS.map(c => `<button data-f="${c}" aria-pressed="${c === f}">${c}</button>`).join(""); fEl.onclick = e => { const b = e.target.closest("button"); if (!b) return; f = b.dataset.f; $$("button", fEl).forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); }; }
    draw();
  };
})();

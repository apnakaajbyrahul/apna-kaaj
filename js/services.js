/* APNA KAAJ — services.js (all service data)
   HOW TO ADD A SERVICE:    add a "text" to a category's services: [...] list.
   HOW TO REMOVE A SERVICE: delete that item.   HOW TO RENAME: edit its text.
   HOW TO ADD A CATEGORY:   copy one { business, title, services } block.
   "business" must match: Rahul Jan Sewa Kendra | Studio & Printing | RO Water | Digital Library */
const serviceCategories = [
  { business: "Rahul Jan Sewa Kendra", title: "Government & Online Services", services: ["Government online form assistance", "Government scheme application assistance", "Online registration assistance", "Application status checking", "Document download & printing"] },
  { business: "Rahul Jan Sewa Kendra", title: "Documents & Certificates", services: ["PAN card application assistance", "Aadhaar-related assistance (where permitted)", "Voter-related online assistance", "Ration card online assistance", "Income certificate application assistance", "Caste certificate application assistance", "Domicile certificate application assistance", "Birth / death certificate online assistance"] },
  { business: "Rahul Jan Sewa Kendra", title: "Education", services: ["Scholarship form assistance", "Admission form assistance", "Examination form assistance", "University & entrance exam forms", "Result checking", "Admit card download & print"] },
  { business: "Rahul Jan Sewa Kendra", title: "Jobs & Recruitment", services: ["Government job application forms", "Recruitment application assistance", "Job notification assistance", "Job admit card download", "Job result checking"] },
  { business: "Rahul Jan Sewa Kendra", title: "Online Forms", services: ["Online application form filling", "Correction / update application assistance (where available)", "Online document upload", "Email & account assistance"] },
  { business: "Rahul Jan Sewa Kendra", title: "Bills / Payments", services: ["Electricity bill assistance (where available)", "Recharge services (where available)", "Banking / insurance form assistance", "Ticket booking assistance"] },
  { business: "Rahul Jan Sewa Kendra", title: "Document / Office Services", services: ["Photocopy", "Printing", "Scanning", "Lamination", "Passport-size photo coordination", "PDF / document assistance"] },
  { business: "Rahul Jan Sewa Kendra", title: "Other Online Services", services: ["Other Online Services"] },
  { business: "Studio & Printing", title: "Photography", layout: "feature", img: "assets/services/studio-photography.webp", blurb: "Weddings, pre-wedding shoots, birthdays, events and portraits.", services: ["Wedding Photography", "Pre-Wedding Photography", "Birthday / Event Photography", "Passport Photos", "Portrait & Family Photography", "Photo Editing & Retouching", "Old Photo Restoration"] },
  { business: "Studio & Printing", title: "Videography", layout: "half", img: "assets/services/studio-videography.webp", blurb: "Cinematic wedding and event films, invitation videos and reels.", services: ["Wedding Videography", "Event Videography", "Cinematic Video", "Invitation Video", "Reels / Highlights", "Short Event Films"] },
  { business: "Studio & Printing", title: "Drone / Crane / LED", layout: "half", img: "assets/services/studio-drone.webp", blurb: "Aerial shots, crane camera and LED screens for big functions.", services: ["Drone Shoot", "Crane / Jib Camera", "LED Screen"] },
  { business: "Studio & Printing", title: "Albums", layout: "split", img: "assets/services/studio-album.webp", blurb: "Beautifully designed and printed albums for your memories.", services: ["Album Design", "Wedding Album Design", "Album Printing", "Photo Album"] },
  { business: "Studio & Printing", title: "Wedding & Invitation Cards", layout: "split", rev: true, img: "assets/services/studio-cards.webp", blurb: "Cards for weddings, birthdays and religious functions.", services: ["Wedding Cards", "Birthday Invitation Cards", "Ramayan / Religious Function Cards", "Invitation Cards", "Visiting Cards"] },
  { business: "Studio & Printing", title: "Printing, Flex & Custom Orders", layout: "wide", img: "assets/services/studio-printing-work.webp", blurb: "Flex, posters, stickers and everyday printing for shops and events.", services: ["Flex Banners", "Event Banners", "Shop Banners", "Posters", "Pamphlets & Flyers", "Stickers", "ID Cards", "Certificates", "Photo Printing", "Promotional Material", "Custom Print Orders"] },
  { business: "RO Water", title: "Regular Supply", layout: "half", img: "assets/other/ro-jars.webp", blurb: "20L RO jars for homes and shops: delivered on our local route or collected from us.", services: ["20L RO Water Jar", "Regular / Daily Water Supply", "Local Delivery", "Direct Pickup", "Shop & Business Supply"] },
  { business: "RO Water", title: "Weddings & Events", layout: "half", img: "assets/other/ro-delivery.webp", blurb: "One-time and bulk supply for weddings, parties and functions.", services: ["Wedding Water Supply", "Party / Event Bulk Supply", "Bulk Order Enquiry"] }
];
/* Homepage "Popular Services" tiles — edit freely */
const featuredServices = [
  { business: "Rahul Jan Sewa Kendra", name: "PAN Card Assistance" },
  { business: "Rahul Jan Sewa Kendra", name: "Government Job Forms" },
  { business: "Studio & Printing", name: "Wedding Photography" },
  { business: "Studio & Printing", name: "Wedding Cards" },
  { business: "RO Water", name: "20L RO Water Jar" },
  { business: "Digital Library", name: "Seat Enquiry" }
];
(() => {
  const { $, $$, esc } = AK;
  AK.renderFeatured = () => {
    const el = $("#featured"); if (!el) return;
    el.innerHTML = featuredServices.map(f => `<button class="tile" data-req="${esc(f.business)}|${esc(f.name)}"><small>${esc(f.business)}</small><b>${esc(f.name)}</b><span>Request →</span></button>`).join("");
  };
  AK.renderServices = () => {
    const app = $("#svcApp"); if (!app) return;
    const biz = app.dataset.business, blocks = app.dataset.mode === "blocks", cats = serviceCategories.filter(c => c.business === biz); let cur = "all";
    const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const btn = (c, x, cls) => `<button class="${cls}" data-req="${esc(biz)}|${esc(x)}">${esc(x)}${cls === "sv" ? "<i aria-hidden=\"true\">›</i>" : ""}</button>`;
    if (blocks) { // visual blocks: one image + chips per category
      $("#svcOut").innerHTML = cats.map(c => `<article class="blk ${c.layout || "split"}${c.rev ? " rev" : ""}" id="c-${slug(c.title)}">${AK.img(c.img || "assets/services/" + biz + ".webp", c.blurb || c.title, "16/10")}<div class="blk-t"><h3>${esc(c.title)}</h3><p>${esc(c.blurb || "")}</p><ul class="chips">${c.services.map(x => `<li>${btn(c, x, "chip")}</li>`).join("")}</ul></div></article>`).join(""); return;
    }
    const draw = () => {
      const q = $("#svcSearch").value.trim().toLowerCase();
      const rows = cats.filter(c => cur === "all" || c.title === cur).map(c => ({ ...c, services: c.services.filter(x => !q || x.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)) })).filter(c => c.services.length);
      $("#svcOut").innerHTML = rows.length ? rows.map(c => `<div class="cat"><h3><span>${esc(c.title)}</span><small>${c.services.length}</small></h3><ul>${c.services.map(x => `<li>${btn(c, x, "sv")}</li>`).join("")}</ul></div>`).join("")
        : `<p class="empty">No match found. <a class="more" href="#" data-wa="Hello, I am looking for: ${esc(q)}">Ask us on WhatsApp</a></p>`;
    };
    $("#svcChips").innerHTML = cats.length > 1 ? ["all", ...cats.map(c => c.title)].map(t => `<button data-c="${esc(t)}" aria-pressed="${t === "all"}">${t === "all" ? "All" : esc(t)}</button>`).join("") : "";
    $("#svcChips").onclick = e => { const b = e.target.closest("button"); if (!b) return; cur = b.dataset.c; $$("#svcChips button").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); };
    $("#svcSearch").addEventListener("input", draw); draw();
  };
})();

/* APNA KAAJ — updates.js
   TO ADD A NEW UPDATE: add one { ... } object to the list below. TO REMOVE: delete its object.
   Required: title, category. Optional: publishDate, lastDate, status, description, link, isNew, external.
   category: job | scheme | form | admit | result | other
   ALL ITEMS BELOW ARE SAMPLE / DEMO DATA — replace with genuine updates. */
const updatesData = [
  {
  id: 1,
  title: "Punjab and Haryana High Court Clerk Recruitment 2026 – 1270 Posts",
  category: "job",
  publishDate: "2026-10-07",
  lastDate: "2026-11-04",
  isNew: true,
  status: "Application Open",
  description: "1270 Clerk Vacancies in Punjab District Courts. Qualification: Bachelor's Degree (BA/B.Sc. or equivalent) from a recognized university, Punjabi as a subject at Matriculation level, and computer proficiency. Check the official notification for age limits, fees, and eligibility.",
  link: "https://sssc.gov.in/"
},
  {
  id: 2,
  title: "National Scholarship Portal (NSP) Scholarship Form 2026-27",
  category: "form",
  publishDate: "2026-06-01",
  lastDate: "2026-10-31",
  isNew: true,
  status: "Form Started",
  description: "Eligible Students from School to Post Graduation, including Pre-Matric, Post-Matric, Undergraduate and Postgraduate Scholarship Schemes. Eligibility varies by scheme.",
  link: "https://scholarships.gov.in/"
},
  {
  id: 3,
  title: "PM Kisan 22nd Instalment 2026 – Payment Status",
  category: "scheme",
  publishDate: "2026-10-20",
  status: "Upcoming",
  description: "Check the latest updates on the PM-KISAN Samman Nidhi Yojana 22nd instalment, beneficiary eligibility, e-KYC requirements, and payment status. Eligible farmers receive financial assistance of ₹6,000 per year in three instalments through Direct Benefit Transfer (DBT).",
  link: "https://pmkisan.gov.in/"
  },
  {
  id: 4,
  title: "NIOS Class 10th & 12th October Admit Card 2026",
  category: "admit",
  publishDate: "2026-10-17",
  status: "Download Available",
  link: "https://sdmis.nios.ac.in/"
},
  {
  id: 5,
  title: "Rajasthan Board 10th & 12th Revised Result 2026",
  category: "result",
  publishDate: "2026-10-18",
  status: "Declared",
  description: "Rajasthan Board of Secondary Education (RBSE) has published updates regarding revised results for Secondary and Senior Secondary examinations 2026. Students can visit the official website to check result updates and access available result information.",
  link: "https://rajeduboard.rajasthan.gov.in/RESULT2026/Result2026.htm"
},
{
  id: 6,
  title: "Rajasthan CET 2026 Revised Exam Date Notice",
  category: "other",
  publishDate: "2026-10-15",
  description: "The Rajasthan Staff Selection Board (RSSB) has revised the examination schedule for CET 2026. The Senior Secondary (12th Level) examination is scheduled for 1–3 December 2026, while the Graduation Level examination is scheduled for 16–18 January 2027. Candidates should check the official website for the latest notice and examination updates.",
  link: "https://rssb.rajasthan.gov.in/"
},
  {
  id: 7,
  title: "Rajasthan Safai Karamchari Recruitment 2026 – 24,752 Posts",
  category: "job",
  publishDate: "2026-10-19",
  lastDate: "2026-10-28",
  status: "Closing Soon",
  description: "The Rajasthan Local Self Government Department has announced recruitment for 24,752 contractual Safai Karamchari posts across 183 urban local bodies. Eligible candidates should check the official notification for eligibility criteria, required documents, application instructions, and the revised deadline before applying.",
  link: "https://sso.rajasthan.gov.in/"
},
{
  id: 8,
  title: "IGNOU January 2027 Admission Form – Online Application",
  category: "form",
  publishDate: "2026-10-20",
  status: "Check Official Portal",
  description: "Indira Gandhi National Open University (IGNOU) offers undergraduate, postgraduate, diploma, and certificate programmes through Open and Distance Learning (ODL) and online modes. Candidates can visit the official admission portal to check the January 2027 admission notification, available courses, eligibility criteria, application dates, and admission fees.",
  link: "https://ignouadmission.samarth.edu.in/"
}
];
(() => {
  const { $, $$, esc } = AK, CATS = { all: "All", job: "Jobs", scheme: "Schemes", form: "Online Forms", admit: "Admit Cards", result: "Results", other: "Other" };
  const fmt = d => { const x = new Date(d); return isNaN(x) ? "" : x.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); };
  AK.renderUpdates = () => {
    const out = $("#updList"); if (!out) return; const limit = +out.dataset.limit || 999, qEl = $("#updSearch"), fEl = $("#updFilters"); let f = "all";
    const draw = () => {
      const q = qEl ? qEl.value.trim().toLowerCase() : "";
      const items = updatesData.filter(u => (f === "all" || u.category === f) && (!q || (u.title + " " + (u.description || "")).toLowerCase().includes(q))).sort((a, b) => (b.publishDate || "").localeCompare(a.publishDate || "")).slice(0, limit);
      out.innerHTML = items.map(u => `<article class="upd"><div class="m tg"><span class="tag">${esc(CATS[u.category] || "Other")}</span>${u.isNew ? '<span class="new">NEW</span>' : ""}${u.status ? `<span class="st">${esc(u.status)}</span>` : ""}</div>
<h3>${esc(u.title || "Update")}</h3><div class="m dt">${u.publishDate ? `<span>Posted ${fmt(u.publishDate)}</span>` : ""}${u.lastDate ? `<span><b>Last date ${fmt(u.lastDate)}</b></span>` : ""}</div>${u.description ? `<p>${esc(u.description)}</p>` : ""}
${u.link ? `<a class="more" href="${esc(u.link)}" ${u.external ? 'target="_blank" rel="noopener noreferrer"' : ""}>View Details →</a>` : ""}</article>`).join("") || '<p class="empty">No updates found.</p>';
    };
    if (fEl) { fEl.innerHTML = Object.entries(CATS).map(([k, v]) => `<button data-f="${k}" aria-pressed="${k === f}">${v}</button>`).join(""); fEl.onclick = e => { const b = e.target.closest("button"); if (!b) return; f = b.dataset.f; $$("button", fEl).forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); }; }
    if (qEl) qEl.addEventListener("input", draw); draw();
  };
})();

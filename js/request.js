/* APNA KAAJ — request.js: in-site Request Service modal (replaces Google Forms).
   Backend: CONFIG.requestEndpoint in js/main.js (Google Apps Script web app, see README).
   While requestEndpoint is "", the form works for testing but NEVER claims a request was saved. */
(() => {
  const { $, esc } = AK; const root = document.body.dataset.root || ""; let back, busy = false, prev, reqId, ctx;
  const newId = () => "AK-" + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase();
  const FOC = 'a[href],button:not([disabled]),input:not(.hp input),textarea,select';
  function close() { if (!back) return; back.remove(); back = null; document.body.style.overflow = ""; document.removeEventListener("keydown", key); if (prev && prev.focus) prev.focus(); }
  function key(e) {
    if (e.key === "Escape") return close();
    if (e.key !== "Tab") return;
    const f = [...back.querySelectorAll(FOC)].filter(x => x.offsetParent !== null); if (!f.length) return;
    const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }
  const field = (id, label, input) => `<div class="f"><label for="${id}">${label}</label>${input}<span class="err" id="${id}E" role="alert"></span></div>`;
  const form = () => `<p class="rm-s">Tell us about your requirement</p><form id="rmF" novalidate>
${field("rmName", "Name *", '<input id="rmName" name="name" autocomplete="name" required>')}
${field("rmMob", "Mobile / WhatsApp *", '<input id="rmMob" name="mobile" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national" placeholder="10-digit mobile number" required>')}
${field("rmLoc", "Village / Location *", '<input id="rmLoc" name="location" autocomplete="address-level2" required>')}
${field("rmDate", "Required / Event Date", '<input id="rmDate" name="requiredDate" type="date">')}
${field("rmMsg", "Requirement", '<textarea id="rmMsg" name="message" rows="3" maxlength="500" placeholder="Any details that will help us"></textarea>')}
<div class="hp" aria-hidden="true"><input name="website" tabindex="-1" autocomplete="off"></div>
<div id="rmNote" class="rm-n" role="status" hidden></div>
<div class="rm-a"><button class="btn" id="rmGo" type="submit">Submit Request</button><button class="btn btn-d" type="button" id="rmWa">Continue on WhatsApp</button></div><p class="rm-privacy">By submitting, you agree that APNA KAAJ may use these details to contact you about this service request. <a href="${root}privacy.html">Privacy Policy</a></p></form>`;
  const g = id => $("#" + id).value.trim();
  const data = () => ({ timestamp: new Date().toISOString(), requestId: reqId, name: g("rmName"), mobile: g("rmMob").replace(/\s/g, ""), location: g("rmLoc"), business: ctx.business, service: ctx.service, requiredDate: g("rmDate"), message: g("rmMsg"), status: "New", website: document.querySelector(".hp input").value });
  const waText = d => `Hello, I want to request: ${d.service} (${d.business}).` + (d.name ? `\nName: ${d.name}` : "") + (d.mobile ? `\nMobile: ${d.mobile}` : "") + (d.location ? `\nLocation: ${d.location}` : "") + (d.requiredDate ? `\nDate: ${d.requiredDate}` : "") + (d.message ? `\nRequirement: ${d.message}` : "") + `\nRef: ${d.requestId}`;
  function note(kind, html) { const n = $("#rmNote"); n.className = "rm-n " + kind; n.innerHTML = html; n.hidden = false; }
  function valid() {
    const errs = {};
    if (g("rmName").length < 2) errs.rmName = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(g("rmMob").replace(/\s/g, ""))) errs.rmMob = "Enter a valid 10-digit mobile number.";
    if (g("rmLoc").length < 2) errs.rmLoc = "Please enter your village or location.";
    ["rmName", "rmMob", "rmLoc"].forEach(id => { const el = $("#" + id); $("#" + id + "E").textContent = errs[id] || ""; el.setAttribute("aria-invalid", !!errs[id]); if (errs[id]) el.setAttribute("aria-describedby", id + "E"); });
    const first = Object.keys(errs)[0]; if (first) $("#" + first).focus(); return !first;
  }
  function ok(id, d) {
    $("#rmB").innerHTML = `<div class="rm-ok"><div class="tick" aria-hidden="true">✓</div><h3 id="rmOk" tabindex="-1">Request Received</h3><p class="hi">धन्यवाद!</p><p>Your request has been received. We will contact you shortly.</p><p class="rid">Request ID: <b>${esc(id)}</b></p><div class="rm-a"><button class="btn" id="rmW2" type="button">WhatsApp</button><button class="btn btn-d" id="rmC" type="button">Close</button></div></div>`;
    $("#rmW2").onclick = () => AK.openWA(waText({ ...d, requestId: id })); $("#rmC").onclick = close; $("#rmOk").focus();
  }
  async function submit(e) {
    e.preventDefault(); if (busy) return;
    if (document.querySelector('.hp input').value) return close(); // bot trap
    if (!valid()) return; const d = data();
    if (!CONFIG.requestEndpoint) return note("warn", "<b>Test mode:</b> the request system is not connected yet, so this request was <b>not saved</b>. Please send it on WhatsApp instead.");
    busy = true; const b = $("#rmGo"); b.disabled = true; b.textContent = "Sending…"; $("#rmF").setAttribute("aria-busy", "true"); $("#rmNote").hidden = true;
    try {
      const c = new AbortController(), t = setTimeout(() => c.abort(), 15000);
      const r = await fetch(CONFIG.requestEndpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(d), signal: c.signal }); clearTimeout(t);
      const j = await r.json(); if (!j || j.ok !== true) throw new Error("not confirmed");
      ok(j.requestId || d.requestId, d);
    } catch (err) {
      note("bad", "We couldn't send your request. Please check your connection and try again, or use WhatsApp.");
      b.disabled = false; b.textContent = "Try Again"; $("#rmF").removeAttribute("aria-busy");
    } finally { busy = false; }
  }
  AK.openRequest = (business, service) => {
    close(); prev = document.activeElement; reqId = newId(); ctx = { business, service };
    back = document.createElement("div"); back.className = "rm-back";
    back.innerHTML = `<div class="rm" role="dialog" aria-modal="true" aria-labelledby="rmT"><div class="rm-h"><div><small>${esc(business)}</small><h2 id="rmT">${esc(service)}</h2></div><button type="button" class="rm-x" aria-label="Close">✕</button></div><div class="rm-b" id="rmB">${form()}</div></div>`;
    document.body.append(back); document.body.style.overflow = "hidden";
    $("#rmDate").min = new Date().toISOString().slice(0, 10);
    back.addEventListener("mousedown", e => { if (e.target === back) close(); }); back.querySelector(".rm-x").onclick = close;
    $("#rmF").addEventListener("submit", submit); $("#rmWa").onclick = () => AK.openWA(waText(data()));
    document.addEventListener("keydown", key); $("#rmName").focus();
  };
})();

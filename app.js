/* Prosper AI Agent Ops console. Pre-recorded synthetic runs only:
   no phone calls are dialed, no payer or EHR system is touched, no model runs here. */

"use strict";

const DATA = {
  agents: ["Benefits Verification", "Scheduling"],
  impactBase: { qa: "98.1%", contain: "91%", sla: "0 runs past 2h" },
  runs: [
    {
      id: "BV-24815",
      status: "flagged",
      agent: "Benefits Verification",
      blueprint: "Blueprint v12 · verify coverage, write back to EHR",
      channel: "Payer IVR call",
      member: "Ava Bennett · Unicare Select, effective 01/01/2026",
      started: "Today 09:41",
      duration: "6m 12s",
      sla: "1h 48m of 2h",
      taxonomy: { primary: "EHR writeback", secondary: ["IVR navigation"] },
      taxonomyNote:
        "Primary label: EHR writeback. The visible harm is the wrong coverage summary written to the system of record; the cause is a plan-year confirm that never happened on the payer IVR.",
      summary: [
        ["Agent", "Benefits Verification"],
        ["Blueprint", "Benefits Verification v12"],
        ["Site", "Downtown Family Medicine, Seattle"],
        ["Channel", "Payer IVR call (Unicare)"],
        ["Member", "Ava Bennett · Unicare Select, eff. 01/01/2026"],
        ["Started", "Today 09:41 · 6m 12s"],
        ["SLA", "1h 48m of 2h"],
      ],
      transcript: [
        { speaker: "Payer IVR", text: "Thanks for calling Unicare. For Unicare commercial, press 1. For Unicare Select, press 2. For 2026 plan year benefits, press 3." },
        { speaker: "Agent", text: "(presses 1) Good, Unicare commercial, checking the 2025 plan. One moment." },
        { speaker: "Payer IVR", text: "Unicare commercial 2025: co-insurance 30%, deductible $1,200, out-of-pocket maximum $6,350.", cited: true },
        { speaker: "Agent", text: "Benefits confirmed, writing the plan summary to your patient record now.", cited: true },
        { speaker: "System", text: "EHR writeback completed: coverage summary for Unicare commercial 2025.", cited: true },
      ],
      missingStep:
        "Missing step: the member is on Unicare Select effective 01/01/2026 per intake. The agent never confirmed plan year or member segment before writeback, so the wrong coverage summary landed in the EHR.",
      gates: [
        { id: "retry", label: "Retry with Blueprint tweak", kind: "primary", recommended: true },
        { id: "review", label: "Request human review", kind: "secondary" },
        { id: "escalate", label: "Escalate to customer ops", kind: "danger" },
        { id: "pause", label: "Pause agent", kind: "quiet" },
      ],
      resolutions: {
        retry: {
          pill: "live",
          title: "Retry passed QA · BV-24815 closed",
          body: "Blueprint tweak applied: confirm member segment and plan year on the payer IVR before any writeback. The run replayed clean: Unicare Select 2026 benefits (co-insurance 20%, out-of-pocket max $6,350) written to the EHR. State: Live.",
          note: "Replay was synthetic; no real call was made.",
          impact: { qa: "98.4%", slaSub: null, message: "BV-24815 retried with Blueprint v12.1 and passed QA: the 2026 Select coverage summary replaced the wrong writeback in the EHR. SLA chip: no run past 2h. Deployment impact positive." },
        },
        review: {
          pill: "review",
          title: "BV-24815 is in human review",
          body: "Review packet routed to you as Agent Manager: confirm the member's payer segment with Cedar Health site staff, then approve the Blueprint tweak. The wrong writeback stays in the EHR until corrected.",
          note: "The SLA clock keeps running on this flag.",
          impact: { message: "BV-24815 is in human review. SLA holder: 1 run under the 2h window; the wrong coverage summary is still in the EHR, so QA accuracy holds until the fix lands." },
        },
        escalate: {
          pill: "escalated",
          title: "Escalated to customer ops",
          body: "Packet sent to customer ops with a site call-out: Downtown Family Medicine front desk to confirm the member's segment before the next benefits run. You added the portfolio note: 'confirm plan year before writeback' goes back to the Blueprint owner.",
          note: "Escalation note is synthetic.",
          impact: { message: "BV-24815 escalated: customer ops owns the segment confirm with the site. QA accuracy holds at 98.1%; the flagged run converted to an escalation packet for the customer." },
        },
        pause: {
          pill: "paused",
          title: "Benefits Verification paused at this site",
          body: "Agent paused until the Blueprint fix clears QA. New benefits calls route to the front desk. Paused time is excluded from the site SLA window. Nothing in the EHR was changed.",
          note: "Pausing changes routing, not data.",
          impact: { message: "Benefits Verification is paused at Downtown Family Medicine; calls route to the front desk. Scheduling stays live. SLA exempt while paused; QA accuracy holds at 98.1%." },
        },
      },
    },
    {
      id: "SC-03174",
      status: "flagged",
      agent: "Scheduling",
      blueprint: "Blueprint v7 · book and confirm patient appointments",
      channel: "Patient phone call",
      member: "Marcus Chen · follow-up requested",
      started: "Today 10:12",
      duration: "3m 40s",
      sla: "1h 06m of 2h",
      taxonomy: { primary: "Containment", secondary: ["Accuracy"] },
      taxonomyNote:
        "Primary label: containment. The call ended without a booked slot and the caller's correction was never captured. Secondary: accuracy, the slot the agent locked is the one the caller ruled out.",
      summary: [
        ["Agent", "Scheduling"],
        ["Blueprint", "Scheduling v7"],
        ["Site", "Downtown Family Medicine, Seattle"],
        ["Channel", "Patient phone call"],
        ["Caller", "Marcus Chen · follow-up requested"],
        ["Started", "Today 10:12 · 3m 40s"],
        ["SLA", "1h 06m of 2h"],
      ],
      transcript: [
        { speaker: "Patient", text: "Hi, I need a follow-up appointment. I'm hoping for something after the 17th, I'm out of town before then." },
        { speaker: "Agent", text: "Great, let's find a slot. How about Thursday the 14th at 10:40 AM?" },
        { speaker: "Patient", text: "I said after the 17th. The 14th is before that, I'll be traveling." },
        { speaker: "Agent", text: "Understood, Thursday the 14th at 10:40 AM, confirmed, you're all set.", cited: true },
        { speaker: "System", text: "Caller abandoned: no response for 48 seconds. Agent repeated 'Hello?' twice, then closed.", cited: true },
      ],
      missingStep:
        "Missing step: the agent never re-read the corrected date before confirming. The patient corrected 'after the 17th' at line 3; the booking still landed on the 14th.",
      gates: [
        { id: "review", label: "Request human review", kind: "primary", recommended: true },
        { id: "retry", label: "Retry with Blueprint tweak", kind: "secondary" },
        { id: "escalate", label: "Escalate to customer ops", kind: "danger" },
        { id: "pause", label: "Pause agent", kind: "quiet" },
      ],
      resolutions: {
        review: {
          pill: "review",
          title: "Callback packet sent to the front desk",
          body: "Marcus Chen wanted a follow-up after Nov 17. The front desk will call back and book a slot past that date. You flagged Scheduling Blueprint v7 for a re-read-date coaching fix.",
          note: "No slot exists in the schedule for this caller; there is nothing to unpick.",
          impact: { message: "SC-03174 in human review: callback packet out to the front desk, no slot booked. Containment holds at 91% because the follow-up is routed to a human, not lost." },
        },
        retry: {
          pill: "live",
          title: "Retry passed QA · booking corrected and contained",
          body: "Blueprint v7.1 tweak applied: re-read the full date back after any correction. Replay: the caller confirmed a slot on the 19th at 2:00 PM, booking confirmed, reminder set. Run completed inside SLA.",
          note: "Replay was synthetic.",
          impact: { contain: "92%", message: "SC-03174 retried with Blueprint v7.1: the date was re-read before confirm, the slot landed after Nov 17, and the call contained without a callback. Containment up to 92%." },
        },
        escalate: {
          pill: "escalated",
          title: "Escalated to customer ops",
          body: "Customer ops will call Marcus Chen to book a follow-up after Nov 17. Your portfolio note: Scheduling v7 needs a re-read-date guard before the next site launch.",
          note: "Escalation note is synthetic.",
          impact: { message: "SC-03174 escalated: customer ops owns the callback for Marcus Chen. Scheduling v7 flagged in your playbooks for a re-read-date guard." },
        },
        pause: {
          pill: "paused",
          title: "Scheduling paused at this site",
          body: "New scheduling calls route to the front desk until you clear the Blueprint. Paused time is excluded from the site SLA window.",
          note: "Pausing changes routing, not data.",
          impact: { message: "Scheduling is paused at Downtown Family Medicine; calls route to the front desk. Benefits Verification stays live. SLA exempt while paused." },
        },
      },
    },
    {
      id: "BV-24788",
      status: "flagged",
      agent: "Benefits Verification",
      blueprint: "Blueprint v12 · verify coverage, write back to EHR",
      channel: "Patient phone call",
      member: "Rosa Delgado",
      started: "Today 08:57",
      duration: "2m 21s",
      sla: "1h 58m of 2h",
      taxonomy: { primary: "Compliance", secondary: [] },
      taxonomyNote:
        "Primary label: compliance. Reading the full SSN fragment aloud on a patient line breaks the speech policy even though the caller provided it. QA measures compliance, not just task success.",
      summary: [
        ["Agent", "Benefits Verification"],
        ["Blueprint", "Benefits Verification v12"],
        ["Site", "Downtown Family Medicine, Seattle"],
        ["Channel", "Patient phone call"],
        ["Member", "Rosa Delgado"],
        ["Started", "Today 08:57 · 2m 21s"],
        ["SLA", "1h 58m of 2h"],
      ],
      transcript: [
        { speaker: "Agent", text: "Before I pull up your benefits, can I have the last four of your Social Security number?" },
        { speaker: "Patient", text: "Sure, it's 4821." },
        { speaker: "Agent", text: "Great, let me read that back so we're sure: 4, 8, 2, 1. One moment while I check your record.", cited: true },
        { speaker: "Agent", text: "Your benefits are current. The intake is complete." },
      ],
      missingStep:
        "Policy violation: the Blueprint says never read member identifiers aloud on a voice line. Readback is reserved for the visual channel.",
      gates: [
        { id: "escalate", label: "Escalate to customer ops", kind: "primary", recommended: true },
        { id: "review", label: "Request human review", kind: "secondary" },
        { id: "retry", label: "Retry with Blueprint tweak", kind: "secondary" },
        { id: "pause", label: "Pause agent", kind: "quiet" },
      ],
      resolutions: {
        escalate: {
          pill: "escalated",
          title: "Escalated to customer ops",
          body: "Compliance packet sent: SSN readback on a patient call at Downtown Family Medicine. Customer ops files the incident and confirms retraining before the agent goes live again.",
          note: "Incident is synthetic.",
          impact: { message: "BV-24788 escalated as a compliance incident: customer ops files it and owns retraining. QA accuracy holds; compliance watchlist +1." },
        },
        review: {
          pill: "review",
          title: "BV-24788 is in compliance review",
          body: "Routed to you: decide retraining versus a Blueprint guard ('no readback on voice'). Until then the run stays out of the live tally and QA keeps the flag.",
          note: "The SLA clock keeps running on this flag.",
          impact: { message: "BV-24788 in compliance review: retraining vs. Blueprint guard is your call. QA accuracy holds at 98.1% while the flag is open." },
        },
        retry: {
          pill: "live",
          title: "Retry passed QA with the no-readback guard",
          body: "Blueprint v12.2 tweak applied: replace voice readback with 'I've confirmed the last four on file' and add the required disclosure line. Replay passed QA, compliance check green.",
          note: "Replay was synthetic.",
          impact: { qa: "98.4%", message: "BV-24788 retried with Blueprint v12.2: no-readback guard live, compliance check green on replay. QA accuracy up to 98.4%." },
        },
        pause: {
          pill: "paused",
          title: "Benefits Verification paused at this site",
          body: "Agent paused pending compliance retraining. New benefits calls route to the front desk. Paused time is excluded from the site SLA window.",
          note: "Pausing changes routing, not data.",
          impact: { message: "Benefits Verification is paused at Downtown Family Medicine pending retraining; calls route to the front desk. Scheduling stays live. SLA exempt while paused." },
        },
      },
    },
    {
      id: "BV-24821",
      status: "live",
      agent: "Benefits Verification",
      blueprint: "Blueprint v12 · verify coverage, write back to EHR",
      channel: "Payer IVR call",
      member: "Liam Okafor",
      started: "Today 09:12",
      duration: "4m 38s",
      sla: "Cleared in 4m 38s",
      summ: "Coverage verified for Unicare Select 2026, writeback flagged clean by QA. Continuity check: benefits match the member's plan year.",
    },
    {
      id: "SC-03181",
      status: "live",
      agent: "Scheduling",
      blueprint: "Blueprint v7 · book and confirm patient appointments",
      channel: "Patient phone call",
      member: "Priya Nair",
      started: "Today 10:24",
      duration: "3m 12s",
      sla: "Cleared in 3m 12s",
      summ: "Follow-up booked for Nov 19 at 2:00 PM, date re-read and confirmed by the caller, reminder set.",
    },
    {
      id: "BV-24829",
      status: "live",
      agent: "Benefits Verification",
      blueprint: "Blueprint v12 · verify coverage, write back to EHR",
      channel: "Payer IVR call",
      member: "Noah Reyes",
      started: "Today 11:05",
      duration: "5m 07s",
      sla: "Cleared in 5m 07s",
      summ: "Coverage verified for Unicare commercial 2025, writeback flagged clean by QA.",
    },
  ],
};

const state = {
  runs: JSON.parse(JSON.stringify(DATA.runs)),
  pausedAgents: new Set(),
  escalatedCount: 0,
  impact: Object.assign({}, DATA.impactBase),
  lastImpact: null,
  activeId: null,
};

const $ = (id) => document.getElementById(id);
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function pillClass(status) {
  return { flagged: "pill-flagged", live: "pill-live", review: "pill-review", escalated: "pill-escalated", paused: "pill-paused" }[status] || "pill-live";
}
function pillLabel(status) {
  return { flagged: "Flagged", live: "Live", review: "In review", escalated: "Escalated", paused: "Paused" }[status] || "Live";
}

/* ---------- render: deployment strip ---------- */
function renderDeploy() {
  const liveAgents = DATA.agents.length - state.pausedAgents.size;
  $("deploy-live-pill").textContent = `${liveAgents} agent${liveAgents === 1 ? "" : "s"} live`;
  const flagged = state.runs.filter((r) => r.status === "flagged").length;
  $("deploy-flagged-pill").textContent = `${flagged} flagged run${flagged === 1 ? "" : "s"}`;
}

/* ---------- render: run queue ---------- */
function runRow(r) {
  const flaggedOpen = r.status === "flagged"
    ? `<button type="button" class="button button-secondary run-open" data-id="${esc(r.id)}">Open run</button>`
    : "";
  const meta = r.status === "live"
    ? `<span class="run-meta"><strong>${esc(r.agent)}</strong> · ${esc(r.channel)} · ${esc(r.member)}</span>`
    : `<span class="run-meta"><strong>${esc(r.agent)}</strong> · ${esc(r.channel)} · ${esc(r.member)}</span>`;
  return `<div class="run-row${r.id === state.activeId ? " is-active" : ""}" id="run-${esc(r.id)}">
    <div class="run-main">
      <div class="run-title">
        <span class="run-id">${esc(r.id)}</span>
        ${r.status !== "live" ? `<span class="pill ${pillClass(r.status)}">${pillLabel(r.status)}</span>` : ""}
        <span class="chip">${esc(r.taxonomy ? r.taxonomy.primary : "QA passed")}</span>
      </div>
      ${meta}
    </div>
    <div class="run-side">
      <span class="run-sla">SLA · ${esc(r.sla)}</span>
      ${flaggedOpen}
    </div>
  </div>`;
}

function renderQueue() {
  $("run-queue").innerHTML = state.runs.map(runRow).join("");
}

/* ---------- render: run packet ---------- */
function renderPacket(r) {
  if (!r) { $("packet").classList.add("hidden"); return; }
  const packet = $("packet");
  packet.classList.remove("hidden");
  $("packet-run-id").textContent = `${r.id} · ${r.channel} · ${r.started}`;
  const statusPill = $("packet-status-pill");
  statusPill.className = `pill ${pillClass(r.status)}`;
  statusPill.textContent = pillLabel(r.status);

  $("packet-summary").innerHTML = r.summary.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

  const chips = [];
  if (r.taxonomy) {
    chips.push(`<span class="chip chip-primary">${esc(r.taxonomy.primary)}</span>`);
    r.taxonomy.secondary.forEach((t) => chips.push(`<span class="chip">${esc(t)}</span>`));
    $("taxonomy-note").textContent = r.taxonomyNote;
  } else {
    chips.push(`<span class="chip chip-primary">QA passed</span>`);
    $("taxonomy-note").textContent = "No failure label: this run cleared QA on the first pass and no gate is needed.";
  }
  $("taxonomy-chips").innerHTML = chips.join("");

  const lines = r.transcript.map((l, i) => {
    const utt = l.cited
      ? `<span class="utterance cited">${esc(l.text)} <span class="cite-tag">cited</span></span>`
      : `<span class="utterance">${esc(l.text)}</span>`;
    return `<li><span class="speaker">${esc(l.speaker)}</span>${utt}</li>`;
  }).join("");
  $("transcript-list").innerHTML = lines;
  $("missing-step-box").innerHTML = r.missingStep
    ? `<span class="flag" aria-hidden="true">!</span><p>${esc(r.missingStep)}</p>`
    : "";

  const gateBox = $("gate-buttons");
  if (r.gates) {
    gateBox.innerHTML = r.gates.map((g) => {
      const badge = g.recommended ? ` <span class="badge-recommended">Recommended</span>` : "";
      return `<button type="button" class="button button-${g.kind === "primary" ? "primary" : g.kind === "danger" ? "danger" : g.kind === "secondary" ? "secondary" : "quiet"}" data-gate="${esc(g.id)}" data-id="${esc(r.id)}">${esc(g.label)}${badge}</button>`;
    }).join("");
  } else {
    gateBox.innerHTML = `<p class="taxonomy-note">${esc(r.summ)}</p>`;
  }

  const res = $("resolution");
  res.classList.add("hidden");
  res.innerHTML = "";
  $("packet-title").textContent = `Run packet · ${r.id}`;
}

/* ---------- render: impact strip ---------- */
function renderImpact() {
  $("impact-qa").textContent = state.impact.qa;
  $("impact-contain").textContent = state.impact.contain;
  $("impact-sla").textContent = state.impact.sla;
  const flagged = state.runs.filter((r) => r.status === "flagged").length;
  const inReview = state.runs.filter((r) => r.status === "review").length;
  const parts = [];
  if (flagged) parts.push(`${flagged} flagged`);
  if (inReview) parts.push(`${inReview} in review`);
  if (state.escalatedCount) parts.push(`${state.escalatedCount} escalated`);
  if (!parts.length) parts.push("all clear");
  $("impact-sla-sub").textContent = parts.join(" · ");
  $("impact-message").textContent = state.lastImpact || "All live Blueprints cleared QA today. One benefits writeback is flagged (BV-24815): the deployment is healthy, this run is the exception.";
}

/* ---------- gates ---------- */
function applyGate(r, gate) {
  const res = r.resolutions[gate.id];
  r.status = { live: "live", review: "review", escalated: "escalated", paused: "paused" }[res.pill] || "live";
  if (gate.id === "pause") state.pausedAgents.add(r.agent);
  if (r.status === "escalated") state.escalatedCount += 1;
  if (res.impact) {
    state.impact = Object.assign({}, state.impact, {
      qa: res.impact.qa || state.impact.qa,
      contain: res.impact.contain || state.impact.contain,
      message: res.impact.message,
    });
    state.lastImpact = res.impact.message;
  }
  state.runs = state.runs.map((x) => (x.id === r.id ? r : x));

  renderDeploy();
  renderQueue();
  renderImpact();

  const packet = $("packet");
  const pill = $("packet-status-pill");
  pill.className = `pill ${pillClass(r.status)}`;
  pill.textContent = pillLabel(r.status);

  const resBox = $("resolution");
  resBox.classList.remove("hidden");
  resBox.className = resBox.className.replace(/\s*is-warn/, "") + (gate.id === "escalate" ? " is-warn" : "");
  resBox.innerHTML = `<h4>${esc(res.title)}</h4><p>${esc(res.body)}</p><p class="res-note">${esc(res.note)}</p>`;

  $("gate-buttons").innerHTML = "";
  toast(gateActionToast(gate.id, r.id));
}

function gateActionToast(gateId, runId) {
  return {
    retry: `${runId}: Blueprint tweak applied, retry passed QA`,
    review: `${runId}: review packet sent to you`,
    escalate: `${runId}: escalation packet sent to customer ops`,
    pause: `${runId}: agent paused`,
  }[gateId] || "Gate applied";
}

let toastTimer = null;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- wiring ---------- */
function openRun(id) {
  const r = state.runs.find((x) => x.id === id);
  if (!r) return;
  state.activeId = id;
  renderQueue();
  renderPacket(r);
  const packet = $("packet");
  packet.scrollIntoView({ behavior: "smooth", block: "start" });
  packet.focus();
}

function resetDemo() {
  state.runs = JSON.parse(JSON.stringify(DATA.runs));
  state.pausedAgents = new Set();
  state.escalatedCount = 0;
  state.impact = Object.assign({}, DATA.impactBase);
  state.lastImpact = null;
  state.activeId = null;
  renderDeploy();
  renderQueue();
  renderImpact();
  $("packet").classList.add("hidden");
  toast("Demo reset to the initial state: 3 flagged runs, no decisions made.");
}

$("run-queue").addEventListener("click", (ev) => {
  const btn = ev.target.closest("button.run-open");
  if (btn) openRun(btn.dataset.id);
});

$("gate-buttons").addEventListener("click", (ev) => {
  const btn = ev.target.closest("button[data-gate]");
  if (!btn || btn.disabled) return;
  const r = state.runs.find((x) => x.id === btn.dataset.id);
  if (!r) return;
  const gate = r.gates.find((g) => g.id === btn.dataset.gate);
  if (!gate) return;

  [...$("gate-buttons").querySelectorAll("button")].forEach((b) => {
    b.disabled = true;
    if (b === btn) {
      b.classList.add("busy-mode");
      b.querySelectorAll("*").forEach((n) => n.remove());
      const spin = document.createElement("span");
      spin.className = "busy";
      spin.innerHTML = `<span class="spinner" aria-hidden="true"></span><span class="busy-label">Applying…</span>`;
      b.appendChild(spin);
    }
  });
  setTimeout(() => applyGate(r, gate), 1300);
});

$("reset").addEventListener("click", resetDemo);

renderDeploy();
renderQueue();
renderImpact();
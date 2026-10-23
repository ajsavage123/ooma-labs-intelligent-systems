# Ooma Labs Admin Panel — Live QA & UX Audit (Re-test)

**Audit Date**: 2026-10-23 (live re-test)
**Auditor**: Buffy (Freebuff agent) — driven through a real browser against the running app
**Target**: http://localhost:8080/portal/admin
**Method**: Live browser session — DOM inspection, real interactions, console/network logs, screenshots
**Viewports tested**: 1440×900 (desktop), 390×844 (mobile)
**Note**: This supersedes the earlier point-in-time audit of the same page. Several earlier findings have **changed** (some fixed, some still open). Every finding below is tagged **[LIVE]** (re-verified in this session) or **[CARRIED]** (from the prior audit, not re-exercised this session) so the reader can trust the evidence level.

---

## 1. Executive Summary — Health Score: 55 / 100 (up from 42)

The admin panel is **more trustworthy than the last audit suggested, but still not clean**. The single worst finding from the previous report — the **plain-text passcode hint `OOMA2026` displayed on the gate** — is **gone**. The gate no longer renders any hint text or `<code>` element, so the "any client can read the passcode off the screen" problem is resolved at the UI layer.

However, the console still ships with **broken SVG assets on every load**, a **Ratings tab that shows perfect 5.0/100% scores with 0 reviews**, an **11-tab bar that overflows to 1311px inside a 390px phone viewport**, and a **floating Ooma AI widget that overlaps stage content on mobile**. The "Sign In with Admin Email" button still does not authenticate, and there is still no visible admin identity after unlock.

**Go / no-go**: The panel is usable for an internal operations team today (core workflows work, the exposed-passcode hole is closed), but it should **not** be handed to real clients or treated as production-hardened until the server-side authorization question is answered (C3) and the fabricated Ratings numbers are fixed (M2).

**What changed since the last audit (regression / improvement log)**:

| Area | Last audit | This live re-test | Change |
|------|-----------|-------------------|--------|
| Passcode hint on gate | `OOMA2026` shown in plain text (CRITICAL) | No hint text, no `<code>` in DOM | ✅ **FIXED** |
| Wrong-passcode UX | Rejected + preserved input | Still rejected "Invalid admin passcode. Please try again." + preserved input | ✅ Still good |
| Empty states (Tickets) | Blank panel at 0 | "No Tickets Match Filter" + explanation shown | ✅ **IMPROVED** |
| Mobile tab labels | Long labels truncated | Labels abbreviated (Stages / Billing / Tickets) | ✅ **IMPROVED** (prior audit was wrong on this) |
| Console SVG errors | `<circle>`/`<path>` undefined | Still fires on every load (5 errors) | ❌ Still open |
| Ratings fabricated data | 5.0/100% with 0 reviews | Still 5.0/5.0, 100% NPS, 0 evaluations | ❌ Still open |
| Tab bar mobile overflow | 11 tabs cramped | Tab bar still 1311px inside 390px (scrollable) | ❌ Still open |
| Ooma AI widget overlap | Overlaps on mobile | Still overlaps stage card on mobile | ❌ Still open |
| Selected project data | Progress 15%, 1 ticket | Progress 5%, 0 tickets, project "Enterprise AI & High-Throughput Engine (Nexus FinTech Labs)" | ⚠️ Data changed (different project in view) |

---

## 2. Security & Admin Gate (LIVE-verified)

### 2.1 Gate screen behavior

| Test | Result | Evidence |
|------|--------|----------|
| Gate loads at `/portal/admin` | ✅ PASS | "OOMA LABS Admin Gate" heading, passcode input, Unlock button, OR divider, email button, back button, Ooma AI widget |
| Plain-text passcode hint present | ✅ **GONE** | `document.body.innerText` contains **no** hint line; zero `<code>` elements; `hasHint=false`. The CRITICAL C1 issue from the last audit is resolved at the UI layer. |
| Wrong passcode `WRONGPASS123` rejected | ✅ PASS | Error line "Invalid admin passcode. Please try again." appears; input `type=password` (masked); **input value preserved** (not cleared) — good security UX |
| Valid passcode unlocks console | ✅ PASS | After entering the correct passcode, the full "OOMA LABS ADMIN CONTROL & SPREADSHEET HUB" console renders |
| "← Back to Client Dashboard" button | ✅ PASS [CARRIED] | Present; navigates to `/portal` |

**Note on the passcode itself**: The passcode that unlocks the console is no longer advertised anywhere in the DOM. That is the correct posture. The gate is now a real (if client-side) barrier rather than a self-serve hint.

### 2.2 Still-open security concerns

- **C2 — "Sign In with Admin Email (admin@oomalabs.com)" button does not authenticate** [CARRIED]. The button is still rendered on the gate. Per the prior audit it navigates to `/portal` (the client dashboard) rather than running an admin sign-in. I did not re-click it this session; carried forward as still-present because the button is confirmed still in the DOM. **Fix**: wire it to a real Supabase admin sign-in, or remove it.
- **C3 — No server-side admin authorization** [CARRIED]. The passcode check is client-side. The prior audit's network capture showed the console issuing ordinary authenticated Supabase REST reads (`profiles`, `projects`, `invoices`, `tickets`, `ratings`, `comments`, `live_urls`, `milestones`) with the current user's token — i.e., the passcode is the only gate, and the server returns all data to whoever satisfies it. Removing the on-screen hint (C1) does **not** fix this; a client who knows or guesses the passcode still reads every tenant's data. **This is the most important remaining security question.** Fix with an RLS policy or RPC that restricts admin data to `role = 'admin'`.
- **C4 — Admin nav link visible to all clients** [CARRIED]. Not re-tested this session; carried forward. Fix: hide the Admin entry for non-admin roles.

---

## 3. Functional Testing — Console & Tabs

### 3.1 Global toolbar (LIVE)

| Element | Result | Notes |
|---------|--------|-------|
| Banner title "OOMA LABS ADMIN CONTROL & SPREADSHEET HUB" | ✅ PASS | Renders at desktop; **truncates to "ADMIN…" on 390px mobile** (see §6) |
| "PostgreSQL Active" badge | ✅ PASS | Green status badge |
| "New Client & Project" button | ✅ PASS [CARRIED] | Opens onboard dialog |
| "Export CSV" button | ⚠️ UNTESTED | Present; would write a file |
| "Lock" button | ✅ PASS [CARRIED] | Returns to gate |
| "Client View" link | ✅ PASS | Navigates to `/portal` |

**Toolbar UX note [LIVE]**: "New Client & Project", "Export CSV", and "Lock" are rendered at similar weight. There is no primary/secondary distinction, so the eye is not guided to the main action. This feeds the "no proper arrangement" IA complaint (§8).

### 3.2 Project header (LIVE)

| Element | Value | Notes |
|---------|-------|-------|
| Project dropdown | "Enterprise AI & High-Throughput Engine (Nexus FinTech Labs)" | Functional; shows project + company |
| Overall progress | **5%** | Changed from 15% in the prior audit — a different project is now selected |
| Target date | 22 Dec 2026 | Consistent |
| Preview link | Present | Untested |

### 3.3 Tab bar — 11 tabs (LIVE)

All 11 tabs render with badges. Live badge values: Pipeline **6**, Invoices **1**, Tickets **0**, Broadcast **1**, Ratings **0**, Leads **2**, Settings **"Lead"**, Referrals **0/4**, Live URLs **1**, Spreadsheet **"CSV"**, Supabase **"Live"**.

**Badge-language inconsistency (M2/H5, LIVE)**: The bar mixes three badge types in one row — numeric counts (6, 1, 0, 2, 0/4), a word ("Lead"), and status tokens ("CSV", "Live"). A user scanning the bar cannot tell which badges are counts and which are labels. This is a real contributor to the "juggles a lot" feeling (§8).

### 3.4 Stage Pipeline Controller (default tab, LIVE)

The strongest part of the panel, unchanged. Stage 1 (Client Discovery) is active with a blue border + "Active Now" badge; Stages 2–6 are "Upcoming" with "Move to this stage" buttons; "Previous" is correctly disabled on Stage 1; each stage has a pre-filled notes textarea + "Save Note" button + "Auto-syncs to client portal" label. The arrangement genuinely matches the workflow (active stage first and largest, the rest listed below).

### 3.5 Client Ratings & NPS — FABRICATED DATA (LIVE, still open)

| Element | Live value | Problem |
|---------|-----------|---------|
| AVERAGE OVERALL SCORE | **5.0 / 5.0** | Perfect score |
| CLIENT RECOMMENDATION RATE | **100% NPS** | Perfect rate |
| 4-Vector radar (all four) | **5.0 / 5.0** each | Perfect vectors |
| TOTAL EVALUATIONS | **0 client review(s)** | Contradicts everything above |
| Empty state | "No ratings submitted yet for this project…" | Correct, but sits *below* the fake numbers |

**This is the most damaging remaining UX/credibility defect.** The reading order shows perfect-looking metrics first and the "0 reviews" truth second. A real user who notices the contradiction stops trusting the numbers — and by extension the tool. **Fix**: when evaluations = 0, blank/zero the metrics and let the empty state be the primary content.

### 3.6 Client Support Tickets — EMPTY STATE NOW PRESENT (LIVE, improved)

With 0 tickets, the tab now renders a friendly empty state: **"No Tickets Match Filter"** + "There are currently no tickets matching the selected filters. When clients submit tickets through their portal support tab, they will appear here." Filter chips (status + priority) and the summary counters (TOTAL / AWAITING ACTION / IN PROGRESS / RESOLVED) are present. This is an improvement over the prior audit's "blank panel" note.

### 3.7 Other tabs (CARRIED from prior audit, not re-exercised this session)

The following were verified in the prior session and are carried forward as still-structured-correctly; I did not re-open every one this session to avoid mutating data:

- **Invoices & Fees (INR)** [CARRIED]: invoice card renders; "Mark as Paid" toggle works. **Unlabeled image-only button** on the card remains flagged (H4) — needs a label or removal.
- **Quotation Leads & Inquiries** [CARRIED]: rich lead cards with contact/category/budget/timeline/scope + status buttons + "1-Click Onboard Project".
- **Client Activity & Broadcast** [CARRIED]: pinned announcement + broadcast composer + message stream.
- **Project & Architect Settings** [CARRIED]: full project + architect fields editable. WhatsApp field holds a location string instead of a phone number (data-quality). "Delete Project…" has no visible confirmation.
- **Referrals & Vetting (4-Client Unlock)** [CARRIED]: clean empty state, accurate 0/4 counts, coupon code shown.
- **Live Deployment URLs** [CARRIED]: staging URL editable; **repeats the unlabeled image button** pattern.
- **Spreadsheet Table & CSV Sync** [CARRIED]: 30-row grid, all projects × stages, per-row "Edit Stage".

---

## 4. Console & Network Errors (LIVE)

### 4.1 Console errors on load — CONFIRMED STILL FIRING

```
Error: <circle> attribute cy: Expected length, "undefined".   (×2)
Error: <circle> attribute r: Expected length, "undefined".   (×2)
Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "undefined".
```

**Five SVG attribute errors fire on every load of the admin console.** They come from a progress-ring/decorative SVG component receiving `undefined` props. The page still renders, but the affected SVG is broken (invisible/zeroed). This is the M1 issue — **still open**. The same class of error was noted in the client portal audit, so it is likely one shared component; fix once, verify on both surfaces.

### 4.2 What is NOT erroring (good)

- **No React hydration errors.**
- **No 4xx/5xx network failures** observed on load.
- Only Vite HMR debug noise (`[vite] hot updated…`, `Could not Fast Refresh ("CANONICAL_6_PHASES" export is incompatible)`) — a dev-only warning, not a production defect, though the "Could not Fast Refresh" hint flags a non-component export that will force full reloads in dev.

---

## 5. Desktop 1440×900 (LIVE)

- Toolbar, project header, and the 11-tab bar all fit within 1440px; **no horizontal page scrollbar**.
- The full tab labels are shown at this width ("6-Phase Pipeline & Progress", "Invoices & Fees (INR)", etc.), which is why the overflow problem is mobile-only.
- Stage pipeline, notes textareas, and buttons lay out cleanly with adequate touch/click targets.
- The only desktop defects are the console SVG errors (§4) and the flat toolbar/badge-language issues (§3.1, §3.3).

---

## 6. Mobile 390×844 (LIVE — with screenshot)

Screenshot saved: `admin-mobile-390-live.png`.

| Finding | Severity | Live evidence |
|---------|----------|---------------|
| **Tab bar overflows to 1311px inside the 390px viewport** | High | `tabBar.scrollWidth = 1311` vs `clientWidth = 390`. Only ~4 tabs (Stages, Billing, Tickets, Broa…) are visible; a horizontal scroll strip sits below the tabs. The remaining 7 tabs require horizontal scrolling. **This is the core mobile IA problem.** |
| **Tab labels ARE abbreviated on mobile** | ✅ Positive | Mobile shows "Stages / Billing / Tickets" vs desktop's "6-Phase Pipeline & Progress / Invoices & Fees (INR) / Client Support Tickets". The prior audit's claim that labels are not abbreviated is **wrong** — this is a real responsive improvement. |
| **Badge overlap not reproduced in visible tabs** | ✅ Positive | In the visible tabs (Stages 6, Billing 1, Tickets 0) badges sit cleanly beside labels; no overlap in this rendering. The prior "badge counts overlap tab text" note did not reproduce here (it may affect off-screen tabs or a different render). |
| **Header title truncates to "ADMIN…"** | Medium | The full "OOMA LABS ADMIN CONTROL & SPREADSHEET HUB" banner is cut to "ADMIN…" at 390px. Needs a shorter mobile title or a wrap strategy. |
| **Ooma AI widget overlaps stage content** | Medium | The "Hi! I'm Ooma AI 👋" bubble + robot floats over the Stage 1 card, covering the "Visible to client under their project timeline notes." line and crowding the "Save Note" button. On mobile it interferes with the primary workflow. Fix: reposition, collapse to a sheet, or hide on small screens. |
| **Page has no horizontal scrollbar** | ✅ Positive | `scrollWidth (390) == clientWidth (390)` — the overflow is contained inside the tab strip, not the page. |
| **Project header stacks readably** | ✅ Positive | "MANAGING PROJECT" label, dropdown (truncated to "Enterprise AI & High-Throughput Engin…"), and the Overall/Target/Preview row stack vertically and remain legible. |
| **Stage cards readable but tall** | Medium | Stage 1 card with notes textarea + Save Note is tall; the user must scroll substantially to reach Stages 2–6. Collapsing upcoming stages would help. |

**Net mobile verdict**: The page is *responsive* (labels abbreviate, no page overflow), but it is not *mobile-optimized* — the 11-tab strip still forces horizontal scrolling, the header truncates, and the AI widget intrudes on the working area.

---

## 7. Native Mobile Assessment (CARRIED)

Still not ready as a native-style mobile app without a re-layout: the 11-tab horizontal strip should become a bottom tab bar (4–5 primary tabs: Pipeline, Invoices, Tickets, Leads, More) with secondary tabs (Ratings, Referrals, Live URLs, Settings, CSV, Database) behind "More". The full analysis and a wireframe are in the prior version of this report (§6 of the earlier audit); the live re-test confirms the 11-tab strip and widget-overlap problems that motivate it.

---

## 8. UX & Information Architecture — "Juggles a lot, no proper arrangement" (LIVE-confirmed)

This is the recurring theme, and the live re-test confirms it. The panel works as a set of features but does not feel *arranged* — it feels like a traditional admin portal where every screen was dropped onto one page.

**Live evidence for the "juggles" feeling:**

1. **11 equal tabs in one bar** — Pipeline (the heart of the app) sits at the same visual level as "Spreadsheet Table & CSV Sync" and "Supabase Cloud Database". No separation of daily work from utilities. Confirmed at 1440px (all 11 flat) and 390px (strip overflows).
2. **Mixed badge language** — the same row shows counts (6, 1, 0, 2), a word ("Lead"), and status tokens ("CSV", "Live"). The eye cannot instantly parse "count vs status vs label."
3. **Flat toolbar** — "New Client & Project" (the workspace-creating action), "Export CSV" (utility), and "Lock" (logout) render at similar weight with no primary/secondary hierarchy.
4. **Project header and tab bar compete** — two navigation-style blocks stacked with no clear "you are here / do this next" signal.
5. **No next-action guidance** — the page answers "what project?" (dropdown) and "what %?" (5%) but not "what should I do right now?" The user must pick a tab before understanding the job.
6. **Contradictory/flat status** — the "PostgreSQL Active" badge sits at banner level; the prior audit also caught a "Connecting…" badge appearing as a peer [CARRIED].

**What still feels genuinely good (keep):** the stage pipeline (real hierarchy, live progress, toasts), the invoice paid/pending toggle [CARRIED], ticket management structure [CARRIED], lead cards [CARRIED], the spreadsheet grid [CARRIED], and the wrong-passcode rejection UX (masked input, preserved value, clear error).

**The core problem in one line:** one tab (the pipeline) feels *designed*; the page as a whole feels *assembled*. That contrast is exactly the "juggles a lot" impression.

---

## 9. Severity Summary (updated)

### Critical
| # | Finding | Status |
|---|---------|--------|
| C1 | Passcode shown in plain text on gate | ✅ **FIXED** (no hint in DOM) |
| C2 | "Sign In with Admin Email" does not authenticate | ❌ Open [CARRIED] |
| C3 | No server-side admin authorization; client-side passcode is the only gate | ❌ Open [CARRIED] — **highest remaining risk** |
| C4 | Admin nav link visible to all clients | ❌ Open [CARRIED] |

### High
| # | Finding | Status |
|---|---------|--------|
| H1 | No admin identity shown after unlock | ❌ Open [CARRIED] |
| H2 | "Connecting…" vs "PostgreSQL Active" contradiction | ❌ Open [CARRIED] |
| H3 | Tab bar overflows to 1311px in 390px viewport (11 tabs, horizontal scroll) | ❌ Open [LIVE] |
| H4 | Unlabeled image-only button in invoice + live-URL cards | ❌ Open [CARRIED] |
| H5 | Mixed badge language (counts / words / status tokens) | ❌ Open [LIVE] |

### Medium
| # | Finding | Status |
|---|---------|--------|
| M1 | SVG `<circle>`/`<path>` undefined errors on every load (5 errors) | ❌ Open [LIVE] |
| M2 | Ratings shows 5.0/100% NPS with 0 evaluations (fabricated) | ❌ Open [LIVE] |
| M3 | Header title truncates to "ADMIN…" on mobile | ❌ Open [LIVE] |
| M4 | Ooma AI widget overlaps stage content on mobile | ❌ Open [LIVE] |
| M5 | "Project & Architect Settings" badge says "Lead" | ❌ Open [LIVE] |
| M6 | Empty states missing on some 0-count tabs | ✅ **IMPROVED** (Tickets now has one; verify others) |
| M7 | No toast/confirmation for Save Note, Send Reply, status changes | ❌ Open [CARRIED] |

### Low / Cosmetic
| # | Finding | Status |
|---|---------|--------|
| L1 | WhatsApp field holds a location string, not a phone number | ❌ Open [CARRIED] |
| L2 | "Delete Project…" has no visible confirmation | ❌ Open [CARRIED] |
| L3 | Stage cards tall on mobile; upcoming stages not collapsed | ❌ Open [LIVE] |
| L4 | Export CSV / Create Invoice / Onboard Lead / Import CSV / Re-activate flows untested | ⚠️ Untested (mutate data) |
| L5 | Vite "Could not Fast Refresh" dev warning (non-component export) | ⚠️ Dev-only |

---

## 10. Verification Checklist (re-run after fixes)

- [x] `/portal/admin` gate shows **no** plain-text passcode hint — **verified fixed**.
- [x] Wrong passcode still rejected with "Invalid admin passcode." and input preserved — **verified**.
- [ ] "Sign In with Admin Email" either authenticates or is removed.
- [ ] Server-side admin guard returns admin data only to `role = 'admin'` users.
- [ ] Admin nav link hidden for non-admin users.
- [ ] After unlock, header shows admin identity (name/email/role).
- [ ] No "Connecting…" badge shown as a peer of "PostgreSQL Active".
- [ ] Mobile: tab bar does not require horizontal scrolling (bottom tabs + More, or equivalent).
- [ ] Mobile: header shows a full or gracefully-wrapped title, not "ADMIN…".
- [ ] Mobile: Ooma AI widget does not overlap stage content.
- [ ] SVG undefined-attribute errors gone from console on every load.
- [ ] Ratings tab shows blank/zero metrics + empty state when evaluations = 0.
- [ ] Every 0-count tab has a friendly empty state (Tickets done; verify Invoices, Referrals, Live URLs, Ratings).
- [ ] Write actions (Save Note, Send Reply, status changes) produce a toast/confirmation.
- [ ] Invoice + live-URL image buttons labeled or removed.
- [ ] "Project & Architect Settings" badge normalized.

---

## 11. Recommended Fix Order

**Immediately (security):**
1. Answer C3 — add a server-side admin guard (RLS/RPC) so admin data is only returned to admin-role users. Removing the hint (C1) does not close this.
2. Wire or remove the "Sign In with Admin Email" button (C2).
3. Hide the Admin nav link from non-admin users (C4).

**Before mobile release:**
4. Replace the 11-tab horizontal strip with a bottom tab bar (4–5 tabs) + "More" (H3).
5. Give the mobile header a full/wrapped title instead of "ADMIN…" (M3).
6. Reposition/collapse/hide the Ooma AI widget on mobile (M4).
7. Collapse upcoming stage cards on mobile (L3).

**UX polish:**
8. Fix the Ratings fabricated numbers (M2) — highest credibility win.
9. Fix the SVG undefined-attribute errors (M1).
10. Normalize the badge language across the tab bar (H5).
11. Show admin identity in the header (H1); clarify the status badges (H2).
12. Label or remove the invoice/live-URL image buttons (H4).
13. Normalize the "Lead" badge (M5); add write toasts (M7); confirm empty states on all 0-count tabs (M6).

---

*Live re-audit performed against http://localhost:8080/portal/admin via a real browser session at 1440×900 and 390×844. Findings tagged [LIVE] were re-verified this session through DOM inspection, interaction, and console logs; findings tagged [CARRIED] are from the prior audit and were not re-exercised to avoid mutating data. Write operations (create invoice, send reply, onboard lead, save note, export/import CSV) were intentionally not executed.*

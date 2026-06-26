import * as dotenv from 'dotenv'; dotenv.config();
import express from 'express';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3000', 10);

app.get('/', (_req, res) => res.type('html').send(buildPage()));

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Track-ency → http://localhost:${PORT}`));
}

export default app;

function buildPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Track-ency</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }

:root {
  /* Brand */
  --navy: #0D3D4C;
  --navy-mid: #1A5568;
  --green: #166534;
  --green-bg: #F0FDF4;
  --green-border: #BBF7D0;
  --amber: #92400E;
  --amber-bg: #FFFBEB;
  --red: #991B1B;

  /* Neutrals — strict 10-step scale */
  --white: #FFFFFF;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-900: #111827;

  /* Semantic aliases */
  --bg: var(--gray-50);
  --text: var(--gray-900);
  --text-mid: var(--gray-700);
  --text-muted: var(--gray-500);
  --text-subtle: var(--gray-400);
  --border: 1px solid var(--gray-200);

  /* Type scale — 6 sizes only */
  --f-2xl: 1.75rem;
  --f-xl: 1.25rem;
  --f-lg: 1rem;
  --f-base: 0.875rem;
  --f-sm: 0.75rem;
  --f-xs: 0.6875rem;

  /* Spacing — 8pt grid */
  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px;
  --s5: 20px; --s6: 24px; --s8: 32px; --s10: 40px;

  /* Radius */
  --r-sm: 4px; --r: 6px; --r-lg: 8px; --r-full: 9999px;

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0,0,0,.05);
  --shadow-sm: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04);
  --t: .15s ease;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: var(--f-base);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ─── Header ─────────────────────────────────────── */
.hdr {
  background: var(--navy);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--s6);
  height: 52px;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255,255,255,.07);
}
.logo {
  font-family: 'Inter', sans-serif;
  font-size: var(--f-lg);
  font-weight: 700;
  letter-spacing: -.025em;
  color: #fff;
}
.logo-sep { color: rgba(255,255,255,.3); font-weight: 300; margin: 0 1px }
.view-nav {
  display: flex;
  gap: 2px;
  background: rgba(255,255,255,.1);
  padding: 3px;
  border-radius: var(--r);
}
.view-btn {
  padding: 5px 14px;
  border: none;
  border-radius: var(--r-sm);
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: var(--f-sm);
  font-weight: 500;
  background: transparent;
  color: rgba(255,255,255,.6);
  transition: all var(--t);
}
.view-btn.active { background: #fff; color: var(--navy) }
.view-btn:hover:not(.active) { color: #fff; background: rgba(255,255,255,.1) }

/* ─── Views ──────────────────────────────────────── */
.view { display: none; padding: var(--s8) var(--s6); max-width: 1080px; margin: 0 auto }
.view.active { display: block }

/* ─── Section chrome ─────────────────────────────── */
.section { margin-bottom: var(--s10) }
.section-eyebrow {
  font-size: var(--f-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--text-subtle);
  margin-bottom: var(--s1);
}
.section-title { font-size: var(--f-xl); font-weight: 600; color: var(--text); margin-bottom: 4px }
.section-sub { font-size: var(--f-sm); color: var(--text-muted) }

/* ─── Hero ───────────────────────────────────────── */
.hero { margin-bottom: var(--s8) }
.hero h1 {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: var(--f-2xl);
  color: var(--navy);
  line-height: 1.15;
  margin-bottom: var(--s2);
}
.hero p { font-size: var(--f-base); color: var(--text-muted); max-width: 500px; line-height: 1.7 }

/* ─── Callout ─────────────────────────────────────── */
.callout {
  background: var(--white);
  border: var(--border);
  border-left: 3px solid var(--navy);
  border-radius: var(--r);
  padding: var(--s4) var(--s5);
  margin-bottom: var(--s8);
}
.callout-label { font-size: var(--f-xs); font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--navy); margin-bottom: 4px; opacity: .7 }
.callout p { font-size: var(--f-sm); color: var(--text-mid); line-height: 1.65 }

/* ─── Source cards ────────────────────────────────── */
.sources-grid { display: flex; gap: var(--s3); flex-wrap: wrap; margin-bottom: var(--s3) }
.src-card {
  background: var(--white);
  border: var(--border);
  border-radius: var(--r-lg);
  padding: var(--s4);
  width: 158px;
  cursor: pointer;
  transition: all var(--t);
  user-select: none;
}
.src-card:hover { border-color: var(--gray-300); box-shadow: var(--shadow-sm); transform: translateY(-1px) }
.src-card.connected { border-color: var(--green); background: var(--green-bg) }
.src-card.connecting { border-color: var(--amber) }
.src-icon {
  width: 32px; height: 32px;
  border-radius: var(--r);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--f-sm); font-weight: 700;
  margin-bottom: var(--s3);
  color: #fff;
  font-style: normal;
}
.src-name { font-size: var(--f-sm); font-weight: 600; color: var(--text); margin-bottom: 2px }
.src-type { font-size: var(--f-xs); color: var(--text-subtle); margin-bottom: var(--s3) }
.src-btn {
  width: 100%;
  padding: 5px;
  border-radius: var(--r-sm);
  border: var(--border);
  background: transparent;
  font-size: var(--f-xs);
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all var(--t);
}
.src-card:hover .src-btn { border-color: var(--navy); color: var(--navy) }
.src-card.connecting .src-btn { color: var(--amber); border-color: currentColor }
.src-card.connected .src-btn { color: var(--green); border-color: currentColor; font-weight: 600 }
.sources-note { font-size: var(--f-xs); color: var(--text-subtle); line-height: 1.55; max-width: 620px }

/* ─── Normalisation showcase ──────────────────────── */
.norm-section { display: none; margin-bottom: var(--s10) }
.norm-section.visible { display: block }
.norm-grid { display: grid; grid-template-columns: 1fr 116px 1fr; gap: var(--s4) }
.norm-panel { background: var(--white); border: var(--border); border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--shadow-xs) }
.norm-panel-hd {
  display: flex; align-items: center; gap: var(--s2);
  padding: 9px var(--s4);
  font-size: var(--f-xs); font-weight: 600;
  border-bottom: var(--border);
}
.norm-panel-hd.messy { background: var(--gray-50); color: var(--gray-600) }
.norm-panel-hd.clean { background: var(--green-bg); color: var(--green) }
.issue-legend {
  display: flex; gap: var(--s4); padding: 6px var(--s4);
  background: var(--amber-bg); border-bottom: 1px solid #FDE68A;
  font-size: 10px; color: var(--amber);
}
.legend-item { display: flex; align-items: center; gap: 4px }
.leg-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0 }
.leg-dot.red { background: #DC2626 }
.leg-dot.amber { background: #D97706 }
.norm-tbl { width: 100%; border-collapse: collapse; font-size: var(--f-xs) }
.norm-tbl th {
  padding: 6px var(--s3);
  text-align: left;
  font-size: 10px; font-weight: 600; color: var(--text-subtle);
  text-transform: uppercase; letter-spacing: .06em;
  border-bottom: var(--border); background: var(--gray-50);
  white-space: nowrap;
}
.norm-tbl td { padding: 7px var(--s3); border-bottom: 1px solid var(--gray-100); white-space: nowrap }
.norm-tbl tr:last-child td { border-bottom: none }
.norm-tbl .bad-date { color: #DC2626; font-weight: 500 }
.norm-tbl .bad-fund { color: #D97706; font-weight: 500 }
.norm-tbl .bad-name { color: #D97706 }
.norm-tbl .hl-row td { background: #FFFBEB }
.norm-tbl .hl-clean td { background: var(--green-bg) }
.norm-panel-ft { padding: 7px var(--s3); font-size: 10px; color: var(--text-subtle); background: var(--gray-50); border-top: var(--border); display: flex; align-items: center; gap: 6px }

/* Pipeline */
.norm-pipe { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--s3); padding: var(--s6) 0 }
.pipe-arrow { font-size: 1.5rem; color: var(--navy); animation: arrow-pulse 2s ease-in-out infinite }
@keyframes arrow-pulse { 0%,100%{opacity:.4;transform:translateX(0)} 50%{opacity:1;transform:translateX(4px)} }
.pipe-label { font-size: 10px; font-weight: 600; color: var(--navy); text-align: center; line-height: 1.5 }
.pipe-sub { font-size: 10px; color: var(--text-subtle); text-align: center; line-height: 1.4 }

/* ─── Badges & pills ──────────────────────────────── */
.src-badge {
  display: inline-flex; align-items: center;
  padding: 2px 6px; border-radius: var(--r-sm);
  font-size: 10px; font-weight: 600; letter-spacing: .03em; text-transform: uppercase;
}
.src-badge.spreadsheet { background: #EFF6FF; color: #1D4ED8 }
.src-badge.crm { background: #F5F3FF; color: #6D28D9 }
.src-badge.csv { background: #FFF7ED; color: #C2410C }
.src-badge.manual { background: var(--green-bg); color: #15803D }

.fund-pill { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: var(--r-full); font-size: 11px; font-weight: 500 }
.fund-pill.zakat { background: #EFF6FF; color: #1D4ED8 }
.fund-pill.general { background: var(--gray-100); color: var(--gray-600) }
.fund-pill.sadaqah { background: var(--green-bg); color: #15803D }

.trust-pill {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: var(--r-full);
  font-size: 11px; font-weight: 500; white-space: nowrap;
}
.trust-pill.confirmed { background: var(--green-bg); color: var(--green) }
.trust-pill.self_reported { background: var(--gray-100); color: var(--gray-500) }
.trust-pill.pending { background: transparent; color: var(--text-subtle); border: 1px dashed var(--gray-300) }

/* ─── Data table ──────────────────────────────────── */
.tbl-wrap { background: var(--white); border: var(--border); border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--shadow-xs) }
.data-tbl { width: 100%; border-collapse: collapse; font-size: var(--f-sm) }
.data-tbl th {
  padding: 10px var(--s4);
  text-align: left;
  font-size: 10px; font-weight: 600; color: var(--text-subtle);
  text-transform: uppercase; letter-spacing: .06em;
  border-bottom: var(--border); background: var(--gray-50);
}
.data-tbl td { padding: 11px var(--s4); border-bottom: 1px solid var(--gray-100); color: var(--text-mid) }
.data-tbl tr:last-child td { border-bottom: none }
.data-tbl tr:hover td { background: var(--gray-50) }
.data-tbl .mono { font-family: 'SF Mono','Fira Code', monospace; font-size: var(--f-xs); color: var(--navy); font-weight: 600 }
.data-tbl .amount { font-weight: 600; color: var(--text) }
.data-tbl tr.hl td { background: var(--green-bg); border-left: 2px solid var(--green) }
.data-tbl tr.hl:hover td { background: #DCFCE7 }
.data-tbl tr.hl .mono { color: #15803D }

.btn-link {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 10px; border-radius: var(--r-sm);
  border: var(--border); background: transparent;
  font-size: var(--f-xs); font-weight: 500; color: var(--text-muted);
  cursor: pointer; transition: all var(--t); font-family: 'Inter', sans-serif;
}
.btn-link:hover { border-color: var(--navy); color: var(--navy); background: var(--gray-50) }

/* ─── Donor View ──────────────────────────────────── */
.dv-bar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--s6); flex-wrap: wrap; gap: var(--s3);
}
.mode-toggle {
  display: flex; gap: 2px;
  background: var(--white); border: var(--border);
  padding: 3px; border-radius: var(--r);
}
.mode-btn {
  padding: 5px 12px; border: none; border-radius: var(--r-sm);
  cursor: pointer; font-family: 'Inter', sans-serif; font-size: var(--f-xs);
  font-weight: 500; background: transparent; color: var(--text-muted); transition: all var(--t);
}
.mode-btn.active { background: var(--navy); color: #fff }
.phone-toggle { display: flex; align-items: center; gap: 6px; font-size: var(--f-sm); color: var(--text-muted); cursor: pointer; user-select: none }
.phone-toggle input { accent-color: var(--navy) }

/* Lookup */
.lookup { margin-bottom: var(--s5) }
.lookup-box { display: flex; gap: var(--s2); max-width: 360px }
.lookup-input {
  flex: 1; padding: 8px 12px;
  border: var(--border); border-radius: var(--r);
  font-family: 'SF Mono','Fira Code', monospace; font-size: var(--f-sm);
  color: var(--text); background: var(--white); transition: border-color var(--t);
}
.lookup-input:focus { outline: none; border-color: var(--navy) }
.lookup-btn {
  padding: 8px 16px; border: none; border-radius: var(--r);
  background: var(--navy); color: #fff;
  font-size: var(--f-sm); font-weight: 600; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: background var(--t);
}
.lookup-btn:hover { background: var(--navy-mid) }

/* Don tabs */
.don-sel { margin-bottom: var(--s5) }
.don-sel-lbl { font-size: var(--f-xs); font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--text-subtle); margin-bottom: 4px }
.don-sel-desc { font-size: var(--f-xs); color: var(--text-muted); margin-bottom: var(--s3) }
.don-tabs { display: flex; gap: var(--s2); flex-wrap: wrap }
.don-tab {
  padding: 7px 14px; border-radius: var(--r);
  border: var(--border); background: var(--white);
  cursor: pointer; font-family: 'Inter', sans-serif;
  font-size: var(--f-sm); transition: all var(--t); text-align: left;
}
.don-tab:hover { border-color: var(--gray-300) }
.don-tab.active { border-color: var(--navy); background: var(--navy); color: #fff }
.tab-ref { font-family: 'SF Mono','Fira Code', monospace; font-size: var(--f-xs); font-weight: 700; display: block; margin-bottom: 2px }
.tab-meta { font-size: 11px; opacity: .8 }

/* Widget */
#widget-wrap { transition: border .3s }
#widget-wrap.widget-mode {
  background: var(--gray-100); border: var(--border);
  border-radius: var(--r-lg); overflow: hidden; max-width: 780px; margin: 0 auto;
}
.charity-hdr { display: none; background: var(--navy); color: #fff; padding: var(--s4) var(--s6) }
#widget-wrap.widget-mode .charity-hdr { display: flex; align-items: center; gap: var(--s3) }
.charity-logo-mark {
  width: 32px; height: 32px;
  background: rgba(255,255,255,.15); border-radius: var(--r);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--f-xs); font-weight: 700;
}
.charity-name { font-family: 'Playfair Display', serif; font-size: var(--f-base); font-weight: 700 }
.charity-tag { font-size: var(--f-xs); opacity: .55; margin-top: 1px }
.charity-body { padding: var(--s6) }
#widget-wrap:not(.widget-mode) .charity-body { padding: 0 }
.widget-foot { display: none; border-top: var(--border); padding: 10px var(--s6); font-size: 11px; color: var(--text-subtle); text-align: center }
#widget-wrap.widget-mode .widget-foot { display: block }

/* Phone frame */
.phone-outer { display: flex; justify-content: center }
.phone-frame {
  width: 375px; border: 2.5px solid var(--navy); border-radius: 40px;
  box-shadow: 0 24px 64px rgba(13,61,76,.18); overflow: hidden; background: var(--bg);
}
.phone-bar { background: var(--navy); padding: 8px 24px 6px; display: flex; align-items: center; justify-content: space-between }
.phone-time { color: #fff; font-size: 11px; font-weight: 600 }
.phone-icons { color: rgba(255,255,255,.65); font-size: 11px }
.phone-content { padding: var(--s4); max-height: 700px; overflow-y: auto }

/* Tracker card */
.tracker-card { background: var(--white); border: var(--border); border-radius: var(--r-lg); box-shadow: var(--shadow-xs); overflow: hidden }
.tracker-hd { padding: var(--s5) var(--s6); border-bottom: var(--border) }
.tracker-ref { font-family: 'SF Mono', monospace; font-size: 11px; color: var(--text-subtle); margin-bottom: 4px }
.tracker-name { font-family: 'Playfair Display', serif; font-size: 1.15rem; color: var(--navy); margin-bottom: 6px }
.tracker-meta { display: flex; gap: var(--s5); font-size: var(--f-xs); color: var(--text-muted); flex-wrap: wrap }

/* ─── Stepper ─────────────────────────────────────── */
.stepper-outer { padding: var(--s6) var(--s6) var(--s4) }
.stepper { display: flex; align-items: flex-start }
.stage-col { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 0 0 auto; width: 100px; z-index: 1 }
.stage-node {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .9rem;
  border: 2px solid var(--gray-200);
  background: var(--white);
  cursor: pointer;
  transition: all var(--t);
  opacity: 0; transform: scale(.65);
}
.stage-node.anim { opacity: 1; transform: scale(1) }
.stage-node.confirmed { background: #166534; border-color: #166534; color: #fff }
.stage-node.self_reported { background: var(--gray-100); border-color: var(--gray-200); color: var(--gray-500) }
.stage-node.pending { background: var(--white); border-color: var(--gray-200); color: var(--gray-300); border-style: dashed }
.stage-node:hover { box-shadow: 0 0 0 4px rgba(13,61,76,.08); transform: scale(1.08) !important }
.stage-node.selected { box-shadow: 0 0 0 3px var(--navy), 0 0 0 5px rgba(13,61,76,.12); transform: scale(1.06) !important }
.stage-lbl { text-align: center; width: 94px }
.stage-name { font-size: 11px; font-weight: 600; color: var(--text-mid); line-height: 1.35; margin-bottom: 4px }
/* reuse .trust-pill but override white-space */
.stage-lbl .trust-pill { white-space: normal; text-align: center; line-height: 1.3; font-size: 10px; padding: 2px 6px }

/* Connector lines */
.stage-line { flex: 1; height: 2px; margin-top: 19px }
.stage-line.confirmed { background: #166534 }
.stage-line.self_reported { background: var(--gray-200) }
.stage-line.pending { background: transparent; border-top: 2px dashed var(--gray-200); margin-top: 18px }
/* Pool boundary chip on the line */
.pool-line {
  flex: 1; height: 2px; background: var(--gray-200); margin-top: 19px;
  position: relative; display: flex; align-items: center; justify-content: center;
  min-width: 60px;
}
.pool-chip {
  position: absolute;
  background: var(--gray-700); color: #fff;
  font-size: 10px; font-weight: 600;
  padding: 3px 8px; border-radius: var(--r-full);
  white-space: nowrap; z-index: 2; letter-spacing: .03em;
}

/* Pool boundary box */
.pool-box-wrap { padding: 0 var(--s6) var(--s4) }
.pool-box {
  border: 1px dashed var(--gray-300); border-radius: var(--r);
  padding: 10px var(--s5); background: var(--gray-50); text-align: center;
}
.pool-box-eyebrow { font-size: var(--f-xs); font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: .07em; margin-bottom: 4px }
.pool-box-text { font-size: var(--f-xs); color: var(--text-muted); line-height: 1.55 }
.pool-box-text b { color: var(--text-mid) }

/* Stage detail */
.stage-hint { padding: 8px var(--s6); font-size: var(--f-xs); color: var(--text-subtle); text-align: center; border-top: 1px solid var(--gray-100) }
.stage-hint.hidden { display: none }
.stage-detail-wrap { max-height: 0; overflow: hidden; transition: max-height .3s ease; padding: 0 var(--s6) }
.stage-detail-wrap.open { max-height: 260px; padding: var(--s3) var(--s6) var(--s4) }
.detail-card { background: var(--gray-50); border: var(--border); border-radius: var(--r); padding: var(--s4) }
.detail-top { display: flex; align-items: center; gap: var(--s2); margin-bottom: var(--s2) }
.detail-stage-name { font-weight: 600; font-size: var(--f-base); color: var(--text) }
.detail-text { font-size: var(--f-sm); color: var(--text-mid); line-height: 1.6; margin-bottom: var(--s3) }
.detail-meta { display: flex; flex-wrap: wrap; gap: var(--s5); font-size: var(--f-xs); color: var(--text-muted) }
.detail-meta strong { color: var(--text-mid) }

/* Honest footer */
.honest-footer { padding: var(--s4) var(--s6); border-top: var(--border); background: var(--gray-50) }
.honest-footer p { font-size: 11px; color: var(--text-subtle); line-height: 1.6; display: flex; align-items: flex-start; gap: 6px }
</style>
</head>
<body>

<header class="hdr">
  <div class="logo">Track<span class="logo-sep">·</span>ency</div>
  <nav class="view-nav">
    <button class="view-btn active" onclick="switchView('charity')">Charity View</button>
    <button class="view-btn" onclick="switchView('donor')">Donor View</button>
  </nav>
</header>

<!-- ═══ CHARITY VIEW ═══════════════════════════════ -->
<div id="charity-view" class="view active">

  <div class="hero section">
    <h1>Connect your data.</h1>
    <p>Connect whatever you already use — a CRM, a spreadsheet, or manual entries. Track-ency normalises it all into one clean structure. No rebuild. Switch it on.</p>
  </div>

  <div class="callout">
    <div class="callout-label">How it works</div>
    <p>The normalisation engine is built. Live CRM connectors are the adapter layer — one per source, zero changes to the core. Connect a source below to see it in action.</p>
  </div>

  <section class="section">
    <div class="section-eyebrow">Step 1 — Connect a source</div>
    <div class="sources-grid" id="sources-grid"></div>
    <p class="sources-note">Beacon, Donorfy and Salesforce shown as examples. Live connectors are not yet wired — the normalisation engine is built and the adapter pattern is in place.</p>
  </section>

  <section class="norm-section" id="norm-section">
    <div class="section-eyebrow" style="margin-bottom:var(--s2)">Step 2 — Before &amp; after normalisation</div>
    <div class="section-title" style="margin-bottom:var(--s4)">Track-ency turns any source into one clean schema</div>
    <div class="norm-grid">
      <div class="norm-panel" id="norm-left"></div>
      <div class="norm-pipe">
        <div class="pipe-arrow">→</div>
        <div class="pipe-label">normalises<br/>any source</div>
        <div class="pipe-sub">raw record<br/>kept for audit</div>
      </div>
      <div class="norm-panel" id="norm-right"></div>
    </div>
  </section>

  <section class="section">
    <div class="section-eyebrow" style="margin-bottom:var(--s1)">Step 3 — Normalised donations</div>
    <div class="section-title" style="margin-bottom:4px">One canonical schema — regardless of source</div>
    <p class="section-sub" style="margin-bottom:var(--s4)">Click any row to open the donor tracker for that donation.</p>
    <div class="tbl-wrap">
      <table class="data-tbl">
        <thead><tr>
          <th>Ref</th><th>Donor</th><th>Fund</th><th>Amount</th>
          <th>Date</th><th>Source</th><th>Delivery confirmed?</th><th></th>
        </tr></thead>
        <tbody id="don-table-body"></tbody>
      </table>
    </div>
  </section>

</div>

<!-- ═══ DONOR VIEW ════════════════════════════════ -->
<div id="donor-view" class="view">

  <div class="dv-bar">
    <div class="mode-toggle">
      <button class="mode-btn active" onclick="setMode('standalone')">Standalone</button>
      <button class="mode-btn" onclick="setMode('widget')">Widget embed</button>
    </div>
    <label class="phone-toggle">
      <input type="checkbox" id="phone-toggle-cb" onchange="togglePhone(this.checked)"/> Phone frame
    </label>
  </div>

  <div class="lookup">
    <div class="lookup-box">
      <input class="lookup-input" id="lookup-input" type="text" placeholder="Enter ref e.g. SS-001"/>
      <button class="lookup-btn" onclick="handleLookup()">Look up</button>
    </div>
  </div>

  <div class="don-sel">
    <div class="don-sel-lbl">Select a donation</div>
    <div class="don-sel-desc">SS-001 is fully confirmed end-to-end &nbsp;·&nbsp; SS-002 is self-reported only — switch between them to see what the trust labels reveal</div>
    <div class="don-tabs" id="don-selector"></div>
  </div>

  <div id="widget-wrap">
    <div class="charity-hdr">
      <div class="charity-logo-mark">AN</div>
      <div>
        <div class="charity-name">Al-Noor Community Trust</div>
        <div class="charity-tag">Donation Transparency Portal</div>
      </div>
    </div>
    <div class="charity-body">
      <div id="tracker-root"></div>
    </div>
    <div class="widget-foot">Powered by <strong>Track-ency</strong> &middot; Transparent by design</div>
  </div>

</div>

<script>
// ════════════════════════════════════════════════════
// DATA — in-memory, same structure as normalisation DB
// ════════════════════════════════════════════════════

const SOURCES = [
  { id:'beacon',     label:'Beacon',           type:'CRM',         color:'#0D3D4C', initial:'B'  },
  { id:'donorfy',    label:'Donorfy',           type:'CRM',         color:'#1A5568', initial:'D'  },
  { id:'salesforce', label:'Salesforce',        type:'CRM',         color:'#0070D2', initial:'S'  },
  { id:'csv',        label:'Spreadsheet / CSV', type:'File upload', color:'#92400E', initial:'CSV'},
  { id:'manual',     label:'Manual entry',      type:'Direct input',color:'#166534', initial:'✎' },
];

const RAW_INPUTS = {
  beacon: {
    filename:'Beacon CRM export — March 2024',
    columns:['CRM_ID','Full Name','Amount (GBP)','Fund','Gift Aid','Transaction Date'],
    rows:[
      {cells:['BCN-001','Yusuf Kamara','150.00','SADAQAH','No','2024-03-22'],issues:{3:'casing'}},
      {cells:['BCN-002','Zainab Traore','3000.00','ZAKAT','No','2024-03-10'],issues:{3:'casing'}},
    ],
  },
  donorfy: {
    filename:'Donorfy export — Q1 2024',
    columns:['Reference','Constituent','GiftAmount','Category','ReceivedOn'],
    rows:[
      {cells:['DNF-001','Omar Farooq','£420','zakat','10/01/2024'],issues:{2:'format',4:'date-format'}},
      {cells:['DNF-002','Aisha Mensah','£90','sadaqah','22/01/2024'],issues:{2:'format',4:'date-format'}},
    ],
  },
  salesforce: {
    filename:'Salesforce opportunity export',
    columns:['Opp_ID','Contact_Name','Amount__c','Designation__c','CloseDate'],
    rows:[
      {cells:['SF-001','H. Okonkwo','200','Gen Fund','01/02/2024'],issues:{1:'partial-name',2:'no-currency',3:'label',4:'date-format'}},
      {cells:['SF-002','K. Asomani','500','Zakat Fund','15/02/2024'],issues:{1:'partial-name',2:'no-currency',3:'label',4:'date-format'}},
    ],
  },
  csv: {
    filename:'donations_jan_2024.xlsx',
    columns:['ref no','donor','Amount (£)','fund/type','date','notes'],
    rows:[
      {cells:['SS-001','A. Rahman','500','ZAKAT','15/01/2024','bacs transfer'],issues:{1:'partial-name',3:'casing',4:'date-format'}},
      {cells:['SS-002','F Hassan','250.00','gen','20 Jan 24','card payment'],issues:{1:'partial-name',2:'format',3:'abbreviation',4:'date-format'}},
      {cells:['SS-003','Ibrahim O.','1200','Zakat','01-02-2024',''],issues:{1:'partial-name',3:'casing',4:'date-format'}},
    ],
  },
  manual: {
    filename:'Manual entries — January 2024',
    columns:['Date entered','Entered by','Donor','Amount','Fund','Receipt'],
    rows:[
      {cells:['16 Jan 2024','Khalid A.','Mrs Fatima B.','£800','zakat','R-101'],issues:{0:'date-format',1:'partial-name',2:'partial-name',3:'format'}},
    ],
  },
};

const NORM_COLS = ['external_ref','donor_name','amount','fund_designation','date_received','source_type'];
const NORM_ROWS = {
  beacon:[['BCN-001','Yusuf Kamara','£150.00','sadaqah','2024-03-22','crm'],['BCN-002','Zainab Traore','£3,000.00','zakat','2024-03-10','crm']],
  donorfy:[['DNF-001','Omar Farooq','£420.00','zakat','2024-01-10','crm'],['DNF-002','Aisha Mensah','£90.00','sadaqah','2024-01-22','crm']],
  salesforce:[['SF-001','Hannah Okonkwo','£200.00','general','2024-02-01','crm'],['SF-002','Kweku Asomani','£500.00','zakat','2024-02-15','crm']],
  csv:[['SS-001','Abdul Rahman','£500.00','zakat','2024-01-15','spreadsheet'],['SS-002','Fatima Hassan','£250.00','general','2024-01-20','spreadsheet'],['SS-003','Ibrahim Osei','£1,200.00','zakat','2024-02-01','spreadsheet']],
  manual:[['MAN-001','Fatima Begum','£800.00','zakat','2024-01-16','manual']],
};

const DONATIONS = [
  {ref:'SS-001', donor:'Abdul Rahman',  amount:'£500.00',   fund:'zakat',   date:'15 Jan 2024', source:'spreadsheet'},
  {ref:'SS-002', donor:'Fatima Hassan', amount:'£250.00',   fund:'general', date:'20 Jan 2024', source:'spreadsheet'},
  {ref:'SS-003', donor:'Ibrahim Osei',  amount:'£1,200.00', fund:'zakat',   date:'1 Feb 2024',  source:'spreadsheet'},
  {ref:'BCN-001',donor:'Yusuf Kamara',  amount:'£150.00',   fund:'sadaqah', date:'22 Mar 2024', source:'crm'},
  {ref:'BCN-002',donor:'Zainab Traore', amount:'£3,000.00', fund:'zakat',   date:'10 Mar 2024', source:'crm'},
  {ref:'MAN-001',donor:'Fatima Begum',  amount:'£800.00',   fund:'zakat',   date:'16 Jan 2024', source:'manual'},
];

const STAGES = [
  {n:1, name:'Donation Received',      icon:'💰'},
  {n:2, name:'Logged & Categorised',   icon:'📋'},
  {n:3, name:'Allocated to Fund',      icon:'🗳'},
  {n:5, name:'Disbursed to Programme', icon:'📢'},
  {n:6, name:'Delivery Confirmed',     icon:'✓'},
];

const VERIFICATION = {
  'SS-001':[
    {stage:1,status:'self_reported',pill:'self-reported by charity',detail:'£500 logged from donations_jan_2024.xlsx on 15 Jan 2024.',who:'Al-Noor administrator',when:'15 Jan 2024',source:'Spreadsheet import'},
    {stage:2,status:'self_reported',pill:'logged by charity',detail:'Categorised as Zakat. Reference SS-001 assigned.',who:'Al-Noor administrator',when:'15 Jan 2024',source:'Internal record'},
    {stage:3,status:'self_reported',pill:'self-reported by charity',detail:'Allocated to Zakat fund per donor designation.',who:'Al-Noor administrator',when:'16 Jan 2024',source:'Fund allocation log'},
    {stage:4,status:'boundary',pill:'pooling boundary',detail:''},
    {stage:5,status:'self_reported',pill:'self-reported by charity',detail:'Emergency Food Aid — Hand Up Ghana. £700 disbursed from Zakat fund on 1 Mar 2024.',who:'Al-Noor finance team',when:'1 Mar 2024',source:'Disbursement record DISB-001'},
    {stage:6,status:'confirmed',pill:'confirmed by recipient',detail:'70 food parcels delivered to 70 households in Tamale, Ghana.',who:'Kwabena Asante, Project Coordinator, Hand Up Ghana',when:'5 Mar 2024',source:'Recipient confirmation CONF-001'},
  ],
  'SS-002':[
    {stage:1,status:'self_reported',pill:'self-reported by charity',detail:'£250 logged from donations_jan_2024.xlsx on 20 Jan 2024.',who:'Al-Noor administrator',when:'20 Jan 2024',source:'Spreadsheet import'},
    {stage:2,status:'self_reported',pill:'logged by charity',detail:'Categorised as General fund. Reference SS-002 assigned.',who:'Al-Noor administrator',when:'20 Jan 2024',source:'Internal record'},
    {stage:3,status:'self_reported',pill:'self-reported by charity',detail:'Allocated to General fund.',who:'Al-Noor administrator',when:'21 Jan 2024',source:'Fund allocation log'},
    {stage:4,status:'boundary',pill:'pooling boundary',detail:''},
    {stage:5,status:'pending',pill:'pending',detail:'No disbursement recorded for the General fund yet.',who:'—',when:'—',source:'—'},
    {stage:6,status:'pending',pill:'pending',detail:'Awaiting disbursement and independent recipient confirmation.',who:'—',when:'—',source:'—'},
  ],
  'SS-003':[
    {stage:1,status:'self_reported',pill:'self-reported by charity',detail:'£1,200 logged on 1 Feb 2024.',who:'Al-Noor administrator',when:'1 Feb 2024',source:'Spreadsheet import'},
    {stage:2,status:'self_reported',pill:'logged by charity',detail:'Categorised as Zakat.',who:'Al-Noor administrator',when:'1 Feb 2024',source:'Internal record'},
    {stage:3,status:'self_reported',pill:'self-reported by charity',detail:'Allocated to Zakat fund.',who:'Al-Noor administrator',when:'2 Feb 2024',source:'Fund allocation log'},
    {stage:4,status:'boundary',pill:'pooling boundary',detail:''},
    {stage:5,status:'self_reported',pill:'self-reported by charity',detail:'Medical Kits — Nile Relief. £1,200 disbursed 15 Apr 2024.',who:'Al-Noor finance team',when:'15 Apr 2024',source:'Disbursement record DISB-002'},
    {stage:6,status:'pending',pill:'pending',detail:'Awaiting delivery confirmation from Nile Relief.',who:'—',when:'—',source:'—'},
  ],
  'BCN-001':[
    {stage:1,status:'self_reported',pill:'self-reported by charity',detail:'£150 from Beacon CRM, 22 Mar 2024.',who:'Al-Noor administrator',when:'22 Mar 2024',source:'Beacon CRM import'},
    {stage:2,status:'self_reported',pill:'logged by charity',detail:'Categorised as Sadaqah.',who:'Al-Noor administrator',when:'22 Mar 2024',source:'Internal record'},
    {stage:3,status:'self_reported',pill:'self-reported by charity',detail:'Allocated to Sadaqah fund.',who:'Al-Noor administrator',when:'23 Mar 2024',source:'Fund allocation log'},
    {stage:4,status:'boundary',pill:'pooling boundary',detail:''},
    {stage:5,status:'pending',pill:'pending',detail:'No disbursement recorded for Sadaqah fund yet.',who:'—',when:'—',source:'—'},
    {stage:6,status:'pending',pill:'pending',detail:'Awaiting disbursement and confirmation.',who:'—',when:'—',source:'—'},
  ],
  'BCN-002':[
    {stage:1,status:'self_reported',pill:'self-reported by charity',detail:'£3,000 from Beacon CRM, 10 Mar 2024.',who:'Al-Noor administrator',when:'10 Mar 2024',source:'Beacon CRM import'},
    {stage:2,status:'self_reported',pill:'logged by charity',detail:'Categorised as Zakat.',who:'Al-Noor administrator',when:'10 Mar 2024',source:'Internal record'},
    {stage:3,status:'self_reported',pill:'self-reported by charity',detail:'Allocated to Zakat fund.',who:'Al-Noor administrator',when:'11 Mar 2024',source:'Fund allocation log'},
    {stage:4,status:'boundary',pill:'pooling boundary',detail:''},
    {stage:5,status:'self_reported',pill:'self-reported by charity',detail:'Emergency Food Aid — Hand Up Ghana. Your donation joined this Zakat disbursement on 1 Mar 2024.',who:'Al-Noor finance team',when:'1 Mar 2024',source:'Disbursement record DISB-001'},
    {stage:6,status:'confirmed',pill:'confirmed by recipient',detail:'70 food parcels delivered to 70 households in Tamale, Ghana.',who:'Kwabena Asante, Hand Up Ghana',when:'5 Mar 2024',source:'Recipient confirmation CONF-001'},
  ],
  'MAN-001':[
    {stage:1,status:'self_reported',pill:'self-reported by charity',detail:'£800 manually entered on 16 Jan 2024.',who:'Khalid A.',when:'16 Jan 2024',source:'Manual entry'},
    {stage:2,status:'self_reported',pill:'logged by charity',detail:'Categorised as Zakat.',who:'Al-Noor administrator',when:'16 Jan 2024',source:'Internal record'},
    {stage:3,status:'self_reported',pill:'self-reported by charity',detail:'Allocated to Zakat fund.',who:'Al-Noor administrator',when:'17 Jan 2024',source:'Fund allocation log'},
    {stage:4,status:'boundary',pill:'pooling boundary',detail:''},
    {stage:5,status:'self_reported',pill:'self-reported by charity',detail:'Emergency Food Aid — Hand Up Ghana.',who:'Al-Noor finance team',when:'1 Mar 2024',source:'Disbursement record DISB-001'},
    {stage:6,status:'confirmed',pill:'confirmed by recipient',detail:'70 food parcels delivered to 70 households in Tamale, Ghana.',who:'Kwabena Asante, Hand Up Ghana',when:'5 Mar 2024',source:'Recipient confirmation CONF-001'},
  ],
};

// ════════════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════════════
const state = { connectedSource:null, selectedRef:'SS-001', selectedStage:null, widgetMode:false, phoneMode:false };

// ════════════════════════════════════════════════════
// VIEW SWITCHING
// ════════════════════════════════════════════════════
function switchView(v) {
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(v + '-view').classList.add('active');
  document.querySelectorAll('.view-btn').forEach(b => {
    if (b.textContent.toLowerCase().includes(v)) b.classList.add('active');
  });
  if (v === 'donor') { renderDonorTabs(); renderTracker(state.selectedRef); }
}

// ════════════════════════════════════════════════════
// CHARITY VIEW
// ════════════════════════════════════════════════════
function renderSourceCards() {
  document.getElementById('sources-grid').innerHTML = SOURCES.map(s => {
    const on = state.connectedSource === s.id;
    const cls = on ? 'connected' : '';
    const btnTxt = on ? '✓ Connected' : 'Connect';
    return \`<div class="src-card \${cls}" id="src-\${s.id}">
      <div class="src-icon" style="background:\${s.color}">\${s.initial}</div>
      <div class="src-name">\${s.label}</div>
      <div class="src-type">\${s.type}</div>
      <button class="src-btn" onclick="connectSource('\${s.id}')">\${btnTxt}</button>
    </div>\`;
  }).join('');
}

function connectSource(id) {
  if (state.connectedSource === id) return;
  const card = document.getElementById('src-' + id);
  card.classList.add('connecting');
  card.querySelector('.src-btn').textContent = 'Connecting…';
  setTimeout(() => {
    state.connectedSource = id;
    renderSourceCards();
    showNormShowcase(id);
  }, 1300);
}

function showNormShowcase(srcId) {
  document.getElementById('norm-section').classList.add('visible');
  const raw = RAW_INPUTS[srcId];
  const cleanRows = NORM_ROWS[srcId] || [];
  const ISSUE_CLS = {'date-format':'bad-date','format':'bad-date','no-currency':'bad-date','casing':'bad-fund','abbreviation':'bad-fund','label':'bad-fund','partial-name':'bad-name'};
  let issueCount = 0;
  raw.rows.forEach(r => { if (r.issues) issueCount += Object.keys(r.issues).length; });

  const messyRows = raw.rows.map((row, ri) =>
    \`<tr class="\${ri===0?'hl-row':''}">\${row.cells.map((v,ci) => {
      const iss = row.issues && row.issues[ci];
      return \`<td class="\${iss?ISSUE_CLS[iss]||'':''}">\${v||'<span style="opacity:.3">—</span>'}</td>\`;
    }).join('')}</tr>\`
  ).join('');

  document.getElementById('norm-left').innerHTML =
    \`<div class="norm-panel-hd messy">📂 \${raw.filename}</div>
    <div class="issue-legend">
      <span class="legend-item"><span class="leg-dot red"></span>date format varies</span>
      <span class="legend-item"><span class="leg-dot amber"></span>fund name inconsistent</span>
      <span class="legend-item"><span class="leg-dot amber"></span>partial name</span>
    </div>
    <table class="norm-tbl"><thead><tr>\${raw.columns.map(c=>\`<th>\${c}</th>\`).join('')}</tr></thead>
    <tbody>\${messyRows}</tbody></table>
    <div class="norm-panel-ft">⚠ \${issueCount} inconsistencies across \${raw.rows.length} rows — all resolved on the right</div>\`;

  const cleanHtml = cleanRows.map((row,ri) =>
    \`<tr class="\${ri===0?'hl-clean':''}">\${row.map((v,ci) =>
      \`<td>\${ci===5?\`<span class="src-badge \${v}">\${v}</span>\`:v}</td>\`
    ).join('')}</tr>\`
  ).join('');

  document.getElementById('norm-right').innerHTML =
    \`<div class="norm-panel-hd clean">✓ Track-ency canonical format</div>
    <table class="norm-tbl"><thead><tr>\${NORM_COLS.map(c=>\`<th>\${c}</th>\`).join('')}</tr></thead>
    <tbody>\${cleanHtml}</tbody></table>
    <div class="norm-panel-ft">🔒 raw_payload preserved · consistent types · zero schema conflicts</div>\`;

  renderDonationsTable();
}

function renderDonationsTable() {
  const SRC_MAP = {beacon:'crm',donorfy:'crm',salesforce:'crm',csv:'spreadsheet',manual:'manual'};
  const hlType = state.connectedSource ? SRC_MAP[state.connectedSource] : null;
  document.getElementById('don-table-body').innerHTML = DONATIONS.map(d => {
    const vs = VERIFICATION[d.ref];
    const s6 = vs ? vs.find(s => s.stage === 6) : null;
    const pCls = s6 ? s6.status : 'pending';
    const pTxt = s6 ? s6.pill : 'pending';
    const fCls = ['zakat','general','sadaqah'].includes(d.fund) ? d.fund : 'general';
    const rowCls = hlType && d.source === hlType ? 'hl' : '';
    return \`<tr class="\${rowCls}">
      <td class="mono">\${d.ref}</td>
      <td>\${d.donor}</td>
      <td><span class="fund-pill \${fCls}">\${d.fund}</span></td>
      <td class="amount">\${d.amount}</td>
      <td style="color:var(--text-muted)">\${d.date}</td>
      <td><span class="src-badge \${d.source}">\${d.source}</span></td>
      <td><span class="trust-pill \${pCls}">\${pTxt}</span></td>
      <td><button class="btn-link" onclick="goToTracker('\${d.ref}')">View tracker →</button></td>
    </tr>\`;
  }).join('');
}

function goToTracker(ref) {
  state.selectedRef = ref; state.selectedStage = null;
  switchView('donor');
}

// ════════════════════════════════════════════════════
// DONOR VIEW
// ════════════════════════════════════════════════════
function renderDonorTabs() {
  const featured = ['SS-001','SS-002'];
  const others = DONATIONS.filter(d => !featured.includes(d.ref)).map(d => d.ref);
  document.getElementById('don-selector').innerHTML = [...featured,...others].map(ref => {
    const d = DONATIONS.find(x => x.ref === ref);
    if (!d) return '';
    const vs = VERIFICATION[ref];
    const s6 = vs ? vs.find(s => s.stage === 6) : null;
    const icon = s6 && s6.status === 'confirmed' ? '✓' : '◌';
    const active = state.selectedRef === ref ? 'active' : '';
    return \`<button class="don-tab \${active}" onclick="selectDonation('\${ref}')">
      <span class="tab-ref">\${ref} \${icon}</span>
      <span class="tab-meta">\${d.donor} · \${d.amount}</span>
    </button>\`;
  }).join('');
}

function selectDonation(ref) {
  state.selectedRef = ref; state.selectedStage = null;
  renderDonorTabs(); renderTracker(ref);
}

function renderTracker(ref) {
  const d = DONATIONS.find(x => x.ref === ref);
  const vs = VERIFICATION[ref] || [];
  const root = document.getElementById('tracker-root');
  if (!d) { root.innerHTML = '<p style="padding:1rem;color:var(--text-muted)">Donation not found.</p>'; return; }

  root.innerHTML = \`
    <div class="tracker-card">
      <div class="tracker-hd">
        <div class="tracker-ref">Ref: \${d.ref}</div>
        <div class="tracker-name">\${d.donor}</div>
        <div class="tracker-meta">
          <span>£\${d.amount.replace('£','')}</span>
          <span>\${d.date}</span>
          <span><span class="src-badge \${d.source}">\${d.source}</span></span>
        </div>
      </div>
      <div class="stepper-outer">\${buildStepper(vs)}</div>
      <div class="pool-box-wrap">
        <div class="pool-box">
          <div class="pool-box-eyebrow">Pooling Boundary</div>
          <div class="pool-box-text"><b>Your donation</b> → from here, funds are pooled → <b>the fund your donation joined</b><br/>We track the programme, not individual pounds.</div>
        </div>
      </div>
      <div class="stage-hint \${state.selectedStage?'hidden':''}" id="stage-hint">Click a stage to see who confirmed it and when</div>
      <div class="stage-detail-wrap \${state.selectedStage?'open':''}" id="stage-detail-wrap">\${buildDetail(vs, state.selectedStage)}</div>
      <div class="honest-footer">
        <p><span>ℹ</span> Track-ency shows what the charity reports and labels how it's confirmed. Cash given before banking and final-mile delivery overseas can't always be verified.</p>
      </div>
    </div>\`;

  setTimeout(() => {
    document.querySelectorAll('.stage-node').forEach((n,i) => {
      setTimeout(() => n.classList.add('anim'), i * 110);
    });
  }, 30);
}

function buildStepper(vs) {
  const display = [1,2,3,5,6];
  return '<div class="stepper">' + display.map((sn, idx) => {
    const sv = vs.find(s => s.stage === sn) || {status:'pending',pill:'pending'};
    const si = STAGES.find(s => s.n === sn);
    const sel = state.selectedStage === sn ? 'selected' : '';
    const icon = sv.status === 'confirmed' ? '✓' : si.icon;
    let html = \`<div class="stage-col">
      <div class="stage-node \${sv.status} \${sel}" onclick="selectStage(\${sn})">\${icon}</div>
      <div class="stage-lbl">
        <div class="stage-name">\${si.name}</div>
        <span class="trust-pill \${sv.status}">\${sv.pill}</span>
      </div>
    </div>\`;
    if (idx < display.length - 1) {
      const nextSv = vs.find(s => s.stage === display[idx+1]) || {status:'pending'};
      html += sn === 3
        ? \`<div class="pool-line"><div class="pool-chip">◆ pool</div></div>\`
        : \`<div class="stage-line \${nextSv.status}"></div>\`;
    }
    return html;
  }).join('') + '</div>';
}

function buildDetail(vs, selectedStage) {
  if (!selectedStage) return '';
  const sv = vs.find(s => s.stage === selectedStage);
  if (!sv || sv.status === 'boundary') return '';
  const si = STAGES.find(s => s.n === selectedStage);
  return \`<div class="detail-card">
    <div class="detail-top">
      <span class="detail-stage-name">\${si ? si.name : 'Stage ' + selectedStage}</span>
      <span class="trust-pill \${sv.status}">\${sv.pill}</span>
    </div>
    <div class="detail-text">\${sv.detail}</div>
    \${sv.who !== '—' ? \`<div class="detail-meta">
      <span><strong>Confirmed by</strong> \${sv.who}</span>
      <span><strong>When</strong> \${sv.when}</span>
      <span><strong>Source</strong> \${sv.source}</span>
    </div>\` : '<div class="detail-meta" style="color:var(--text-subtle)">Not yet recorded for this stage.</div>'}
  </div>\`;
}

function selectStage(n) {
  state.selectedStage = state.selectedStage === n ? null : n;
  document.querySelectorAll('.stage-node').forEach(el => el.classList.remove('selected'));
  if (state.selectedStage) {
    const idx = [1,2,3,5,6].indexOf(state.selectedStage);
    const nodes = document.querySelectorAll('.stage-node');
    if (nodes[idx]) nodes[idx].classList.add('selected');
  }
  const vs = VERIFICATION[state.selectedRef] || [];
  const wrap = document.getElementById('stage-detail-wrap');
  const hint = document.getElementById('stage-hint');
  wrap.innerHTML = buildDetail(vs, state.selectedStage);
  wrap.classList.toggle('open', !!state.selectedStage);
  if (hint) hint.classList.toggle('hidden', !!state.selectedStage);
}

// ════════════════════════════════════════════════════
// MODES
// ════════════════════════════════════════════════════
function setMode(mode) {
  state.widgetMode = mode === 'widget';
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.mode-btn').forEach(b => {
    if ((mode==='widget'&&b.textContent.includes('Widget'))||(mode==='standalone'&&b.textContent.includes('Standalone')))
      b.classList.add('active');
  });
  document.getElementById('widget-wrap').classList.toggle('widget-mode', state.widgetMode);
}

function togglePhone(on) {
  state.phoneMode = on;
  const body = document.querySelector('.charity-body');
  if (on) {
    if (!body.querySelector('.phone-outer')) {
      const root = document.getElementById('tracker-root');
      const wrap = document.createElement('div');
      wrap.className = 'phone-outer';
      wrap.innerHTML = \`<div class="phone-frame">
        <div class="phone-bar"><span class="phone-time">9:41</span><span class="phone-icons">▲ ● ▬</span></div>
        <div class="phone-content" id="tracker-root"></div>
      </div>\`;
      body.replaceChild(wrap, root);
    }
  } else {
    const wrap = body.querySelector('.phone-outer');
    if (wrap) {
      const r = document.createElement('div'); r.id = 'tracker-root';
      body.replaceChild(r, wrap);
    }
  }
  renderTracker(state.selectedRef);
}

// ════════════════════════════════════════════════════
// LOOKUP
// ════════════════════════════════════════════════════
function handleLookup() {
  const val = document.getElementById('lookup-input').value.trim().toUpperCase();
  if (!val) return;
  const match = DONATIONS.find(d => d.ref.toUpperCase() === val);
  if (match) selectDonation(match.ref);
  else alert('No donation found for ref: ' + val);
}
document.getElementById('lookup-input').addEventListener('keydown', e => { if (e.key === 'Enter') handleLookup(); });

// ════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════
renderSourceCards();
renderDonationsTable();
setTimeout(() => connectSource('csv'), 700);
</script>
</body>
</html>`;
}

import { css } from "lit";

/**
 * PlanB widget styles.
 * - Mobile: horizontal scroll cards, center active card.
 * - Desktop (>= 960px): grid rows.
 */
export const planBStyles = css`
  :host {
    display: block;
    font:
      14px system-ui,
      -apple-system,
      Segoe UI,
      Roboto,
      Ubuntu,
      sans-serif;
    color: #111827;
  }
  .wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  header {
    font-weight: 600;
    font-size: 1.15rem;
    margin: 0 0 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .billing-toggle {
    display: inline-flex;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    padding: 2px;
    font-size: 12px;
  }
  .billing-btn {
    background: transparent;
    border: 0;
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    cursor: pointer;
    font: inherit;
    color: #374151;
  }
  .billing-btn.active {
    background: #6366f1;
    color: #fff;
    font-weight: 600;
  }
  .billing-btn:not(.active):hover {
    background: #e5e7eb;
  }

  .status {
    color: #6b7280;
    font-size: 12px;
  }
  .error {
    color: #dc2626;
    font-size: 12px;
    margin-top: 0.5rem;
  }

  /* Card container: snap scrolling on narrow; center items */
  .cards {
    --card-width: 260px;
    --card-gap: 1.25rem;
    --peek: 12%; /* portion of next/prev card visible (slightly larger hint) */
    display: flex;
    gap: var(--card-gap);
    overflow-x: auto;
    /* Center card while revealing a peek of neighbors: side padding is half viewport - half card - peek portion */
    padding: 0.5rem calc(50% - (var(--card-width) * (1 - var(--peek))) / 2) 1rem;
    padding-top: 1rem; /* extra top padding for shadow */
    scroll-snap-type: x mandatory;
    scroll-snap-stop: always; /* atomic snap */
    scroll-padding-left: calc(
      50% - (var(--card-width) * (1 - var(--peek))) / 2
    );
    scroll-padding-right: calc(
      50% - (var(--card-width) * (1 - var(--peek))) / 2
    );
    justify-content: flex-start;
    -webkit-overflow-scrolling: touch;

    /* Hide scrollbar cross-browser (without removing accessibility) */
    scrollbar-width: none;
  }
  .cards::-webkit-scrollbar {
    display: none;
  }

  /* Visual fade hint for more content */
  .cards::before,
  .cards::after {
    content: "";
    position: sticky;
    top: 0;
    bottom: 0;
    width: 40px;
    pointer-events: none;
    z-index: 1;
  }
  .cards::before {
    left: 0;
    background: linear-gradient(90deg, #fff, rgba(255, 255, 255, 0));
  }
  .cards::after {
    right: 0;
    background: linear-gradient(-90deg, #fff, rgba(255, 255, 255, 0));
  }

  .cards::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }

  .card {
    width: var(--card-width);
    flex: 0 0 var(--card-width);
    background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.04),
      0 4px 12px -2px rgba(0, 0, 0, 0.06);
    position: relative;
    display: flex;
    flex-direction: column;
    scroll-snap-align: center;
    transition:
      border-color 0.3s,
      box-shadow 0.3s,
      transform 0.35s;
    overflow: hidden;
  }
  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      circle at 70% 15%,
      rgba(99, 102, 241, 0.12),
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.4s;
  }
  .card:hover::before {
    opacity: 1;
  }
  /* Headings */
  .card h3 {
    margin: 0 0 0.5rem;
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: 0.3px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-align: center;
  }
  .card h3 small.plan-desc {
    display: block;
    min-height: 1.1rem;
    font-weight: 400;
    font-size: 0.75rem;
    color: #6b7280;
    line-height: 1.1;
	margin-top: 2px;
    padding: 0 0.75rem;
    overflow: hidden;
  }
  .card h3 small.plan-desc.placeholder {
    opacity: 0.25;
  }
  .card .action {
    display: inline-block;
    height: 2.5rem;
	width: 100%;
  }

  /* Feature list inside card */
  .card ul.feature-list {
    list-style: none;
    margin: 0.6rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }
  .card ul.feature-list li.feature-item {
    cursor: pointer;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    transition: background 0.25s, border-color 0.25s;
  }
  .card ul.feature-list li.feature-item:hover {
    background: #f1f5f9;
  }
  .card ul.feature-list li.feature-item .f-head {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    width: 100%;
  }
  .card ul.feature-list li.feature-item .f-icon {
    display: inline-block;
    font-size: 1.05rem;
    line-height: 1;
    color: #6366f1;
    transition: transform 0.25s, color 0.25s;
  }
  .card ul.feature-list li.feature-item.open .f-icon {
    color: #4338ca;
    transform: scale(1.05);
  }
  .card ul.feature-list li.feature-item .f-name {
    font-size: 0.85rem;
    font-weight: 750;
    color: #374151;
  }
  .card ul.feature-list li.feature-item .f-desc {
    font-size: 0.72rem;
    line-height: 1.05rem;
    color: #374151;
    margin: 0;
    padding: 0.55rem 0.6rem;
  }
  .card ul.feature-list li {
    position: relative;
    padding-left: 0; /* removed old left padding for '>' icon */
    font-size: 0.7rem;
    line-height: 1rem;
    color: #374151;
    display: flex;
    align-items: flex-start;
  }
  /* Legacy wrappers cleanup */
  .card-head,
  .card-body {
    margin-top: 0.5rem;
    padding: 0;
	padding-bottom: 1rem;
  }
  .card.active {
    border-width: 2px;
    border-color: #6366f1;
    box-shadow:
      0 4px 16px -3px rgba(99, 102, 241, 0.45),
      0 2px 6px -1px rgba(99, 102, 241, 0.3);
    transform: translateY(-3px);
  }

  /* Price row */
  .price-row {
    display: flex;
	width: 100%;
	height: 2rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    margin: 0.25rem 0 0.55rem;
    text-align: center;
  }
  .price-row .price {
    font-size: 1.65rem;
    font-weight: 700;
    line-height: 1.2;
  }
  /* Call-to-action button */
  .card .cta {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 75%;
    margin: 0.45rem auto 0.6rem;
    padding: 0.6rem 0.75rem;
    font-size: 1.125rem;
    letter-spacing: 0.3px;
    color: #374151;
    background: #e5e7eb;
    border-radius: 10px;
    text-decoration: none;
    border: 1px solid #d1d5db;
    transition:
      background 0.25s,
      box-shadow 0.25s;
  }
  .card .cta:hover { background:#d1d5db; }
  .card.active .cta {
    font-weight: 600;
    background:#6366f1;
	color:#fff;
	border-color:#6366f1;
	box-shadow:0 4px 12px -2px rgba(99,102,241,0.35);
  }
  /* Sponsor button variant */
  .card .cta.cta-sponsor {
    background:#fff;
    border-color:#fbbf24;
    color:#b45309;
  }
  .card .cta.cta-sponsor:hover { background:#fef3c7; }
  .card.active .cta.cta-sponsor { border-color:#f59e0b; color:#92400e; }

  .card .cta:active {
    background:#cbd5e1;
  }
    background: #4f46e5;
    box-shadow: 0 4px 12px -2px rgba(99, 102, 241, 0.45);
  }
  .card .cta:active {
    background: #4338ca;
  }

  /* Inheritance hint */
  .card .more {
    display: block;
    min-height: 1.05em;
    font-size: 0.84rem;
    letter-spacing: 0.15px;
    font-weight: 500;
    padding: 0.3rem 0.6rem;
    width: fit-content;
    margin-top: 0.4rem;
  }
  .price {
    font-weight: 700;
    font-size: 0.95rem;
  }
  .divider {
    color: #d1d5db;
  }

  /* Desktop grid layout */
  @media (min-width: 960px) {
    .cards {
      flex-wrap: wrap;
      overflow: visible;
      justify-content: center;
      scroll-snap-type: none;
      padding: 0.5rem 0 1rem;
    }
    .card {
      flex: 1 1 calc(25% - var(--card-gap));
      max-width: 300px;
      scroll-snap-align: unset;
    }
  }

  /* Comparison Table */
  .comparison-wrap {
    margin-top: 1.5rem;
    overflow-x: auto;
  }
  .comparison {
    border-collapse: collapse;
    width: 100%;
    min-width: 520px;
    font-size: 12px;
    table-layout: fixed;
  }
  .comparison th,
  .comparison td {
    border-bottom: 1px solid #e5e7eb;
    padding: 0.5rem 0.6rem;
  }
  .comparison thead th {
    background: #f3f4f6;
    text-align: left;
    font-weight: 600;
    font-size: 12px;
  }
  .comparison thead th.active {
    background: #6366f1;
    color: #fff;
  }
  .comparison tbody th {
    text-align: left;
    font-weight: 500;
    background: #fff;
    position: sticky;
    left: 0;
    z-index: 1;
  }
  .comparison tbody td {
    text-align: center;
    background: #fff;
  }
  .comparison tbody td.active {
    background: #eef2ff;
  }
  .comparison tbody td .check {
    display: inline-block;
    width: 1.1rem;
    height: 1.1rem;
    line-height: 1.1rem;
    border-radius: 50%;
    background: #6366f1;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 600;
  }
  .comparison tbody td .dash {
    color: #9ca3af;
    font-size: 0.75rem;
  }

  /* Even plan column widths */
  .comparison thead th:not(:first-child),
  .comparison tbody td {
    width: auto;
  }
  .comparison {
    table-layout: fixed;
  }

  /* Prevent horizontal overflow on small screens by forcing single active column (already handled) and allowing feature names to ellipsis */
  @media (max-width: 640px) {
    .comparison {
      min-width: 0;
      width: 100%;
    }
    .comparison thead th:first-child,
    .comparison tbody th {
      width: 120px;
    }
    .comparison thead th.active,
    .comparison tbody td.active {
      width: calc(100% - 120px);
    }
  }

  /* Feature column sizing & hover tooltip */
  .comparison thead th:first-child,
  .comparison tbody th {
    width: 140px;
    max-width: 140px;
  }
  .comparison tbody th {
    position: relative;
  }
  .comparison .feature-name {
    display: block;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* Tooltip style description (desktop) */
  .comparison .feature-desc {
    display: none;
    position: absolute;
    left: 100%;
    top: 0;
    margin-left: 8px;
    color: #fff;
    padding: 0.5rem 0.6rem;
    font-size: 11px;
    line-height: 1.2;
    max-width: 260px;
    min-width: 160px;
    box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.3);
    pointer-events: none;
    z-index: 20;
    white-space: normal;
    word-wrap: break-word;
  }
  .comparison tbody th:hover .feature-desc {
    display: block;
  }
  /* Mobile keeps previous rule: hide all but active column; keep tooltip suppressed */
  @media (max-width: 640px) {
    .comparison .feature-desc {
      display: none !important;
    }
    .comparison thead th:first-child,
    .comparison tbody th {
      width: 120px;
      max-width: 120px;
    }
  }

  /* Feature description styling (desktop) */
  .comparison .feature-desc {
    display: block;
    font-weight: 400;
    font-size: 11px;
    color: #6b7280;
    margin-top: 2px;
    line-height: 1.15em;
  }

  /* Mobile: show only active plan column; hide others & inline descriptions */
  @media (max-width: 640px) {
    .comparison thead th:not(:first-child):not(.active),
    .comparison tbody td:not(.active) {
      display: none;
    }
    .comparison .feature-desc {
      display: none;
    }
    /* Keep row header readable with tighter spacing */
    .comparison tbody th {
      font-size: 12px;
    }
  }
`;

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
  }
  /* Hide scrollbar cross-browser (without removing accessibility) */
  .cards {
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
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 1rem 1rem 1.1rem; /* top padding adjusted to 1rem */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    position: relative;
    display: flex;
    flex-direction: column;
    scroll-snap-align: center;
    transition:
      border-color 0.25s,
      box-shadow 0.25s,
      transform 0.25s;
  }
  .card h3 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    font-weight: 600;
  }
  .card.active {
    border-color: #6366f1;
    box-shadow: 0 4px 14px -3px rgba(99, 102, 241, 0.35);
    transform: translateY(-2px);
  }

  .price-row {
    font-size: 0.85rem;
    color: #374151;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-bottom: 0.35rem;
  }
  .price {
    font-weight: 600;
    color: #6366f1;
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
`;

import { LitElement } from "lit";
import { planBStyles } from "./PlanB.styles.js";
import { renderRoot } from "./PlanB.render.js";

/**
 * <planb-widget>
 * Fetches pricing plans from a JSON endpoint and renders them as responsive cards.
 * Features:
 *  - Horizontal snapping carousel on narrow viewports.
 *  - Grid layout on wider screens.
 *  - Active card selection + centering (emits 'planb-select').
 */
export class PlanBWidget extends LitElement {
  static properties = {
    /** Endpoint returning plan JSON */
    apiServer: { type: String, attribute: "api-server" },

    /** Optional attribute to set default active plan name */
    defaultPlan: { type: String, attribute: "default-plan" },

    /** Internal: array of plan objects */
    _plans: { state: true },

    /** Loading state */
    _loading: { state: true },

    /** Error message */
    _error: { state: true },

    /** Currently active (highlighted) card index */
    _activeIndex: { state: true },
  };

  static styles = planBStyles;

  constructor() {
    super();
    this.apiServer = "/plans";
    this.defaultPlan = undefined; // name of the plan to select by default
    this._plans = [];
    this._loading = false;
    this._error = null;
    this._abortCtl = null;
    this._activeIndex = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._fetchPlans();
  }

  updated(changed) {
    if (changed.has("apiServer") || changed.has("defaultPlan"))
      this._fetchPlans();
  }

  /** Fetch plan data with abort + normalization */
  async _fetchPlans(force = false) {
    if (this._loading && !force) return;
    if (this._abortCtl) this._abortCtl.abort();

    const url = this.apiServer || "./plans.example.json";
    this._abortCtl = new AbortController();
    this._loading = true;
    this._error = null;

    try {
      const resp = await fetch(url, {
        signal: this._abortCtl.signal,
        headers: { Accept: "application/json" },
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();
      const plans = Array.isArray(data?.plans) ? data.plans : [];

      this._plans = plans.map((p) => ({
        name: p.name ?? "Unnamed",
        monthly_price: p.monthly_price ?? null,
        yearly_price: p.yearly_price ?? null,
        features: Array.isArray(p.features) ? p.features.slice(0, 6) : [],
      }));

      // Determine default active index precedence:
      // 1. JSON response default_plan
      // 2. Attribute default-plan
      // 3. Existing (previous) active index if still in range
      let jsonDefaultName =
        typeof data?.default_plan === "string" ? data.default_plan : undefined;
      const attrDefaultName = this.defaultPlan;
      const preferredName = jsonDefaultName || attrDefaultName;
      if (preferredName) {
        const idx = this._plans.findIndex((p) => p.name === preferredName);
        if (idx >= 0) this._activeIndex = idx;
      }
      if (this._activeIndex >= this._plans.length) this._activeIndex = 0;

      requestAnimationFrame(() => this._scrollActiveIntoView());
    } catch (err) {
      if (err.name === "AbortError") return; // aborted fetch, ignore
      this._error = err.message || "Failed to load plans";
      this._plans = [];
    } finally {
      this._loading = false;
    }
  }

  /** Handle click bubbling from any card */
  _onCardClick(e) {
    const card = e.composedPath().find((n) => n?.classList?.contains("card"));
    if (!card) return;

    const idx = Number(card.getAttribute("data-index"));
    if (Number.isNaN(idx) || idx === this._activeIndex) return;

    this._activeIndex = idx;
    this._scrollActiveIntoView();
    this.dispatchEvent(
      new CustomEvent("planb-select", {
        detail: { index: idx, plan: this._plans[idx] },
      }),
    );
  }

  /** Center active card in scroll container on narrow viewports */
  _scrollActiveIntoView() {
    const cards = this.renderRoot?.querySelector(".cards");
    if (!cards) return;

    const active = cards.querySelector(".card.active");
    if (!active) return;

    if (window.innerWidth >= 960) return; // desktop grid, no scrolling center needed

    const rect = active.getBoundingClientRect();
    const containerRect = cards.getBoundingClientRect();
    const delta =
      rect.left +
      rect.width / 2 -
      (containerRect.left + containerRect.width / 2);
    cards.scrollBy({ left: delta, behavior: "smooth" });
  }

  render() {
    return renderRoot(this);
  }
}

// Safe registration (idempotent)
if (!customElements.get("planb-widget")) {
  customElements.define("planb-widget", PlanBWidget);
}

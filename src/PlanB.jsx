import { LitElement } from "lit";
import { planBStyles } from "./PlanB.styles.js";
import { renderRoot } from "./PlanB.render.js";

/**
 * <planb-widget>
 * Responsive pricing plans carousel (mobile) + grid (desktop).
 * Responsibilities:
 *  - Fetch plan data (JSON) from api-server.
 *  - Auto-select default plan (JSON default_plan or attribute default-plan).
 *  - Center active card with snap scrolling & partial neighbor peek.
 *  - Keep selection in sync with user scroll, clicks, or keyboard.
 *  - Emit 'planb-select' with { index, plan } on changes.
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

    /** Billing period: 'monthly' | 'yearly' */
    _billingPeriod: { state: true },

    /** Feature dictionary (from JSON.features) */
    _featureDict: { state: true },
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
    this._billingPeriod = "monthly";
    this._featureDict = {};
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
      this._featureDict =
        data?.features && typeof data.features === "object"
          ? data.features
          : {};

      this._plans = plans.map((p) => ({
        name: p.name ?? "Unnamed",
        monthly_price: p.monthly_price ?? null,
        yearly_price: p.yearly_price ?? null,
        inherits: p.inherits || null,
        description: typeof p.description === "string" ? p.description : "",
        features: Array.isArray(p.features) ? p.features.slice() : [],
      }));

      // Resolve inheritance: merge features from inherited plan(s)
      const byName = Object.fromEntries(this._plans.map((p) => [p.name, p]));
      const resolve = (plan, seen = new Set()) => {
        if (!plan?.inherits) return plan.features;
        if (seen.has(plan.name)) return plan.features; // cycle guard
        const base = byName[plan.inherits];
        if (!base) return plan.features;
        seen.add(plan.name);
        const baseFeatures = resolve(base, seen);
        plan.features = Array.from(
          new Set([...(baseFeatures || []), ...(plan.features || [])]),
        );
        return plan.features;
      };
      this._plans.forEach((p) => resolve(p));
      // Trim feature list for display (keep original merged ordering, first inherited then own)
      this._plans.forEach((p) => (p.features = p.features.slice()));

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

      // Ensure initial active card centers after first render in narrow view
      this.updateComplete.then(() => {
        this._scrollActiveIntoView(true);
      });
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
    // Prevent scroll listener from fighting programmatic centering
    this._scrollLock = true;
    this.updateComplete.then(() => {
      this._scrollActiveIntoView(false);
      setTimeout(() => {
        this._scrollLock = false;
      }, 180);
    });
    this.dispatchEvent(
      new CustomEvent("planb-select", {
        detail: { index: idx, plan: this._plans[idx] },
      }),
    );
  }

  /** Center active card in scroll container on narrow viewports */
  _scrollActiveIntoView(forceSnap) {
    if (window.innerWidth >= 960) return; // desktop grid, no centering needed
    const cards = this.renderRoot?.querySelector(".cards");
    if (!cards) return;
    const active = cards.querySelector(".card.active");
    if (!active) return;

    // Because we added symmetric side padding equal to half container minus half card width,
    // the natural scroll position where the card starts is already visually centered. We can
    // just snap to its offsetLeft.
    const paddingLeft = parseFloat(getComputedStyle(cards).paddingLeft) || 0;
    const target = active.offsetLeft - paddingLeft;
    const clamped = Math.max(
      0,
      Math.min(target, cards.scrollWidth - cards.clientWidth),
    );
    if (Math.abs(clamped - cards.scrollLeft) > 1) {
      cards.scrollTo({
        left: clamped,
        behavior: forceSnap ? "auto" : "smooth",
      });
    }
  }

  /** Debounced scroll listener to sync active card after snap */
  _onScroll(e) {
    const cards = e.currentTarget;
    if (window.innerWidth >= 960) return;
    if (!cards || this._scrollLock) return;

    // debounce using a timer so we only pick active after snap settles
    clearTimeout(this._scrollTimer);
    this._scrollTimer = setTimeout(() => {
      const children = Array.from(cards.querySelectorAll(".card"));
      if (!children.length) return;
      const containerCenter = cards.scrollLeft + cards.clientWidth / 2;
      // find card whose center is closest to container center
      let best = 0;
      let bestDist = Infinity;
      children.forEach((el, i) => {
        const center = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(center - containerCenter);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      if (best !== this._activeIndex) {
        this._activeIndex = best;
        this.dispatchEvent(
          new CustomEvent("planb-select", {
            detail: { index: best, plan: this._plans[best] },
          }),
        );
      }
    }, 120); // small delay after scroll end
  }

  _onKeyNav(e) {
    if (window.innerWidth >= 960) return; // only for carousel mode
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    let idx = this._activeIndex;
    if (e.key === "ArrowRight") idx = Math.min(this._plans.length - 1, idx + 1);
    else if (e.key === "ArrowLeft") idx = Math.max(0, idx - 1);
    else if (e.key === "Home") idx = 0;
    else if (e.key === "End") idx = this._plans.length - 1;
    if (idx !== this._activeIndex) {
      this._activeIndex = idx;
      this.updateComplete.then(() => this._scrollActiveIntoView());
      this.dispatchEvent(
        new CustomEvent("planb-select", {
          detail: { index: idx, plan: this._plans[idx] },
        }),
      );
    }
  }

  _setBilling(mode) {
    if (mode !== "monthly" && mode !== "yearly") return;
    if (this._billingPeriod === mode) return;
    this._billingPeriod = mode;
    this.dispatchEvent(
      new CustomEvent("planb-billing-change", { detail: { period: mode } }),
    );
  }

  render() {
    return renderRoot(this);
  }
}

// Safe registration (idempotent)
if (!customElements.get("planb-widget")) {
  customElements.define("planb-widget", PlanBWidget);
}

import { html } from "lit";

/** Card template (single plan) */
export function renderCard(plan, idx, activeIndex, billing) {
  const monthlyRaw = plan.monthly_price != null ? plan.monthly_price : null;
  const yearlyRaw = plan.yearly_price != null ? plan.yearly_price : null;
  const active = idx === activeIndex;
  const classes = ["card", active ? "active" : ""].filter(Boolean).join(" ");

  const display =
    billing === "yearly"
      ? yearlyRaw != null
        ? `$${yearlyRaw}/yr`
        : monthlyRaw != null
          ? `$${monthlyRaw}/mo`
          : "—"
      : monthlyRaw != null
        ? `$${monthlyRaw}/mo`
        : yearlyRaw != null
          ? `$${yearlyRaw}/yr`
          : "—";

  return html`
    <div class="${classes}" data-index="${idx}" part="card">
      <div class="card-head">
        <h3>
          ${plan.name}
          <small class="plan-desc ${plan.description ? "" : "placeholder"}">
            ${plan.description ? plan.description : "\u00A0"}
          </small>
        </h3>
        <div class="price-row">
          <span class="price">${display}</span>
        </div>
        ${plan.action
          ? html`<a
              href="${plan.action.url}"
              target="_blank"
              rel="noopener noreferrer"
              class="cta"
              part="cta"
              @click=${(e) => {
                e.stopPropagation();
              }}
              >${plan.action.name}</a
            >`
          : ""}
      </div>
      <div class="card-body">
        <span class="more"
          >${plan.inherits
            ? html`Everything include <b>${plan.inherits}</b>, and more ...`
            : ""}</span
        >
        ${plan.features?.length
          ? html`<ul class="feature-list">
              ${plan.features.map((f) => html`<li>${f}</li>`)}
            </ul>`
          : ""}
      </div>
    </div>
  `;
}

/** Root wrapper template (delegates events back to component instance) */
export function renderRoot(ctx) {
  const {
    _plans,
    _loading,
    _error,
    _activeIndex,
    _billingPeriod,
    _featureDict,
  } = ctx;
  const showLoading = _loading && !_plans.length;
  const showEmpty = !_loading && !_plans.length;

  const cards = _plans.length
    ? html`<div
        class="cards"
        @click=${(e) => ctx._onCardClick(e)}
        @keydown=${(e) => ctx._onKeyNav?.(e)}
        @scroll=${(e) => ctx._onScroll?.(e)}
        tabindex="0"
        role="list"
      >
        ${_plans.map((p, i) => renderCard(p, i, _activeIndex, _billingPeriod))}
      </div>`
    : "";

  // Comparison table generation
  let comparison = null;
  if (_plans.length && _featureDict && Object.keys(_featureDict).length) {
    const featureNames = Object.keys(_featureDict);
    const featureColPx = 140;
    const planColW = `calc((100% - ${featureColPx}px)/${_plans.length || 1})`;
    comparison = html`<div class="comparison-wrap">
      <table class="comparison" part="comparison">
        <thead>
          <tr>
            <th scope="col"></th>
            ${_plans.map(
              (p, i) =>
                html`<th
                  scope="col"
                  class="${i === _activeIndex ? "active" : ""}"
                  style="width:${planColW}"
                >
                  ${p.name}
                </th>`,
            )}
          </tr>
        </thead>
        <tbody>
          ${featureNames.map((fname) => {
            const desc = _featureDict[fname] || "";
            return html`<tr>
              <th scope="row" title="${desc}">
                <span class="feature-name" title="${desc}">${fname}</span>
              </th>
              ${_plans.map(
                (p, i) =>
                  html`<td
                    class="${i === _activeIndex ? "active" : ""}"
                    style="width:${planColW}"
                  >
                    ${p.features.includes(fname)
                      ? html`<span class="check" aria-label="Included">✓</span>`
                      : html`<span class="dash" aria-hidden="true">—</span>`}
                  </td>`,
              )}
            </tr>`;
          })}
        </tbody>
      </table>
    </div>`;
  }

  return html`
    <div class="wrapper" part="wrapper">
      <header>
        Plans
        ${_plans.length
          ? html`<span class="billing-toggle" part="billing-toggle">
              <button
                class="billing-btn ${_billingPeriod === "monthly"
                  ? "active"
                  : ""}"
                @click=${() => ctx._setBilling("monthly")}
                aria-pressed=${_billingPeriod === "monthly"}
              >
                Mo
              </button>
              <button
                class="billing-btn ${_billingPeriod === "yearly"
                  ? "active"
                  : ""}"
                @click=${() => ctx._setBilling("yearly")}
                aria-pressed=${_billingPeriod === "yearly"}
              >
                Yr
              </button>
            </span>`
          : ""}
      </header>

      ${showLoading ? html`<div class="status">Loading…</div>` : ""}
      ${showEmpty
        ? html`<div class="status">
            ${_error ? "No data" : "No plans available yet."}
          </div>`
        : ""}
      ${_error ? html`<div class="error">${_error}</div>` : ""} ${cards}
      ${comparison}
    </div>
  `;
}

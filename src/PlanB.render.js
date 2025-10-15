import { html } from "lit";

/** Card template */
export function renderCard(plan, idx, activeIndex) {
  const monthly =
    plan.monthly_price != null ? `$${plan.monthly_price}/mo` : "—";
  const yearly = plan.yearly_price != null ? `$${plan.yearly_price}/yr` : null;
  const active = idx === activeIndex;
  const classes = ["card", active ? "active" : ""].filter(Boolean).join(" ");

  return html`
    <div class="${classes}" data-index="${idx}" part="card">
      <h3>${plan.name}</h3>
      <div class="price-row">
        <span class="price">${monthly}</span>
        ${yearly
          ? html`<span class="divider">|</span
              ><span class="price">${yearly}</span>`
          : ""}
      </div>
      ${plan.features?.length
        ? html`<ul>
            ${plan.features.map((f) => html`<li>${f}</li>`)}
          </ul>`
        : ""}
    </div>
  `;
}

/** Root wrapper template */
export function renderRoot(ctx) {
  const { _plans, _loading, _error, _activeIndex } = ctx;
  const showLoading = _loading && !_plans.length;
  const showEmpty = !_loading && !_plans.length;

  const cards = _plans.length
    ? html`<div class="cards" @click=${(e) => ctx._onCardClick(e)}>
        ${_plans.map((p, i) => renderCard(p, i, _activeIndex))}
      </div>`
    : "";

  return html`
    <div class="wrapper" part="wrapper">
      <header>Plans</header>

      ${showLoading ? html`<div class="status">Loading…</div>` : ""}
      ${showEmpty
        ? html`<div class="status">
            ${_error ? "No data" : "No plans available yet."}
          </div>`
        : ""}
      ${_error ? html`<div class="error">${_error}</div>` : ""} ${cards}
    </div>
  `;
}

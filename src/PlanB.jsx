import { LitElement, html, css } from 'lit';

/**
 * <planb-widget>
 * A minimal placeholder component for the PlanB pricing widget.
 * Responsibilities (current stage):
 *  - Demonstrate working build & registration pipeline.
 *  - Provide a stable element name that future iterations can enhance without
 *    breaking early adopters.
 *
 * Future planned responsibilities (per COPILOT.md):
 *  - Fetch plan/pricing JSON data from an API endpoint.
 *  - Render plan cards with monthly/yearly switch.
 *  - Render comparison table of features.
 *  - Emit selection events for host page integration.
 *
 * Design notes:
 *  - The component avoids constructor side-effects other than super();
 *    side-effects belong in connectedCallback when added later.
 *  - Styling uses only local (shadow) styles to avoid leaking.
 *  - Guarded custom element definition prevents double registration when the
 *    file is imported multiple times (e.g. in dev HMR or tests).
 */
export class PlanBWidget extends LitElement {
  /**
   * Static styles: keep tiny; future styles should be modularized or layered.
   */
  static styles = css`
    :host {
      display: inline-block;
      font: 14px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Arial, sans-serif;
      padding: .75rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,.1);
      line-height: 1.25;
      user-select: none;
    }
    strong { color: #6366f1; font-weight: 600; }
  `;

  /**
   * Template render: currently trivial. Kept as method (not arrow) to allow
   * potential overriding / mixins later.
   */
  render() {
    return html`<span>Hello <strong>PlanB</strong>!</span>`;
  }
}

// Safe registration (idempotent)
if (!customElements.get('planb-widget')) {
  customElements.define('planb-widget', PlanBWidget);
}

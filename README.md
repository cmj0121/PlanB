# PlanB

> The simplest way to manage your subscriptions and recurring payments.

_Current stage: minimal fetch-enabled pricing widget scaffold._

This repository currently provides a foundational `<planb-widget>` web component (Lit) that:

- Builds to a single self‑contained IIFE bundle (`dist/planb.js`).
- Accepts an `api-server` attribute pointing to a JSON endpoint returning plan data.
- Fetches and displays a basic list of plans with monthly / yearly prices (if provided).
- Offers a manual Refresh button and a `refresh()` public method.

## Example JSON

The file `plans.example.json` is included for local experimentation:

```json
{
  "plans": [
    {
      "name": "Basic",
      "monthly_price": 9,
      "yearly_price": 90,
      "features": ["Feature 1", "Feature 2"]
    },
    {
      "name": "Pro",
      "monthly_price": 19,
      "yearly_price": 190,
      "features": ["Feature 1", "Feature 2", "Feature 3"]
    },
    {
      "name": "Enterprise",
      "monthly_price": 49,
      "yearly_price": 490,
      "features": ["Feature 3", "Feature 4"]
    }
  ],
  "features": {
    "Feature 1": "Description for Feature 1",
    "Feature 2": "Description for Feature 2",
    "Feature 3": "Description for Feature 3",
    "Feature 4": "Description for Feature 4"
  }
}
```

## Usage (Current)

Include the built script and (optionally) point `api-server` to your endpoint (defaults to `/plans`):

```html
<script src="./dist/planb.js"></script>
<planb-widget api-server="./plans.example.json"></planb-widget>
```

If hosted on a CDN you may reference the file remotely the same way.

### Local Development

```bash
pnpm install        # install dependencies
pnpm run build      # produce dist/planb.js (IIFE bundle)
# or run a dev server (ESM w/ module resolution for development)
pnpm run dev
```

Open `example.html` in a static server context (or via the dev server after adjusting path) to see the widget fetch `plans.example.json`.

### Example Page

`example.html` demonstrates embedding the bundle and referencing the example JSON:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>PlanB Example</title>
    <script src="./dist/planb.js"></script>
  </head>
  <body>
    <planb-widget api-server="./plans.example.json"></planb-widget>
  </body>
</html>
```

## Roadmap (Next Increments)

1. Monthly / yearly toggle UI.
2. Feature comparison table generation from feature dictionary.
3. Selection highlighting & event emission (`planb-select`).
4. Theming via CSS custom properties.
5. Dual build outputs (ES module + IIFE) and type definitions.
6. Basic test harness setup.

## License

MIT

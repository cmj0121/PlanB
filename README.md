# PlanB

> The simplest way to manage your subscriptions and recurring payments.

## Usage

Include the built script and drop the element in your page:

```html
<script src="./dist/planb.js"></script>
<planb-widget></planb-widget>
```

If you publish the file to a CDN you can do the same with the remote URL.

### Local Development

```bash
pnpm install        # install dependencies
pnpm run build      # produce dist/planb.js (IIFE bundle)
# or run a dev server (will produce ESM served with module resolution)
pnpm run dev        # open the shown URL and use <planb-widget>
```

### Example Page

`example.html` demonstrates embedding the current bundle:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>PlanB Example</title>
    <script src="./dist/planb.js"></script>
  </head>
  <body>
    <planb-widget></planb-widget>
  </body>
</html>
```

## License

MIT

# PlanB

> The simplest way to manage your subscriptions and recurring payments.

This is the simple PoC that build and displays pricing plans from a JSON endpoint, based on the
[Copilot CLI](https://github.com/github/copilot-cli) with the [COPILOT.md](./COPILOT.md) as the
prompt source.

You can find the example JSON structure and usage from the [plans.example.json](./examples/plans.example.json),
and write your own html page to include the built script and use the `<planb-widget>` custom element.

```html
<script src="./dist/planb.js"></script>
<planb-widget api-server="./plans.example.json"></planb-widget>
```

## License

MIT

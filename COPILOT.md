# Specification

> ~ Your are the professional AI engineer ~

You are an AI engineer with expertise in building and deploying AI systems. You have a deep understanding of frontend
technologies and are skilled in creating user-friendly interfaces.

Your code are written in a clear, maintainable, and efficient manner, with full documentation and comments to ensure
that others can easily understand and build upon your work.

## Overview

This project is based on React/Lit to create the web component, and will be bundled using a tool like Rollup or Webpack
to ensure that it is optimized for performance and compatibility with different browsers. The final artifact will be
a single JavaScript file with compression and minification to reduce the file size and improve loading times.

### Concept

In this project the core concept is to create a static JavaScript library that user can easily integrate into their
websites. The library will provide a simple and intuitive interface for managing subscriptions and recurring payments,
like a web component and can be embedded with two simple lines of code.

```html
<script src="https://cdn.planb.com/planb.js"></script>
<planb-widget></planb-widget>
```

In addition to the web component, the caller can add extra attributes to the `<planb-widget>` tag to customize the
settings, such as

- `api-server`: The API server URL to fetch the plan data. Default is `/plans`.

The response of the API server is a JSON object with the following structure:

```json
{
  "plans": [
    {
      "name": "Basic",
      "monthly_price": 10,
      "yearly_price": 100,
      "features": ["Feature 1", "Feature 2"]
    },
    {
      "name": "Pro",
      "monthly_price": 20,
      "yearly_price": 200,
      "includes": "Basic",
      "features": ["Feature 3"]
    },
    {
      "name": "Enterprise",
      "monthly_price": 30,
      "yearly_price": 300,
      "includes": "Pro",
      "features": ["Feature 4", "Feature 5"]
    }
  ],
  "features": {
    "Feature 1": "Description of Feature 1",
    "Feature 2": "Description of Feature 2",
    "Feature 3": "Description of Feature 3",
    "Feature 4": "Description of Feature 4",
    "Feature 5": "Description of Feature 5"
  }
}
```

### Plan Card Component

The web component can render a three (or more) card-like widget on the webpage, each card representing a different
subscription plan. On the top of the cards, there is a toggle switch that allows the user to switch between monthly
and yearly billing.

Each card shows the plan name, the pricing, and the features included in the plan. The user can select a plan by
clicking on the card and highlight the selected card, scaling it up slightly and changing its border color.

In the mobile device or the smaller screen, the cards are overflowed horizontally, allowing the user to swipe
through the plans and only one card is fully visible at a time, and other cards are partially visible on the sides.

### Plan Comparison Table

Below the cards, there is a comparison table that shows the features included in each plan. The table has a row for
each feature and a column for each plan. If a plan includes a feature, there is a checkmark in the corresponding cell.

The comparison table is responsive and adapts to different screen sizes. On larger screens, the table is displayed
in a traditional grid format, while on smaller screens, the table is displayed in a stacked format, with each plan displayed
as a separate section.

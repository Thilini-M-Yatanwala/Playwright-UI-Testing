# Playwright UI Component Tests

Automated UI tests written with [Playwright](https://playwright.dev) and TypeScript for the [Bondar Academy playground](https://playground.bondaracademy.com/).

## Content

- [How to interact with different UI components](#how-to-interact-with-ui-components) such as: input fields, radio buttons, check boxes, lists, tooltips, date pickers, web tables, sliders, iFrames
- [How to locate any web element on the page](#how-to-locate-any-web-element-playwright-best-practices) following Playwright best practices

## Setup

```bash
npm install
npx playwright install
```

## Run tests

```bash
npx playwright test                 # run all tests (headless)
npx playwright test --headed        # watch the browser
npx playwright test --ui            # interactive UI mode
npx playwright show-report          # open the last HTML report
```


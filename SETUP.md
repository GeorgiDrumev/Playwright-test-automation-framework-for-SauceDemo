# Setup & Run Tests

## Prerequisites
- Node.js 18+
- npm

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Run Tests

Run all tests:
```bash
npm test
```

Run tests in headed mode:
```bash
npm run test:headed
```

Run tests in UI mode:
```bash
npm run test:ui
```

Run performance tests:
```bash
npm run test:performance
```

Run specific test suites by tag:
```bash
npx playwright test --grep @positive
npx playwright test --grep @visual
npx playwright test --grep @authentication
```

## View Report

Open HTML report:
```bash
npm run report
```

Or view online:
https://georgidrumev.github.io/Playwright-test-automation-framework-for-SauceDemo/

# Playwright Test Framework - SauceDemo

A minimal Playwright test automation project using TypeScript for testing https://www.saucedemo.com/

## Setup

Install dependencies:
```bash
npm install
```

Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

Run tests in headless mode:
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

View HTML report:
```bash
npm run report
```

## Project Structure

```
test-framework-saucedemo/
├── src/
│   ├── pages/          # Page Object Models
│   └── tests/          # Test files
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

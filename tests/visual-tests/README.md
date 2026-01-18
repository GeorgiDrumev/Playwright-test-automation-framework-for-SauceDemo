# Visual Testing

This directory contains visual regression tests for the application.

## Overview

Visual tests use Playwright's screenshot comparison to detect UI changes. Screenshots are organized by page category in `data/screenshots/`.

## Configuration

- **Default Deviation**: 0.001 (0.1% difference allowed)
- **Retry Count**: 5 attempts
- **Retry Delay**: 2 seconds between retries
- **Screenshot Directory**: `data/screenshots/`

## Screenshot Organization

Screenshots are organized by page name:
- `data/screenshots/products/` - Products page screenshots
- `data/screenshots/cart/` - Cart page screenshots
- `data/screenshots/checkout/` - Checkout page screenshots
- `data/screenshots/auth/` - Authentication page screenshots

## Usage

### Running Visual Tests

```bash
# Run all visual tests
npx playwright test tests/visual-tests

# Run specific visual test file
npx playwright test tests/visual-tests/products-visual.spec.ts

# Run tests with @visual tag
npx playwright test --grep @visual
```

### Creating New Visual Tests

1. Create a test file in `tests/visual-tests/`
2. Use `compareScreenshot()` method from any page object:

```typescript
test("should match page layout @visual @positive", async () => {
  await productsPage.compareScreenshot("screenshot-name", "page-category");
});
```

### Parameters

- `name`: Screenshot name (without extension)
- `pageName`: Page category for organization (e.g., 'products', 'cart')
- `deviation`: Optional custom deviation threshold (default: 0.001)

### Example with Custom Deviation

```typescript
// More strict comparison (0.01% difference)
await page.compareScreenshot("strict-test", "products", 0.0001);

// More lenient comparison (1% difference)
await page.compareScreenshot("lenient-test", "products", 0.01);
```

## Baseline Screenshots

On first run, baseline screenshots are automatically created in:
- `tests/visual-tests/{test-file}/{screenshot-name}.png`

To update baselines:
```bash
npx playwright test tests/visual-tests --update-snapshots
```

## Retry Mechanism

The screenshot service implements a retry mechanism:
1. **Page Stabilization**: Waits for network idle, animations, and fonts to load
2. **Comparison Retry**: If comparison fails, retries up to 5 times with 2-second delays
3. **Error Reporting**: After all retries fail, reports detailed error

## Best Practices

1. **Tag all visual tests** with `@visual` for easy filtering
2. **Use descriptive names** for screenshots
3. **Organize by page** for better maintainability
4. **Review diffs carefully** when tests fail - some changes may be intentional
5. **Update baselines** after verified UI changes
6. **Use appropriate deviation** based on test requirements

# Test Automation Strategy - SauceDemo

## Overview
This document outlines the testing strategy, approach, and rationale for the SauceDemo test automation framework.

---

## Testing Approach

### Primary User: `standard_user`
All functional tests use `standard_user` to test the **actual application behavior** and business logic.

**Rationale:**
- Tests real user workflows and application functionality
- Validates expected behavior, not intentional bugs
- Represents typical user interactions in production
- Ensures comprehensive coverage of critical paths

### Secondary User: `locked_out_user`
Used exclusively for **negative authentication testing** to validate error handling.

**Usage:**
- Login error scenarios
- Access control validation
- Security testing

---

## Test Validation Strategy

### Mutation Testing Approach
Different user types (`problem_user`, `error_user`, `visual_user`, `performance_glitch_user`) are used **only for validating test quality**, not as part of the main test suite.

**Purpose:**
- Verify tests properly detect UI issues (problem_user)
- Confirm tests catch application errors (error_user)
- Validate visual regression detection (visual_user)
- Test performance monitoring capabilities (performance_glitch_user)

**These users are NOT included in the main test suite because:**
- They represent intentionally broken behavior
- Testing broken users doesn't validate application logic
- Not representative of real-world testing scenarios
- Would create false negatives in CI/CD pipelines

---

## Test Organization

### Test Categories

#### 1. Positive Tests (`@positive` tag)
- Happy path scenarios
- Valid user workflows
- Expected successful outcomes
- **Coverage:** ~48% of test suite (72 tests)

**Examples:**
- User successfully logs in with valid credentials
- User adds products to cart and completes checkout
- User navigates through application pages
- Visual regression tests for expected UI states

#### 2. Negative Tests (`@negative` tag)
- Invalid inputs and error conditions
- Validation error handling
- Security and access control
- **Coverage:** ~12% of test suite (18 tests)

**Examples:**
- Login with invalid credentials
- Submit checkout form with missing fields
- Access protected pages without authentication
- Invalid product ID navigation

#### 3. Edge Cases (`@edge-case` tag)
- Boundary conditions
- Unusual but valid scenarios
- Browser behavior (back/forward navigation)
- State management and persistence
- **Coverage:** ~10% of test suite (15 tests)

**Examples:**
- Empty cart checkout prevention
- Browser back button during checkout
- Session persistence across page reloads
- Direct URL navigation without authentication
- Badge visibility with zero items

#### 4. Visual Tests (`@visual` tag)
- Screenshot comparison testing
- Cross-browser visual consistency
- UI regression detection
- **Coverage:** ~40% of test suite (60+ tests)

**Examples:**
- Login page visual baseline
- Products page with different sort orders
- Cart page with multiple items
- Checkout workflow visual validation

#### 5. Performance Tests (`@performance` tag)
- Page load time measurement
- Performance monitoring
- Load time assertions
- **Coverage:** ~2% of test suite (3 tests)

**Examples:**
- Products page loads under 2000ms
- Checkout workflow performance metrics
- Page interaction response times

#### 6. Known Issues (`@known-issue` tag)
- Documented application bugs
- Visual inconsistencies
- Behavior quirks
- **Coverage:** ~4% of test suite (6 tests)

**Examples:**
- Logout button alignment issues
- Footer copyright text variations
- Browser-specific rendering differences

---

## Test Coverage

### Total Test Count: 150+ Tests

#### Feature Distribution
- **Authentication:** 10 tests (7%)
  - Login validation (positive/negative)
  - Logout functionality
  - Session management
  - Visual regression tests
  
- **Cart:** 19 tests (13%)
  - Add/remove items
  - Cart state management
  - Navigation and persistence
  - Empty cart handling
  - Edge cases (badge visibility, invalid items)
  - Visual regression tests
  
- **Checkout:** 27 tests (18%)
  - User information validation
  - Order summary and calculations
  - Multi-step workflow
  - Form validation
  - Edge cases (back navigation, direct URL access)
  - Visual regression tests
  
- **Products:** 25 tests (17%)
  - Product display and details
  - Sorting and filtering
  - Cart integration
  - Edge cases (invalid product IDs, state persistence)
  - Visual regression tests
  
- **Navigation:** 6 tests (4%)
  - Burger menu functionality
  - Page routing
  - Deep linking
  
- **Performance:** 3 tests (2%)
  - Products page load time
  - Checkout workflow performance
  - Page interaction metrics
  
- **Visual Tests:** 60+ tests (40%)
  - Login page visual regression
  - Products page visual regression
  - Product details visual regression
  - Cart page visual regression
  - Checkout pages visual regression
  - Cross-browser testing (Chromium, Safari Mobile)

---

## Test Architecture

### Page Object Model (POM)
```
src/pages/
├── base-page.ts              # Abstract base with screenshot functionality
├── login-page.ts
├── cart-page.ts
├── products/
│   ├── products-page.ts
│   └── product-details-page.ts
├── checkout/
│   ├── checkout-user-information-page.ts
│   ├── checkout-details-page.ts
│   └── checkout-success-page.ts
└── components/
    └── burger-menu.ts        # Reusable component
```

**Benefits:**
- Separation of concerns
- Reusable components
- Easy maintenance
- Consistent patterns
- All methods have explicit scope modifiers (public/private)

### Services Layer
```
src/services/
└── screenshot-service.ts     # Centralized screenshot management
```

**Features:**
- Retry logic for screenshot comparison (5 attempts, 2000ms delay)
- Organized screenshot storage by test file and browser
- Automatic directory creation

### Utils Layer
```
src/utils/
├── wait-utils.ts             # Wait helpers and utilities
└── performance-utils.ts      # Performance testing utilities
```

**PerformanceUtils Features:**
- Timer management (start, stop, reset)
- Load time assertions
- Elapsed time tracking

### Data-Driven Testing
- Test data separated from test logic
- Parameterized test cases
- Reduces code duplication
- Easy to extend with new scenarios

**Example:**
```typescript
const validationTestCases = [
  { field: 'firstName', error: 'First Name is required' },
  { field: 'lastName', error: 'Last Name is required' },
  { field: 'postalCode', error: 'Postal Code is required' }
];
```

### Fixtures
- Page objects initialized via fixtures
- Consistent setup/teardown
- Dependency injection
- Test isolation

---

## Test Execution

### Tags for Selective Execution

```bash
# Run only positive tests (smoke suite)
npx playwright test --grep @positive

# Run only negative tests
npx playwright test --grep @negative

# Run only edge cases
npx playwright test --grep @edge-case

# Run visual regression tests
npx playwright test --grep @visual

# Run performance tests (chromium only)
npm run test:performance

# Run specific feature tests
npx playwright test --grep @authentication
npx playwright test --grep @cart
npx playwright test --grep @checkout
npx playwright test --grep @products
npx playwright test --grep @navigation

# Run specific combinations
npx playwright test --grep "@positive|@negative"

# Exclude edge cases (faster CI runs)
npx playwright test --grep-invert @edge-case

# Exclude known issues
npx playwright test --grep-invert @known-issue
```

### CI/CD Strategy
1. **Fast Feedback:** Run `@positive` tests first (~10-12 min)
2. **Full Validation:** Run all tests on merge to main
3. **Visual Regression:** Automatic on every push/PR
4. **Performance Testing:** Run on chromium only (--project=chromium)
5. **Scheduled:** Run full suite + edge cases nightly

### GitHub Actions Workflow
- **Trigger:** Push to main/master/develop branches, PRs, manual dispatch
- **Runner:** Windows-latest (matches local development environment)
- **Node Version:** 18
- **Timeout:** 60 minutes
- **Artifacts:** HTML report (30 days retention), test results (7 days on failure)
- **Deployment:** Automatic deployment to GitHub Pages for HTML reports
- **Permissions:** Contents write, Pages write, ID token write

---

## Quality Metrics

### Test Reliability
- All tests use `standard_user` for consistent behavior
- Proper waits and assertions (no hardcoded sleeps)
- Network idle and DOM content loaded checks
- Isolated test data per test
- Visual regression testing with baseline comparison
- Performance benchmarking with thresholds

### Code Quality
- TypeScript for type safety
- ESLint/Prettier for code formatting
- Consistent naming conventions
- DRY principle (Don't Repeat Yourself)
- Explicit method scope modifiers (public/private/protected)
- Path aliases (@/ for src, @data for test data)

### Maintainability
- Clear test descriptions
- Logical file organization
- Reusable page objects and components
- Centralized test data
- Comprehensive tagging system (functionality + behavior)
- Separation of concerns (pages, services, utils)

### Playwright Configuration
- **Retries:** 0 (fail fast for quicker feedback)
- **Workers:** undefined (uses optimal default)
- **Trace:** retain-on-failure (debug failed tests)
- **Video:** retain-on-failure (visual debugging)
- **Screenshots:** Organized by test file and browser project
- **Viewports:** 
  - Chromium: 1280x720 (desktop)
  - Safari Mobile: 393x852 (iPhone 14 Pro Max)
- **Base URL:** https://www.saucedemo.com

---

## Future Enhancements

### Completed Features
1.  **Cross-Browser Testing:** Chromium desktop and Safari Mobile viewports
2.  **Mobile Viewport Testing:** Safari Mobile (393x852) responsive testing
3.  **Visual Regression:** Screenshot comparisons with retry logic
4.  **Performance Testing:** Page load times with PerformanceUtils
5.  **CI/CD Pipeline:** GitHub Actions with automated deployments
6.  **GitHub Pages:** Automatic HTML report hosting

### Potential Additions
1. **Additional Browsers:** Firefox, WebKit (Safari desktop)
2. **Accessibility Testing:** ARIA labels, keyboard navigation, color contrast
3. **API Testing:** Backend validation alongside UI tests
4. **Test Reporting:** Custom Allure reports or similar
5. **Parallel Execution Optimization:** Sharding strategies for faster runs
6. **Test Data Management:** Database seeding for complex scenarios

### Out of Scope (Intentionally)
- Tests for intentionally broken users (problem_user, error_user, etc.)
- UI mutation testing with broken users
- Performance glitch simulation testing

**Reason:** These scenarios don't validate actual application behavior and are not representative of real-world testing needs.

---

## Visual Regression Testing

### Screenshot Organization
```
data/screenshots/
├── authentication/
│   └── login.spec.ts/
│       ├── chromium/
│       │   ├── login-page.png
│       │   └── error-state.png
│       └── safari-mobile/
│           ├── login-page.png
│           └── error-state.png
├── products/
│   ├── products.spec.ts/
│   └── products-visual.spec.ts/
├── cart/
├── checkout/
└── ...
```

**Strategy:**
- Baselines stored in git repository
- Organized by test file path and browser project
- CI runs on Windows-latest to match local environment
- Prevents false positives from cross-platform rendering differences
- Comparison thresholds: maxDiffPixels=100, threshold=0.001

---

## Performance Testing

### Metrics Tracked
- **Products Page Load Time:** Must load under 2000ms
- **Checkout Workflow Performance:** End-to-end timing
- **Page Interaction Response:** User action timing

### PerformanceUtils API
```typescript
await performanceUtils.startTimer();
// ... perform actions
const elapsed = await performanceUtils.getElapsedTime();
await performanceUtils.assertLoadTime(2000, 'Products page load');
await performanceUtils.reset();
```

**Best Practices:**
- Run performance tests on chromium only (consistent baseline)
- Use dedicated test:performance npm script
- Exclude from mobile viewport testing
- Set reasonable thresholds based on network conditions

---

## Conclusion

This test automation strategy focuses on **validating real application behavior** using `standard_user` while maintaining comprehensive coverage across positive scenarios, negative validations, edge cases, visual regression, and performance testing. The framework is built with industry best practices including Page Object Model, data-driven testing, clear test organization, and robust CI/CD integration.

### Key Achievements
- **150+ comprehensive tests** covering all major application features
- **Dual tagging system** (functionality + behavior) for flexible test execution
- **Visual regression testing** across multiple browsers and viewports
- **Performance monitoring** with automated assertions
- **GitHub Actions integration** with Windows-latest runner for consistent results
- **Automatic HTML report deployment** to GitHub Pages
- **Production-grade code quality** with TypeScript, explicit scope modifiers, and clean architecture

The use of broken user types is reserved exclusively for **test validation and mutation testing**, ensuring the test suite itself is robust and properly detects issues when they occur.

### Quick Start Commands
```bash
# Run all tests
npm run test

# Run specific test suites
npx playwright test --grep @positive
npx playwright test --grep @visual
npm run test:performance

# View latest report
npx playwright show-report

# GitHub Pages report
https://georgidrumev.github.io/Playwright-test-automation-framework-for-SauceDemo/
```

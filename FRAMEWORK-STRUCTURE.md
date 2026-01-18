# Design Patterns & Architectural Decisions

## Table of Contents
1. [Testing Approach](#testing-approach)
2. [Design Patterns](#design-patterns)
3. [Testing Techniques](#testing-techniques)
4. [Framework Architecture](#framework-architecture)
5. [Assumptions and Limitations](#assumptions-and-limitations)

---

## Testing Approach

### Test Types
- **UI E2E Tests** - End-to-end user workflows covering authentication, cart, checkout, products, and navigation
- **Visual Regression Tests** - Screenshot comparison testing to detect unintended UI changes
- **Performance Tests** - Products page load time testing, where many products can be listed

### Test Configurations
Tests are run on 2 different configurations:
- **Desktop Chromium** (1280x720)
- **Mobile Safari** (393x852)

### Test Isolation
Each worker has a different session, and each test has a different session so it starts clean. Nothing is saved in the backend.

---

## Design Patterns

### 1. Page Object Model (POM)
**Implementation:**
- All page classes in `src/pages/` directory
- Encapsulates locators, actions, and assertions per page

**Rationale:**
Using page objects to store locators, assertions, and page logic. Because the structure is not scalable I am not overengineering it to separate the class into Components/elements, locators, validator. The only component shared is the burger menu. I am following the rule maximum value with minimal complexity and KISS.

**Benefits:**
- Promotes code reusability and maintainability
- Single source of truth for page interactions
- Easy to update when UI changes

### 2. Template Method Pattern
**Implementation:**
- `BasePage` defines the abstract base with common methods
- Subclasses implement abstract `screenshotFolder` property
- `compareScreenshot()` method follows template algorithm

**Benefits:**
- Enforces consistent behavior across all pages
- Allows customization through inheritance
- Reduces code duplication

### 3. Dependency Injection (Fixture Pattern)
**Implementation:**
- `base-ui-test.ts` provides dependency injection
- Page objects initialized via fixtures
- Ensures proper setup/teardown and test isolation

**Benefits:**
- Clean test code without manual initialization
- Automatic resource management
- Consistent test environment

### 4. Service Layer Pattern
**Implementation:**
- `ScreenshotService` for centralized screenshot management
- Separates infrastructure concerns from page logic
- Provides retry logic for flaky operations

**Benefits:**
- Single responsibility principle
- Reusable services across different pages
- Easier to test and maintain

### 5. Component Pattern (Composite)
**Implementation:**
- `BurgerMenu` as reusable component
- Shared across multiple pages
- Reduces duplication for common UI elements

**Benefits:**
- DRY principle (Don't Repeat Yourself)
- Consistent behavior for shared components
- Easy to update common elements

### 6. Retry Pattern
**Implementation:**
- `ScreenshotService` with configurable retry attempts (5 retries, 2000ms delay)
- Handles flaky screenshot comparisons
- Improves test stability

**Benefits:**
- Handles transient failures gracefully
- Improves test reliability
- Reduces false negatives

### 7. Repository Pattern (Adapted)
**Implementation:**
- Test data files act as data repositories
- Centralized data access through module imports
- Single source of truth for test data

**Rationale:**
There are no available APIs to fetch data like products. So I am having the data in files located in data folder (credentials, products, error messages).

**Benefits:**
- Centralized test data management
- Easy to update and maintain
- Type-safe with TypeScript

---

## Testing Techniques

### Data-Driven Testing
**Implementation:**
- Centralized test data in `data/` folder
- Parameterized tests using data arrays
- Test data separated from test logic

**Example:**
```typescript
const validationTestCases = [
  { field: 'firstName', error: 'Error: First Name is required' },
  { field: 'lastName', error: 'Error: Last Name is required' },
  { field: 'postalCode', error: 'Error: Postal Code is required' }
];

validationTestCases.forEach(({ field, error }) => {
  test(`should show error when ${field} is missing`, async ({ checkoutUserInformationPage }) => {
    // Test implementation
  });
});
```

**Benefits:**
- Easy to extend test scenarios without code changes
- Reduces code duplication
- Improves test coverage with minimal effort
- Better test maintainability

### Helper/Utility Classes
**Implementation:**
- `WaitUtils` for reusable wait logic
- `PerformanceUtils` for timing and performance assertions
- Shared utilities across test suite

**Benefits:**
- Consistent wait strategies
- Reusable performance measurement
- Cleaner test code

---

## Framework Architecture

### Directory Structure
```
src/
├── pages/              # Page Objects
│   ├── base-page.ts
│   ├── login-page.ts
│   ├── cart-page.ts
│   ├── products/
│   ├── checkout/
│   └── components/
├── services/           # Service Layer
│   └── screenshot-service.ts
├── utils/              # Utilities
│   ├── wait-utils.ts
│   └── performance-utils.ts
├── fixtures/           # Test Fixtures
│   └── base-ui-test.ts
└── types/              # Type Definitions

data/                   # Test Data Repository
├── user-data.ts
├── product-data.ts
├── error-messages.ts
└── screenshots/        # Visual Baselines

tests/                  # Test Suites
├── authentication/
├── cart/
├── checkout/
├── products/
├── navigation/
├── performance/
└── visual-tests/
```

### Code Quality Practices
- **TypeScript** for type safety
- **Explicit scope modifiers** (public/private/protected) for all methods
- **Path aliases** (@/ for src, @data for test data)
- **Consistent naming conventions**
- **KISS principle** (Keep It Simple, Stupid)

---

## Assumptions and Limitations

### Assumptions
1. **Application Architecture** - Data is stored in the frontend (FE), not in a backend database. Each worker has a different session, and each test has a different session so it starts clean. Nothing is saved in the backend.
2. **Application Stability** - SauceDemo is a stable demo application with consistent behavior
3. **Network Conditions** - Tests assume reasonable network speeds (performance tests set threshold at 2000ms)
4. **Browser Support** - Focus on Chromium (desktop) and Safari Mobile; other browsers not tested but can be added easily. 
5. **Test Data** - Product data, prices, and error messages remain constant (no dynamic API)
6. **CI Environment** - GitHub Actions runner (windows-latest) matches local development environment
7. **Visual Baselines** - Screenshots generated on Windows are the source of truth
8. **Test Isolation** - Each test runs in isolation with clean browser context; no shared state between tests

### Limitations
1. **No API Testing** - Application doesn't provide APIs; all testing is UI-based
2. **Frontend-Only Data Storage** - Application stores data in frontend only; cannot verify backend persistence since there is no backend database
3. **Static Test Data** - Product catalog is hardcoded in test data files; changes to the app require data file updates
4. **Single User Flow** - Tests don't cover multi-user scenarios or concurrent sessions
5. **Performance Testing Scope** - Limited to products page; doesn't cover all pages or workflows
6. **Known Issues** - 6 tests tagged with `@known-issue` document application bugs but don't fail the build
7. **Cross-Platform Visuals** - Visual tests require Windows CI to match local baselines; won't work on Linux/Mac CI runners

### Framework Limitations
1. **Scale Limitation** - Current POM structure suitable for small-to-medium applications
2. **Screenshot Storage** - Baseline screenshots stored in git; large test suites may bloat repository size
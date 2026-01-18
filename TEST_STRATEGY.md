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
- **Coverage:** ~65% of test suite (39 tests)

**Examples:**
- User successfully logs in with valid credentials
- User adds products to cart and completes checkout
- User navigates through application pages

#### 2. Negative Tests (`@negative` tag)
- Invalid inputs and error conditions
- Validation error handling
- Security and access control
- **Coverage:** ~17% of test suite (10 tests)

**Examples:**
- Login with invalid credentials
- Submit checkout form with missing fields
- Access protected pages without authentication

#### 3. Edge Cases (`@edge-case` tag)
- Boundary conditions
- Unusual but valid scenarios
- Browser behavior (back/forward navigation)
- State management and persistence
- **Coverage:** ~18% of test suite (11 tests)

**Examples:**
- Empty cart checkout prevention
- Browser back button during checkout
- Session persistence across page reloads
- Direct URL navigation without authentication

---

## Test Coverage

### Total Test Count: 60 Tests

#### Feature Distribution
- **Authentication:** 8 tests (13%)
  - Login validation (positive/negative)
  - Logout functionality
  - Session management
  
- **Cart:** 15 tests (25%)
  - Add/remove items
  - Cart state management
  - Navigation and persistence
  - Empty cart handling
  
- **Checkout:** 15 tests (25%)
  - User information validation
  - Order summary and calculations
  - Multi-step workflow
  - Form validation
  
- **Products:** 13 tests (22%)
  - Product display and details
  - Sorting and filtering
  - Cart integration
  
- **Navigation:** 6 tests (10%)
  - Burger menu functionality
  - Page routing
  - Deep linking
  
- **Product Details:** 4 tests (7%)
  - Product information display
  - Add to cart from details
  - Navigation

---

## Test Architecture

### Page Object Model (POM)
```
src/pages/
├── base-page.ts              # Abstract base with common functionality
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

# Run specific combinations
npx playwright test --grep "@positive|@negative"

# Exclude edge cases (faster CI runs)
npx playwright test --grep-invert @edge-case
```

### CI/CD Strategy
1. **Fast Feedback:** Run `@positive` tests first (~5-7 min)
2. **Full Validation:** Run all tests on merge to main
3. **Scheduled:** Run full suite + edge cases nightly

---

## Quality Metrics

### Test Reliability
- All tests use `standard_user` for consistent behavior
- Proper waits and assertions (no hardcoded sleeps)
- Network idle and DOM content loaded checks
- Isolated test data per test

### Code Quality
- TypeScript for type safety
- ESLint/Prettier for code formatting
- Consistent naming conventions
- DRY principle (Don't Repeat Yourself)

### Maintainability
- Clear test descriptions
- Logical file organization
- Reusable page objects and components
- Centralized test data

---

## Future Enhancements

### Potential Additions
1. **Cross-Browser Testing:** Firefox, WebKit (Safari)
2. **Mobile Viewport Testing:** Responsive design validation
3. **Accessibility Testing:** ARIA labels, keyboard navigation
4. **Visual Regression:** Screenshot comparisons
5. **Performance Testing:** Page load times, metrics
6. **API Testing:** Backend validation alongside UI tests

### Out of Scope (Intentionally)
- Tests for intentionally broken users (problem_user, error_user, etc.)
- UI mutation testing with broken users
- Performance glitch simulation testing

**Reason:** These scenarios don't validate actual application behavior and are not representative of real-world testing needs.

---

## Conclusion

This test automation strategy focuses on **validating real application behavior** using `standard_user` while maintaining comprehensive coverage across positive scenarios, negative validations, and edge cases. The framework is built with industry best practices including Page Object Model, data-driven testing, and clear test organization.

The use of broken user types is reserved exclusively for **test validation and mutation testing**, ensuring the test suite itself is robust and properly detects issues when they occur.

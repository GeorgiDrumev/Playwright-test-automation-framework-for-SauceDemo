# Logout Test Cases

## Positive Scenarios

### TC-LOGOUT-001: Logout Successfully
**Objective:** Verify user can successfully logout from the application

**Preconditions:**
- User is logged in to the application
- User is on the Products page

**Test Steps:**
1. Login with valid credentials (standard_user/secret_sauce)
2. Verify user is on Products page
3. Click on burger menu icon
4. Click on "Logout" link

**Expected Results:**
- User is redirected to login page
- Login form is visible (username input, password input, login button)
- User session is cleared
- User cannot navigate back to authenticated pages

---

## Test Data

| Test Case | Precondition | Action | Expected Result |
|-----------|--------------|--------|-----------------|
| TC-LOGOUT-001 | User logged in | Click Logout from burger menu | Redirect to login page |

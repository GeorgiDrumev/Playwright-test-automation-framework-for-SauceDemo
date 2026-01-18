# Login Test Cases

## Positive Scenarios

### TC-LOGIN-001: Login with Valid Credentials
**Objective:** Verify user can successfully login with valid credentials

**Preconditions:**
- User is on the login page
- User has valid credentials (standard_user/secret_sauce)

**Test Steps:**
1. Navigate to login page
2. Enter valid username: "standard_user"
3. Enter valid password: "secret_sauce"
4. Click Login button

**Expected Results:**
- User is redirected to Products page
- Products page title "Products" is visible
- Product inventory is displayed

---

## Negative Scenarios

### TC-LOGIN-002: Login with Invalid Username
**Objective:** Verify appropriate error is shown when user enters invalid username

**Preconditions:**
- User is on the login page

**Test Steps:**
1. Navigate to login page
2. Enter invalid username: "invalid_user"
3. Enter valid password: "secret_sauce"
4. Click Login button

**Expected Results:**
- Error message is displayed: "Epic sadface: Username and password do not match any user in this service"
- User remains on login page

---

### TC-LOGIN-003: Login with Invalid Password
**Objective:** Verify appropriate error is shown when user enters invalid password

**Preconditions:**
- User is on the login page

**Test Steps:**
1. Navigate to login page
2. Enter valid username: "standard_user"
3. Enter invalid password: "wrong_password"
4. Click Login button

**Expected Results:**
- Error message is displayed: "Epic sadface: Username and password do not match any user in this service"
- User remains on login page

---

### TC-LOGIN-004: Login with Empty Username
**Objective:** Verify appropriate error is shown when username field is empty

**Preconditions:**
- User is on the login page

**Test Steps:**
1. Navigate to login page
2. Leave username field empty
3. Enter valid password: "secret_sauce"
4. Click Login button

**Expected Results:**
- Error message is displayed: "Epic sadface: Username is required"
- User remains on login page

---

### TC-LOGIN-005: Login with Empty Password
**Objective:** Verify appropriate error is shown when password field is empty

**Preconditions:**
- User is on the login page

**Test Steps:**
1. Navigate to login page
2. Enter valid username: "standard_user"
3. Leave password field empty
4. Click Login button

**Expected Results:**
- Error message is displayed: "Epic sadface: Password is required"
- User remains on login page

---

### TC-LOGIN-006: Login with Locked Out User
**Objective:** Verify locked out user cannot login

**Preconditions:**
- User is on the login page

**Test Steps:**
1. Navigate to login page
2. Enter locked out username: "locked_out_user"
3. Enter valid password: "secret_sauce"
4. Click Login button

**Expected Results:**
- Error message is displayed: "Epic sadface: Sorry, this user has been locked out."
- User remains on login page

---

## Test Data

| Test Case | Username | Password | Expected Result |
|-----------|----------|----------|-----------------|
| TC-LOGIN-001 | standard_user | secret_sauce | Success - Redirect to Products |
| TC-LOGIN-002 | invalid_user | secret_sauce | Error - Invalid credentials |
| TC-LOGIN-003 | standard_user | wrong_password | Error - Invalid credentials |
| TC-LOGIN-004 | (empty) | secret_sauce | Error - Username required |
| TC-LOGIN-005 | standard_user | (empty) | Error - Password required |
| TC-LOGIN-006 | locked_out_user | secret_sauce | Error - User locked out |

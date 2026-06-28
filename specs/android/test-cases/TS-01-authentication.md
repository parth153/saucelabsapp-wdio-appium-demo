# TS-01: Authentication / Login

**Suite**: Authentication  
**Screen**: Login Screen  
**Automation file**: `src/tests/login.spec.ts`  
**POM**: `src/screens/LoginScreen.ts`  

---

## Screen Elements

| Element | Accessibility ID |
|---|---|
| Username field | `test-Username` |
| Password field | `test-Password` |
| LOGIN button | `test-LOGIN` |
| Error message | `test-Error message` |

---

## TC-001 — Successful Login (standard_user)

**Priority**: P0 | **Status**: Automated  

**Preconditions**: App is on Login screen (fresh launch or after reset)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap Username field, type `standard_user` | Field shows `standard_user` |
| 2 | Tap Password field, type `secret_sauce` | Field shows masked characters |
| 3 | Tap the LOGIN button | Loading indicator appears briefly |
| 4 | Wait for navigation | Products screen is shown; LOGIN button no longer visible |

**Pass Criteria**: `ProductsScreen.isDisplayed()` returns `true`

---

## TC-002 — Locked Out User Blocked

**Priority**: P0 | **Status**: Automated  

**Preconditions**: App is on Login screen

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap Username field, type `locked_out_user` | Field shows `locked_out_user` |
| 2 | Tap Password field, type `secret_sauce` | Field shows masked characters |
| 3 | Tap LOGIN | Error banner appears below the password field |
| 4 | Read error text | Text contains `"Sorry, this user has been locked out."` |

**Pass Criteria**: Error message is visible and contains the locked-out text

---

## TC-003 — Wrong Password Shows Error

**Priority**: P0 | **Status**: Automated  

**Preconditions**: App is on Login screen

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap Username field, type `standard_user` | Field shows `standard_user` |
| 2 | Tap Password field, type `wrong_password` | Field shows masked characters |
| 3 | Tap LOGIN | Error banner appears |
| 4 | Read error text | Text contains `"Username and password do not match any user in this service"` |

**Pass Criteria**: Correct error message shown; user remains on Login screen

---

## TC-004 — Empty Username Required

**Priority**: P0 | **Status**: Automated  

**Preconditions**: App is on Login screen; both fields empty

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap LOGIN without entering any credentials | Error banner appears immediately |
| 2 | Read error text | Text contains `"Username is required"` |

**Pass Criteria**: Error shown without navigating away from login

---

## TC-005 — Empty Password Required

**Priority**: P0 | **Status**: Automated  

**Preconditions**: App is on Login screen

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap Username field, type `standard_user` | Username populated |
| 2 | Leave Password field empty | Password field is blank |
| 3 | Tap LOGIN | Error banner appears |
| 4 | Read error text | Text contains `"Password is required"` |

**Pass Criteria**: Specific "Password is required" error shown (not username error)

---

## TC-006 — Both Fields Empty

**Priority**: P1 | **Status**: Automated  

**Preconditions**: App is on Login screen

| Step | Action | Expected Result |
|---|---|---|
| 1 | Confirm both fields are empty | — |
| 2 | Tap LOGIN | Error banner appears |
| 3 | Read error text | Text contains `"Username is required"` (username validated first) |

**Pass Criteria**: Username error shown first when both fields empty

---

## TC-007 — Error Clears on Correct Credentials

**Priority**: P1 | **Status**: Automated  

**Preconditions**: App is on Login screen

| Step | Action | Expected Result |
|---|---|---|
| 1 | Type `standard_user` + `wrong_password` → tap LOGIN | Error banner shown |
| 2 | Clear password field | — |
| 3 | Type `secret_sauce` | — |
| 4 | Tap LOGIN | Error banner disappears; navigates to Products screen |

**Pass Criteria**: Products screen reached after correcting credentials

---

## TC-008 — Logout Returns to Login Screen

**Priority**: P0 | **Status**: Automated  

**Preconditions**: User is logged in as `standard_user` on Products screen

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap hamburger menu icon | Side drawer opens |
| 2 | Tap LOGOUT | Login screen is shown |
| 3 | Press device back button | App either stays on Login or exits; does NOT navigate back to Products |

**Pass Criteria**: Login screen shown after logout; session cleared

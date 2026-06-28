# Test Plan: Swag Labs Mobile App (Android)

**App**: Swag Labs Mobile App  
**Package**: `com.swaglabsmobileapp`  
**Version**: 2.7.1  
**APK**: `apps/android/SauceLabs-Demo-2.7.1.apk`  
**Automation Framework**: Appium 2 + WebdriverIO 8 + UiAutomator2 + TypeScript  
**Target Device**: Pixel 7 Pro, Android 13 (API 33)  
**Analysis Date**: 2026-06-27  

---

## Compatibility

| Android Version | API | Result |
|---|---|---|
| Android 13 | 33 | **Works** — recommended target |
| Android 14 | 34 | Expected to work (same page size) |
| Android 15+ | 35+ | **Crashes** — 16 KB page alignment required; `libfolly_json.so` and `libhermes.so` fail to load |

> Always use API 33 or 34 emulators. The `wdio.android.conf.ts` already targets `platformVersion: '13.0'`.

---

## App Overview

Swag Labs is a React Native demo e-commerce app with intentionally defective user personas for testing. All screens share a consistent header (hamburger menu, Swag Labs logo, cart icon) and a social footer (Twitter, Facebook, Google+, LinkedIn / © 2026 Sauce Labs).

### User Accounts (Login Screen Autofill)

The login screen lists accepted usernames at the bottom with **tap-to-autofill** — tapping a username fills both username and password fields automatically.

| Username | Password | Behaviour |
|---|---|---|
| `standard_user` | `secret_sauce` | Fully functional |
| `locked_out_user` | `secret_sauce` | Blocked at login with error message |
| `problem_user` | `secret_sauce` | Broken product images; some interactions broken |
| `performance_glitch_user` | `secret_sauce` | Artificial 4–8 s delay on login |
| `error_user` | `secret_sauce` | Errors on cart/checkout interactions |
| `visual_user` | `secret_sauce` | Subtle visual defects throughout |

### Screen Map

```
SplashActivity
  └─ LoginScreen
       └─ ProductsScreen (catalog grid)
            ├─ SortModal (Name A→Z / Z→A / Price low→high / high→low)
            ├─ ProductDetailScreen
            │    └─ (ADD TO CART → cart badge updates)
            ├─ CartScreen (YOUR CART)
            │    ├─ CONTINUE SHOPPING → ProductsScreen
            │    └─ CHECKOUT → CheckoutStep1
            │         └─ CheckoutStep2 (OVERVIEW)
            │              └─ CheckoutComplete (CHECKOUT: COMPLETE!)
            └─ SideMenuDrawer
                 ├─ ALL ITEMS → ProductsScreen
                 ├─ WEBVIEW
                 ├─ QR CODE SCANNER
                 ├─ GEO LOCATION
                 ├─ DRAWING
                 ├─ ABOUT
                 ├─ LOGOUT → LoginScreen
                 └─ RESET APP STATE
```

### Product Catalogue (6 items)

| Product | Price |
|---|---|
| Sauce Labs Backpack | $29.99 |
| Sauce Labs Bike Light | $9.99 |
| Sauce Labs Bolt T-Shirt | $15.99 |
| Sauce Labs Fleece Jacket | $49.99 |
| Sauce Labs Onesie | $7.99 |
| Test.allTheThings() T-Shirt (Red) | $15.99 |

### Key UI Elements & Accessibility IDs

| Element | Appium ID |
|---|---|
| Login container | `test-Login` |
| Username field | `test-Username` |
| Password field | `test-Password` |
| Login button | `test-LOGIN` |
| Error message | `test-Error message` |
| Products scroll | `test-PRODUCTS` |
| Product item | `test-Item` |
| Product title | `test-Item title` |
| Product price | `test-Price` |
| Drag handle | `test-Drag Handle` |
| Add to cart | `test-ADD TO CART` |
| Remove button | `test-REMOVE` |
| Sort button | `test-Modal Selector Button` |
| Layout toggle | `test-Toggle` |
| Cart icon | `test-Cart` |
| Cart drop zone | `test-Cart drop zone` |
| Menu button | `test-Menu` |
| Continue shopping | `test-CONTINUE SHOPPING` |
| Checkout button | `test-CHECKOUT` |
| First name field | `test-First Name` |
| Last name field | `test-Last Name` |
| Zip/postal field | `test-Zip/Postal Code` |
| Continue button | `test-CONTINUE` |
| Cancel button | `test-CANCEL` |
| Finish button | `test-FINISH` |

---

## Known Bugs Found During Analysis

| # | Screen | Bug | Severity |
|---|---|---|---|
| BUG-001 | Checkout Complete | Text reads **"THANK YOU FOR YOU ORDER"** — missing "R" in "YOUR" | Low (cosmetic) |

---

## Test Cases

### TS-01: Authentication / Login

**Spec file**: `src/tests/login.spec.ts`

| ID | Test Case | User | Expected Result | Priority |
|---|---|---|---|---|
| TC-001 | Successful login | `standard_user` | Navigates to Products screen | P0 |
| TC-002 | Locked out user | `locked_out_user` | Error: `"Sorry, this user has been locked out."` | P0 |
| TC-003 | Wrong password | `standard_user` | Error: `"Username and password do not match any user in this service"` | P0 |
| TC-004 | Empty username | — | Error: `"Username is required"` | P0 |
| TC-005 | Empty password | `standard_user` | Error: `"Password is required"` | P0 |
| TC-006 | Both fields empty | — | Error: `"Username is required"` | P1 |
| TC-007 | Error clears on correction | `standard_user` | Error banner disappears; login succeeds | P1 |
| TC-008 | Tap-to-autofill fills both fields | `standard_user` | Both username AND password populate | P1 |
| TC-009 | Logout returns to login | `standard_user` | Login screen shown; back button cannot return to products | P0 |
| ~~TC-010~~ | ~~Performance glitch login~~ | ~~`performance_glitch_user`~~ | Excluded: delay exceeds emulator capacity | P1 |
| ~~TC-011~~ | ~~X button clears field~~ | ~~`standard_user`~~ | Excluded: clear button not in Android accessibility tree | P2 |

---

### TS-02: Products Catalog

**Spec file**: `src/tests/products.spec.ts`

| ID | Test Case | User | Expected Result | Priority |
|---|---|---|---|---|
| TC-012 | 6 products displayed | `standard_user` | Exactly 6 products in 2-column grid | P0 |
| TC-013 | Each card has name, price, image | `standard_user` | Name, price (e.g. $9.99), product image visible | P0 |
| TC-014 | Sort — Name A→Z | `standard_user` | Backpack, Bike Light, Bolt T-Shirt, Fleece Jacket, Onesie, Test.all... | P1 |
| TC-015 | Sort — Name Z→A | `standard_user` | Products in reverse alphabetical order | P1 |
| TC-016 | Sort — Price low→high | `standard_user` | Onesie $7.99 first, Fleece Jacket $49.99 last | P1 |
| TC-017 | Sort — Price high→low | `standard_user` | Fleece Jacket $49.99 first, Onesie $7.99 last | P1 |
| TC-018 | Sort modal cancel | `standard_user` | Modal dismisses, sort unchanged | P2 |
| TC-019 | ADD TO CART from catalog | `standard_user` | Cart badge shows `1`; button changes to REMOVE | P0 |
| TC-020 | REMOVE from catalog | `standard_user` | Cart badge gone; button resets to ADD TO CART | P0 |
| TC-021 | Cart badge increments correctly | `standard_user` | Badge shows `3` after adding 3 items | P0 |
| TC-022 | Problem user image defects | `problem_user` | Product images show wrong/mismatched content | P1 |
| TC-023 | Layout toggle (grid/list) | `standard_user` | Layout switches between 2-column grid and list view | P2 |

---

### TS-03: Product Detail

**Spec file**: `src/tests/productDetail.spec.ts`

| ID | Test Case | User | Expected Result | Priority |
|---|---|---|---|---|
| TC-024 | Open detail by tapping image | `standard_user` | Product detail screen opens | P0 |
| TC-025 | Open detail by tapping name | `standard_user` | Product detail screen opens | P0 |
| TC-026 | Detail shows correct content | `standard_user` | Name, description ("carry.allTheThings()..."), $29.99 | P0 |
| TC-027 | ADD TO CART from detail | `standard_user` | Cart badge = 1; button changes to REMOVE | P0 |
| TC-028 | REMOVE from detail | `standard_user` | Cart badge decrements; button resets to ADD TO CART | P1 |
| TC-029 | BACK TO PRODUCTS navigation | `standard_user` | Returns to catalog | P1 |

---

### TS-04: Shopping Cart

**Spec file**: `src/tests/cart.spec.ts`

| ID | Test Case | User | Expected Result | Priority |
|---|---|---|---|---|
| TC-030 | Cart shows added items | `standard_user` | Both items listed with QTY=1, name, description, price | P0 |
| TC-031 | Cart header is "YOUR CART" | `standard_user` | Header reads "YOUR CART" with QTY/DESCRIPTION columns | P1 |
| TC-032 | REMOVE item from cart | `standard_user` | Item removed; badge decrements | P0 |
| TC-033 | Empty cart state | `standard_user` | Cart shows no items; CHECKOUT button still visible | P1 |
| TC-034 | CONTINUE SHOPPING returns to catalog | `standard_user` | Returns to Products screen | P1 |
| TC-035 | Cart badge clears after checkout | `standard_user` | Cart icon badge disappears on CHECKOUT: COMPLETE! screen | P0 |
| TC-036 | Error user cart behaviour | `error_user` | Error or unexpected behaviour observed | P2 |

---

### TS-05: Checkout Flow

**Spec file**: `src/tests/checkout.spec.ts`

| ID | Test Case | User | Expected Result | Priority |
|---|---|---|---|---|
| TC-037 | Full checkout happy path | `standard_user` | CHECKOUT: COMPLETE! screen shown | P0 |
| TC-038 | Step 1 title | `standard_user` | Screen title is "CHECKOUT: INFORMATION" | P1 |
| TC-039 | Step 1 — all fields required | `standard_user` | Error shown for missing first field | P0 |
| TC-040 | Step 1 — missing first name | `standard_user` | Error: `"First Name is required"` | P1 |
| TC-041 | Step 1 — missing last name | `standard_user` | Error: `"Last Name is required"` | P1 |
| TC-042 | Step 1 — missing zip | `standard_user` | Error: `"Postal Code is required"` | P1 |
| TC-043 | Step 1 — CANCEL returns to cart | `standard_user` | Returns to cart screen | P1 |
| TC-044 | Step 2 title | `standard_user` | Screen title is "CHECKOUT: OVERVIEW" | P1 |
| TC-045 | Step 2 shows order summary | `standard_user` | Item list, item total, tax, Total visible | P0 |
| TC-046 | Step 2 payment info | `standard_user` | "Payment Information: SauceCard #31337" displayed | P1 |
| TC-047 | Step 2 shipping info | `standard_user` | "Shipping Information: FREE PONY EXPRESS DELIVERY!" displayed | P1 |
| TC-048 | Step 2 totals correct | `standard_user` | Item total: $29.99 / Tax: $2.40 / Total: $32.39 | P1 |
| TC-049 | Step 2 — CANCEL returns to catalog | `standard_user` | Returns to Products screen | P1 |
| TC-050 | Step 2 — FINISH completes order | `standard_user` | CHECKOUT: COMPLETE! screen shown | P0 |
| TC-051 | Completion screen content | `standard_user` | "THANK YOU FOR YOU ORDER" + Pony Express illustration + BACK HOME button | P0 |
| TC-052 | BUG: Typo in completion message | `standard_user` | Text says "YOU ORDER" instead of "YOUR ORDER" — known defect BUG-001 | P2 |
| TC-053 | BACK HOME returns to catalog | `standard_user` | Returns to Products screen; cart empty | P0 |

---

### TS-06: Side Menu / Navigation Drawer

**Spec file**: `src/tests/sideMenu.spec.ts`

| ID | Test Case | User | Expected Result | Priority |
|---|---|---|---|---|
| TC-054 | Menu opens | `standard_user` | Drawer opens with all menu items | P0 |
| TC-055 | X button closes menu | `standard_user` | Drawer closes, returns to current screen | P1 |
| TC-056 | ALL ITEMS navigates to catalog | `standard_user` | Products screen shown | P1 |
| TC-057 | LOGOUT clears session | `standard_user` | Login screen shown; back button cannot return | P0 |
| TC-058 | RESET APP STATE clears cart | `standard_user` | Cart badge gone; ADD TO CART buttons reset | P1 |
| TC-059 | ABOUT opens info | `standard_user` | About page or external browser opens | P2 |
| TC-060 | Back press closes menu | `standard_user` | Drawer closes without navigation | P2 |

---

### TS-07: Extended Feature Screens

**Spec file**: `src/tests/extendedFeatures.spec.ts`

> Android runtime permission dialogs (camera, location) are automatically accepted via `src/helpers/permissions.ts`.

| ID | Test Case | User | Expected Result | Priority |
|---|---|---|---|---|
| TC-058 | WEBVIEW screen loads URL entry form without crash; back returns to Products | `standard_user` | URL input, GO TO SITE button displayed; back navigates to Products | P1 |
| TC-058b | WEBVIEW shows error when GO TO SITE tapped with empty URL | `standard_user` | Error message matches `/correct https url/i` | P1 |
| TC-059 | QR CODE SCANNER opens camera view with instruction text; back returns to Products | `standard_user` | Camera permission accepted; "Scan a QR Code..." text displayed; back navigates to Products | P1 |
| TC-060 | GEO LOCATION shows latitude and longitude coordinates; back returns to Products | `standard_user` | Location permission accepted; non-empty numeric lat/lon values displayed; back navigates to Products | P1 |
| TC-061 | DRAWING canvas renders with CLEAR/SAVE buttons; touch gesture does not crash | `standard_user` | Canvas, CLEAR and SAVE buttons visible; draw gesture completes without crash | P1 |
| TC-062 | All extended screens allow back navigation without crash | `standard_user` | WEBVIEW, QR CODE SCANNER, GEO LOCATION, DRAWING each open and back-navigate cleanly | P1 |

---

## Automation Coverage

| Module | Spec File | Screen POMs | Status |
|---|---|---|---|
| TS-01: Authentication | `src/tests/login.spec.ts` | `LoginScreen.ts` | ✅ Implemented |
| TS-02: Products Catalog | `src/tests/products.spec.ts` | `ProductsScreen.ts` | ✅ Implemented |
| TS-03: Product Detail | `src/tests/productDetail.spec.ts` | `ProductDetailScreen.ts` | ✅ Implemented |
| TS-04: Shopping Cart | `src/tests/cart.spec.ts` | `CartScreen.ts` | ✅ Implemented |
| TS-05: Checkout Flow | `src/tests/checkout.spec.ts` | `CheckoutStep1Screen.ts`, `CheckoutStep2Screen.ts`, `CheckoutCompleteScreen.ts` | ✅ Implemented |
| TS-06: Side Menu | `src/tests/sideMenu.spec.ts` | `SideMenuDrawer.ts` | ✅ Implemented |
| TS-07: Extended Features | `src/tests/extendedFeatures.spec.ts` | `WebviewScreen.ts`, `QrScannerScreen.ts`, `GeoLocationScreen.ts`, `DrawingScreen.ts` | ✅ Implemented |

---

## Environment Requirements

| Requirement | Value |
|---|---|
| Android SDK | API 33–34 (Android 13–14) |
| Recommended Device | Pixel 7 Pro — API 33 emulator |
| Appium Server | 2.x running on port 4723 |
| Automation Driver | UiAutomator2 |
| Node.js | 18+ |
| APK | `apps/android/SauceLabs-Demo-2.7.1.apk` |

> **Do NOT use Android 15+ (API 35+)** — native library page-alignment incompatibility causes immediate crash on launch.

---

## Entry / Exit Criteria

### Entry Criteria
- Appium server running on port 4723 (`npm run appium`)
- Android 13 emulator connected and visible via `adb devices`
- APK installs cleanly (`adb install -r` returns `Success`)
- App launches to Login screen without crash

### Exit Criteria
- All P0 test cases pass
- All P1 test cases pass or have filed defect tickets
- BUG-001 (typo) acknowledged and tracked
- All 7 test suites run end-to-end without environment errors

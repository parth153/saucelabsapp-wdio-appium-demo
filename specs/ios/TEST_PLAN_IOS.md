# Test Plan: Swag Labs Mobile App (iOS)

**App**: Swag Labs Mobile App (iOS)  
**Bundle ID**: `com.saucelabs.mydemo.app.ios`  
**App Binary**: `apps/ios/My Demo App.app`  
**Automation Framework**: Appium 3 + WebdriverIO 9 + XCUITest + TypeScript  
**Target Device**: iPhone 17 Simulator, iOS 26.5  
**Simulator UDID**: `FC4F1F4B-9011-4192-AE5B-B86FC0334EDB`  
**Date**: 2026-06-28

---

## App Overview

Swag Labs iOS is a React Native demo e-commerce app. Unlike the Android variant it launches directly to the **Catalog** screen (no login gate on launch). Authentication is optional and accessed through the **More** tab in the bottom tab bar.

### Navigation Model

The iOS app uses a **bottom tab bar** rather than a hamburger side drawer:

```
Bottom Tab Bar
├── Catalog  (default launch tab)
├── Cart
└── More
     ├── Webview
     ├── QR Code Scanner
     ├── Geo Location
     ├── Drawing
     ├── About
     ├── Reset App State
     └── Login / Logout (toggles based on auth state)
```

### User Accounts

| Username (email) | Password | Behaviour |
|---|---|---|
| `bob@example.com` | `10203040` | Fully functional |
| `alice@example.com` | `10203040` | Fully functional |
| `john@example.com` | `10203040` | Fully functional |
| `visual@example.com` | `10203040` | Visual defect persona |

> The login screen provides tap-to-autofill shortcuts for the above accounts.

### Product Catalogue

| Product | Price |
|---|---|
| Sauce Labs Backpack | $29.99 |
| Sauce Labs Bike Light | $9.99 |
| Sauce Labs Bolt T-Shirt | $15.99 |
| Sauce Labs Fleece Jacket | $49.99 |
| Sauce Labs Onesie | $7.99 |
| Test.allTheThings() T-Shirt (Red) | $15.99 |

### Key Accessibility IDs (iOS)

| Element | Accessibility ID |
|---|---|
| Product card | `~Product Name`, `~Product Price` |
| Sort button | `~sort button` |
| Cart tab | `~tab bar option cart` |
| Catalog tab | `~tab bar option catalog` |
| More tab | `~tab bar option more` |
| Add to Cart button | `~Add To Cart button` |
| Remove button | `~Remove` |
| Go Shopping button | `~Go Shopping` |
| Proceed to Checkout | `~Proceed To Checkout` |
| Username field | `~Username` |
| Password field | `~Password` |
| Login button | `~Login button` |
| Logout button | `~Logout button` |
| Webview item | `~Webview` |
| QR Code Scanner item | `~QR Code Scanner` |
| Geo Location item | `~Geo Location` |
| Drawing item | `~Drawing` |
| About item | `~About` |
| Reset App State item | `~Reset App State` |
| Color selector (green, unselected) | `~GreenColorUnSelected Icons` |
| Color selector (green, selected) | `~GreenColorSelected Icons` |
| Quantity value | `~counter amount` |
| Increment button | `~+` |
| Decrement button | `~-` |
| Webview URL input | `~URL input field` |
| Webview Go To Site | `~Go To Site button` |
| Latitude label | `~latitude` |
| Longitude label | `~longitude` |

---

## iOS vs. Android Differences

| Aspect | iOS | Android |
|---|---|---|
| Launch screen | Catalog (no login required) | Login screen |
| Navigation | Bottom tab bar | Hamburger side drawer |
| Login entry point | More tab → Login | Launch screen |
| Product detail extras | Color selector + quantity stepper | None |
| Cart badge | Not accessible via XCUITest | Accessible via `test-Cart` |
| Alert handling | `autoAcceptAlerts: true` | `permissions.ts` helper |
| Checkout flow | Redirects to Login when unauthenticated | Full 3-step checkout flow |

---

## Test Cases

### TS-iOS-01: Catalog

**Spec file**: `src/tests/ios/catalog.spec.ts`

| ID | Test Case | Expected Result | Priority |
|---|---|---|---|
| TC-iOS-001 | Catalog screen shown on launch | Catalog screen is displayed immediately | P0 |
| TC-iOS-002 | Multiple products are displayed | Product count > 0 | P0 |
| TC-iOS-003 | Each product card has a name and price | First visible name and price elements are displayed | P0 |
| TC-iOS-004 | Sort button is present on catalog | Sort button element is displayed | P1 |
| TC-iOS-005 | Cart badge appears after adding an item | Cart is not empty after adding from detail | P1 |

---

### TS-iOS-02: Product Detail

**Spec file**: `src/tests/ios/productDetail.spec.ts`

| ID | Test Case | Expected Result | Priority |
|---|---|---|---|
| TC-iOS-006 | Tapping a product opens the detail screen | Product Detail screen is displayed | P0 |
| TC-iOS-007 | Detail shows price and Add To Cart button | Price and Add To Cart button are displayed | P0 |
| TC-iOS-008 | Color selectors are present | Green color selector (selected or unselected) is present | P1 |
| TC-iOS-009 | Increment button increases quantity | Quantity increases by 1 after tap | P1 |
| TC-iOS-010 | Decrement button reduces quantity (minimum 0) | Quantity >= 0 after decrement | P1 |
| TC-iOS-011 | Add To Cart adds item to cart | Cart screen shows item after add | P0 |
| TC-iOS-012 | Back button returns to catalog | Catalog screen is displayed | P0 |

---

### TS-iOS-03: Cart

**Spec file**: `src/tests/ios/cart.spec.ts`

| ID | Test Case | Expected Result | Priority |
|---|---|---|---|
| TC-iOS-013 | Empty cart shows Go Shopping button | Go Shopping button is displayed | P0 |
| TC-iOS-014 | Go Shopping returns to catalog | Catalog screen is displayed | P1 |
| TC-iOS-015 | Added item appears in My Cart with name and price | Item name contains "Sauce Labs"; price $29.99 displayed | P0 |
| TC-iOS-016 | Remove Item removes the product from cart | Cart isEmpty() returns true | P0 |
| TC-iOS-017 | Total reflects item price | $29.99 label is displayed in cart | P1 |
| TC-iOS-018 | Proceed To Checkout redirects to Login when unauthenticated | Login screen is displayed | P0 |

---

### TS-iOS-04: Login

**Spec file**: `src/tests/ios/login.spec.ts`

> Login is accessed via the More tab; the app launches directly to Catalog without requiring authentication.

| ID | Test Case | Expected Result | Priority |
|---|---|---|---|
| TC-iOS-019 | Login screen is accessible from More menu | Login screen is displayed | P0 |
| TC-iOS-020 | Username shortcut list shows expected accounts | `bob@example.com`, `alice@example.com`, `john@example.com`, `visual@example.com` are displayed | P1 |
| TC-iOS-021 | Tapping a username shortcut fills the username field | Username field value equals tapped account | P1 |
| TC-iOS-022 | Valid login with bob@example.com succeeds | More menu shows logged-in state (Logout visible) | P0 |
| TC-iOS-023 | Logout returns to unauthenticated state | More menu shows Login button | P0 |

---

### TS-iOS-05: More Menu

**Spec file**: `src/tests/ios/more.spec.ts`

| ID | Test Case | Expected Result | Priority |
|---|---|---|---|
| TC-iOS-024 | More menu lists all expected items | Webview, QR Code Scanner, Geo Location, Drawing, About, Reset App State, Login all displayed | P0 |
| TC-iOS-025 | Webview opens URL entry screen | Webview screen displayed; URL input and Go To Site button present | P1 |
| TC-iOS-026 | Webview back button returns to More | More menu is displayed after back | P1 |
| TC-iOS-027 | Geo Location shows latitude and longitude | Latitude and longitude labels displayed; values are numeric | P1 |
| TC-iOS-028 | Reset App State clears the cart | Cart isEmpty() returns true after reset | P1 |

---

## Automation Coverage

| Module | Spec File | Screen POMs | Status |
|---|---|---|---|
| TS-iOS-01: Catalog | `src/tests/ios/catalog.spec.ts` | `CatalogScreen.ts` | ✅ Implemented |
| TS-iOS-02: Product Detail | `src/tests/ios/productDetail.spec.ts` | `ProductDetailScreen.ts` | ✅ Implemented |
| TS-iOS-03: Cart | `src/tests/ios/cart.spec.ts` | `CartScreen.ts`, `ProductDetailScreen.ts` | ✅ Implemented |
| TS-iOS-04: Login | `src/tests/ios/login.spec.ts` | `LoginScreen.ts`, `MoreMenuScreen.ts` | ✅ Implemented |
| TS-iOS-05: More Menu | `src/tests/ios/more.spec.ts` | `MoreMenuScreen.ts`, `WebviewScreen.ts`, `GeoLocationScreen.ts` | ✅ Implemented |

---

## Environment Requirements

| Requirement | Value |
|---|---|
| Xcode | 16+ |
| iOS Simulator | iPhone 17, iOS 26.5 |
| Simulator UDID | `FC4F1F4B-9011-4192-AE5B-B86FC0334EDB` |
| Appium Server | 3.x running on port 4723 |
| Automation Driver | XCUITest |
| Node.js | 18+ |
| App | `apps/ios/My Demo App.app` |

---

## Entry / Exit Criteria

### Entry Criteria
- Appium server running on port 4723 (`npm run appium`)
- iPhone 17 Simulator booted (`xcrun simctl list | grep Booted`)
- `apps/ios/My Demo App.app` present at configured path
- App launches to Catalog screen without crash

### Exit Criteria
- All P0 test cases pass (100%)
- All P1 test cases pass or have filed defect tickets (>= 95%)
- All 5 test suites run end-to-end without environment errors
- Allure report generated and reviewed

---

## Related Documents

| Document | Location |
|---|---|
| Test Strategy (iOS) | `specs/ios/TEST_STRATEGY_IOS.md` |
| Catalog Test Cases | `specs/ios/test-cases/TS-iOS-01-catalog.md` |
| Product Detail Test Cases | `specs/ios/test-cases/TS-iOS-02-product-detail.md` |
| Cart Test Cases | `specs/ios/test-cases/TS-iOS-03-cart.md` |
| Login Test Cases | `specs/ios/test-cases/TS-iOS-04-login.md` |
| More Menu Test Cases | `specs/ios/test-cases/TS-iOS-05-more-menu.md` |
| WDIO iOS Config | `config/wdio.ios.conf.ts` |
| Android Test Plan | `specs/android/TEST_PLAN_ANDROID.md` |

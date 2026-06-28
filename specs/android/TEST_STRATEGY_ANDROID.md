# Test Strategy: Swag Labs Mobile App (Android)

**Project**: Swag Labs Mobile App Automation  
**App**: `com.swaglabsmobileapp` — SauceLabs-Demo-2.7.1.apk  
**Framework**: Appium 3 + WebdriverIO 9 + UiAutomator2 + TypeScript  
**Author**: QA Team  
**Date**: 2026-06-27  
**Status**: Fully Implemented

---

## 1. Objectives

- Validate the end-to-end functional behaviour of the Swag Labs Android app across all user-facing screens
- Establish a regression safety net that catches breakages on each new APK release
- Surface existing defects (e.g., BUG-001 typo on order complete screen) and prevent regressions from re-entering
- Cover all six built-in user personas, each of which exercises a distinct defect scenario
- Provide a living test artefact set (strategy → plan → test cases) that maps directly to the Appium automation suite

---

## 2. Scope

### In Scope
| Area | Detail |
|---|---|
| Authentication | Login, logout, all 6 user personas, field validation |
| Product Catalog | Grid view, sorting (4 options), layout toggle, add/remove from list |
| Product Detail | Navigation, content accuracy, add/remove cart from detail |
| Shopping Cart | Item management, quantity, proceed to checkout |
| Checkout Flow | 3-step flow (Information → Overview → Complete), field validation |
| Side Menu | All 8 menu items: ALL ITEMS, WEBVIEW, QR CODE SCANNER, GEO LOCATION, DRAWING, ABOUT, LOGOUT, RESET APP STATE |
| Extended Features | WebView, QR Scanner, Geo Location, Drawing canvas |
| Cross-user defects | Problem user, error user, visual user |
| App State & Session | Reset, logout, back-navigation guards |

### Out of Scope
- Backend / API layer testing
- Network traffic interception or certificate pinning
- Accessibility audit (TalkBack / screen reader)
- iOS variant — covered separately in `TEST_STRATEGY_IOS.md` (pending iOS spec completion)
- Performance benchmarking beyond `performance_glitch_user` scenario (excluded — exceeds emulator capacity)

---

## 3. Test Types

### 3.1 Smoke Tests (P0 only)
Run on every new APK drop before any deeper testing. Covers the critical path:
Login → Products list loads → Add to cart → Checkout complete → Logout

**Target duration**: < 3 minutes  
**Trigger**: New APK build, CI pipeline gate

### 3.2 Functional Tests (P0 + P1)
Full coverage of all documented screens and interactions. Run against `standard_user` for happy-path verification, then repeated per relevant persona for negative/defect paths.

**Target duration**: < 15 minutes  
**Trigger**: PR merge to main, nightly scheduled run

### 3.3 Regression Tests (All priorities)
Full suite including P2 edge cases, visual checks, and extended feature screens. Run against all applicable user personas.

**Target duration**: < 30 minutes  
**Trigger**: Release candidate builds

### 3.4 Negative / Error Path Tests
Validates error messages, empty-state handling, and locked/error user behaviours. Covers form validation on login and checkout.

### 3.5 Exploratory Testing
Manual session-based exploration of extended features (QR scanner, Geo Location, Drawing) and cross-user visual defects. Complements automation where scripting is impractical.

---

## 4. Test Levels

```
┌─────────────────────────────────────────────────┐
│           E2E / UI Automation (Appium)           │  <- This strategy
│   Login -> Browse -> Cart -> Checkout -> Complete │
├─────────────────────────────────────────────────┤
│         Integration (Screen <-> Screen)          │
│   Navigation flows, session state, cart sync     │
├─────────────────────────────────────────────────┤
│              Unit (Screen POMs)                  │
│   Element selectors, helper method correctness   │
└─────────────────────────────────────────────────┘
```

This strategy focuses exclusively on the **E2E / UI Automation** layer using Appium + UiAutomator2.

---

## 5. Environment & Tooling

| Component | Value |
|---|---|
| Language | TypeScript 5.x |
| Test Runner | WebdriverIO 9 + Mocha |
| Mobile Automation | Appium 3.x + appium-uiautomator2-driver 8.x |
| Device | Android emulator — Pixel 7 Pro, API 33 (Android 13) |
| ADB device ID | `emulator-5556` |
| Appium port | `4723` |
| Reporters | `@wdio/spec-reporter`, `@wdio/allure-reporter` |
| Config | `config/wdio.android.conf.ts` |
| APK | `apps/android/SauceLabs-Demo-2.7.1.apk` |

### Compatibility Constraint
> The APK uses React Native native libraries (`libfolly_json.so`, `libhermes.so`) compiled with 8 KB page alignment. **Android 15+ (API 35+) enforces 16 KB** — the app crashes on launch. Always use API 33 or 34 targets.

### Start Commands
```bash
# Start Appium server
npm run appium

# Run full Android test suite
npm run test:android
```

---

## 6. Test Data

| Data Type | Source |
|---|---|
| User credentials | Hardcoded in app — see personas table in TEST_PLAN_ANDROID.md |
| Checkout info | Test data: First Name `Test`, Last Name `User`, Zip `10001` |
| Payment | Always `SauceCard #31337` (app-generated, not real) |
| Products | Fixed catalogue of 6 items baked into the APK |

No external data sources, databases, or mocking required. The app is fully self-contained.

---

## 7. Project Structure

```
src/
├── screens/
│   └── android/                      <- Android-specific POMs (all implemented)
│       ├── LoginScreen.ts
│       ├── ProductsScreen.ts
│       ├── ProductDetailScreen.ts
│       ├── CartScreen.ts
│       ├── CheckoutStep1Screen.ts
│       ├── CheckoutStep2Screen.ts
│       ├── CheckoutCompleteScreen.ts
│       ├── SideMenuDrawer.ts
│       ├── WebviewScreen.ts
│       ├── QrScannerScreen.ts
│       ├── GeoLocationScreen.ts
│       └── DrawingScreen.ts
├── tests/
│   └── android/                      <- Android spec files (all implemented)
│       ├── login.spec.ts             (TC-001 to TC-009)
│       ├── products.spec.ts          (TC-012 to TC-023)
│       ├── productDetail.spec.ts     (TC-024 to TC-029)
│       ├── cart.spec.ts              (TC-030 to TC-036)
│       ├── checkout.spec.ts          (TC-037 to TC-053)
│       ├── sideMenu.spec.ts          (TC-054 to TC-060)
│       └── extendedFeatures.spec.ts  (TC-058 to TC-062)
└── helpers/
    ├── permissions.ts                <- Android runtime permission handler
    └── platform.ts                   <- Cross-platform selector helpers
```

### Selector Priority Order
1. Accessibility ID (`~test-*`) — preferred, most stable
2. UiSelector text / UiScrollable — for scroll-into-view and text-only elements
3. XPath — last resort for complex tree traversal

### Cross-Platform Helpers (`src/helpers/platform.ts`)
The `platform.ts` helper provides selectors and actions that work on both Android and iOS:

| Helper | Purpose |
|---|---|
| `byText(text)` | Text-based element lookup |
| `nativeTextSelector()` | Returns `android.widget.TextView` or `XCUIElementTypeStaticText` |
| `cartBadgeElement()` | Cart badge element with platform-specific child selector |
| `scrollIntoViewAndClick(id)` | UiScrollable on Android, `mobile: scroll` on iOS |
| `pressBack()` | Hardware back key on Android, right-swipe on iOS |

---

## 8. Test Execution Approach

### Session Management
- `appium:noReset: false` — app data cleared between test sessions
- Each spec file uses `driver.reloadSession()` in `beforeEach` to guarantee a clean state
- `newCommandTimeout: 240` — allows for slow emulator operations

### Reporting
- **Terminal**: `@wdio/spec-reporter` — live pass/fail output per test
- **Allure**: `@wdio/allure-reporter` — full HTML report with screenshots and video
  ```bash
  npm run report   # generate + open Allure report
  ```
- **Screen recording**: Every test session is recorded; video attached to Allure on failure
- **Screenshots**: Captured on test failure and hook failure; attached to Allure

### Test Isolation
- Each spec file is independently executable via `--spec` flag
- `driver.reloadSession()` in `beforeEach` provides a clean app state per test
- Cart state reset via menu → RESET APP STATE where required within a session

### Parallel Execution
- `maxInstances: 1` — single instance (single emulator)
- Can be raised if multiple emulators / devices are available

---

## 9. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| APK updated with new UI/IDs breaking selectors | Medium | High | Use `test-*` accessibility IDs; avoid XPath |
| Emulator Android version > API 34 | Low | High | Pin emulator to API 33; document in CI config |
| Flaky tests due to timing on slow emulator | High | Medium | `waitForDisplayed` with 10 s default; `newCommandTimeout: 240` |
| `performance_glitch_user` causing test timeout | Medium | Medium | Excluded from suite (TC-010 marked as skipped) |
| Extended features (QR, Geo) requiring device permissions | Medium | Low | `permissions.ts` helper auto-accepts Android runtime dialogs |
| Cart state leaking between tests | Medium | High | `driver.reloadSession()` in every `beforeEach` |

---

## 10. Defect Management

### Defect Severity Levels
| Level | Description | Example |
|---|---|---|
| Critical | App crash or data loss | App crashes on Android 15+ |
| High | Core flow broken | Cannot complete checkout |
| Medium | Feature defect with workaround | Sort order incorrect |
| Low | Cosmetic / copy issue | BUG-001 — "YOU ORDER" typo |

### Known Defects
| ID | Screen | Description | Severity | Status |
|---|---|---|---|---|
| BUG-001 | Checkout Complete | "THANK YOU FOR YOU ORDER" — missing "R" in "YOUR" | Low | Open |

### Defect Lifecycle
`New -> Triaged -> In Progress -> Fixed -> Verified -> Closed`

Automated tests assert the correct expected behaviour. Known defects are documented within the test (e.g., TC-052 asserts the typo exists as a known defect) rather than marking the test as pending.

---

## 11. Entry & Exit Criteria

### Entry Criteria
- [ ] Android 13 (API 33) emulator connected — `adb devices` shows `device`
- [ ] Appium server running on port 4723 — `npm run appium`
- [ ] APK installs cleanly — `adb install -r` returns `Success`
- [ ] App launches to Login screen without crash

### Exit Criteria
- [ ] All P0 test cases: **100% pass rate**
- [ ] All P1 test cases: **>= 95% pass rate** (remainder filed as defects)
- [ ] P2 test cases: **>= 80% pass rate**
- [ ] No new P0/P1 defects introduced vs. previous build
- [ ] Allure report generated and reviewed

---

## 12. Metrics & Reporting

| Metric | Target |
|---|---|
| P0 test pass rate | 100% |
| P1 test pass rate | >= 95% |
| Automation coverage (P0+P1 TCs) | 100% (53 automated test cases) |
| Total test cases | 53 across 7 spec files |
| Mean test suite execution time | < 15 min (functional) |
| Defect detection rate | Track per release |

---

## 13. Related Documents

| Document | Location |
|---|---|
| Test Plan (Android) | `specs/android/TEST_PLAN_ANDROID.md` |
| Authentication Test Cases | `specs/android/test-cases/TS-01-authentication.md` |
| Products Catalog Test Cases | `specs/android/test-cases/TS-02-products-catalog.md` |
| Product Detail Test Cases | `specs/android/test-cases/TS-03-product-detail.md` |
| Shopping Cart Test Cases | `specs/android/test-cases/TS-04-shopping-cart.md` |
| Checkout Flow Test Cases | `specs/android/test-cases/TS-05-checkout-flow.md` |
| Side Menu Test Cases | `specs/android/test-cases/TS-06-side-menu.md` |
| Extended Features Test Cases | `specs/android/test-cases/TS-07-extended-features.md` |
| WDIO Android Config | `config/wdio.android.conf.ts` |

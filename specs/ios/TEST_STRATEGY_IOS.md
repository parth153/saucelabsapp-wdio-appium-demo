# Test Strategy: Swag Labs Mobile App (iOS)

**Project**: Swag Labs Mobile App Automation  
**App**: `com.saucelabs.mydemo.app.ios` — My Demo App.app  
**Framework**: Appium 3 + WebdriverIO 9 + XCUITest + TypeScript  
**Author**: QA Team  
**Date**: 2026-06-28  
**Status**: Fully Implemented

---

## 1. Objectives

- Validate the end-to-end functional behaviour of the Swag Labs iOS app across all user-facing screens
- Establish a regression safety net that catches breakages on each new `.app` / `.ipa` release
- Cover the iOS-specific UX differences vs. Android (tab bar navigation, MoreMenu, no hardware back button, color/quantity selectors on product detail)
- Provide a living test artefact set (strategy → plan → test cases) that maps directly to the Appium XCUITest automation suite

---

## 2. Scope

### In Scope
| Area | Detail |
|---|---|
| Catalog | Grid listing, product cards, sort button, add-to-cart via detail |
| Product Detail | Navigation, price, color selectors, quantity stepper, add/remove |
| Cart | Item management, empty state, Go Shopping, Proceed to Checkout redirect |
| Login | More menu access, username shortcuts, valid login, logout |
| More Menu | All 7 items: Webview, QR Scanner, Geo Location, Drawing, About, Reset App State, Login/Logout |
| Extended Features | Webview URL form, Geo Location coordinates |
| Session / App State | Reset App State clears cart; login/logout state reflected across screens |

### Out of Scope
- Android variant — covered in `TEST_STRATEGY_ANDROID.md`
- Backend / API layer testing
- Network traffic interception or certificate pinning
- Accessibility audit (VoiceOver / Dynamic Type)
- Performance benchmarking
- Real device testing (simulator-only scope)
- QR Scanner UI automation (camera permission accepted via `autoAcceptAlerts`; live scanning not automatable in simulator)
- Drawing canvas gesture assertions beyond crash-check (not in current spec scope)

---

## 3. Test Types

### 3.1 Smoke Tests (P0 only)
Run on each new `.app` build before deeper testing. Critical path:
App launches → Catalog loads → Add item to cart → Checkout redirects to Login → Login succeeds → Logout

**Target duration**: < 3 minutes  
**Trigger**: New simulator build, CI gate

### 3.2 Functional Tests (P0 + P1)
Full coverage of all 5 spec files. Happy-path verification plus negative flows (empty cart, invalid state, unauthenticated checkout).

**Target duration**: < 15 minutes  
**Trigger**: PR merge to main, nightly scheduled run

### 3.3 Regression Tests (All priorities)
Full suite across all user personas where applicable, including extended feature screens and More menu flows.

**Target duration**: < 25 minutes  
**Trigger**: Release candidate builds

### 3.4 Negative / Error Path Tests
Validates unauthenticated checkout redirect, empty cart state, decrement below zero guard, and Webview URL validation.

---

## 4. Test Levels

```
┌─────────────────────────────────────────────────┐
│           E2E / UI Automation (Appium)           │  <- This strategy
│   Launch → Browse → Cart → Login → Checkout     │
├─────────────────────────────────────────────────┤
│         Integration (Screen <-> Screen)          │
│   Navigation flows, session state, cart sync     │
├─────────────────────────────────────────────────┤
│              Unit (Screen POMs)                  │
│   Element selectors, helper method correctness   │
└─────────────────────────────────────────────────┘
```

This strategy focuses exclusively on the **E2E / UI Automation** layer using Appium + XCUITest.

---

## 5. Environment & Tooling

| Component | Value |
|---|---|
| Language | TypeScript 5.x |
| Test Runner | WebdriverIO 9 + Mocha |
| Mobile Automation | Appium 3.x + appium-xcuitest-driver |
| Device | iPhone 17 Simulator (iOS 26.5) |
| Simulator UDID | `FC4F1F4B-9011-4192-AE5B-B86FC0334EDB` |
| Bundle ID | `com.saucelabs.mydemo.app.ios` |
| Appium port | `4723` |
| Reporters | `@wdio/spec-reporter`, `@wdio/allure-reporter` |
| Config | `config/wdio.ios.conf.ts` |
| App | `apps/ios/My Demo App.app` |

### Start Commands
```bash
# Start Appium server
npm run appium

# Run full iOS test suite (starts Appium, runs tests, opens Allure report)
npm run test:ios
# or directly:
bash scripts/run-tests-ios.sh
```

---

## 6. iOS vs. Android Differences

| Aspect | Android | iOS |
|---|---|---|
| Navigation | Hardware back button | Tab bar + in-screen back button (XCUITest swipe/button) |
| Menu | Hamburger side drawer | Bottom tab bar → "More" tab |
| Login flow | Login screen on app launch | Accessed from More tab menu |
| Product detail extras | None | Color selector + quantity stepper |
| Cart badge | Accessibility ID badge element | Not accessible via XCUITest — verified via cart screen |
| Selector engine | UiAutomator2 | XCUITest |
| Alert handling | `permissions.ts` helper | `appium:autoAcceptAlerts: true` capability |
| Scroll | `mobile: scroll` / UiScrollable | `mobile: scroll` |
| Back navigation | `driver.back()` or hardware key | Tap back button or swipe right |

---

## 7. Test Data

| Data Type | Source |
|---|---|
| User credentials | Hardcoded in app — see personas table in TEST_PLAN_IOS.md |
| Checkout info | N/A — checkout redirect to login is the tested flow (no checkout step 2+ in iOS spec) |
| Products | Fixed catalogue baked into the app |

No external data sources required. The app is fully self-contained.

---

## 8. Project Structure

```
src/
├── screens/
│   └── ios/                          <- iOS-specific POMs (all implemented)
│       ├── LoginScreen.ts
│       ├── CatalogScreen.ts
│       ├── ProductDetailScreen.ts
│       ├── CartScreen.ts
│       ├── MoreMenuScreen.ts
│       ├── WebviewScreen.ts
│       └── GeoLocationScreen.ts
├── tests/
│   └── ios/                          <- iOS spec files (all implemented)
│       ├── catalog.spec.ts           (TC-iOS-001 to TC-iOS-005)
│       ├── productDetail.spec.ts     (TC-iOS-006 to TC-iOS-012)
│       ├── cart.spec.ts              (TC-iOS-013 to TC-iOS-018)
│       ├── login.spec.ts             (TC-iOS-019 to TC-iOS-023)
│       └── more.spec.ts              (TC-iOS-024 to TC-iOS-028)
└── helpers/
    └── platform.ts                   <- Cross-platform selector helpers
```

### Selector Priority Order (iOS)
1. Accessibility ID (`~<label>`) — preferred; set via `accessibilityLabel` in the React Native source
2. XCUIElementType predicates — for type-specific queries
3. XPath — last resort

### XCUITest Limitations (vs. Android)
- **Cart badge** — the cart badge element count is not exposed in the XCUITest accessibility tree; cart contents verified by navigating to the cart screen instead
- **Back navigation** — no hardware back key; use the in-screen back button (accessibility ID or XCUITest `tapBack()`)
- **Alert dialogs** — auto-accepted via `appium:autoAcceptAlerts: true`; no manual permission helper needed

---

## 9. Test Execution Approach

### Session Management
- `appium:noReset: false` — app data cleared between test sessions
- Each spec file uses `driver.reloadSession()` in `beforeEach` for a clean state
- `newCommandTimeout: 240` — accommodates simulator boot and screen transitions

### Reporting
- **Terminal**: `@wdio/spec-reporter` — live pass/fail per test
- **Allure**: `@wdio/allure-reporter` — full HTML report with screenshots and video
  ```bash
  npm run report   # generate + open Allure report
  ```
- **Screen recording**: Every test session is recorded; video attached to Allure on failure
- **Screenshots**: Captured on test failure and hook failure; attached to Allure

### Test Isolation
- Each spec file is independently executable via `--spec` flag
- `driver.reloadSession()` in `beforeEach` provides fresh app state per test
- App State reset via More menu → Reset App State where intra-session state cleanup is needed

---

## 10. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Simulator not booted / UDID mismatch | Medium | High | Pin UDID in `wdio.ios.conf.ts`; verify with `xcrun simctl list` |
| XCUITest accessibility IDs differ from Android IDs | High | Medium | Maintain separate iOS POMs under `src/screens/ios/` |
| Cart badge inaccessible via XCUITest | Confirmed | Low | Verify via cart screen `isEmpty()` check |
| Flaky tests due to simulator timing | Medium | Medium | `waitForDisplayed` 10 s default; `newCommandTimeout: 240` |
| `autoAcceptAlerts` missing a new permission dialog | Low | Medium | Monitor Allure report for unexpected alert stalls |
| App binary updated with new accessibility IDs | Medium | High | Keep POMs in sync with each app release |

---

## 11. Entry & Exit Criteria

### Entry Criteria
- [ ] iPhone 17 Simulator (iOS 26.5) booted — `xcrun simctl list | grep Booted`
- [ ] Appium server running on port 4723 — `npm run appium`
- [ ] `apps/ios/My Demo App.app` present and valid
- [ ] App installs and launches to Catalog screen without crash

### Exit Criteria
- [ ] All P0 test cases: **100% pass rate**
- [ ] All P1 test cases: **>= 95% pass rate** (remainder filed as defects)
- [ ] No new P0/P1 defects introduced vs. previous build
- [ ] Allure report generated and reviewed

---

## 12. Metrics & Reporting

| Metric | Target |
|---|---|
| P0 test pass rate | 100% |
| P1 test pass rate | >= 95% |
| Automation coverage (P0+P1 TCs) | 100% (28 automated test cases across 5 spec files) |
| Total test cases | 28 |
| Mean test suite execution time | < 15 min (functional) |

---

## 13. Related Documents

| Document | Location |
|---|---|
| Test Plan (iOS) | `specs/ios/TEST_PLAN_IOS.md` |
| Catalog Test Cases | `specs/ios/test-cases/TS-iOS-01-catalog.md` |
| Product Detail Test Cases | `specs/ios/test-cases/TS-iOS-02-product-detail.md` |
| Cart Test Cases | `specs/ios/test-cases/TS-iOS-03-cart.md` |
| Login Test Cases | `specs/ios/test-cases/TS-iOS-04-login.md` |
| More Menu Test Cases | `specs/ios/test-cases/TS-iOS-05-more-menu.md` |
| WDIO iOS Config | `config/wdio.ios.conf.ts` |
| Android Strategy (for comparison) | `specs/android/TEST_STRATEGY_ANDROID.md` |

# Swag Labs Mobile App — Appium Automation Suite

End-to-end UI automation tests for the **Swag Labs** demo mobile app, covering both **Android** and **iOS** platforms. Tests run locally against simulators/emulators and in **GitHub Actions** using Android Emulator on Ubuntu.

---

## Platform Coverage

| Platform | App | Driver | Device (Local) | Device (CI) |
|---|---|---|---|---|
| **Android** | `SauceLabs-Demo-2.7.1.apk` | UiAutomator2 | Pixel 7 Pro — Android 13 (API 33) | Android Emulator — API 33 (Ubuntu) |
| **iOS** | `My Demo App.app` | XCUITest | iPhone 17 — iOS 26.5 | _Local only (macOS required)_ |

> **Note:** iOS tests are run locally on macOS with the iPhone Simulator. GitHub Actions runs Android tests only, as iOS simulators require macOS runners.

---

## Tech Stack

| Component | Version |
|---|---|
| Language | TypeScript 5.x |
| Test Runner | WebdriverIO 9 + Mocha |
| Mobile Automation | Appium 3.x |
| Android Driver | appium-uiautomator2-driver 8.x |
| iOS Driver | appium-xcuitest-driver 11.x |
| Reporting | Allure Report 2.x |
| Node.js | 22+ |

---

## Project Structure

```
.
├── apps/
│   ├── android/
│   │   └── SauceLabs-Demo-2.7.1.apk     # Android app binary
│   └── ios/
│       └── My Demo App.app              # iOS simulator app bundle
├── config/
│   ├── wdio.android.conf.ts             # Android WDIO configuration
│   └── wdio.ios.conf.ts                 # iOS WDIO configuration
├── scripts/
│   ├── run-tests-android.sh             # Android: start Appium + run tests + open report
│   └── run-tests-ios.sh                 # iOS: start Appium + run tests + open report
├── src/
│   ├── screens/
│   │   ├── android/                     # Android Page Object Models (12 screens)
│   │   └── ios/                         # iOS Page Object Models (7 screens)
│   ├── tests/
│   │   ├── android/                     # Android spec files (7 suites, 53 tests)
│   │   └── ios/                         # iOS spec files (5 suites, 28 tests)
│   └── helpers/
│       ├── permissions.ts               # Android runtime permission handler
│       ├── platform.ts                  # Cross-platform selector helpers
│       └── softAssert.ts                # Soft assertion helper (collect all failures before throwing)
├── specs/
│   ├── android/                         # Test strategy, plan, and test cases (Android)
│   └── ios/                             # Test strategy, plan, and test cases (iOS)
├── allure-results/                      # Generated at runtime (git-ignored)
└── allure-report/                       # Generated at runtime (git-ignored)
```

---

## Test Suites

### Android — 7 Suites / 53 Test Cases

| Suite | Spec File | Test Cases | Coverage |
|---|---|---|---|
| TS-01: Authentication | `login.spec.ts` | TC-001 – TC-009 | Login, logout, all personas, field validation |
| TS-02: Products Catalog | `products.spec.ts` | TC-012 – TC-023 | Grid, sorting (4 options), add/remove, layout toggle |
| TS-03: Product Detail | `productDetail.spec.ts` | TC-024 – TC-029 | Navigation, content, add/remove from detail |
| TS-04: Shopping Cart | `cart.spec.ts` | TC-030 – TC-036 | Item management, empty state, continue shopping |
| TS-05: Checkout Flow | `checkout.spec.ts` | TC-037 – TC-053 | 3-step checkout, field validation, order complete |
| TS-06: Side Menu | `sideMenu.spec.ts` | TC-054 – TC-060 | Drawer navigation, logout, reset app state |
| TS-07: Extended Features | `extendedFeatures.spec.ts` | TC-058 – TC-062 | WebView, QR Scanner, Geo Location, Drawing canvas |

### iOS — 5 Suites / 28 Test Cases

| Suite | Spec File | Test Cases | Coverage |
|---|---|---|---|
| TS-iOS-01: Catalog | `catalog.spec.ts` | TC-iOS-001 – TC-iOS-005 | Launch, product listing, sort button, cart add |
| TS-iOS-02: Product Detail | `productDetail.spec.ts` | TC-iOS-006 – TC-iOS-012 | Detail screen, color selector, quantity stepper, add/remove |
| TS-iOS-03: Cart | `cart.spec.ts` | TC-iOS-013 – TC-iOS-018 | Empty state, add/remove, total price, unauthenticated checkout |
| TS-iOS-04: Login | `login.spec.ts` | TC-iOS-019 – TC-iOS-023 | More menu access, shortcuts, login, logout |
| TS-iOS-05: More Menu | `more.spec.ts` | TC-iOS-024 – TC-iOS-028 | Menu items, WebView, Geo Location, reset app state |

---

## User Personas

### Android

| Username | Password | Behaviour |
|---|---|---|
| `standard_user` | `secret_sauce` | Fully functional — primary test persona |
| `locked_out_user` | `secret_sauce` | Blocked at login with error message |
| `problem_user` | `secret_sauce` | Broken product images; some interactions broken |
| `performance_glitch_user` | `secret_sauce` | 4–8 s artificial delay on login _(excluded from suite)_ |
| `error_user` | `secret_sauce` | Errors on cart and checkout interactions |
| `visual_user` | `secret_sauce` | Subtle visual defects throughout |

### iOS

| Username | Password | Behaviour |
|---|---|---|
| `bob@example.com` | `10203040` | Fully functional — primary test persona |
| `alice@example.com` | `10203040` | Fully functional |
| `john@example.com` | `10203040` | Fully functional |
| `visual@example.com` | `10203040` | Visual defect persona |

---

## Local Setup

### Prerequisites

- Node.js 18+
- Java 11+ (for Android SDK tools)
- Android Studio with an **API 33** emulator (Pixel 7 Pro recommended)
- Xcode 16+ with **iPhone 17 Simulator (iOS 26.5)** _(iOS only, macOS only)_

> **Android version warning:** The APK uses native libraries compiled with 8 KB page alignment. Android 15+ (API 35+) enforces 16 KB alignment and will crash the app on launch. Always use **API 33 or 34**.

### Install Dependencies

```bash
npm install
```

This installs WebdriverIO, Appium, drivers, and all reporters. No separate `appium install` step required.

---

## Running Tests Locally

### Android

Start an Android 13 (API 33) emulator, then run:

```bash
# Option 1 — all-in-one script (starts Appium, runs tests, opens Allure report)
bash scripts/run-tests-android.sh

# Option 2 — manual steps
npm run appium            # start Appium on port 4723 (separate terminal)
npm run test:android      # run Android test suite
npm run report            # generate and open Allure report
```

### iOS (macOS only)

Boot the iPhone 17 Simulator (iOS 26.5) in Xcode or via:

```bash
xcrun simctl boot FC4F1F4B-9011-4192-AE5B-B86FC0334EDB
```

Then run:

```bash
# Option 1 — all-in-one script
bash scripts/run-tests-ios.sh

# Option 2 — manual steps
npm run appium            # start Appium on port 4723 (separate terminal)
npm run test:ios          # run iOS test suite
npm run report            # generate and open Allure report
```

### Run a single spec file

```bash
npx wdio run config/wdio.android.conf.ts --spec src/tests/android/login.spec.ts
npx wdio run config/wdio.ios.conf.ts --spec src/tests/ios/cart.spec.ts
```

---

## Allure Reporting

Every test run generates an Allure report with:
- Pass/fail status per test
- Screenshot on failure
- Video recording per test session (attached on failure)

```bash
npm run report:generate   # generate HTML report from allure-results/
npm run report:open       # open report in browser
npm run report            # generate + open in one command
```

---

## GitHub Actions — CI/CD

Android tests run automatically on every push and pull request to `main` via GitHub Actions. The workflow runs **3 shards in parallel** to cut runtime from ~38 min to ~12–15 min:

| Shard | Spec Files |
|---|---|
| `auth-products` | `login.spec.ts`, `products.spec.ts` |
| `cart-checkout` | `cart.spec.ts`, `checkout.spec.ts` |
| `detail-menu-extended` | `productDetail.spec.ts`, `sideMenu.spec.ts`, `extendedFeatures.spec.ts` |

Each shard:
1. Spins up its own Android 13 (API 33) emulator on Ubuntu
2. Installs Node dependencies
3. Starts Appium
4. Runs its subset of tests

After all shards complete, a dedicated `report` job merges the Allure results and publishes the combined report to **GitHub Pages**.

> iOS tests are **not** run in CI — iOS simulators require macOS runners and are outside the current CI scope. iOS tests are executed locally on macOS.

---

## Soft Assertions

The `SoftAssert` helper ([src/helpers/softAssert.ts](src/helpers/softAssert.ts)) collects multiple assertion failures within a single test before throwing, so you see all failures at once rather than stopping at the first one.

```typescript
import { SoftAssert } from '../../helpers/softAssert';

it('TC-023: detail screen shows correct content', async () => {
  const soft = new SoftAssert();
  soft.check(() => expect(name).toBe('Sauce Labs Backpack'), 'name');
  soft.check(() => expect(desc).toContain('carry.allTheThings()'), 'description');
  soft.check(() => expect(price).toBe('$29.99'), 'price');
  soft.assertAll(); // throws once with all failures listed
});
```

---

## Test Documentation

Detailed test strategy, test plan, and per-suite test cases are in the `specs/` directory:

| Document | Path |
|---|---|
| Android Test Strategy | `specs/android/TEST_STRATEGY_ANDROID.md` |
| Android Test Plan | `specs/android/TEST_PLAN_ANDROID.md` |
| Android Test Cases (7 suites) | `specs/android/test-cases/` |
| iOS Test Strategy | `specs/ios/TEST_STRATEGY_IOS.md` |
| iOS Test Plan | `specs/ios/TEST_PLAN_IOS.md` |
| iOS Test Cases (5 suites) | `specs/ios/test-cases/` |

---

## Known Bugs

| ID | Platform | Screen | Description | Severity |
|---|---|---|---|---|
| BUG-001 | Android | Checkout Complete | Text reads "THANK YOU FOR **YOU** ORDER" — missing "R" in "YOUR" | Low (cosmetic) |

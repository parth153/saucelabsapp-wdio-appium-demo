# TS-iOS-05: More Menu — Test Cases

**Spec file**: `src/tests/ios/more.spec.ts`  
**Screen POMs**: `src/screens/ios/CatalogScreen.ts`, `src/screens/ios/ProductDetailScreen.ts`, `src/screens/ios/CartScreen.ts`, `src/screens/ios/MoreMenuScreen.ts`, `src/screens/ios/WebviewScreen.ts`, `src/screens/ios/GeoLocationScreen.ts`  
**Suite**: `TS-iOS-05: More Menu`

---

**Shared Precondition (beforeEach)**  
App session reloaded → Catalog screen displayed → More tab opened (`MoreMenuScreen.open()`).

---

## TC-iOS-024 — More menu lists all expected items

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | Unauthenticated |

**Steps**
1. Assert each of the following More menu items is displayed:
   - Webview
   - QR Code Scanner
   - Geo Location
   - Drawing
   - About
   - Reset App State
   - Login (unauthenticated state)

**Expected Result**  
All 7 items are visible in the More menu.

**Automation**
```ts
await expect(MoreMenuScreen.webviewItem).toBeDisplayed();
await expect(MoreMenuScreen.qrScannerItem).toBeDisplayed();
await expect(MoreMenuScreen.geoLocationItem).toBeDisplayed();
await expect(MoreMenuScreen.drawingItem).toBeDisplayed();
await expect(MoreMenuScreen.aboutItem).toBeDisplayed();
await expect(MoreMenuScreen.resetAppStateItem).toBeDisplayed();
await expect(MoreMenuScreen.loginButton).toBeDisplayed();
```

---

## TC-iOS-025 — Webview opens URL entry screen

| Field | Value |
|---|---|
| **Priority** | P1 |
| **User** | Unauthenticated |

**Steps**
1. Tap the Webview item in the More menu.
2. Assert the Webview screen is displayed.
3. Assert URL input field is displayed.
4. Assert Go To Site button is displayed.

**Expected Result**  
Webview screen shows URL input and Go To Site button.

**Automation**
```ts
await MoreMenuScreen.webviewItem.click();
expect(await WebviewScreen.isDisplayed()).toBe(true);
await expect(WebviewScreen.urlInput).toBeDisplayed();
await expect(WebviewScreen.goToSiteButton).toBeDisplayed();
```

---

## TC-iOS-026 — Webview back button returns to More

| Field | Value |
|---|---|
| **Priority** | P1 |
| **User** | Unauthenticated |

**Steps**
1. Tap Webview item in the More menu.
2. Assert Webview screen is displayed.
3. Tap the back button on the Webview screen.
4. Assert the More menu is displayed.

**Expected Result**  
`MoreMenuScreen.isDisplayed()` returns `true` after navigating back.

**Automation**
```ts
await MoreMenuScreen.webviewItem.click();
await WebviewScreen.isDisplayed();
await WebviewScreen.tapBack();
expect(await MoreMenuScreen.isDisplayed()).toBe(true);
```

---

## TC-iOS-027 — Geo Location shows latitude and longitude

| Field | Value |
|---|---|
| **Priority** | P1 |
| **User** | Unauthenticated |

**Steps**
1. Tap Geo Location item in the More menu.
2. Assert the Geo Location screen is displayed.
3. Assert latitude label is displayed.
4. Assert longitude label is displayed.
5. Get latitude value; assert it is a valid number (not NaN).
6. Get longitude value; assert it is a valid number (not NaN).

**Expected Result**  
Both latitude and longitude are displayed and are non-NaN numeric values.

**Notes**  
`appium:autoAcceptAlerts: true` handles the location permission dialog automatically.

**Automation**
```ts
await MoreMenuScreen.geoLocationItem.click();
expect(await GeoLocationScreen.isDisplayed()).toBe(true);
await expect(GeoLocationScreen.latitudeLabel).toBeDisplayed();
await expect(GeoLocationScreen.longitudeLabel).toBeDisplayed();
const lat = await GeoLocationScreen.getLatitude();
const lon = await GeoLocationScreen.getLongitude();
expect(parseFloat(lat)).not.toBeNaN();
expect(parseFloat(lon)).not.toBeNaN();
```

---

## TC-iOS-028 — Reset App State clears the cart

| Field | Value |
|---|---|
| **Priority** | P1 |
| **User** | Unauthenticated |

**Steps**
1. Navigate to the Catalog tab.
2. Add the first product to cart via the detail screen.
3. Open the cart; assert it is not empty.
4. Open More menu.
5. Tap Reset App State (also dismisses the "App State has been reset." confirmation dialog).
6. Navigate to the Catalog tab.
7. Assert the cart badge count is 0.

**Expected Result**  
`CatalogScreen.getCartBadgeCount()` returns 0 after reset — cart is cleared.

**Notes**  
`tapResetAppState()` in `MoreMenuScreen` dismisses the post-reset confirmation alert in addition to triggering the reset.

**Automation**
```ts
await CatalogScreen.catalogTab.click();
await CatalogScreen.tapItem(0);
await ProductDetailScreen.isDisplayed();
await ProductDetailScreen.tapAddToCart();
await CatalogScreen.tapCart();
await CartScreen.isDisplayed();
expect(await CartScreen.isEmpty()).toBe(false);

await MoreMenuScreen.open();
await MoreMenuScreen.tapResetAppState();
await CatalogScreen.catalogTab.click();
await CatalogScreen.isDisplayed();
expect(await CatalogScreen.getCartBadgeCount()).toBe(0);
```

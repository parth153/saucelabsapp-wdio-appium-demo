# TS-iOS-01: Catalog — Test Cases

**Spec file**: `src/tests/ios/catalog.spec.ts`  
**Screen POM**: `src/screens/ios/CatalogScreen.ts`  
**Suite**: `TS-iOS-01: Catalog`

---

## TC-iOS-001 — Catalog screen shown on launch

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | Unauthenticated (any) |
| **Precondition** | App launched fresh (reloadSession) |

**Steps**
1. Observe the screen on app launch.

**Expected Result**  
`CatalogScreen.isDisplayed()` returns `true` — the catalog grid is visible.

**Automation**
```ts
expect(await CatalogScreen.isDisplayed()).toBe(true);
```

---

## TC-iOS-002 — Multiple products are displayed

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | Unauthenticated |
| **Precondition** | Catalog screen displayed |

**Steps**
1. Get the count of product item elements on screen.

**Expected Result**  
Product count > 0.

**Automation**
```ts
const count = await CatalogScreen.getItemCount();
expect(count).toBeGreaterThan(0);
```

---

## TC-iOS-003 — Each product card has a name and price

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | Unauthenticated |
| **Precondition** | Catalog screen displayed |

**Steps**
1. Query all `~Product Name` elements.
2. Query all `~Product Price` elements.
3. Assert the first visible element in each list is displayed.

**Expected Result**  
At least one name and one price element are present and displayed.

**Notes**  
Elements scrolled off-screen are not `isDisplayed()` in XCUITest; only visible elements are checked.

**Automation**
```ts
const names = await $$('~Product Name');
const prices = await $$('~Product Price');
expect(names.length).toBeGreaterThan(0);
expect(prices.length).toBeGreaterThan(0);
expect(await names[0].isDisplayed()).toBe(true);
expect(await prices[0].isDisplayed()).toBe(true);
```

---

## TC-iOS-004 — Sort button is present on catalog

| Field | Value |
|---|---|
| **Priority** | P1 |
| **User** | Unauthenticated |
| **Precondition** | Catalog screen displayed |

**Steps**
1. Assert `CatalogScreen.sortButton` is displayed.

**Expected Result**  
Sort button is visible on the catalog header/toolbar.

**Automation**
```ts
await expect(CatalogScreen.sortButton).toBeDisplayed();
```

---

## TC-iOS-005 — Cart badge appears after adding an item

| Field | Value |
|---|---|
| **Priority** | P1 |
| **User** | Unauthenticated |
| **Precondition** | Catalog screen displayed; cart is empty |

**Steps**
1. Verify `getCartBadgeCount()` returns 0 initially.
2. Tap the first product item to open detail.
3. Tap Add To Cart on the detail screen.
4. Tap back to return to catalog.
5. Tap the cart tab to open the cart.
6. Assert the cart is not empty.

**Expected Result**  
Cart screen `isEmpty()` returns `false` — the item was added successfully.

**Notes**  
The cart badge count is not accessible via XCUITest accessibility tree; cart contents are verified by navigating to the cart screen instead.

**Automation**
```ts
expect(await CatalogScreen.getCartBadgeCount()).toBe(0);
await CatalogScreen.tapItem(0);
await ProductDetailScreen.isDisplayed();
await ProductDetailScreen.tapAddToCart();
await ProductDetailScreen.tapBack();
await CatalogScreen.isDisplayed();
await CatalogScreen.tapCart();
await CartScreen.isDisplayed();
expect(await CartScreen.isEmpty()).toBe(false);
```

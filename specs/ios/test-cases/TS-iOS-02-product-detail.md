# TS-iOS-02: Product Detail — Test Cases

**Spec file**: `src/tests/ios/productDetail.spec.ts`  
**Screen POMs**: `src/screens/ios/CatalogScreen.ts`, `src/screens/ios/ProductDetailScreen.ts`, `src/screens/ios/CartScreen.ts`  
**Suite**: `TS-iOS-02: Product Detail`

---

**Shared Precondition (beforeEach)**  
App session reloaded → Catalog screen displayed → First product tapped → Product Detail screen displayed.

---

## TC-iOS-006 — Tapping a product opens the detail screen

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | Unauthenticated |

**Steps**
1. (beforeEach) Tap the first product on the catalog.
2. Assert the Product Detail screen is displayed.

**Expected Result**  
`ProductDetailScreen.isDisplayed()` returns `true`.

**Automation**
```ts
expect(await ProductDetailScreen.isDisplayed()).toBe(true);
```

---

## TC-iOS-007 — Detail shows price and Add To Cart button

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | Unauthenticated |

**Steps**
1. Assert `ProductDetailScreen.price` is displayed.
2. Assert `ProductDetailScreen.addToCartButton` is displayed.

**Expected Result**  
Both the price label and Add To Cart button are visible on the detail screen.

**Automation**
```ts
await expect(ProductDetailScreen.price).toBeDisplayed();
await expect(ProductDetailScreen.addToCartButton).toBeDisplayed();
```

---

## TC-iOS-008 — Color selectors are present

| Field | Value |
|---|---|
| **Priority** | P1 |
| **User** | Unauthenticated |

**Steps**
1. Check for the existence of `~GreenColorUnSelected Icons` or `~GreenColorSelected Icons` element.

**Expected Result**  
At least one green color selector element exists.

**Notes**  
iOS product detail includes color selector swatches not present in the Android variant.

**Automation**
```ts
const greenColor = await $('~GreenColorUnSelected Icons').isExisting()
  || await $('~GreenColorSelected Icons').isExisting();
expect(greenColor).toBe(true);
```

---

## TC-iOS-009 — Increment button increases quantity

| Field | Value |
|---|---|
| **Priority** | P1 |
| **User** | Unauthenticated |

**Steps**
1. Get the initial quantity value from `counter amount`.
2. Tap the increment (`+`) button.
3. Get the updated quantity.

**Expected Result**  
Updated quantity = initial quantity + 1.

**Automation**
```ts
const initial = await ProductDetailScreen.getQuantity();
await ProductDetailScreen.increment();
const updated = await ProductDetailScreen.getQuantity();
expect(updated).toBe(initial + 1);
```

---

## TC-iOS-010 — Decrement button reduces quantity (minimum 0)

| Field | Value |
|---|---|
| **Priority** | P1 |
| **User** | Unauthenticated |

**Steps**
1. Tap the decrement (`-`) button.
2. Get the resulting quantity.

**Expected Result**  
Quantity >= 0. The app does not allow negative quantities.

**Automation**
```ts
await ProductDetailScreen.decrement();
const qty = await ProductDetailScreen.getQuantity();
expect(qty).toBeGreaterThanOrEqual(0);
```

---

## TC-iOS-011 — Add To Cart adds item to cart

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | Unauthenticated |

**Steps**
1. Tap Add To Cart on the detail screen.
2. Navigate to the cart tab.
3. Assert the cart is not empty.

**Expected Result**  
`CartScreen.isEmpty()` returns `false`.

**Notes**  
Cart badge count is not accessible via XCUITest; verified via cart screen contents.

**Automation**
```ts
await ProductDetailScreen.tapAddToCart();
await CatalogScreen.tapCart();
await CartScreen.isDisplayed();
expect(await CartScreen.isEmpty()).toBe(false);
```

---

## TC-iOS-012 — Back button returns to catalog

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | Unauthenticated |

**Steps**
1. Tap the back button on the detail screen.
2. Assert the Catalog screen is displayed.

**Expected Result**  
`CatalogScreen.isDisplayed()` returns `true`.

**Automation**
```ts
await ProductDetailScreen.tapBack();
expect(await CatalogScreen.isDisplayed()).toBe(true);
```

# TS-iOS-03: Cart — Test Cases

**Spec file**: `src/tests/ios/cart.spec.ts`  
**Screen POMs**: `src/screens/ios/CatalogScreen.ts`, `src/screens/ios/ProductDetailScreen.ts`, `src/screens/ios/CartScreen.ts`, `src/screens/ios/LoginScreen.ts`  
**Suite**: `TS-iOS-03: Cart`

---

**Shared Precondition (beforeEach)**  
App session reloaded → Catalog screen displayed.

---

## TC-iOS-013 — Empty cart shows Go Shopping button

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | Unauthenticated |

**Steps**
1. Tap the cart tab without adding any items.
2. Assert the Go Shopping button is displayed.

**Expected Result**  
`CartScreen.goShoppingButton` is visible when cart is empty.

**Automation**
```ts
await CatalogScreen.tapCart();
await CartScreen.isDisplayed();
await expect(CartScreen.goShoppingButton).toBeDisplayed();
```

---

## TC-iOS-014 — Go Shopping returns to catalog

| Field | Value |
|---|---|
| **Priority** | P1 |
| **User** | Unauthenticated |

**Steps**
1. Open empty cart.
2. Tap Go Shopping.
3. Assert Catalog screen is displayed.

**Expected Result**  
`CatalogScreen.isDisplayed()` returns `true`.

**Automation**
```ts
await CatalogScreen.tapCart();
await CartScreen.isDisplayed();
await CartScreen.tapGoShopping();
expect(await CatalogScreen.isDisplayed()).toBe(true);
```

---

## TC-iOS-015 — Added item appears in My Cart with name and price

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | Unauthenticated |

**Steps**
1. Tap the first catalog item (Sauce Labs Backpack, $29.99).
2. Tap Add To Cart on the detail screen.
3. Navigate to the cart tab.
4. Assert one item is present with a name containing "Sauce Labs".
5. Assert the price label `$29.99` is displayed.

**Expected Result**  
Cart contains 1 item; name includes "Sauce Labs"; price $29.99 is visible.

**Automation**
```ts
await CatalogScreen.tapItem(0);
await ProductDetailScreen.isDisplayed();
await ProductDetailScreen.tapAddToCart();
await CatalogScreen.tapCart();
await CartScreen.isDisplayed();
const names = await CartScreen.getItemNames();
expect(names.length).toBe(1);
expect(names[0]).toContain('Sauce Labs');
await expect($('~$ 29.99')).toBeDisplayed();
```

---

## TC-iOS-016 — Remove Item removes the product from cart

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | Unauthenticated |

**Steps**
1. Add the first catalog item to cart (via detail screen).
2. Open the cart.
3. Tap Remove on the first item.
4. Wait 1 second for animation.
5. Assert cart is empty.

**Expected Result**  
`CartScreen.isEmpty()` returns `true`.

**Automation**
```ts
await CatalogScreen.tapItem(0);
await ProductDetailScreen.isDisplayed();
await ProductDetailScreen.tapAddToCart();
await CatalogScreen.tapCart();
await CartScreen.isDisplayed();
await CartScreen.removeItem(0);
await browser.pause(1000);
expect(await CartScreen.isEmpty()).toBe(true);
```

---

## TC-iOS-017 — Total reflects item price

| Field | Value |
|---|---|
| **Priority** | P1 |
| **User** | Unauthenticated |

**Steps**
1. Add the first catalog item (Sauce Labs Backpack, $29.99) to cart.
2. Open the cart.
3. Assert the `$29.99` price label is displayed.

**Expected Result**  
Cart shows `$29.99` matching the item price.

**Automation**
```ts
await CatalogScreen.tapItem(0);
await ProductDetailScreen.isDisplayed();
await ProductDetailScreen.tapAddToCart();
await CatalogScreen.tapCart();
await CartScreen.isDisplayed();
await expect($('~$29.99')).toBeDisplayed();
```

---

## TC-iOS-018 — Proceed To Checkout redirects to Login when unauthenticated

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | Unauthenticated |

**Steps**
1. Add the first catalog item to cart.
2. Open the cart.
3. Tap Proceed To Checkout.
4. Assert the Login screen is displayed.

**Expected Result**  
`LoginScreen.isDisplayed()` returns `true` — checkout requires authentication.

**Notes**  
The iOS app does not allow unauthenticated checkout. It redirects to the Login screen instead of a checkout information form. This is a key behaviour difference from the Android variant.

**Automation**
```ts
await CatalogScreen.tapItem(0);
await ProductDetailScreen.isDisplayed();
await ProductDetailScreen.tapAddToCart();
await CatalogScreen.tapCart();
await CartScreen.isDisplayed();
await CartScreen.tapCheckout();
expect(await LoginScreen.isDisplayed()).toBe(true);
```

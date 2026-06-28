# TS-03: Product Detail

**Suite**: Product Detail  
**Screen**: Product Detail Screen  
**Automation file**: `src/tests/productDetail.spec.ts` *(to be created)*  
**POM**: `src/screens/ProductDetailScreen.ts` *(to be created)*  

---

## Screen Elements

| Element | Accessibility ID / Locator |
|---|---|
| Product image | `android.widget.ImageView` (first inside detail scroll) |
| Product name | `test-item title` |
| Product description | `test-item description` |
| Product price | `test-Price` |
| Add to cart button | `test-ADD TO CART` |
| Remove button | `test-REMOVE` |
| Back to products | `test-back to products` (back nav bar) |
| Cart icon | `test-Cart` |

---

## TC-021 — Open Detail by Tapping Product Image

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`; on Products screen

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap the image of Sauce Labs Backpack | Product Detail screen opens |
| 2 | Verify screen content | Full-width product image visible at top |
| 3 | Verify "BACK TO PRODUCTS" nav bar | Back navigation bar is visible below the app header |

**Pass Criteria**: Product Detail screen opens; "BACK TO PRODUCTS" shown

---

## TC-022 — Open Detail by Tapping Product Name

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`; on Products screen

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap the name label "Sauce Labs Bike Light" | Product Detail screen for Bike Light opens |
| 2 | Verify product name in detail | "Sauce Labs Bike Light" shown in red heading |

**Pass Criteria**: Correct product detail screen opens when tapping name

---

## TC-023 — Detail Screen Shows Correct Content

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: Opened detail for Sauce Labs Backpack

| Step | Action | Expected Result |
|---|---|---|
| 1 | Check product name | "Sauce Labs Backpack" displayed in red |
| 2 | Check description | "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection." |
| 3 | Check price | "$29.99" displayed in red |
| 4 | Check image | Timbuk2 backpack with Sauce Labs logo visible |

**Pass Criteria**: Name, description, price, and image all match expected values

---

## TC-024 — Add to Cart from Detail Screen

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: Opened detail for any product; cart is empty

| Step | Action | Expected Result |
|---|---|---|
| 1 | Scroll down on detail screen | ADD TO CART button is visible |
| 2 | Tap ADD TO CART | Button label changes to "REMOVE" |
| 3 | Observe cart icon in header | Badge shows `1` |

**Pass Criteria**: Button changes to REMOVE; cart badge = 1

---

## TC-025 — Remove from Detail Screen

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Product already added to cart; on detail screen showing REMOVE

| Step | Action | Expected Result |
|---|---|---|
| 1 | Scroll to REMOVE button | REMOVE button visible |
| 2 | Tap REMOVE | Button changes back to ADD TO CART |
| 3 | Check cart badge | Badge decrements (disappears if last item) |

**Pass Criteria**: Button resets; cart badge updates correctly

---

## TC-026 — BACK TO PRODUCTS Navigation

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: On Product Detail screen

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap "BACK TO PRODUCTS" in the sub-navigation bar | Returns to Products catalog screen |
| 2 | Verify catalog loaded | Product grid visible; same sort order as before |

**Pass Criteria**: Returns to catalog; no crash; header shows "PRODUCTS"

---

## Product Detail Content Reference

| Product | Description Excerpt | Price |
|---|---|---|
| Sauce Labs Backpack | carry.allTheThings() with the sleek, streamlined Sly Pack... | $29.99 |
| Sauce Labs Bike Light | A red light isn't the desired state in testing but it sure... | $9.99 |
| Sauce Labs Bolt T-Shirt | Get your testing superhero on with the Sauce Labs bolt... | $15.99 |
| Sauce Labs Fleece Jacket | It's not every day that you come across a midweight... | $49.99 |
| Sauce Labs Onesie | Rib snap infant onesie for the junior automation engineer... | $7.99 |
| Test.allTheThings() T-Shirt (Red) | This classic Sauce Labs t-shirt is perfect to wear... | $15.99 |

# TS-02: Products Catalog

**Suite**: Products Catalog  
**Screen**: Products Screen  
**Automation file**: `src/tests/products.spec.ts`  
**POM**: `src/screens/ProductsScreen.ts`  

---

## Screen Elements

| Element | Accessibility ID |
|---|---|
| Products scroll container | `test-PRODUCTS` |
| Product item container | `test-Item` |
| Product title | `test-Item title` |
| Product price | `test-Price` |
| Add to cart button | `test-ADD TO CART` |
| Remove button | `test-REMOVE` |
| Sort / filter button | `test-Modal Selector Button` |
| Layout toggle button | `test-Toggle` |
| Cart icon | `test-Cart` |
| Drag handle | `test-Drag Handle` |

---

## Product Catalogue Reference

| # | Name | Price |
|---|---|---|
| 1 | Sauce Labs Backpack | $29.99 |
| 2 | Sauce Labs Bike Light | $9.99 |
| 3 | Sauce Labs Bolt T-Shirt | $15.99 |
| 4 | Sauce Labs Fleece Jacket | $49.99 |
| 5 | Sauce Labs Onesie | $7.99 |
| 6 | Test.allTheThings() T-Shirt (Red) | $15.99 |

---

## TC-009 — 6 Products Displayed After Login

**Priority**: P0 | **Status**: Automated  

**Preconditions**: Logged in as `standard_user`

| Step | Action | Expected Result |
|---|---|---|
| 1 | Land on Products screen after login | Products screen is displayed |
| 2 | Scroll through the full catalog | All 6 product cards are visible |
| 3 | Count product items | `$$('~test-Item').length` returns 6 |

**Pass Criteria**: Exactly 6 products shown

---

## TC-010 — Each Product Card Has Name, Price, Image

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`

| Step | Action | Expected Result |
|---|---|---|
| 1 | Inspect the first product card (Sauce Labs Backpack) | Product image visible |
| 2 | Check product name label | Name "Sauce Labs Backpack" visible |
| 3 | Check price label | Price "$29.99" visible |
| 4 | Repeat for all 6 products | All cards have image + name + price |

**Pass Criteria**: Every card renders image, name, and price without placeholder text

---

## TC-011 — Sort — Name A to Z

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap filter icon (`test-Modal Selector Button`) | Sort modal appears with 4 options |
| 2 | Tap "Name (A to Z)" | Modal closes |
| 3 | Read product titles in order | Backpack, Bike Light, Bolt T-Shirt, Fleece Jacket, Onesie, Test.allTheThings() T-Shirt |

**Pass Criteria**: Products appear in alphabetical ascending order

---

## TC-012 — Sort — Name Z to A

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap filter icon | Sort modal appears |
| 2 | Tap "Name (Z to A)" | Modal closes |
| 3 | Read product titles in order | Test.allTheThings() T-Shirt, Onesie, Fleece Jacket, Bolt T-Shirt, Bike Light, Backpack |

**Pass Criteria**: Products appear in reverse alphabetical order

---

## TC-013 — Sort — Price Low to High

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap filter icon | Sort modal appears |
| 2 | Tap "Price (low to high)" | Modal closes |
| 3 | Read prices in order | $7.99, $9.99, $15.99, $15.99, $29.99, $49.99 |

**Pass Criteria**: Cheapest product (Onesie $7.99) is first; Fleece Jacket ($49.99) is last

---

## TC-014 — Sort — Price High to Low

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap filter icon | Sort modal appears |
| 2 | Tap "Price (high to low)" | Modal closes |
| 3 | Read prices in order | $49.99, $29.99, $15.99, $15.99, $9.99, $7.99 |

**Pass Criteria**: Most expensive product (Fleece Jacket $49.99) is first

---

## TC-015 — Sort Modal Cancel

**Priority**: P2 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`; products in default order

| Step | Action | Expected Result |
|---|---|---|
| 1 | Note current sort order | Default order observed |
| 2 | Tap filter icon | Modal opens |
| 3 | Tap "Cancel" | Modal dismisses without changing sort |
| 4 | Verify product order | Same as before modal was opened |

**Pass Criteria**: Sort order unchanged after tapping Cancel

---

## TC-016 — Add to Cart from Catalog

**Priority**: P0 | **Status**: Automated  

**Preconditions**: Logged in as `standard_user`; cart is empty

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap "ADD TO CART" on Sauce Labs Backpack | Button label changes to "REMOVE" |
| 2 | Observe cart icon in header | Badge appears showing `1` |

**Pass Criteria**: Button text = "REMOVE"; cart badge = "1"

---

## TC-017 — Remove from Catalog After Adding

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: At least one item already added to cart from catalog

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap "REMOVE" on a product that was added | Button label changes back to "ADD TO CART" |
| 2 | Observe cart icon | Badge decrements (disappears if 0) |

**Pass Criteria**: Button resets to "ADD TO CART"; cart badge count decrements

---

## TC-018 — Cart Badge Count Increments Correctly

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`; cart is empty

| Step | Action | Expected Result |
|---|---|---|
| 1 | Add first product | Badge = 1 |
| 2 | Add second product | Badge = 2 |
| 3 | Add third product | Badge = 3 |

**Pass Criteria**: Badge accurately reflects number of items added

---

## TC-019 — Problem User Image Defects

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Logged in as `problem_user`

| Step | Action | Expected Result |
|---|---|---|
| 1 | Navigate to Products screen | Products list loads |
| 2 | Observe product images | Images are incorrect — products show wrong/mismatched photos |
| 3 | Compare to `standard_user` view | Visible difference in image content |

**Pass Criteria**: Defect is reproducible and documented; does not crash the app

---

## TC-020 — Layout Toggle (Grid/List)

**Priority**: P2 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`; products in default 2-column grid

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap the toggle icon (`test-Toggle`) | Layout switches to single-column list view |
| 2 | Confirm products still visible | All 6 products shown in list format |
| 3 | Tap toggle again | Layout returns to 2-column grid |

**Pass Criteria**: Toggle switches between grid and list; products always visible

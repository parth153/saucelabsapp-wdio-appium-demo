# TS-04: Shopping Cart

**Suite**: Shopping Cart  
**Screen**: Cart Screen (YOUR CART)  
**Automation file**: `src/tests/cart.spec.ts` *(to be created)*  
**POM**: `src/screens/CartScreen.ts` *(to be created)*  

---

## Screen Elements

| Element | Accessibility ID |
|---|---|
| Cart screen container | `test-cart content` |
| Item container | `test-Item` |
| Item name | `test-Item title` |
| Item price | `test-Price` |
| Remove button | `test-REMOVE` |
| Continue shopping | `test-CONTINUE SHOPPING` |
| Checkout button | `test-CHECKOUT` |
| Cart icon (header) | `test-Cart` |
| Cart badge count | `test-Cart` → child `android.widget.TextView` |

---

## TC-027 — Cart Shows All Added Items

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`; added Backpack and Bike Light to cart

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap cart icon in header | Cart screen opens |
| 2 | Verify screen title | Header reads "YOUR CART" |
| 3 | Verify column headers | "QTY" and "DESCRIPTION" columns visible |
| 4 | Verify Backpack item | QTY=1, "Sauce Labs Backpack", description, "$29.99", REMOVE button |
| 5 | Verify Bike Light item | QTY=1, "Sauce Labs Bike Light", description, "$9.99", REMOVE button |

**Pass Criteria**: Both items listed with correct names, descriptions, prices, and QTY=1

---

## TC-028 — Cart Header and Column Labels

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`; at least 1 item in cart

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open cart | Cart screen shown |
| 2 | Read page title | "YOUR CART" |
| 3 | Read column headers | "QTY" on the left, "DESCRIPTION" on the right |

**Pass Criteria**: Correct titles and column headers displayed

---

## TC-029 — Remove Item from Cart

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: 2 items in cart

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open cart | Both items visible |
| 2 | Tap REMOVE on Sauce Labs Backpack | Backpack row disappears |
| 3 | Verify remaining items | Only Bike Light remains |
| 4 | Verify cart badge | Badge decrements from 2 to 1 |

**Pass Criteria**: Item removed from list; badge reflects new count

---

## TC-030 — Empty Cart State

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: 1 item in cart

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open cart | 1 item visible |
| 2 | Tap REMOVE | Item is removed |
| 3 | Observe cart state | No items listed; CONTINUE SHOPPING and CHECKOUT buttons still visible |
| 4 | Observe cart badge | Badge disappears from header icon |

**Pass Criteria**: Empty cart renders without crash; action buttons remain available

---

## TC-031 — Continue Shopping Returns to Catalog

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: On Cart screen with at least 1 item

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap "CONTINUE SHOPPING" | Returns to Products screen |
| 2 | Verify cart badge | Badge count preserved from before |
| 3 | Verify ADD TO CART buttons | Items already in cart still show "REMOVE" |

**Pass Criteria**: Catalog shown; cart state preserved after returning

---

## TC-032 — Cart Badge Clears After Checkout Complete

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: Item in cart; completed full checkout flow

| Step | Action | Expected Result |
|---|---|---|
| 1 | Complete checkout (Add → Cart → Checkout → Finish) | CHECKOUT: COMPLETE! screen shown |
| 2 | Observe cart icon badge | Badge is gone (no number shown) |
| 3 | Tap BACK HOME | Returns to Products; all ADD TO CART buttons visible (no REMOVE) |

**Pass Criteria**: Cart completely empty after successful order

---

## TC-033 — Error User Cart Behaviour

**Priority**: P2 | **Status**: Not Automated  

**Preconditions**: Logged in as `error_user`

| Step | Action | Expected Result |
|---|---|---|
| 1 | Add a product to cart | Product added or error shown |
| 2 | Open cart | Cart screen loads |
| 3 | Tap REMOVE on an item | Error or unexpected behaviour may occur |
| 4 | Document actual behaviour | Log result for defect tracking |

**Pass Criteria**: Behaviour documented; no crash (crash = defect)

**Notes**: This test is exploratory by nature. Exact error behaviour varies and should be documented as-found.

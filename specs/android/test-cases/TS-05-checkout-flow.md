# TS-05: Checkout Flow

**Suite**: Checkout Flow  
**Screens**: Checkout Step 1 (Information) → Step 2 (Overview) → Complete  
**Automation file**: `src/tests/checkout.spec.ts` *(to be created)*  
**POMs**:  
- `src/screens/CheckoutStep1Screen.ts` *(to be created)*  
- `src/screens/CheckoutStep2Screen.ts` *(to be created)*  
- `src/screens/CheckoutCompleteScreen.ts` *(to be created)*  

---

## Screen Elements

### Step 1 — CHECKOUT: INFORMATION

| Element | Accessibility ID |
|---|---|
| First Name field | `test-First Name` |
| Last Name field | `test-Last Name` |
| Zip/Postal Code field | `test-Zip/Postal Code` |
| Cancel button | `test-CANCEL` |
| Continue button | `test-CONTINUE` |
| Error message | `test-Error message` |

### Step 2 — CHECKOUT: OVERVIEW

| Element | Accessibility ID |
|---|---|
| Item container | `test-Item` |
| Cancel button | `test-CANCEL` |
| Finish button | `test-FINISH` |

### Checkout Complete

| Element | Accessibility ID |
|---|---|
| Complete container | `test-checkout complete` |
| Back Home button | `test-BACK HOME` |

---

## TC-034 — Full Checkout Happy Path

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`; Sauce Labs Backpack in cart

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open cart → tap CHECKOUT | CHECKOUT: INFORMATION screen shown |
| 2 | Tap First Name field, type `Test` | "Test" entered |
| 3 | Tap Last Name field, type `User` | "User" entered |
| 4 | Tap Zip field, type `10001` | "10001" entered |
| 5 | Tap CONTINUE | CHECKOUT: OVERVIEW screen shown |
| 6 | Verify order summary | Items, payment info, shipping info, and totals visible |
| 7 | Tap FINISH | CHECKOUT: COMPLETE! screen shown |
| 8 | Verify completion message | "THANK YOU FOR YOU ORDER" and Pony Express illustration visible |

**Pass Criteria**: CHECKOUT: COMPLETE! screen reached without errors

---

## TC-035 — Step 1 Screen Title

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Navigated to checkout from cart

| Step | Action | Expected Result |
|---|---|---|
| 1 | Arrive at checkout from cart | Screen displays page title |
| 2 | Read title text | "CHECKOUT: INFORMATION" |

**Pass Criteria**: Title is exactly "CHECKOUT: INFORMATION"

---

## TC-036 — Step 1 All Fields Required (Empty Form)

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: On CHECKOUT: INFORMATION; all fields empty

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap CONTINUE without filling any fields | Error banner appears |
| 2 | Read error text | Contains field-required error message |

**Pass Criteria**: Cannot proceed past Step 1 with empty form

---

## TC-037 — Step 1 Missing First Name

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: On CHECKOUT: INFORMATION

| Step | Action | Expected Result |
|---|---|---|
| 1 | Leave First Name empty | — |
| 2 | Fill Last Name with `User` | Last name entered |
| 3 | Fill Zip with `10001` | Zip entered |
| 4 | Tap CONTINUE | Error banner appears |
| 5 | Read error text | `"First Name is required"` |

**Pass Criteria**: Specific first-name error message shown

---

## TC-038 — Step 1 Missing Last Name

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: On CHECKOUT: INFORMATION

| Step | Action | Expected Result |
|---|---|---|
| 1 | Fill First Name with `Test` | — |
| 2 | Leave Last Name empty | — |
| 3 | Fill Zip with `10001` | — |
| 4 | Tap CONTINUE | Error banner appears |
| 5 | Read error text | `"Last Name is required"` |

**Pass Criteria**: Specific last-name error message shown

---

## TC-039 — Step 1 Missing Zip/Postal Code

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: On CHECKOUT: INFORMATION

| Step | Action | Expected Result |
|---|---|---|
| 1 | Fill First Name with `Test` | — |
| 2 | Fill Last Name with `User` | — |
| 3 | Leave Zip empty | — |
| 4 | Tap CONTINUE | Error banner appears |
| 5 | Read error text | `"Postal Code is required"` |

**Pass Criteria**: Specific postal code error message shown

---

## TC-040 — Step 1 CANCEL Returns to Cart

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: On CHECKOUT: INFORMATION (reached from cart)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap CANCEL button | Returns to Cart screen |
| 2 | Verify cart contents | Previously added items still in cart |

**Pass Criteria**: Cart screen shown with unchanged items

---

## TC-041 — Step 2 Screen Title

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Completed Step 1 form

| Step | Action | Expected Result |
|---|---|---|
| 1 | Complete Step 1 → land on Step 2 | Screen title visible |
| 2 | Read title text | "CHECKOUT: OVERVIEW" |

**Pass Criteria**: Title is exactly "CHECKOUT: OVERVIEW"

---

## TC-042 — Step 2 Shows Full Order Summary

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: On CHECKOUT: OVERVIEW with Backpack in order

| Step | Action | Expected Result |
|---|---|---|
| 1 | View Step 2 top section | QTY + DESCRIPTION columns; item listed |
| 2 | Scroll down | Payment info, shipping info, and price breakdown visible |

**Pass Criteria**: All summary sections rendered (see TC-043, TC-044, TC-045 for details)

---

## TC-043 — Step 2 Payment Information

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: On CHECKOUT: OVERVIEW

| Step | Action | Expected Result |
|---|---|---|
| 1 | Scroll to payment section | Payment info block visible |
| 2 | Read payment info | "Payment Information:" label + "SauceCard #31337" |

**Pass Criteria**: Payment method displayed as SauceCard #31337

---

## TC-044 — Step 2 Shipping Information

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: On CHECKOUT: OVERVIEW

| Step | Action | Expected Result |
|---|---|---|
| 1 | Scroll to shipping section | Shipping info block visible |
| 2 | Read shipping info | "Shipping Information:" + "FREE PONY EXPRESS DELIVERY!" |

**Pass Criteria**: Free shipping message shown

---

## TC-045 — Step 2 Totals Are Correct

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Sauce Labs Backpack ($29.99) in order on Step 2

| Step | Action | Expected Result |
|---|---|---|
| 1 | Scroll to price breakdown | Totals section visible |
| 2 | Read item total | "Item total: $29.99" |
| 3 | Read tax | "Tax: $2.40" |
| 4 | Read grand total | "**Total: $32.39**" |

**Pass Criteria**: All three values correct (item + 8% tax = grand total)

---

## TC-046 — Step 2 CANCEL Returns to Catalog

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: On CHECKOUT: OVERVIEW

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap CANCEL button | Returns to Products catalog screen |
| 2 | Verify cart badge | Cart still shows item count |

**Pass Criteria**: Products screen shown; cart not cleared by cancelling at Step 2

---

## TC-047 — Step 2 FINISH Completes Order

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: On CHECKOUT: OVERVIEW

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap FINISH button | CHECKOUT: COMPLETE! screen shown |

**Pass Criteria**: Completion screen reached

---

## TC-048 — Completion Screen Content

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: Just tapped FINISH; on CHECKOUT: COMPLETE! screen

| Step | Action | Expected Result |
|---|---|---|
| 1 | Read screen title | "CHECKOUT: COMPLETE!" |
| 2 | Read main message | "THANK YOU FOR YOU ORDER" (known typo — see BUG-001) |
| 3 | Read sub-message | "Your order has been dispatched, and will arrive just as fast as the pony can get there!" |
| 4 | Observe illustration | Pony Express Sauce Labs robot-rider illustration shown |
| 5 | Observe cart icon | No badge (cart is cleared) |
| 6 | Verify BACK HOME button | Button visible |

**Pass Criteria**: All content elements present; cart badge absent

---

## TC-049 — BUG-001: Typo in Completion Message

**Priority**: P2 | **Status**: Not Automated  

**Preconditions**: On CHECKOUT: COMPLETE! screen

| Step | Action | Expected Result |
|---|---|---|
| 1 | Read the main confirmation message | Text reads "THANK YOU FOR YOU ORDER" |
| 2 | Assert correct text | Expected: "THANK YOU FOR YOUR ORDER" |

**Pass Criteria (defect)**: Test is expected to FAIL — confirms BUG-001 is present  
**Notes**: Mark with `@pending` or skip until fix is deployed

---

## TC-050 — BACK HOME Returns to Catalog

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: On CHECKOUT: COMPLETE! screen

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap BACK HOME button | Products screen shown |
| 2 | Verify cart badge | No badge visible |
| 3 | Verify ADD TO CART buttons | All products show ADD TO CART (none show REMOVE) |

**Pass Criteria**: Products screen shown; cart is fully cleared after completed order

# TS-06: Side Menu / Navigation Drawer

**Suite**: Side Menu  
**Screen**: Side Drawer (accessible from any main screen via hamburger icon)  
**Automation file**: `src/tests/sideMenu.spec.ts` *(to be created)*  
**POM**: `src/screens/SideMenuDrawer.ts` *(to be created)*  

---

## Screen Elements

| Element | Accessibility ID |
|---|---|
| Menu button (hamburger) | `test-Menu` |
| Close (X) button | `test-close menu` |
| All Items | `test-ALL ITEMS` |
| Webview | `test-WEBVIEW` |
| QR Code Scanner | `test-QR CODE SCANNER` |
| Geo Location | `test-GEO LOCATION` |
| Drawing | `test-DRAWING` |
| About | `test-ABOUT` |
| Logout | `test-LOGOUT` |
| Reset App State | `test-RESET APP STATE` |

---

## Menu Items Reference

The side menu contains exactly **8 navigation items** (discovered during live analysis):

| # | Menu Item | Destination |
|---|---|---|
| 1 | ALL ITEMS | Products catalog |
| 2 | WEBVIEW | In-app web browser |
| 3 | QR CODE SCANNER | QR camera scanner |
| 4 | GEO LOCATION | Location display screen |
| 5 | DRAWING | Touch drawing canvas |
| 6 | ABOUT | About/info page |
| 7 | LOGOUT | Login screen (clears session) |
| 8 | RESET APP STATE | Clears cart + session data |

---

## TC-051 — Menu Opens with All 8 Items

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`; on Products screen

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap hamburger icon (`test-Menu`) in top-left | Side drawer slides in from left |
| 2 | Verify 8 menu items visible | ALL ITEMS, WEBVIEW, QR CODE SCANNER, GEO LOCATION, DRAWING, ABOUT, LOGOUT, RESET APP STATE |
| 3 | Verify X close button | X button visible in top-right of drawer |

**Pass Criteria**: Drawer open; all 8 items present; X button present

---

## TC-052 — X Button Closes Menu

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Side menu is open

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tap the X button in the top-right of drawer | Drawer closes |
| 2 | Verify underlying screen | Returns to whatever screen was open before menu |

**Pass Criteria**: Drawer closed; no navigation occurred

---

## TC-053 — ALL ITEMS Navigates to Catalog

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: On any screen other than Products (e.g., product detail)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open menu | Drawer visible |
| 2 | Tap ALL ITEMS | Navigates to Products catalog |
| 3 | Verify screen | "PRODUCTS" header visible; product grid shown |

**Pass Criteria**: Products catalog displayed after tapping ALL ITEMS

---

## TC-054 — LOGOUT Clears Session

**Priority**: P0 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`; items may be in cart

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open menu | Drawer visible |
| 2 | Tap LOGOUT | Login screen shown |
| 3 | Press device back button | App stays on Login screen or exits; does NOT return to Products |
| 4 | Attempt to open cart | Not possible from Login screen |

**Pass Criteria**: Login screen shown; session cleared; cannot bypass login via back button

---

## TC-055 — RESET APP STATE Clears Cart

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`; 2+ items in cart

| Step | Action | Expected Result |
|---|---|---|
| 1 | Note cart badge count (e.g., 2) | Badge = 2 |
| 2 | Open menu | Drawer visible |
| 3 | Tap RESET APP STATE | Drawer closes; Products screen shown |
| 4 | Verify cart badge | Badge is gone |
| 5 | Verify ADD TO CART buttons | All products show ADD TO CART (none show REMOVE) |

**Pass Criteria**: Cart emptied by reset; button states reset on all products

---

## TC-056 — ABOUT Opens Info Page

**Priority**: P2 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open menu | Drawer visible |
| 2 | Tap ABOUT | In-app webview or external browser opens with Sauce Labs info |
| 3 | Back navigate | Returns to app |

**Pass Criteria**: Content loads without crash

---

## TC-057 — Back Press Closes Menu

**Priority**: P2 | **Status**: Not Automated  

**Preconditions**: Side menu is open

| Step | Action | Expected Result |
|---|---|---|
| 1 | Press device hardware/software back button | Drawer closes |
| 2 | Verify underlying screen | Returns to the screen that was open before menu |

**Pass Criteria**: Menu closes on back press; no navigation triggered

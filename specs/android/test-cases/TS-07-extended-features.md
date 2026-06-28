# TS-07: Extended Feature Screens

**Suite**: Extended Features  
**Screens**: WebView, QR Code Scanner, Geo Location, Drawing  
**Automation file**: `src/tests/extendedFeatures.spec.ts` *(to be created)*  
**POMs**:  
- `src/screens/WebviewScreen.ts` *(to be created)*  
- `src/screens/QrScannerScreen.ts` *(to be created)*  
- `src/screens/GeoLocationScreen.ts` *(to be created)*  
- `src/screens/DrawingScreen.ts` *(to be created)*  

---

> **Note**: These screens were discovered during live app analysis (2026-06-27) and are not covered by any existing tests. They require device permissions (camera, location) and are best initially covered by exploratory manual testing before automating.

---

## TC-058 — WEBVIEW Screen Loads

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open side menu → tap WEBVIEW | WebView screen opens inside the app |
| 2 | Observe content | Web content renders (not a blank white screen) |
| 3 | Observe navigation controls | URL bar or navigation controls may be visible |
| 4 | Tap back or close | Returns to previous screen |

**Pass Criteria**: WebView loads content without crash; back navigation works

**Automation Notes**: Use `browser.switchToWebContext()` or handle as native if no context switch is needed. Verify with `driver.getContexts()`.

---

## TC-059 — QR CODE SCANNER Opens Camera View

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`; camera permission not yet granted on fresh emulator

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open side menu → tap QR CODE SCANNER | Camera permission dialog shown (if first time) OR camera view opens |
| 2 | Grant camera permission | Camera viewfinder displays |
| 3 | Observe QR overlay | Scanning reticle/overlay visible in camera view |
| 4 | Back navigate | Returns to previous screen |

**Pass Criteria**: Camera view shown with scan overlay; no crash on permission grant

**Automation Notes**: Handle Android permission dialog using `driver.acceptAlert()` or UiAutomator selector for "Allow" button.

---

## TC-060 — GEO LOCATION Shows Coordinates

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`; location permission not yet granted

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open side menu → tap GEO LOCATION | Location permission dialog shown (if first time) OR location screen opens |
| 2 | Grant location permission | Location screen shows latitude/longitude coordinates |
| 3 | Verify data displayed | Coordinates or map view shown; not a blank screen |
| 4 | Back navigate | Returns to previous screen |

**Pass Criteria**: Location data (or permission dialog) displayed; no crash

**Automation Notes**: Emulator geo location can be set via: `adb emu geo fix <longitude> <latitude>`

---

## TC-061 — DRAWING Canvas Renders

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open side menu → tap DRAWING | Drawing canvas screen opens |
| 2 | Observe canvas | Blank drawing area visible |
| 3 | Perform touch gesture on canvas | Line/mark drawn on canvas |
| 4 | Verify line persists | Drawing remains after lifting finger |
| 5 | Back navigate | Returns to previous screen |

**Pass Criteria**: Canvas renders; finger drawing creates visible marks; no crash

**Automation Notes**: Use `driver.touchAction()` or W3C touch actions to simulate drawing gestures.

---

## TC-062 — All Extended Screens Have Back Navigation

**Priority**: P1 | **Status**: Not Automated  

**Preconditions**: Logged in as `standard_user`

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open WEBVIEW → press back | Returns to Products screen or last screen |
| 2 | Open QR CODE SCANNER → press back | Returns to Products screen |
| 3 | Open GEO LOCATION → press back | Returns to Products screen |
| 4 | Open DRAWING → press back | Returns to Products screen |

**Pass Criteria**: All 4 extended screens allow back navigation without crashing or freezing

# TS-iOS-04: Login — Test Cases

**Spec file**: `src/tests/ios/login.spec.ts`  
**Screen POMs**: `src/screens/ios/CatalogScreen.ts`, `src/screens/ios/MoreMenuScreen.ts`, `src/screens/ios/LoginScreen.ts`  
**Suite**: `TS-iOS-04: Login`

---

**Shared Precondition (beforeEach)**  
App session reloaded → Catalog screen displayed → More tab opened (`MoreMenuScreen.open()`) → Login tapped → Login screen displayed.

---

## TC-iOS-019 — Login screen is accessible from More menu

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | Unauthenticated |

**Steps**
1. (beforeEach) Open More menu and tap Login.
2. Assert Login screen is displayed.

**Expected Result**  
`LoginScreen.isDisplayed()` returns `true`.

**Automation**
```ts
expect(await LoginScreen.isDisplayed()).toBe(true);
```

---

## TC-iOS-020 — Username shortcut list shows expected accounts

| Field | Value |
|---|---|
| **Priority** | P1 |
| **User** | Unauthenticated |

**Steps**
1. On the Login screen, assert each username shortcut is displayed:
   - `bob@example.com`
   - `alice@example.com`
   - `john@example.com`
   - `visual@example.com`

**Expected Result**  
All four username shortcuts are visible on the login screen.

**Notes**  
The iOS app uses email-format usernames unlike the Android variant (which uses shorthand names like `standard_user`).

**Automation**
```ts
await expect($('~bob@example.com')).toBeDisplayed();
await expect($('~alice@example.com')).toBeDisplayed();
await expect($('~john@example.com')).toBeDisplayed();
await expect($('~visual@example.com')).toBeDisplayed();
```

---

## TC-iOS-021 — Tapping a username shortcut fills the username field

| Field | Value |
|---|---|
| **Priority** | P1 |
| **User** | Unauthenticated |

**Steps**
1. Tap the `bob@example.com` username shortcut.
2. Get the value of the username field.

**Expected Result**  
Username field value equals `bob@example.com`.

**Automation**
```ts
await LoginScreen.tapUsernameShortcut('bob@example.com');
const value = await LoginScreen.usernameField.getValue();
expect(value).toBe('bob@example.com');
```

---

## TC-iOS-022 — Valid login with bob@example.com succeeds

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | `bob@example.com` / `10203040` |

**Steps**
1. Login using the `bob@example.com` shortcut and password `10203040`.
2. Open the More menu.
3. Assert the More menu shows a logged-in state (Logout visible).

**Expected Result**  
`MoreMenuScreen.isLoggedIn()` returns `true` — authenticated state is reflected in the More menu.

**Automation**
```ts
await LoginScreen.loginViaShortcut('bob@example.com', '10203040');
await MoreMenuScreen.open();
expect(await MoreMenuScreen.isLoggedIn()).toBe(true);
```

---

## TC-iOS-023 — Logout returns to unauthenticated state

| Field | Value |
|---|---|
| **Priority** | P0 |
| **User** | `bob@example.com` / `10203040` |

**Steps**
1. Login with `bob@example.com`.
2. Open More menu.
3. Tap Logout.
4. Open More menu again.
5. Assert Login button is displayed.

**Expected Result**  
`MoreMenuScreen.loginButton` is displayed — the session has been cleared.

**Automation**
```ts
await LoginScreen.loginViaShortcut('bob@example.com', '10203040');
await MoreMenuScreen.open();
await MoreMenuScreen.tapLogout();
await MoreMenuScreen.open();
expect(await MoreMenuScreen.loginButton.isDisplayed()).toBe(true);
```

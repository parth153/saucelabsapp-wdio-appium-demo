import CatalogScreen from '../../screens/ios/CatalogScreen';
import MoreMenuScreen from '../../screens/ios/MoreMenuScreen';
import LoginScreen from '../../screens/ios/LoginScreen';

describe('TS-iOS-04: Login', () => {
  beforeEach(async () => {
    await driver.reloadSession();
    await CatalogScreen.isDisplayed();
    await MoreMenuScreen.open();
    await MoreMenuScreen.tapLogin();
    await LoginScreen.isDisplayed();
  });

  it('TC-iOS-019: login screen is accessible from More menu', async () => {
    expect(await LoginScreen.isDisplayed()).toBe(true);
  });

  it('TC-iOS-020: username shortcut list shows expected accounts', async () => {
    await expect($('~bob@example.com')).toBeDisplayed();
    await expect($('~alice@example.com')).toBeDisplayed();
    await expect($('~john@example.com')).toBeDisplayed();
    await expect($('~visual@example.com')).toBeDisplayed();
  });

  it('TC-iOS-021: tapping a username shortcut fills the username field', async () => {
    await LoginScreen.tapUsernameShortcut('bob@example.com');
    const value = await LoginScreen.usernameField.getValue();
    expect(value).toBe('bob@example.com');
  });

  it('TC-iOS-022: valid login with bob@example.com succeeds', async () => {
    await LoginScreen.loginViaShortcut('bob@example.com', '10203040');
    // After login, More menu should show Logout instead of Login
    await MoreMenuScreen.open();
    expect(await MoreMenuScreen.isLoggedIn()).toBe(true);
  });

  it('TC-iOS-023: logout returns to unauthenticated state', async () => {
    await LoginScreen.loginViaShortcut('bob@example.com', '10203040');
    await MoreMenuScreen.open();
    await MoreMenuScreen.tapLogout();
    await MoreMenuScreen.open();
    expect(await MoreMenuScreen.loginButton.isDisplayed()).toBe(true);
  });
});

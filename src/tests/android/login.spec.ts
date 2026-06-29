import LoginScreen from '../../screens/android/LoginScreen';
import ProductsScreen from '../../screens/android/ProductsScreen';
import SideMenuDrawer from '../../screens/android/SideMenuDrawer';

describe('TS-01: Authentication', () => {
  beforeEach(async () => {
    await driver.terminateApp('com.swaglabsmobileapp');
    await driver.activateApp('com.swaglabsmobileapp');
    await LoginScreen.waitForDisplayed();
  });

  it('[smoke] TC-001: logs in with valid credentials (standard_user)', async () => {
    await LoginScreen.login('standard_user', 'secret_sauce');
    expect(await ProductsScreen.isDisplayed()).toBe(true);
  });

  it('TC-002: blocks locked_out_user with correct error message', async () => {
    await LoginScreen.login('locked_out_user', 'secret_sauce');
    const error = await LoginScreen.getErrorText();
    expect(error).toContain('Sorry, this user has been locked out.');
  });

  it('TC-003: shows error when password does not match', async () => {
    await LoginScreen.enterUsername('standard_user');
    await LoginScreen.enterPassword('wrong_password');
    await LoginScreen.tapLogin();
    const error = await LoginScreen.getErrorText();
    expect(error).toContain('Username and password do not match any user in this service');
  });

  it('TC-004: requires username when both fields are empty', async () => {
    await LoginScreen.tapLogin();
    const error = await LoginScreen.getErrorText();
    expect(error).toContain('Username is required');
  });

  it('TC-005: requires password when only username is entered', async () => {
    await LoginScreen.enterUsername('standard_user');
    await LoginScreen.tapLogin();
    const error = await LoginScreen.getErrorText();
    expect(error).toContain('Password is required');
  });

  it('TC-006: shows username error first when both fields are empty', async () => {
    await LoginScreen.tapLogin();
    const error = await LoginScreen.getErrorText();
    expect(error).toContain('Username is required');
    expect(error).not.toContain('Password is required');
  });

  it('TC-007: login succeeds after correcting wrong password', async () => {
    await LoginScreen.enterUsername('standard_user');
    await LoginScreen.enterPassword('wrong_password');
    await LoginScreen.tapLogin();
    await LoginScreen.getErrorText(); // waits for error banner
    await LoginScreen.clearPassword();
    await LoginScreen.enterPassword('secret_sauce');
    await LoginScreen.tapLogin();
    expect(await ProductsScreen.isDisplayed()).toBe(true);
  });

  it('TC-008: logout returns to login screen', async () => {
    await LoginScreen.login('standard_user', 'secret_sauce');
    await ProductsScreen.isDisplayed();
    await SideMenuDrawer.open();
    await SideMenuDrawer.tapLogout();
    expect(await LoginScreen.isDisplayed()).toBe(true);
  });
});

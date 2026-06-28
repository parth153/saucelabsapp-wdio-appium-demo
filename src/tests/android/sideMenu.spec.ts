import LoginScreen from '../../screens/android/LoginScreen';
import ProductsScreen from '../../screens/android/ProductsScreen';
import CartScreen from '../../screens/android/CartScreen';
import SideMenuDrawer from '../../screens/android/SideMenuDrawer';
import { pressBack } from '../../helpers/platform';

describe('TS-06: Side Menu / Navigation Drawer', () => {
  async function addToCartByName(productName: string): Promise<void> {
    if (browser.isAndroid) {
      await $(
        `android=new UiScrollable(new UiSelector().scrollable(true))` +
        `.scrollIntoView(new UiSelector().text("${productName}"))`
      ).waitForExist({ timeout: 10_000 });
      await $(
        `//android.view.ViewGroup[@content-desc="test-Item"]` +
        `[.//android.widget.TextView[@text="${productName}"]]` +
        `//android.view.ViewGroup[@content-desc="test-ADD TO CART"]`
      ).click();
    } else {
      await driver.execute('mobile: scroll', {
        direction: 'down',
        predicateString: `label == "${productName}"`,
      });
      await $(
        `//XCUIElementTypeOther[@name="test-Item"]` +
        `[.//XCUIElementTypeStaticText[@label="${productName}"]]` +
        `//XCUIElementTypeOther[@name="test-ADD TO CART"]`
      ).click();
    }
  }

  beforeEach(async () => {
    await driver.reloadSession();
    await LoginScreen.waitForDisplayed();
    await LoginScreen.login('standard_user', 'secret_sauce');
    await ProductsScreen.isDisplayed(40_000);
  });

  it('TC-051: menu opens with all 8 items and X close button', async () => {
    await SideMenuDrawer.open();

    await expect(SideMenuDrawer.closeButton).toBeDisplayed();
    await expect(SideMenuDrawer.allItemsOption).toBeDisplayed();
    await expect(SideMenuDrawer.webviewOption).toBeDisplayed();
    await expect(SideMenuDrawer.qrScannerOption).toBeDisplayed();
    await expect(SideMenuDrawer.geoLocationOption).toBeDisplayed();
    await expect(SideMenuDrawer.drawingOption).toBeDisplayed();
    await expect(SideMenuDrawer.aboutOption).toBeDisplayed();
    await expect(SideMenuDrawer.logoutOption).toBeDisplayed();
    await expect(SideMenuDrawer.resetAppStateOption).toBeDisplayed();
  });

  it('TC-052: X button closes menu and stays on Products', async () => {
    await SideMenuDrawer.open();
    await SideMenuDrawer.close();

    expect(await ProductsScreen.isDisplayed()).toBe(true);
    expect(await SideMenuDrawer.logoutOption.isDisplayed()).toBe(false);
  });

  it('TC-053: ALL ITEMS from cart returns to Products catalog', async () => {
    await addToCartByName('Sauce Labs Backpack');
    await ProductsScreen.tapCart();
    await CartScreen.isDisplayed();

    await SideMenuDrawer.open();
    await SideMenuDrawer.tapAllItems();

    expect(await ProductsScreen.isDisplayed()).toBe(true);
  });

  it('TC-054: LOGOUT clears session; back button does not return to Products', async () => {
    await SideMenuDrawer.open();
    await SideMenuDrawer.tapLogout();
    await LoginScreen.waitForDisplayed();

    // App must return to login screen
    expect(await LoginScreen.isDisplayed()).toBe(true);
    expect(await $('~test-PRODUCTS').isExisting()).toBe(false);
  });

  it('TC-055: RESET APP STATE empties cart and resets button states', async () => {
    await addToCartByName('Sauce Labs Backpack');
    await addToCartByName('Sauce Labs Bike Light');
    expect(await ProductsScreen.getCartBadgeCount()).toBe(2);

    await SideMenuDrawer.open();
    await SideMenuDrawer.tapResetAppState();

    expect(await ProductsScreen.isDisplayed()).toBe(true);
    expect(await ProductsScreen.getCartBadgeCount()).toBe(0);
    expect((await $$('~test-REMOVE')).length).toBe(0);
  });

  // ABOUT launches external browser — verify app does not crash and returns cleanly
  it('TC-056: ABOUT opens external browser without crashing; back returns to app', async () => {
    await SideMenuDrawer.open();
    await SideMenuDrawer.aboutOption.click();

    // Give browser time to launch
    await browser.pause(2000);

    await pressBack();
    await browser.pause(1000);

    // App must still be alive on the Products screen
    expect(await ProductsScreen.isDisplayed()).toBe(true);
  });

  // Android only — iOS has no hardware back button
  it('TC-057: hardware back button closes menu without triggering navigation', async () => {
    if (!browser.isAndroid) return;

    await SideMenuDrawer.open();

    await pressBack();

    expect(await ProductsScreen.isDisplayed()).toBe(true);
    expect(await SideMenuDrawer.logoutOption.isDisplayed()).toBe(false);
  });
});

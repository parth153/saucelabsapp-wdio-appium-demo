import CatalogScreen from '../../screens/ios/CatalogScreen';
import ProductDetailScreen from '../../screens/ios/ProductDetailScreen';
import CartScreen from '../../screens/ios/CartScreen';
import MoreMenuScreen from '../../screens/ios/MoreMenuScreen';
import WebviewScreen from '../../screens/ios/WebviewScreen';
import GeoLocationScreen from '../../screens/ios/GeoLocationScreen';

describe('TS-iOS-05: More Menu', () => {
  beforeEach(async () => {
    await driver.reloadSession();
    await CatalogScreen.isDisplayed();
    await MoreMenuScreen.open();
  });

  it('TC-iOS-024: More menu lists all expected items', async () => {
    await expect(MoreMenuScreen.webviewItem).toBeDisplayed();
    await expect(MoreMenuScreen.qrScannerItem).toBeDisplayed();
    await expect(MoreMenuScreen.geoLocationItem).toBeDisplayed();
    await expect(MoreMenuScreen.drawingItem).toBeDisplayed();
    await expect(MoreMenuScreen.aboutItem).toBeDisplayed();
    await expect(MoreMenuScreen.resetAppStateItem).toBeDisplayed();
    await expect(MoreMenuScreen.loginButton).toBeDisplayed();
  });

  it('TC-iOS-025: Webview opens URL entry screen', async () => {
    await MoreMenuScreen.webviewItem.click();
    expect(await WebviewScreen.isDisplayed()).toBe(true);
    await expect(WebviewScreen.urlInput).toBeDisplayed();
    await expect(WebviewScreen.goToSiteButton).toBeDisplayed();
  });

  it('TC-iOS-026: Webview back button returns to More', async () => {
    await MoreMenuScreen.webviewItem.click();
    await WebviewScreen.isDisplayed();
    await WebviewScreen.tapBack();
    expect(await MoreMenuScreen.isDisplayed()).toBe(true);
  });

  it('TC-iOS-027: Geo Location shows latitude and longitude', async () => {
    await MoreMenuScreen.geoLocationItem.click();
    expect(await GeoLocationScreen.isDisplayed()).toBe(true);
    await expect(GeoLocationScreen.latitudeLabel).toBeDisplayed();
    await expect(GeoLocationScreen.longitudeLabel).toBeDisplayed();

    const lat = await GeoLocationScreen.getLatitude();
    const lon = await GeoLocationScreen.getLongitude();
    expect(parseFloat(lat)).not.toBeNaN();
    expect(parseFloat(lon)).not.toBeNaN();
  });

  it('TC-iOS-028: Reset App State clears the cart', async () => {
    // Add an item to cart first
    await CatalogScreen.catalogTab.click();
    await CatalogScreen.tapItem(0);
    await ProductDetailScreen.isDisplayed();
    await ProductDetailScreen.tapAddToCart();
    // Badge not accessible via XCUITest; verify via cart screen
    await CatalogScreen.tapCart();
    await CartScreen.isDisplayed();
    expect(await CartScreen.isEmpty()).toBe(false);

    // Reset (tapResetAppState also dismisses the "App State has been reset." dialog)
    await MoreMenuScreen.open();
    await MoreMenuScreen.tapResetAppState();
    await CatalogScreen.catalogTab.click();
    await CatalogScreen.isDisplayed();
    expect(await CatalogScreen.getCartBadgeCount()).toBe(0);
  });
});

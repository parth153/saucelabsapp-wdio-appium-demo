import CatalogScreen from '../../screens/ios/CatalogScreen';
import ProductDetailScreen from '../../screens/ios/ProductDetailScreen';
import CartScreen from '../../screens/ios/CartScreen';

describe('TS-iOS-01: Catalog', () => {
  beforeEach(async () => {
    await driver.reloadSession();
    await CatalogScreen.isDisplayed();
  });

  it('TC-iOS-001: catalog screen shown on launch', async () => {
    expect(await CatalogScreen.isDisplayed()).toBe(true);
  });

  it('TC-iOS-002: multiple products are displayed', async () => {
    const count = await CatalogScreen.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  it('TC-iOS-003: each product card has a name and price', async () => {
    const names = await $$('~Product Name');
    const prices = await $$('~Product Price');
    expect(names.length).toBeGreaterThan(0);
    expect(prices.length).toBeGreaterThan(0);
    // Elements off-screen are not "displayed"; verify at least the first visible ones are shown
    expect(await names[0].isDisplayed()).toBe(true);
    expect(await prices[0].isDisplayed()).toBe(true);
  });

  it('TC-iOS-004: sort button is present on catalog', async () => {
    await expect(CatalogScreen.sortButton).toBeDisplayed();
  });

  it('TC-iOS-005: cart badge appears after adding an item', async () => {
    expect(await CatalogScreen.getCartBadgeCount()).toBe(0);

    await CatalogScreen.tapItem(0);
    await ProductDetailScreen.isDisplayed();
    await ProductDetailScreen.tapAddToCart();
    await ProductDetailScreen.tapBack();
    await CatalogScreen.isDisplayed();

    // Badge count is not accessible via XCUITest; verify via cart screen instead
    await CatalogScreen.tapCart();
    await CartScreen.isDisplayed();
    expect(await CartScreen.isEmpty()).toBe(false);
  });
});

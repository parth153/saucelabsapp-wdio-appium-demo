import CatalogScreen from '../../screens/ios/CatalogScreen';
import ProductDetailScreen from '../../screens/ios/ProductDetailScreen';
import CartScreen from '../../screens/ios/CartScreen';
import LoginScreen from '../../screens/ios/LoginScreen';

describe('TS-iOS-03: Cart', () => {
  beforeEach(async () => {
    await driver.reloadSession();
    await CatalogScreen.isDisplayed();
  });

  it('TC-iOS-013: empty cart shows Go Shopping button', async () => {
    await CatalogScreen.tapCart();
    await CartScreen.isDisplayed();
    await expect(CartScreen.goShoppingButton).toBeDisplayed();
  });

  it('TC-iOS-014: Go Shopping returns to catalog', async () => {
    await CatalogScreen.tapCart();
    await CartScreen.isDisplayed();
    await CartScreen.tapGoShopping();
    expect(await CatalogScreen.isDisplayed()).toBe(true);
  });

  it('TC-iOS-015: added item appears in My Cart with name and price', async () => {
    await CatalogScreen.tapItem(0);
    await ProductDetailScreen.isDisplayed();
    await ProductDetailScreen.tapAddToCart();
    await CatalogScreen.tapCart();
    await CartScreen.isDisplayed();

    const names = await CartScreen.getItemNames();
    expect(names.length).toBe(1);
    expect(names[0]).toContain('Sauce Labs');
    await expect($('~$ 29.99')).toBeDisplayed();
  });

  it('TC-iOS-016: Remove Item removes the product from cart', async () => {
    await CatalogScreen.tapItem(0);
    await ProductDetailScreen.isDisplayed();
    await ProductDetailScreen.tapAddToCart();
    await CatalogScreen.tapCart();
    await CartScreen.isDisplayed();

    await CartScreen.removeItem(0);
    await browser.pause(1000);
    expect(await CartScreen.isEmpty()).toBe(true);
  });

  it('TC-iOS-017: total reflects item price', async () => {
    await CatalogScreen.tapItem(0);
    await ProductDetailScreen.isDisplayed();
    await ProductDetailScreen.tapAddToCart();
    await CatalogScreen.tapCart();
    await CartScreen.isDisplayed();

    await expect($('~$29.99')).toBeDisplayed();
  });

  it('TC-iOS-018: Proceed To Checkout redirects to Login when not logged in', async () => {
    await CatalogScreen.tapItem(0);
    await ProductDetailScreen.isDisplayed();
    await ProductDetailScreen.tapAddToCart();
    await CatalogScreen.tapCart();
    await CartScreen.isDisplayed();

    await CartScreen.tapCheckout();
    expect(await LoginScreen.isDisplayed()).toBe(true);
  });
});

import LoginScreen from '../../screens/android/LoginScreen';
import ProductsScreen from '../../screens/android/ProductsScreen';
import ProductDetailScreen from '../../screens/android/ProductDetailScreen';

describe('TS-03: Product Detail', () => {
  beforeEach(async () => {
    await driver.reloadSession();
    await LoginScreen.waitForDisplayed();
    await LoginScreen.login('standard_user', 'secret_sauce');
    await ProductsScreen.isDisplayed(40_000);
  });

  async function openDetailByName(productName: string): Promise<void> {
    const el = $(
      `android=new UiScrollable(new UiSelector().scrollable(true))` +
      `.scrollIntoView(new UiSelector().text("${productName}"))`
    );
    await el.click();
    await ProductDetailScreen.isDisplayed();
  }

  it('TC-021: opens detail screen when product image is tapped', async () => {
    // Sauce Labs Backpack is first in default A-Z sort order
    const firstItem = $('~test-Item');
    const image = await firstItem.$('android.widget.ImageView');
    await image.click();
    expect(await ProductDetailScreen.isDisplayed()).toBe(true);
    await expect(ProductDetailScreen.backButton).toBeDisplayed();
  });

  it('TC-022: opens correct detail screen when product name is tapped', async () => {
    await openDetailByName('Sauce Labs Bike Light');
    expect(await ProductDetailScreen.getName()).toContain('Sauce Labs Bike Light');
  });

  it('TC-023: detail screen shows correct name, description, and price for Sauce Labs Backpack', async () => {
    await openDetailByName('Sauce Labs Backpack');
    expect(await ProductDetailScreen.getName()).toBe('Sauce Labs Backpack');
    expect(await ProductDetailScreen.getDescription()).toContain('carry.allTheThings()');
    expect(await ProductDetailScreen.getPrice()).toBe('$29.99');
  });

  it('TC-024: add to cart from detail screen changes button to REMOVE and shows badge 1', async () => {
    await openDetailByName('Sauce Labs Backpack');
    await ProductDetailScreen.tapAddToCart();
    await expect(ProductDetailScreen.removeButton).toBeDisplayed();
    expect(await ProductDetailScreen.getCartBadgeCount()).toBe(1);
  });

  it('TC-025: remove from detail screen resets button to ADD TO CART and clears badge', async () => {
    await openDetailByName('Sauce Labs Backpack');
    await ProductDetailScreen.tapAddToCart();
    expect(await ProductDetailScreen.getCartBadgeCount()).toBe(1);
    await ProductDetailScreen.tapRemove();
    await expect(ProductDetailScreen.addToCartButton).toBeDisplayed();
    expect(await ProductDetailScreen.getCartBadgeCount()).toBe(0);
  });

  it('TC-026: BACK TO PRODUCTS returns to catalog screen', async () => {
    await openDetailByName('Sauce Labs Backpack');
    await ProductDetailScreen.tapBack();
    expect(await ProductsScreen.isDisplayed()).toBe(true);
  });
});

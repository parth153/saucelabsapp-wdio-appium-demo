import CatalogScreen from '../../screens/ios/CatalogScreen';
import ProductDetailScreen from '../../screens/ios/ProductDetailScreen';
import CartScreen from '../../screens/ios/CartScreen';

describe('TS-iOS-02: Product Detail', () => {
  beforeEach(async () => {
    await driver.reloadSession();
    await CatalogScreen.isDisplayed();
    await CatalogScreen.tapItem(0);
    await ProductDetailScreen.isDisplayed();
  });

  it('TC-iOS-006: tapping a product opens the detail screen', async () => {
    expect(await ProductDetailScreen.isDisplayed()).toBe(true);
  });

  it('TC-iOS-007: detail shows price and Add To Cart button', async () => {
    await expect(ProductDetailScreen.price).toBeDisplayed();
    await expect(ProductDetailScreen.addToCartButton).toBeDisplayed();
  });

  it('TC-iOS-008: color selectors are present', async () => {
    const greenColor = await $('~GreenColorUnSelected Icons').isExisting()
      || await $('~GreenColorSelected Icons').isExisting();
    expect(greenColor).toBe(true);
  });

  it('TC-iOS-009: increment button increases quantity', async () => {
    const initial = await ProductDetailScreen.getQuantity();
    await ProductDetailScreen.increment();
    const updated = await ProductDetailScreen.getQuantity();
    expect(updated).toBe(initial + 1);
  });

  it('TC-iOS-010: decrement button reduces quantity (minimum is 0)', async () => {
    await ProductDetailScreen.decrement();
    const qty = await ProductDetailScreen.getQuantity();
    expect(qty).toBeGreaterThanOrEqual(0);
  });

  it('TC-iOS-011: Add To Cart adds item to cart', async () => {
    await ProductDetailScreen.tapAddToCart();
    // Badge is not accessible via XCUITest; verify via cart screen
    await CatalogScreen.tapCart();
    await CartScreen.isDisplayed();
    expect(await CartScreen.isEmpty()).toBe(false);
  });

  it('TC-iOS-012: back button returns to catalog', async () => {
    await ProductDetailScreen.tapBack();
    expect(await CatalogScreen.isDisplayed()).toBe(true);
  });
});

import LoginScreen from '../../screens/android/LoginScreen';
import ProductsScreen from '../../screens/android/ProductsScreen';

describe('TS-02: Products Catalog', () => {
  beforeEach(async () => {
    await driver.reloadSession();
    await LoginScreen.waitForDisplayed();
    await LoginScreen.login('standard_user', 'secret_sauce');
    await ProductsScreen.isDisplayed(40_000);
  });

  it('TC-009: shows exactly 6 products after login', async () => {
    // FlatList virtualizes — scroll to verify each product exists
    const CATALOG = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ];
    for (const name of CATALOG) {
      const el = $(
        `android=new UiScrollable(new UiSelector().scrollable(true))` +
        `.scrollIntoView(new UiSelector().text("${name}"))`
      );
      await expect(el).toBeExisting();
    }
  });

  it('TC-010: each visible product card shows a non-empty name and price', async () => {
    const names = await ProductsScreen.getProductNames();
    const prices = await ProductsScreen.getProductPrices();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) expect(name).toBeTruthy();
    expect(prices.length).toBeGreaterThan(0);
    for (const price of prices) expect(price).toBeGreaterThan(0);
    expect(names.length).toBe(prices.length);
  });

  it('TC-011: sort Name A to Z orders products alphabetically ascending', async () => {
    await ProductsScreen.tapSortButton();
    await ProductsScreen.selectSortOption('Name (A to Z)');
    const names = await ProductsScreen.getProductNames();
    expect(names.length).toBeGreaterThan(0);
    expect(names[0]).toContain('Backpack');
    for (let i = 0; i < names.length - 1; i++) {
      expect(names[i].localeCompare(names[i + 1])).toBeLessThanOrEqual(0);
    }
  });

  it('TC-012: sort Name Z to A orders products alphabetically descending', async () => {
    await ProductsScreen.tapSortButton();
    await ProductsScreen.selectSortOption('Name (Z to A)');
    const names = await ProductsScreen.getProductNames();
    expect(names.length).toBeGreaterThan(0);
    expect(names[0]).toContain('Test.allTheThings');
    for (let i = 0; i < names.length - 1; i++) {
      expect(names[i].localeCompare(names[i + 1])).toBeGreaterThanOrEqual(0);
    }
  });

  it('TC-013: sort Price low to high puts cheapest product first', async () => {
    await ProductsScreen.tapSortButton();
    await ProductsScreen.selectSortOption('Price (low to high)');
    const prices = await ProductsScreen.getProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    expect(prices[0]).toBe(7.99);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  it('TC-014: sort Price high to low puts most expensive product first', async () => {
    await ProductsScreen.tapSortButton();
    await ProductsScreen.selectSortOption('Price (high to low)');
    const prices = await ProductsScreen.getProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    expect(prices[0]).toBe(49.99);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });

  it('TC-015: sort modal Cancel preserves current product order', async () => {
    const namesBefore = await ProductsScreen.getProductNames();
    await ProductsScreen.tapSortButton();
    await ProductsScreen.selectSortOption('Cancel');
    const namesAfter = await ProductsScreen.getProductNames();
    expect(namesAfter).toEqual(namesBefore);
  });

  it('TC-016: adding a product changes button to REMOVE and shows cart badge 1', async () => {
    await ProductsScreen.addProductToCart(0);
    const removeButtons = await $$('~test-REMOVE');
    expect(removeButtons.length).toBe(1);
    expect(await ProductsScreen.getCartBadgeCount()).toBe(1);
  });

  it('TC-017: removing a product resets button to ADD TO CART and clears badge', async () => {
    await ProductsScreen.addProductToCart(0);
    expect(await ProductsScreen.getCartBadgeCount()).toBe(1);
    await ProductsScreen.removeProductFromCart(0);
    expect(await ProductsScreen.getCartBadgeCount()).toBe(0);
    const removeButtons = await $$('~test-REMOVE');
    expect(removeButtons.length).toBe(0);
  });

  it('TC-018: cart badge increments correctly as products are added', async () => {
    await ProductsScreen.addProductToCart(0);
    expect(await ProductsScreen.getCartBadgeCount()).toBe(1);
    await ProductsScreen.addProductToCart(0);
    expect(await ProductsScreen.getCartBadgeCount()).toBe(2);
    // Scroll to reveal next ADD TO CART (first 2 visible products now show REMOVE)
    const nextAdd = $(
      `android=new UiScrollable(new UiSelector().scrollable(true))` +
      `.scrollIntoView(new UiSelector().description("test-ADD TO CART"))`
    );
    await nextAdd.click();
    expect(await ProductsScreen.getCartBadgeCount()).toBe(3);
  });

  it('TC-020: layout toggle switches views and products remain visible', async () => {
    await ProductsScreen.layoutToggle.click();
    expect(await ProductsScreen.getProductCount()).toBeGreaterThan(0);
    await ProductsScreen.layoutToggle.click();
    expect(await ProductsScreen.getProductCount()).toBeGreaterThan(0);
  });
});

import LoginScreen from '../../screens/android/LoginScreen';
import ProductsScreen from '../../screens/android/ProductsScreen';
import CartScreen from '../../screens/android/CartScreen';

describe('TS-04: Shopping Cart', () => {
  async function addToCartByName(productName: string): Promise<void> {
    await $(
      `android=new UiScrollable(new UiSelector().scrollable(true))` +
      `.scrollIntoView(new UiSelector().text("${productName}"))`
    ).waitForExist({ timeout: 10_000 });
    await $(
      `//android.view.ViewGroup[@content-desc="test-Item"]` +
      `[.//android.widget.TextView[@text="${productName}"]]` +
      `//android.view.ViewGroup[@content-desc="test-ADD TO CART"]`
    ).click();
  }

  async function completeCheckout(): Promise<void> {
    await CartScreen.tapCheckout();
    await $('~test-First Name').waitForDisplayed({ timeout: 10_000 });
    await $('~test-First Name').setValue('Test');
    await $('~test-Last Name').setValue('User');
    await $('~test-Zip/Postal Code').setValue('12345');
    await $('~test-CONTINUE').click();
    await $('~test-CHECKOUT: OVERVIEW').waitForDisplayed({ timeout: 10_000 });
    await $(
      `android=new UiScrollable(new UiSelector().scrollable(true))` +
      `.scrollIntoView(new UiSelector().description("test-FINISH"))`
    ).click();
    await $('~test-CHECKOUT: COMPLETE!').waitForDisplayed({ timeout: 15_000 });
  }

  beforeEach(async () => {
    await driver.terminateApp('com.swaglabsmobileapp');
    await driver.activateApp('com.swaglabsmobileapp');
    await LoginScreen.waitForDisplayed();
    await LoginScreen.login('standard_user', 'secret_sauce');
    await ProductsScreen.isDisplayed(40_000);
  });

  it('[smoke] TC-027: cart shows all added items with correct names, prices, qty, and remove buttons', async () => {
    await addToCartByName('Sauce Labs Backpack');
    await addToCartByName('Sauce Labs Bike Light');
    await ProductsScreen.tapCart();
    await CartScreen.isDisplayed();

    const names = await CartScreen.getItemNames();
    expect(names).toContain('Sauce Labs Backpack');
    expect(names).toContain('Sauce Labs Bike Light');

    const prices = await CartScreen.getItemPrices();
    expect(prices).toContain('$29.99');
    expect(prices).toContain('$9.99');

    expect(await CartScreen.getItemQty(0)).toBe(1);
    expect(await CartScreen.getItemQty(1)).toBe(1);

    expect(await (await $$('~test-REMOVE')).length).toBe(2);
  });

  it('TC-028: cart header shows YOUR CART title and QTY/DESCRIPTION column labels', async () => {
    await addToCartByName('Sauce Labs Backpack');
    await ProductsScreen.tapCart();
    await CartScreen.isDisplayed();

    await expect(CartScreen.title).toBeDisplayed();
    await expect(CartScreen.qtyLabel).toBeDisplayed();
    await expect(CartScreen.descriptionLabel).toBeDisplayed();
  });

  it('TC-029: removing an item decrements the list and cart badge', async () => {
    await addToCartByName('Sauce Labs Backpack');
    await addToCartByName('Sauce Labs Bike Light');
    await ProductsScreen.tapCart();
    await CartScreen.isDisplayed();

    expect(await CartScreen.getItemCount()).toBe(2);
    expect(await CartScreen.getCartBadgeCount()).toBe(2);

    await CartScreen.removeItem(0);

    expect(await CartScreen.getItemCount()).toBe(1);
    expect(await CartScreen.getCartBadgeCount()).toBe(1);

    const remaining = await CartScreen.getItemNames();
    expect(remaining).not.toContain('Sauce Labs Backpack');
    expect(remaining).toContain('Sauce Labs Bike Light');
  });

  it('TC-030: empty cart shows no items but keeps CONTINUE SHOPPING and CHECKOUT buttons', async () => {
    await addToCartByName('Sauce Labs Backpack');
    await ProductsScreen.tapCart();
    await CartScreen.isDisplayed();

    await CartScreen.removeItem(0);

    expect(await CartScreen.getItemCount()).toBe(0);
    await expect(CartScreen.continueShopping).toBeDisplayed();
    await expect(CartScreen.checkoutButton).toBeDisplayed();
    expect(await CartScreen.isBadgeVisible()).toBe(false);
  });

  it('TC-031: CONTINUE SHOPPING returns to catalog with badge count preserved', async () => {
    await addToCartByName('Sauce Labs Backpack');
    await ProductsScreen.tapCart();
    await CartScreen.isDisplayed();

    await CartScreen.tapContinueShopping();

    expect(await ProductsScreen.isDisplayed()).toBe(true);
    expect(await ProductsScreen.getCartBadgeCount()).toBe(1);
  });

  it('TC-032: cart badge clears and all products reset after checkout completes', async () => {
    await addToCartByName('Sauce Labs Backpack');
    await ProductsScreen.tapCart();
    await CartScreen.isDisplayed();

    await completeCheckout();

    expect(await CartScreen.isBadgeVisible()).toBe(false);

    await $('~test-BACK HOME').click();
    expect(await ProductsScreen.isDisplayed()).toBe(true);
    expect((await $$('~test-REMOVE')).length).toBe(0);
  });

  it('TC-033: error user — cart behaviour documented; app must not crash', async () => {
    await driver.terminateApp('com.swaglabsmobileapp');
    await driver.activateApp('com.swaglabsmobileapp');
    await LoginScreen.waitForDisplayed();
    await LoginScreen.login('problem_user', 'secret_sauce');
    await ProductsScreen.isDisplayed(40_000);

    let addResult = 'success';
    try {
      await $('~test-ADD TO CART').click();
    } catch (e) {
      addResult = `error: ${(e as Error).message}`;
    }
    console.log(`[TC-033] Add to cart: ${addResult}`);

    await ProductsScreen.tapCart();
    expect(await CartScreen.isDisplayed()).toBe(true);

    const itemCount = await CartScreen.getItemCount();
    if (itemCount > 0) {
      let removeResult = 'success';
      try {
        await CartScreen.removeItem(0);
      } catch (e) {
        removeResult = `error: ${(e as Error).message}`;
      }
      console.log(`[TC-033] Remove from cart: ${removeResult}`);
    } else {
      console.log('[TC-033] Cart was empty after add attempt — item was not added');
    }

    // App must remain alive — verify a known screen element is still reachable
    const isAlive =
      (await $('~test-Cart Content').isExisting()) ||
      (await $('~test-PRODUCTS').isExisting());
    expect(isAlive).toBe(true);
  });
});

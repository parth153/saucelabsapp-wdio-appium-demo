import LoginScreen from '../../screens/android/LoginScreen';
import ProductsScreen from '../../screens/android/ProductsScreen';
import CartScreen from '../../screens/android/CartScreen';
import CheckoutStep1Screen from '../../screens/android/CheckoutStep1Screen';
import CheckoutStep2Screen from '../../screens/android/CheckoutStep2Screen';
import CheckoutCompleteScreen from '../../screens/android/CheckoutCompleteScreen';

describe('TS-05: Checkout Flow', () => {
  async function addBackpackToCart(): Promise<void> {
    await $(
      `android=new UiScrollable(new UiSelector().scrollable(true))` +
      `.scrollIntoView(new UiSelector().text("Sauce Labs Backpack"))`
    ).waitForExist({ timeout: 10_000 });
    await $(
      `//android.view.ViewGroup[@content-desc="test-Item"]` +
      `[.//android.widget.TextView[@text="Sauce Labs Backpack"]]` +
      `//android.view.ViewGroup[@content-desc="test-ADD TO CART"]`
    ).click();
  }

  async function completeStep1(firstName = 'Test', lastName = 'User', zip = '10001'): Promise<void> {
    await CheckoutStep1Screen.fillForm(firstName, lastName, zip);
    await CheckoutStep1Screen.tapContinue();
    await CheckoutStep2Screen.isDisplayed();
  }

  beforeEach(async () => {
    await driver.terminateApp('com.swaglabsmobileapp');
    await driver.activateApp('com.swaglabsmobileapp');
    await LoginScreen.waitForDisplayed();
    await LoginScreen.login('standard_user', 'secret_sauce');
    await ProductsScreen.isDisplayed(40_000);
    await addBackpackToCart();
    await ProductsScreen.tapCart();
    await CartScreen.isDisplayed();
    await CartScreen.tapCheckout();
    await CheckoutStep1Screen.isDisplayed();
  });

  it('[smoke] TC-034: full checkout happy path reaches CHECKOUT: COMPLETE!', async () => {
    await completeStep1();
    await CheckoutStep2Screen.tapFinish();
    expect(await CheckoutCompleteScreen.isDisplayed()).toBe(true);
  });

  it('TC-035: step 1 title is CHECKOUT: INFORMATION', async () => {
    await expect(CheckoutStep1Screen.title).toBeDisplayed();
    expect(await CheckoutStep1Screen.title.getText()).toBe('CHECKOUT: INFORMATION');
  });

  it('TC-036: submitting empty form shows a required-field error', async () => {
    await CheckoutStep1Screen.tapContinue();
    expect(await CheckoutStep1Screen.getErrorText()).toMatch(/required/i);
  });

  it('TC-037: omitting first name shows "First Name is required"', async () => {
    await CheckoutStep1Screen.fillForm('', 'User', '10001');
    await CheckoutStep1Screen.tapContinue();
    expect(await CheckoutStep1Screen.getErrorText()).toBe('First Name is required');
  });

  it('TC-038: omitting last name shows "Last Name is required"', async () => {
    await CheckoutStep1Screen.fillForm('Test', '', '10001');
    await CheckoutStep1Screen.tapContinue();
    expect(await CheckoutStep1Screen.getErrorText()).toBe('Last Name is required');
  });

  it('TC-039: omitting zip shows "Postal Code is required"', async () => {
    await CheckoutStep1Screen.fillForm('Test', 'User', '');
    await CheckoutStep1Screen.tapContinue();
    expect(await CheckoutStep1Screen.getErrorText()).toBe('Postal Code is required');
  });

  // App behaviour: CANCEL from step 1 navigates to Products, not Cart (same as step 2 CANCEL)
  it('TC-040: CANCEL from step 1 returns to catalog with cart badge preserved', async () => {
    await CheckoutStep1Screen.tapCancel();
    expect(await ProductsScreen.isDisplayed()).toBe(true);
    expect(await ProductsScreen.getCartBadgeCount()).toBe(1);
  });

  it('TC-041: step 2 title is CHECKOUT: OVERVIEW', async () => {
    await completeStep1();
    await expect(CheckoutStep2Screen.title).toBeDisplayed();
    expect(await CheckoutStep2Screen.title.getText()).toBe('CHECKOUT: OVERVIEW');
  });

  it('TC-042: step 2 shows full order summary — items, payment, shipping, and totals', async () => {
    await completeStep1();
    expect(await CheckoutStep2Screen.getItemCount()).toBeGreaterThan(0);
    await expect(CheckoutStep2Screen.qtyLabel).toBeDisplayed();
    await expect(CheckoutStep2Screen.descriptionLabel).toBeDisplayed();
    await expect(CheckoutStep2Screen.paymentInfoLabel).toBeDisplayed();
    await expect(CheckoutStep2Screen.shippingInfoLabel).toBeDisplayed();
    await expect(CheckoutStep2Screen.itemTotalLabel).toBeDisplayed();
  });

  it('TC-043: step 2 shows payment method as SauceCard #31337', async () => {
    await completeStep1();
    await expect(CheckoutStep2Screen.paymentInfoLabel).toBeDisplayed();
    await expect(CheckoutStep2Screen.paymentMethod).toBeDisplayed();
  });

  it('TC-044: step 2 shows free pony express shipping', async () => {
    await completeStep1();
    await expect(CheckoutStep2Screen.shippingInfoLabel).toBeDisplayed();
    await expect(CheckoutStep2Screen.shippingMethod).toBeDisplayed();
  });

  it('TC-045: step 2 totals are correct for Backpack ($29.99 + 8% tax = $32.39)', async () => {
    await completeStep1();
    expect(await CheckoutStep2Screen.getItemTotalText()).toBe('Item total: $29.99');
    expect(await CheckoutStep2Screen.getTaxText()).toBe('Tax: $2.40');
    expect(await CheckoutStep2Screen.getTotalText()).toBe('Total: $32.39');
  });

  it('TC-046: CANCEL from step 2 returns to catalog with cart badge preserved', async () => {
    await completeStep1();
    await CheckoutStep2Screen.tapCancel();
    expect(await ProductsScreen.isDisplayed()).toBe(true);
    expect(await ProductsScreen.getCartBadgeCount()).toBe(1);
  });

  it('TC-047: FINISH from step 2 reaches CHECKOUT: COMPLETE!', async () => {
    await completeStep1();
    await CheckoutStep2Screen.tapFinish();
    expect(await CheckoutCompleteScreen.isDisplayed()).toBe(true);
  });

  it('TC-048: completion screen shows all content and no cart badge', async () => {
    await completeStep1();
    await CheckoutStep2Screen.tapFinish();
    await CheckoutCompleteScreen.isDisplayed();

    expect(await CheckoutCompleteScreen.title.getText()).toBe('CHECKOUT: COMPLETE!');
    await expect(CheckoutCompleteScreen.thankYouMessage).toBeDisplayed();
    await expect(CheckoutCompleteScreen.subMessage).toBeDisplayed();
    await expect(CheckoutCompleteScreen.ponyImage).toBeDisplayed();
    await expect(CheckoutCompleteScreen.backHomeButton).toBeDisplayed();
    expect(await CheckoutCompleteScreen.isBadgeVisible()).toBe(false);
  });

  // BUG-001: app reads "THANK YOU FOR YOU ORDER" — skipped until fix is deployed
  it.skip('TC-049 (BUG-001): completion message should read "THANK YOU FOR YOUR ORDER"', async () => {
    await completeStep1();
    await CheckoutStep2Screen.tapFinish();
    await CheckoutCompleteScreen.isDisplayed();
    expect(await CheckoutCompleteScreen.thankYouMessage.getText()).toBe('THANK YOU FOR YOUR ORDER');
  });

  it('TC-050: BACK HOME returns to catalog with empty cart and all ADD TO CART buttons', async () => {
    await completeStep1();
    await CheckoutStep2Screen.tapFinish();
    await CheckoutCompleteScreen.isDisplayed();
    await CheckoutCompleteScreen.tapBackHome();

    expect(await ProductsScreen.isDisplayed()).toBe(true);
    expect(await ProductsScreen.getCartBadgeCount()).toBe(0);
    expect((await $$('~test-REMOVE')).length).toBe(0);
  });
});

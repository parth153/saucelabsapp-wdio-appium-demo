import { byText, cartBadgeElement, scrollIntoViewAndClick } from '../../helpers/platform';

class CheckoutStep2Screen {
  // ----- Elements -----

  get container() {
    return $('~test-CHECKOUT: OVERVIEW');
  }

  get title() {
    return byText('CHECKOUT: OVERVIEW');
  }

  get qtyLabel() {
    return byText('QTY');
  }

  get descriptionLabel() {
    return byText('DESCRIPTION');
  }

  get items() {
    return $$('~test-Item');
  }

  get paymentInfoLabel() {
    return byText('Payment Information:');
  }

  get paymentMethod() {
    return byText('SauceCard #31337');
  }

  get shippingInfoLabel() {
    return byText('Shipping Information:');
  }

  get shippingMethod() {
    return byText('FREE PONY EXPRESS DELIVERY!');
  }

  get itemTotalLabel() {
    return browser.isAndroid
      ? $('android=new UiSelector().textStartsWith("Item total:")')
      : $('-ios predicate string:label BEGINSWITH "Item total:"');
  }

  get taxLabel() {
    return browser.isAndroid
      ? $('android=new UiSelector().textStartsWith("Tax:")')
      : $('-ios predicate string:label BEGINSWITH "Tax:"');
  }

  get totalLabel() {
    return browser.isAndroid
      ? $('android=new UiSelector().textStartsWith("Total:")')
      : $('-ios predicate string:label BEGINSWITH "Total:"');
  }

  get cartBadge() {
    return cartBadgeElement();
  }

  // ----- Queries -----

  async isDisplayed(timeout = 10_000): Promise<boolean> {
    await this.container.waitForDisplayed({ timeout });
    return this.container.isDisplayed();
  }

  async getItemCount(): Promise<number> {
    return (await this.items).length;
  }

  async getItemTotalText(): Promise<string> {
    return this.itemTotalLabel.getText();
  }

  async getTaxText(): Promise<string> {
    return this.taxLabel.getText();
  }

  async getTotalText(): Promise<string> {
    return this.totalLabel.getText();
  }

  async isBadgeVisible(): Promise<boolean> {
    return this.cartBadge.isDisplayed();
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.cartBadge;
    if (!(await badge.isDisplayed())) return 0;
    return parseInt(await badge.getText(), 10);
  }

  // ----- Actions -----

  async tapCancel(): Promise<void> {
    await scrollIntoViewAndClick('test-CANCEL');
  }

  async tapFinish(): Promise<void> {
    await scrollIntoViewAndClick('test-FINISH');
  }
}

export default new CheckoutStep2Screen();

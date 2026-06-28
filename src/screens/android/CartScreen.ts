import { byText, nativeTextSelector, cartBadgeElement } from '../../helpers/platform';

class CartScreen {
  // ----- Elements -----

  get container() {
    return $('~test-Cart Content');
  }

  get title() {
    return byText('YOUR CART');
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

  get continueShopping() {
    return $('~test-CONTINUE SHOPPING');
  }

  get checkoutButton() {
    return $('~test-CHECKOUT');
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

  async getItemNames(): Promise<string[]> {
    const names: string[] = [];
    for (const item of await this.items) {
      const tv = await item.$('~test-Description').$(nativeTextSelector());
      names.push(await tv.getText());
    }
    return names;
  }

  async getItemPrices(): Promise<string[]> {
    const prices: string[] = [];
    for (const item of await this.items) {
      const tv = await item.$('~test-Price').$(nativeTextSelector());
      prices.push(await tv.getText());
    }
    return prices;
  }

  async getItemQty(index = 0): Promise<number> {
    const items = await this.items;
    const tv = await items[index].$('~test-Amount').$(nativeTextSelector());
    return parseInt(await tv.getText(), 10);
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.cartBadge;
    if (!(await badge.isDisplayed())) return 0;
    return parseInt(await badge.getText(), 10);
  }

  async isBadgeVisible(): Promise<boolean> {
    return this.cartBadge.isDisplayed();
  }

  // ----- Actions -----

  async removeItem(index = 0): Promise<void> {
    const buttons = await $$('~test-REMOVE');
    await buttons[index].click();
  }

  async tapContinueShopping(): Promise<void> {
    await this.continueShopping.click();
  }

  async tapCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}

export default new CartScreen();

class ProductsScreen {
  // ----- Elements -----

  get container() {
    return $('~test-PRODUCTS');
  }

  get cartIcon() {
    return $('~test-Cart');
  }

  get sortButton() {
    return $('~test-Modal Selector Button');
  }

  get layoutToggle() {
    return $('~test-Toggle');
  }

  get productItems() {
    return $$('~test-Item');
  }

  get addToCartButtons() {
    return $$('~test-ADD TO CART');
  }

  get cartBadge() {
    return $('~test-Cart').$('//android.widget.TextView');
  }

  // ----- Queries -----

  async isDisplayed(timeout = 20_000): Promise<boolean> {
    await this.container.waitForDisplayed({ timeout });
    return this.container.isDisplayed();
  }

  async getProductCount(): Promise<number> {
    return (await this.productItems).length;
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.cartBadge;
    if (!(await badge.isDisplayed())) return 0;
    return parseInt(await badge.getText(), 10);
  }

  // ----- Actions -----

  async addProductToCart(index = 0): Promise<void> {
    const buttons = await this.addToCartButtons;
    await buttons[index].click();
  }

  async tapCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async tapSortButton(): Promise<void> {
    await this.sortButton.click();
  }

  async selectSortOption(option: string): Promise<void> {
    const el = $(`android=new UiSelector().text("${option}")`);
    await el.waitForDisplayed({ timeout: 5_000 });
    await el.click();
    await this.container.waitForDisplayed({ timeout: 5_000 });
  }

  async removeProductFromCart(index = 0): Promise<void> {
    const buttons = await $$('~test-REMOVE');
    await buttons[index].click();
  }

  async getProductNames(): Promise<string[]> {
    const elements = await $$('~test-Item title');
    const names: string[] = [];
    for (const el of elements) {
      let text = await el.getText();
      if (!text) {
        const tv = await el.$('android.widget.TextView');
        if (await tv.isExisting()) text = await tv.getText();
      }
      if (text) names.push(text);
    }
    return names;
  }

  async getProductPrices(): Promise<number[]> {
    const elements = await $$('~test-Price');
    const prices: number[] = [];
    for (const el of elements) {
      let text = await el.getText();
      if (!text) {
        const tv = await el.$('android.widget.TextView');
        if (await tv.isExisting()) text = await tv.getText();
      }
      if (text) prices.push(parseFloat(text.replace('$', '')));
    }
    return prices;
  }
}

export default new ProductsScreen();

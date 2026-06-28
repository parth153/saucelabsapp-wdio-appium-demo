class ProductDetailScreen {
  // ----- Elements -----

  get backButton() {
    return $('~test-BACK TO PRODUCTS');
  }

  get productName() {
    return $('(//android.view.ViewGroup[@content-desc="test-Description"]//android.widget.TextView)[1]');
  }

  get productDescription() {
    return $('(//android.view.ViewGroup[@content-desc="test-Description"]//android.widget.TextView)[2]');
  }

  get productPrice() {
    return $('~test-Price');
  }

  get addToCartButton() {
    return $('~test-ADD TO CART');
  }

  get removeButton() {
    return $('~test-REMOVE');
  }

  get cartBadge() {
    return $('~test-Cart').$('//android.widget.TextView');
  }

  // ----- Queries -----

  async isDisplayed(timeout = 20_000): Promise<boolean> {
    await this.backButton.waitForDisplayed({ timeout });
    return this.backButton.isDisplayed();
  }

  async getName(): Promise<string> {
    let text = await this.productName.getText();
    if (!text) {
      const tv = await this.productName.$('android.widget.TextView');
      if (await tv.isExisting()) text = await tv.getText();
    }
    return text;
  }

  async getDescription(): Promise<string> {
    let text = await this.productDescription.getText();
    if (!text) {
      const tv = await this.productDescription.$('android.widget.TextView');
      if (await tv.isExisting()) text = await tv.getText();
    }
    return text;
  }

  async getPrice(): Promise<string> {
    let text = await this.productPrice.getText();
    if (!text) {
      const tv = await this.productPrice.$('android.widget.TextView');
      if (await tv.isExisting()) text = await tv.getText();
    }
    return text;
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.cartBadge;
    if (!(await badge.isDisplayed())) return 0;
    return parseInt(await badge.getText(), 10);
  }

  // ----- Actions -----

  async tapAddToCart(): Promise<void> {
    const el = $(
      `android=new UiScrollable(new UiSelector().scrollable(true))` +
      `.scrollIntoView(new UiSelector().description("test-ADD TO CART"))`
    );
    await el.waitForExist({ timeout: 10_000 });
    await this.addToCartButton.click();
  }

  async tapRemove(): Promise<void> {
    const el = $(
      `android=new UiScrollable(new UiSelector().scrollable(true))` +
      `.scrollIntoView(new UiSelector().description("test-REMOVE"))`
    );
    await el.waitForExist({ timeout: 10_000 });
    await this.removeButton.click();
  }

  async tapBack(): Promise<void> {
    await this.backButton.click();
  }
}

export default new ProductDetailScreen();

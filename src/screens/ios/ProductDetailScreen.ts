class ProductDetailScreen {
  get container() { return $('~ProductDetails-screen'); }
  get backButton() { return $('~Products'); }
  get addToCartButton() { return $('~AddToCart'); }
  get quantityAmount() { return $('~Amount'); }
  get incrementButton() { return $('~AddPlus Icons'); }
  get decrementButton() { return $('~SubtractMinus Icons'); }
  get price() { return $('~Price'); }

  async isDisplayed(timeout = 10_000): Promise<boolean> {
    await this.container.waitForDisplayed({ timeout });
    return this.container.isDisplayed();
  }

  async getProductName(): Promise<string> {
    // Product name is a static text child of the container
    const el = await this.container.$('XCUIElementTypeStaticText');
    return el.getText();
  }

  async getQuantity(): Promise<number> {
    return parseInt(await this.quantityAmount.getText(), 10);
  }

  async tapAddToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async tapBack(): Promise<void> {
    await $('-ios class chain:**/XCUIElementTypeButton[1]').click();
  }

  async increment(): Promise<void> {
    await this.incrementButton.click();
  }

  async decrement(): Promise<void> {
    await this.decrementButton.click();
  }
}

export default new ProductDetailScreen();

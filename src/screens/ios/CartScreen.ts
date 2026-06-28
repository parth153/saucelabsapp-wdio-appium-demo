class CartScreen {
  get container() { return $('~Cart-screen'); }
  get goShoppingButton() { return $('~GoShopping'); }
  get checkoutButton() { return $('~ProceedToCheckout'); }
  get removeItemButton() { return $('~Remove Item'); }
  get cartTab() { return $('~Cart-tab-item'); }

  async isDisplayed(timeout = 10_000): Promise<boolean> {
    await this.container.waitForDisplayed({ timeout });
    return this.container.isDisplayed();
  }

  async isEmpty(): Promise<boolean> {
    return this.goShoppingButton.isDisplayed();
  }

  async getTotalText(): Promise<string> {
    const el = await $('~Total:');
    return el.getText();
  }

  async getItemNames(): Promise<string[]> {
    // Item names are static texts that are not UI chrome (not 'My Cart', 'Color:', etc.)
    const texts = await $$('XCUIElementTypeStaticText');
    const names: string[] = [];
    for (const t of texts) {
      const label = await t.getAttribute('label');
      if (label && label.startsWith('Sauce Labs')) names.push(label);
    }
    return names;
  }

  async removeItem(index = 0): Promise<void> {
    const btns = await $$('~Remove Item');
    await btns[index].click();
  }

  async tapGoShopping(): Promise<void> {
    await this.goShoppingButton.click();
  }

  async tapCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}

export default new CartScreen();

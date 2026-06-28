class CatalogScreen {
  get container() { return $('~Catalog-screen'); }
  get sortButton() { return $('~Button'); }
  get items() { return $$('~ProductItem'); }
  get catalogTab() { return $('~Catalog-tab-item'); }
  get cartTab() { return $('~Cart-tab-item'); }
  get moreTab() { return $('~More-tab-item'); }

  get cartBadge() {
    // Badge digit sits inside the cart tab as a static text
    return $('~Cart-tab-item').$('XCUIElementTypeStaticText');
  }

  async isDisplayed(timeout = 15_000): Promise<boolean> {
    await this.container.waitForDisplayed({ timeout });
    return this.container.isDisplayed();
  }

  async getItemCount(): Promise<number> {
    return (await this.items).length;
  }

  async tapItem(index = 0): Promise<void> {
    const items = await this.items;
    await items[index].click();
  }

  async getCartBadgeCount(): Promise<number> {
    try {
      const badge = this.cartBadge;
      if (!(await badge.isExisting())) return 0;
      const text = await badge.getText();
      const count = parseInt(text, 10);
      return isNaN(count) ? 0 : count;
    } catch {
      return 0;
    }
  }

  async tapCart(): Promise<void> {
    await this.cartTab.click();
  }

  async tapMore(): Promise<void> {
    await this.moreTab.click();
  }
}

export default new CatalogScreen();

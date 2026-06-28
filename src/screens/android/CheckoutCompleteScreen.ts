class CheckoutCompleteScreen {
  // ----- Elements -----

  get container() {
    return $('~test-CHECKOUT: COMPLETE!');
  }

  get title() {
    return $('android=new UiSelector().text("CHECKOUT: COMPLETE!")');
  }

  // BUG-001: intentional typo in the app — "YOU" instead of "YOUR"
  get thankYouMessage() {
    return $('android=new UiSelector().text("THANK YOU FOR YOU ORDER")');
  }

  get subMessage() {
    return $(
      'android=new UiSelector().text(' +
      '"Your order has been dispatched, and will arrive just as fast as the pony can get there!"' +
      ')'
    );
  }

  get ponyImage() {
    return $('~test-CHECKOUT: COMPLETE!').$('android.widget.ImageView');
  }

  get backHomeButton() {
    return $('~test-BACK HOME');
  }

  get cartBadge() {
    return $('~test-Cart').$('//android.widget.TextView');
  }

  // ----- Queries -----

  async isDisplayed(timeout = 15_000): Promise<boolean> {
    await this.container.waitForDisplayed({ timeout });
    return this.container.isDisplayed();
  }

  async isBadgeVisible(): Promise<boolean> {
    return this.cartBadge.isDisplayed();
  }

  // ----- Actions -----

  async tapBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}

export default new CheckoutCompleteScreen();

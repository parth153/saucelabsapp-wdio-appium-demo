class WebviewScreen {
  // ----- Elements -----

  get container() {
    return $('~test-WEBVIEW SELECTION');
  }

  get title() {
    return $('android=new UiSelector().text("WEBVIEW SELECTION")');
  }

  get urlInput() {
    return $('~test-enter a https url here...');
  }

  get goToSiteButton() {
    return $('~test-GO TO SITE');
  }

  get errorMessage() {
    return $('~test-Error message');
  }

  // ----- Queries -----

  async isDisplayed(timeout = 10_000): Promise<boolean> {
    await this.container.waitForDisplayed({ timeout });
    return this.container.isDisplayed();
  }

  async getErrorText(): Promise<string> {
    await this.errorMessage.waitForExist({ timeout: 5_000 });
    return this.errorMessage.$('android.widget.TextView').getText();
  }

  // ----- Actions -----

  async enterUrl(url: string): Promise<void> {
    await this.urlInput.setValue(url);
  }

  async tapGoToSite(): Promise<void> {
    await this.goToSiteButton.click();
  }
}

export default new WebviewScreen();

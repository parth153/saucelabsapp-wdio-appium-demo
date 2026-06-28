class WebviewScreen {
  get container() { return $('~Webview-screen'); }
  get backButton() { return $('~More'); }
  get urlInput() { return $('~URL'); }
  get goToSiteButton() { return $('~Go To Site'); }

  async isDisplayed(timeout = 10_000): Promise<boolean> {
    await this.container.waitForDisplayed({ timeout });
    return this.container.isDisplayed();
  }

  async tapBack(): Promise<void> {
    // Back button is the unnamed nav button — in Webview, Go To Site is index 0 so back is index 1
    await (await $$('XCUIElementTypeButton'))[1].click();
  }

  async enterUrl(url: string): Promise<void> {
    await this.urlInput.setValue(url);
  }

  async tapGoToSite(): Promise<void> {
    await this.goToSiteButton.click();
  }
}

export default new WebviewScreen();

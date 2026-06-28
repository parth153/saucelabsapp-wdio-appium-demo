class SideMenuDrawer {
  // ----- Elements -----

  get menuButton() {
    return $('~test-Menu');
  }

  get closeButton() {
    return $('~test-Close');
  }

  get allItemsOption() {
    return $('~test-ALL ITEMS');
  }

  get logoutOption() {
    return $('~test-LOGOUT');
  }

  get resetAppStateOption() {
    return $('~test-RESET APP STATE');
  }

  get webviewOption() {
    return $('~test-WEBVIEW');
  }

  get qrScannerOption() {
    return $('~test-QR CODE SCANNER');
  }

  get geoLocationOption() {
    return $('~test-GEO LOCATION');
  }

  get drawingOption() {
    return $('~test-DRAWING');
  }

  get aboutOption() {
    return $('~test-ABOUT');
  }

  // ----- Actions -----

  async open(): Promise<void> {
    await this.menuButton.waitForDisplayed({ timeout: 10_000 });
    await this.menuButton.click();
    await this.logoutOption.waitForDisplayed({ timeout: 5_000 });
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  async tapLogout(): Promise<void> {
    await this.logoutOption.click();
  }

  async tapAllItems(): Promise<void> {
    await this.allItemsOption.click();
  }

  async tapResetAppState(): Promise<void> {
    await this.resetAppStateOption.click();
  }
}

export default new SideMenuDrawer();

class MoreMenuScreen {
  get moreTab() { return $('~More-tab-item'); }
  get webviewItem() { return $('~Webview-menu-item'); }
  get qrScannerItem() { return $('~QrCodeScanner-menu-item'); }
  get geoLocationItem() { return $('~GeoLocation-menu-item'); }
  get drawingItem() { return $('~Drawing-menu-item'); }
  get aboutItem() { return $('~About-menu-item'); }
  get resetAppStateItem() { return $('~ResetAppState-menu-item'); }
  get loginButton() { return $('~Login Button'); }
  get logoutItem() { return $('~LogOut-menu-item'); }
  get crashItem() { return $('~CrashTheApp-menu-item'); }

  async open(): Promise<void> {
    await this.moreTab.click();
    await this.webviewItem.waitForDisplayed({ timeout: 10_000 });
  }

  async isDisplayed(): Promise<boolean> {
    return this.webviewItem.isDisplayed();
  }

  async tapLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async tapLogout(): Promise<void> {
    await this.logoutItem.click();
  }

  async tapResetAppState(): Promise<void> {
    await this.resetAppStateItem.click();
    // Dismiss "App State has been reset." alert
    const ok = await $('~OK');
    await ok.waitForDisplayed({ timeout: 5000 });
    await ok.click();
  }

  async isLoggedIn(): Promise<boolean> {
    return this.logoutItem.isExisting();
  }
}

export default new MoreMenuScreen();

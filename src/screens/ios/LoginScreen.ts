class LoginScreen {
  get container() { return $('~Login'); }
  get usernameField() { return $('XCUIElementTypeTextField'); }
  get passwordField() { return $('XCUIElementTypeSecureTextField'); }
  get loginButton() { return $('//XCUIElementTypeButton[@name="Login"]'); }

  async isDisplayed(timeout = 10_000): Promise<boolean> {
    await this.container.waitForDisplayed({ timeout });
    return this.container.isDisplayed();
  }

  async tapUsernameShortcut(email: string): Promise<void> {
    await $(`~${email}`).click();
  }

  async enterUsername(username: string): Promise<void> {
    const field = this.usernameField;
    await field.clearValue();
    await field.setValue(username);
  }

  async enterPassword(password: string): Promise<void> {
    const field = this.passwordField;
    await field.clearValue();
    await field.setValue(password);
  }

  async tapLogin(): Promise<void> {
    await this.loginButton.click();
  }

  private async dismissSavePasswordPrompt(): Promise<void> {
    try {
      const notNow = $('~Not Now');
      await notNow.waitForDisplayed({ timeout: 3000 });
      await notNow.click();
    } catch { /* prompt didn't appear */ }
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.usernameField.click(); // shift focus to dismiss keyboard without clearing password
    await this.tapLogin();
    await this.dismissSavePasswordPrompt();
  }

  async loginViaShortcut(email: string, password: string): Promise<void> {
    await this.tapUsernameShortcut(email);
    await this.enterPassword(password);
    await this.usernameField.click(); // shift focus to dismiss keyboard without clearing password
    await this.tapLogin();
    await this.dismissSavePasswordPrompt();
  }
}

export default new LoginScreen();

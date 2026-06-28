class LoginScreen {
  // ----- Elements -----

  get usernameInput() {
    return $('~test-Username');
  }

  get passwordInput() {
    return $('~test-Password');
  }

  get loginButton() {
    return $('~test-LOGIN');
  }

  get errorMessage() {
    return $('~test-Error message');
  }

  get scrollContainer() {
    return $('~test-Login');
  }

  // ----- Queries -----

  async isDisplayed(): Promise<boolean> {
    return this.loginButton.isDisplayed();
  }

  async waitForDisplayed(timeout = 10_000): Promise<void> {
    await this.loginButton.waitForDisplayed({ timeout });
  }

  async getErrorText(): Promise<string> {
    await this.errorMessage.waitForExist({ timeout: 8_000 });
    // errorMessage is a React Native ViewGroup container; getText() returns "".
    // The visible text lives in the child TextView.
    return this.errorMessage.$('android.widget.TextView').getText();
  }

  async isErrorDisplayed(): Promise<boolean> {
    return this.errorMessage.isExisting();
  }

  async getUsernameValue(): Promise<string> {
    return this.usernameInput.getText();
  }

  // ----- Actions -----

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.waitForDisplayed({ timeout: 10_000 });
    await this.usernameInput.setValue(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.setValue(password);
  }

  async tapLogin(): Promise<void> {
    await this.loginButton.waitForDisplayed({ timeout: 10_000 });
    await this.loginButton.click();
  }

  async clearUsername(): Promise<void> {
    await this.usernameInput.clearValue();
  }

  async clearPassword(): Promise<void> {
    await this.passwordInput.clearValue();
  }

  // ----- Compound actions -----

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.tapLogin();
  }
}

export default new LoginScreen();

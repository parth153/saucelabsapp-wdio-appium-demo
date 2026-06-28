class CheckoutStep1Screen {
  // ----- Elements -----

  get container() {
    return $('~test-Checkout: Your Info');
  }

  get title() {
    return $('android=new UiSelector().text("CHECKOUT: INFORMATION")');
  }

  get firstNameInput() {
    return $('~test-First Name');
  }

  get lastNameInput() {
    return $('~test-Last Name');
  }

  get zipInput() {
    return $('~test-Zip/Postal Code');
  }

  get cancelButton() {
    return $('~test-CANCEL');
  }

  get continueButton() {
    return $('~test-CONTINUE');
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
    await this.errorMessage.waitForExist({ timeout: 8_000 });
    // errorMessage is a React Native ViewGroup; visible text lives in the child TextView
    return this.errorMessage.$('android.widget.TextView').getText();
  }

  // ----- Actions -----

  async fillForm(firstName: string, lastName: string, zip: string): Promise<void> {
    if (firstName) await this.firstNameInput.setValue(firstName);
    if (lastName) await this.lastNameInput.setValue(lastName);
    if (zip) await this.zipInput.setValue(zip);
  }

  async tapContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async tapCancel(): Promise<void> {
    await this.cancelButton.click();
  }
}

export default new CheckoutStep1Screen();

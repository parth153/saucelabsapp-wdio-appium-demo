import { allowPermissionIfPrompted } from '../../helpers/permissions';

class QrScannerScreen {
  // ----- Elements -----
  // QR Scanner has no test- container; the instruction text is the reliable anchor

  get instructionText() {
    return $('android=new UiSelector().text("Scan a QR Code that contains a url.")');
  }

  // ----- Queries -----

  async isDisplayed(timeout = 10_000): Promise<boolean> {
    await allowPermissionIfPrompted();
    await this.instructionText.waitForDisplayed({ timeout });
    return this.instructionText.isDisplayed();
  }
}

export default new QrScannerScreen();

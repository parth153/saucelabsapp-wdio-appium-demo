import { byText } from '../../helpers/platform';

class DrawingScreen {
  // ----- Elements -----

  get container() {
    return $('~test-DRAWING-SCREEN');
  }

  get title() {
    return byText('DRAWING');
  }

  // Canvas is an embedded WebView (Signature Pad)
  get canvas() {
    return browser.isAndroid
      ? $('android=new UiSelector().text("Signature Pad demo").className("android.webkit.WebView")')
      : $('-ios predicate string:type == "XCUIElementTypeWebView"');
  }

  get clearButton() {
    return $('~test-CLEAR');
  }

  get saveButton() {
    return $('~test-SAVE');
  }

  // ----- Queries -----

  async isDisplayed(timeout = 10_000): Promise<boolean> {
    await this.container.waitForDisplayed({ timeout });
    return this.container.isDisplayed();
  }

  // ----- Actions -----

  async drawLine(): Promise<void> {
    const canvasEl = await this.canvas;
    const rect = await browser.getElementRect(await canvasEl.elementId);
    const startX = Math.floor(rect.x + rect.width * 0.25);
    const endX = Math.floor(rect.x + rect.width * 0.75);
    const midY = Math.floor(rect.y + rect.height * 0.5);

    await browser.action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ duration: 0, x: startX, y: midY })
      .down({ button: 0 })
      .pause(100)
      .move({ duration: 300, x: endX, y: midY })
      .up({ button: 0 })
      .perform();
  }

  async tapClear(): Promise<void> {
    await this.clearButton.click();
  }

  async tapSave(): Promise<void> {
    await this.saveButton.click();
  }
}

export default new DrawingScreen();

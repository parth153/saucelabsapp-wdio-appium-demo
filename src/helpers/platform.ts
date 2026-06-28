export function byText(text: string): ChainablePromiseElement {
  return browser.isAndroid
    ? $(`android=new UiSelector().text("${text}")`)
    : $(`-ios predicate string:label == "${text}"`);
}

export function nativeTextSelector(): string {
  return browser.isAndroid ? 'android.widget.TextView' : 'XCUIElementTypeStaticText';
}

export function cartBadgeElement(): ChainablePromiseElement {
  return browser.isAndroid
    ? $('~test-Cart').$('//android.widget.TextView')
    : $('~test-Cart').$('-ios predicate string:type == "XCUIElementTypeStaticText"');
}

export async function scrollIntoViewAndClick(accessibilityId: string): Promise<void> {
  if (browser.isAndroid) {
    await $(
      `android=new UiScrollable(new UiSelector().scrollable(true))` +
      `.scrollIntoView(new UiSelector().description("${accessibilityId}"))`
    ).click();
  } else {
    await driver.execute('mobile: scroll', {
      direction: 'down',
      predicateString: `name == "${accessibilityId}"`,
    });
    await $(`~${accessibilityId}`).click();
  }
}

export async function pressBack(): Promise<void> {
  if (browser.isAndroid) {
    await driver.execute('mobile: pressKey', { keycode: 4 });
  } else {
    await driver.execute('mobile: swipe', { direction: 'right' });
  }
}

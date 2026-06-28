class GeoLocationScreen {
  get container() { return $('~GeoLocation-screen'); }
  get backButton() { return $('~More'); }
  get longitudeLabel() { return $('~Longitude'); }
  get latitudeLabel() { return $('~Latitude'); }

  async isDisplayed(timeout = 10_000): Promise<boolean> {
    await this.container.waitForDisplayed({ timeout });
    return this.container.isDisplayed();
  }

  async getLatitude(): Promise<string> {
    // Latitude value is a static text sibling after the Latitude label
    const all = await $$('XCUIElementTypeStaticText');
    let foundLabel = false;
    for (const el of all) {
      const name = await el.getAttribute('name');
      if (foundLabel && name && !isNaN(parseFloat(name))) return name;
      if (name === 'Latitude') foundLabel = true;
    }
    return '';
  }

  async getLongitude(): Promise<string> {
    const all = await $$('XCUIElementTypeStaticText');
    let foundLabel = false;
    for (const el of all) {
      const name = await el.getAttribute('name');
      if (foundLabel && name && !isNaN(parseFloat(name))) return name;
      if (name === 'Longitude') foundLabel = true;
    }
    return '';
  }

  async tapBack(): Promise<void> {
    await this.backButton.click();
  }
}

export default new GeoLocationScreen();

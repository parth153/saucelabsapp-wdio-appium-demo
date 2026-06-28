import { allowPermissionIfPrompted } from '../../helpers/permissions';
import { byText } from '../../helpers/platform';

class GeoLocationScreen {
  // ----- Elements -----

  get container() {
    return $('~test-GEO LOCATION-SCREEN');
  }

  get title() {
    return byText('GEO LOCATION');
  }

  get latitudeLabel() {
    return byText('Latitude:');
  }

  get latitudeValue() {
    return $('~test-latitude');
  }

  get longitudeLabel() {
    return byText('Longitude:');
  }

  get longitudeValue() {
    return $('~test-longitude');
  }

  // ----- Queries -----

  async isDisplayed(timeout = 10_000): Promise<boolean> {
    if (browser.isAndroid) await allowPermissionIfPrompted();
    await this.container.waitForDisplayed({ timeout });
    return this.container.isDisplayed();
  }

  async getLatitude(): Promise<string> {
    return this.latitudeValue.getText();
  }

  async getLongitude(): Promise<string> {
    return this.longitudeValue.getText();
  }
}

export default new GeoLocationScreen();

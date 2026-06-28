import LoginScreen from '../../screens/android/LoginScreen';
import ProductsScreen from '../../screens/android/ProductsScreen';
import SideMenuDrawer from '../../screens/android/SideMenuDrawer';
import WebviewScreen from '../../screens/android/WebviewScreen';
import QrScannerScreen from '../../screens/android/QrScannerScreen';
import GeoLocationScreen from '../../screens/android/GeoLocationScreen';
import DrawingScreen from '../../screens/android/DrawingScreen';
import { pressBack } from '../../helpers/platform';

describe('TS-07: Extended Feature Screens', () => {
  beforeEach(async () => {
    await driver.reloadSession();
    await LoginScreen.waitForDisplayed();
    await LoginScreen.login('standard_user', 'secret_sauce');
    await ProductsScreen.isDisplayed(40_000);
  });

  it('TC-058: WEBVIEW screen loads URL entry form without crash; back returns to Products', async () => {
    await SideMenuDrawer.open();
    await SideMenuDrawer.webviewOption.click();

    expect(await WebviewScreen.isDisplayed()).toBe(true);
    await expect(WebviewScreen.title).toBeDisplayed();
    await expect(WebviewScreen.urlInput).toBeDisplayed();
    await expect(WebviewScreen.goToSiteButton).toBeDisplayed();

    await pressBack();
    expect(await ProductsScreen.isDisplayed()).toBe(true);
  });

  it('TC-058b: WEBVIEW shows error when GO TO SITE tapped with empty URL', async () => {
    await SideMenuDrawer.open();
    await SideMenuDrawer.webviewOption.click();
    await WebviewScreen.isDisplayed();

    await WebviewScreen.tapGoToSite();

    expect(await WebviewScreen.getErrorText()).toMatch(/correct https url/i);
  });

  it('TC-059: QR CODE SCANNER opens camera view with instruction text; back returns to Products', async () => {
    await SideMenuDrawer.open();
    await SideMenuDrawer.qrScannerOption.click();

    expect(await QrScannerScreen.isDisplayed()).toBe(true);

    await pressBack();
    expect(await ProductsScreen.isDisplayed()).toBe(true);
  });

  it('TC-060: GEO LOCATION shows latitude and longitude coordinates; back returns to Products', async () => {
    // Inject mock GPS so the emulator resolves coordinates (no real hardware available in CI)
    await driver.setGeoLocation({ latitude: 37.7749, longitude: -122.4194, altitude: 10 });

    await SideMenuDrawer.open();
    await SideMenuDrawer.geoLocationOption.click();

    expect(await GeoLocationScreen.isDisplayed()).toBe(true);
    await expect(GeoLocationScreen.latitudeLabel).toBeDisplayed();
    await expect(GeoLocationScreen.longitudeLabel).toBeDisplayed();

    // Wait up to 15s for the app to resolve the injected coordinates
    await driver.waitUntil(
      async () => {
        const lat = await GeoLocationScreen.getLatitude();
        return lat.length > 0 && lat !== 'Determining position...';
      },
      { timeout: 15_000, timeoutMsg: 'Geo coordinates never resolved after setGeoLocation' }
    );

    const lat = await GeoLocationScreen.getLatitude();
    const lon = await GeoLocationScreen.getLongitude();
    expect(parseFloat(lat)).not.toBeNaN();
    expect(parseFloat(lon)).not.toBeNaN();

    await pressBack();
    expect(await ProductsScreen.isDisplayed()).toBe(true);
  });

  it('TC-061: DRAWING canvas renders with CLEAR/SAVE buttons; touch gesture does not crash', async () => {
    await SideMenuDrawer.open();
    await SideMenuDrawer.drawingOption.click();

    expect(await DrawingScreen.isDisplayed()).toBe(true);
    await expect(DrawingScreen.canvas).toBeDisplayed();
    await expect(DrawingScreen.clearButton).toBeDisplayed();
    await expect(DrawingScreen.saveButton).toBeDisplayed();

    await DrawingScreen.drawLine();

    // App must remain alive after drawing gesture
    expect(await DrawingScreen.isDisplayed()).toBe(true);

    await pressBack();
    expect(await ProductsScreen.isDisplayed()).toBe(true);
  });

  it('TC-062: all extended screens allow back navigation without crash', async () => {
    const screens: Array<{ menuSelector: string; verifyFn: () => Promise<boolean> }> = [
      {
        menuSelector: '~test-WEBVIEW',
        verifyFn: () => WebviewScreen.isDisplayed(),
      },
      {
        menuSelector: '~test-QR CODE SCANNER',
        verifyFn: () => QrScannerScreen.isDisplayed(),
      },
      {
        menuSelector: '~test-GEO LOCATION',
        verifyFn: () => GeoLocationScreen.isDisplayed(),
      },
      {
        menuSelector: '~test-DRAWING',
        verifyFn: () => DrawingScreen.isDisplayed(),
      },
    ];

    for (const { menuSelector, verifyFn } of screens) {
      await SideMenuDrawer.open();
      await $(menuSelector).click();
      expect(await verifyFn()).toBe(true);
      await pressBack();
      expect(await ProductsScreen.isDisplayed()).toBe(true);
    }
  });
});

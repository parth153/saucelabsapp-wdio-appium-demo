import fs from 'fs';
import path from 'path';
import AllureReporter from '@wdio/allure-reporter';

const APP_PATH = path.resolve(__dirname, '../apps/ios/My Demo App.app');

async function captureScreenshot(label: string): Promise<void> {
  try {
    const screenshot = await browser.takeScreenshot();
    AllureReporter.addAttachment(label, Buffer.from(screenshot, 'base64'), 'image/png');
  } catch {
    // session may be unavailable (crash / timeout)
  }
}

export const config: WebdriverIO.Config = {
  runner: 'local',
  port: 4723,

  specs: [path.resolve(__dirname, '../src/tests/ios/**/*.spec.ts')],
  exclude: [],

  maxInstances: 1,

  capabilities: [
    {
      platformName: 'iOS',
      'appium:deviceName': 'iPhone 17',
      'appium:platformVersion': '26.5',
      'appium:app': APP_PATH,
      'appium:udid': 'FC4F1F4B-9011-4192-AE5B-B86FC0334EDB',
      'appium:automationName': 'XCUITest',
      'appium:bundleId': 'com.saucelabs.mydemo.app.ios',
      'appium:noReset': false,
      'appium:newCommandTimeout': 240,
      'appium:autoAcceptAlerts': true,
    },
  ],

  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: 'mocha',
  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
    }],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },

  onPrepare: () => {
    fs.mkdirSync('allure-results', { recursive: true });
    fs.writeFileSync(
      'allure-results/environment.properties',
      [
        'Device=iPhone 17 Simulator',
        'Platform=iOS 26.5',
        'Automation=XCUITest',
        `App=SwagLabsMobileApp.app`,
      ].join('\n'),
    );
  },

  beforeTest: async () => {
    await browser.startRecordingScreen();
  },

  afterHook: async (_test, _context, { error }) => {
    if (error) {
      await captureScreenshot('Screenshot (Hook Failure)');
    }
  },

  afterTest: async (_test, _context, { passed, retries }) => {
    let video: string;
    try {
      video = await browser.stopRecordingScreen() as string;
    } catch {
      video = '';
    }

    if (!passed) {
      await captureScreenshot(`Screenshot (Attempt ${retries.attempts + 1})`);
      if (video) {
        AllureReporter.addAttachment(
          `Video (Attempt ${retries.attempts + 1})`,
          Buffer.from(video, 'base64'),
          'video/mp4',
        );
      }
    }
  },
};

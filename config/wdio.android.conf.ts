import fs from 'fs';
import path from 'path';

import AllureReporter from '@wdio/allure-reporter';

// Fall back to the standard macOS Android Studio SDK location when the shell
// hasn't exported ANDROID_HOME (e.g. when launched from an IDE or CI runner).
process.env.ANDROID_HOME ??= `${process.env.HOME}/Library/Android/sdk`;
process.env.ANDROID_SDK_ROOT ??= process.env.ANDROID_HOME;

const APK_PATH = path.resolve(__dirname, '../apps/android/SauceLabs-Demo-2.7.1.apk');

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

  specs: [path.resolve(__dirname, '../src/tests/android/**/*.spec.ts')],
  exclude: [],

  maxInstances: 1,

  capabilities: [
    {
      platformName: 'Android',
      'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'emulator-5554',
      'appium:platformVersion': '13.0',
      'appium:app': APK_PATH,
      'appium:automationName': 'UiAutomator2',
      'appium:appPackage': 'com.swaglabsmobileapp',
      'appium:appActivity': 'com.swaglabsmobileapp.MainActivity',
      'appium:noReset': false,
      'appium:newCommandTimeout': 240,
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
    // retries: 3,
  },

  onPrepare: () => {
    // Write Allure environment info shown on the report overview page.
    // The directory is created here because run-tests.sh clears it before WDIO starts.
    fs.mkdirSync('allure-results', { recursive: true });
    fs.writeFileSync(
      'allure-results/environment.properties',
      [
        `Device=${process.env.ANDROID_DEVICE_NAME ?? 'emulator-5554'}`,
        'Platform=Android 13',
        'Automation=UiAutomator2',
        `App=${path.basename(APK_PATH)}`,
      ].join('\n'),
    );
  },

  beforeTest: async () => {
    await (browser as any).startRecordingScreen();
  },

  // Fires after every Mocha hook (beforeAll / beforeEach / afterEach / afterAll).
  // Captures a screenshot when a hook fails so "Unknown" tests have visual context.
  afterHook: async (_test, _context, { error }) => {
    if (error) {
      await captureScreenshot('Screenshot (Hook Failure)');
    }
  },

  afterTest: async (_test, _context, { passed, retries }) => {
    let video: string;
    try {
      video = await (browser as any).stopRecordingScreen() as string;
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

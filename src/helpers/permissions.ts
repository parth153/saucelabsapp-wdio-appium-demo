// Dismisses Android runtime permission dialogs (camera, location, etc.) by clicking
// "While using the app" if present, falling back to a plain "Allow" button.
// Call this right after navigating to a screen that may trigger a permission prompt.
export async function allowPermissionIfPrompted(waitMs = 3000): Promise<void> {
  const candidates = [
    'android=new UiSelector().text("While using the app")',
    'android=new UiSelector().text("Only this time")',
    'android=new UiSelector().text("Allow")',
  ];

  for (const sel of candidates) {
    try {
      const btn = $(sel);
      await btn.waitForDisplayed({ timeout: waitMs });
      await btn.click();
      return;
    } catch {
      // button not found — try next candidate
    }
    waitMs = 500; // remaining candidates only need a quick check
  }
}

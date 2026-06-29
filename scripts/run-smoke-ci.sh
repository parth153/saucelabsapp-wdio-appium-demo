#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR"

echo "Emulator ready: $(adb devices)"

# Start Appium
npx appium --port 4723 --log appium.log &
APPIUM_PID=$!

# Wait up to 60s for Appium to be ready
APPIUM_WAIT=0
until curl -sf http://127.0.0.1:4723/status > /dev/null; do
  sleep 2
  APPIUM_WAIT=$((APPIUM_WAIT + 2))
  if [ "$APPIUM_WAIT" -ge 60 ]; then
    echo "ERROR: Appium did not become ready within 60 seconds"
    kill "$APPIUM_PID" 2>/dev/null || true
    exit 1
  fi
done
echo "Appium is ready."

# Run smoke suite — capture exit code without triggering set -e
TEST_EXIT=0
ANDROID_DEVICE_NAME="${ANDROID_DEVICE_NAME:-emulator-5554}" \
  npx wdio run config/wdio.android.conf.ts --mochaOpts.grep '\[smoke\]' || TEST_EXIT=$?

# Clean up: Appium then emulator (so emulator-runner finds it already dead)
kill "$APPIUM_PID" 2>/dev/null || true

exit $TEST_EXIT

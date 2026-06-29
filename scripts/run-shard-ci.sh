#!/usr/bin/env bash

echo "Emulator ready: $(adb devices)"

npx appium --port 4723 --log appium.log &

WAIT=0
until curl -sf http://127.0.0.1:4723/status > /dev/null; do
  sleep 2; WAIT=$((WAIT + 2))
  if [ $WAIT -ge 60 ]; then echo "Appium did not start in 60s"; exit 1; fi
done
echo "Appium is ready."

ANDROID_DEVICE_NAME="${ANDROID_DEVICE_NAME:-emulator-5554}" \
  SPEC_FILES="${SPEC_FILES}" \
  npx wdio run config/wdio.android.conf.ts
TEST_EXIT=$?

# Re-run failed specs once if the first run had failures
if [ $TEST_EXIT -ne 0 ] && [ -f rerun.sh ]; then
  echo "Re-running failed specs..."
  DISABLE_RERUN=true ANDROID_DEVICE_NAME="${ANDROID_DEVICE_NAME:-emulator-5554}" bash rerun.sh
  TEST_EXIT=$?
fi

pkill -f appium 2>/dev/null || true
sleep 3

exit $TEST_EXIT

#!/usr/bin/env bash
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ROOT_DIR"

# ── 0. Clear Allure directories ──────────────────────────────────────────────
for dir in allure-results allure-report; do
  if [ -d "$dir" ]; then
    echo "▶ Clearing $dir/..."
    rm -rf "$dir"
  fi
done

# ── 1. Start Appium ─────────────────────────────────────────────────────────
echo "▶ Starting Appium on port 4723..."
npx appium --port 4723 > /tmp/appium.log 2>&1 &
APPIUM_PID=$!

cleanup() {
  echo "▶ Stopping Appium (PID $APPIUM_PID)..."
  kill "$APPIUM_PID" 2>/dev/null || true
}
trap cleanup EXIT

# ── 2. Wait for Appium to be ready ──────────────────────────────────────────
echo "▶ Waiting for Appium..."
for i in $(seq 1 30); do
  if curl -s http://localhost:4723/status > /dev/null 2>&1; then
    echo "  Appium ready."
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "  Appium did not start in time. Check /tmp/appium.log"
    exit 1
  fi
  sleep 1
done

# ── 3. Run tests ─────────────────────────────────────────────────────────────
echo "▶ Running tests..."
TEST_EXIT_CODE=0
npx wdio run config/wdio.ios.conf.ts || TEST_EXIT_CODE=$?

# ── 4. Generate Allure report ────────────────────────────────────────────────
echo "▶ Generating Allure report..."
npx allure generate allure-results --clean -o allure-report || true

# ── 5. Open report ───────────────────────────────────────────────────────────
echo "▶ Opening Allure report..."
npx allure open allure-report || true

exit $TEST_EXIT_CODE

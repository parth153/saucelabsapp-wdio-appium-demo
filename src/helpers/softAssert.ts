/**
 * Collects assertion failures instead of throwing on the first one.
 * Call assertAll() at the end of the test to fail with a combined report.
 *
 * Usage:
 *   const soft = new SoftAssert();
 *   soft.check(() => expect(name).toBe('Foo'));
 *   soft.check(() => expect(price).toBe('$9.99'));
 *   soft.assertAll();
 */
export class SoftAssert {
  private readonly failures: string[] = [];

  async check(fn: () => void | Promise<void>, label?: string): Promise<void> {
    try {
      await fn();
    } catch (e: any) {
      const prefix = label ? `[${label}] ` : '';
      this.failures.push(prefix + (e?.message ?? String(e)));
    }
  }

  assertAll(): void {
    if (this.failures.length === 0) return;
    throw new Error(
      `${this.failures.length} soft assertion(s) failed:\n` +
      this.failures.map((f, i) => `  ${i + 1}. ${f}`).join('\n')
    );
  }

  get failureCount(): number {
    return this.failures.length;
  }
}

// tests/index.js
import { testUpdateChecker } from './testUpdateChecker.js';
import { testConfig } from './testConfig.js';
// ...reszta

export async function runAllTests() {
  const tests = [
    testUpdateChecker,
    testConfig,
    // ...
  ];

  const details = [];
  const failedTests = [];

  for (const testFn of tests) {
    const name = testFn.name || 'anonymousTest';
    try {
      await testFn();
      details.push(`✔ ${name}`);
    } catch (err) {
      details.push(`✖ ${name}: ${err.message || err}`);
      failedTests.push(`${name}: ${err.stack || err}`);
    }
  }

  return {
    success: failedTests.length === 0,
    details,
    failedTests
  };
}

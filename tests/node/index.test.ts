import { describe, it } from 'node:test';
import assert from 'node:assert';

// Describe a group of tests
describe('Number', () => {
  // A single test
  it('Equality', () => {
    // Assert
    assert.strictEqual(1, 1);
  });
});

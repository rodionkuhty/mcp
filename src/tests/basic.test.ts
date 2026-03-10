import test from "node:test"
import assert from "node:assert"

test('synchronous passing test', (t) => {
  assert.strictEqual(1, 1);
});

test('asynchronous passing test', async (t) => {
  assert.strictEqual(1, 1);
});

test('callback passing test', (t, done) => {
  setImmediate(done);
});

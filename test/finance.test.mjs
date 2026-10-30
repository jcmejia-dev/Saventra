import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recovery } from '../finance.js';
test('recovery accounts for the final partial contribution without inventing money', () => {
  assert.deepEqual(recovery(120000, 30500, 5000), { remaining: 89500, count: 7, last: 500 });
});
test('allows full withdrawal but rejects overdrafts and invalid contributions', () => {
  assert.equal(recovery(100, 100, 100).remaining, 0);
  for (const args of [[100,101,10],[100,0,10],[100,20,0],[100,20,1.5],[100,NaN,10]]) assert.throws(() => recovery(...args), RangeError);
});

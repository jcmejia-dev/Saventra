import {test} from 'node:test';
import assert from 'node:assert/strict';
import {amountToMinor,currencyDigits} from '../currency.js';
test('currency amounts respect zero, two, and three decimal currencies',()=>{
  assert.equal(currencyDigits('JPY'),0);assert.equal(amountToMinor(123,'JPY'),123);assert.throws(()=>amountToMinor(1.5,'JPY'));
  assert.equal(amountToMinor(1.25,'USD'),125);assert.equal(amountToMinor(1.005,'BHD'),1005);assert.equal(currencyDigits('BHD'),3);assert.throws(()=>amountToMinor(1.005,'USD'));
});
test('currency input rejects non-finite and unsafe integer amounts',()=>{assert.throws(()=>amountToMinor(NaN,'USD'));assert.throws(()=>amountToMinor(Number.MAX_SAFE_INTEGER,'BHD'));});

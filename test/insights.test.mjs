import {test} from 'node:test';
import assert from 'node:assert/strict';
import {savingsSeries} from '../insights.js';
import {suggestedCurrency,territoryCurrencies} from '../countries.js';
test('charts reconcile contributions and withdrawals to the current balance',()=>{
  const now=Date.parse('2026-10-31T12:00:00Z');
  const activity=[{amount:5000,at:'2026-10-30T12:00:00Z',goalIndex:0},{amount:-2000,at:'2026-10-31T10:00:00Z',goalIndex:0}];
  const result=savingsSeries([{balance:13000}],activity,{now});
  assert.equal(result.points[0].balance,10000);
  assert.equal(result.points.at(-1).balance,13000);
  assert.equal(result.contributions,5000);assert.equal(result.withdrawals,2000);
});
test('goal filtering excludes other goals and the date range excludes older flows',()=>{
  const now=Date.parse('2026-10-31T12:00:00Z');
  const result=savingsSeries([{balance:1000},{balance:8000}],[{amount:1000,at:'2026-10-30T00:00:00Z',goalIndex:0},{amount:8000,at:'2026-08-01T00:00:00Z',goalIndex:1}],{now,goalIndex:1,days:30});
  assert.equal(result.balance,8000);assert.equal(result.entries.length,0);assert.equal(result.contributions,0);
});
test('nationality suggests a currency while retaining multiple-currency territory data',()=>{
  assert.equal(suggestedCurrency('PH'),'PHP');assert.equal(suggestedCurrency('JP'),'JPY');assert.equal(suggestedCurrency('DE'),'EUR');assert.equal(suggestedCurrency('GB'),'GBP');assert.equal(suggestedCurrency('IN'),'INR');
  assert.ok(territoryCurrencies.PA.length>1);assert.equal(suggestedCurrency(''),'USD');
});

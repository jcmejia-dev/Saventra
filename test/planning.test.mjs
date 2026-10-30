import { test } from 'node:test';
import assert from 'node:assert/strict';
import {affordability,withdrawalOptions,planContributions} from '../planning.js';
test('shortfall pauses savings instead of proposing negative contributions',()=>{
  assert.deepEqual(affordability(100,120,10,50),{surplus:0,shortfall:30,contribution:0,status:'pause'});
  assert.equal(affordability(200,100,20,100).contribution,80);
});
test('split withdrawal respects minima and never invents available money',()=>{
  const goals=[{balance:400,minimum:350},{balance:300,minimum:100}];
  const result=withdrawalOptions(goals,200,0);
  assert.equal(result.crossesMinimum,true);
  assert.deepEqual(result.split,[{index:0,amount:50},{index:1,amount:150}]);
  assert.equal(withdrawalOptions(goals,300,0).split,null);
  assert.equal(withdrawalOptions(goals,500,0).single,null);
});
test('multiple plans share one surplus rather than each spending it',()=>{
  assert.deepEqual(planContributions([{outstanding:300,contribution:100},{outstanding:200,contribution:100}],150),[{amount:100,periods:3},{amount:50,periods:4}]);
  assert.equal(planContributions([{outstanding:300,contribution:100}],0)[0].periods,null);
});

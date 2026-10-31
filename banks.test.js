import test from 'node:test';
import assert from 'node:assert/strict';
import {deposit,debit,holdings} from './banks.js';
test('bank deposits and withdrawals conserve savings including unassigned opening balance',()=>{const g={balance:1000};deposit(g,500,'maribank');deposit(g,300,'wallet');assert.deepEqual(holdings(g),[{id:'maribank',amount:500},{id:'wallet',amount:300},{id:'',amount:1000}]);const used=debit(g,650);assert.deepEqual(used,[{accountId:'maribank',amount:500},{accountId:'wallet',amount:150}]);assert.equal(g.balance,1150);assert.equal(holdings(g).reduce((s,r)=>s+r.amount,0),1150);assert.deepEqual(g.holdings,{wallet:150});});
test('invalid bank entries cannot mutate balances',()=>{const g={balance:100};assert.throws(()=>deposit(g,-1,'bank'));assert.throws(()=>debit(g,101));assert.equal(g.balance,100);});
test('legacy or inconsistent holdings stay bounded by total balance',()=>{const g={balance:100,holdings:{a:200,b:-2}};assert.deepEqual(holdings(g),[{id:'a',amount:100}]);deposit(g,50,'b');assert.deepEqual(g.holdings,{a:100,b:50});debit(g,150);assert.equal(g.balance,0);assert.deepEqual(holdings(g),[]);});

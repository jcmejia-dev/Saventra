import {test} from 'node:test';
import assert from 'node:assert/strict';
import {handleCoach} from '../server/ai-coach.mjs';
const env={AI_GATEWAY_API_KEY:'test-only',SAVENTRA_AI_MODEL:'test-only',COACH_ACCESS_TOKEN:'test-only'};
const request=body=>new Request('https://example.invalid/coach',{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer test-only'},body:JSON.stringify(body)});
test('unconfigured integration fails closed without contacting a provider',async()=>assert.equal((await handleCoach(request({}),{})).status,503));
test('integration rejects unauthenticated requests',async()=>assert.equal((await handleCoach(new Request('https://example.invalid/coach',{method:'POST'}),env)).status,401));
test('integration requires consent and validates budgets before provider access',async()=>{
  assert.equal((await handleCoach(request({question:'Help'}),env)).status,400);
  assert.equal((await handleCoach(request({consent:true,question:'Help',budget:{currency:'USD',income:-1,expenses:0,buffer:0,planned:0}}),env)).status,400);
});

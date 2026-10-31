import { bankNames, holdings, deposit, bankLabel } from './banks.js';
import { mountCoach } from './coach.js';
import { resolveIdentity, mountIdentity, readLocal, profileKey, workspaceKey } from './identity.js';
import { mountInsights } from './insights.js';
import { currencies } from './countries.js';
import { currencyDigits, amountToMinor } from './currency.js';
const identity = await resolveIdentity();
let profile = identity.user ? readLocal(profileKey(identity.user.id)) : null;
const personal = () => Boolean(identity.user && profile);
const $ = (id) => document.getElementById(id);
let currency = profile?.currency || 'USD';
const digits = () => currencyDigits(currency);
const factor = () => 10 ** digits();
const toMajor = value => value / factor();
const toMinor = value => amountToMinor(value,currency);
const goals = [
  { name: 'Breathing room', note: 'Your emergency fund', balance: 450000, target: 600000, icon: '♧', badge: 'Peace of mind' },
  { name: 'Somewhere new', note: 'A trip worth waiting for', balance: 235000, target: 400000, icon: '↗', badge: 'A little adventure' },
  { name: 'A place of my own', note: 'The keys to your next chapter', balance: 160000, target: 1000000, icon: '⌂', badge: 'The big picture' },
];
const activities = [ {name:'Added to Breathing room',note:'Sample · Today',amount:15000}, {name:'Added to Somewhere new',note:'Sample · Yesterday',amount:7500}, {name:'Added to A place of my own',note:'Sample · Oct 28',amount:10000} ];
const plans = [];
activities.forEach((a,i)=>{a.at=new Date(Date.now()-i*7*86400000).toISOString();a.goalIndex=i;});
let savedState=personal()?readLocal(workspaceKey(identity.user.id)):null;
if(personal()){
  const valid=savedState?.version===1&&Array.isArray(savedState.goals)&&savedState.goals.length&&savedState.goals.length<100&&savedState.goals.every(g=>Number.isSafeInteger(g.balance)&&g.balance>=0&&Number.isSafeInteger(g.target)&&g.target>0)&&Array.isArray(savedState.activities)&&Array.isArray(savedState.plans);
  if(!valid)savedState={version:1,goals:[{name:'Breathing room',note:'Your emergency fund',balance:0,target:1000*factor(),minimum:0,icon:'♧',badge:'Your first chapter'}],activities:[],plans:[],coach:{income:0,buffer:0,planned:0,period:'month',expenses:[],accounts:[],completed:[]}};
  goals.splice(0,goals.length,...savedState.goals);activities.splice(0,activities.length,...savedState.activities);plans.splice(0,plans.length,...savedState.plans);
}
let monthAdded = 65000;
let refreshCoach = () => {};
let refreshInsights = () => {};
let savingEnabled=false;
let storageWarned=false;
function saveWorkspace(){if(!personal()||!savingEnabled)return;try{localStorage.setItem(workspaceKey(identity.user.id),JSON.stringify({version:1,goals,activities,plans,coach:refreshCoach.getState?.()}));}catch{if(!storageWarned){storageWarned=true;toast('Device storage is unavailable or full. Changes may be lost on refresh.');}}}
function money(minor, decimals = false) { return new Intl.NumberFormat(undefined, {style:'currency',currency,minimumFractionDigits:decimals?digits():0,maximumFractionDigits:digits()}).format(toMajor(minor)); }
function escape(value) {return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('visible'),4000);}
function goalHTML(goal,index){const pct=Math.min(100,Math.round(goal.balance/goal.target*100));return `<article class="goal-card"><div class="goal-top"><span class="goal-icon" aria-hidden="true">${goal.icon}</span><span class="goal-badge">${escape(goal.badge)}</span></div><h3>${escape(goal.name)}</h3><p class="goal-subtitle">${escape(goal.note)}</p><div class="goal-money">${money(goal.balance)}<small>of ${money(goal.target)}</small></div><div class="progress" role="progressbar" aria-label="${escape(goal.name)}" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div><div class="bank-chips">${bankSummary(goal)}</div><div class="goal-bottom"><span>${pct}% saved</span><button data-insight-goal="${index}" aria-label="View details for ${escape(goal.name)}">Details ↗</button><button data-add="${index}" aria-label="Add savings to ${escape(goal.name)}">Add savings ＋</button></div></article>`;}
function activityHTML(item){return `<div class="activity-row"><span class="activity-symbol" aria-hidden="true">${item.amount>0?'↓':'↗'}</span><span class="activity-info"><strong>${escape(item.name)}</strong><small>${escape(item.note)}${item.bankName?` · ${escape(item.bankName)}`:''}</small></span><span class="activity-amount">${item.amount>0?'+':'−'}${money(Math.abs(item.amount))}</span></div>`;}
function render(){
  $('total-balance').textContent=money(goals.reduce((sum,g)=>sum+g.balance,0),currency!=='JPY');
  $('month-added').textContent=money(activities.filter(a=>a.amount>0&&Date.parse(a.at)>=Date.now()-30*86400000).reduce((sum,a)=>sum+a.amount,0));
  $('goal-cards').innerHTML=goals.map(goalHTML).join('');$('all-goals').innerHTML=goals.map(goalHTML).join('');
  $('recent-activity').innerHTML=activities.slice(0,2).map(activityHTML).join('');$('activity-list').innerHTML=activities.map(activityHTML).join('');
  document.querySelectorAll('[data-money]').forEach(el=>el.textContent=money(Number(el.dataset.money)*factor()));
  document.querySelector('.nav-count').textContent=goals.length;
  document.querySelector('.count').textContent=String(goals.length).padStart(2,'0');
  $('plans-list').innerHTML=plans.length?plans.map(p=>`<article class="panel recovery-card"><div><span class="phase">YOUR COMEBACK PLAN</span><h2>${escape(p.goal)}</h2><p>${money(p.withdrawal)} used for ${escape(p.reason)}. ${p.count} planned contributions.</p><p>Final contribution: ${money(p.last)}. No contribution has been recorded yet.</p></div><div class="plan-value">${money(p.contribution)}<small>per ${escape(p.cadence)} · estimate</small></div></article>`).join(''):`<article class="panel"><span class="phase">A FRESH START ISN’T REQUIRED</span><h2>A plan for whatever comes next.</h2><p>No recovery plans yet. Try “Plan a withdrawal” to see the impact before you decide. Your balance only changes when you confirm.</p></article>`;
  refreshCoach();
  refreshInsights();
  saveWorkspace();
}
function showView(view){document.querySelectorAll('.view').forEach(el=>el.hidden=el.id!==`${view}-view`);document.querySelectorAll('.nav-item').forEach(el=>{el.classList.toggle('active',el.dataset.view===view);if(el.dataset.view===view)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});$('breadcrumb').textContent={overview:'Overview',goals:'Savings goals',recovery:'Comeback plans',activity:'Your activity',blueprint:'The blueprint',money:'Accounts & expenses',learn:'Learn to save',coach:'Savings coach',insights:'Savings insights',form:'New entry',planner:'Withdrawal planner'}[view];history.replaceState(null,'',`#${view}`);}
const oldModal=$('modal');
const formView=document.createElement('section');formView.id='form-view';formView.className='view form-page';formView.hidden=true;
formView.innerHTML=`<div class="page-heading"><div><p class="eyebrow">YOUR NEXT STEP</p><h1 id="page-form-title"></h1><p>A clear place for every detail.</p></div><button class="button secondary" id="page-form-back">← Back</button></div><div class="page-form-layout"><div id="modal" class="page-form-card">${oldModal.innerHTML}</div><aside class="form-guide"><span class="goal-icon">▣</span><h2>Give your progress<br>a place to grow.</h2><p>Keep your goals and the accounts holding your money together.</p><div class="guide-step"><b>01</b><span>Choose what you’re recording</span></div><div class="guide-step"><b>02</b><span>Add the details that matter</span></div><div class="guide-step"><b>03</b><span>Review, then save your entry</span></div><p class="quiet-copy">Manual bookkeeping. Your money stays with your bank.</p></aside></div>`;
oldModal.remove();$('main').append(formView);let returnView='overview',returnFocus;
$('modal').close=()=>{showView(returnView);returnFocus?.focus();};$('page-form-back').onclick=()=>$('modal').close();
let submit;
function modal(title,body,label,handler){$('modal-title').textContent=title;$('modal-body').innerHTML=body;$('submit-modal').textContent=label;$('submit-modal').hidden=!handler;$('form-error').textContent='';submit=handler;if(location.hash!=='#form'){returnView=location.hash.slice(1)||'overview';returnFocus=document.activeElement;}$('page-form-title').textContent=title;showView('form');window.scrollTo(0,0);$('modal-title').tabIndex=-1;$('modal-title').focus();}
function options(selected=0){return goals.map((g,i)=>`<option value="${i}" ${i===selected?'selected':''}>${escape(g.name)} · ${money(g.balance)}</option>`).join('');}
$('currency').innerHTML=currencies.map(code=>`<option value="${code}">${code}</option>`).join('');
$('currency').value=currency;
if(personal())$('currency').disabled=true;
function amountField(id,label,value=''){return `<label for="${id}">${label} (${currency})</label><input id="${id}" name="${id}" type="number" min="${1/factor()}" step="${1/factor()}" required value="${value}" inputmode="decimal">`;}
function minor(id){const n=Number($(id).value);if(!Number.isFinite(n)||n<=0||n>1000000000)throw new Error('Enter a positive amount below one billion.');return toMinor(n);}
function addSavings(index=0){
 const accounts=refreshCoach.getState().accounts;
 modal('Put a little more aside.',`<p>Record money you have saved, and choose where it is held.</p><label for="goal-select">Savings goal</label><select id="goal-select">${options(index)}</select><div class="amount-hero">${amountField('amount','Amount saved')}</div><label for="savings-account">Where is this money held?</label><select id="savings-account"><option value="">Bank not assigned</option>${accounts.map(a=>`<option value="${escape(a.id)}">${escape(bankLabel(a))}</option>`).join('')}<option value="new">＋ Add a bank or wallet</option></select><div id="new-bank-fields" hidden><label for="savings-bank">Bank or wallet name</label><input id="savings-bank" maxlength="60" list="bank-suggestions" placeholder="e.g. MariBank"><datalist id="bank-suggestions">${bankNames.map(n=>`<option value="${n}">`).join('')}</datalist><label for="savings-nickname">Account nickname (optional)</label><input id="savings-nickname" maxlength="50" placeholder="My savings account"></div><div class="preview-result">This records where your savings are held. It does not connect to your bank or transfer money.</div>`,'Record savings',()=>{
 const amount=minor('amount');const goalIndex=Number($('goal-select').value);const goal=goals[goalIndex];let account=accounts.find(a=>a.id===$('savings-account').value);
 if($('savings-account').value==='new'){const bank=$('savings-bank').value.trim();if(!bank)throw new Error('Enter a bank or wallet name.');account={id:crypto.randomUUID(),bank,name:$('savings-nickname').value.trim()||bank,type:'Savings account',balance:null};}
 deposit(goal,amount,account?.id);if(account&&!accounts.includes(account))accounts.push(account);
 activities.unshift({name:`Added to ${goal.name}`,note:'Recorded by you',accountId:account?.id,bankName:account?bankLabel(account):'',goalIndex,at:new Date().toISOString(),amount});render();$('modal').close();toast('Savings recorded'+(account?' with '+account.bank:'.'));
 });$('savings-account').onchange=()=>{$('new-bank-fields').hidden=$('savings-account').value!=='new';$('savings-bank').required=$('savings-account').value==='new';};
}
function bankSummary(goal){const accounts=refreshCoach.getState?.().accounts||[];return holdings(goal).map(r=>`<span class="bank-chip">▣ ${escape(bankLabel(accounts.find(a=>a.id===r.id)))} <b>${money(r.amount)}</b></span>`).join('');}
function newGoal(){modal('What matters to you?',`<p>Give your next chapter a name.</p><label for="goal-name">Goal name</label><input id="goal-name" maxlength="50" required placeholder="A new beginning">${amountField('target','Target amount')}`,'Create goal',()=>{const name=$('goal-name').value.trim();if(!name)throw new Error('Give your goal a name.');goals.push({name,note:'Your next chapter',balance:0,target:minor('target'),icon:'✳',badge:'Made for you'});render();$('modal').close();toast('Your new goal is ready.');});}
document.addEventListener('click',event=>{const view=event.target.closest('[data-view]');if(view)showView(view.dataset.view);const add=event.target.closest('[data-add]');if(add)addSavings(Number(add.dataset.add));});
$('add-savings').onclick=()=>addSavings();$('new-goal').onclick=newGoal;$('goals-new').onclick=newGoal;
$('close-modal').onclick=$('cancel-modal').onclick=()=>$('modal').close();
$('modal-form').onsubmit=event=>{event.preventDefault();try{submit?.();}catch(error){$('form-error').textContent=error.message;}};
$('currency').onchange=()=>{const oldFactor=factor();currency=$('currency').value;const scale=value=>Math.round(value/oldFactor*factor());goals.forEach(g=>{g.balance=scale(g.balance);g.target=Math.max(1,scale(g.target));g.minimum=scale(g.minimum||0);if(g.holdings)for(const id of Object.keys(g.holdings))g.holdings[id]=scale(g.holdings[id]);});activities.forEach(a=>a.amount=scale(a.amount));plans.forEach(p=>{for(const key of ['withdrawal','outstanding','contribution'])if(p[key]!==undefined)p[key]=scale(p[key]);p.allocations?.forEach(a=>{a.amount=scale(a.amount);a.remaining=scale(a.remaining);});});const state=refreshCoach.getState();for(const key of ['income','buffer','planned'])state[key]=scale(state[key]);state.expenses.forEach(e=>e.amount=scale(e.amount));state.accounts.forEach(a=>a.balance=a.balance===null?null:scale(a.balance));refreshCoach.setState(state);render();toast('Sample amounts relabeled and rounded for this currency. No exchange conversion.');};
$('checkin-button').onclick=()=>addSavings(0);
$('about-button').onclick=()=>modal('A space to explore.',`<p>This is Saventra’s first design prototype. All balances, dates, and activity are illustrative. Changes last only until this page is refreshed.</p><p>Currency selection relabels sample amounts; it does not perform foreign exchange. This preview does not connect to banks, move money, or send reminders.</p><p>Try a goal, add savings, or explore a withdrawal. Share your feedback before the production build.</p>`,'',null);
refreshCoach = mountCoach({$,goals,plans,activities,money,escape,modal,toast,render,showView,minor,amountField,toMajor,toMinor,personal});
if(savedState?.coach)refreshCoach.setState(savedState.coach);
refreshInsights=mountInsights({$,goals,activities,money,escape,isPersonal:personal,addSavings,showView,bankSummary});
savingEnabled=true;
mountIdentity(identity,{toast,onLogout:()=>location.reload(),onProfile:next=>{
  if(profile&&profile.currency!==next.currency&&(goals.some(g=>g.balance>0)||activities.length||refreshCoach.getState().accounts.some(a=>a.balance>0)))throw new Error('This workspace already contains money. Keep its currency to avoid relabeling balances. Create a separate workspace for another currency.');
  if(profile&&profile.currency!==next.currency){const nextFactor=10**currencyDigits(next.currency);goals.forEach(g=>{g.target=Math.round(g.target/factor()*nextFactor);g.minimum=Math.round((g.minimum||0)/factor()*nextFactor);});saveWorkspace();}
  localStorage.setItem(profileKey(identity.user.id),JSON.stringify(next));location.reload();
}});
if(personal()){
  document.querySelector('.balance-footer>span:last-child').textContent='Recorded history';
  document.querySelector('.next-date').textContent='YOUR NEXT SAVINGS CHECK-IN';
  document.querySelector('.next-card>p:not(.next-date)').textContent='Review your income and expenses before choosing your next contribution.';
  document.querySelector('.balance-caption').textContent='Your recorded progress, at your pace.';
}
render();showView(['overview','goals','recovery','activity','blueprint','money','learn','coach','insights'].includes(location.hash.slice(1))?location.hash.slice(1):'overview');

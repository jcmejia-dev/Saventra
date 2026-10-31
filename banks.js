export const bankCatalog=[
 ['MariBank','M','#f26a00'],['GCash','G','#007dff'],['GoTyme','go','#00a99d'],['Maya','M','#00b887'],
 ['BPI','BPI','#b4121b'],['BDO','BDO','#003b71'],['Metrobank','M','#003b70'],['UnionBank','U','#e53038'],
 ['Wise','W','#9fe870'],['Revolut','R','#171717'],['Chase','C','#117aca'],['Monzo','M','#ec4264'],
 ['PayPal','P','#003087'],['Venmo','V','#008cff'],['Cash App','$','#00c244'],['Alipay','A','#1677ff'],['WeChat Pay','W','#07c160'],['GrabPay','G','#00b14f'],['PayNow','P','#e51b23'],['Cash','₱','#75639a']
].map(([name,mark,color])=>({name,mark,color}));
export const bankNames=bankCatalog.map(item=>item.name);
export function bankIcon(name){const item=bankCatalog.find(x=>x.name.toLowerCase()===String(name||'').toLowerCase());const mark=item?.mark||String(name||'?').trim().slice(0,2).toUpperCase();const color=item?.color||'#7863aa';return `<span class="bank-logo" style="--bank-color:${color}" aria-hidden="true">${mark}</span>`;}

export function holdings(goal){let left=goal.balance;const rows=[];for(const [id,value] of Object.entries(goal.holdings||{})){const amount=Math.min(left,Number.isSafeInteger(value)&&value>0?value:0);if(amount)rows.push({id,amount});left-=amount;}if(left)rows.push({id:'',amount:left});return rows;}
export function deposit(goal,amount,accountId=''){if(!Number.isSafeInteger(amount)||amount<=0||!Number.isSafeInteger(goal.balance+amount))throw new Error('Invalid savings amount.');const normalized=Object.fromEntries(holdings(goal).filter(r=>r.id).map(r=>[r.id,r.amount]));if(accountId)normalized[accountId]=(normalized[accountId]||0)+amount;goal.holdings=normalized;goal.balance+=amount;}
export function debit(goal,amount){if(!Number.isSafeInteger(amount)||amount<=0||amount>goal.balance)throw new Error('Invalid withdrawal.');let left=amount;const used=[];const next={};for(const row of holdings(goal)){const take=Math.min(left,row.amount);left-=take;if(take)used.push({accountId:row.id,amount:take});if(row.id&&row.amount>take)next[row.id]=row.amount-take;}goal.holdings=next;goal.balance-=amount;return used;}
export function bankLabel(account){return account?`${account.bank||account.type} · ${account.name}`:'Bank not assigned';}

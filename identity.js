import { createAuthClient } from '@neondatabase/auth';
import { countries, currencies, suggestedCurrency, territoryCurrencies } from './countries.js';

export const auth = createAuthClient('https://ep-polished-haze-aoigz3dm.neonauth.c-2.ap-southeast-1.aws.neon.tech/neondb/auth');
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const profileKey = id => `saventra.profile.v1.${id}`;
export const workspaceKey = id => `saventra.workspace.v1.${id}`;
export function readLocal(key) {try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}}
export async function resolveIdentity(){
  try {const result=await auth.getSession();return {user:result.data?.user||null,error:result.error?.message||null};}
  catch{return {user:null,error:'Account service could not be reached. You can still explore the demo.'};}
}
export function mountIdentity(identity,{onProfile,onLogout,toast}){
  const user=identity.user;
  let active='login',pending=false;
  const allCurrencies=currencies;
  const profile=user?readLocal(profileKey(user.id)):null;
  const overlay=document.createElement('div');overlay.id='auth-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Saventra account');overlay.hidden=true;
  overlay.innerHTML=`<section class="auth-story"><a class="auth-brand" href="#overview">✳ Saventra</a><span class="auth-kicker">YOUR NEXT CHAPTER STARTS HERE</span><h1>A little today.<br>A world of possibilities.</h1><p>Build your savings. Make room for life.<br>Find your way forward, wherever you call home.</p><div class="auth-orbit" aria-hidden="true"><span>✧</span><strong>Save.<br>Adapt.<br>Keep going.</strong></div><small>Your account is managed by Neon Auth. Your savings workspace stays on this device.</small></section><section class="auth-content"><button class="icon-button auth-close" id="auth-close" aria-label="Close account screen">×</button><div id="auth-body"></div></section>`;
  document.body.append(overlay);
  document.querySelector('.top-actions').insertAdjacentHTML('afterbegin',user?`<button class="text-button" id="account-menu">${esc(user.name||'My account')} ⌄</button>`:`<div class="auth-header-actions"><button class="text-button" id="login-open">Log in</button><button class="button primary" id="register-open">Get started</button></div>`);
  function busy(value){pending=value;overlay.querySelectorAll('button,input,select').forEach(el=>el.disabled=value);}
  function error(message){document.getElementById('auth-error').textContent=message;}
  function close(){if(pending||!user)return;if(!readLocal(profileKey(user.id)))return;overlay.hidden=true;document.querySelector('.shell').inert=false;document.querySelector('.sidebar').inert=false;}
  function show(mode){active=mode;overlay.hidden=false;document.querySelector('.shell').inert=true;document.querySelector('.sidebar').inert=true;draw();document.querySelector('#auth-body input,#auth-body select')?.focus();}
  function draw(){
    const body=document.getElementById('auth-body');
    if(active==='new-password'){
      body.innerHTML=`<p class="eyebrow">A FRESH START</p><h2>Choose a new password.</h2><form id="reset-password-form"><label for="new-password">New password</label><input id="new-password" type="password" required minlength="12" maxlength="128" autocomplete="new-password"><label for="confirm-password">Confirm password</label><input id="confirm-password" type="password" required minlength="12" maxlength="128" autocomplete="new-password"><p class="auth-error" id="auth-error" role="alert"></p><button class="button primary auth-submit" type="submit">Save new password</button></form>`;
      document.getElementById('reset-password-form').onsubmit=async e=>{e.preventDefault();const password=document.getElementById('new-password').value;if(password!==document.getElementById('confirm-password').value){error('Passwords do not match.');return;}busy(true);try{const token=new URLSearchParams(location.search).get('token');if(!token)throw new Error('Reset link is missing or expired. Request a new one.');const result=await auth.resetPassword({newPassword:password,token});if(result.error)throw new Error(result.error.message);history.replaceState(null,'',location.pathname+'#overview');show('login');toast('Password reset. Log in with your new password.');}catch(err){error(err.message);}finally{busy(false);}};return;
    }
    if(active==='nationality'){
      body.innerHTML=`<p class="eyebrow">ONE LAST THING · YOUR WORLD, YOUR CURRENCY</p><h2>Make yourself at home.</h2><p>Choose your nationality or home country to suggest a currency. You can pick a different currency if you live or save elsewhere.</p><form id="nationality-form"><label for="nationality">Nationality / home country</label><select id="nationality" required><option value="">Choose a country or territory</option>${countries.map(c=>`<option value="${c.code}">${esc(c.name)}</option>`).join('')}</select><div class="currency-suggestion" id="currency-suggestion">Your currency will appear here.</div><label for="preferred-currency">Savings currency</label><select id="preferred-currency">${allCurrencies.map(code=>`<option value="${code}">${code} — ${esc(new Intl.DisplayNames(['en'],{type:'currency'}).of(code))}</option>`).join('')}</select><p class="auth-footnote">No location lookup. This preference stays on this device. Currency changes do not convert existing money.</p><p class="auth-error" id="auth-error" role="alert"></p><button class="button primary auth-submit" type="submit">Start my savings journey ↗</button></form>`;
      const nationality=document.getElementById('nationality'),currency=document.getElementById('preferred-currency');currency.value=profile?.currency||'USD';nationality.value=profile?.country||'';
      nationality.onchange=()=>{currency.value=suggestedCurrency(nationality.value);document.getElementById('currency-suggestion').textContent=`Suggested: ${currency.value}${territoryCurrencies[nationality.value]?.length>1?' · More than one currency is used here; choose what fits.':''}`;};
      document.getElementById('nationality-form').onsubmit=e=>{e.preventDefault();try{const next={country:nationality.value,currency:currency.value};if(!next.country)throw new Error('Choose a country or territory.');onProfile(next);close();}catch(err){error(err.message);}};
      return;
    }
    if(active==='account'){
      body.innerHTML=`<p class="eyebrow">YOUR SPACE</p><h2>${esc(user.name||'Your account')}</h2><p>${esc(user.email)}</p><div class="currency-suggestion">${esc(countries.find(c=>c.code===profile?.country)?.name||'Country not selected')} · ${esc(profile?.currency||'USD')}</div><p>Account authentication is online. Savings records are saved in this browser for your account, without cloud synchronization. Signing out does not erase this device’s saved records.</p><button class="button secondary" id="profile-edit">Edit country & currency</button><button class="button primary" id="logout-button">Sign out</button><p class="auth-error" id="auth-error" role="alert"></p>`;
      document.getElementById('profile-edit').onclick=()=>show('nationality');
      document.getElementById('logout-button').onclick=async()=>{busy(true);try{const result=await auth.signOut();if(result.error)throw new Error(result.error.message);onLogout();}catch(err){error(err.message);}finally{busy(false);}};return;
    }
    const register=active==='register',reset=active==='reset';
    body.innerHTML=`<p class="eyebrow">${register?'A FRESH START':reset?'LET’S GET YOU BACK IN':'WELCOME BACK'}</p><h2>${register?'Your future starts small.':reset?'Reset your password.':'Your next chapter awaits.'}</h2><p>${register?'Create your account, then choose your home country and savings currency.':reset?'Request a reset link at your account email.':'Log in to return to your savings workspace on this device.'}</p><form id="identity-form">${register?'<label for="auth-name">Your name</label><input id="auth-name" autocomplete="name" maxlength="80" required placeholder="What should we call you?">':''}<label for="auth-email">Email address</label><input id="auth-email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com">${!reset?`<label for="auth-password">Password</label><div class="password-field"><input id="auth-password" type="password" autocomplete="${register?'new-password':'current-password'}" minlength="${register?'12':'1'}" maxlength="128" required placeholder="${register?'At least 12 characters':'Your password'}"><button type="button" id="show-password" aria-label="Show password">Show</button></div>`:''}${register?'<p class="auth-footnote">Credentials are sent securely to Neon Auth. Passwords are never stored in Saventra’s browser storage.</p>':''}<p class="auth-error" id="auth-error" role="alert"></p><button class="button primary auth-submit" type="submit">${register?'Create account ↗':reset?'Send reset link':'Log in ↗'}</button></form><div class="auth-switch">${register?'Already have an account?':'New to Saventra?'} <button class="text-button" id="auth-switch">${register?'Log in':'Create account'}</button>${!register&&!reset?'<button class="text-button" id="forgot-password">Forgot password?</button>':''}</div>`;
    document.getElementById('auth-switch').onclick=()=>show(register?'login':'register');
    document.getElementById('forgot-password')?.addEventListener('click',()=>show('reset'));
    document.getElementById('show-password')?.addEventListener('click',()=>{const input=document.getElementById('auth-password');input.type=input.type==='password'?'text':'password';document.getElementById('show-password').textContent=input.type==='password'?'Show':'Hide';});
    document.getElementById('identity-form').onsubmit=async e=>{e.preventDefault();if(pending)return;error('');busy(true);try{
      const email=document.getElementById('auth-email').value.trim();
      if(reset){const result=await auth.requestPasswordReset({email,redirectTo:`${location.origin}${location.pathname}?reset=1`});if(result.error)throw new Error(result.error.message);error('If this email has an account, a reset link has been requested.');return;}
      const password=document.getElementById('auth-password').value;
      const result=register?await auth.signUp.email({email,password,name:document.getElementById('auth-name').value.trim()}):await auth.signIn.email({email,password});
      document.getElementById('auth-password').value='';
      if(result.error)throw new Error(result.error.message||'Could not complete sign-in.');
      if(!result.data?.user){throw new Error('Check your email to finish registration, then log in.');}
      location.reload();
    }catch(err){error(err.message||'The account service is unavailable. Please try again.');}finally{busy(false);}};
  }
  document.getElementById('auth-close').onclick=close;
  document.getElementById('login-open')?.addEventListener('click',()=>show('login'));
  document.getElementById('register-open')?.addEventListener('click',()=>show('register'));
  document.getElementById('account-menu')?.addEventListener('click',()=>show('account'));
  if(user){const name=user.name||'Your';const initials=name.split(/\s+/).slice(0,2).map(n=>n[0]).join('').toUpperCase();document.querySelectorAll('.avatar').forEach(el=>el.textContent=initials);const workspace=document.querySelector('.workspace>div');if(workspace)workspace.innerHTML=`${esc(name)}’s space<small>Saved on this device</small>`;document.querySelector('.demo-pill').textContent='Personal workspace';document.querySelector('#about-button>span:nth-child(2)').innerHTML=esc(name)+'<small>Personal workspace</small>';document.getElementById('about-button').onclick=()=>show('account');if(!profile)show('nationality');}
  if(new URLSearchParams(location.search).get('token'))show('new-password');
  if(identity.error)toast(identity.error);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!overlay.hidden)close();});
  if(!user)show('login');
  return {show};
}

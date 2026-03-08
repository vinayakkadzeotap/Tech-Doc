/* ZEOTAP CDP — Zoe AI Chat Widget v2.0
   Floating "Ask Zoe" button with slide-up chat panel.
   User pastes their Anthropic API key on first use — stored in localStorage only,
   sent directly to api.anthropic.com. Never logged or proxied. */
(function(global){
'use strict';

var ZOE_SYSTEM='You are Zoe, the AI assistant for Zeotap CDP (Customer Data Platform). You help engineers, data scientists, and business users understand how Zeotap works.\n\nYou know:\n- Data collection (SDKs: JS, iOS, Android, server-side)\n- Identity resolution (UCID, deterministic + probabilistic matching, ID graph on BigTable)\n- Profile Store (Delta Lake, ACID, GCS/S3)\n- Audience management (Rust segment engine, 18k+ concurrent segments, <100ms eval)\n- Customer Journeys (Java + Kafka, Redis state, Airflow waits)\n- Data Activation (100+ connectors, Pub/Sub changelog, 2s real-time sync)\n- ML Platform (Vertex AI, propensity/churn/LTV models)\n- Privacy & GDPR (DSR erasure, consent management, TCF 2.2)\n- Infrastructure (GCP + AWS, Kubernetes, Terraform)\n- Observability (Datadog, Prometheus, Jaeger, PagerDuty)\n\nBe concise and technical. Use code examples when helpful. Keep responses under 250 words unless a code example requires more. If asked about something outside Zeotap CDP scope, politely redirect.';

var SUGGESTED=['How does identity resolution work?','What is the UCID?','How do I ingest events via SDK?','Explain the Kafka ingestion pipeline','What is the Profile Store built on?','How does real-time segmentation work?'];
var messages=[];
var isOpen=false;
var isLoading=false;
var SK_KEY='zoe_anthropic_key';

function getKey(){ try{return localStorage.getItem(SK_KEY)||'';}catch(e){return '';} }
function saveKey(k){ try{localStorage.setItem(SK_KEY,k);}catch(e){} }
function clearKey(){ try{localStorage.removeItem(SK_KEY);}catch(e){} }

function injectCSS(){
  var s=document.createElement('style');
  s.textContent=[
    '#zoe-trigger{position:fixed;bottom:88px;right:24px;z-index:9200;display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border:none;border-radius:28px;padding:10px 18px 10px 12px;color:#fff;font-size:13px;font-weight:700;font-family:Inter,sans-serif;cursor:pointer;box-shadow:0 4px 20px rgba(59,130,246,.4);transition:all .2s;white-space:nowrap}',
    '#zoe-trigger:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(59,130,246,.5)}',
    '#zoe-trigger .zoe-av{width:26px;height:26px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px}',
    '#zoe-panel{position:fixed;bottom:0;right:0;z-index:9300;width:min(420px,100vw);height:min(580px,82vh);background:#0d1929;border:1px solid rgba(59,130,246,.25);border-radius:20px 20px 0 0;display:flex;flex-direction:column;transform:translateY(100%);transition:transform .35s cubic-bezier(.16,1,.3,1);box-shadow:0 -8px 40px rgba(0,0,0,.5);overflow:hidden}',
    '#zoe-panel.open{transform:translateY(0)}',
    '#zoe-hdr{display:flex;align-items:center;gap:10px;padding:13px 16px;border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0}',
    '#zoe-hdr .zh-av{width:32px;height:32px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}',
    '#zoe-hdr .zh-name{font-size:14px;font-weight:700;color:#e2e8f0;font-family:Inter,sans-serif}',
    '#zoe-hdr .zh-sub{font-size:11px;color:#10b981;font-family:Inter,sans-serif;display:flex;align-items:center;gap:4px}',
    '#zoe-hdr .zh-dot{width:6px;height:6px;background:#10b981;border-radius:50%;animation:zoe-pulse 2s infinite}',
    '@keyframes zoe-pulse{0%,100%{opacity:1}50%{opacity:.4}}',
    '.zh-ibtn{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;width:28px;height:28px;cursor:pointer;color:rgba(255,255,255,.45);font-size:13px;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}',
    '.zh-ibtn:hover{background:rgba(255,255,255,.12);color:#e2e8f0}',
    '#zoe-close:hover{background:rgba(239,68,68,.12) !important;border-color:rgba(239,68,68,.3) !important;color:#ef4444 !important}',
    '#zoe-setup{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;gap:12px}',
    '#zoe-setup .zs-icon{font-size:38px}',
    '#zoe-setup h3{font-size:17px;font-weight:700;color:#e2e8f0;font-family:Inter,sans-serif;margin:0}',
    '#zoe-setup .zs-desc{font-size:13px;color:#94a3b8;font-family:Inter,sans-serif;line-height:1.6;margin:0;max-width:310px}',
    '#zoe-setup a{color:#60a5fa;text-decoration:none}',
    '#zoe-setup a:hover{text-decoration:underline}',
    '#zoe-key-wrap{width:100%;position:relative}',
    '#zoe-key-input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:10px 42px 10px 14px;font-size:12px;color:#e2e8f0;font-family:JetBrains Mono,monospace;outline:none;box-sizing:border-box;letter-spacing:.02em;transition:border-color .15s}',
    '#zoe-key-input:focus{border-color:rgba(59,130,246,.5);background:rgba(59,130,246,.04)}',
    '#zoe-key-input::placeholder{color:rgba(255,255,255,.15);font-family:Inter,sans-serif;letter-spacing:0}',
    '#zoe-key-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,.3);cursor:pointer;font-size:14px;padding:0;line-height:1}',
    '#zoe-key-eye:hover{color:rgba(255,255,255,.6)}',
    '#zoe-key-err{font-size:12px;color:#f87171;font-family:Inter,sans-serif;min-height:14px;text-align:left;width:100%}',
    '#zoe-key-save{width:100%;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border:none;border-radius:10px;padding:11px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;transition:all .15s}',
    '#zoe-key-save:hover{opacity:.9;transform:translateY(-1px)}',
    '#zoe-key-save:disabled{opacity:.5;cursor:default;transform:none}',
    '.zs-note{font-size:11px;color:#475569;font-family:Inter,sans-serif;line-height:1.5}',
    '#zoe-chat{flex:1;display:none;flex-direction:column;overflow:hidden;min-height:0}',
    '#zoe-chat.visible{display:flex}',
    '#zoe-msgs{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px;min-height:0}',
    '#zoe-msgs::-webkit-scrollbar{width:3px}',
    '#zoe-msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:4px}',
    '.zoe-msg{display:flex;gap:7px;max-width:94%;font-family:Inter,sans-serif}',
    '.zoe-msg.user{align-self:flex-end;flex-direction:row-reverse}',
    '.zoe-bub{padding:9px 13px;border-radius:14px;font-size:13px;line-height:1.55;color:#e2e8f0;white-space:pre-wrap;word-break:break-word}',
    '.zoe-msg.assistant .zoe-bub{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.15);border-radius:4px 14px 14px 14px}',
    '.zoe-msg.user .zoe-bub{background:rgba(59,130,246,.18);border:1px solid rgba(59,130,246,.3);border-radius:14px 4px 14px 14px}',
    '.zoe-av-sm{width:24px;height:24px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;margin-top:2px}',
    '.zoe-typing{display:flex;gap:4px;align-items:center;padding:10px 13px}',
    '.zoe-typing span{width:5px;height:5px;background:rgba(59,130,246,.6);border-radius:50%;animation:zoe-b 1.2s infinite}',
    '.zoe-typing span:nth-child(2){animation-delay:.2s}.zoe-typing span:nth-child(3){animation-delay:.4s}',
    '@keyframes zoe-b{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}',
    '#zoe-chips{padding:0 14px 8px;display:flex;gap:5px;flex-wrap:wrap;flex-shrink:0}',
    '.zoe-chip{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);border-radius:14px;padding:3px 10px;font-size:11px;color:#93c5fd;cursor:pointer;font-family:Inter,sans-serif;transition:all .15s;white-space:nowrap}',
    '.zoe-chip:hover{background:rgba(59,130,246,.18)}',
    '#zoe-row{display:flex;align-items:flex-end;gap:8px;padding:10px 12px;border-top:1px solid rgba(255,255,255,.07);flex-shrink:0}',
    '#zoe-input{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:8px 12px;font-size:13px;color:#e2e8f0;font-family:Inter,sans-serif;outline:none;resize:none;max-height:96px;overflow-y:auto;line-height:1.4;transition:border-color .15s}',
    '#zoe-input:focus{border-color:rgba(59,130,246,.4)}',
    '#zoe-input::placeholder{color:rgba(255,255,255,.2)}',
    '#zoe-send{width:34px;height:34px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border:none;border-radius:9px;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}',
    '#zoe-send:hover{transform:scale(1.06)}',
    '#zoe-send:disabled{opacity:.35;cursor:default;transform:none}',
  ].join('');
  document.head.appendChild(s);
}

function build(){
  var trigger=document.createElement('button');
  trigger.id='zoe-trigger';
  trigger.innerHTML='<div class="zoe-av">✦</div><span>Ask Zoe</span>';
  trigger.addEventListener('click',toggle);
  document.body.appendChild(trigger);

  var panel=document.createElement('div');
  panel.id='zoe-panel';
  panel.innerHTML=[
    '<div id="zoe-hdr">',
    '<div class="zh-av">✦</div>',
    '<div style="flex:1"><div class="zh-name">Zoe AI</div>',
    '<div class="zh-sub"><span class="zh-dot"></span>CDP Knowledge Assistant</div></div>',
    '<button class="zh-ibtn" id="zoe-settings" title="Change API key">⚙</button>',
    '<button class="zh-ibtn" id="zoe-close" style="margin-left:4px" title="Close">✕</button>',
    '</div>',

    '<div id="zoe-setup">',
    '<div class="zs-icon">✦</div>',
    '<h3>Connect your API key</h3>',
    '<p class="zs-desc">Zoe runs on Claude Haiku. Paste your Anthropic API key — it stays in your browser and goes directly to Anthropic, never anywhere else.</p>',
    '<div id="zoe-key-wrap">',
    '<input id="zoe-key-input" type="password" placeholder="sk-ant-api03-…" autocomplete="off" spellcheck="false"/>',
    '<button id="zoe-key-eye" title="Show/hide key">👁</button>',
    '</div>',
    '<div id="zoe-key-err"></div>',
    '<button id="zoe-key-save">Connect →</button>',
    '<p class="zs-note">Get a key at <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a> · Free tier available</p>',
    '</div>',

    '<div id="zoe-chat">',
    '<div id="zoe-msgs"></div>',
    '<div id="zoe-chips"></div>',
    '<div id="zoe-row">',
    '<textarea id="zoe-input" rows="1" placeholder="Ask anything about Zeotap CDP…"></textarea>',
    '<button id="zoe-send"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>',
    '</div>',
    '</div>',
  ].join('');
  document.body.appendChild(panel);

  document.getElementById('zoe-close').addEventListener('click',toggle);
  document.getElementById('zoe-settings').addEventListener('click',function(){ clearKey(); messages=[]; showSetup(); });
  document.getElementById('zoe-key-save').addEventListener('click',handleKeySave);
  document.getElementById('zoe-key-input').addEventListener('keydown',function(e){ if(e.key==='Enter'){e.preventDefault();handleKeySave();} });
  document.getElementById('zoe-key-eye').addEventListener('click',function(){
    var inp=document.getElementById('zoe-key-input');
    inp.type=inp.type==='password'?'text':'password';
  });
  document.getElementById('zoe-send').addEventListener('click',send);
  document.getElementById('zoe-input').addEventListener('keydown',function(e){ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} });
  document.getElementById('zoe-input').addEventListener('input',function(){ var t=this;t.style.height='auto';t.style.height=Math.min(t.scrollHeight,96)+'px'; });

  var chips=document.getElementById('zoe-chips');
  SUGGESTED.slice(0,5).forEach(function(text){
    var c=document.createElement('button');c.className='zoe-chip';c.textContent=text;
    c.addEventListener('click',function(){ document.getElementById('zoe-input').value=text;send(); });
    chips.appendChild(c);
  });

  if(getKey()){ showChat(); addMsg('assistant','Hi! I\'m Zoe, your Zeotap CDP assistant \uD83D\uDE80\nAsk me about data ingestion, identity resolution, audience segmentation, or any of the 18 technical chapters.'); }
  else { showSetup(); }
}

function showSetup(){
  document.getElementById('zoe-setup').style.display='flex';
  document.getElementById('zoe-chat').classList.remove('visible');
  document.getElementById('zoe-key-err').textContent='';
  document.getElementById('zoe-key-input').value='';
}
function showChat(){
  document.getElementById('zoe-setup').style.display='none';
  document.getElementById('zoe-chat').classList.add('visible');
}

function handleKeySave(){
  var val=(document.getElementById('zoe-key-input').value||'').trim();
  var err=document.getElementById('zoe-key-err');
  var btn=document.getElementById('zoe-key-save');
  if(!val){ err.textContent='Please enter a key.'; return; }
  if(!val.startsWith('sk-ant')){ err.textContent='Key should start with sk-ant…'; return; }
  err.textContent=''; btn.textContent='Verifying…'; btn.disabled=true;

  fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{'Content-Type':'application/json','anthropic-version':'2023-06-01','x-api-key':val,'anthropic-dangerous-direct-browser-access':'true'},
    body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:10,messages:[{role:'user',content:'Hi'}]})
  }).then(function(r){return r.json();}).then(function(d){
    btn.textContent='Connect →'; btn.disabled=false;
    if(d.error&&d.error.type==='authentication_error'){ err.textContent='Invalid key — double-check and try again.'; return; }
    saveKey(val); messages=[];
    showChat();
    addMsg('assistant','Hi! I\'m Zoe, your Zeotap CDP assistant \uD83D\uDE80\nAsk me about data ingestion, identity resolution, audience segmentation, or any of the 18 technical chapters.');
  }).catch(function(){ btn.textContent='Connect →'; btn.disabled=false; err.textContent='Network error — check your connection.'; });
}

function toggle(){
  var panel=document.getElementById('zoe-panel');
  if(!panel)return;
  isOpen=!isOpen;
  panel.classList.toggle('open',isOpen);
  if(isOpen&&getKey()) setTimeout(function(){var i=document.getElementById('zoe-input');if(i)i.focus();},350);
}

function addMsg(role,content){
  var c=document.getElementById('zoe-msgs');if(!c)return;
  var wrap=document.createElement('div');wrap.className='zoe-msg '+role;
  var bub=document.createElement('div');bub.className='zoe-bub';bub.textContent=content;
  if(role==='assistant'){var av=document.createElement('div');av.className='zoe-av-sm';av.textContent='✦';wrap.appendChild(av);}
  wrap.appendChild(bub);c.appendChild(wrap);c.scrollTop=c.scrollHeight;
}
function showTyping(){
  var c=document.getElementById('zoe-msgs');if(!c)return;
  var w=document.createElement('div');w.className='zoe-msg assistant';w.id='zoe-typing';
  var av=document.createElement('div');av.className='zoe-av-sm';av.textContent='✦';
  var t=document.createElement('div');t.className='zoe-bub zoe-typing';t.innerHTML='<span></span><span></span><span></span>';
  w.appendChild(av);w.appendChild(t);c.appendChild(w);c.scrollTop=c.scrollHeight;
}
function removeTyping(){var e=document.getElementById('zoe-typing');if(e)e.remove();}

function send(){
  if(isLoading)return;
  var input=document.getElementById('zoe-input');
  var text=input?input.value.trim():'';
  if(!text)return;
  input.value='';input.style.height='auto';
  var sb=document.getElementById('zoe-send');if(sb)sb.disabled=true;
  var chips=document.getElementById('zoe-chips');if(chips)chips.style.display='none';
  addMsg('user',text);
  messages.push({role:'user',content:text});
  isLoading=true; showTyping();
  callClaude(function(reply){
    removeTyping();
    if(reply){addMsg('assistant',reply);messages.push({role:'assistant',content:reply});}
    isLoading=false;
    if(sb)sb.disabled=false;
    var inp=document.getElementById('zoe-input');if(inp)inp.focus();
  });
}

function callClaude(callback){
  var key=getKey();
  if(!key){ callback('⚠️ No API key. Click ⚙ to add your Anthropic key.'); return; }
  fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{'Content-Type':'application/json','anthropic-version':'2023-06-01','x-api-key':key,'anthropic-dangerous-direct-browser-access':'true'},
    body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:600,system:ZOE_SYSTEM,messages:messages.slice(-10)})
  }).then(function(r){return r.json();}).then(function(d){
    if(d.content&&d.content[0]&&d.content[0].text){ callback(d.content[0].text); }
    else if(d.error){
      if(d.error.type==='authentication_error'){ clearKey(); showSetup(); callback('⚠️ API key rejected. Re-enter your key using ⚙.'); }
      else{ callback('\u26a0\ufe0f API error: '+(d.error.message||'unknown')); }
    } else { callback('\u26a0\ufe0f Unexpected response. Try again.'); }
  }).catch(function(e){ console.warn('[Zoe]',e); callback('\u26a0\ufe0f Could not reach api.anthropic.com. Check your network.'); });
}

function init(){injectCSS();build();}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
else init();
}(window));

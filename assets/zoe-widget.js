/* ZEOTAP CDP — Zoe AI Chat Widget v1.0
   Floating "Ask Zoe" button with slide-up chat panel */
(function(global){
'use strict';

var ZOE_SYSTEM='You are Zoe, the AI assistant for Zeotap CDP. You help engineers understand data collection, identity resolution, audience segmentation, and activation. Be concise. Reference specific Zeotap concepts. Keep responses under 200 words unless code requires more.';
var SUGGESTED=['How does identity resolution work?','What is the UCID?','How do I ingest events with the SDK?','Explain the Kafka ingestion pipeline','What is the Profile Store built on?'];
var messages=[];
var isOpen=false;
var isLoading=false;

function injectCSS(){
  var s=document.createElement('style');
  s.textContent='#zoe-trigger{position:fixed;bottom:88px;right:24px;z-index:9200;display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border:none;border-radius:28px;padding:10px 18px 10px 12px;color:#fff;font-size:13px;font-weight:700;font-family:Inter,sans-serif;cursor:pointer;box-shadow:0 4px 20px rgba(59,130,246,.4);transition:all .2s;white-space:nowrap}#zoe-trigger:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(59,130,246,.5)}#zoe-trigger .zoe-avatar{width:26px;height:26px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px}#zoe-panel{position:fixed;bottom:0;right:0;z-index:9300;width:min(420px,100vw);height:min(560px,80vh);background:#0d1929;border:1px solid rgba(59,130,246,.25);border-radius:20px 20px 0 0;display:flex;flex-direction:column;transform:translateY(100%);transition:transform .35s cubic-bezier(.16,1,.3,1);box-shadow:0 -8px 40px rgba(0,0,0,.5);overflow:hidden}#zoe-panel.open{transform:translateY(0)}#zoe-header{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0}#zoe-header .zh-avatar{width:34px;height:34px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px}#zoe-header .zh-name{font-size:14px;font-weight:700;color:#e2e8f0;font-family:Inter,sans-serif}#zoe-header .zh-status{font-size:11px;color:#10b981;font-family:Inter,sans-serif;display:flex;align-items:center;gap:4px}#zoe-header .zh-dot{width:6px;height:6px;background:#10b981;border-radius:50%;animation:zoe-pulse 2s infinite}@keyframes zoe-pulse{0%,100%{opacity:1}50%{opacity:.4}}#zoe-close{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;width:30px;height:30px;cursor:pointer;color:rgba(255,255,255,.5);font-size:14px;display:flex;align-items:center;justify-content:center;margin-left:auto}#zoe-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}#zoe-messages::-webkit-scrollbar{width:4px}#zoe-messages::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:4px}.zoe-msg{display:flex;gap:8px;max-width:92%;font-family:Inter,sans-serif}.zoe-msg.user{align-self:flex-end;flex-direction:row-reverse}.zoe-msg-bubble{padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.55;color:#e2e8f0;white-space:pre-wrap;word-break:break-word}.zoe-msg.assistant .zoe-msg-bubble{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.15);border-radius:4px 14px 14px 14px}.zoe-msg.user .zoe-msg-bubble{background:rgba(59,130,246,.18);border:1px solid rgba(59,130,246,.3);border-radius:14px 4px 14px 14px}.zoe-msg-avatar{width:26px;height:26px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;margin-top:2px}.zoe-typing{display:flex;gap:4px;align-items:center;padding:12px 14px}.zoe-typing span{width:6px;height:6px;background:rgba(59,130,246,.6);border-radius:50%;animation:zoe-bounce 1.2s infinite}.zoe-typing span:nth-child(2){animation-delay:.2s}.zoe-typing span:nth-child(3){animation-delay:.4s}@keyframes zoe-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}#zoe-suggestions{padding:0 16px 10px;display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0}.zoe-chip{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);border-radius:16px;padding:4px 11px;font-size:11px;color:#93c5fd;cursor:pointer;font-family:Inter,sans-serif;transition:all .15s;white-space:nowrap}.zoe-chip:hover{background:rgba(59,130,246,.16)}#zoe-input-row{display:flex;align-items:flex-end;gap:8px;padding:12px 14px;border-top:1px solid rgba(255,255,255,.07);flex-shrink:0}#zoe-input{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:9px 13px;font-size:13px;color:#e2e8f0;font-family:Inter,sans-serif;outline:none;resize:none;max-height:100px;overflow-y:auto;line-height:1.4;transition:border-color .15s}#zoe-input:focus{border-color:rgba(59,130,246,.4)}#zoe-input::placeholder{color:rgba(255,255,255,.2)}#zoe-send{width:36px;height:36px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border:none;border-radius:10px;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}#zoe-send:hover{transform:scale(1.05)}#zoe-send:disabled{opacity:.4;cursor:default;transform:none}';
  document.head.appendChild(s);
}

function build(){
  var trigger=document.createElement('button');
  trigger.id='zoe-trigger';
  trigger.innerHTML='<div class="zoe-avatar">\u2726</div><span>Ask Zoe</span>';
  trigger.addEventListener('click',toggle);
  document.body.appendChild(trigger);

  var panel=document.createElement('div');
  panel.id='zoe-panel';
  panel.innerHTML='<div id="zoe-header"><div class="zh-avatar">\u2726</div><div style="flex:1"><div class="zh-name">Zoe AI</div><div class="zh-status"><span class="zh-dot"></span> CDP Knowledge Assistant</div></div><button id="zoe-close">\u2715</button></div><div id="zoe-messages"></div><div id="zoe-suggestions"></div><div id="zoe-input-row"><textarea id="zoe-input" rows="1" placeholder="Ask anything about Zeotap CDP\u2026"></textarea><button id="zoe-send"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></div>';
  document.body.appendChild(panel);

  document.getElementById('zoe-close').addEventListener('click',toggle);
  document.getElementById('zoe-send').addEventListener('click',send);
  document.getElementById('zoe-input').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});

  var sg=document.getElementById('zoe-suggestions');
  SUGGESTED.slice(0,4).forEach(function(text){
    var chip=document.createElement('button');
    chip.className='zoe-chip';
    chip.textContent=text;
    chip.addEventListener('click',function(){document.getElementById('zoe-input').value=text;send();});
    sg.appendChild(chip);
  });

  addMessage('assistant','Hi! I\'m Zoe, your Zeotap CDP assistant. Ask me anything about data ingestion, identity resolution, audience segmentation, or any technical chapter in this documentation. \uD83D\uDE80');
}

function toggle(){
  var panel=document.getElementById('zoe-panel');
  if(!panel)return;
  isOpen=!isOpen;
  panel.classList.toggle('open',isOpen);
  if(isOpen) setTimeout(function(){var i=document.getElementById('zoe-input');if(i)i.focus();},350);
}

function addMessage(role,content){
  var c=document.getElementById('zoe-messages');
  if(!c)return;
  var wrap=document.createElement('div');
  wrap.className='zoe-msg '+role;
  var bubble=document.createElement('div');
  bubble.className='zoe-msg-bubble';
  bubble.textContent=content;
  if(role==='assistant'){var av=document.createElement('div');av.className='zoe-msg-avatar';av.textContent='\u2726';wrap.appendChild(av);}
  wrap.appendChild(bubble);
  c.appendChild(wrap);
  c.scrollTop=c.scrollHeight;
}

function showTyping(){
  var c=document.getElementById('zoe-messages');
  if(!c)return;
  var wrap=document.createElement('div');
  wrap.className='zoe-msg assistant';
  wrap.id='zoe-typing-indicator';
  var av=document.createElement('div');av.className='zoe-msg-avatar';av.textContent='\u2726';
  var t=document.createElement('div');t.className='zoe-msg-bubble zoe-typing';
  t.innerHTML='<span></span><span></span><span></span>';
  wrap.appendChild(av);wrap.appendChild(t);c.appendChild(wrap);c.scrollTop=c.scrollHeight;
}

function removeTyping(){var e=document.getElementById('zoe-typing-indicator');if(e)e.remove();}

function send(){
  if(isLoading)return;
  var input=document.getElementById('zoe-input');
  var text=input?input.value.trim():'';
  if(!text)return;
  input.value='';input.style.height='auto';
  document.getElementById('zoe-send').disabled=true;
  document.getElementById('zoe-suggestions').style.display='none';
  addMessage('user',text);
  messages.push({role:'user',content:text});
  isLoading=true;
  showTyping();
  callClaude(function(reply){
    removeTyping();
    if(reply){addMessage('assistant',reply);messages.push({role:'assistant',content:reply});}
    isLoading=false;
    var sb=document.getElementById('zoe-send');if(sb)sb.disabled=false;
    var inp=document.getElementById('zoe-input');if(inp)inp.focus();
  });
}

function callClaude(callback){
  var apiMessages=messages.slice(-8);
  fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{'Content-Type':'application/json','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
    body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:512,system:ZOE_SYSTEM,messages:apiMessages})
  }).then(function(r){return r.json();}).then(function(data){
    if(data.content&&data.content[0]&&data.content[0].text){callback(data.content[0].text);}
    else if(data.error){callback('\u26a0\ufe0f Error: '+(data.error.message||'API error'));}
    else{callback('\u26a0\ufe0f Unexpected API response.');}
  }).catch(function(){callback('\u26a0\ufe0f Could not reach the Claude API. Browse the documentation chapters in the sidebar for answers.');});
}

function init(){injectCSS();build();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
}(window));

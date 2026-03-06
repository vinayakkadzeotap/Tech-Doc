/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP — Progress Widget for Sub-Pages
   Floating progress bar + "Mark as Read" button on all doc pages
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var SK = { progress: 'zt_learn_progress', badges: 'zt_badges' };
  var MODULE_MAP = {
    '01-platform-overview.html': 'overview',
    '02-data-collection.html': 'data_collection',
    '03-data-ingestion.html': 'data_ingestion',
    '03-identity-resolution.html': 'identity',
    '04-genai-zoe.html': 'ai_zoe',
    '05-profile-store.html': 'profiles',
    '06-audience-management.html': 'audiences',
    '07-customer-journeys.html': 'journeys',
    '08-data-activation.html': 'activation',
    '10-ml-platform.html': 'ml_platform',
    '11-reporting-bi.html': 'reporting',
    '12-unity-dashboard.html': 'unity',
    '13-privacy-gdpr.html': 'privacy',
    '14-auth-iam.html': 'auth',
    '15-infrastructure.html': 'infra',
    '16-observability.html': 'observability',
    '17-cicd.html': 'cicd',
    '18-testing.html': 'testing',
  };
  var TOTAL = 16;
  var currentPage = location.pathname.split('/').pop();
  var moduleId = MODULE_MAP[currentPage];

  function getP() { try { return JSON.parse(localStorage.getItem(SK.progress)||'{}'); } catch(e) { return {}; } }
  function getB() { try { return JSON.parse(localStorage.getItem(SK.badges)||'[]'); } catch(e) { return []; } }
  function isDone(id) { return !!getP()[id]; }
  function getCount() { return Object.keys(getP()).length; }

  function markDone(id) {
    var p = getP();
    if (!p[id]) { p[id] = { completed: true, completedAt: Date.now() }; try { localStorage.setItem(SK.progress, JSON.stringify(p)); } catch(e) {} checkBadges(); }
  }

  function checkBadges() {
    var p = getP(), b = getB(), changed = false;
    function award(id) { if (b.indexOf(id)===-1) { b.push(id); changed=true; return true; } return false; }
    var n = Object.keys(p).length;
    if (n>=1) award('first_module');
    if (n>=5) award('fast_learner');
    var w1=['overview','data_collection','data_ingestion','identity'];
    var w2=['profiles','audiences','ai_zoe','journeys'];
    var w3=['activation','ml_platform','infra','observability'];
    if (w1.every(function(m){return p[m];})) award('week1_complete');
    if (w2.every(function(m){return p[m];})) award('week2_complete');
    if (w3.every(function(m){return p[m];})) award('week3_complete');
    if (w1.concat(w2,w3).every(function(m){return p[m];})) { if (award('bootcamp_grad')) showToast('🎓 Bootcamp Graduate — you\'ve completed the full 3-week path!','#f43f5e'); }
    if (p['identity']) award('identity_expert');
    if (changed) try { localStorage.setItem(SK.badges, JSON.stringify(b)); } catch(e) {}
  }

  function showToast(msg, color) {
    color = color||'#10b981';
    var t = document.createElement('div');
    t.style.cssText='position:fixed;bottom:80px;right:24px;z-index:99999;background:#0d1929;border:1px solid '+color+';border-radius:12px;padding:13px 18px;font-size:13px;color:'+color+';box-shadow:0 8px 24px rgba(0,0,0,0.4);animation:zt-w-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;font-family:Inter,sans-serif;max-width:280px;line-height:1.4;';
    t.textContent=msg;
    document.head.insertAdjacentHTML('beforeend','<style>@keyframes zt-w-in{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes zt-w-out{from{opacity:1}to{opacity:0;transform:translateY(8px)}}</style>');
    document.body.appendChild(t);
    setTimeout(function(){ if(t.parentNode){t.style.animation='zt-w-out 0.3s ease forwards';setTimeout(function(){t.remove();},300);} },3500);
  }

  function inject() {
    var done = isDone(moduleId);
    var count = getCount();
    var pct = Math.min(100, Math.round(count/TOTAL*100));

    var w = document.createElement('div');
    w.id = 'zt-pw';
    w.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9100;background:rgba(10,18,30,0.96);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);border-radius:40px;padding:10px 18px;display:flex;align-items:center;gap:12px;font-family:Inter,sans-serif;box-shadow:0 8px 32px rgba(0,0,0,0.4);';
    w.innerHTML=
      '<a href="learning-hub.html" title="Open Learning Hub" style="text-decoration:none;display:flex;align-items:center;gap:6px;">'
        +'<span style="font-size:1rem;">🎓</span>'
        +'<div style="width:72px;height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;" id="zt-pw-track">'
          +'<div style="height:100%;background:linear-gradient(90deg,#3b82f6,#8b5cf6);border-radius:3px;width:'+pct+'%;transition:width 0.6s ease;" id="zt-pw-fill"></div>'
        +'</div>'
        +'<span style="font-size:11px;color:#93c5fd;font-weight:700;" id="zt-pw-pct">'+pct+'%</span>'
      +'</a>'
      +(moduleId
        ?'<div style="width:1px;height:18px;background:rgba(255,255,255,0.1);"></div>'
          +'<button id="zt-pw-btn" style="background:'+(done?'rgba(16,185,129,0.12)':'rgba(59,130,246,0.15)')+';border:1px solid '+(done?'rgba(16,185,129,0.3)':'rgba(59,130,246,0.3)')+';border-radius:20px;padding:5px 14px;font-size:11px;font-weight:700;color:'+(done?'#10b981':'#93c5fd')+';cursor:'+(done?'default':'pointer')+';font-family:Inter,sans-serif;transition:all 0.2s;">'+(done?'✓ Done':'📖 Mark Read')+'</button>'
        :'')
      +'<button id="zt-pw-x" style="background:none;border:none;color:#475569;font-size:12px;cursor:pointer;padding:2px;font-family:Inter,sans-serif;" title="Hide">✕</button>';

    document.body.appendChild(w);
    document.getElementById('zt-pw-x')?.addEventListener('click', function(){ w.style.display='none'; });

    if (moduleId && !done) {
      var btn = document.getElementById('zt-pw-btn');
      if (btn) btn.addEventListener('click', function(){
        markDone(moduleId);
        btn.textContent='✓ Done';
        btn.style.color='#10b981';
        btn.style.background='rgba(16,185,129,0.12)';
        btn.style.border='1px solid rgba(16,185,129,0.3)';
        btn.style.cursor='default';
        var nc = getCount();
        var np = Math.min(100,Math.round(nc/TOTAL*100));
        var fill = document.getElementById('zt-pw-fill');
        var pctEl = document.getElementById('zt-pw-pct');
        if(fill) fill.style.width=np+'%';
        if(pctEl) pctEl.textContent=np+'%';
        showToast('✅ Module saved! '+np+'% of learning path complete.','#10b981');
      });
    }

    // Auto-mark after 60s
    if (moduleId && !done) {
      setTimeout(function(){
        if(document.visibilityState!=='hidden') {
          markDone(moduleId);
          var btn2 = document.getElementById('zt-pw-btn');
          if(btn2){ btn2.textContent='✓ Done'; btn2.style.color='#10b981'; btn2.style.background='rgba(16,185,129,0.12)'; btn2.style.border='1px solid rgba(16,185,129,0.3)'; btn2.style.cursor='default'; }
        }
      }, 60000);
    }
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
}());

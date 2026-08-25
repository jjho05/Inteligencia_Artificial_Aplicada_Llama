/**
 * Meta AI - Core Shared Application Engine
 * Includes: KaTeX auto-render, Interactive Particle Canvas, Web Audio API Synthesizer,
 * Dark/Light Theme Switcher with SVG vectors, Progress Bar, and Copy Code helper.
 */

(function(){
  "use strict";

  // Asegurar que el navegador preserve y guarde la posición de scroll como siempre
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
  }

  /* 0. RENDERIZADOR KATEX AUTOMÁTICO */
 function renderLatex(){
 if(typeof renderMathInElement !== "undefined"){
 renderMathInElement(document.body, {
 delimiters: [
 {left: '$$', right: '$$', display: true},
 {left: '$', right: '$', display: false},
 {left: '\\[', right: '\\]', display: true},
 {left: '\\(', right: '\\)', display: false}
 ],
 throwOnError: false
 });
 } else {
 setTimeout(renderLatex, 150);
 }
 }
 document.addEventListener("DOMContentLoaded", renderLatex);
 setTimeout(renderLatex, 300);

 /* 1. CANVAS DE PARTÍCULAS */
 (function initCanvas(){
 var canvas = document.getElementById("bg-canvas");
 if(!canvas) return;
 var ctx = canvas.getContext("2d");
 var w, h;
 var pts = [];

 function resize(){
 w = canvas.width = window.innerWidth;
 h = canvas.height = window.innerHeight;
 pts = [];
 var count = Math.min(45, Math.floor((w * h) / 35000));
 for(var i = 0; i < count; i++){
 pts.push({
 x: Math.random() * w,
 y: Math.random() * h,
 vx: (Math.random() - 0.5) * 0.35,
 vy: (Math.random() - 0.5) * 0.35,
 r: Math.random() * 1.8 + 1
 });
 }
 }
 window.addEventListener("resize", resize);
 resize();

 function loop(){
 ctx.clearRect(0, 0, w, h);
 var isDark = document.documentElement.getAttribute("data-theme") === "dark";
 
 // Partículas
 ctx.fillStyle = isDark ? "rgba(96, 165, 250, 0.4)" : "rgba(8, 102, 255, 0.2)";
 for(var i = 0; i < pts.length; i++){
 var p = pts[i];
 p.x += p.vx; p.y += p.vy;
 if(p.x < 0) p.x = w; if(p.x > w) p.x = 0;
 if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;
 ctx.beginPath();
 ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
 ctx.fill();

 // Conexiones de red neuronal en modo oscuro
 if(isDark){
 for(var j = i + 1; j < pts.length; j++){
 var p2 = pts[j];
 var dx = p.x - p2.x;
 var dy = p.y - p2.y;
 var dist = Math.sqrt(dx*dx + dy*dy);
 if(dist < 125){
 ctx.beginPath();
 ctx.strokeStyle = "rgba(59, 130, 246, " + (0.15 * (1 - dist / 125)) + ")";
 ctx.lineWidth = 0.75;
 ctx.moveTo(p.x, p.y);
 ctx.lineTo(p2.x, p2.y);
 ctx.stroke();
 }
 }
 }
 }
 requestAnimationFrame(loop);
 }
 loop();
 })();

 /* 2. SELECTOR DE TEMA CON ICONOS SVG VECTORIALES */
 var themeBtn = document.getElementById("theme-btn");
 var themeIconContainer = document.getElementById("theme-icon-container");
 var themeLabel = document.getElementById("theme-label");

 var sunSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 000-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 000-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>';
 var moonSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.3 2a10 10 0 0 0-1.9 19.8 10 10 0 0 0 11.4-11.4A10 10 0 0 0 12.3 2zm-1 17.8A8 8 0 0 1 9.5 4a8.2 8.2 0 0 0 8.7 8.7 8 8 0 0 1-6.9 7.1z"/></svg>';

 var savedTheme = localStorage.getItem("meta_theme") || "light";
 document.documentElement.setAttribute("data-theme", savedTheme);
 updateThemeState(savedTheme);

 if(themeBtn){
 themeBtn.addEventListener("click", function(){
 var curr = document.documentElement.getAttribute("data-theme");
 var next = curr === "light" ? "dark" : "light";
 document.documentElement.setAttribute("data-theme", next);
 localStorage.setItem("meta_theme", next);
 updateThemeState(next);
 });
 }

 function updateThemeState(t){
 if(themeIconContainer) themeIconContainer.innerHTML = t === "light" ? sunSvg : moonSvg;
 if(themeBtn) themeBtn.title = t === "light" ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro";
 if(themeLabel) themeLabel.textContent = t === "light" ? "Modo Claro" : "Modo Oscuro";
 }

 /* 3. SINTETIZADOR DE AUDIO */
 window.SOUND = (function(){
 var ctx = null;
 var muted = false;
 function init(){ if(!ctx && typeof AudioContext !== "undefined"){ ctx = new (window.AudioContext || window.webkitAudioContext)(); } }
 return {
 toggle: function(){ muted = !muted; return muted; },
 playPop: function(f){
 if(muted) return;
 init();
 if(!ctx) return;
 try {
 var osc = ctx.createOscillator(), g = ctx.createGain();
 osc.type = "sine";
 osc.frequency.setValueAtTime(f || 440, ctx.currentTime);
 g.gain.setValueAtTime(0.08, ctx.currentTime);
 g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
 osc.connect(g); g.connect(ctx.destination);
 osc.start(); osc.stop(ctx.currentTime + 0.06);
 } catch(e){}
 },
 playChime: function(){
 if(muted) return;
 init();
 if(!ctx) return;
 try {
 var osc = ctx.createOscillator(), g = ctx.createGain();
 osc.type = "triangle";
 osc.frequency.setValueAtTime(587.33, ctx.currentTime);
 g.gain.setValueAtTime(0.06, ctx.currentTime);
 g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
 osc.connect(g); g.connect(ctx.destination);
 osc.start(); osc.stop(ctx.currentTime + 0.2);
 } catch(e){}
 }
 };
 })();

 var soundBtn = document.getElementById("sound-btn");
 var soundIconContainer = document.getElementById("sound-icon-container");
 var soundLabel = document.getElementById("sound-label");

 if(soundBtn){
 soundBtn.addEventListener("click", function(){
 var isMuted = window.SOUND.toggle();
 soundBtn.title = isMuted ? "Activar Efectos de Audio" : "Silenciar Audio";
 if(soundLabel) soundLabel.textContent = isMuted ? "Audio OFF" : "Audio ON";
 });
 }

 /* 4. BARRA DE PROGRESO DE SCROLL */
 var progressBar = document.getElementById("progress-bar");
 window.addEventListener("scroll", function(){
 var h = document.documentElement;
 var max = h.scrollHeight - h.clientHeight;
 var pct = max > 0 ? (h.scrollTop / max * 100) : 0;
 if(progressBar) progressBar.style.width = pct + "%";
 }, { passive: true });

 /* 5. MOTOR DE ENTRADA SUAVE POR SCROLL (SCROLL REVEAL) */
 function initScrollReveal(){
 var targets = document.querySelectorAll(
 ".tema-card, .workbench-section, .quiz-box, .stat-card-clean, .example-card, .step-flow-item, .formula-card, .arch-detail-panel, .module-card, .easy-explainer-box, .conclusion-box, .code-box"
 );

 if(!("IntersectionObserver" in window)){
 targets.forEach(function(el){ el.classList.add("reveal-visible"); });
 return;
 }

 var observer = new IntersectionObserver(function(entries){
 entries.forEach(function(entry){
 if(entry.isIntersecting){
 entry.target.classList.add("reveal-visible");
 observer.unobserve(entry.target);
 }
 });
 }, {
 threshold: 0.08,
 rootMargin: "0px 0px -40px 0px"
 });

 targets.forEach(function(el){
 el.classList.add("reveal-init");
 observer.observe(el);
 });
 }

 if(document.readyState === "loading"){
 document.addEventListener("DOMContentLoaded", initScrollReveal);
 } else {
 initScrollReveal();
 }

 /* 6. MOTOR DE CELEBRACIÓN DE CONFETI */
 window.celebrateConfetti = function(){
 if(window.SOUND) window.SOUND.playChime();
 var canvas = document.createElement("canvas");
 canvas.style.position = "fixed";
 canvas.style.top = "0";
 canvas.style.left = "0";
 canvas.style.width = "100vw";
 canvas.style.height = "100vh";
 canvas.style.zIndex = "99999";
 canvas.style.pointerEvents = "none";
 document.body.appendChild(canvas);

 var ctx = canvas.getContext("2d");
 var w = canvas.width = window.innerWidth;
 var h = canvas.height = window.innerHeight;

 var colors = ["#0866ff", "#00c3ff", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"];
 var pieces = [];
 for(var i = 0; i < 90; i++){
 pieces.push({
 x: w / 2 + (Math.random() - 0.5) * 200,
 y: h / 2 - 100,
 vx: (Math.random() - 0.5) * 14,
 vy: (Math.random() - 0.8) * 14,
 size: Math.random() * 8 + 4,
 color: colors[Math.floor(Math.random() * colors.length)],
 rotation: Math.random() * 360,
 rotationSpeed: (Math.random() - 0.5) * 10,
 opacity: 1
 });
 }

 var startTime = Date.now();
 function animate(){
 var elapsed = Date.now() - startTime;
 ctx.clearRect(0, 0, w, h);

 pieces.forEach(function(p){
 p.x += p.vx;
 p.y += p.vy;
 p.vy += 0.35; // Gravedad
 p.rotation += p.rotationSpeed;
 p.opacity = Math.max(0, 1 - elapsed / 2600);

 ctx.save();
 ctx.translate(p.x, p.y);
 ctx.rotate((p.rotation * Math.PI) / 180);
 ctx.globalAlpha = p.opacity;
 ctx.fillStyle = p.color;
 ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
 ctx.restore();
 });

 if(elapsed < 2600){
 requestAnimationFrame(animate);
 } else {
 if(canvas.parentNode) canvas.parentNode.removeChild(canvas);
 }
 }
 requestAnimationFrame(animate);
 };

 /* 7. MOTOR DE TRANSICIONES ENTRE PÁGINAS */
 function initPageTransitions(){
 document.addEventListener("click", function(e){
 var link = e.target.closest("a");
 if(!link) return;
 var href = link.getAttribute("href");
 if(!href) return;
 
 // Ignorar saltos dentro de la misma página (anclas con #)
 if(href.startsWith("#")) return;
 
 // Ignorar enlaces externos o especiales
 if(href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;
 if(link.target === "_blank" || e.ctrlKey || e.metaKey || e.shiftKey) return;
 
 // Transición fluida para navegación a páginas internas HTML
 if(href.endsWith(".html") || href.includes(".html#") || href === "index.html" || href === "/"){
 e.preventDefault();
 if(window.SOUND) window.SOUND.playPop(460);
 var main = document.querySelector(".main-container");
 if(main) main.classList.add("page-is-exiting");
 setTimeout(function(){
 window.location.href = href;
 }, 160);
 }
 });

 window.addEventListener("pageshow", function(){
 var main = document.querySelector(".main-container");
 if(main) main.classList.remove("page-is-exiting");
 });
 }

 /* 8. GESTOR DE MENÚ HAMBURGUESA MÓVIL Y DRAWER FLUIDO */
 function initMobileDrawer(){
 var toggleBtn = document.getElementById("menu-toggle-btn");
 var drawer = document.getElementById("mobile-drawer");
 var backdrop = document.getElementById("mobile-backdrop");
 var closeBtn = document.getElementById("mobile-drawer-close");
 var drawerNav = document.getElementById("mobile-drawer-nav");
 var headerNav = document.querySelector(".nav-links");

 if(!toggleBtn || !drawer) return;

 // Si el contenedor del drawer está vacío, clonar dinámicamente los enlaces del header
 if(drawerNav && headerNav && drawerNav.children.length === 0){
 var links = headerNav.querySelectorAll(".nav-link-item");
 links.forEach(function(link){
 var a = document.createElement("a");
 a.className = "mobile-drawer-link";
 a.href = link.getAttribute("href");
 if(link.classList.contains("active")) a.classList.add("active");
 a.innerHTML = "<span>" + link.textContent + "</span><span class='link-badge'>&rarr;</span>";
 a.addEventListener("click", function(){
 closeDrawer();
 });
 drawerNav.appendChild(a);
 });
 }

 function openDrawer(){
 if(window.SOUND) window.SOUND.playPop(480);
 drawer.classList.add("is-open");
 if(backdrop) backdrop.classList.add("is-open");
 document.body.style.overflow = "hidden";
 toggleBtn.setAttribute("aria-expanded", "true");
 }

 function closeDrawer(){
 if(window.SOUND) window.SOUND.playPop(320);
 drawer.classList.remove("is-open");
 if(backdrop) backdrop.classList.remove("is-open");
 document.body.style.overflow = "";
 toggleBtn.setAttribute("aria-expanded", "false");
 }

 toggleBtn.addEventListener("click", function(){
 if(drawer.classList.contains("is-open")){
 closeDrawer();
 } else {
 openDrawer();
 }
 });

 if(closeBtn) closeBtn.addEventListener("click", closeDrawer);
 if(backdrop) backdrop.addEventListener("click", closeDrawer);

 window.addEventListener("keydown", function(e){
 if(e.key === "Escape" && drawer.classList.contains("is-open")){
 closeDrawer();
 }
 });
 }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){
      initSmoothAccordions();
      initPageTransitions();
      initMobileDrawer();
      initCodeBoxActions();
    });
  } else {
    initSmoothAccordions();
    initPageTransitions();
    initMobileDrawer();
    initCodeBoxActions();
  }

  // Listener global para inicializar bloques de código cuando se abren acordeones <details>
  document.addEventListener("click", function(e){
    if (e.target && (e.target.tagName === "SUMMARY" || e.target.closest("summary"))) {
      setTimeout(initCodeBoxActions, 50);
    }
  });


  /* 6. BOTONES FLOTANTES DE NAVEGACIÓN RÁPIDA (ARRIBA / ABAJO) */
  function scrollToTopSmooth() {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch (e) {
      window.scroll(0, 0);
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function scrollToBottomSmooth() {
    var maxScroll = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    try {
      window.scrollTo({ top: maxScroll, left: 0, behavior: "smooth" });
    } catch (e) {
      window.scroll(0, maxScroll);
    }
    document.documentElement.scrollTop = maxScroll;
    document.body.scrollTop = maxScroll;
  }

  window.scrollToTop = scrollToTopSmooth;
  window.scrollToBottom = scrollToBottomSmooth;

  function initFloatingScrollNav(){
    var nav = document.querySelector(".floating-scroll-nav");
    if(!nav){
      nav = document.createElement("aside");
      nav.className = "floating-scroll-nav";
      nav.setAttribute("aria-label", "Navegación rápida");
      nav.innerHTML = '<button class="btn-floating-scroll" id="scroll-top-btn" title="Ir al inicio" aria-label="Ir al inicio" onclick="window.scrollToTop()"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg></button><button class="btn-floating-scroll" id="scroll-bottom-btn" title="Ir al final" aria-label="Ir al final" onclick="window.scrollToBottom()"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>';
      document.body.appendChild(nav);
    }
    
    var btnTop = document.getElementById("scroll-top-btn");
    var btnBottom = document.getElementById("scroll-bottom-btn");
    
    if(btnTop){
      btnTop.onclick = function(e){
        if(e) e.preventDefault();
        scrollToTopSmooth();
      };
      btnTop.addEventListener("click", function(e){
        if(e) e.preventDefault();
        scrollToTopSmooth();
      });
    }
    if(btnBottom){
      btnBottom.onclick = function(e){
        if(e) e.preventDefault();
        scrollToBottomSmooth();
      };
      btnBottom.addEventListener("click", function(e){
        if(e) e.preventDefault();
        scrollToBottomSmooth();
      });
    }
  }

  // Delegación de eventos global para clicks en cualquier botón de scroll flotante
  document.addEventListener("click", function (e) {
    var target = e.target;
    var btnTop = target.closest("#scroll-top-btn");
    var btnBottom = target.closest("#scroll-bottom-btn");

    if (btnTop) {
      e.preventDefault();
      scrollToTopSmooth();
    } else if (btnBottom) {
      e.preventDefault();
      scrollToBottomSmooth();
    }
  }, true);

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", initFloatingScrollNav);
  } else {
    initFloatingScrollNav();
  }

})();

function isDownloadableCodeBox(box, headerText, codeText) {
  // Si está dentro de un simulador o visor dinámico interactivo, no descargar
  if (box.closest(".challenge-bench-box") || box.closest(".api-tester-container") || box.closest(".simulator-container") || box.closest("#simulador")) {
    return false;
  }

  var trimmed = codeText.trim();
  var lines = trimmed.split("\n");

  // Si es un comando simple de terminal o shell corto, solo debe tener botón Copiar
  if (trimmed.startsWith("pip ") || trimmed.startsWith("npm ") || trimmed.startsWith("curl ") || trimmed.startsWith("ollama ") || trimmed.startsWith("sudo ") || trimmed.startsWith("git ") || trimmed.startsWith("uvicorn ") || trimmed.startsWith("$")) {
    return false;
  }

  // 1. Si la cabecera tiene un nombre de archivo explícito con extensión de archivo
  var fileMatch = headerText.match(/([a-zA-Z0-9_\-]+\.(py|jsonl|json|sql|sh|yml|yaml|service|ini|txt|md))/i);
  if (fileMatch) {
    var fname = fileMatch[1].toLowerCase();
    if (fname.includes("response_") || fname.includes("request_payload")) {
      return false;
    }
    return true;
  }

  // 2. Si es un script estructurado de Python o SQL con contenido sustancial
  if (lines.length >= 4 && (codeText.includes("import ") || codeText.includes("def ") || codeText.includes("from ") || codeText.includes("CREATE TABLE") || codeText.includes("class "))) {
    return true;
  }

  return false;
}

/* 7. GESTOR Y ACCIONES DE BLOQUES DE CÓDIGO (COPIAR & DESCARGAR) */
function initCodeBoxActions() {
  var boxes = document.querySelectorAll(".code-box");
  boxes.forEach(function(box) {
    var header = box.querySelector(".code-header");
    if (!header) {
      header = document.createElement("div");
      header.className = "code-header";
      var codeEl = box.querySelector("code");
      var langClass = codeEl ? (codeEl.className || "") : "";
      var langName = "Snippet de Código";
      if (langClass.includes("python")) langName = "Python 3";
      else if (langClass.includes("json")) langName = "JSON Schema / Payload";
      else if (langClass.includes("bash") || langClass.includes("sh")) langName = "Bash / Shell";
      else if (langClass.includes("ini")) langName = "Config / Systemd";
      else if (langClass.includes("text")) langName = "Texto / Plantilla";
      
      header.innerHTML = '<span class="code-lang">' + langName + '</span>';
      box.insertBefore(header, box.firstChild);
    }

    var actions = header.querySelector(".code-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "code-actions";
      
      var existingBtns = header.querySelectorAll("button");
      existingBtns.forEach(function(b) {
        actions.appendChild(b);
      });
      header.appendChild(actions);
    }

    // Verificar botón Copiar
    var copyBtn = actions.querySelector(".btn-copy-code");
    if (!copyBtn) {
      copyBtn = document.createElement("button");
      copyBtn.className = "btn-copy-code";
      copyBtn.setAttribute("type", "button");
      copyBtn.setAttribute("onclick", "copyCode(this)");
      copyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copiar</span>';
      actions.appendChild(copyBtn);
    } else if (!copyBtn.querySelector("svg")) {
      var copyText = copyBtn.textContent.trim() || "Copiar";
      copyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>' + copyText + '</span>';
    }

    // Filtrar botón Descargar: SOLO en archivos y scripts reales
    var downloadBtn = actions.querySelector(".btn-download-code");
    var codeEl = box.querySelector("code") || box.querySelector(".code-content") || box.querySelector("pre");
    var codeText = codeEl ? (codeEl.innerText || codeEl.textContent) : "";
    var headerText = header ? header.innerText : "";

    var shouldDownload = isDownloadableCodeBox(box, headerText, codeText);

    if (shouldDownload) {
      if (!downloadBtn) {
        downloadBtn = document.createElement("button");
        downloadBtn.className = "btn-download-code";
        downloadBtn.setAttribute("type", "button");
        downloadBtn.setAttribute("onclick", "downloadCode(this)");
        downloadBtn.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg><span>Descargar</span>';
        actions.appendChild(downloadBtn);
      }
    } else {
      // Eliminar el botón descargar de comandos, terminal y respuestas dinámicas
      if (downloadBtn) {
        downloadBtn.remove();
      }
    }
  });
}

function copyCode(btn){
  var codeBox = btn.closest(".code-box");
  var codeEl = codeBox ? (codeBox.querySelector("code") || codeBox.querySelector(".code-content") || codeBox.querySelector("pre")) : null;
  if(!codeEl && btn.parentElement && btn.parentElement.nextElementSibling) {
    codeEl = btn.parentElement.nextElementSibling.querySelector("code") || btn.parentElement.nextElementSibling;
  }
  if(!codeEl) return;
  var text = codeEl.innerText || codeEl.textContent;
  navigator.clipboard.writeText(text).then(function(){
    if(window.SOUND) window.SOUND.playPop(580);
    var oldHtml = btn.innerHTML;
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> <span>¡Copiado!</span>';
    btn.style.background = "#0866ff";
    btn.style.color = "#ffffff";
    btn.style.borderColor = "#0866ff";
    setTimeout(function(){
      btn.innerHTML = oldHtml;
      btn.style.background = "";
      btn.style.color = "";
      btn.style.borderColor = "";
    }, 2000);
  });
}

function downloadCode(btn){
  var codeBox = btn.closest(".code-box");
  if (!codeBox) return;
  var codeEl = codeBox.querySelector("code") || codeBox.querySelector(".code-content") || codeBox.querySelector("pre");
  if (!codeEl) return;

  var codeText = codeEl.innerText || codeEl.textContent;
  if (!codeText || !codeText.trim()) return;

  // 1. Extraer nombre de archivo exacto del encabezado
  var headerSpan = codeBox.querySelector(".code-header span");
  var explicitTitle = headerSpan ? headerSpan.textContent.trim() : "";
  var filename = "script.py";

  var fileMatch = explicitTitle.match(/([a-zA-Z0-9_\-\.]+\.[a-zA-Z0-9]+)/i);
  if (fileMatch && fileMatch[1]) {
    filename = fileMatch[1];
  } else {
    var fnMatch = explicitTitle.match(/([a-zA-Z0-9_]+)\s*\(\)/);
    var codeLower = codeText.toLowerCase();
    if (fnMatch && fnMatch[1]) {
      filename = fnMatch[1] + (codeLower.includes("def ") || codeLower.includes("import ") ? ".py" : ".js");
    } else if (codeText.trim().startsWith("{") || codeText.trim().startsWith("[")) {
      filename = "dataset.json";
    } else if (codeLower.includes("select ") || codeLower.includes("create table")) {
      filename = "consulta.sql";
    } else if (codeLower.includes("import ") || codeLower.includes("def ")) {
      filename = "script.py";
    } else if (codeLower.includes("#!/bin/bash") || explicitTitle.toLowerCase().includes("terminal") || explicitTitle.toLowerCase().includes("bash") || explicitTitle.toLowerCase().includes("shell")) {
      filename = "script.sh";
    } else if (explicitTitle.toLowerCase().includes("prompt") || explicitTitle.toLowerCase().includes("instrucción") || explicitTitle.toLowerCase().includes("template")) {
      filename = "prompt.txt";
    } else if (explicitTitle.toLowerCase().includes("docker") || explicitTitle.toLowerCase().includes("compose") || explicitTitle.toLowerCase().includes("yaml")) {
      filename = "docker-compose.yml";
    } else {
      filename = "codigo.txt";
    }
  }

  // 2. Descarga directa y síncrona
  var blob = new Blob([codeText], { type: "text/plain;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);

  if (window.SOUND) window.SOUND.playChime();

  var oldHtml = btn.innerHTML;
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> <span>' + filename + '</span>';
  btn.style.background = "#059669";
  btn.style.color = "#ffffff";
  btn.style.borderColor = "#059669";
  setTimeout(function(){
    btn.innerHTML = oldHtml;
    btn.style.background = "";
    btn.style.color = "";
    btn.style.borderColor = "";
  }, 2500);
}

/* 8. ANIMACIONES Y TRANSICIONES FLUIDAS PARA DESPLEGABLES (<details> Y ACORDEONES) */
class SmoothDetails {
  constructor(el) {
    this.el = el;
    this.summary = el.querySelector("summary");
    this.content = this.summary ? this.summary.nextElementSibling : null;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    if (this.summary && this.content) {
      this.summary.addEventListener("click", (e) => this.onClick(e));
    }
  }

  onClick(e) {
    e.preventDefault();
    if (this.isClosing || this.isExpanding) return;

    if (window.SOUND && typeof window.SOUND.playPop === "function") {
      window.SOUND.playPop(this.el.hasAttribute("open") ? 340 : 420);
    }

    if (this.el.hasAttribute("open")) {
      this.shrink();
    } else {
      this.open();
    }
  }

  shrink() {
    this.isClosing = true;
    this.el.style.overflow = "hidden";
    const startHeight = this.el.offsetHeight;
    const endHeight = this.summary.offsetHeight;

    if (this.animation) this.animation.cancel();

    this.el.style.height = startHeight + "px";

    this.animation = this.el.animate({
      height: [startHeight + "px", endHeight + "px"]
    }, {
      duration: 220,
      easing: "cubic-bezier(0.2, 0, 0, 1)"
    });

    if (this.content) {
      this.content.animate({
        opacity: [1, 0],
        transform: ["translateY(0)", "translateY(-4px)"]
      }, {
        duration: 170,
        easing: "ease-out"
      });
    }

    this.animation.onfinish = () => {
      this.onAnimationFinish(false);
    };
    this.animation.oncancel = () => {
      this.isClosing = false;
      this.el.style.height = "";
      this.el.style.overflow = "";
    };
  }

  open() {
    this.isExpanding = true;
    this.el.style.overflow = "hidden";
    const summaryHeight = this.summary.offsetHeight;
    this.el.style.height = summaryHeight + "px";
    this.el.setAttribute("open", "");

    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    const startHeight = this.summary.offsetHeight;
    const contentHeight = this.content ? this.content.offsetHeight : (this.el.scrollHeight - startHeight);
    const endHeight = startHeight + contentHeight;

    if (this.animation) this.animation.cancel();

    this.animation = this.el.animate({
      height: [startHeight + "px", endHeight + "px"]
    }, {
      duration: 240,
      easing: "cubic-bezier(0.2, 0, 0, 1)"
    });

    if (this.content) {
      this.content.animate({
        opacity: [0, 1],
        transform: ["translateY(-4px)", "translateY(0)"]
      }, {
        duration: 220,
        easing: "cubic-bezier(0.2, 0, 0, 1)"
      });
    }

    this.animation.onfinish = () => {
      this.onAnimationFinish(true);
    };
    this.animation.oncancel = () => {
      this.isExpanding = false;
      this.el.style.height = "";
      this.el.style.overflow = "";
    };
  }

  onAnimationFinish(isOpen) {
    if (isOpen) {
      this.el.setAttribute("open", "");
    } else {
      this.el.removeAttribute("open");
    }
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = "";
    this.el.style.overflow = "";
  }
}

function initSmoothAccordions() {
  document.querySelectorAll("details").forEach(function(el) {
    if (!el._smoothInitialized) {
      new SmoothDetails(el);
      el._smoothInitialized = true;
    }
  });
}

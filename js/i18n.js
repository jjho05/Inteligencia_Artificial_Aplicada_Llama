/**
 * MOTOR DE INTERNACIONALIZACIÓN (i18n) NATIVO
 * Plataforma: Especialización en Inteligencia Artificial con Meta Llama 3
 * Autor: Ing. Jesús Javier Hernández Olvera
 */

(function() {
  const STORAGE_KEY = "meta_llama_lang";
  
  function getInitialLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") return saved;
    const browserLang = (navigator.language || navigator.userLanguage || "es").toLowerCase();
    return browserLang.startsWith("en") ? "en" : "es";
  }

  let currentLang = getInitialLanguage();

  function setLanguage(lang) {
    if (lang !== "es" && lang !== "en") return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    applyTranslations();
    updateSwitcherUI();
  }

  function applyTranslations() {
    const dict = typeof I18N_TRANSLATIONS !== "undefined" ? I18N_TRANSLATIONS[currentLang] : null;
    if (!dict) return;

    // Apply data-i18n attributes
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Translate common buttons and labels
    document.querySelectorAll(".copy-code-btn, .btn-copy").forEach(btn => {
      btn.textContent = dict.btn_copy_code || "Copiar Código";
    });

    // Translate back to top
    document.querySelectorAll(".btn-back-to-top").forEach(btn => {
      if (btn.querySelector("span")) {
        btn.querySelector("span").textContent = dict.btn_back_to_top || "Volver Arriba";
      }
    });

    // Specific page elements
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
    if (isIndex) {
      const hTitle = document.querySelector(".hero-title");
      if (hTitle && dict.hero_title) hTitle.textContent = dict.hero_title;
      const hSub = document.querySelector(".hero-subtitle");
      if (hSub && dict.hero_subtitle) hSub.textContent = dict.hero_subtitle;
    }
  }

  function updateSwitcherUI() {
    const btns = document.querySelectorAll(".lang-toggle-btn, #lang-switcher-btn");
    btns.forEach(btn => {
      btn.innerHTML = `<span class="lang-code ${currentLang === "es" ? "lang-active" : ""}">ES</span><span class="lang-sep">/</span><span class="lang-code ${currentLang === "en" ? "lang-active" : ""}">EN</span>`;
      btn.setAttribute("aria-label", `Cambiar idioma (actual: ${currentLang.toUpperCase()})`);
    });
  }

  function initSwitcher() {
    const controls = document.querySelector(".header-controls") || document.querySelector(".nav-actions");
    let btn = document.getElementById("lang-switcher-btn");
    
    if (!btn && controls) {
      btn = document.createElement("button");
      btn.id = "lang-switcher-btn";
      btn.className = "lang-toggle-btn";
      btn.type = "button";
      btn.title = "Cambiar idioma / Switch language";
      const soundBtn = document.getElementById("sound-btn") || document.getElementById("theme-btn");
      if (soundBtn) {
        controls.insertBefore(btn, soundBtn);
      } else {
        controls.appendChild(btn);
      }
    }

    if (btn) {
      btn.onclick = function(e) {
        e.preventDefault();
        setLanguage(currentLang === "es" ? "en" : "es");
      };
    }

    updateSwitcherUI();
  }

  function onReady() {
    document.documentElement.lang = currentLang;
    initSwitcher();
    applyTranslations();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  window.MetaAI_i18n = {
    setLanguage: setLanguage,
    getLanguage: function() { return currentLang; }
  };
})();

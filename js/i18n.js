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

    // Apply specific key mappings for hero and common elements
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle && dict.hero_title && (window.location.pathname.endsWith("index.html") || window.location.pathname === "/")) {
      heroTitle.textContent = dict.hero_title;
    }
    const heroSubtitle = document.querySelector(".hero-subtitle");
    if (heroSubtitle && dict.hero_subtitle && (window.location.pathname.endsWith("index.html") || window.location.pathname === "/")) {
      heroSubtitle.textContent = dict.hero_subtitle;
    }
  }

  function updateSwitcherUI() {
    const btn = document.getElementById("lang-switcher-btn");
    if (btn) {
      btn.innerHTML = `<span class="lang-code ${currentLang === "es" ? "lang-active" : ""}">ES</span><span class="lang-sep">/</span><span class="lang-code ${currentLang === "en" ? "lang-active" : ""}">EN</span>`;
      btn.setAttribute("aria-label", `Cambiar idioma (actual: ${currentLang.toUpperCase()})`);
    }
  }

  function injectLanguageSwitcher() {
    const navActions = document.querySelector(".nav-actions");
    if (!navActions) return;

    if (document.getElementById("lang-switcher-btn")) return;

    const btn = document.createElement("button");
    btn.id = "lang-switcher-btn";
    btn.className = "lang-toggle-btn";
    btn.type = "button";
    btn.title = "Cambiar idioma / Switch language";
    btn.onclick = function() {
      setLanguage(currentLang === "es" ? "en" : "es");
    };

    // Insert before sound or theme toggle
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      navActions.insertBefore(btn, themeBtn);
    } else {
      navActions.appendChild(btn);
    }

    updateSwitcherUI();
  }

  document.addEventListener("DOMContentLoaded", function() {
    document.documentElement.lang = currentLang;
    injectLanguageSwitcher();
    applyTranslations();
  });

  window.MetaAI_i18n = {
    setLanguage: setLanguage,
    getLanguage: function() { return currentLang; }
  };
})();

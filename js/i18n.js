/**
 * MOTOR DE TRADUCCIÓN BILINGÜE EN TIEMPO REAL (ES/EN)
 * Plataforma: Especialización en Inteligencia Artificial con Meta Llama 3
 * Autor: Ing. Jesús Javier Hernández Olvera
 */

(function() {
  const STORAGE_KEY = "meta_llama_lang";
  let currentLang = localStorage.getItem(STORAGE_KEY) || (navigator.language.startsWith("en") ? "en" : "es");

  // Sorted keys from longest to shortest for accurate phrase matching
  let sortedKeys = [];

  function getSortedKeys() {
    if (sortedKeys.length === 0 && typeof I18N_DICTIONARY !== "undefined") {
      sortedKeys = Object.keys(I18N_DICTIONARY).sort((a, b) => b.length - a.length);
    }
    return sortedKeys;
  }

  function translateText(text) {
    if (!text || typeof text !== "string") return text;
    let result = text;
    const keys = getSortedKeys();
    for (let i = 0; i < keys.length; i++) {
      const esKey = keys[i];
      if (result.includes(esKey)) {
        const enVal = I18N_DICTIONARY[esKey];
        result = result.split(esKey).join(enVal);
      }
    }
    return result;
  }

  function walkAndTranslate(node) {
    // Ignore code blocks, preformatted code, scripts, styles
    if (!node) return;
    const tag = node.nodeName ? node.nodeName.toUpperCase() : "";
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "CODE" || tag === "PRE" || tag === "SVG") {
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      if (node._orig === undefined) {
        node._orig = node.nodeValue;
      }
      if (currentLang === "en") {
        node.nodeValue = translateText(node._orig);
      } else {
        node.nodeValue = node._orig;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Translate title and placeholder if present
      if (node.hasAttribute("title")) {
        if (!node._origTitle) node._origTitle = node.getAttribute("title");
        node.setAttribute("title", currentLang === "en" ? translateText(node._origTitle) : node._origTitle);
      }
      if (node.hasAttribute("placeholder")) {
        if (!node._origPlaceholder) node._origPlaceholder = node.getAttribute("placeholder");
        node.setAttribute("placeholder", currentLang === "en" ? translateText(node._origPlaceholder) : node._origPlaceholder);
      }
      
      // Traverse children
      for (let child = node.firstChild; child; child = child.nextSibling) {
        walkAndTranslate(child);
      }
    }
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    
    if (document.body) {
      walkAndTranslate(document.body);
    }
    
    updateSwitcherUI();
  }

  function updateSwitcherUI() {
    const btns = document.querySelectorAll(".lang-toggle-btn, #lang-switcher-btn");
    btns.forEach(btn => {
      btn.innerHTML = `<span class="lang-code ${currentLang === "es" ? "lang-active" : ""}">ES</span><span class="lang-sep">/</span><span class="lang-code ${currentLang === "en" ? "lang-active" : ""}">EN</span>`;
      btn.setAttribute("aria-label", `Cambiar idioma (actual: ${currentLang.toUpperCase()})`);
    });
  }

  function setupSwitcherButton() {
    const btn = document.getElementById("lang-switcher-btn");
    if (btn) {
      btn.onclick = function(e) {
        e.preventDefault();
        applyLanguage(currentLang === "es" ? "en" : "es");
      };
    }
    updateSwitcherUI();
  }

  function init() {
    setupSwitcherButton();
    if (currentLang === "en") {
      applyLanguage("en");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.MetaAI_i18n = {
    setLanguage: applyLanguage,
    getLanguage: function() { return currentLang; }
  };
})();

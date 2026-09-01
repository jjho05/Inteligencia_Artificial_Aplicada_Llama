/**
 * MOTOR DE TRADUCCIÓN BILINGÜE INTEGRAL (ES / EN) CON PROTECCIÓN ANTI-GLITCH
 * Plataforma: Especialización en Inteligencia Artificial con Meta Llama 3
 * Autor: Ing. Jesús Javier Hernández Olvera
 */

(function() {
  const STORAGE_KEY = "meta_llama_lang";
  let isChanging = false;

  function getSavedLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") return saved;
    const browserLang = (navigator.language || navigator.userLanguage || "es").toLowerCase();
    return browserLang.startsWith("en") ? "en" : "es";
  }

  let currentLang = getSavedLang();

  // Protect brand, logos, formulas, code, badges and the switcher itself
  function applyNotranslateRules() {
    const elements = document.querySelectorAll(
      ".lang-toggle-btn, #lang-switcher-btn, .lang-code, .lang-sep, " +
      ".brand-wrapper, .brand-text, .meta-logo-svg, " +
      "pre, code, svg, .math-display, .formula-box, .katex, " +
      ".badge-role, .model-badge, .badge-model, .notranslate"
    );
    elements.forEach(el => {
      el.classList.add("notranslate");
      el.setAttribute("translate", "no");
    });
  }

  // Google Translate initialization callback
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: "es",
      includedLanguages: "es,en",
      autoDisplay: false
    }, "google_translate_element");

    if (currentLang === "en") {
      setTimeout(function() {
        triggerTranslate("en");
      }, 350);
    }
  };

  function triggerTranslate(lang) {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
  }

  function clearTranslateCookies() {
    const domain = window.location.hostname;
    const paths = ["/", "/es", "/en"];
    const cookieNames = ["googtrans", "googtrans_es", "googtrans_en"];
    
    paths.forEach(p => {
      cookieNames.forEach(c => {
        document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p};`;
        document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p}; domain=${domain};`;
        document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p}; domain=.${domain};`;
      });
    });
  }

  function setLanguage(targetLang) {
    if (isChanging || (targetLang === currentLang && targetLang === "es")) return;
    isChanging = true;

    localStorage.setItem(STORAGE_KEY, targetLang);
    currentLang = targetLang;
    updateSwitcherUI();

    if (targetLang === "en") {
      document.cookie = "googtrans=/es/en; path=/";
      document.cookie = "googtrans=/es/en; domain=" + window.location.hostname + "; path=/";
      triggerTranslate("en");
      setTimeout(() => { isChanging = false; }, 600);
    } else {
      // Clean reset to original Spanish
      clearTranslateCookies();
      // Reload ensures 100% pristine original Spanish without back-translation bugs
      window.location.reload();
    }
  }

  function updateSwitcherUI() {
    const btns = document.querySelectorAll(".lang-toggle-btn, #lang-switcher-btn");
    btns.forEach(btn => {
      btn.innerHTML = `<span class="lang-code ${currentLang === "es" ? "lang-active" : ""} notranslate" translate="no">ES</span><span class="lang-sep notranslate" translate="no">/</span><span class="lang-code ${currentLang === "en" ? "lang-active" : ""} notranslate" translate="no">EN</span>`;
      btn.setAttribute("aria-label", `Idioma: ${currentLang.toUpperCase()}`);
    });
  }

  function init() {
    applyNotranslateRules();

    if (!document.getElementById("google_translate_element")) {
      const div = document.createElement("div");
      div.id = "google_translate_element";
      div.style.display = "none";
      document.body.appendChild(div);
    }

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    const btn = document.getElementById("lang-switcher-btn");
    if (btn) {
      btn.onclick = function(e) {
        e.preventDefault();
        if (window.SOUND && typeof window.SOUND.playPop === "function") {
          window.SOUND.playPop(480);
        }
        setLanguage(currentLang === "es" ? "en" : "es");
      };
    }

    updateSwitcherUI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.MetaAI_i18n = {
    setLanguage: setLanguage,
    getLanguage: function() { return currentLang; }
  };
})();

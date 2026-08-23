/**
 * MOTOR DE TRADUCCIÓN BILINGÜE INTEGRAL (ES / EN)
 * Plataforma: Especialización en Inteligencia Artificial con Meta Llama 3
 * Autor: Ing. Jesús Javier Hernández Olvera
 */

(function() {
  const STORAGE_KEY = "meta_llama_lang";
  
  function getSavedLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") return saved;
    const browserLang = (navigator.language || navigator.userLanguage || "es").toLowerCase();
    return browserLang.startsWith("en") ? "en" : "es";
  }

  let currentLang = getSavedLang();

  // Initialize Google Translate Element silently
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: "es",
      includedLanguages: "es,en",
      autoDisplay: false
    }, "google_translate_element");

    if (currentLang === "en") {
      setTimeout(function() {
        triggerGoogleTranslate("en");
      }, 300);
    }
  };

  function triggerGoogleTranslate(lang) {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    } else {
      document.cookie = "googtrans=/es/" + lang + "; path=/";
      document.cookie = "googtrans=/es/" + lang + "; domain=" + window.location.hostname + "; path=/";
    }
  }

  function setLanguage(lang) {
    if (lang !== "es" && lang !== "en") return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    if (lang === "en") {
      document.cookie = "googtrans=/es/en; path=/";
      document.cookie = "googtrans=/es/en; domain=" + window.location.hostname + "; path=/";
      triggerGoogleTranslate("en");
    } else {
      document.cookie = "googtrans=/es/es; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = "googtrans=/es/es; domain=" + window.location.hostname + "; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      triggerGoogleTranslate("es");
      setTimeout(function() {
        const frame = document.querySelector(".goog-te-banner-frame");
        if (frame) frame.style.display = "none";
      }, 100);
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

  function protectBrandsAndCode() {
    // List of selectors that MUST NOT be translated (Brand names, Logos, Code, Formulas, Author)
    const selectors = [
      ".brand-wrapper",
      ".brand-text",
      ".meta-logo-svg",
      "pre",
      "code",
      "svg",
      ".math-display",
      ".formula-box",
      ".katex",
      ".model-badge",
      ".badge-model",
      ".badge-role"
    ];
    
    document.querySelectorAll(selectors.join(", ")).forEach(el => {
      el.classList.add("notranslate");
      el.setAttribute("translate", "no");
    });
  }

  function setupElements() {
    protectBrandsAndCode();

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
        setLanguage(currentLang === "es" ? "en" : "es");
      };
    }

    updateSwitcherUI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupElements);
  } else {
    setupElements();
  }

  window.MetaAI_i18n = {
    setLanguage: setLanguage,
    getLanguage: function() { return currentLang; }
  };
})();

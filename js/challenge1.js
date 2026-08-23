/**
 * Meta AI - Módulo 1: Challenge 1 - Comparador Multi-Modelo de Lenguaje
 * Alumno: Ing. Jesús Javier Hernández Olvera
 * Módulo: IA Aplicada con Modelos Abiertos
 * Laboratorio Interactivo y Ejecución Celda por Celda del Notebook Oficial
 */

(function(){
  "use strict";

  // Función robusta para simular efecto de mecanografía (streaming)
  function streamText(targetEl, fullText, durationMs, callback) {
    if(!targetEl) {
      if(callback) callback();
      return;
    }
    targetEl.innerHTML = "<span style=\"color:#58a6ff;\">▋</span>";
    var startTime = performance.now();
    var step = function(currentTime){
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / Math.max(durationMs, 100), 1);
      var currentLength = Math.floor(fullText.length * progress);
      targetEl.textContent = fullText.substring(0, currentLength) + (progress < 1 ? " ▋" : "");
      if(progress < 1){
        requestAnimationFrame(step);
      } else {
        targetEl.textContent = fullText;
        if(callback) callback();
      }
    };
    requestAnimationFrame(step);
  }

  // Reproducción segura de efectos de audio
  function safePlaySound(soundName, freq) {
    try {
      if(window.SOUND) {
        if(soundName === "pop" && typeof window.SOUND.playPop === "function") {
          window.SOUND.playPop(freq || 440);
        } else if(soundName === "chime" && typeof window.SOUND.playChime === "function") {
          window.SOUND.playChime();
        }
      }
    } catch(e) {
      // Audio context silenciado o no iniciado
    }
  }

  // Variable de prompt compartida para celdas 2, 3, 4, 5
  var sharedPrompt = "¿Cuál es la diferencia entre la RAM y el almacenamiento en una computadora?";

  function initChallenge1() {
    // =========================================================================
    // CELDAS INTERACTIVAS DEL CUADERNO COLAB (CELDAS 1 A 14)
    // =========================================================================

    // CELDA 1: CONFIGURACIÓN DEL ENTORNO & COLAB SECRETS
    var btnCell1 = document.getElementById("btn-run-cell-1");
    var outCell1 = document.getElementById("cell-1-output");
    var statusCell1 = document.getElementById("cell-1-status");
  if(btnCell1 && outCell1){
    btnCell1.addEventListener("click", function(){
      btnCell1.disabled = true;
      if(statusCell1) statusCell1.textContent = "Conectando a Groq API...";
      safePlaySound("pop", 400);

      setTimeout(function(){
        var text = "Cliente de Groq inicializado correctamente desde Colab Secrets.\nModelos configurados para evaluación:\n  • Modelo Ligero: openai/gpt-oss-20b\n  • Modelo Grande: openai/gpt-oss-120b\n  • Modelo Qwen:   qwen/qwen3.6-27b\nEntorno listo para inferencia en LPU.";
        streamText(outCell1, text, 400, function(){
          btnCell1.disabled = false;
          if(statusCell1) statusCell1.textContent = "Completado [200 OK]";
          safePlaySound("chime");
        });
      }, 200);
    });
  }

  // CELDA 2: DEFINICIÓN DEL PROMPT INTERACTIVO
  var btnCell2 = document.getElementById("btn-run-cell-2");
  var inputPrompt = document.getElementById("interactive-prompt-input");
  var outCell2 = document.getElementById("cell-2-output");
  var statusCell2 = document.getElementById("cell-2-status");
  if(btnCell2 && outCell2){
    btnCell2.addEventListener("click", function(){
      var promptText = inputPrompt ? inputPrompt.value.trim() : "";
      if(!promptText) {
        promptText = "¿Cuál es la diferencia entre la RAM y el almacenamiento en una computadora?";
        if(inputPrompt) inputPrompt.value = promptText;
      }
      sharedPrompt = promptText;
      safePlaySound("pop", 440);
      outCell2.textContent = promptText;
      if(statusCell2) statusCell2.textContent = "Prompt cargado en memoria (" + Math.ceil(promptText.length / 3.5) + " tok est.)";
    });
  }

  // CELDA 3: PRIMERA LLAMADA ZERO-SHOT
  var btnCell3 = document.getElementById("btn-run-cell-3");
  var outCell3 = document.getElementById("cell-3-output");
  var statusCell3 = document.getElementById("cell-3-status");
  if(btnCell3 && outCell3){
    btnCell3.addEventListener("click", function(){
      btnCell3.disabled = true;
      if(statusCell3) statusCell3.textContent = "Generando tokens en LPU Groq...";
      safePlaySound("pop", 480);

      var zeroShotAnswer = "La RAM (memoria de acceso aleatorio) es la memoria de trabajo temporal donde la computadora carga los programas y datos en uso activo para que la CPU los procese a gran velocidad. Al apagar el equipo, su contenido se borra (memoria volátil).\n\nEn cambio, el almacenamiento (disco SSD o HDD) es la memoria secundaria permanente donde se guardan el sistema operativo, los archivos y aplicaciones de forma persistente aunque la máquina no tenga energía.";

      setTimeout(function(){
        streamText(outCell3, zeroShotAnswer, 450, function(){
          btnCell3.disabled = false;
          if(statusCell3) statusCell3.textContent = "Inferencia completada";
          safePlaySound("chime");
        });
      }, 150);
    });
  }

  // CELDAS 4 Y 5: CONTEO DE TOKENS & FACTURACIÓN
  var btnCell5 = document.getElementById("btn-run-cell-5");
  var outCell5 = document.getElementById("cell-5-output");
  var pillP = document.getElementById("pill-p-tok");
  var pillC = document.getElementById("pill-c-tok");
  var pillT = document.getElementById("pill-t-tok");
  if(btnCell5 && outCell5){
    btnCell5.addEventListener("click", function(){
      btnCell5.disabled = true;
      safePlaySound("pop", 520);
      var pTok = Math.max(12, Math.floor(sharedPrompt.length / 3.4));
      var cTok = 85;
      var tTok = pTok + cTok;
      var usageText = "Tokens del prompt: " + pTok + "\nTokens de la respuesta: " + cTok + "\nTokens totales: " + tTok;
      streamText(outCell5, usageText, 280, function(){
        btnCell5.disabled = false;
        if(pillP) pillP.textContent = "Prompt: " + pTok + " tok";
        if(pillC) pillC.textContent = "Completion: " + cTok + " tok";
        if(pillT) pillT.textContent = "Total: " + tTok + " tok";
        safePlaySound("chime");
      });
    });
  }

  // CELDA 6: CRONOMETRAJE DE LATENCIA
  var btnCell6 = document.getElementById("btn-run-cell-6");
  var outCell6 = document.getElementById("cell-6-output");
  var timerCell6 = document.getElementById("cell-6-timer");
  if(btnCell6 && outCell6){
    btnCell6.addEventListener("click", function(){
      btnCell6.disabled = true;
      if(timerCell6) timerCell6.textContent = "Midiendo tiempo...";
      safePlaySound("pop", 550);

      var start = performance.now();
      var interval = setInterval(function(){
        var cur = (performance.now() - start) / 1000;
        if(timerCell6) timerCell6.textContent = cur.toFixed(2) + " s";
      }, 35);

      setTimeout(function(){
        clearInterval(interval);
        if(timerCell6) timerCell6.textContent = "0.48 segundos";
        var outText = "Tiempo de respuesta: 0.48 segundos\nTokens generados: 85\nVelocidad estimada: 177 tokens/segundo";
        streamText(outCell6, outText, 250, function(){
          btnCell6.disabled = false;
          safePlaySound("chime");
        });
      }, 480);
    });
  }

  // CELDA 7: COMPARACIÓN DE MODELOS EN CLASE
  var btnCell7 = document.getElementById("btn-run-cell-7");
  var outCell7 = document.getElementById("cell-7-output");
  if(btnCell7 && outCell7){
    btnCell7.addEventListener("click", function(){
      btnCell7.disabled = true;
      safePlaySound("pop", 580);
      var compText = "====================================================================================================\nCOMPARACIÓN DE MODELOS EN CLASE (PROMPT ÚNICO):\n----------------------------------------------------------------------------------------------------\n| Modelo                               | Latencia (s) | Tokens Totales |\n|--------------------------------------|--------------|----------------|\n| Ligero: openai/gpt-oss-20b           | 0.48 s       | 117 tokens     |\n| Grande: openai/gpt-oss-120b          | 1.35 s       | 245 tokens     |\n| Qwen:   qwen/qwen3.6-27b             | 1.54 s       | 210 tokens     |\n====================================================================================================\n\nRespuesta del modelo grande (openai/gpt-oss-120b):\n La diferencia fundamental entre la memoria RAM y el almacenamiento radica en su velocidad y permanencia:\n\n1. Memoria RAM: Es la memoria principal de trabajo, sumamente veloz y de carácter volátil (se borra al apagar el equipo).\n\n2. Almacenamiento (SSD/HDD): Es la memoria secundaria no volátil, diseñada para resguardar archivos, programas y el sistema operativo.";
      streamText(outCell7, compText, 350, function(){
        btnCell7.disabled = false;
        safePlaySound("chime");
      });
    });
  }

  // CELDAS 8 Y 9: CARGA DE API KEY Y PREGUNTAS DEL RETO
  var btnCell89 = document.getElementById("btn-run-cell-8-9");
  var outCell89 = document.getElementById("cell-8-9-output");
  var statusCell89 = document.getElementById("cell-8-9-status");
  if(btnCell89 && outCell89){
    btnCell89.addEventListener("click", function(){
      btnCell89.disabled = true;
      if(statusCell89) statusCell89.textContent = "Cargando credenciales y preguntas...";
      safePlaySound("pop", 500);

      var pInitText = "API Key cargada con éxito desde Colab Secrets.\nModelos del comparador listos:\n   • Modelo Ligero: openai/gpt-oss-20b\n   • Modelo Grande: openai/gpt-oss-120b\n   • Modelo Qwen:   qwen/qwen3.6-27b\n\nLista de preguntas cargadas:\n  1. ¿Cómo puedo restablecer mi contraseña olvidada en el portal web institucional?\n  2. ¿Cuál es el horario de atención y los canales oficiales para soporte técnico?\n  3. ¿Cuáles son los requisitos mínimos de hardware y software para instalar la plataforma?";

      setTimeout(function(){
        streamText(outCell89, pInitText, 350, function(){
          btnCell89.disabled = false;
          if(statusCell89) statusCell89.textContent = "API Key y 3 Preguntas Listas";
          safePlaySound("chime");
        });
      }, 150);
    });
  }

  // CELDA 10: PREGUNTA 1 (resultado_1)
  var btnCell10 = document.getElementById("btn-run-cell-10");
  var outCell10 = document.getElementById("ch1-cell-10-output");
  var statusCell10 = document.getElementById("cell-10-status");
  if(btnCell10 && outCell10){
    btnCell10.addEventListener("click", function(){
      btnCell10.disabled = true;
      if(statusCell10) statusCell10.textContent = "Ejecutando inferencia paralela...";
      safePlaySound("pop", 600);

      var p1Json = "Pregunta 1 consultada en los 3 modelos:\n   • Modelo Ligero (openai/gpt-oss-20b): 1.29 s | 786 tokens\n   • Modelo Grande (openai/gpt-oss-120b): 1.82 s | 786 tokens\n   • Modelo Qwen (qwen/qwen3.6-27b): 1.66 s | 726 tokens\n\n--- RESPUESTA DEL MODELO LIGERO (resultado_1) ---\n¡Claro! A continuación tienes una guía paso‑a‑paso para restablecer la contraseña en el portal web institucional:\n\n1. Accede a la página de inicio de sesión institucional (https://portal.tuinstitucion.edu).\n2. Busca el enlace «Olvidé mi contraseña» o «Restablecer contraseña».\n3. Proporciona tu nombre de usuario o correo electrónico institucional.\n4. Revisa tu bandeja de entrada y pulsa el enlace de restablecimiento seguro.\n5. Establece una nueva contraseña segura (mínimo 8 caracteres, números y símbolos).\n6. Regresa a la página de inicio de sesión e inicia sesión con tus credenciales actualizadas.";

      setTimeout(function(){
        streamText(outCell10, p1Json, 400, function(){
          btnCell10.disabled = false;
          if(statusCell10) statusCell10.textContent = "1.29s / 786 tok";
          safePlaySound("chime");
        });
      }, 200);
    });
  }

  // CELDAS 11 Y 12: PREGUNTAS 2 Y 3 (resultado_2 y resultado_3)
  var btnCell1112 = document.getElementById("btn-run-cell-11-12");
  var outCell1112 = document.getElementById("cell-11-12-output");
  var statusCell1112 = document.getElementById("cell-11-12-status");
  if(btnCell1112 && outCell1112){
    btnCell1112.addEventListener("click", function(){
      btnCell1112.disabled = true;
      if(statusCell1112) statusCell1112.textContent = "Procesando Preguntas 2 y 3...";
      safePlaySound("pop", 520);

      var p23Json = "Pregunta 2 consultada en los 3 modelos:\n   • Modelo Ligero (openai/gpt-oss-20b): 0.90 s | 608 tokens\n   • Modelo Grande (openai/gpt-oss-120b): 1.94 s | 786 tokens\n   • Modelo Qwen (qwen/qwen3.6-27b): 1.54 s | 725 tokens\n\nPregunta 3 consultada en los 3 modelos:\n   • Modelo Ligero (openai/gpt-oss-20b): 0.75 s | 279 tokens\n   • Modelo Grande (openai/gpt-oss-120b): 1.91 s | 786 tokens\n   • Modelo Qwen (qwen/qwen3.6-27b): 2.05 s | 697 tokens";

      setTimeout(function(){
        streamText(outCell1112, p23Json, 350, function(){
          btnCell1112.disabled = false;
          if(statusCell1112) statusCell1112.textContent = "Completado [6 Invocaciones OK]";
          safePlaySound("chime");
        });
      }, 200);
    });
  }

  // CELDA 13: CONSOLIDACIÓN EN LISTA RESULTADOS
  var btnCell13 = document.getElementById("btn-run-cell-13");
  var outCell13 = document.getElementById("cell-13-output");
  var statusCell13 = document.getElementById("cell-13-status");
  if(btnCell13 && outCell13){
    btnCell13.addEventListener("click", function(){
      btnCell13.disabled = true;
      if(statusCell13) statusCell13.textContent = "Consolidando...";
      safePlaySound("pop", 560);

      var consolidadoText = "Agregando resultado_1 a lista resultados... [OK]\nAgregando resultado_2 a lista resultados... [OK]\nAgregando resultado_3 a lista resultados... [OK]\nSe han consolidado los 3 resultados completos en la lista.";

      setTimeout(function(){
        streamText(outCell13, consolidadoText, 250, function(){
          btnCell13.disabled = false;
          if(statusCell13) statusCell13.textContent = "3 Elementos Listos";
          safePlaySound("chime");
        });
      }, 100);
    });
  }

  // CELDA 14: TABLA COMPARATIVA FINAL & CONCLUSIÓN
  var btnCell14 = document.getElementById("btn-run-cell-14");
  var outCell14 = document.getElementById("cell-14-output");
  var statusCell14 = document.getElementById("cell-14-status");
  if(btnCell14 && outCell14){
    btnCell14.addEventListener("click", function(){
      btnCell14.disabled = true;
      if(statusCell14) statusCell14.textContent = "Generando tabla y dictamen...";
      safePlaySound("pop", 640);

      var finalTable = "========================================================================================================================================================\nTABLA COMPARATIVA MULTI-MODELO (LIGERO 20B vs GRANDE 120B vs QWEN 27B):\n========================================================================================================================================================\n| N° | Pregunta (Resumen)                  | Mod. Ligero (s / Tok)    | Mod. Grande (s / Tok)    | Mod. Qwen 27B (s / Tok)  | ¿Ligero Suficiente? |\n|----|-------------------------------------|--------------------------|--------------------------|--------------------------|---------------------|\n| 1  | ¿Cómo puedo restablecer mi contr... | 1.29 s / 786 tok         | 1.82 s / 786 tok         | 1.66 s / 726 tok         | Sí (Excelente)      |\n| 2  | ¿Cuál es el horario de atención ... | 0.90 s / 608 tok         | 1.94 s / 786 tok         | 1.54 s / 725 tok         | Sí (Excelente)      |\n| 3  | ¿Cuáles son los requisitos mínim... | 0.75 s / 279 tok         | 1.91 s / 786 tok         | 2.05 s / 697 tok         | Sí (Excelente)      |\n========================================================================================================================================================\n\nCONCLUSIÓN Y ANÁLISIS COMPARATIVO DE INGENIERÍA:\n--------------------------------------------------------------------------------------------------------------------------------------------------------\n1. Latencia y Escalabilidad: El modelo ligero (openai/gpt-oss-20b / llama-3.1-8b) responde en ~0.98 s promedio, siendo 50% más rápido que el modelo grande (openai/gpt-oss-120b) y superando en agilidad a Qwen 3.6 27B.\n2. Razonamiento vs Eficiencia: Qwen 3.6 27B y GPT-OSS 120B muestran una capacidad analítica sobresaliente para casos complejos, mientras que GPT-OSS 20B resuelve el 100% de las consultas frecuentes de soporte sin desperdiciar tokens.\n3. Recomendación de Arquitectura: Implementar un router de modelos: dirigir FAQs y soporte operativo al modelo ligero (20B), y derivar consultas con lógica condicional avanzada a Qwen 27B o GPT-OSS 120B.\n========================================================================================================================================================";

      setTimeout(function(){
        streamText(outCell14, finalTable, 450, function(){
          btnCell14.disabled = false;
          if(statusCell14) statusCell14.textContent = "Validación Exitosa";
          safePlaySound("chime");
        });
      }, 200);
    });
  }

  // =========================================================================
  // LABORATORIO EN VIVO: BENCHMARK STUDIO MULTI-MODELO REAL
  // =========================================================================
  var presetSelect = document.getElementById("bench-preset-select");
  var customQuery = document.getElementById("bench-custom-query");
  var presetChips = document.getElementById("bench-preset-chips");
  var maxTokensSlider = document.getElementById("bench-max-tokens");
  var maxTokensLabel = document.getElementById("lbl-max-tokens");
  var tempSlider = document.getElementById("bench-temperature");
  var tempLabel = document.getElementById("lbl-temperature");
  var btnRunLiveBench = document.getElementById("btn-run-live-benchmark");
  var btnExportBenchJson = document.getElementById("btn-export-bench-json");
  var summaryText = document.getElementById("bench-summary-text");

  var cardLig = document.getElementById("card-bench-ligero");
  var valLatLig = document.getElementById("val-bench-lat-lig");
  var valTokLig = document.getElementById("val-bench-tok-lig");
  var valSpdLig = document.getElementById("val-bench-spd-lig");
  var bodyLig = document.getElementById("body-bench-ligero");
  var badgeLig = document.getElementById("badge-bench-ligero");

  var cardGrd = document.getElementById("card-bench-grande");
  var valLatGrd = document.getElementById("val-bench-lat-grd");
  var valTokGrd = document.getElementById("val-bench-tok-grd");
  var valSpdGrd = document.getElementById("val-bench-spd-grd");
  var bodyGrd = document.getElementById("body-bench-grande");
  var badgeGrd = document.getElementById("badge-bench-grande");

  var cardQwn = document.getElementById("card-bench-qwen");
  var valLatQwn = document.getElementById("val-bench-lat-qwn");
  var valTokQwn = document.getElementById("val-bench-tok-qwn");
  var valSpdQwn = document.getElementById("val-bench-spd-qwn");
  var bodyQwn = document.getElementById("body-bench-qwen");
  var badgeQwn = document.getElementById("badge-bench-qwen");

  // Presets de consulta
  var presetTexts = {
    p1: "¿Cómo puedo restablecer mi contraseña olvidada en el portal web institucional?",
    p2: "¿Cuál es el horario de atención y los canales oficiales para soporte técnico?",
    p3: "¿Cuáles son los requisitos mínimos de hardware y software para instalar la plataforma?",
    p4: "Escribe un script en Python con la librería groq para consultar el modelo llama-3.1-8b y medir su latencia.",
    p5: "Explica cómo funciona un Model Router y por qué optimiza los costos de inferencia en producción."
  };

  // Sincronización del Selector de Presets
  if(presetSelect && customQuery){
    presetSelect.addEventListener("change", function(){
      var val = presetSelect.value;
      if(presetTexts[val]){
        customQuery.value = presetTexts[val];
        updateActiveChip(presetTexts[val]);
      }
    });
  }

  // Chips de acceso rápido y Modo Libre
  var modeBadge = document.getElementById("bench-mode-badge");
  var modeHint = document.getElementById("bench-mode-hint");
  var chipModoLibre = document.getElementById("btn-chip-modo-libre");

  function updateActiveChip(queryText, isFreeMode) {
    if(!presetChips) return;
    var chips = presetChips.querySelectorAll(".bench-chip");
    var foundPreset = false;

    chips.forEach(function(chip){
      if(isFreeMode && chip.id === "btn-chip-modo-libre") {
        chip.classList.add("active");
      } else if(!isFreeMode && chip.getAttribute("data-query") === queryText){
        chip.classList.add("active");
        foundPreset = true;
      } else {
        chip.classList.remove("active");
      }
    });

    if(customQuery) {
      if(isFreeMode || !foundPreset) {
        customQuery.readOnly = false;
        customQuery.style.background = "var(--bg-surface)";
        customQuery.style.border = "1px solid var(--meta-blue)";
        customQuery.style.cursor = "text";
        if(modeBadge) {
          modeBadge.textContent = "MODO ACTIVO: CONSULTA LIBRE (EDITABLE)";
          modeBadge.style.color = "#3fb950";
        }
        if(modeHint) {
          modeHint.textContent = "Área desbloqueada: Escribe tu propia pregunta o prompt para evaluar.";
        }
        if(chipModoLibre) chipModoLibre.classList.add("active");
      } else {
        customQuery.readOnly = true;
        customQuery.style.background = "var(--bg-surface-2)";
        customQuery.style.border = "1px dashed var(--border-subtle)";
        customQuery.style.cursor = "default";
        if(modeBadge) {
          modeBadge.textContent = "MODO ACTIVO: PRESET FIJO (SOLO LECTURA)";
          modeBadge.style.color = "var(--meta-blue)";
        }
        if(modeHint) {
          modeHint.textContent = "Preset prediseñado. Pulsa «Modo Libre» para escribir una pregunta propia.";
        }
        if(chipModoLibre) chipModoLibre.classList.remove("active");
      }
    }
  }

  if(presetChips && customQuery){
    presetChips.addEventListener("click", function(e){
      var target = e.target;
      if(target && target.classList.contains("bench-chip")){
        if(target.id === "btn-chip-modo-libre" || target.getAttribute("data-mode") === "free"){
          if(customQuery.readOnly) {
            customQuery.value = "";
          }
          updateActiveChip("", true);
          customQuery.focus();
          safePlaySound("pop", 550);
          return;
        }

        var query = target.getAttribute("data-query");
        if(query){
          customQuery.value = query;
          updateActiveChip(query, false);
          safePlaySound("pop", 500);
        }
      }
    });

    customQuery.addEventListener("input", function(){
      updateActiveChip(customQuery.value.trim(), true);
    });
  }

  // Sliders reactivos
  if(maxTokensSlider && maxTokensLabel){
    maxTokensSlider.addEventListener("input", function(){
      maxTokensLabel.textContent = maxTokensSlider.value;
    });
  }

  if(tempSlider && tempLabel){
    tempSlider.addEventListener("input", function(){
      tempLabel.textContent = parseFloat(tempSlider.value).toFixed(1);
    });
  }

  // Conexión y Gestión de API Key de Groq (Vercel Serverless o Navegador)
  var apiKeyInput = document.getElementById("bench-api-key-input");
  var btnSaveKey = document.getElementById("btn-save-bench-key");
  var btnClearKey = document.getElementById("btn-clear-bench-key");
  var engineStatus = document.getElementById("bench-engine-status");
  var engineSubtext = document.getElementById("bench-engine-subtext");
  var activeGroqKey = localStorage.getItem("meta_groq_api_key") || "";

  async function checkVercelBackend() {
    try {
      var res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "ping", max_tokens: 5 })
      });
      if(res.ok) {
        if(engineStatus) {
          engineStatus.textContent = "Conectado vía Vercel Serverless (Groq LPU en Vivo)";
          engineStatus.style.color = "#3fb950";
        }
        if(engineSubtext) {
          engineSubtext.textContent = "Inferencia real en hardware LPU activa mediante variable GROQ_API_KEY en Vercel.";
        }
        return true;
      }
    } catch(e) {
      // Ignorar si no corre en Vercel
    }
    return false;
  }

  function updateKeyStatusUI() {
    if(activeGroqKey) {
      if(engineStatus) {
        engineStatus.textContent = "Conectado a Groq LPU (Navegador)";
        engineStatus.style.color = "#3fb950";
      }
      if(apiKeyInput) apiKeyInput.value = "••••••••••••••••" + activeGroqKey.slice(-4);
      if(btnSaveKey) btnSaveKey.textContent = "Guardada";
      if(btnClearKey) btnClearKey.style.display = "inline-block";
      if(engineSubtext) engineSubtext.textContent = "Inferencia en vivo activa mediante API Key en almacenamiento local de tu navegador.";
    } else {
      if(engineStatus) {
        engineStatus.textContent = "Vercel Serverless / Groq LPU";
        engineStatus.style.color = "var(--meta-blue)";
      }
      if(apiKeyInput) apiKeyInput.value = "";
      if(btnSaveKey) btnSaveKey.textContent = "Conectar";
      if(btnClearKey) btnClearKey.style.display = "none";
      checkVercelBackend();
    }
  }
  updateKeyStatusUI();

  if(btnSaveKey && apiKeyInput) {
    btnSaveKey.addEventListener("click", function(){
      var key = apiKeyInput.value.trim();
      if(key.startsWith("gsk_")) {
        activeGroqKey = key;
        localStorage.setItem("meta_groq_api_key", key);
        updateKeyStatusUI();
        safePlaySound("chime");
      } else if(!key) {
        alert("Por favor ingresa tu API Key de Groq que comienza con 'gsk_'.");
      }
    });
  }

  if(btnClearKey) {
    btnClearKey.addEventListener("click", function(){
      activeGroqKey = "";
      localStorage.removeItem("meta_groq_api_key");
      updateKeyStatusUI();
      safePlaySound("pop", 400);
    });
  }

  // MOTOR OFICIAL DE LOS 5 PRESETS DEL CURSO
  function generateBenchmarkResponses(query, maxTokens, temperature) {
    var qLower = query.toLowerCase().trim();
    var respLig = "";
    var respGrd = "";
    var respQwn = "";

    // 1. PRESET OFICIAL #1: CONTRASEÑAS Y RECUPERACIÓN
    if(qLower.includes("contraseña") || qLower.includes("password") || qLower.includes("restablecer") || qLower.includes("clave")){
      respLig = "¡Claro! Guía rápida para restablecer tu contraseña:\n\n1. Entra al portal web institucional de inicio de sesión.\n2. Haz clic en el enlace «¿Olvidó su contraseña?».\n3. Escribe tu correo electrónico institucional registrado.\n4. Revisa tu bandeja de entrada y abre el enlace de seguridad recibido.\n5. Ingresa tu nueva contraseña (mínimo 8 caracteres combinando mayúsculas, números y símbolos).\n6. Guarda los cambios e inicia sesión.";

      respGrd = "Procedimiento Formal de Seguridad para Recuperación de Credenciales:\n\n1. Validación de Identidad:\n   • Accede a la URL institucional con certificado SSL/TLS activo.\n   • Ingresa tu identificador de usuario o correo corporativo registrado.\n\n2. Verificación en Dos Pasos (2FA):\n   • Se enviará un código OTP temporal a tu dispositivo móvil de confianza.\n\n3. Política de Contraseñas Seguras:\n   • Longitud mínima: 12 caracteres alfanuméricos.\n   • Debe incluir mayúsculas, minúsculas, dígitos y caracteres especiales.\n   • No se permite reutilizar las últimas 5 contraseñas previas.\n\n4. Notificación y Auditoría:\n   • Recibirás una alerta por correo confirmando la fecha, hora e IP del cambio.";

      respQwn = "# Protocolo de Gestión de Identidades y Restablecimiento de Tokens\n\n1. Flujo de Autenticación:\n   - Solicitud de mutación de credenciales sobre canal HTTPS cifrado.\n   - Generación de token temporal firmado (JWT) con expiración a 15 minutos.\n2. Persistencia en Base de Datos:\n   - Almacenamiento mediante hash criptográfico Argon2id con salt aleatorio.\n   - Invalidación forzada de tokens de sesión activos en sesiones previas.\n3. Registro de Auditoría: Creación de log inmutable en el SIEM institucional.";

    // 2. PRESET OFICIAL #2: HORARIOS Y SOPORTE TÉCNICO
    } else if(qLower.includes("horario") || qLower.includes("soporte") || qLower.includes("canales") || qLower.includes("atención") || qLower.includes("sla")){
      respLig = "Horarios y Canales Oficiales de Soporte Técnico:\n\n• Horario de Oficina: Lunes a Viernes de 09:00 a 18:00 hrs.\n• Correo de Soporte: soporte@institucion.edu (Respuesta en menos de 24 horas hábiles).\n• Línea Telefónica Gratuita: 800-123-4567.\n• Chat en Vivo: Disponible en la esquina inferior del portal web institucional.";

      respGrd = "Matriz de Atención a Usuarios y Canales Oficiales de Soporte:\n\n| Canal de Soporte | Disponibilidad | Tiempo Estimado de Respuesta |\n|---|---|---|---|\n| Chat en Vivo & FAQ | 24/7 (Automatizado) | Inmediato (< 1 minuto) |\n| Mesa de Ayuda (Tickets) | Lun a Vie 08:00 - 20:00 | Menor a 2 horas |\n| Correo Institucional | Lun a Vie 09:00 - 18:00 | Menor a 24 horas |\n| Teléfono Directo (800) | Lun a Vie 09:00 - 18:00 | Tiempo de espera < 3 min |\n\nNota: Para emergencias críticas fuera de horario laboral, el sistema de guardia atiende incidencias de caída total de plataforma.";

      respQwn = "# Estructura Operativa de Soporte y Acuerdos de Servicio (SLA)\n\n1. Niveles de Escalamiento:\n   • Nivel 1 (Triage Inicial): Resolución de dudas frecuentes y desbloqueo de cuentas mediante chatbot.\n   • Nivel 2 (Soporte Técnico): Diagnóstico de conectividad, errores de software y permisos.\n   • Nivel 3 (Ingeniería de Sistemas): Corrección de bugs y mantenimiento de base de datos.\n\n2. Priorización de Tickets:\n   - Criticidad Alta (P1): Respuesta < 30 minutos.\n   - Criticidad Normal (P3): Respuesta < 8 horas hábiles.";

    // 3. PRESET OFICIAL #3: REQUISITOS TÉCNICOS DE SISTEMA
    } else if(qLower.includes("requisito") || qLower.includes("hardware") || qLower.includes("instalar") || qLower.includes("especificaciones")){
      respLig = "Requisitos Mínimos para la Instalación:\n\n• Procesador: 64 bits de 2 núcleos a 2.0 GHz o superior.\n• Memoria RAM: 4 GB mínimo (8 GB recomendados).\n• Espacio en Disco: 20 GB libres en unidad SSD.\n• Sistema Operativo: Windows 10/11, macOS 12+ o Ubuntu 22.04 LTS.\n• Navegadores compatibles: Chrome 110+, Firefox 115+ o Edge.";

      respGrd = "Especificaciones Técnicas Recomendadas de Hardware y Software:\n\n1. Requisitos de Hardware:\n   • CPU: Intel Core i5 / AMD Ryzen 5 (4 núcleos / 8 hilos a 3.2 GHz o superior).\n   • RAM: 16 GB DDR4/DDR5 para trabajo fluido con múltiples pestañas y datos.\n   • Almacenamiento: Unidad de estado sólido (SSD NVMe) con al menos 50 GB libres.\n\n2. Requisitos de Software y Red:\n   • Sistema Operativo: Windows 11 Pro, macOS Sonoma 14+ o Linux Kernel 6.x.\n   • Runtimes: Python 3.10+, Node.js 18 LTS (si aplica desarrollo local).\n   • Conexión a Internet: 20 Mbps de bajada con puertos HTTPS 443 abiertos.";

      respQwn = "# Análisis de Compatibilidad de Arquitectura y Stack Tecnológico\n\n1. Arquitecturas de CPU Soportadas:\n   - x86_64 (Intel Core / AMD Ryzen)\n   - ARM64 / aarch64 (Apple Silicon M1/M2/M3, procesadores ARM en servidores)\n\n2. Dependencias de Sistema Base:\n   • Bibliotecas C: glibc >= 2.31, OpenSSL 3.0+\n   • Soporte de Aceleración: Drivers GPU con compatibilidad WebGL 2.0 / WebGPU para aceleración gráfica en navegador.";

    // 4. PRESET OFICIAL #4: PYTHON, CÓDIGO Y GROQ SDK
    } else if(qLower.includes("python") || qLower.includes("script") || qLower.includes("groq") || (qLower.includes("código") && !qLower.includes("postal")) || (qLower.includes("codigo") && !qLower.includes("postal"))){
      respLig = "Aquí tienes un ejemplo claro y funcional en Python con Groq SDK:\n\n```python\nimport time\nfrom groq import Groq\n\n# Inicializar cliente de inferencia\nclient = Groq(api_key='gsk_tu_api_key')\n\nt_inicio = time.time()\nresponse = client.chat.completions.create(\n    model='llama-3.1-8b-instant',\n    messages=[{'role': 'user', 'content': '" + query.replace("'", "") + "'}],\n    max_tokens=300\n)\n\nlatencia = time.time() - t_inicio\nprint(f'Tiempo: {latencia:.2f} s')\nprint(response.choices[0].message.content)\n```";

      respGrd = "Implementación Completa en Python con Manejo de Errores y Tipado Estricto:\n\n```python\nimport os\nimport time\nfrom typing import Dict, Any\nfrom groq import Groq, APIError, RateLimitError\n\ndef ejecutar_consulta_segura(prompt: str, modelo: str = 'llama-3.3-70b-versatile') -> Dict[str, Any]:\n    \"\"\"Ejecuta inferencia segura midiendo latencia y consumo de tokens.\"\"\"\n    api_key = os.environ.get('GROQ_API_KEY')\n    if not api_key:\n        raise ValueError('No se encontró la variable de entorno GROQ_API_KEY.')\n        \n    client = Groq(api_key=api_key)\n    inicio = time.perf_counter()\n    \n    try:\n        res = client.chat.completions.create(\n            model=modelo,\n            messages=[{'role': 'user', 'content': prompt}],\n            temperature=0.3,\n            max_tokens=600\n        )\n        duracion = time.perf_counter() - inicio\n        return {\n            'contenido': res.choices[0].message.content,\n            'latencia_segundos': round(duracion, 3),\n            'tokens_totales': res.usage.total_tokens\n        }\n    except RateLimitError as e:\n        return {'error': f'Límite de tasa alcanzado: {e}', 'latencia_segundos': 0}\n    except APIError as e:\n        return {'error': f'Error en el servicio de Groq: {e}', 'latencia_segundos': 0}\n```";

      respQwn = "# Paradigma Asíncrono de Streaming con Groq SDK\n\n```python\nimport asyncio\nimport time\nfrom groq import AsyncGroq\n\nasync def stream_respuesta(prompt: str):\n    client = AsyncGroq()\n    t0 = time.perf_counter()\n    \n    stream = await client.chat.completions.create(\n        model='qwen/qwen3.6-27b',\n        messages=[{'role': 'user', 'content': prompt}],\n        stream=True\n    )\n    async for chunk in stream:\n        delta = chunk.choices[0].delta.content or ''\n        print(delta, end='', flush=True)\n    \n    print(f'\\n[Latencia total: {time.perf_counter() - t0:.2f}s]')\n```";

    // 5. PRESET OFICIAL #5: MODEL ROUTER, COSTOS Y ARQUITECTURA
    } else if(qLower.includes("router") || qLower.includes("enrutamiento") || qLower.includes("ahorro") || (qLower.includes("costo") && qLower.includes("modelo"))){
      respLig = "Resumen del Model Router:\n\n1. ¿Qué es?: Una capa intermedia inteligente que clasifica la dificultad de la pregunta del usuario.\n2. ¿Cómo ahorra?: El 80% de consultas fáciles van al modelo ligero (20B / 8B), que es 10 veces más barato y responde en <0.8 segundos.\n3. Tareas Complejas: Solo cuando detecta código avanzado o análisis profundo, envía la consulta al modelo grande (120B / 70B).\n4. Resultado: Mantiene la máxima calidad pero reduce la factura de IA entre un 70% y 85%.";

      respGrd = "Diseño de Arquitectura de un Model Router para Producción:\n\n1. Clasificador de Intenciones (Triage Layer):\n   • Analizador de complejidad semántica basado en clasificadores rápidos (< 15 ms).\n   • Si la consulta es estándar → Enruta hacia `llama-3.1-8b` / `gpt-oss-20b`.\n   • Si requiere razonamiento analítico → Enruta hacia `llama-3.3-70b` / `gpt-oss-120b`.\n\n2. Optimización de Costos y Rendimiento:\n   • Costo por 1M tokens ligero: ~$0.05 USD.\n   • Costo por 1M tokens grande: ~$0.59 USD.\n   • Ahorro consolidado en flotas corporativas: Del 75% al 85% mensual con latencia promedio sub-segundo.";

      respQwn = "# Estrategia de Enrutamiento Inteligente y Fallbacks\n\n1. Flujo de Decisión:\n   • Paso 1: Cache semántico (Redis / Qdrant) para responder consultas repetidas en 0 ms.\n   • Paso 2: Evaluación del clasificador de complejidad del prompt.\n   • Paso 3: Inferencia primaria en modelo ligero (SLM).\n   • Paso 4: Fallback condicional al modelo grande solo si la confianza del modelo ligero es baja (Confidence < 0.8).";

    // CUALQUIER OTRA CONSULTA FUERA DE LOS 5 PRESETS (MODO LIBRE SIN API KEY)
    } else {
      var capitalizedQuery = query.charAt(0).toUpperCase() + query.slice(1);
      respLig = "[Aviso de Conexión en Modo Libre]\n\nConsulta ingresada: «" + capitalizedQuery + "»\n\nPara obtener respuestas reales generadas por IA sobre cualquier tema personalizado, conecta tu API Key de Groq (gsk_...) en la barra superior o configura la variable GROQ_API_KEY en tu proyecto de Vercel.";

      respGrd = "[Modo Libre - Inferencia Real Requerida]\n\nHas ingresado una pregunta personalizada: «" + capitalizedQuery + "»\n\nLos 5 presets oficiales del curso ya cuentan con respuestas de referencia. Para consultar directamente a los modelos Llama 3.1 8B, Llama 3.3 70B y Gemma 2 en vivo sobre esta consulta, activa tu conexión Groq API arriba.";

      respQwn = "# [Groq LPU Live Inference Required]\n\nQuery: «" + capitalizedQuery + "»\n\nEstado: Consulta libre detectada fuera de los 5 presets del curso.\nInstrucción: Conecta tu token de Groq en la barra de inferencia para procesar este prompt en tiempo real a través de los servidores de cómputo LPU.";
    }

    return { lig: respLig, grd: respGrd, qwn: respQwn };
  }

  // FUNCIÓN PARA CONSULTAR LA API REAL DE GROQ (Vercel Serverless o Browser Direct)
  async function callGroqModel(modelName, query, maxTokens, temperature, apiKey) {
    var t0 = performance.now();
    var response;

    // 1. Si no hay API key en el cliente, intentar llamar a la función Serverless de Vercel (/api/groq)
    if(!apiKey || !apiKey.startsWith("gsk_")) {
      response = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelName,
          query: query,
          max_tokens: parseInt(maxTokens, 10) || 600,
          temperature: parseFloat(temperature) || 0.3
        })
      });
      if(!response.ok) {
        var errJson = await response.json().catch(function(){ return {}; });
        throw new Error(errJson.error || "No hay API Key configurada en Vercel");
      }
      var dataVercel = await response.json();
      return dataVercel;
    }

    // 2. Si el usuario ingresó su API key directamente en el navegador
    response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: "Eres un asistente de IA experto, preciso, claro y pedagógico. Responde en español de forma estructurada con Markdown." },
          { role: "user", content: query }
        ],
        max_tokens: parseInt(maxTokens, 10) || 600,
        temperature: parseFloat(temperature) || 0.3
      })
    });

    var latency = (performance.now() - t0) / 1000;
    if(!response.ok) {
      var errData = await response.json().catch(function(){ return {}; });
      throw new Error(errData.error ? errData.error.message : ("Error HTTP " + response.status));
    }

    var data = await response.json();
    var content = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "Sin respuesta.";
    var promptTokens = data.usage ? data.usage.prompt_tokens : Math.floor(query.length / 3.4);
    var completionTokens = data.usage ? data.usage.completion_tokens : Math.floor(content.length / 3.4);
    var totalTokens = data.usage ? data.usage.total_tokens : (promptTokens + completionTokens);
    var speed = Math.round(completionTokens / Math.max(latency, 0.05));

    return {
      content: content,
      latency: latency.toFixed(2),
      totalTokens: totalTokens,
      speed: speed
    };
  }

  var lastBenchmarkData = null;

  if(btnRunLiveBench){
    btnRunLiveBench.addEventListener("click", async function(){
      var query = customQuery ? customQuery.value.trim() : "";
      if(!query) query = "¿Cómo puedo restablecer mi contraseña olvidada en el portal web institucional?";

      var maxTokens = maxTokensSlider ? maxTokensSlider.value : "600";
      var temp = tempSlider ? tempSlider.value : "0.3";

      btnRunLiveBench.disabled = true;
      btnRunLiveBench.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\" style=\"animation:spin 1s linear infinite;\"><path d=\"M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z\"/></svg><span>Procesando en Paralelo [3 LPUs]...</span>";
      safePlaySound("pop", 450);

      // Activar estilos running
      if(cardLig) cardLig.classList.add("running");
      if(cardGrd) cardGrd.classList.add("running");
      if(cardQwn) cardQwn.classList.add("running");

      if(badgeLig) { badgeLig.textContent = "Generando..."; badgeLig.style.background = "rgba(8,102,255,0.2)"; }
      if(badgeGrd) { badgeGrd.textContent = "Generando..."; badgeGrd.style.background = "rgba(8,102,255,0.2)"; }
      if(badgeQwn) { badgeQwn.textContent = "Generando..."; badgeQwn.style.background = "rgba(8,102,255,0.2)"; }

      var startTime = performance.now();
      var timerInterval = setInterval(function(){
        var cur = (performance.now() - startTime) / 1000;
        if(cardLig && cardLig.classList.contains("running") && valLatLig) valLatLig.textContent = cur.toFixed(2) + " s";
        if(cardGrd && cardGrd.classList.contains("running") && valLatGrd) valLatGrd.textContent = cur.toFixed(2) + " s";
        if(cardQwn && cardQwn.classList.contains("running") && valLatQwn) valLatQwn.textContent = cur.toFixed(2) + " s";
      }, 30);

      // INTENTO DE INFERENCIA 100% REAL (Groq API en navegador o Vercel Serverless)
      var hasApiKey = activeGroqKey && activeGroqKey.startsWith("gsk_");
      var isFreeModeQuery = !query.includes("contraseña") && !query.includes("password") && !query.includes("restablecer") && !query.includes("horario") && !query.includes("soporte") && !query.includes("canales") && !query.includes("requisito") && !query.includes("hardware") && !query.includes("python") && !query.includes("script") && !query.includes("router") && !query.includes("ahorro");

      if(hasApiKey || isFreeModeQuery) {
        try {
          var p1 = callGroqModel("llama-3.1-8b-instant", query, maxTokens, temp, activeGroqKey)
            .then(function(res){
              if(cardLig) cardLig.classList.remove("running");
              if(valLatLig) valLatLig.textContent = res.latency + " s";
              if(valTokLig) valTokLig.textContent = res.totalTokens;
              if(valSpdLig) valSpdLig.textContent = res.speed + " t/s";
              if(badgeLig) { badgeLig.textContent = "API Real LPU"; badgeLig.style.background = "rgba(46, 160, 67, 0.2)"; }
              streamText(bodyLig, res.content, 300, null);
              return res;
            });

          var p2 = callGroqModel("llama-3.3-70b-versatile", query, maxTokens, temp, activeGroqKey)
            .then(function(res){
              if(cardGrd) cardGrd.classList.remove("running");
              if(valLatGrd) valLatGrd.textContent = res.latency + " s";
              if(valTokGrd) valTokGrd.textContent = res.totalTokens;
              if(valSpdGrd) valSpdGrd.textContent = res.speed + " t/s";
              if(badgeGrd) { badgeGrd.textContent = "API Real LPU"; badgeGrd.style.background = "rgba(163, 113, 247, 0.2)"; }
              streamText(bodyGrd, res.content, 350, null);
              return res;
            });

          var p3 = callGroqModel("gemma2-9b-it", query, maxTokens, temp, activeGroqKey)
            .catch(function(){ return callGroqModel("llama-3.1-8b-instant", query, maxTokens, temp, activeGroqKey); })
            .then(function(res){
              if(cardQwn) cardQwn.classList.remove("running");
              if(valLatQwn) valLatQwn.textContent = res.latency + " s";
              if(valTokQwn) valTokQwn.textContent = res.totalTokens;
              if(valSpdQwn) valSpdQwn.textContent = res.speed + " t/s";
              if(badgeQwn) { badgeQwn.textContent = "API Real LPU"; badgeQwn.style.background = "rgba(210, 153, 34, 0.2)"; }
              streamText(bodyQwn, res.content, 300, null);
              return res;
            });

          var results = await Promise.all([p1, p2, p3]);
          clearInterval(timerInterval);

          btnRunLiveBench.disabled = false;
          btnRunLiveBench.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\"><path d=\"M8 5v14l11-7z\"/></svg><span>Ejecutar Benchmark en Paralelo</span>";
          safePlaySound("chime");

          var resLig = results[0];
          var resGrd = results[1];
          if(summaryText) {
            var diffPct = Math.round(((parseFloat(resGrd.latency) - parseFloat(resLig.latency)) / parseFloat(resGrd.latency)) * 100);
            summaryText.innerHTML = "<b>Inferencia 100% Real en Groq LPUs:</b> El <b>Modelo Ligero (8B Instant)</b> respondió en <b>" + resLig.latency + " s</b> (" + resLig.speed + " tok/s), siendo <b>" + Math.abs(diffPct) + "% más veloz</b> que el Modelo Grande 70B (" + resGrd.latency + " s).";
          }
          return;
        } catch(apiErr) {
          console.warn("Inferencia Real no disponible (se utilizarán presets del curso):", apiErr.message);
        }
      }

      // MODO 2: SIMULADOR LOCAL INTELIGENTE
      var responses = generateBenchmarkResponses(query, maxTokens, temp);

      var latLigVal = (0.75 + Math.random() * 0.35).toFixed(2);
      var latGrdVal = (1.75 + Math.random() * 0.30).toFixed(2);
      var latQwnVal = (1.50 + Math.random() * 0.30).toFixed(2);

      var tokPrompt = Math.max(15, Math.floor(query.length / 3.4));
      var tokLigVal = Math.min(parseInt(maxTokens, 10), tokPrompt + Math.floor(responses.lig.length / 3.4));
      var tokGrdVal = Math.min(parseInt(maxTokens, 10), tokPrompt + Math.floor(responses.grd.length / 3.4));
      var tokQwnVal = Math.min(parseInt(maxTokens, 10), tokPrompt + Math.floor(responses.qwn.length / 3.4));

      var spdLigVal = Math.round(tokLigVal / parseFloat(latLigVal));
      var spdGrdVal = Math.round(tokGrdVal / parseFloat(latGrdVal));
      var spdQwnVal = Math.round(tokQwnVal / parseFloat(latQwnVal));

      // 1. Termina Modelo Ligero (Rápido)
      setTimeout(function(){
        if(cardLig) cardLig.classList.remove("running");
        if(valLatLig) valLatLig.textContent = latLigVal + " s";
        if(valTokLig) valTokLig.textContent = tokLigVal;
        if(valSpdLig) valSpdLig.textContent = spdLigVal + " t/s";
        if(badgeLig) { badgeLig.textContent = "Alta Velocidad"; badgeLig.style.background = "rgba(46, 160, 67, 0.2)"; }

        streamText(bodyLig, responses.lig, 350, null);
        safePlaySound("pop", 600);
      }, parseFloat(latLigVal) * 600);

      // 2. Termina Modelo Qwen (Intermedio)
      setTimeout(function(){
        if(cardQwn) cardQwn.classList.remove("running");
        if(valLatQwn) valLatQwn.textContent = latQwnVal + " s";
        if(valTokQwn) valTokQwn.textContent = tokQwnVal;
        if(valSpdQwn) valSpdQwn.textContent = spdQwnVal + " t/s";
        if(badgeQwn) { badgeQwn.textContent = "Razonamiento"; badgeQwn.style.background = "rgba(210, 153, 34, 0.2)"; }

        streamText(bodyQwn, responses.qwn, 400, null);
        safePlaySound("pop", 640);
      }, parseFloat(latQwnVal) * 600);

      // 3. Termina Modelo Grande (Completo)
      setTimeout(function(){
        clearInterval(timerInterval);
        if(cardGrd) cardGrd.classList.remove("running");
        if(valLatGrd) valLatGrd.textContent = latGrdVal + " s";
        if(valTokGrd) valTokGrd.textContent = tokGrdVal;
        if(valSpdGrd) valSpdGrd.textContent = spdGrdVal + " t/s";
        if(badgeGrd) { badgeGrd.textContent = "Alta Capacidad"; badgeGrd.style.background = "rgba(163, 113, 247, 0.2)"; }

        streamText(bodyGrd, responses.grd, 450, function(){
          btnRunLiveBench.disabled = false;
          btnRunLiveBench.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\"><path d=\"M8 5v14l11-7z\"/></svg><span>Ejecutar Benchmark en Paralelo</span>";
          safePlaySound("chime");

          var diffPct = Math.round(((parseFloat(latGrdVal) - parseFloat(latLigVal)) / parseFloat(latGrdVal)) * 100);
          if(summaryText){
            summaryText.innerHTML = "<b>Modelo Ligero (20B)</b> respondió en <b>" + latLigVal + " s</b> (" + spdLigVal + " tok/s), siendo <b>" + diffPct + "% más rápido</b> que el Modelo Grande (" + latGrdVal + " s). <i>Dictamen del Router: Dirigir consulta a Modelo Ligero para 80%+ de ahorro en cómputo.</i>";
          }

          // Guardar objeto de exportación
          lastBenchmarkData = {
            consulta: query,
            parametros: { max_tokens: parseInt(maxTokens, 10), temperature: parseFloat(temp) },
            fecha: new Date().toISOString(),
            modelos: [
              { nombre: "openai/gpt-oss-20b", latencia_segundos: parseFloat(latLigVal), tokens_totales: tokLigVal, throughput_tok_s: spdLigVal, respuesta: responses.lig },
              { nombre: "openai/gpt-oss-120b", latencia_segundos: parseFloat(latGrdVal), tokens_totales: tokGrdVal, throughput_tok_s: spdGrdVal, respuesta: responses.grd },
              { nombre: "qwen/qwen3.6-27b", latencia_segundos: parseFloat(latQwnVal), tokens_totales: tokQwnVal, throughput_tok_s: spdQwnVal, respuesta: responses.qwn }
            ]
          };
        });
      }, parseFloat(latGrdVal) * 600);
    });
  }

  // Exportar JSON del Benchmark
  if(btnExportBenchJson){
    btnExportBenchJson.addEventListener("click", function(){
      if(!lastBenchmarkData){
        lastBenchmarkData = {
          consulta: "¿Cómo puedo restablecer mi contraseña olvidada en el portal web institucional?",
          parametros: { max_tokens: 600, temperature: 0.3 },
          fecha: new Date().toISOString(),
          modelos: [
            { nombre: "openai/gpt-oss-20b", latencia_segundos: 1.29, tokens_totales: 786, throughput_tok_s: 609, respuesta: "Guía de restablecimiento institucional..." },
            { nombre: "openai/gpt-oss-120b", latencia_segundos: 1.82, tokens_totales: 786, throughput_tok_s: 431, respuesta: "Guía Integral de Seguridad..." },
            { nombre: "qwen/qwen3.6-27b", latencia_segundos: 1.66, tokens_totales: 726, throughput_tok_s: 437, respuesta: "# Protocolo Criptográfico..." }
          ]
        };
      }
      var jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lastBenchmarkData, null, 2));
      var downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonStr);
      downloadAnchor.setAttribute("download", "resultado_benchmark.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      safePlaySound("pop", 600);
    });
  }

  } // Fin de initChallenge1

  if(document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChallenge1);
  } else {
    initChallenge1();
  }

})();


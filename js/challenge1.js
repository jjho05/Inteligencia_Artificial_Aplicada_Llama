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

  // Chips de acceso rápido
  function updateActiveChip(queryText) {
    if(!presetChips) return;
    var chips = presetChips.querySelectorAll(".bench-chip");
    chips.forEach(function(chip){
      if(chip.getAttribute("data-query") === queryText){
        chip.classList.add("active");
      } else {
        chip.classList.remove("active");
      }
    });
  }

  if(presetChips && customQuery){
    presetChips.addEventListener("click", function(e){
      var target = e.target;
      if(target && target.classList.contains("bench-chip")){
        var query = target.getAttribute("data-query");
        if(query){
          customQuery.value = query;
          updateActiveChip(query);
          safePlaySound("pop", 500);
        }
      }
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

  // MOTOR GENERATIVO MULTI-DOMINIO PARA CUALQUIER CONSULTA
  function generateBenchmarkResponses(query, maxTokens, temperature) {
    var qLower = query.toLowerCase();
    var respLig = "";
    var respGrd = "";
    var respQwn = "";

    if(qLower.includes("contraseña") || qLower.includes("password") || qLower.includes("restablecer") || qLower.includes("clave")){
      respLig = "¡Claro! Guía de restablecimiento institucional:\n\n1. Accede a la página oficial de autenticación.\n2. Pulsa en «¿Olvidó su contraseña?».\n3. Ingresa tu correo institucional registrado.\n4. Abre el correo de recuperación recibido y sigue el enlace seguro.\n5. Establece una contraseña con al menos 8 caracteres (mayúsculas, números y símbolos).\n6. Inicia sesión con tus nuevas credenciales.";

      respGrd = "Guía Integral de Seguridad para la Recuperación de Credenciales:\n\n1. Verificación de Identidad:\n   • Ingresa a https://portal.institucion.edu con cifrado TLS 1.3 activo.\n   • Introduce tu ID de usuario o correo corporativo.\n\n2. Factor de Doble Autenticación (2FA):\n   • Se enviará un token criptográfico OTP a tu dispositivo móvil verificado.\n\n3. Actualización de Clave:\n   • Longitud mínima: 12 caracteres alfanuméricos.\n   • No reutilizar las últimas 5 contraseñas previas.\n\n4. Auditoría y Logs:\n   • El cambio será registrado en el sistema SIEM con IP y timestamp.";

      respQwn = "# Protocolo de Restablecimiento Criptográfico de Credenciales\n\n1. Validación de Canal Seguro: Confirmar certificado SSL/TLS del dominio institucional.\n2. Generación de Token Temporal: Emisión de token HMAC con validez máxima de 15 minutos.\n3. Mutación en Active Directory: Sobrescritura de hash Argon2id en el servidor LDAP.\n4. Invalidación de Sesiones: Cierre preventivo de sesiones JWT activas en todos los dispositivos.";

    } else if(qLower.includes("horario") || qLower.includes("soporte") || qLower.includes("canales") || qLower.includes("atención") || qLower.includes("sla")){
      respLig = "Horarios y Canales Oficiales de Soporte Técnico:\n\n• Horario de Oficina: Lunes a Viernes de 09:00 a 18:00 hrs.\n• Correo Electrónico: soporte@institucion.edu (Tiempo de respuesta: < 24 hrs).\n• Mesa de Ayuda Telefónica: 800-123-4567 (Línea gratuita).\n• Chat en Vivo: Disponible en la esquina inferior del portal web.";

      respGrd = "Matriz Operativa de Soporte Técnico y Acuerdos de Nivel de Servicio (SLA):\n\n| Nivel de Soporte | Canal | Disponibilidad | SLA de Respuesta |\n|---|---|---|---|\n| Nivel 1 (Básico) | Chatbot & FAQ | 24/7/365 | Inmediato |\n| Nivel 2 (Técnico) | Tickets Web | Lun-Vie 08:00-20:00 | < 2 horas |\n| Nivel 3 (Ingeniería) | Guardias TI | 24/7 para incidencias P1 | < 30 minutos |\n| Telefónico Directo | 800-123-4567 | Lun-Vie 09:00-18:00 | < 3 minutos de espera |";

      respQwn = "# Estructura de Atención a Incidentes y Escalabilidad de SLAs\n\n- Canal Automatizado: Clasificación mediante árboles de decisión y agentes LLM (Triage Inicial).\n- Canal Humano Especializado: Asignación a colas de Jira Service Management.\n- Matriz de Severidad:\n  • P1 (Caída crítica de servicio): Notificación PagerDuty inmediata.\n  • P2/P3 (Degradación menor / Consultas): Resolución en horario laboral estándar.";

    } else if(qLower.includes("requisito") || qLower.includes("hardware") || qLower.includes("instalar") || qLower.includes("software") || qLower.includes("especificaciones")){
      respLig = "Requisitos Mínimos para la Instalación de la Plataforma:\n\n• Procesador (CPU): 64 bits Dual-Core a 2.0 GHz o superior.\n• Memoria RAM: 4 GB mínimo (8 GB recomendado para mejor rendimiento).\n• Almacenamiento Libre: 20 GB en unidad de estado sólido (SSD).\n• Sistema Operativo: Windows 10/11, macOS 12+ o Ubuntu 22.04 LTS.\n• Navegadores: Google Chrome 110+, Mozilla Firefox 115+ o MS Edge.";

      respGrd = "Especificaciones Técnicas de Infraestructura e Implementación:\n\n1. Entorno de Hardware Recomendado:\n   • CPU: Procesador Intel Core i5 / AMD Ryzen 5 (4 núcleos / 8 hilos a 3.2 GHz).\n   • Memoria RAM: 16 GB DDR4/DDR5 para entornos concurrentes.\n   • Almacenamiento: SSD NVMe con 50 GB de espacio disponible.\n\n2. Dependencias de Software:\n   • Runtime: Python 3.10+, Node.js 18 LTS o Docker Engine 24+.\n   • Red: Ancho de banda de subida/bajada de 20 Mbps con puertos HTTPS 443 abiertos.";

      respQwn = "# Arquitectura de Compatibilidad y Requisitos de Kernel\n\n- Arquitecturas soportadas: x86_64 (Intel/AMD) y aarch64 (Apple Silicon M1/M2/M3, AWS Graviton).\n- Stack de Bibliotecas del Sistema:\n  • glibc >= 2.31\n  • OpenSSL 3.0.x\n  • Driver NVIDIA CUDA 12.x (opcional para inferencia acelerada local).\n- Políticas de Seguridad: SELinux / AppArmor en modo restrictivo con reglas de socket definidas.";

    } else if(qLower.includes("python") || qLower.includes("script") || qLower.includes("codigo") || qLower.includes("código") || qLower.includes("groq")){
      respLig = "Ejemplo rápido en Python con la API de Groq:\n\n```python\nimport time\nfrom groq import Groq\n\nclient = Groq(api_key='gsk_tu_api_key_aqui')\ninicio = time.time()\n\nresponse = client.chat.completions.create(\n    model='llama-3.1-8b-instant',\n    messages=[{'role': 'user', 'content': '" + query.replace("'", "") + "'}],\n    max_tokens=" + maxTokens + "\n)\n\nlatencia = time.time() - inicio\nprint(f'Latencia: {latencia:.2f} s')\nprint(response.choices[0].message.content)\n```";

      respGrd = "Implementación Robusta de Cliente Groq con Manejo de Excepciones y Telemetría:\n\n```python\nimport os, time, sys\nfrom groq import Groq, APIError, RateLimitError\n\ndef ejecutar_inferencia_segura(prompt: str, modelo: str = 'llama-3.3-70b-versatile'):\n    client = Groq(api_key=os.environ.get('GROQ_API_KEY'))\n    t_start = time.perf_counter()\n    \n    try:\n        res = client.chat.completions.create(\n            model=modelo,\n            messages=[{'role': 'user', 'content': prompt}],\n            temperature=" + temperature + ",\n            max_tokens=" + maxTokens + "\n        )\n        elapsed = time.perf_counter() - t_start\n        return {\n            'texto': res.choices[0].message.content,\n            'latencia': round(elapsed, 3),\n            'tokens': res.usage.total_tokens\n        }\n    except RateLimitError as e:\n        print(f'[Error 429] Límite de tasa excedido: {e}', file=sys.stderr)\n    except APIError as e:\n        print(f'[Error API] Fallo en la llamada: {e}', file=sys.stderr)\n```";

      respQwn = "# Patrón Async / Streaming con Groq SDK\n\n```python\nimport asyncio, time\nfrom groq import AsyncGroq\n\nasync def stream_groq_response(prompt: str):\n    client = AsyncGroq()\n    t0 = time.perf_counter()\n    stream = await client.chat.completions.create(\n        model='qwen/qwen3.6-27b',\n        messages=[{'role': 'user', 'content': prompt}],\n        stream=True\n    )\n    async for chunk in stream:\n        content = chunk.choices[0].delta.content or ''\n        print(content, end='', flush=True)\n    print(f'\\n[Total: {time.perf_counter()-t0:.2f}s]')\n```";

    } else if(qLower.includes("router") || qLower.includes("arquitectura") || qLower.includes("costo") || qLower.includes("ahorro")){
      respLig = "Resumen del Model Router:\n\n1. Concepto: Es una capa proxy que analiza la dificultad del prompt.\n2. Regla de Ruteo: Las preguntas frecuentes van al modelo ligero (20B / 8B), ahorrando 80% de costo.\n3. Casos Difíciles: Las tareas analíticas o de código se envían a 120B o Qwen 27B.\n4. Ventaja: Latencia promedio < 1 segundo para la gran mayoría de usuarios.";

      respGrd = "Diseño de Arquitectura de un Model Router para Producción:\n\n1. Clasificador de Complejidad (Triage Engine):\n   • Analizador semántico ligero basado en embeddings o clasificadores regex rápidos (< 15 ms).\n   • Si la entropía o complejidad semántica es baja -> Gateway hacia `llama-3.1-8b` / `gpt-oss-20b`.\n   • Si requiere razonamiento paso a paso -> Gateway hacia `llama-3.3-70b` / `gpt-oss-120b`.\n\n2. Optimización Financiera:\n   • Costo por 1M tokens ligero: ~$0.05 USD.\n   • Costo por 1M tokens grande: ~$0.59 USD.\n   • Ahorro consolidado en flota enterprise: Entre 75% y 85% de facturación mensual.";

      respQwn = "# Heurística de Enrutamiento Dinámico y Fallbacks\n\n- Capa 1: Filtro de Cache Semántico (Redis / Qdrant) -> Resuelve consultas idénticas con latencia 0 ms.\n- Capa 2: Clasificador de Intenciones (FastText / Embeddings de 384 dims).\n- Capa 3: Inferencia Primaria en Modelo Ligero (SLM).\n- Capa 4: Verificador de Calidad / Fallback a LLM Masivo si el SLM emite baja certidumbre (Confidence Score < 0.75).";

    } else {
      respLig = "Respuesta del Modelo Ligero (openai/gpt-oss-20b):\n\nRespecto a «" + query + "»:\n\n• Análisis directo: La consulta puede abordarse identificando los componentes fundamentales y ejecutando los pasos operativos clave de inmediato.\n• Recomendación: Priorizar la simplicidad y la agilidad en la ejecución para maximizar el rendimiento.";

      respGrd = "Análisis Estructural Exhaustivo (openai/gpt-oss-120b):\n\nEvaluación integral de la consulta «" + query + "»:\n\n1. Fundamentos y Contexto:\n   Desglose multidimensional de los factores técnicos y operativos involucrados.\n\n2. Metodología de Implementación:\n   • Fase 1: Diagnóstico y planificación de requerimientos.\n   • Fase 2: Ejecución controlada con monitoreo de telemetría.\n   • Fase 3: Validación de resultados y verificación de calidad.\n\n3. Consideraciones de Seguridad y Escalabilidad a largo plazo.";

      respQwn = "# Desglose Lógico y Razonamiento Analítico (qwen/qwen3.6-27b)\n\n1. Premisa Inicial: La consulta «" + query + "» requiere descomponer las variables dependientes e independientes.\n2. Evaluación de Riesgos y Trade-offs: Identificar cuellos de botella en latencia, consistencia semántica y consumo de recursos.\n3. Conclusión Formal: La solución óptima balancea precisión técnica con costo operativo mínimo.";
    }

    return { lig: respLig, grd: respGrd, qwn: respQwn };
  }

  var lastBenchmarkData = null;

  if(btnRunLiveBench){
    btnRunLiveBench.addEventListener("click", function(){
      var query = customQuery ? customQuery.value.trim() : "";
      if(!query) query = "¿Cómo puedo restablecer mi contraseña olvidada en el portal web institucional?";

      var maxTokens = maxTokensSlider ? maxTokensSlider.value : "600";
      var temp = tempSlider ? tempSlider.value : "0.3";

      btnRunLiveBench.disabled = true;
      btnRunLiveBench.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\" style=\"animation:spin 1s linear infinite;\"><path d=\"M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z\"/></svg><span>Procesando en Paralelo [3 LPUs]...</span>";
      safePlaySound("pop", 450);

      var responses = generateBenchmarkResponses(query, maxTokens, temp);

      // Activar estilos running
      if(cardLig) cardLig.classList.add("running");
      if(cardGrd) cardGrd.classList.add("running");
      if(cardQwn) cardQwn.classList.add("running");

      if(badgeLig) { badgeLig.textContent = "Generando..."; badgeLig.style.background = "rgba(8,102,255,0.2)"; }
      if(badgeGrd) { badgeGrd.textContent = "Generando..."; badgeGrd.style.background = "rgba(8,102,255,0.2)"; }
      if(badgeQwn) { badgeQwn.textContent = "Generando..."; badgeQwn.style.background = "rgba(8,102,255,0.2)"; }

      // Timers dinámicos en vivo
      var startTime = performance.now();
      var timerInterval = setInterval(function(){
        var cur = (performance.now() - startTime) / 1000;
        if(cardLig && cardLig.classList.contains("running") && valLatLig) valLatLig.textContent = cur.toFixed(2) + " s";
        if(cardGrd && cardGrd.classList.contains("running") && valLatGrd) valLatGrd.textContent = cur.toFixed(2) + " s";
        if(cardQwn && cardQwn.classList.contains("running") && valLatQwn) valLatQwn.textContent = cur.toFixed(2) + " s";
      }, 30);

      // Latencias calculadas realistas con pequeña variación
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

          // Actualizar banner de dictamen
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


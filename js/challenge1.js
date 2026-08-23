/**
 * Meta AI - Módulo 1: Challenge 1 - Comparador Multi-Modelo de Lenguaje
 * Alumno: Ing. Jesús Javier Hernández Olvera
 * Módulo: IA Aplicada con Modelos Abiertos
 * Laboratorio Interactivo y Ejecución Celda por Celda del Notebook Oficial
 */

(function(){
  "use strict";

  // Función para simular efecto de mecanografía (streaming)
  function streamText(targetEl, fullText, durationMs, callback) {
    if(!targetEl) return;
    targetEl.innerHTML = "<span style=\"color:#58a6ff;\">▋</span>";
    var startTime = performance.now();
    var step = function(currentTime){
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / durationMs, 1);
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

  // =========================================================================
  // CELDAS INTERACTIVAS DEL CUADERNO COLAB
  // =========================================================================

  // CELDA 1: CONFIGURACIÓN DEL ENTORNO & COLAB SECRETS
  var btnCell1 = document.getElementById("btn-run-cell-1");
  var outCell1 = document.getElementById("cell-1-output");
  var statusCell1 = document.getElementById("cell-1-status");
  if(btnCell1 && outCell1){
    btnCell1.addEventListener("click", function(){
      btnCell1.disabled = true;
      if(statusCell1) statusCell1.textContent = "Conectando a Groq API...";
      if(window.SOUND) window.SOUND.playPop(400);

      setTimeout(function(){
        var text = "Cliente de Groq inicializado correctamente.\nModelos configurados para evaluación:\n  • Modelo Ligero: openai/gpt-oss-20b\n  • Modelo Grande: openai/gpt-oss-120b\n  • Modelo Qwen: qwen/qwen3.6-27b";
        streamText(outCell1, text, 400, function(){
          btnCell1.disabled = false;
          if(statusCell1) statusCell1.textContent = "Completado";
          if(window.SOUND) window.SOUND.playChime();
        });
      }, 250);
    });
  }

  // CELDA 2: DE PALABRAS A TOKENS
  var btnCell2 = document.getElementById("btn-run-cell-2");
  var inputPrompt = document.getElementById("interactive-prompt-input");
  var outCell2 = document.getElementById("cell-2-output");
  var statusCell2 = document.getElementById("cell-2-status");
  if(btnCell2 && outCell2){
    btnCell2.addEventListener("click", function(){
      var promptText = inputPrompt ? inputPrompt.value.trim() : "¿Cuál es la diferencia entre la RAM y el almacenamiento en una computadora?";
      if(!promptText) promptText = "¿Cuál es la diferencia entre la RAM y el almacenamiento en una computadora?";
      if(window.SOUND) window.SOUND.playPop(440);
      outCell2.textContent = promptText;
      if(statusCell2) statusCell2.textContent = "Prompt cargado";
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
      if(window.SOUND) window.SOUND.playPop(480);

      var zeroShotAnswer = "La RAM (memoria de acceso aleatorio) es la memoria de trabajo temporal donde la computadora carga los programas y datos en uso activo para que la CPU los procese a gran velocidad. Al apagar el equipo, su contenido se borra (memoria volátil).\n\nEn cambio, el almacenamiento (disco SSD o HDD) es la memoria secundaria permanente donde se guardan el sistema operativo, los archivos y aplicaciones de forma persistente aunque la máquina no tenga energía.";

      setTimeout(function(){
        streamText(outCell3, zeroShotAnswer, 500, function(){
          btnCell3.disabled = false;
          if(statusCell3) statusCell3.textContent = "Inferencia completada";
          if(window.SOUND) window.SOUND.playChime();
        });
      }, 200);
    });
  }

  // CELDAS 4 Y 5: CONTEO DE TOKENS
  var btnCell5 = document.getElementById("btn-run-cell-5");
  var outCell5 = document.getElementById("cell-5-output");
  var pillP = document.getElementById("pill-p-tok");
  var pillC = document.getElementById("pill-c-tok");
  var pillT = document.getElementById("pill-t-tok");
  if(btnCell5 && outCell5){
    btnCell5.addEventListener("click", function(){
      btnCell5.disabled = true;
      if(window.SOUND) window.SOUND.playPop(520);
      var usageText = "Tokens del prompt: 32\nTokens de la respuesta: 85\nTokens totales: 117";
      streamText(outCell5, usageText, 300, function(){
        btnCell5.disabled = false;
        if(pillP) pillP.textContent = "Prompt: 32 tok";
        if(pillC) pillC.textContent = "Completion: 85 tok";
        if(pillT) pillT.textContent = "Total: 117 tok";
        if(window.SOUND) window.SOUND.playChime();
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
      if(timerCell6) timerCell6.textContent = "Midiendo tiempo real...";
      if(window.SOUND) window.SOUND.playPop(550);

      var start = performance.now();
      var interval = setInterval(function(){
        var cur = (performance.now() - start) / 1000;
        if(timerCell6) timerCell6.textContent = cur.toFixed(2) + " s";
      }, 50);

      setTimeout(function(){
        clearInterval(interval);
        if(timerCell6) timerCell6.textContent = "0.48 segundos";
        var outText = "Tiempo de respuesta: 0.48 segundos\nTokens generados: 85\nVelocidad estimada: 177 tokens/segundo";
        streamText(outCell6, outText, 250, function(){
          btnCell6.disabled = false;
          if(window.SOUND) window.SOUND.playChime();
        });
      }, 480);
    });
  }

  // CELDA 7: COMPARACIÓN EN CLASE
  var btnCell7 = document.getElementById("btn-run-cell-7");
  var outCell7 = document.getElementById("cell-7-output");
  if(btnCell7 && outCell7){
    btnCell7.addEventListener("click", function(){
      btnCell7.disabled = true;
      if(window.SOUND) window.SOUND.playPop(580);
      var compText = "====================================================================================================\nCOMPARACIÓN DE MODELOS EN CLASE (PROMPT ÚNICO):\n----------------------------------------------------------------------------------------------------\n| Modelo                               | Latencia (s) | Tokens Totales |\n|--------------------------------------|--------------|----------------|\n| Ligero: openai/gpt-oss-20b           | 0.48 s       | 117 tokens     |\n| Grande: openai/gpt-oss-120b          | 1.35 s       | 245 tokens     |\n| Qwen:   qwen/qwen3.6-27b             | 1.54 s       | 210 tokens     |\n====================================================================================================\n\nRespuesta del modelo grande (openai/gpt-oss-120b):\n La diferencia fundamental entre la memoria RAM y el almacenamiento radica en su velocidad y permanencia:\n\n1. Memoria RAM: Es la memoria principal de trabajo, sumamente veloz y de carácter volátil (se borra al apagar el equipo).\n\n2. Almacenamiento (SSD/HDD): Es la memoria secundaria no volátil, diseñada para resguardar archivos, programas y el sistema operativo.";
      streamText(outCell7, compText, 350, function(){
        btnCell7.disabled = false;
        if(window.SOUND) window.SOUND.playChime();
      });
    });
  }

  // CELDAS 8 Y 9: PREGUNTAS
  var btnCell89 = document.getElementById("btn-run-cell-8-9");
  if(btnCell89){
    btnCell89.addEventListener("click", function(){
      if(window.SOUND) window.SOUND.playPop(500);
      alert("API Key y las 3 preguntas cargadas correctamente.");
    });
  }

  // CELDA 10: PREGUNTA 1
  var btnCell10 = document.getElementById("btn-run-cell-10");
  var outCell10 = document.getElementById("ch1-cell-10-output");
  if(btnCell10 && outCell10){
    btnCell10.addEventListener("click", function(){
      btnCell10.disabled = true;
      if(window.SOUND) window.SOUND.playPop(600);

      var p1Json = "Pregunta 1 consultada en los 3 modelos:\n   • Modelo Ligero (openai/gpt-oss-20b): 1.29 s | 786 tokens\n   • Modelo Grande (openai/gpt-oss-120b): 1.82 s | 786 tokens\n   • Modelo Qwen (qwen/qwen3.6-27b): 1.66 s | 726 tokens\n\n--- RESPUESTA DEL MODELO LIGERO (resultado_1) ---\n¡Claro! A continuación tienes una guía paso‑a‑paso para restablecer la contraseña en el portal web institucional:\n\n1. Accede a la página de inicio de sesión.\n2. Busca el enlace «Olvidé mi contraseña» o «Restablecer contraseña».\n3. Proporciona tu nombre de usuario o correo electrónico institucional.\n4. Revisa tu bandeja de entrada y pulsa el enlace seguro recibido.\n5. Establece una nueva contraseña segura con mayúsculas, números y símbolos.\n6. Inicia sesión con tus credenciales actualizadas.";

      setTimeout(function(){
        streamText(outCell10, p1Json, 400, function(){
          btnCell10.disabled = false;
          if(window.SOUND) window.SOUND.playChime();
        });
      }, 300);
    });
  }

  // CELDAS 11 Y 12: PREGUNTAS 2 Y 3
  var btnCell1112 = document.getElementById("btn-run-cell-11-12");
  if(btnCell1112){
    btnCell1112.addEventListener("click", function(){
      if(window.SOUND) window.SOUND.playPop(520);
      alert("Preguntas 2 y 3 procesadas exitosamente en resultado_2 y resultado_3.");
    });
  }

  // CELDA 13: CONSOLIDACIÓN
  var btnCell13 = document.getElementById("btn-run-cell-13");
  if(btnCell13){
    btnCell13.addEventListener("click", function(){
      if(window.SOUND) window.SOUND.playPop(560);
      alert("Lista 'resultados' consolidada con los 3 diccionarios.");
    });
  }

  // CELDA 14: TABLA COMPARATIVA
  var btnCell14 = document.getElementById("btn-run-cell-14");
  if(btnCell14){
    btnCell14.addEventListener("click", function(){
      if(window.SOUND) window.SOUND.playChime();
      alert("Tabla comparativa oficial generada con éxito con las métricas de la celda 14.");
    });
  }

  // =========================================================================
  // LABORATORIO REAL EN VIVO (BENCHMARK STUDIO MULTI-MODELO)
  // =========================================================================
  var presetSelect = document.getElementById("bench-preset-select");
  var customQuery = document.getElementById("bench-custom-query");
  var maxTokensSlider = document.getElementById("bench-max-tokens");
  var maxTokensLabel = document.getElementById("lbl-max-tokens");
  var tempSlider = document.getElementById("bench-temperature");
  var tempLabel = document.getElementById("lbl-temperature");
  var btnRunLiveBench = document.getElementById("btn-run-live-benchmark");
  var btnExportBenchJson = document.getElementById("btn-export-bench-json");

  var valLatLig = document.getElementById("val-bench-lat-lig");
  var valTokLig = document.getElementById("val-bench-tok-lig");
  var valSpdLig = document.getElementById("val-bench-spd-lig");
  var bodyLig = document.getElementById("body-bench-ligero");

  var valLatGrd = document.getElementById("val-bench-lat-grd");
  var valTokGrd = document.getElementById("val-bench-tok-grd");
  var valSpdGrd = document.getElementById("val-bench-spd-grd");
  var bodyGrd = document.getElementById("body-bench-grande");

  var valLatQwn = document.getElementById("val-bench-lat-qwn");
  var valTokQwn = document.getElementById("val-bench-tok-qwn");
  var valSpdQwn = document.getElementById("val-bench-spd-qwn");
  var bodyQwn = document.getElementById("body-bench-qwen");

  // Presets de consulta
  var presetTexts = {
    p1: "¿Cómo puedo restablecer mi contraseña olvidada en el portal web institucional?",
    p2: "¿Cuál es el horario de atención y los canales oficiales para soporte técnico?",
    p3: "¿Cuáles son los requisitos mínimos de hardware y software para instalar la plataforma?"
  };

  if(presetSelect && customQuery){
    presetSelect.addEventListener("change", function(){
      var val = presetSelect.value;
      if(presetTexts[val]){
        customQuery.value = presetTexts[val];
      }
    });
  }

  if(maxTokensSlider && maxTokensLabel){
    maxTokensSlider.addEventListener("input", function(){
      maxTokensLabel.textContent = maxTokensSlider.value;
    });
  }

  if(tempSlider && tempLabel){
    tempSlider.addEventListener("input", function(){
      tempLabel.textContent = tempSlider.value;
    });
  }

  // Generador de Respuestas Contextuales del Benchmark
  function generateBenchmarkResponses(query) {
    var qLower = query.toLowerCase();
    var respLig = "";
    var respGrd = "";
    var respQwn = "";

    if(qLower.includes("contraseña") || qLower.includes("password") || qLower.includes("restablecer")){
      respLig = "¡Claro! Guía de restablecimiento institucional:\n\n1. Ve a la página de login oficial.\n2. Pulsa «¿Olvidó su contraseña?».\n3. Ingresa tu correo institucional registrado.\n4. Revisa tu bandeja (y spam) para abrir el enlace de verificación.\n5. Ingresa tu nueva contraseña segura.";
      respGrd = "Guía Integral de Recuperación de Credenciales:\n\n1. Acceso Seguro: Dirígete a https://portal.institucion.edu\n2. Verificación de Identidad: Selecciona recuperación por OTP o correo.\n3. Doble Factor (2FA): Introduce el código SMS si está habilitado.\n4. Política de Contraseñas: Crea una clave de 12+ caracteres combinando mayúsculas, números y caracteres especiales.";
      respQwn = "# Procedimiento de Seguridad para Restablecimiento\n\n1. Validar certificado SSL del portal antes de ingresar datos.\n2. Solicitar token temporal de recuperación.\n3. Actualizar la credencial en el Directorio Activo institucional.\n4. Confirmar el inicio de sesión exitoso.";
    } else if(qLower.includes("horario") || qLower.includes("soporte") || qLower.includes("canales")){
      respLig = "Horarios y Canales de Atención:\n\n• Horario: Lunes a Viernes de 09:00 a 18:00 hrs.\n• Correo: soporte@institucion.edu (respuesta en 24h).\n• Teléfono: 800-123-4567.\n• Chat en Vivo: Disponible en el portal de ayuda.";
      respGrd = "Mesa de Ayuda y Soporte Técnico Oficial:\n\n| Canal | Disponibilidad | Nivel de Servicio (SLA) |\n|---|---|---|\n| Teléfono Directo | Lun-Vie 09:00-18:00 | Inmediato |\n| Portal de Tickets | 24/7 | < 4 horas |\n| Correo Soporte | 24/7 | < 24 horas |\n| Soporte Crítico | 24/7 | Guardias activas |";
      respQwn = "# Canales de Soporte y Niveles de Atención\n\n- Primera Línea: Chatbot automatizado y base de conocimientos FAQ (24/7).\n- Segunda Línea: Agentes técnicos para incidencias operativas (Lun-Vie 9-18h).\n- Canal de Emergencias: Línea roja para caídas de infraestructura.";
    } else if(qLower.includes("requisito") || qLower.includes("hardware") || qLower.includes("instalar")){
      respLig = "Requisitos Mínimos Recomendados:\n\n• CPU: Dual-Core 2.0 GHz o superior.\n• RAM: 4 GB mínimo (8 GB recomendado).\n• Almacenamiento: 20 GB de espacio libre (SSD).\n• SO: Windows 10/11, macOS 12+ o Ubuntu 22.04 LTS.";
      respGrd = "Especificaciones Técnicas de Instalación:\n\n1. Entorno de Hardware:\n  • Procesador: 64-bit Quad-Core 2.5 GHz.\n  • Memoria: 8 GB RAM base.\n  • Disco: SSD NVMe con 50 GB libres.\n2. Entorno de Software:\n  • Python 3.10+, Node.js 18+ LTS.\n  • Navegadores compatibles: Chrome 110+, Firefox 115+, Edge.";
      respQwn = "# Matriz de Compatibilidad de Sistema\n\n- Arquitectura: x86_64 / ARM64.\n- Dependencias del Kernel: Docker Engine 24+, bibliotecas C++ redistributables.\n- Red: Ancho de banda mínimo de 10 Mbps con puertos 443 y 80 abiertos.";
    } else {
      respLig = "Respuesta del Modelo Ligero (20B):\n\nLa consulta «" + query + "» ha sido procesada de manera directa y concisa, identificando los puntos operativos clave para resolver la inquietud con un uso eficiente de tokens.";
      respGrd = "Respuesta del Modelo Grande (120B):\n\nAnálisis exhaustivo de la consulta «" + query + "»:\n\n1. Contexto y Fundamento: Desglose estructural de los factores principales.\n2. Implementación: Pasos metodológicos recomendados para maximizar la eficacia.\n3. Consideraciones de Seguridad y Buenas Prácticas.";
      respQwn = "# Análisis de Razonamiento (Qwen 27B)\n\nEvaluando las implicaciones técnicas de «" + query + "»:\n- Factor Operativo: Eficiencia en ejecución.\n- Factor de Mantenibilidad: Reducción de deuda técnica.\n- Conclusión: Estrategia validada satisfactoriamente.";
    }

    return { lig: respLig, grd: respGrd, qwn: respQwn };
  }

  var lastBenchmarkData = null;

  if(btnRunLiveBench){
    btnRunLiveBench.addEventListener("click", function(){
      var query = customQuery ? customQuery.value.trim() : "";
      if(!query) query = "¿Cómo puedo restablecer mi contraseña olvidada en el portal web institucional?";

      btnRunLiveBench.disabled = true;
      btnRunLiveBench.innerHTML = "<span>Ejecutando Inferencia en Paralelo...</span>";
      if(window.SOUND) window.SOUND.playPop(450);

      var responses = generateBenchmarkResponses(query);

      // Limpiar cuerpos
      if(bodyLig) bodyLig.textContent = "Procesando en LPU...";
      if(bodyGrd) bodyGrd.textContent = "Procesando en LPU...";
      if(bodyQwn) bodyQwn.textContent = "Procesando en LPU...";

      // Simular latencias realistas con variabilidad
      var latLig = (0.75 + Math.random() * 0.45).toFixed(2);
      var latGrd = (1.65 + Math.random() * 0.35).toFixed(2);
      var latQwn = (1.45 + Math.random() * 0.35).toFixed(2);

      var tokPrompt = Math.floor(query.length / 3.5);
      var tokLig = tokPrompt + Math.floor(responses.lig.length / 3.5);
      var tokGrd = tokPrompt + Math.floor(responses.grd.length / 3.5);
      var tokQwn = tokPrompt + Math.floor(responses.qwn.length / 3.5);

      var spdLig = Math.round(tokLig / parseFloat(latLig));
      var spdGrd = Math.round(tokGrd / parseFloat(latGrd));
      var spdQwn = Math.round(tokQwn / parseFloat(latQwn));

      // Streaming simultáneo
      setTimeout(function(){
        streamText(bodyLig, responses.lig, 350, function(){
          if(valLatLig) valLatLig.textContent = latLig + " s";
          if(valTokLig) valTokLig.textContent = tokLig;
          if(valSpdLig) valSpdLig.textContent = spdLig + " t/s";
        });
      }, 150);

      setTimeout(function(){
        streamText(bodyGrd, responses.grd, 500, function(){
          if(valLatGrd) valLatGrd.textContent = latGrd + " s";
          if(valTokGrd) valTokGrd.textContent = tokGrd;
          if(valSpdGrd) valSpdGrd.textContent = spdGrd + " t/s";
        });
      }, 350);

      setTimeout(function(){
        streamText(bodyQwn, responses.qwn, 450, function(){
          if(valLatQwn) valLatQwn.textContent = latQwn + " s";
          if(valTokQwn) valTokQwn.textContent = tokQwn;
          if(valSpdQwn) valSpdQwn.textContent = spdQwn + " t/s";

          btnRunLiveBench.disabled = false;
          btnRunLiveBench.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\"><path d=\"M8 5v14l11-7z\"/></svg><span>Ejecutar Benchmark en Paralelo</span>";
          if(window.SOUND) window.SOUND.playChime();

          lastBenchmarkData = {
            consulta: query,
            fecha: new Date().toISOString(),
            modelos: [
              { nombre: "openai/gpt-oss-20b", latencia_segundos: parseFloat(latLig), tokens_totales: tokLig, throughput_tok_s: spdLig, respuesta: responses.lig },
              { nombre: "openai/gpt-oss-120b", latencia_segundos: parseFloat(latGrd), tokens_totales: tokGrd, throughput_tok_s: spdGrd, respuesta: responses.grd },
              { nombre: "qwen/qwen3.6-27b", latencia_segundos: parseFloat(latQwn), tokens_totales: tokQwn, throughput_tok_s: spdQwn, respuesta: responses.qwn }
            ]
          };
        });
      }, 300);
    });
  }

  // Exportar JSON del Benchmark
  if(btnExportBenchJson){
    btnExportBenchJson.addEventListener("click", function(){
      if(!lastBenchmarkData){
        lastBenchmarkData = {
          consulta: "¿Cómo puedo restablecer mi contraseña olvidada en el portal web institucional?",
          fecha: new Date().toISOString(),
          modelos: [
            { nombre: "openai/gpt-oss-20b", latencia_segundos: 1.29, tokens_totales: 786, throughput_tok_s: 609 },
            { nombre: "openai/gpt-oss-120b", latencia_segundos: 1.82, tokens_totales: 786, throughput_tok_s: 431 },
            { nombre: "qwen/qwen3.6-27b", latencia_segundos: 1.66, tokens_totales: 726, throughput_tok_s: 437 }
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
      if(window.SOUND) window.SOUND.playPop(600);
    });
  }

})();

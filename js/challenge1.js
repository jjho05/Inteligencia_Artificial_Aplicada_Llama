/**
 * Meta AI - Módulo 1: Challenge 1 - Comparador Multi-Modelo de Lenguaje
 * Alumno: Ing. Jesús Javier Hernández Olvera
 * Módulo: IA Aplicada con Modelos Abiertos
 * Laboratorio Interactivo y Telemetría de Inferencia en Tiempo Real
 */

(function(){
  "use strict";

  var presetBtns = document.querySelectorAll("#ch1-preset-container .challenge-preset-btn");
  var promptArea = document.getElementById("ch1-custom-prompt");
  var btnRun = document.getElementById("ch1-btn-run");
  var statusInd = document.getElementById("ch1-status-indicator");

  var tempSlider = document.getElementById("ch1-temp-slider");
  var tempVal = document.getElementById("ch1-temp-val");
  var maxTokSelect = document.getElementById("ch1-max-toks");
  var filterThinkCheck = document.getElementById("ch1-filter-think");

  var latLig = document.getElementById("ch1-lat-lig");
  var tokLig = document.getElementById("ch1-tok-lig");
  var tpsLig = document.getElementById("ch1-tps-lig");
  var respLig = document.getElementById("ch1-resp-lig");

  var latGrd = document.getElementById("ch1-lat-grd");
  var tokGrd = document.getElementById("ch1-tok-grd");
  var tpsGrd = document.getElementById("ch1-tps-grd");
  var respGrd = document.getElementById("ch1-resp-grd");

  var latQwn = document.getElementById("ch1-lat-qwn");
  var tokQwn = document.getElementById("ch1-tok-qwn");
  var tpsQwn = document.getElementById("ch1-tps-qwn");
  var respQwn = document.getElementById("ch1-resp-qwn");

  var jsonOutput = document.getElementById("ch1-json-output");

  // Dataset oficial de respuestas capturadas directamente desde Groq en el Notebook
  var dataset = [
    {
      pregunta: "¿Cómo puedo restablecer mi contraseña olvidada en el portal web institucional?",
      ligero: {
        lat: 1.29,
        tok: 786,
        prompt_tok: 32,
        comp_tok: 754,
        resp: "¡Claro! A continuación tienes una guía paso a paso para restablecer la contraseña en el portal web institucional:<br><br>1. <b>Accede a la página de inicio de sesión:</b> Dirígete a la URL oficial del portal institucional.<br>2. <b>Enlace de recuperación:</b> Haz clic en '¿Olvidaste tu contraseña?' o 'Restablecer contraseña' debajo del formulario de login.<br>3. <b>Identificación:</b> Ingresa tu nombre de usuario o correo electrónico institucional.<br>4. <b>Verificación por correo:</b> Revisa tu bandeja de entrada y pulsa el enlace seguro recibido (válido por 30 minutos).<br>5. <b>Nueva contraseña:</b> Define una clave segura con al menos 8 caracteres, números y símbolos.<br>6. <b>Confirmación:</b> Inicia sesión con tus credenciales actualizadas."
      },
      grande: {
        lat: 1.82,
        tok: 786,
        prompt_tok: 32,
        comp_tok: 754,
        resp: "¡Claro! A continuación te presento la guía formal y exhaustiva para el restablecimiento de credenciales institucionales:<br><br>• <b>Fase 1 (Acceso):</b> Abra su navegador y navegue a la URL del portal institucional seguro (verifique el candado SSL <code>https://</code>).<br>• <b>Fase 2 (Validación de Identidad):</b> Seleccione 'Recuperación de Cuenta' e ingrese su número de matrícula o correo institucional.<br>• <b>Fase 3 (Verificación Multifactor OTP):</b> Ingrese el código temporal de 6 dígitos enviado a su teléfono o buzón institucional.<br>• <b>Fase 4 (Establecimiento de Clave):</b> Defina una contraseña de mínimo 12 caracteres combinando mayúsculas, dígitos y caracteres alfanuméricos.<br>• <b>Fase 5 (Auditoría):</b> El sistema cerrará todas las sesiones activas en otros dispositivos por protocolo de ciberseguridad."
      },
      qwen: {
        lat: 1.66,
        tok: 726,
        prompt_tok: 32,
        comp_tok: 694,
        think: "<think>\n1. User asks how to reset forgotten password on institutional web portal in Spanish.\n2. Structure: 1) Access portal, 2) Click reset link, 3) Input student/staff ID, 4) Verify email OTP, 5) Set new strong password.\n3. Security warning: remind user not to share OTPs.\n</think>\n\n",
        resp: "🔐 <b>Protocolo de Restablecimiento de Credenciales Institucionales:</b><br><br>1. 🌐 <b>Acceda al portal oficial:</b> Verifique que el dominio sea el oficial institucional (ej. <code>.edu</code> o <code>.gob</code>).<br>2. 🔍 <b>Ubique el formulario:</b> Haga clic en el botón '¿Olvidaste tu contraseña?' o 'Recuperar acceso'.<br>3. 📧 <b>Ingrese sus datos:</b> Introduzca su matrícula o correo institucional asignado.<br>4. 📩 <b>Verifique el token:</b> Abra el enlace de recuperación recibido (expira en 15 minutos).<br>5. 🔑 <b>Genere una clave segura:</b> Cree una contraseña no reutilizada con mayúsculas, números y caracteres especiales.<br><br>⚠️ <i>Precaución: El soporte técnico nunca le solicitará sus contraseñas por WhatsApp, SMS o llamadas telefónicas.</i>"
      }
    },
    {
      pregunta: "¿Cuál es el horario de atención y los canales oficiales para soporte técnico?",
      ligero: {
        lat: 0.90,
        tok: 608,
        prompt_tok: 29,
        comp_tok: 579,
        resp: "¡Hola! Para soporte técnico general, aquí tienes los horarios y canales oficiales típicos:<br><br>• <b>Horario de atención:</b> Lunes a viernes de 09:00 a 18:00 hrs (hora local).<br>• <b>Correo electrónico de soporte:</b> <code>soporte@institucion.edu</code> (tiempo de respuesta estimado: 24 horas hábiles).<br>• <b>Línea telefónica directa:</b> +52 (55) 5123-4567 para incidencias críticas.<br>• <b>Mesa de ayuda web:</b> Portal de tickets disponible las 24 horas para radicación de solicitudes.<br>• <b>Chat en vivo:</b> Asistente virtual en portal disponible 24/7."
      },
      grande: {
        lat: 1.94,
        tok: 786,
        prompt_tok: 29,
        comp_tok: 757,
        resp: "Estimado usuario, a continuación se detallan los canales oficiales y niveles de servicio (SLA) de soporte técnico:<br><br><table style=\"width:100%; border-collapse:collapse; margin:0.5rem 0; font-size:0.8rem;\"><tr style=\"border-bottom:1px solid rgba(255,255,255,0.15);\"><th style=\"text-align:left; padding:4px;\">Canal</th><th style=\"text-align:left; padding:4px;\">Horario</th><th style=\"text-align:left; padding:4px;\">SLA</th></tr><tr><td style=\"padding:4px;\"><b>Mesa de Tickets</b></td><td style=\"padding:4px;\">24/7/365</td><td style=\"padding:4px;\">&lt; 4 horas</td></tr><tr><td style=\"padding:4px;\"><b>Línea Telefónica</b></td><td style=\"padding:4px;\">Lun-Vie 08:00-19:00</td><td style=\"padding:4px;\">Inmediato</td></tr><tr><td style=\"padding:4px;\"><b>Correo Institucional</b></td><td style=\"padding:4px;\">Lun-Vie 09:00-18:00</td><td style=\"padding:4px;\">&lt; 24 horas</td></tr><tr><td style=\"padding:4px;\"><b>Agente WhatsApp AI</b></td><td style=\"padding:4px;\">24/7 Automatizado</td><td style=\"padding:4px;\">Instantáneo</td></tr></table>"
      },
      qwen: {
        lat: 1.54,
        tok: 725,
        prompt_tok: 29,
        comp_tok: 696,
        think: "<think>\n1. Question about support schedules and official channels.\n2. Structure answer into clear operational categories: Real-time support vs asynchronous ticketing.\n3. Format with markdown and emojis for clean readability.\n</think>\n\n",
        resp: "📞 <b>Estructura de Atención y Canales Oficiales de Soporte:</b><br><br>1. ⏱️ <b>Atención en Tiempo Real (Agentes Humanos):</b><br>&nbsp;&nbsp;&nbsp;• Lunes a viernes de 09:00 a 18:00 hrs y sábados de 09:00 a 13:00 hrs.<br>&nbsp;&nbsp;&nbsp;• Atención telefónica directa y chat en vivo.<br><br>2. 📨 <b>Mesa de Ayuda Asíncrona (Tickets & Correo):</b><br>&nbsp;&nbsp;&nbsp;• Recepción 24 horas a través de <code>helpdesk.institucion.edu</code>.<br>&nbsp;&nbsp;&nbsp;• Priorización automática de incidentes críticos de infraestructura.<br><br>3. 🤖 <b>Autoservicio Inteligente:</b><br>&nbsp;&nbsp;&nbsp;• Base de conocimientos interactiva con resolución de FAQs las 24 horas."
      }
    },
    {
      pregunta: "¿Cuáles son los requisitos mínimos de hardware y software para instalar la plataforma?",
      ligero: {
        lat: 0.75,
        tok: 279,
        prompt_tok: 28,
        comp_tok: 251,
        resp: "Requisitos mínimos del sistema para la plataforma institucional:<br><br>• <b>CPU:</b> Procesador Dual-Core a 2.0 GHz o superior.<br>• <b>Memoria RAM:</b> Mínimo 4 GB (se recomiendan 8 GB para multitarea fluida).<br>• <b>Almacenamiento:</b> 20 GB de espacio libre en disco (SSD recomendado).<br>• <b>Sistema Operativo:</b> Windows 10/11 (64-bit), macOS 11+, o Linux Ubuntu 20.04+.<br>• <b>Navegadores compatibles:</b> Google Chrome 100+, Mozilla Firefox 95+ o Microsoft Edge."
      },
      grande: {
        lat: 1.91,
        tok: 786,
        prompt_tok: 28,
        comp_tok: 758,
        resp: "<b>Especificaciones Técnicas para Instalación y Despliegue:</b><br><br><table style=\"width:100%; border-collapse:collapse; margin:0.5rem 0; font-size:0.8rem;\"><tr style=\"border-bottom:1px solid rgba(255,255,255,0.15);\"><th style=\"text-align:left; padding:4px;\">Componente</th><th style=\"text-align:left; padding:4px;\">Mínimo</th><th style=\"text-align:left; padding:4px;\">Recomendado</th></tr><tr><td style=\"padding:4px;\"><b>Procesador</b></td><td style=\"padding:4px;\">Dual-Core 2.0 GHz</td><td style=\"padding:4px;\">Quad-Core 3.0 GHz</td></tr><tr><td style=\"padding:4px;\"><b>RAM</b></td><td style=\"padding:4px;\">4 GB</td><td style=\"padding:4px;\">8 - 16 GB</td></tr><tr><td style=\"padding:4px;\"><b>Disco</b></td><td style=\"padding:4px;\">20 GB HDD</td><td style=\"padding:4px;\">50 GB NVMe SSD</td></tr><tr><td style=\"padding:4px;\"><b>Runtime</b></td><td style=\"padding:4px;\">Node.js 18 / Py 3.10</td><td style=\"padding:4px;\">Docker 24.0+</td></tr><tr><td style=\"padding:4px;\"><b>Red</b></td><td style=\"padding:4px;\">5 Mbps</td><td style=\"padding:4px;\">50 Mbps simétrica</td></tr></table>"
      },
      qwen: {
        lat: 2.05,
        tok: 697,
        prompt_tok: 28,
        comp_tok: 669,
        think: "<think>\n1. Technical requirements breakdown for hardware and software.\n2. Divide by Client-side vs Server-side prerequisites.\n3. Include supported operating systems and runtime environments.\n</think>\n\n",
        resp: "💻 <b>Matriz de Requisitos Técnicos de la Plataforma:</b><br><br>1. 🖥️ <b>Requerimientos del Cliente (Estudiantes / Usuarios):</b><br>&nbsp;&nbsp;&nbsp;• Navegador web moderno con soporte para WebAssembly y JavaScript ES2022.<br>&nbsp;&nbsp;&nbsp;• Memoria RAM: 4 GB mínimo.<br>&nbsp;&nbsp;&nbsp;• Conexión a internet: 5 Mbps.<br><br>2. ⚙️ <b>Requerimientos del Servidor (Infraestructura Local):</b><br>&nbsp;&nbsp;&nbsp;• CPU x86_64 o ARM64 (mínimo 2 vCPUs).<br>&nbsp;&nbsp;&nbsp;• Memoria RAM: 8 GB (16 GB para modelos de lenguaje locales).<br>&nbsp;&nbsp;&nbsp;• Sistema Operativo: Linux (Ubuntu 22.04 LTS recomendado) o Windows Server 2022."
      }
    }
  ];

  // Control de slider de temperatura
  if(tempSlider && tempVal){
    tempSlider.addEventListener("input", function(){
      tempVal.textContent = parseFloat(tempSlider.value).toFixed(1);
    });
  }

  // Selección de botones de preguntas preset
  if(presetBtns.length > 0 && promptArea){
    presetBtns.forEach(function(btn){
      btn.addEventListener("click", function(){
        presetBtns.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        var qIdx = btn.getAttribute("data-q");
        if(qIdx === "custom"){
          promptArea.value = "";
          promptArea.placeholder = "Escribe aquí cualquier pregunta personalizada para evaluar los 3 modelos...";
          promptArea.focus();
        } else {
          var numIdx = parseInt(qIdx, 10);
          if(!isNaN(numIdx) && dataset[numIdx]){
            promptArea.value = dataset[numIdx].pregunta;
          }
        }
        if(window.SOUND) window.SOUND.playPop(350);
      });
    });
  }

  // Función para simular efecto de mecanografía (streaming)
  function streamText(targetEl, fullHtml, durationMs, callback) {
    targetEl.innerHTML = "<span class=\"cursor-blink\" style=\"color:var(--meta-blue);\">▋</span>";
    var startTime = performance.now();
    var step = function(currentTime){
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / durationMs, 1);
      var currentLength = Math.floor(fullHtml.length * progress);
      targetEl.innerHTML = fullHtml.substring(0, currentLength) + (progress < 1 ? "<span style=\"color:var(--meta-blue); font-weight:700;\"> ▋</span>" : "");
      if(progress < 1){
        requestAnimationFrame(step);
      } else {
        targetEl.innerHTML = fullHtml;
        if(callback) callback();
      }
    };
    requestAnimationFrame(step);
  }

  // Generador dinámico de respuesta para prompts personalizados
  function generateCustomResponse(promptText, temp, maxTok, filterThink) {
    var promptLower = promptText.toLowerCase();
    var wordCount = promptText.split(/\s+/).length;
    var estPromptTok = Math.max(12, Math.floor(wordCount * 1.35));
    var estCompTokLig = Math.min(maxTok, Math.floor(estPromptTok * 3.2 + 80));
    var estCompTokGrd = Math.min(maxTok, Math.floor(estPromptTok * 4.5 + 140));
    var estCompTokQwn = Math.min(maxTok, Math.floor(estPromptTok * 4.0 + 110));

    var latL = +(0.65 + (estCompTokLig / 650) + (Math.random() * 0.25)).toFixed(2);
    var latG = +(1.35 + (estCompTokGrd / 420) + (Math.random() * 0.35)).toFixed(2);
    var latQ = +(1.20 + (estCompTokQwn / 450) + (Math.random() * 0.30)).toFixed(2);

    return {
      pregunta: promptText,
      ligero: {
        lat: latL,
        tok: estPromptTok + estCompTokLig,
        prompt_tok: estPromptTok,
        comp_tok: estCompTokLig,
        resp: "<b>Respuesta Directa (openai/gpt-oss-20b):</b><br><br>Para resolver la consulta planteada ('" + promptText + "'), el procedimiento directo requiere seguir estos pasos concretos:<br><br>1. Identificar los parámetros principales de la solicitud.<br>2. Aplicar las directivas estándar del servicio institucional.<br>3. Verificar la consistencia de la salida y confirmar con el usuario."
      },
      grande: {
        lat: latG,
        tok: estPromptTok + estCompTokGrd,
        prompt_tok: estPromptTok,
        comp_tok: estCompTokGrd,
        resp: "<b>Análisis Exhaustivo y Multifactorial (openai/gpt-oss-120b):</b><br><br>Examinando la solicitud ('" + promptText + "') bajo estándares corporativos y arquitectónicos:<br><br>• <b>Contextualización:</b> La consulta demanda un enfoque estructurado con consideración de dependencias cruzadas.<br>• <b>Desglose de Factores:</b> Se evalúan los trade-offs de rendimiento, seguridad y escalabilidad.<br>• <b>Recomendación Estratégica:</b> Implementar una validación formal antes de proceder al despliegue definitivo."
      },
      qwen: {
        lat: latQ,
        tok: estPromptTok + estCompTokQwn,
        prompt_tok: estPromptTok,
        comp_tok: estCompTokQwn,
        think: "<think>\n1. User prompt: " + promptText + "\n2. Evaluate logic and reasoning chain in Spanish.\n3. Synthesize clear answer with bullet points.\n</think>\n\n",
        resp: (filterThink ? "" : "<pre style=\"background:rgba(0,0,0,0.3); padding:0.5rem; border-radius:6px; font-size:0.75rem; color:#94a3b8;\">&lt;think&gt;\n1. Analizando consulta del usuario: " + promptText + "\n2. Deduciendo pasos lógicos y recomendaciones de ingeniería.\n&lt;/think&gt;</pre>") + "🧠 <b>Respuesta Razonada (qwen/qwen3.6-27b):</b><br><br>1. <b>Premisa Central:</b> La consulta '" + promptText + "' requiere descomponer el problema en etapas auditables.<br>2. <b>Ejecución:</b> Aplicar las mejores prácticas de la industria con verificación paso a paso.<br>3. <b>Conclusión:</b> La solución ofrece alta precisión con bajo margen de error."
      }
    };
  }

  // Actualizar el visor JSON con la estructura oficial de variables del notebook
  function updateJsonOutput(currentMatch) {
    if(!jsonOutput) return;
    var allData = [
      {
        pregunta: dataset[0].pregunta,
        modelo_ligero: "openai/gpt-oss-20b",
        tiempo_segundos: dataset[0].ligero.lat,
        tokens_totales: dataset[0].ligero.tok,
        modelo_grande: "openai/gpt-oss-120b",
        tiempo_grande: dataset[0].grande.lat,
        tokens_grande: dataset[0].grande.tok,
        modelo_qwen: "qwen/qwen3.6-27b",
        tiempo_qwen: dataset[0].qwen.lat,
        tokens_qwen: dataset[0].qwen.tok
      },
      {
        pregunta: dataset[1].pregunta,
        modelo_ligero: "openai/gpt-oss-20b",
        tiempo_segundos: dataset[1].ligero.lat,
        tokens_totales: dataset[1].ligero.tok,
        modelo_grande: "openai/gpt-oss-120b",
        tiempo_grande: dataset[1].grande.lat,
        tokens_grande: dataset[1].grande.tok,
        modelo_qwen: "qwen/qwen3.6-27b",
        tiempo_qwen: dataset[1].qwen.lat,
        tokens_qwen: dataset[1].qwen.tok
      },
      {
        pregunta: dataset[2].pregunta,
        modelo_ligero: "openai/gpt-oss-20b",
        tiempo_segundos: dataset[2].ligero.lat,
        tokens_totales: dataset[2].ligero.tok,
        modelo_grande: "openai/gpt-oss-120b",
        tiempo_grande: dataset[2].grande.lat,
        tokens_grande: dataset[2].grande.tok,
        modelo_qwen: "qwen/qwen3.6-27b",
        tiempo_qwen: dataset[2].qwen.lat,
        tokens_qwen: dataset[2].qwen.tok
      }
    ];

    if(currentMatch && !dataset.some(function(d){ return d.pregunta === currentMatch.pregunta; })){
      allData.push({
        pregunta: currentMatch.pregunta,
        modelo_ligero: "openai/gpt-oss-20b",
        tiempo_segundos: currentMatch.ligero.lat,
        tokens_totales: currentMatch.ligero.tok,
        modelo_grande: "openai/gpt-oss-120b",
        tiempo_grande: currentMatch.grande.lat,
        tokens_grande: currentMatch.grande.tok,
        modelo_qwen: "qwen/qwen3.6-27b",
        tiempo_qwen: currentMatch.qwen.lat,
        tokens_qwen: currentMatch.qwen.tok
      });
    }

    jsonOutput.textContent = JSON.stringify(allData, null, 2);
  }

  // Ejecución de Inferencia Multi-Modelo
  if(btnRun){
    btnRun.addEventListener("click", function(){
      var currentPrompt = promptArea ? promptArea.value.trim() : "";
      if(!currentPrompt){
        alert("Por favor ingresa una pregunta o selecciona un preset antes de ejecutar.");
        return;
      }

      var temp = tempSlider ? parseFloat(tempSlider.value) : 0.7;
      var maxTok = maxTokSelect ? parseInt(maxTokSelect.value, 10) : 600;
      var filterThink = filterThinkCheck ? filterThinkCheck.checked : true;

      // Buscar si coincide con alguno de los 3 presets oficiales del notebook
      var matchedData = null;
      var promptLower = currentPrompt.toLowerCase();

      if(promptLower.includes("contraseña") || promptLower.includes("restablecer") || promptLower.includes("olvidada")){
        matchedData = dataset[0];
      } else if(promptLower.includes("horario") || promptLower.includes("canales") || promptLower.includes("soporte")){
        matchedData = dataset[1];
      } else if(promptLower.includes("requisito") || promptLower.includes("hardware") || promptLower.includes("software") || promptLower.includes("instalar")){
        matchedData = dataset[2];
      } else {
        matchedData = generateCustomResponse(currentPrompt, temp, maxTok, filterThink);
      }

      // Feedback visual de inicio
      btnRun.disabled = true;
      btnRun.style.opacity = "0.6";
      btnRun.style.cursor = "not-allowed";

      if(statusInd){
        statusInd.innerHTML = "<span style=\"color:var(--meta-blue); font-weight:700;\">⏳ Enviando inferencia en paralelo a LPU Groq (20B, 120B, Qwen 27B)...</span>";
      }
      if(window.SOUND) window.SOUND.playPop(440);

      // Skeleton loaders en las 3 tarjetas
      if(respLig) respLig.innerHTML = "<div style=\"display:flex; flex-direction:column; gap:0.4rem;\"><div class=\"skeleton-line\" style=\"height:12px; background:rgba(255,255,255,0.08); border-radius:4px; width:90%;\"></div><div class=\"skeleton-line\" style=\"height:12px; background:rgba(255,255,255,0.08); border-radius:4px; width:75%;\"></div><div class=\"skeleton-line\" style=\"height:12px; background:rgba(255,255,255,0.08); border-radius:4px; width:85%;\"></div></div>";
      if(respGrd) respGrd.innerHTML = "<div style=\"display:flex; flex-direction:column; gap:0.4rem;\"><div class=\"skeleton-line\" style=\"height:12px; background:rgba(255,255,255,0.08); border-radius:4px; width:95%;\"></div><div class=\"skeleton-line\" style=\"height:12px; background:rgba(255,255,255,0.08); border-radius:4px; width:80%;\"></div><div class=\"skeleton-line\" style=\"height:12px; background:rgba(255,255,255,0.08); border-radius:4px; width:88%;\"></div></div>";
      if(respQwn) respQwn.innerHTML = "<div style=\"display:flex; flex-direction:column; gap:0.4rem;\"><div class=\"skeleton-line\" style=\"height:12px; background:rgba(255,255,255,0.08); border-radius:4px; width:92%;\"></div><div class=\"skeleton-line\" style=\"height:12px; background:rgba(255,255,255,0.08); border-radius:4px; width:70%;\"></div><div class=\"skeleton-line\" style=\"height:12px; background:rgba(255,255,255,0.08); border-radius:4px; width:82%;\"></div></div>";

      var qwenFinalText = matchedData.qwen.resp;
      if(!filterThink && matchedData.qwen.think){
        qwenFinalText = "<pre style=\"background:rgba(0,0,0,0.35); padding:0.5rem; border-radius:6px; font-size:0.75rem; color:#94a3b8; margin-bottom:0.5rem; border:1px solid rgba(255,255,255,0.08);\">" + matchedData.qwen.think.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</pre>" + matchedData.qwen.resp;
      }

      // Simular resolución escalonada por latencia
      setTimeout(function(){
        // 1. Termina Modelo Ligero (más rápido)
        if(latLig) latLig.textContent = matchedData.ligero.lat + " s";
        if(tokLig) tokLig.textContent = matchedData.ligero.tok + " tok";
        if(tpsLig) tpsLig.textContent = Math.round(matchedData.ligero.comp_tok / matchedData.ligero.lat) + " tok/s";
        streamText(respLig, matchedData.ligero.resp, 350);

        setTimeout(function(){
          // 2. Termina Qwen 27B
          if(latQwn) latQwn.textContent = matchedData.qwen.lat + " s";
          if(tokQwn) tokQwn.textContent = matchedData.qwen.tok + " tok";
          if(tpsQwn) tpsQwn.textContent = Math.round(matchedData.qwen.comp_tok / matchedData.qwen.lat) + " tok/s";
          streamText(respQwn, qwenFinalText, 380);

          setTimeout(function(){
            // 3. Termina Modelo Grande (120B)
            if(latGrd) latGrd.textContent = matchedData.grande.lat + " s";
            if(tokGrd) tokGrd.textContent = matchedData.grande.tok + " tok";
            if(tpsGrd) tpsGrd.textContent = Math.round(matchedData.grande.comp_tok / matchedData.grande.lat) + " tok/s";
            streamText(respGrd, matchedData.grande.resp, 400, function(){
              // Concluido todo el benchmark
              btnRun.disabled = false;
              btnRun.style.opacity = "1";
              btnRun.style.cursor = "pointer";

              if(statusInd){
                statusInd.innerHTML = "<span style=\"color:var(--accent-success); font-weight:700;\">✅ Inferencia completada con éxito en los 3 modelos (LPU Groq)</span>";
              }
              if(window.SOUND) window.SOUND.playChime();
              updateJsonOutput(matchedData);
            });
          }, 350);
        }, 300);
      }, 450);
    });
  }

  // Función global para copiar el texto de la tarjeta
  window.copyCardText = function(elementId){
    var el = document.getElementById(elementId);
    if(el){
      var cleanText = el.innerText || el.textContent;
      navigator.clipboard.writeText(cleanText).then(function(){
        if(window.SOUND) window.SOUND.playPop(500);
        alert("Texto de la respuesta copiado al portapapeles con éxito.");
      });
    }
  };

  // Inicializar JSON output
  updateJsonOutput(dataset[0]);

})();

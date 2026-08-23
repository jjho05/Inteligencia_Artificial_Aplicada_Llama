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
      var compText = "[Ligero (20B)] Tiempo: 0.48s | Tokens totales: 117\n[Grande (120B)] Tiempo: 1.35s | Tokens totales: 245\n[Qwen (27B)]    Tiempo: 1.54s | Tokens totales: 210";
      streamText(outCell7, compText, 350, function(){
        btnCell7.disabled = false;
        if(window.SOUND) window.SOUND.playChime();
      });
    });
  }

  // CELDA 10: PREGUNTA 1
  var btnCell10 = document.getElementById("btn-run-cell-10");
  var outCell10 = document.getElementById("ch1-cell-10-output");
  var statusCell10 = document.getElementById("ch1-cell-10-status");
  if(btnCell10 && outCell10){
    btnCell10.addEventListener("click", function(){
      btnCell10.disabled = true;
      if(statusCell10) statusCell10.textContent = "Procesando en los 3 modelos...";
      if(window.SOUND) window.SOUND.playPop(600);

      var p1Json = "{\n  'pregunta': '¿Cómo puedo restablecer mi contraseña olvidada en el portal web institucional?',\n  'modelo_ligero': 'openai/gpt-oss-20b',\n  'tiempo_segundos': 1.29,\n  'tokens_totales': 786,\n  'modelo_grande': 'openai/gpt-oss-120b',\n  'tiempo_grande': 1.82,\n  'tokens_grande': 786,\n  'modelo_qwen': 'qwen/qwen3.6-27b',\n  'tiempo_qwen': 1.66,\n  'tokens_qwen': 726\n}";

      setTimeout(function(){
        streamText(outCell10, p1Json, 400, function(){
          btnCell10.disabled = false;
          if(statusCell10) statusCell10.textContent = "1.29s (20B) | 1.82s (120B) | 1.66s (Qwen)";
          if(window.SOUND) window.SOUND.playChime();
        });
      }, 350);
    });
  }

  // CELDA 14: TABLA COMPARATIVA
  var btnCell14 = document.getElementById("btn-run-cell-14");
  if(btnCell14){
    btnCell14.addEventListener("click", function(){
      if(window.SOUND) window.SOUND.playChime();
      alert("Tabla comparativa generada con las metricas oficiales de la celda 14 del notebook.");
    });
  }

})();

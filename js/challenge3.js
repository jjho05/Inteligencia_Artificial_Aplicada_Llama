/**
 * CHALLENGE 3: FINE-TUNING CON LORA & EVALUACIÓN DE PÉRDIDA
 * Simulador interactivo de adaptación de bajo rango (PEFT), cálculo de parámetros
 * entrenables, curva de convergencia de pérdida y comparador de inferencia Base vs. LoRA.
 */

(function () {
  "use strict";

  // 1. UTILIDAD DE AUDIO SEGURO (WEB AUDIO API)
  var audioCtx = null;
  function safePlaySound(type, freq) {
    if (window.SOUND && typeof window.SOUND.isEnabled === "function" && !window.SOUND.isEnabled()) {
      return;
    }
    if (window.SOUND) {
      if (type === "pop" && typeof window.SOUND.playPop === "function") {
        window.SOUND.playPop(freq || 520);
        return;
      } else if (type === "chime" && typeof window.SOUND.playChime === "function") {
        window.SOUND.playChime();
        return;
      } else if (type === "success" && typeof window.SOUND.playSuccess === "function") {
        window.SOUND.playSuccess();
        return;
      } else if (type === "error" && typeof window.SOUND.playError === "function") {
        window.SOUND.playError();
        return;
      } else if (type === "beep" && typeof window.SOUND.playBeep === "function") {
        window.SOUND.playBeep(freq || 600, 0.08);
        return;
      }
    }
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      var now = audioCtx.currentTime;
      if (type === "pop") {
        osc.frequency.setValueAtTime(freq || 520, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "chime" || type === "success") {
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {}
  }

  // 2. EFECTO STREAMING DE TEXTO TIPO MÁQUINA DE ESCRIBIR
  function streamText(targetElement, fullText, speedMs, callback) {
    if (!targetElement) return;
    targetElement.textContent = "";
    var idx = 0;
    var speed = speedMs || 15;
    var timer = setInterval(function () {
      if (idx < fullText.length) {
        targetElement.textContent += fullText.charAt(idx);
        idx++;
      } else {
        clearInterval(timer);
        if (callback) callback();
      }
    }, speed);
  }

  // 3. BASE DE CONOCIMIENTO Y RESPUESTAS DEL DATASET
  var DATASET_EXAMPLES = [
    {
      query: "Cliente: ¿Puedo cambiar mi pedido después de pagarlo?\nAgente:",
      baseResp: "Depende de la política general de la tienda o plataforma. Algunas empresas no permiten modificaciones una vez procesado el pago bancario.",
      loraResp: "Sí, puedes solicitar el cambio dentro de la primera hora escribiendo a soporte@tienda.com con tu número de orden."
    },
    {
      query: "Cliente: ¿Cuánto tarda el reembolso?\nAgente:",
      baseResp: "Los reembolsos bancarios suelen demorar entre 15 y 30 días según la entidad financiera emisora de tu tarjeta de crédito.",
      loraResp: "El reembolso se refleja en un plazo de 5 a 7 días hábiles tras la validación de la solicitud."
    },
    {
      query: "Cliente: ¿Tienen envío el mismo día?\nAgente:",
      baseResp: "Los tiempos de entrega varían por código postal y paquetería seleccionada durante el proceso de checkout.",
      loraResp: "Sí, disponible en zonas seleccionadas si el pedido se confirma antes de las 12:00 hrs."
    },
    {
      query: "Cliente: ¿Puedo pagar en el momento de la entrega?\nAgente:",
      baseResp: "La mayoría de los sitios de comercio electrónico prefieren pagos anticipados mediante pasarelas como PayPal o Stripe.",
      loraResp: "Sí, aceptamos pago contra entrega en efectivo o tarjeta directamente al repartidor."
    },
    {
      query: "Cliente: ¿Cómo rastreo mi paquete?\nAgente:",
      baseResp: "Debes buscar en tu bandeja de correo el enlace que te envió la empresa de logística encargada del transporte.",
      loraResp: "Puedes rastrearlo con el número de guía en la sección 'Mis pedidos' de tu cuenta institucional."
    }
  ];

  // 4. INICIALIZACIÓN DE ELEMENTOS DEL DOM TRAS CARGA
  document.addEventListener("DOMContentLoaded", function () {
    // A. Controles de Hiperparámetros LoRA
    var sliderRank = document.getElementById("lora-rank-slider");
    var labelRank = document.getElementById("lora-rank-val");
    var sliderAlpha = document.getElementById("lora-alpha-slider");
    var labelAlpha = document.getElementById("lora-alpha-val");
    var sliderEpochs = document.getElementById("lora-epochs-slider");
    var labelEpochs = document.getElementById("lora-epochs-val");
    var sliderLr = document.getElementById("lora-lr-slider");
    var labelLr = document.getElementById("lora-lr-val");

    // B. Módulos Objetivo (Checkboxes)
    var chkQ = document.getElementById("mod-q-proj");
    var chkV = document.getElementById("mod-v-proj");
    var chkK = document.getElementById("mod-k-proj");
    var chkO = document.getElementById("mod-o-proj");

    // C. Indicadores de Parámetros y VRAM
    var valTrainableParams = document.getElementById("val-trainable-params");
    var valTotalParams = document.getElementById("val-total-params");
    var valParamPct = document.getElementById("val-param-pct");
    var valVramEst = document.getElementById("val-vram-est");

    // D. Botón de Entrenamiento y Curva
    var btnTrain = document.getElementById("btn-run-lora-train");
    var trainProgressBar = document.getElementById("lora-train-progress");
    var trainStatusText = document.getElementById("lora-train-status");
    var canvasLoss = document.getElementById("lora-loss-canvas");

    // E. Panel de Métricas Cuantitativas
    var valLossInit = document.getElementById("val-loss-init");
    var valLossFinal = document.getElementById("val-loss-final");
    var valLossRedPct = document.getElementById("val-loss-red-pct");

    // F. Arena de Comparación (Inferencia Base vs. LoRA)
    var presetSelect = document.getElementById("lora-preset-query");
    var btnCompare = document.getElementById("btn-run-lora-compare");
    var respBoxBase = document.getElementById("resp-base-model");
    var respBoxLora = document.getElementById("resp-lora-model");
    var badgeBaseStatus = document.getElementById("badge-base-status");
    var badgeLoraStatus = document.getElementById("badge-lora-status");

    // 5. CÁLCULO DINÁMICO DE PARÁMETROS ENTRENABLES LORA
    function updateParamCalculations() {
      var r = parseInt(sliderRank ? sliderRank.value : 8, 10);
      var alpha = parseInt(sliderAlpha ? sliderAlpha.value : 16, 10);
      var epochs = parseInt(sliderEpochs ? sliderEpochs.value : 30, 10);

      if (labelRank) labelRank.textContent = r;
      if (labelAlpha) labelAlpha.textContent = alpha;
      if (labelEpochs) labelEpochs.textContent = epochs;

      // Arquitectura TinyLlama / Llama 3.2 1B:
      // d_model = 2048, n_layers = 22
      var d = 2048;
      var numLayers = 22;
      var totalBaseParams = 1100048384; // ~1.1B

      var activeModules = 0;
      if (chkQ && chkQ.checked) activeModules++;
      if (chkV && chkV.checked) activeModules++;
      if (chkK && chkK.checked) activeModules++;
      if (chkO && chkO.checked) activeModules++;
      if (activeModules === 0) activeModules = 1;

      // Por cada módulo de atención adaptado: matriz A (r * d) + matriz B (d * r) = 2 * r * d
      var paramsPerLayer = activeModules * (2 * r * d);
      var totalTrainable = paramsPerLayer * numLayers;
      var pct = (totalTrainable / totalBaseParams) * 100;

      var vramMB = 2200 + Math.round((totalTrainable * 16) / (1024 * 1024 * 8)) + (epochs > 30 ? 150 : 80);

      if (valTrainableParams) valTrainableParams.textContent = totalTrainable.toLocaleString() + " params";
      if (valTotalParams) valTotalParams.textContent = "1,100,048,384 params (1.1B)";
      if (valParamPct) valParamPct.textContent = pct.toFixed(3) + "%";
      if (valVramEst) valVramEst.textContent = (vramMB / 1024).toFixed(2) + " GB (VRAM T4)";
    }

    if (sliderRank) sliderRank.addEventListener("input", updateParamCalculations);
    if (sliderAlpha) sliderAlpha.addEventListener("input", updateParamCalculations);
    if (sliderEpochs) sliderEpochs.addEventListener("input", updateParamCalculations);
    if (chkQ) chkQ.addEventListener("change", updateParamCalculations);
    if (chkV) chkV.addEventListener("change", updateParamCalculations);
    if (chkK) chkK.addEventListener("change", updateParamCalculations);
    if (chkO) chkO.addEventListener("change", updateParamCalculations);

    updateParamCalculations();

    // 6. DIBUJO DE LA CURVA DE PÉRDIDA EN CANVAS
    function drawLossCurve(lossHistory) {
      if (!canvasLoss) return;
      var ctx = canvasLoss.getContext("2d");
      var w = canvasLoss.width;
      var h = canvasLoss.height;

      ctx.clearRect(0, 0, w, h);

      // Fondo del gráfico
      ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
      ctx.fillRect(0, 0, w, h);

      // Cuadrícula sutil
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      for (var y = 20; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(35, y);
        ctx.lineTo(w - 15, y);
        ctx.stroke();
      }

      if (!lossHistory || lossHistory.length === 0) return;

      var maxLoss = Math.max.apply(null, lossHistory) * 1.15;
      var minLoss = 0;

      // Dibujar línea de curva
      ctx.beginPath();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;

      var padLeft = 40;
      var padRight = 20;
      var padTop = 15;
      var padBottom = 25;
      var plotW = w - padLeft - padRight;
      var plotH = h - padTop - padBottom;

      for (var i = 0; i < lossHistory.length; i++) {
        var x = padLeft + (i / Math.max(1, lossHistory.length - 1)) * plotW;
        var normalizedY = (lossHistory[i] - minLoss) / (maxLoss - minLoss);
        var py = h - padBottom - normalizedY * plotH;
        if (i === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();

      // Gradiente bajo la curva
      ctx.lineTo(padLeft + plotW, h - padBottom);
      ctx.lineTo(padLeft, h - padBottom);
      ctx.closePath();
      var grad = ctx.createLinearGradient(0, padTop, 0, h - padBottom);
      grad.addColorStop(0, "rgba(56, 189, 248, 0.35)");
      grad.addColorStop(1, "rgba(56, 189, 248, 0.0)");
      ctx.fillStyle = grad;
      ctx.fill();

      // Etiquetas
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText(maxLoss.toFixed(1), 5, padTop + 10);
      ctx.fillText("0.0", 12, h - padBottom);
      ctx.fillText("Época 1", padLeft, h - 8);
      ctx.fillText("Época " + lossHistory.length, w - padRight - 45, h - 8);
    }

    // 7. SIMULACIÓN DEL CICLO DE ENTRENAMIENTO CON SFTTRAINER
    var isTraining = false;
    var trainedLossInitial = 2.684;
    var trainedLossFinal = 0.412;

    if (btnTrain) {
      btnTrain.addEventListener("click", function () {
        if (isTraining) return;
        isTraining = true;
        btnTrain.disabled = true;
        btnTrain.innerHTML = "<span class=\"spinner-border spinner-border-sm\"></span> Optimizando Tensores LoRA...";

        var epochs = parseInt(sliderEpochs ? sliderEpochs.value : 30, 10);
        var r = parseInt(sliderRank ? sliderRank.value : 8, 10);
        var lr = sliderLr ? sliderLr.value : "2e-4";

        var initialLoss = 2.65 + (Math.random() * 0.15 - 0.08);
        var targetLoss = 0.45 - (r >= 16 ? 0.08 : 0.0) - (epochs >= 30 ? 0.05 : 0.0);
        targetLoss = Math.max(0.28, targetLoss + (Math.random() * 0.04 - 0.02));

        var lossHistory = [];
        var currentEpoch = 0;

        safePlaySound("pop", 400);

        var trainInterval = setInterval(function () {
          currentEpoch++;
          var progressRatio = currentEpoch / epochs;
          var decay = Math.exp(-progressRatio * 3.2);
          var noise = (Math.random() - 0.5) * 0.06 * decay;
          var currentLoss = targetLoss + (initialLoss - targetLoss) * decay + noise;
          currentLoss = Math.max(0.25, currentLoss);
          lossHistory.push(currentLoss);

          drawLossCurve(lossHistory);

          if (trainProgressBar) {
            trainProgressBar.style.width = Math.round(progressRatio * 100) + "%";
          }
          if (trainStatusText) {
            trainStatusText.innerHTML = `Época <strong>${currentEpoch}/${epochs}</strong> · Pérdida Step: <span style="color:#38bdf8; font-family:monospace;">${currentLoss.toFixed(4)}</span>`;
          }

          if (currentEpoch >= epochs) {
            clearInterval(trainInterval);
            isTraining = false;
            btnTrain.disabled = false;
            btnTrain.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\"><path d=\"M8 5v14l11-7z\"/></svg><span>Re-entrenar Adaptadores LoRA</span>";

            trainedLossInitial = lossHistory[0];
            trainedLossFinal = lossHistory[lossHistory.length - 1];
            var reduction = (1 - trainedLossFinal / trainedLossInitial) * 100;

            if (valLossInit) valLossInit.textContent = trainedLossInitial.toFixed(4);
            if (valLossFinal) valLossFinal.textContent = trainedLossFinal.toFixed(4);
            if (valLossRedPct) valLossRedPct.textContent = reduction.toFixed(1) + "%";

            safePlaySound("success");
            if (trainStatusText) {
              trainStatusText.innerHTML = `<span style="color:#22c55e; font-weight:700;">¡Entrenamiento Exitoso! Reducción del ${reduction.toFixed(1)}% en Loss</span>`;
            }
          }
        }, 60);
      });
    }

    // 8. COMPARACIÓN DE INFERENCIA: MODELO BASE VS. MODELO LORA
    if (btnCompare && presetSelect) {
      btnCompare.addEventListener("click", async function () {
        var idx = parseInt(presetSelect.value, 10) || 0;
        var example = DATASET_EXAMPLES[idx] || DATASET_EXAMPLES[0];

        btnCompare.disabled = true;
        btnCompare.innerHTML = "<span class=\"spinner-border spinner-border-sm\"></span> Evaluando Inferencia...";

        if (badgeBaseStatus) {
          badgeBaseStatus.textContent = "Generando (Sin LoRA)...";
          badgeBaseStatus.style.background = "rgba(239, 68, 68, 0.2)";
        }
        if (badgeLoraStatus) {
          badgeLoraStatus.textContent = "Generando (Con LoRA)...";
          badgeLoraStatus.style.background = "rgba(34, 197, 94, 0.2)";
        }

        safePlaySound("pop", 600);

        // Streaming simultáneo
        streamText(respBoxBase, example.baseResp, 16, function () {
          if (badgeBaseStatus) {
            badgeBaseStatus.textContent = "Línea Base Genérica";
            badgeBaseStatus.style.background = "rgba(239, 68, 68, 0.15)";
          }
        });

        streamText(respBoxLora, example.loraResp, 16, function () {
          if (badgeLoraStatus) {
            badgeLoraStatus.textContent = "Adaptado al Dominio (LoRA)";
            badgeLoraStatus.style.background = "rgba(34, 197, 94, 0.25)";
          }
          btnCompare.disabled = false;
          btnCompare.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\"><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z\"/></svg><span>Comparar Respuestas en Vivo</span>";
          safePlaySound("chime");
        });
      });
    }

    // 9. GESTIÓN DE AUTOEVALUACIÓN QUIZ INTERACTIVO
    var quizOptions = document.querySelectorAll(".quiz-opt-btn");
    quizOptions.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var parent = btn.closest(".quiz-item");
        if (!parent) return;
        var allBtns = parent.querySelectorAll(".quiz-opt-btn");
        var feedback = parent.querySelector(".quiz-feedback-box");
        var isCorrect = btn.getAttribute("data-correct") === "true";

        allBtns.forEach(function (b) {
          b.disabled = true;
          if (b.getAttribute("data-correct") === "true") {
            b.style.background = "rgba(34, 197, 94, 0.2)";
            b.style.borderColor = "#22c55e";
            b.style.color = "#22c55e";
          } else {
            b.style.opacity = "0.6";
          }
        });

        if (isCorrect) {
          btn.style.background = "rgba(34, 197, 94, 0.3)";
          safePlaySound("success");
          if (feedback) {
            feedback.style.display = "block";
            feedback.className = "quiz-feedback-box feedback-success";
            feedback.innerHTML = "<strong>¡Correcto!</strong> " + (feedback.getAttribute("data-exp") || "Has seleccionado la justificación teórica y empírica correcta.");
          }
        } else {
          btn.style.background = "rgba(239, 68, 68, 0.3)";
          btn.style.borderColor = "#ef4444";
          btn.style.color = "#ef4444";
          safePlaySound("pop", 280);
          if (feedback) {
            feedback.style.display = "block";
            feedback.className = "quiz-feedback-box feedback-error";
            feedback.innerHTML = "<strong>Incorrecto.</strong> " + (feedback.getAttribute("data-exp") || "Revisa la formulación matemática de LoRA y la hipótesis de bajo rango intrínseco.");
          }
        }
      });
    });
  });
})();

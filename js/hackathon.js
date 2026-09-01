/**
 * Meta AI - Hackathon Interactive Mentorship & Builder Workbench Engine
 * Strict Professional Edition: Clean typography, vector icons, no emojis.
 * Features:
 * 1. Live Interactive Pipeline Simulator (Simulador Visual de Flujo de IA)
 * 2. Friendly Architectural Decision Wizard (Árbol de Decisiones Intuitivo)
 * 3. Colab & Hardware Resource Gauge (Semáforo de Hardware)
 * 4. Pre-submission Quality Checklist with Audio & Confetti Celebration
 */

(function(){
  "use strict";

  // 1. SIMULADOR INTERACTIVO DEL FLUJO DE IA (LIVE PIPELINE SIMULATOR)
  function initLivePipelineSimulator() {
    var queryInput = document.getElementById("sim-query-input");
    var runBtn = document.getElementById("sim-run-btn");
    var stepContainer = document.getElementById("sim-steps-container");
    var finalResultBox = document.getElementById("sim-final-result");
    var sampleBtns = document.querySelectorAll(".sim-sample-btn");

    if (!runBtn || !stepContainer) return;

    // Base de conocimiento precargada de ejemplo para el simulador
    var demoKnowledge = [
      { topic: "devolucion", text: "Política de Devoluciones (Art. 4): El cliente dispone de hasta 30 días naturales con empaque original y comprobante de compra para solicitar reembolso total.", score: 0.89 },
      { topic: "envio", text: "Tiempos de Entrega (Art. 2): Los envíos estándar demoran entre 2 y 4 días hábiles. El servicio prioritario se entrega en 24 horas hábiles.", score: 0.92 },
      { topic: "garantia", text: "Garantía de Fábrica (Art. 7): Todos los productos electrónicos cuentan con 12 meses de garantía directa ante defectos de manufactura.", score: 0.86 },
      { topic: "soporte", text: "Atención al Cliente (Art. 1): Los canales oficiales de soporte atienden de lunes a domingo de 08:00 a 20:00 horas.", score: 0.81 }
    ];

    sampleBtns.forEach(function(btn){
      btn.addEventListener("click", function(){
        if (queryInput) {
          queryInput.value = btn.getAttribute("data-query") || btn.textContent.replace(/^"|"$/g, '').trim();
          runSimulation();
        }
      });
    });

    runBtn.addEventListener("click", function(e){
      e.preventDefault();
      runSimulation();
    });

    function runSimulation() {
      var query = queryInput ? queryInput.value.trim() : "";
      if (!query) {
        query = "¿Puedo devolver un producto si ya abrí la caja original?";
        if (queryInput) queryInput.value = query;
      }

      if (window.SOUND && typeof window.SOUND.playPop === "function") {
        window.SOUND.playPop(520);
      }

      runBtn.disabled = true;
      runBtn.innerHTML = "<span>Procesando flujo de inferencia...</span>";
      if (finalResultBox) finalResultBox.style.display = "none";

      var qLower = query.toLowerCase();
      var detectedRoute = "FAST_LLM";
      var routeExplanation = "Consulta conversacional estándar o saludo. Se procesa directamente mediante inferencia rápida con latencia inferior a 0.5 segundos.";
      var matchedDoc = null;

      if (qLower.includes("devol") || qLower.includes("reembols") || qLower.includes("ticket") || qLower.includes("cambi")) {
        detectedRoute = "RAG_PIPELINE";
        routeExplanation = "La consulta requiere verificar las políticas oficiales de devolución y reembolso de la organización.";
        matchedDoc = demoKnowledge[0];
      } else if (qLower.includes("envi") || qLower.includes("entreg") || qLower.includes("tarda") || qLower.includes("llega")) {
        detectedRoute = "RAG_PIPELINE";
        routeExplanation = "La consulta solicita información logística sobre tiempos de entrega y coberturas de envío.";
        matchedDoc = demoKnowledge[1];
      } else if (qLower.includes("garant") || qLower.includes("fall") || qLower.includes("defect") || qLower.includes("repar")) {
        detectedRoute = "RAG_PIPELINE";
        routeExplanation = "La consulta requiere cotejar las cláusulas de garantía técnica de hardware.";
        matchedDoc = demoKnowledge[2];
      } else if (qLower.includes("json") || qLower.includes("formato") || qLower.includes("esquema") || qLower.includes("ficha") || qLower.includes("codigo")) {
        detectedRoute = "LORA_ADAPTER";
        routeExplanation = "La consulta exige una respuesta con validación estricta de estructura JSON tipada para interoperabilidad.";
      } else {
        matchedDoc = demoKnowledge[3];
      }

      // Animación secuencial de los 4 pasos
      stepContainer.innerHTML = `
        <div class="sim-step-card sim-step-active" id="step-1">
          <div class="sim-step-num">1</div>
          <div class="sim-step-body">
            <h5>Paso 1: Enrutador Inteligente de Consultas (router.py)</h5>
            <p>Evaluación semántica de la entrada: <em>"${query}"</em></p>
            <div class="sim-step-badge">Ruta Asignada: <strong>${detectedRoute}</strong></div>
            <p class="sim-step-sub">${routeExplanation}</p>
          </div>
        </div>
      `;

      setTimeout(function(){
        if (window.SOUND && typeof window.SOUND.playPop === "function") window.SOUND.playPop(440);
        
        var step2Content = "";
        if (detectedRoute === "RAG_PIPELINE" && matchedDoc) {
          step2Content = `
            <div class="sim-step-card sim-step-active" id="step-2">
              <div class="sim-step-num" style="background: var(--accent-info, #0284c7);">2</div>
              <div class="sim-step-body">
                <h5>Paso 2: Búsqueda en Base Vectorial (rag_engine.py)</h5>
                <p>Cálculo de similitud coseno sobre incrustaciones densas normalizadas:</p>
                <div class="sim-retrieved-quote">
                  "<strong>${matchedDoc.text}</strong>"<br>
                  <span style="color: var(--accent-info, #0284c7); font-size: 0.75rem; font-weight: 700;">Similitud Coseno: ${(matchedDoc.score * 100).toFixed(1)}% (Superior al umbral mínimo de 40%)</span>
                </div>
              </div>
            </div>
          `;
        } else if (detectedRoute === "LORA_ADAPTER") {
          step2Content = `
            <div class="sim-step-card sim-step-active" id="step-2">
              <div class="sim-step-num" style="background: #a855f7;">2</div>
              <div class="sim-step-body">
                <h5>Paso 2: Activación del Adaptador LoRA (lora_adapter.py)</h5>
                <p>Carga de matrices de bajo rango entrenadas para forzar la sintaxis JSON Schema sin texto conversacional no estructurado.</p>
              </div>
            </div>
          `;
        } else {
          step2Content = `
            <div class="sim-step-card sim-step-active" id="step-2">
              <div class="sim-step-num" style="background: var(--accent-success, #10b981);">2</div>
              <div class="sim-step-body">
                <h5>Paso 2: Inferencia Rápida Directa (Zero Retrieval Overhead)</h5>
                <p>No se requiere consulta documental externa. La solicitud se despacha al modelo base optimizado para baja latencia.</p>
              </div>
            </div>
          `;
        }
        stepContainer.innerHTML += step2Content;

        setTimeout(function(){
          if (window.SOUND && typeof window.SOUND.playPop === "function") window.SOUND.playPop(520);
          
          stepContainer.innerHTML += `
            <div class="sim-step-card sim-step-active" id="step-3">
              <div class="sim-step-num" style="background: var(--accent-success, #10b981);">3</div>
              <div class="sim-step-body">
                <h5>Paso 3: Síntesis Fáctica Condicionada (Meta Llama 3)</h5>
                <p>El modelo de lenguaje recibe el prompt enriquecido con la evidencia recuperada y redacta la respuesta respetando las restricciones de veracidad.</p>
              </div>
            </div>
          `;

          setTimeout(function(){
            if (window.SOUND && typeof window.SOUND.playChime === "function") window.SOUND.playChime();

            var finalAnswer = "";
            if (detectedRoute === "RAG_PIPELINE" && matchedDoc) {
              finalAnswer = `De acuerdo con la documentación institucional oficial: ${matchedDoc.text.toLowerCase()} Para iniciar el proceso, presente su comprobante en el canal correspondiente.`;
            } else if (detectedRoute === "LORA_ADAPTER") {
              finalAnswer = `{\n  "estado": "exitoso",\n  "tipo_solicitud": "soporte_tecnico",\n  "prioridad": "media",\n  "mensaje_usuario": "${query}",\n  "accion_sugerida": "crear_ticket_atencion"\n}`;
            } else {
              finalAnswer = `Bienvenido al sistema de asistencia técnica de IA. ¿En qué temática o procedimiento puedo orientarle el día de hoy?`;
            }

            if (finalResultBox) {
              finalResultBox.style.display = "block";
              finalResultBox.innerHTML = `
                <div style="background: var(--bg-surface); border: 1px solid var(--meta-blue-border); border-left: 5px solid var(--accent-success); border-radius: 12px; padding: 1.4rem; animation: mainFadeIn 0.3s ease;">
                  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem;">
                    <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--accent-success); background: rgba(5, 150, 105, 0.12); padding: 0.25rem 0.6rem; border-radius: 6px;">
                      Respuesta Generada y Auditada
                    </span>
                    <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">Latencia total: ~310 ms</span>
                  </div>
                  <h5 style="font-family: var(--font-head); font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.6rem;">
                    Salida Entregada al Usuario Final:
                  </h5>
                  ${detectedRoute === "LORA_ADAPTER" ? 
                    `<pre style="background: var(--bg-subtle-alt); padding: 0.9rem; border-radius: 8px; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-primary); overflow-x: auto;"><code>${finalAnswer}</code></pre>` :
                    `<p style="font-size: 0.95rem; line-height: 1.65; color: var(--text-primary); margin: 0;">${finalAnswer}</p>`
                  }
                  ${matchedDoc ? `<div style="margin-top: 0.8rem; font-size: 0.78rem; color: var(--text-muted); border-top: 1px dashed var(--border-subtle); padding-top: 0.6rem;">Fuente de Verificación Documental: <strong>${matchedDoc.topic.toUpperCase()}</strong> (Anclaje Fáctico Verificado)</div>` : ''}
                </div>
              `;
            }

            runBtn.disabled = false;
            runBtn.innerHTML = `
              <svg fill="currentColor" height="18" viewBox="0 0 24 24" width="18"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"></path></svg>
              <span>Ejecutar Nueva Consulta</span>
            `;
          }, 450);
        }, 450);
      }, 450);
    }
  }

  // 2. ÁRBOL INTERACTIVO DE DECISIONES ARQUITECTÓNICAS
  function initFriendlyDecisionWizard() {
    var form = document.getElementById("friendly-wizard-form");
    var resultBox = document.getElementById("friendly-wizard-result");
    if (!form || !resultBox) return;

    function evaluateWizard() {
      var projectType = document.querySelector('input[name="wiz-project"]:checked')?.value || "ecommerce";
      var outputStyle = document.querySelector('input[name="wiz-output"]:checked')?.value || "friendly_text";
      var computeEnv = document.querySelector('input[name="wiz-compute"]:checked')?.value || "colab_free";

      var title = "";
      var badge = "";
      var explanation = "";
      var steps = [];
      var templateId = "";

      if (projectType === "ecommerce") {
        title = "Plantilla 1: Asistente de Operaciones Comerciales y Políticas de Devolución (RAG)";
        badge = "Recomendada para Comercio Electrónico y Servicios";
        explanation = "La solución indexa el catálogo de productos y el compendio de políticas en archivos de texto estructurado. Ante una consulta de cambio o reembolso, el sistema recupera la cláusula fáctica exacta y genera una respuesta fundamentada sin riesgo de alucinación.";
        steps = [
          "1. Incorpore las políticas comerciales en la matriz de documentos de <code>rag_engine.py</code>.",
          "2. Configure el enrutador para clasificar consultas de logística y devoluciones.",
          "3. Ejecute el entorno en Google Colab para validar latencia y precisión."
        ];
        templateId = "plantilla-a";
      } else if (projectType === "legal") {
        title = "Plantilla 2: Asesor Normativo Institucional y Trámites Regulatorios";
        badge = "Recomendada para Entornos Académicos, Legales y Corporativos";
        explanation = "La arquitectura procesa estatutos, reglamentos internos y manuales de procedimientos. Ante una consulta de requisitos o plazos, cita el artículo correspondiente y detalla el flujo de ejecución prescrito.";
        steps = [
          "1. Inserte los artículos reglamentarios en <code>rag_engine.py</code>.",
          "2. Ajuste el umbral de similitud coseno en 0.40 para garantizar rigor fáctico.",
          "3. Exponga el servicio mediante FastAPI para consumo departamental."
        ];
        templateId = "plantilla-b";
      } else if (projectType === "json_reports") {
        title = "Plantilla 3: Clasificador de Incidencias y Generador Estructurado JSON";
        badge = "Recomendada para Interoperabilidad de APIs y Bases de Datos";
        explanation = "El sistema recibe reportes en lenguaje natural y genera objetos JSON validados por esquemas Pydantic con tipado fuerte (categoría, severidad, resumen de acción) para integración con sistemas externos.";
        steps = [
          "1. Especifique el modelo de datos Pydantic en <code>api_server.py</code>.",
          "2. Incorpore ejemplos Few-Shot en el System Prompt o integre el adaptador LoRA.",
          "3. Audite la consistencia de salida mediante Swagger UI (<code>/docs</code>)."
        ];
        templateId = "plantilla-c";
      } else {
        title = "Plantilla 4: Tutor Educativo Adaptativo y Evaluación Socrática";
        badge = "Recomendada para Educación y Capacitación Técnica";
        explanation = "La arquitectura desglosa conceptos técnicos complejos de forma progresiva, aplicando formulación de preguntas orientadas a evaluar y retroalimentar el dominio conceptual del usuario.";
        steps = [
          "1. Configure las directivas pedagógicas en el System Prompt.",
          "2. Inyecte los contenidos temáticos en la base vectorial RAG.",
          "3. Valide las respuestas del estudiante con retroalimentación formativa."
        ];
        templateId = "plantilla-d";
      }

      resultBox.innerHTML = `
        <div style="background: var(--bg-surface); border: 1px solid var(--meta-blue-border); border-left: 5px solid var(--meta-blue); border-radius: 12px; padding: 1.5rem; animation: mainFadeIn 0.3s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem;">
            <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--meta-blue); background: var(--meta-blue-subtle); padding: 0.25rem 0.6rem; border-radius: 6px;">${badge}</span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">Recomendación de Arquitectura</span>
          </div>
          <h4 style="font-family: var(--font-head); font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.6rem;">${title}</h4>
          <p style="font-size: 0.92rem; line-height: 1.65; color: var(--text-secondary); margin-bottom: 1rem;">${explanation}</p>
          
          <div style="background: var(--bg-subtle-alt); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-subtle); margin-bottom: 1rem;">
            <strong style="font-size: 0.85rem; color: var(--text-primary); display: block; margin-bottom: 0.5rem;">Fases de Implementación Sugeridas:</strong>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.86rem; color: var(--text-secondary); line-height: 1.65;">
              ${steps.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem;">
            <span style="font-size: 0.82rem; color: var(--text-muted);">Consulte el código correspondiente a esta plantilla:</span>
            <a href="#${templateId}" class="btn-primary" style="font-size: 0.82rem; padding: 0.45rem 0.9rem; text-decoration: none; border-radius: 8px; font-weight: 700;">Ver Plantilla en Detalle &darr;</a>
          </div>
        </div>
      `;

      if (window.SOUND && typeof window.SOUND.playPop === "function") {
        window.SOUND.playPop(480);
      }
    }

    form.addEventListener("change", evaluateWizard);
    evaluateWizard();
  }

  // 3. SEMÁFORO DE HARDWARE & RECURSOS GOOGLE COLAB
  function initColabSemaphore() {
    var modelSelect = document.getElementById("colab-model-choice");
    var modeSelect = document.getElementById("colab-mode-choice");
    var semaphoreBox = document.getElementById("colab-semaphore-box");

    if (!modelSelect || !semaphoreBox) return;

    function evaluateHardware() {
      var model = modelSelect.value;
      var mode = modeSelect.value;

      var vram = 3.2;
      var statusTitle = "Totalmente Viable en Google Colab (GPU Tesla T4 15 GB)";
      var statusColor = "var(--accent-success, #10b981)";
      var statusDesc = "Consumo de memoria holgado. Permite ejecución estable sin riesgo de saturación ni desconexión en entornos estándar de GPU.";
      var statusBadge = "Estado: Óptimo";

      if (model === "tinyllama") {
        vram = mode === "lora" ? 4.2 : 2.5;
      } else if (model === "llama_1b") {
        vram = mode === "lora" ? 5.1 : 3.2;
      } else if (model === "llama_3b") {
        vram = mode === "lora" ? 8.4 : 5.8;
      } else if (model === "llama_8b") {
        vram = mode === "lora" ? 11.8 : 8.5;
        if (mode === "lora") {
          statusTitle = "Viable en Colab con Cuantización NF4 4-bit (QLoRA)";
          statusColor = "var(--accent-warning, #f59e0b)";
          statusDesc = "Compatible con la GPU T4 de 15 GB. Se recomienda establecer Batch Size = 1 y habilitar acumulación de gradientes para evitar picos transitorios.";
          statusBadge = "Estado: Requiere QLoRA";
        }
      }

      semaphoreBox.innerHTML = `
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-left: 5px solid ${statusColor}; border-radius: 12px; padding: 1.2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div style="max-width: 550px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
              <span class="badge-role" style="background: rgba(8,102,255,0.1); color: var(--text-primary); font-weight: 700; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px;">${statusBadge}</span>
              <strong style="font-size: 1rem; color: var(--text-primary);">${statusTitle}</strong>
            </div>
            <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.55; margin: 0;">${statusDesc}</p>
          </div>
          <div style="text-align: right; min-width: 140px;">
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: var(--text-muted); display: block;">Consumo VRAM Estimado:</span>
            <div style="font-family: var(--font-head); font-size: 1.6rem; font-weight: 800; color: ${statusColor};">
              ~${vram.toFixed(1)} GB <span style="font-size: 0.8rem; color: var(--text-muted);">/ 15.0 GB</span>
            </div>
          </div>
        </div>
      `;

      if (window.SOUND && typeof window.SOUND.playPop === "function") {
        window.SOUND.playPop(440);
      }
    }

    modelSelect.addEventListener("change", evaluateHardware);
    modeSelect.addEventListener("change", evaluateHardware);
    evaluateHardware();
  }

  // 4. CHECKLIST INTERACTIVO DE CALIDAD CON AUDITORÍA LOCAL
  function initQualityChecklist() {
    var container = document.getElementById("friendly-checklist-container");
    var progressText = document.getElementById("friendly-progress-text");
    var progressBar = document.getElementById("friendly-progress-bar");
    var celebrationMsg = document.getElementById("checklist-celebration-msg");
    if (!container) return;

    var checkboxes = container.querySelectorAll('input[type="checkbox"]');
    var storageKey = "hackathon_professional_checklist_v3";

    var savedState = {};
    try {
      savedState = JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch(e){}

    checkboxes.forEach(function(cb, index){
      if (savedState["item_" + index]) {
        cb.checked = true;
      }
      cb.addEventListener("change", function(){
        updateChecklist();
        saveChecklist();
        if (cb.checked && window.SOUND && typeof window.SOUND.playPop === "function") {
          window.SOUND.playPop(580);
        }
      });
    });

    function saveChecklist() {
      var state = {};
      checkboxes.forEach(function(cb, index){
        state["item_" + index] = cb.checked;
      });
      localStorage.setItem(storageKey, JSON.stringify(state));
    }

    function updateChecklist() {
      var total = checkboxes.length;
      var checked = 0;
      checkboxes.forEach(function(cb){
        if (cb.checked) checked++;
      });
      var pct = Math.round((checked / total) * 100);
      if (progressText) progressText.textContent = `${checked} de ${total} verificados (${pct}%)`;
      if (progressBar) progressBar.style.width = pct + "%";

      if (pct === 100) {
        if (celebrationMsg) celebrationMsg.style.display = "block";
        if (window.celebrateConfetti) window.celebrateConfetti();
        if (window.SOUND && typeof window.SOUND.playChime === "function") window.SOUND.playChime();
      } else {
        if (celebrationMsg) celebrationMsg.style.display = "none";
      }
    }

    updateChecklist();
  }

  // Inicialización global cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){
      initLivePipelineSimulator();
      initFriendlyDecisionWizard();
      initColabSemaphore();
      initQualityChecklist();
    });
  } else {
    initLivePipelineSimulator();
    initFriendlyDecisionWizard();
    initColabSemaphore();
    initQualityChecklist();
  }

})();

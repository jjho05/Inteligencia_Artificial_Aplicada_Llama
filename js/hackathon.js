/**
 * Meta AI - Hackathon Interactive Mentorship & Builder Workbench Engine
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
      { topic: "devolucion", text: "Política de Devoluciones (Art. 4): Tienes hasta 30 días naturales con empaque original y ticket de compra para solicitar reembolso total.", score: 0.89 },
      { topic: "envio", text: "Tiempos de Entrega (Art. 2): Los envíos estándar tardan entre 2 y 4 días hábiles. El envío prioritario llega en 24 horas.", score: 0.92 },
      { topic: "garantia", text: "Garantía de Fábrica (Art. 7): Todos los productos electrónicos cuentan con 12 meses de garantía directa ante defectos técnicos.", score: 0.86 },
      { topic: "soporte", text: "Atención al Cliente (Art. 1): Nuestro canal oficial de WhatsApp y correo atiende de lunes a domingo de 08:00 a 20:00 hrs.", score: 0.81 }
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
        query = "¿Puedo devolver un producto si ya abrí la caja?";
        if (queryInput) queryInput.value = query;
      }

      if (window.SOUND && typeof window.SOUND.playPop === "function") {
        window.SOUND.playPop(520);
      }

      runBtn.disabled = true;
      runBtn.innerHTML = "<span>⏳ Simulando proceso paso a paso...</span>";
      if (finalResultBox) finalResultBox.style.display = "none";

      var qLower = query.toLowerCase();
      var detectedRoute = "FAST_LLM";
      var routeExplanation = "Consulta general o saludo común. Se procesa directamente con el modelo de lenguaje ligero en menos de 0.5 segundos.";
      var matchedDoc = null;

      if (qLower.includes("devol") || qLower.includes("reembols") || qLower.includes("ticket") || qLower.includes("cambi")) {
        detectedRoute = "RAG_PIPELINE";
        routeExplanation = "La pregunta requiere consultar las políticas oficiales de devolución de la empresa.";
        matchedDoc = demoKnowledge[0];
      } else if (qLower.includes("envi") || qLower.includes("entreg") || qLower.includes("tarda") || qLower.includes("llega")) {
        detectedRoute = "RAG_PIPELINE";
        routeExplanation = "La pregunta consulta sobre tiempos y costos de paquetería y logística.";
        matchedDoc = demoKnowledge[1];
      } else if (qLower.includes("garant") || qLower.includes("fall") || qLower.includes("defect") || qLower.includes("repar")) {
        detectedRoute = "RAG_PIPELINE";
        routeExplanation = "La pregunta solicita información de garantías técnicas de productos.";
        matchedDoc = demoKnowledge[2];
      } else if (qLower.includes("json") || qLower.includes("formato") || qLower.includes("esquema") || qLower.includes("ficha") || qLower.includes("codigo")) {
        detectedRoute = "LORA_ADAPTER";
        routeExplanation = "La pregunta exige una salida estrictamente estructurada en formato JSON para conectarse a otra aplicación.";
      } else {
        matchedDoc = demoKnowledge[3];
      }

      // Animación secuencial de los 4 pasos
      stepContainer.innerHTML = `
        <div class="sim-step-card sim-step-active" id="step-1">
          <div class="sim-step-num">1</div>
          <div class="sim-step-body">
            <h5>Paso 1: El Mesero Inteligente (Router)</h5>
            <p>Analizando la intención de la frase: <em>"${query}"</em></p>
            <div class="sim-step-badge">Ruta detectada: <strong>${detectedRoute}</strong></div>
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
              <div class="sim-step-num" style="background:#0284c7;">2</div>
              <div class="sim-step-body">
                <h5>Paso 2: Consulta al Recetario (RAG &amp; Vectores)</h5>
                <p>Buscando en los documentos de la empresa mediante <strong>Similitud Coseno</strong>:</p>
                <div class="sim-retrieved-quote">
                  "<strong>${matchedDoc.text}</strong>"<br>
                  <span style="color:#0284c7; font-size:0.75rem; font-weight:700;">Similitud calculada: ${(matchedDoc.score * 100).toFixed(0)}% (Superior al umbral de 40%)</span>
                </div>
              </div>
            </div>
          `;
        } else if (detectedRoute === "LORA_ADAPTER") {
          step2Content = `
            <div class="sim-step-card sim-step-active" id="step-2">
              <div class="sim-step-num" style="background:#a855f7;">2</div>
              <div class="sim-step-body">
                <h5>Paso 2: Activación del Adaptador de Estilo (LoRA)</h5>
                <p>Cargando el esquema de formato para forzar que el modelo responda en <strong>JSON estricto</strong> sin inventar texto adicional.</p>
              </div>
            </div>
          `;
        } else {
          step2Content = `
            <div class="sim-step-card sim-step-active" id="step-2">
              <div class="sim-step-num" style="background:#10b981;">2</div>
              <div class="sim-step-body">
                <h5>Paso 2: Ruta Rápida Directa (Zero Latency)</h5>
                <p>No se requiere buscar en documentos externos. La consulta se resuelve con la inteligencia conversacional base del modelo.</p>
              </div>
            </div>
          `;
        }
        stepContainer.innerHTML += step2Content;

        setTimeout(function(){
          if (window.SOUND && typeof window.SOUND.playPop === "function") window.SOUND.playPop(520);
          
          stepContainer.innerHTML += `
            <div class="sim-step-card sim-step-active" id="step-3">
              <div class="sim-step-num" style="background:#10b981;">3</div>
              <div class="sim-step-body">
                <h5>Paso 3: Redacción Empática con Meta Llama 3</h5>
                <p>El modelo recibe la pregunta junto con la evidencia exacta y redacta una respuesta clara, amable y 100% verídica.</p>
              </div>
            </div>
          `;

          setTimeout(function(){
            if (window.SOUND && typeof window.SOUND.playChime === "function") window.SOUND.playChime();

            var finalAnswer = "";
            if (detectedRoute === "RAG_PIPELINE" && matchedDoc) {
              finalAnswer = `¡Hola! Con mucho gusto te oriento: según nuestras políticas oficiales, ${matchedDoc.text.toLowerCase()} Si tienes tu comprobante a la mano, con gusto te ayudamos con el proceso de inmediato.`;
            } else if (detectedRoute === "LORA_ADAPTER") {
              finalAnswer = `{\n  "estado": "exitoso",\n  "tipo_solicitud": "soporte_tecnico",\n  "prioridad": "media",\n  "mensaje_usuario": "${query}",\n  "accion_sugerida": "crear_ticket_atencion"\n}`;
            } else {
              finalAnswer = `¡Hola! Con mucho gusto te ayudo. Soy tu asistente inteligente para este proyecto. ¿En qué te puedo orientar hoy?`;
            }

            if (finalResultBox) {
              finalResultBox.style.display = "block";
              finalResultBox.innerHTML = `
                <div style="background:var(--bg-surface); border:1px solid var(--meta-blue-border); border-left:5px solid var(--accent-success); border-radius:12px; padding:1.4rem; animation:mainFadeIn 0.3s ease;">
                  <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.6rem;">
                    <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--accent-success); background:rgba(5,150,105,0.12); padding:0.25rem 0.6rem; border-radius:6px;">
                      ✓ Respuesta Generada con Éxito
                    </span>
                    <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">Latencia estimada: ~320 ms</span>
                  </div>
                  <h5 style="font-family:var(--font-head); font-size:1.05rem; font-weight:800; color:var(--text-primary); margin-bottom:0.6rem;">
                    Resultado que verá tu usuario final:
                  </h5>
                  ${detectedRoute === "LORA_ADAPTER" ? 
                    `<pre style="background:var(--bg-subtle-alt); padding:0.9rem; border-radius:8px; font-family:var(--font-mono); font-size:0.85rem; color:var(--text-primary); overflow-x:auto;"><code>${finalAnswer}</code></pre>` :
                    `<p style="font-size:0.95rem; line-height:1.65; color:var(--text-primary); margin:0;">${finalAnswer}</p>`
                  }
                  ${matchedDoc ? `<div style="margin-top:0.8rem; font-size:0.78rem; color:var(--text-muted); border-top:1px dashed var(--border-subtle); padding-top:0.6rem;">📄 <strong>Documento fuente utilizado:</strong> ${matchedDoc.topic.toUpperCase()} (Cero Alucinación)</div>` : ''}
                </div>
              `;
            }

            runBtn.disabled = false;
            runBtn.innerHTML = `
              <svg fill="currentColor" height="18" viewBox="0 0 24 24" width="18"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"></path></svg>
              <span>Probar Otra Pregunta</span>
            `;
          }, 450);
        }, 450);
      }, 450);
    }
  }

  // 2. ÁRBOL INTERACTIVO DE DECISIONES SÚPER AMIGABLE
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
        title = "Plantilla Proyecto A: Asistente de Tienda & Devoluciones con RAG";
        badge = "Ideal para Negocios, Comercios y Emprendimientos";
        explanation = "Tu proyecto guardará el catálogo de productos y las políticas de envío/devolución en archivos de texto. Cuando el cliente pregunte por un cambio, el sistema buscará la política exacta y responderá con amabilidad sin inventar nada.";
        steps = [
          "1. Copia tus políticas de tienda en la lista de textos de <code>rag_engine.py</code>",
          "2. Usa el enrutador para detectar preguntas de envíos o devoluciones.",
          "3. Ejecuta el cuaderno en Google Colab para probarlo gratis."
        ];
        templateId = "plantilla-a";
      } else if (projectType === "legal") {
        title = "Plantilla Proyecto B: Asesor de Reglamentos y Trámites Escolares/Laborales";
        badge = "Ideal para Escuelas, Universidades y Empresas";
        explanation = "Tu proyecto indexará reglamentos, estatutos o manuales de titulación/vacaciones. Cuando un alumno o empleado pregunte requisitos, el sistema citará el artículo exacto y los pasos a seguir.";
        steps = [
          "1. Pega los artículos de tu reglamento en <code>rag_engine.py</code>",
          "2. Configura el umbral de similitud en 0.40 para máxima precisión fáctica.",
          "3. Conéctalo a la API de FastAPI para que tus compañeros lo consulten."
        ];
        templateId = "plantilla-b";
      } else if (projectType === "json_reports") {
        title = "Plantilla Proyecto C: Clasificador de Tickets y Generador de JSON";
        badge = "Ideal para Conectar a Otras Aplicaciones o Bases de Datos";
        explanation = "Tu proyecto recibirá mensajes de clientes y los convertirá automáticamente en objetos estructurados (JSON) con campos como categoría, urgencia y resumen para alimentar un panel de administración.";
        steps = [
          "1. Define tu estructura de datos con modelos de Pydantic en <code>api_server.py</code>",
          "2. Agrega 2 ejemplos Few-Shot en el prompt o usa el adaptador LoRA.",
          "3. Prueba el envío de datos mediante Swagger UI (<code>/docs</code>)."
        ];
        templateId = "plantilla-c";
      } else {
        title = "Plantilla Proyecto D: Tutor de Estudio Personalizado y Evaluador";
        badge = "Ideal para Educación y Capacitación de Personal";
        explanation = "Tu proyecto explicará temas difíciles paso a paso usando la técnica del 'Profesor Socrático', haciendo preguntas de opción múltiple al estudiante para evaluar su aprendizaje.";
        steps = [
          "1. Configura el prompt del sistema con el rol de Tutor Paciente.",
          "2. Inyecta el temario o materia en el motor RAG.",
          "3. Evalúa las respuestas del alumno con retroalimentación instantánea."
        ];
        templateId = "plantilla-d";
      }

      resultBox.innerHTML = `
        <div style="background:var(--bg-surface); border:1px solid var(--meta-blue-border); border-left:5px solid var(--meta-blue); border-radius:12px; padding:1.5rem; animation:mainFadeIn 0.3s ease;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.6rem;">
            <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--meta-blue); background:var(--meta-blue-subtle); padding:0.25rem 0.6rem; border-radius:6px;">${badge}</span>
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">Recomendación Personalizada</span>
          </div>
          <h4 style="font-family:var(--font-head); font-size:1.15rem; font-weight:800; color:var(--text-primary); margin-bottom:0.6rem;">${title}</h4>
          <p style="font-size:0.92rem; line-height:1.65; color:var(--text-secondary); margin-bottom:1rem;">${explanation}</p>
          
          <div style="background:var(--bg-subtle-alt); border-radius:8px; padding:1rem; border:1px solid var(--border-subtle); margin-bottom:1rem;">
            <strong style="font-size:0.85rem; color:var(--text-primary); display:block; margin-bottom:0.5rem;">Tus 3 Pasos Inmediatos para Construirlo:</strong>
            <ul style="margin:0; padding-left:1.2rem; font-size:0.86rem; color:var(--text-secondary); line-height:1.65;">
              ${steps.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem;">
            <span style="font-size:0.82rem; color:var(--text-muted);">💡 ¿Quieres usar el código base de esta plantilla?</span>
            <a href="#${templateId}" class="btn-primary" style="font-size:0.82rem; padding:0.45rem 0.9rem; text-decoration:none; border-radius:8px; font-weight:700;">Ver Plantilla en Pantalla &darr;</a>
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

  // 3. SEMÁFORO DE HARDWARE & GOOGLE COLAB GRATUITO
  function initColabSemaphore() {
    var modelSelect = document.getElementById("colab-model-choice");
    var modeSelect = document.getElementById("colab-mode-choice");
    var semaphoreBox = document.getElementById("colab-semaphore-box");

    if (!modelSelect || !semaphoreBox) return;

    function evaluateHardware() {
      var model = modelSelect.value;
      var mode = modeSelect.value;

      var vram = 3.2;
      var statusTitle = "¡100% Viable y Gratuito en Google Colab!";
      var statusColor = "var(--accent-success)";
      var statusDesc = "Tu configuración consume muy poca memoria. Puedes ejecutarla con total tranquilidad en Google Colab sin pagar nada y sin miedo a que se desconecte.";
      var icon = "🟢";

      if (model === "tinyllama") {
        vram = mode === "lora" ? 4.2 : 2.5;
      } else if (model === "llama_1b") {
        vram = mode === "lora" ? 5.1 : 3.2;
      } else if (model === "llama_3b") {
        vram = mode === "lora" ? 8.4 : 5.8;
      } else if (model === "llama_8b") {
        vram = mode === "lora" ? 11.8 : 8.5;
        if (mode === "lora") {
          statusTitle = "Viable en Colab (Usa Cuantización NF4 4-bit)";
          statusColor = "var(--accent-warning)";
          statusDesc = "Cabe en la GPU gratuita de Colab (15 GB). Solo asegúrate de usar Batch Size = 1 y activar QLoRA para evitar picos de memoria.";
          icon = "🟡";
        }
      }

      semaphoreBox.innerHTML = `
        <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-left:5px solid ${statusColor}; border-radius:12px; padding:1.2rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
          <div style="max-width:550px;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.3rem;">
              <span style="font-size:1.3rem;">${icon}</span>
              <strong style="font-size:1rem; color:var(--text-primary);">${statusTitle}</strong>
            </div>
            <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.55; margin:0;">${statusDesc}</p>
          </div>
          <div style="text-align:right; min-width:140px;">
            <span style="font-size:0.75rem; text-transform:uppercase; font-weight:800; color:var(--text-muted); display:block;">Consumo de Memoria:</span>
            <div style="font-family:var(--font-head); font-size:1.6rem; font-weight:800; color:${statusColor};">
              ~${vram.toFixed(1)} GB <span style="font-size:0.8rem; color:var(--text-muted);">/ 15 GB</span>
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

  // 4. CHECKLIST INTERACTIVO CON PERSISTENCIA Y CELEBRACIÓN DE CONFETI
  function initQualityChecklist() {
    var container = document.getElementById("friendly-checklist-container");
    var progressText = document.getElementById("friendly-progress-text");
    var progressBar = document.getElementById("friendly-progress-bar");
    var celebrationMsg = document.getElementById("checklist-celebration-msg");
    if (!container) return;

    var checkboxes = container.querySelectorAll('input[type="checkbox"]');
    var storageKey = "hackathon_friendly_checklist_v2";

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

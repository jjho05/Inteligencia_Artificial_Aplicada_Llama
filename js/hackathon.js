/**
 * Meta AI - Hackathon Mentorship & Builder Workbench Engine
 * Features: Interactive Architectural Decision Wizard, Dynamic VRAM & Resource Calculator,
 * Pre-submission Checklist with localStorage persistence, and Code Block helpers.
 */

(function(){
  "use strict";

  // 1. ÁRBOL DE DECISIONES ARQUITECTÓNICAS (DECISION WIZARD)
  function initDecisionWizard() {
    var form = document.getElementById("wizard-form");
    var resultBox = document.getElementById("wizard-result-box");
    if (!form || !resultBox) return;

    function evaluateArchitecture() {
      var knowType = document.querySelector('input[name="wizard-knowledge"]:checked')?.value || "dynamic";
      var outFormat = document.querySelector('input[name="wizard-output"]:checked')?.value || "text";
      var hwType = document.querySelector('input[name="wizard-hw"]:checked')?.value || "colab";

      var archTitle = "";
      var archBadge = "";
      var archDesc = "";
      var techStack = [];
      var codeBlocks = [];

      if (knowType === "dynamic" && outFormat === "text") {
        archTitle = "Arquitectura RAG Semántico Puro con SentenceTransformers";
        archBadge = "Recomendada para Conocimiento Cambiante & Cero Alucinaciones";
        archDesc = "Tu caso de uso se beneficia al máximo desacoplando el almacenamiento de datos del modelo de lenguaje. Los documentos se indexan vectorialmente y se recuperan mediante similitud coseno, inyectándose en el prompt de Llama 3 para redactar la respuesta sin riesgo de inventar datos.";
        techStack = ["SentenceTransformers all-MiniLM-L6-v2", "Similitud Coseno Normalizada", "Meta Llama 3.1 8B (Groq LPU / Colab)", "FastAPI"];
        codeBlocks = ["Bloque B: rag_engine.py", "Bloque D: api_server.py"];
      } else if (knowType === "specialized" || outFormat === "json") {
        archTitle = "Arquitectura de Adaptación Fina LoRA / QLoRA (PEFT)";
        archBadge = "Recomendada para Formatos Estrictos & Jerga Especializada";
        archDesc = "Al requerir una estructura de salida rígida (JSON Schema estricto / SQL) o una terminología técnica específica, LoRA inyecta matrices de bajo rango en las capas de atención para forzar la sintaxis sin sobrecargar el prompt ni aumentar el costo por token.";
        techStack = ["Hugging Face PEFT (r=8, alpha=16)", "SFTTrainer (TRL)", "TinyLlama 1.1B / Llama 3.2 1B (FP16)", "Pydantic Schemas"];
        codeBlocks = ["Bloque C: lora_adapter.py", "Bloque D: api_server.py"];
      } else if (knowType === "hybrid" || (knowType === "dynamic" && outFormat === "json")) {
        archTitle = "Arquitectura Híbrida de Alta Precisión (RAG + LoRA)";
        archBadge = "El Estándar Empresarial Más Robusto";
        archDesc = "Combina lo mejor de ambos mundos: el motor RAG vectorial inyecta las políticas y datos actualizados en tiempo real, mientras que el adaptador LoRA garantiza que el modelo siempre responda en el formato JSON o tono institucional estricto.";
        techStack = ["RAG Vectorial con Embeddings R^384", "LoRA Adapter en Proyecciones Q/V", "FastAPI Streaming SSE", "Llama Guard"];
        codeBlocks = ["Bloque A: router.py", "Bloque B: rag_engine.py", "Bloque C: lora_adapter.py", "Bloque D: api_server.py"];
      } else {
        archTitle = "Arquitectura Model Router Multi-Modelo con Groq LPU";
        archBadge = "Máxima Eficiencia de Costos & Latencia";
        archDesc = "Clasifica las consultas entrantes por nivel de dificultad: envía consultas simples a un modelo ligero (Llama 8B / 20B) con latencia < 0.8s, y redirige consultas analíticas complejas al modelo grande (70B / 120B) o reasoning CoT (Qwen 27B).";
        techStack = ["Groq LPU API", "Heurística de Complejidad / Prompt Classifier", "FastAPI Asíncrono"];
        codeBlocks = ["Bloque A: router.py", "Bloque D: api_server.py"];
      }

      resultBox.innerHTML = `
        <div style="background: var(--bg-surface); border: 1px solid var(--meta-blue-border); border-left: 5px solid var(--meta-blue); border-radius: 12px; padding: 1.5rem; animation: mainFadeIn 0.3s ease;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.6rem;">
            <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--meta-blue); background:var(--meta-blue-subtle); padding:0.25rem 0.6rem; border-radius:6px;">${archBadge}</span>
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">Recomendación IA</span>
          </div>
          <h4 style="font-family:var(--font-head); font-size:1.15rem; font-weight:800; color:var(--text-primary); margin-bottom:0.6rem;">${archTitle}</h4>
          <p style="font-size:0.9rem; line-height:1.65; color:var(--text-secondary); margin-bottom:1rem;">${archDesc}</p>
          
          <div style="margin-bottom:1rem;">
            <strong style="font-size:0.82rem; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:0.4rem;">Stack Tecnológico Sugerido:</strong>
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
              ${techStack.map(t => `<span class="badge-role" style="background:var(--bg-subtle); border:1px solid var(--border-subtle); color:var(--text-primary); font-size:0.75rem; padding:0.25rem 0.6rem; border-radius:6px;">${t}</span>`).join('')}
            </div>
          </div>

          <div style="background:var(--bg-subtle-alt); border-radius:8px; padding:0.9rem 1.1rem; border:1px solid var(--border-subtle);">
            <strong style="font-size:0.84rem; color:var(--text-primary); display:block; margin-bottom:0.3rem;">Bloques de Código del Starter Kit a Utilizar:</strong>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
              ${codeBlocks.map(b => `<a href="#${b.split(':')[1].trim().replace('.', '_')}" style="color:var(--meta-blue); font-weight:700; font-size:0.84rem; text-decoration:underline;">${b}</a>`).join(' &bull; ')}
            </div>
          </div>
        </div>
      `;
      if (window.SOUND && typeof window.SOUND.playPop === "function") {
        window.SOUND.playPop(520);
      }
    }

    form.addEventListener("change", evaluateArchitecture);
    evaluateArchitecture();
  }

  // 2. CALCULADORA DE RECURSOS & MEMORIA VRAM
  function initVramCalculator() {
    var modelSelect = document.getElementById("vram-model-select");
    var quantSelect = document.getElementById("vram-quant-select");
    var modeSelect = document.getElementById("vram-mode-select");
    var batchSelect = document.getElementById("vram-batch-select");
    var outputBox = document.getElementById("vram-result-box");

    if (!modelSelect || !outputBox) return;

    function calculateVRAM() {
      var model = modelSelect.value;
      var quant = quantSelect.value;
      var mode = modeSelect.value;
      var batch = parseInt(batchSelect.value, 10) || 1;

      // Parámetros en miles de millones
      var paramCount = 1.1;
      if (model === "tinyllama-1.1b") paramCount = 1.1;
      else if (model === "llama-3.2-1b") paramCount = 1.2;
      else if (model === "llama-3.2-3b") paramCount = 3.2;
      else if (model === "llama-3.1-8b") paramCount = 8.0;
      else if (model === "llama-3.3-70b") paramCount = 70.0;

      // Bytes por peso base
      var bytesPerParam = 2.0; // FP16
      if (quant === "int8") bytesPerParam = 1.0;
      else if (quant === "nf4") bytesPerParam = 0.55;

      var baseWeightVram = paramCount * bytesPerParam; // GB

      var totalVram = baseWeightVram;
      var overhead = 0.6; // CUDA Context + PyTorch runtime

      if (mode === "inference") {
        var kvCache = 0.3 * batch;
        totalVram = baseWeightVram + kvCache + overhead;
      } else if (mode === "rag") {
        var embeddingsVram = 0.4;
        var kvCache = 0.4 * batch;
        totalVram = baseWeightVram + embeddingsVram + kvCache + overhead;
      } else if (mode === "lora_r8") {
        var trainableParams = paramCount * 0.001;
        var adamwMemory = trainableParams * 8.0; // 8 bytes por param entrenable
        var gradients = trainableParams * 2.0;
        var activations = 0.8 * batch;
        totalVram = baseWeightVram + adamwMemory + gradients + activations + overhead + 0.8;
      } else if (mode === "lora_r16") {
        var trainableParams = paramCount * 0.002;
        var adamwMemory = trainableParams * 8.0;
        var gradients = trainableParams * 2.0;
        var activations = 1.1 * batch;
        totalVram = baseWeightVram + adamwMemory + gradients + activations + overhead + 1.0;
      } else if (mode === "full_sft") {
        var adamwMemory = paramCount * 8.0; // 8 bytes para TODOS
        var gradients = paramCount * 2.0;
        var activations = 2.5 * batch;
        totalVram = baseWeightVram + adamwMemory + gradients + activations + overhead + 2.0;
      }

      var colabLimit = 15.0; // Tesla T4 VRAM
      var statusTag = "";
      var statusColor = "";
      var statusAdvice = "";

      if (totalVram <= 12.5) {
        statusTag = "100% Viable en Google Colab Gratuito (Tesla T4 15 GB)";
        statusColor = "var(--accent-success)";
        statusAdvice = "Configuración sumamente holgada. Tienes margen para aumentar el batch size o procesar secuencias de hasta 512 tokens sin riesgo de OOM.";
      } else if (totalVram <= 15.0) {
        statusTag = "Ajustado al Límite de VRAM (Tesla T4 ~15 GB)";
        statusColor = "var(--accent-warning)";
        statusAdvice = "Precaución: Activa <code>torch.cuda.empty_cache()</code> entre épocas y usa <code>gradient_accumulation_steps=4</code> para evitar picos transitorios de memoria.";
      } else {
        statusTag = "CUDA Out of Memory (OOM) en GPU Gratuita (> 15 GB)";
        statusColor = "#ef4444";
        statusAdvice = "Esta configuración excederá los 15 GB de la GPU T4. <b>Solución recomendada:</b> Cambia la cuantización a <b>NF4 4-bit (QLoRA)</b> o reduce el modelo a <b>1B / 3B</b> o usa <b>Groq LPU API</b>.";
      }

      outputBox.innerHTML = `
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.4rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.8rem;">
            <div>
              <span style="font-size:0.75rem; text-transform:uppercase; font-weight:800; color:var(--text-muted);">Consumo Estimado de VRAM:</span>
              <div style="font-family:var(--font-head); font-size:1.8rem; font-weight:800; color:${statusColor};">${totalVram.toFixed(2)} GB <span style="font-size:0.9rem; font-weight:600; color:var(--text-muted);">/ 15.0 GB T4</span></div>
            </div>
            <div style="text-align:right;">
              <span class="badge-role" style="background:rgba(8,102,255,0.1); color:var(--meta-blue); font-size:0.8rem; padding:0.3rem 0.7rem; border-radius:20px; font-weight:700;">Pesos Base: ${baseWeightVram.toFixed(2)} GB</span>
            </div>
          </div>

          <div style="width:100%; height:8px; background:var(--bg-subtle-alt); border-radius:4px; overflow:hidden; margin-bottom:1rem;">
            <div style="width:${Math.min(100, (totalVram / colabLimit) * 100)}%; height:100%; background:${statusColor}; transition:width 0.3s ease;"></div>
          </div>

          <div style="background:var(--bg-subtle); border-radius:8px; padding:0.9rem 1rem; border-left:4px solid ${statusColor}; font-size:0.86rem; line-height:1.6; color:var(--text-primary);">
            <strong>Diagnóstico de Factibilidad:</strong> <span style="font-weight:700; color:${statusColor};">${statusTag}</span><br>
            <span style="color:var(--text-secondary);">${statusAdvice}</span>
          </div>
        </div>
      `;

      if (window.SOUND && typeof window.SOUND.playPop === "function") {
        window.SOUND.playPop(480);
      }
    }

    modelSelect.addEventListener("change", calculateVRAM);
    quantSelect.addEventListener("change", calculateVRAM);
    modeSelect.addEventListener("change", calculateVRAM);
    batchSelect.addEventListener("change", calculateVRAM);
    calculateVRAM();
  }

  // 3. CHECKLIST INTERACTIVO CON PERSISTENCIA LOCAL
  function initQualityChecklist() {
    var checkListContainer = document.getElementById("hackathon-checklist");
    var progressText = document.getElementById("checklist-progress-text");
    var progressBar = document.getElementById("checklist-progress-bar");
    if (!checkListContainer) return;

    var checkboxes = checkListContainer.querySelectorAll('input[type="checkbox"]');
    var storageKey = "hackathon_checklist_state_v1";

    var savedState = {};
    try {
      savedState = JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch(e){}

    checkboxes.forEach(function(cb, index) {
      if (savedState["item_" + index]) {
        cb.checked = true;
      }
      cb.addEventListener("change", function() {
        updateProgress();
        saveChecklist();
        if (cb.checked && window.SOUND && typeof window.SOUND.playChime === "function") {
          window.SOUND.playChime();
        }
      });
    });

    function saveChecklist() {
      var state = {};
      checkboxes.forEach(function(cb, index) {
        state["item_" + index] = cb.checked;
      });
      localStorage.setItem(storageKey, JSON.stringify(state));
    }

    function updateProgress() {
      var total = checkboxes.length;
      var checked = 0;
      checkboxes.forEach(function(cb) {
        if (cb.checked) checked++;
      });
      var pct = Math.round((checked / total) * 100);
      if (progressText) progressText.textContent = `${checked} de ${total} verificados (${pct}%)`;
      if (progressBar) progressBar.style.width = pct + "%";
    }

    updateProgress();
  }

  // Inicialización global cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      initDecisionWizard();
      initVramCalculator();
      initQualityChecklist();
    });
  } else {
    initDecisionWizard();
    initVramCalculator();
    initQualityChecklist();
  }

})();

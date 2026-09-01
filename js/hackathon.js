/**
 * Meta AI - Hackathon Interactive Mentorship & Builder Workbench Engine
 * Strict Professional Edition: Clean typography, vector icons, no emojis.
 * Features:
 * 1. Project Scoper & Viability Evaluator (Evaluador de Viabilidad de Ideas)
 * 2. Live Interactive Pipeline Simulator (Simulador Visual de Flujo de IA)
 * 3. Friendly Architectural Decision Wizard (Árbol de Decisiones Intuitivo)
 * 4. Colab & Hardware Resource Gauge (Semáforo de Hardware)
 * 5. Pre-submission Quality Checklist with Audio & Confetti Celebration
 */

(function(){
  "use strict";

  // 1. EVALUADOR INTERACTIVO DE VIABILIDAD DE IDEAS (PROJECT SCOPER)
  function initProjectScoper() {
    var problemSelect = document.getElementById("scoper-problem-type");
    var dataSelect = document.getElementById("scoper-data-source");
    var complexitySelect = document.getElementById("scoper-complexity");
    var resultBox = document.getElementById("scoper-result-box");

    if (!problemSelect || !dataSelect || !complexitySelect || !resultBox) return;

    function evaluateScope() {
      var problem = problemSelect.value;
      var data = dataSelect.value;
      var complexity = complexitySelect.value;

      var viabilityTitle = "Idea 100% Viable y Recomendada para el Hackathon";
      var viabilityStatus = "Optima";
      var statusColor = "var(--accent-success, #10b981)";
      var recommendations = [];
      var risks = [];
      var estimatedHours = "4 a 8 horas de desarrollo";

      if (problem === "math_accounting") {
        viabilityTitle = "Antipatron Detectado: No Apto para LLMs Puros";
        viabilityStatus = "Riesgo Critico";
        statusColor = "#ef4444";
        risks.push("Los modelos de lenguaje son probabilisticos y generaran errores en calculos numericos o contables exactos.");
        recommendations.push("Utilice el LLM exclusivamente para extraer parametros y conecte una funcion Python tradicional (Function Calling) para efectuar las operaciones matematicas.");
        estimatedHours = "Requiere arquitectura hibrida (+12 horas)";
      } else if (problem === "crud_database") {
        viabilityTitle = "Antipatron Detectado: Use una Base de Datos Tradicional";
        viabilityStatus = "Riesgo Arquitectonico";
        statusColor = "#f59e0b";
        risks.push("Un LLM no debe utilizarse como almacenamiento transaccional (CRUD) ni garantiza persistencia ACID.");
        recommendations.push("Implemente una base de datos PostgreSQL/SQLite y use el LLM unicamente como traductor de lenguaje natural a SQL (Text-to-SQL).");
        estimatedHours = "Requiere backend relacional (+10 horas)";
      } else if (problem === "ecommerce_support") {
        recommendations.push("Plantilla 1 (E-Commerce): Segmentar catalogos y politicas en fragmentos de 300 a 450 caracteres.");
        recommendations.push("Fijar umbral de similitud coseno >= 0.40 en rag_engine.py para erradicar alucinaciones en garantias.");
      } else if (problem === "legal_normative") {
        recommendations.push("Plantilla 2 (Normativa): Citar el articulo legal exacto en el prompt de sistema para dar rigor juridico.");
        recommendations.push("Incorporar directiva de admision estricta de ignorancia cuando el articulo no este en el contexto.");
      } else if (problem === "it_helpdesk_json") {
        recommendations.push("Plantilla 3 (Soporte TI / LoRA): Definir esquemas Pydantic con tipado estricto en api_server.py.");
        recommendations.push("Utilizar el adaptador LoRA (r=8, alpha=16) para forzar sintaxis JSON pura sin texto adicional.");
      } else if (problem === "socratic_education") {
        recommendations.push("Plantilla 4 (Tutor Socratico): Configurar directivas para hacer preguntas de comprension en lugar de resolver el ejercicio.");
        recommendations.push("Inyectar el temario academico en la base vectorial RAG para validar conceptos en tiempo real.");
      } else if (problem === "health_protocols") {
        recommendations.push("Plantilla 5 (Salud / Triage): Incluir clausula obligatoria de que la IA no emite diagnosticos medicos vinculantes.");
        recommendations.push("Indexar unicamente guias de preparacion de estudios de laboratorio y criterios de triage.");
      } else if (problem === "hr_onboarding") {
        recommendations.push("Plantilla 6 (Recursos Humanos): Indexar manual de induccion, polizas de seguro y dias economicos.");
        recommendations.push("Configurar router.py para canalizar consultas sobre prestaciones y bienvenida corporativa.");
      }

      if (data === "dirty_pdf") {
        risks.push("Los archivos PDF escaneados o con tablas complejas introducen ruido OCR que degrada la precision del RAG.");
        recommendations.push("Extraiga el texto a un archivo .txt plano y limpie saltos de linea huerfanos con data_cleaner.py.");
      } else if (data === "no_data") {
        risks.push("Sin datos propios el asistente solo respondera con conocimiento general de internet.");
        recommendations.push("Redacte una lista minima de 10 a 15 parrafos institucionales fácticos en documentos.txt.");
      }

      if (complexity === "advanced") {
        estimatedHours = "10 a 16 horas de desarrollo";
      }

      resultBox.innerHTML = `
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-left: 5px solid ${statusColor}; border-radius: 12px; padding: 1.4rem; animation: mainFadeIn 0.3s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem;">
            <span class="badge-role" style="background: rgba(8,102,255,0.12); color: ${statusColor}; font-weight: 800; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 4px;">
              Dictamen de Ingenieria: ${viabilityStatus}
            </span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">
              Tiempo Estimado: ${estimatedHours}
            </span>
          </div>
          <h4 style="font-family: var(--font-head); font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.6rem;">
            ${viabilityTitle}
          </h4>
          
          ${risks.length > 0 ? `
            <div style="background: rgba(239,68,68,0.08); border-left: 3px solid #ef4444; border-radius: 6px; padding: 0.7rem 0.9rem; margin-bottom: 0.8rem;">
              <strong style="font-size: 0.82rem; color: #ef4444; display: block; margin-bottom: 0.2rem;">Puntos de Atencion y Riesgos:</strong>
              <ul style="margin: 0; padding-left: 1.1rem; font-size: 0.82rem; color: var(--text-primary); line-height: 1.55;">
                ${risks.map(r => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div style="background: var(--bg-subtle-alt); border-radius: 8px; padding: 0.9rem 1.1rem; border: 1px solid var(--border-subtle);">
            <strong style="font-size: 0.84rem; color: var(--text-primary); display: block; margin-bottom: 0.3rem;">Recomendaciones de Implementacion:</strong>
            <ul style="margin: 0; padding-left: 1.1rem; font-size: 0.83rem; color: var(--text-secondary); line-height: 1.6;">
              ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;

      if (window.SOUND && typeof window.SOUND.playPop === "function") {
        window.SOUND.playPop(480);
      }
    }

    problemSelect.addEventListener("change", evaluateScope);
    dataSelect.addEventListener("change", evaluateScope);
    complexitySelect.addEventListener("change", evaluateScope);
    evaluateScope();
  }

  // 2. SIMULADOR INTERACTIVO DEL FLUJO DE IA (LIVE PIPELINE SIMULATOR)
  function initLivePipelineSimulator() {
    var queryInput = document.getElementById("sim-query-input");
    var runBtn = document.getElementById("sim-run-btn");
    var stepContainer = document.getElementById("sim-steps-container");
    var finalResultBox = document.getElementById("sim-final-result");
    var sampleBtns = document.querySelectorAll(".sim-sample-btn");

    if (!runBtn || !stepContainer) return;

    var demoKnowledge = [
      { topic: "ecommerce", text: "Politica de Reembolsos (Art. 4): El cliente dispone de hasta 30 dias naturales con empaque original y comprobante fiscal para solicitar reembolso total.", score: 0.89 },
      { topic: "legal", text: "Reglamento de Titulacion (Art. 12): Es indispensable acreditar el 100% de creditos curriculares, liberacion de servicio social e ingles B2.", score: 0.94 },
      { topic: "it_helpdesk", text: "Mesa de Ayuda (Catalogo 2): Caidas de bases de datos o pasarelas de pago se tipifican como infraestructura_critica con severidad alta.", score: 0.91 },
      { topic: "educacion", text: "Mecanismo de Auto-Atencion (Tema 3): La auto-atencion calcula la relevancia de palabras mediante matrices Q (Query), K (Key) y V (Value).", score: 0.88 },
      { topic: "salud", text: "Protocolo de Quimica Sanguinea (Guia 3): Requiere ayuno estricto de 8 a 12 horas previas a la toma de muestra. Agua simple permitida.", score: 0.93 },
      { topic: "rrhh", text: "Seguro de Gastos Medicos Mayores (Seccion 5): La cobertura inicia desde el primer dia laboral. Los vales se depositan el dia 15.", score: 0.87 }
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
        query = "¿Puedo devolver un producto si ya abri la caja original?";
        if (queryInput) queryInput.value = query;
      }

      if (window.SOUND && typeof window.SOUND.playPop === "function") {
        window.SOUND.playPop(520);
      }

      runBtn.disabled = true;
      runBtn.innerHTML = "<span>Procesando flujo de inferencia...</span>";
      if (finalResultBox) finalResultBox.style.display = "none";

      var qLower = query.toLowerCase();
      var detectedRoute = "RAG_PIPELINE";
      var routeExplanation = "Consulta que requiere verificar base documental.";
      var matchedDoc = demoKnowledge[0];

      if (qLower.includes("json") || qLower.includes("ficha") || qLower.includes("esquema") || qLower.includes("falla de base")) {
        detectedRoute = "LORA_ADAPTER";
        routeExplanation = "La consulta exige un objeto JSON tipado mediante el adaptador LoRA PEFT (r=8) para interoperabilidad con APIs.";
        matchedDoc = demoKnowledge[2];
      } else if (qLower.includes("titulac") || qLower.includes("servicio social") || qLower.includes("requisito") || qLower.includes("estatuto")) {
        detectedRoute = "RAG_PIPELINE";
        routeExplanation = "Consulta normativa legal. Se cotejan estatutos institucionales en la base vectorial.";
        matchedDoc = demoKnowledge[1];
      } else if (qLower.includes("auto-atencion") || qLower.includes("transformer") || qLower.includes("socratico") || qLower.includes("explica")) {
        detectedRoute = "RAG_PIPELINE";
        routeExplanation = "Consulta academica. El sistema recupera el concepto y formula una pregunta socratica orientativa.";
        matchedDoc = demoKnowledge[3];
      } else if (qLower.includes("ayuno") || qLower.includes("quimica") || qLower.includes("salud") || qLower.includes("triage")) {
        detectedRoute = "RAG_PIPELINE";
        routeExplanation = "Consulta de protocolo clinico. Se recupera la guia de preparacion y se anexa el aviso medico no vinculante.";
        matchedDoc = demoKnowledge[4];
      } else if (qLower.includes("vales") || qLower.includes("despensa") || qLower.includes("seguro") || qLower.includes("onboarding") || qLower.includes("recursos humanos")) {
        detectedRoute = "RAG_PIPELINE";
        routeExplanation = "Consulta corporativa de RRHH. Se recupera el manual de prestaciones y bienvenida.";
        matchedDoc = demoKnowledge[5];
      } else if (qLower.includes("hola") || qLower.includes("buenos") || qLower.includes("saludos")) {
        detectedRoute = "FAST_LLM";
        routeExplanation = "Saludo conversacional estandar. Despacho inmediato en < 1 ms con cero sobrecarga RAG.";
        matchedDoc = null;
      } else {
        detectedRoute = "RAG_PIPELINE";
        routeExplanation = "Consulta de atencion comercial y politicas de devolucion.";
        matchedDoc = demoKnowledge[0];
      }

      stepContainer.innerHTML = `
        <div class="sim-step-card sim-step-active" id="step-1">
          <div class="sim-step-num">1</div>
          <div class="sim-step-body">
            <h5>Paso 1: Enrutador Inteligente de Consultas (router.py)</h5>
            <p>Evaluacion semantica de la entrada: <em>"${query}"</em></p>
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
                <h5>Paso 2: Busqueda en Base Vectorial (rag_engine.py)</h5>
                <p>Calculo de similitud coseno sobre incrustaciones densas normalizadas (all-MiniLM-L6-v2):</p>
                <div class="sim-retrieved-quote">
                  "<strong>${matchedDoc.text}</strong>"<br>
                  <span style="color: var(--accent-info, #0284c7); font-size: 0.75rem; font-weight: 700;">Similitud Coseno: ${(matchedDoc.score * 100).toFixed(1)}% (Superior al umbral minimo de 40%)</span>
                </div>
              </div>
            </div>
          `;
        } else if (detectedRoute === "LORA_ADAPTER") {
          step2Content = `
            <div class="sim-step-card sim-step-active" id="step-2">
              <div class="sim-step-num" style="background: #a855f7;">2</div>
              <div class="sim-step-body">
                <h5>Paso 2: Activacion del Adaptador LoRA (lora_adapter.py)</h5>
                <p>Inyeccion de matrices de bajo rango entrenadas (Rank r=8, alpha=16) para forzar sintaxis JSON pura con esquemas Pydantic.</p>
              </div>
            </div>
          `;
        } else {
          step2Content = `
            <div class="sim-step-card sim-step-active" id="step-2">
              <div class="sim-step-num" style="background: var(--accent-success, #10b981);">2</div>
              <div class="sim-step-body">
                <h5>Paso 2: Inferencia Rapida Directa (Zero Retrieval Overhead)</h5>
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
                <h5>Paso 3: Generacion Factica Condicionada (Meta Llama 3)</h5>
                <p>El modelo de lenguaje recibe el prompt delimitado por <code>[CONTEXTO]</code> y redacta la respuesta respetando las restricciones de veracidad.</p>
              </div>
            </div>
          `;

          setTimeout(function(){
            if (window.SOUND && typeof window.SOUND.playChime === "function") window.SOUND.playChime();

            var finalAnswer = "";
            if (detectedRoute === "RAG_PIPELINE" && matchedDoc) {
              if (matchedDoc.topic === "salud") {
                finalAnswer = `AVISO MEDICO: Esta informacion es informativa y no sustituye criterio medico. De acuerdo con el protocolo institucional: ${matchedDoc.text}`;
              } else if (matchedDoc.topic === "educacion") {
                finalAnswer = `Para comprender este concepto: ${matchedDoc.text} Ahora reflexiona: ¿Como afecta esta formula a la memoria requerida cuando la longitud del texto se duplica?`;
              } else {
                finalAnswer = `De acuerdo con la documentacion oficial: ${matchedDoc.text}`;
              }
            } else if (detectedRoute === "LORA_ADAPTER") {
              finalAnswer = `{\n  "categoria": "infraestructura_critica",\n  "severidad": "alta",\n  "usuario_afectado": "usr_9481",\n  "resumen": "Caida de pasarela de pagos con error HTTP 500.",\n  "accion_sugerida": "notificar_equipo_oncall_inmediato"\n}`;
            } else {
              finalAnswer = `Hola, bienvenido al sistema de asistencia inteligente. ¿En que procedimiento puedo orientarle el dia de hoy?`;
            }

            if (finalResultBox) {
              finalResultBox.style.display = "block";
              finalResultBox.innerHTML = `
                <div style="background: var(--bg-surface); border: 1px solid var(--meta-blue-border); border-left: 5px solid var(--accent-success); border-radius: 12px; padding: 1.4rem; animation: mainFadeIn 0.3s ease;">
                  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem;">
                    <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--accent-success); background: rgba(5, 150, 105, 0.12); padding: 0.25rem 0.6rem; border-radius: 6px;">
                      Respuesta Generada y Auditada
                    </span>
                    <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">Latencia total: ~280 ms</span>
                  </div>
                  <h5 style="font-family: var(--font-head); font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.6rem;">
                    Salida Entregada al Usuario Final:
                  </h5>
                  ${detectedRoute === "LORA_ADAPTER" ? 
                    `<pre style="background: var(--bg-subtle-alt); padding: 0.9rem; border-radius: 8px; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-primary); overflow-x: auto;"><code>${finalAnswer}</code></pre>` :
                    `<p style="font-size: 0.95rem; line-height: 1.65; color: var(--text-primary); margin: 0;">${finalAnswer}</p>`
                  }
                  ${matchedDoc ? `<div style="margin-top: 0.8rem; font-size: 0.78rem; color: var(--text-muted); border-top: 1px dashed var(--border-subtle); padding-top: 0.6rem;">Fuente de Verificacion Documental: <strong>${matchedDoc.topic.toUpperCase()}</strong> (Anclaje Factico Verificado)</div>` : ''}
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

  // 3. ARBOL INTERACTIVO DE DECISIONES ARQUITECTONICAS
  function initFriendlyDecisionWizard() {
    var form = document.getElementById("friendly-wizard-form");
    var resultBox = document.getElementById("friendly-wizard-result");
    if (!form || !resultBox) return;

    function evaluateWizard() {
      var projectType = document.querySelector('input[name="wiz-project"]:checked')?.value || "ecommerce";
      var title = "";
      var badge = "";
      var explanation = "";
      var steps = [];
      var templateId = "";

      if (projectType === "ecommerce") {
        title = "Plantilla 1: Asistente de Operaciones Comerciales y Politicas de Devolucion (RAG)";
        badge = "Recomendada para Comercio Electronico y Servicios";
        explanation = "La solucion indexa el catalogo de productos y el compendio de politicas en archivos de texto estructurado. Ante una consulta de cambio o reembolso, el sistema recupera la clausula factica exacta y genera una respuesta fundamentada sin riesgo de alucinacion.";
        steps = [
          "1. Incorpore las politicas comerciales en la matriz de documentos de <code>rag_engine.py</code>.",
          "2. Configure el enrutador para clasificar consultas de logistica y devoluciones.",
          "3. Ejecute el entorno en Google Colab para validar latencia y precision."
        ];
        templateId = "plantilla-a";
      } else if (projectType === "legal") {
        title = "Plantilla 2: Asesor Normativo Institucional y Tramites Regulatorios";
        badge = "Recomendada para Entornos Academicos, Legales y Corporativos";
        explanation = "La arquitectura procesa estatutos, reglamentos internos y manuales de procedimientos. Ante una consulta de requisitos o plazos, cita el articulo correspondiente y detalla el flujo de ejecucion prescrito.";
        steps = [
          "1. Inserte los articulos reglamentarios en <code>rag_engine.py</code>.",
          "2. Ajuste el umbral de similitud coseno en 0.40 para garantizar rigor factico.",
          "3. Exponga el servicio mediante FastAPI para consumo departamental."
        ];
        templateId = "plantilla-b";
      } else if (projectType === "it_helpdesk") {
        title = "Plantilla 3: Soporte TI, Mesa de Ayuda y Extraccion JSON (LoRA)";
        badge = "Recomendada para Interoperabilidad de APIs y Bases de Datos";
        explanation = "El sistema recibe reportes en lenguaje natural y genera objetos JSON validados por esquemas Pydantic con tipado fuerte (categoria, severidad, resumen de accion) mediante el adaptador LoRA PEFT ($r=8$).";
        steps = [
          "1. Especifique el modelo de datos Pydantic en <code>api_server.py</code>.",
          "2. Active el adaptador LoRA (<code>lora_adapter.py</code>) para forzar salidas JSON.",
          "3. Audite la consistencia de salida mediante Swagger UI (<code>/docs</code>)."
        ];
        templateId = "plantilla-c";
      } else if (projectType === "education") {
        title = "Plantilla 4: Tutor Educativo Adaptativo y Evaluacion Socratica";
        badge = "Recomendada para Educacion y Capacitacion Tecnica";
        explanation = "La arquitectura desglosa conceptos tecnicos complejos de forma progresiva, aplicando formulacion de preguntas orientadas a evaluar y retroalimentar el dominio conceptual del usuario sin resolver de golpe el ejercicio.";
        steps = [
          "1. Configure las directivas pedagogicas socromaticas en el System Prompt.",
          "2. Inyecte los contenidos tematicos en la base vectorial RAG.",
          "3. Valide las respuestas del estudiante con retroalimentacion formativa."
        ];
        templateId = "plantilla-d";
      } else if (projectType === "health") {
        title = "Plantilla 5: Salud Institucional, Triage y Protocolos Clinicos";
        badge = "Recomendada para Orientacion Medica Informativa";
        explanation = "La solucion orienta a pacientes sobre preparacion de estudios clinicos y guias de triage, incorporando clausulas estrictas de advertencia de que la IA no emite diagnosticos medicos vinculantes.";
        steps = [
          "1. Indexe unicamente guias de preparacion y triage en <code>rag_engine.py</code>.",
          "2. Fije el disclaimer medico mandatorio en el System Prompt.",
          "3. Pruebe preguntas de emergencia para validar derivacion inmediata a urgencias."
        ];
        templateId = "plantilla-e";
      } else {
        title = "Plantilla 6: Recursos Humanos, Onboarding y Cultura Corporativa";
        badge = "Recomendada para Gestion de Talento y Empresas";
        explanation = "Acompana a nuevos empleados en su proceso de integracion, resolviendo dudas sobre polizas de seguro medico, prestaciones, vales de despensa y dias economicos.";
        steps = [
          "1. Indexe el manual de bienvenida y politicas de beneficios en <code>rag_engine.py</code>.",
          "2. Ajuste el tono del asistente a un lenguaje calido, institucional y profesional.",
          "3. Exponga el microservicio para integracion directa con WhatsApp."
        ];
        templateId = "plantilla-f";
      }

      resultBox.innerHTML = `
        <div style="background: var(--bg-surface); border: 1px solid var(--meta-blue-border); border-left: 5px solid var(--meta-blue); border-radius: 12px; padding: 1.5rem; animation: mainFadeIn 0.3s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem;">
            <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--meta-blue); background: var(--meta-blue-subtle); padding: 0.25rem 0.6rem; border-radius: 6px;">${badge}</span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">Recomendacion de Arquitectura</span>
          </div>
          <h4 style="font-family: var(--font-head); font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.6rem;">${title}</h4>
          <p style="font-size: 0.92rem; line-height: 1.65; color: var(--text-secondary); margin-bottom: 1rem;">${explanation}</p>
          
          <div style="background: var(--bg-subtle-alt); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-subtle); margin-bottom: 1rem;">
            <strong style="font-size: 0.85rem; color: var(--text-primary); display: block; margin-bottom: 0.5rem;">Fases de Implementacion Sugeridas:</strong>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.86rem; color: var(--text-secondary); line-height: 1.65;">
              ${steps.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem;">
            <span style="font-size: 0.82rem; color: var(--text-muted);">Consulte el codigo correspondiente a esta plantilla:</span>
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

  // 4. SEMAFORO DE HARDWARE & RECURSOS GOOGLE COLAB
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
      var statusDesc = "Consumo de memoria holgado. Permite ejecucion estable sin riesgo de saturacion ni desconexion en entornos estandar de GPU.";
      var statusBadge = "Estado: Optimo";

      if (model === "tinyllama") {
        vram = mode === "lora" ? 4.2 : 2.5;
      } else if (model === "llama_1b") {
        vram = mode === "lora" ? 5.1 : 3.2;
      } else if (model === "llama_3b") {
        vram = mode === "lora" ? 8.4 : 5.8;
      } else if (model === "llama_8b") {
        vram = mode === "lora" ? 11.8 : 8.5;
        if (mode === "lora") {
          statusTitle = "Viable en Colab con Cuantizacion NF4 4-bit (QLoRA)";
          statusColor = "var(--accent-warning, #f59e0b)";
          statusDesc = "Compatible con la GPU T4 de 15 GB. Se recomienda establecer Batch Size = 1 y habilitar acumulacion de gradientes para evitar picos transitorios.";
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

  // 5. CHECKLIST INTERACTIVO DE CALIDAD
  function initQualityChecklist() {
    var container = document.getElementById("friendly-checklist-container");
    var progressText = document.getElementById("friendly-progress-text");
    var progressBar = document.getElementById("friendly-progress-bar");
    var celebrationMsg = document.getElementById("checklist-celebration-msg");
    if (!container) return;

    var checkboxes = container.querySelectorAll('input[type="checkbox"]');
    var storageKey = "hackathon_professional_checklist_v4";

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

  // Inicializacion global
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){
      initProjectScoper();
      initLivePipelineSimulator();
      initFriendlyDecisionWizard();
      initColabSemaphore();
      initQualityChecklist();
    });
  } else {
    initProjectScoper();
    initLivePipelineSimulator();
    initFriendlyDecisionWizard();
    initColabSemaphore();
    initQualityChecklist();
  }

})();

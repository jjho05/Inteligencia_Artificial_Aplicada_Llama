// Script Interactivo para Challenge 3 del Módulo 2: Function Calling & Latencia de Ciclo
document.addEventListener("DOMContentLoaded", () => {
  const promptButtons = document.querySelectorAll(".btn-prompt-fc");
  const step1Box = document.getElementById("fc-step1-box");
  const step2Box = document.getElementById("fc-step2-box");
  const step1Latency = document.getElementById("fc-step1-latency");
  const step2Latency = document.getElementById("fc-step2-latency");
  const totalLatency = document.getElementById("fc-total-latency");
  const slaBadge = document.getElementById("fc-sla-badge");

  const scenarios = {
    "¿Dónde está mi pedido 4521?": {
      toolCall: {
        name: "consultar_estado_pedido",
        arguments: { id_pedido: "PED-4521" }
      },
      backendResult: {
        status: "success",
        pedido: "PED-4521",
        estado: "En ruta de entrega",
        hora_estimada: "17:30 hrs",
        repartidor: "Carlos Mendoza"
      },
      finalAnswer: "¡Hola! Te confirmo que tu pedido *PED-4521* se encuentra actualmente *en ruta de entrega* 🚚. La llegada estimada es hoy antes de las 17:30 hrs con nuestro repartidor Carlos Mendoza.",
      lat1: 340,
      lat2: 410,
      execLat: 85
    },
    "Quiero agendar una cita de frenos el viernes a las 11am": {
      toolCall: {
        name: "agendar_cita_taller",
        arguments: { servicio: "frenos", dia: "viernes", horario: "11:00 AM" }
      },
      backendResult: {
        status: "success",
        folio_cita: "CITA-2026-8812",
        servicio: "frenos",
        dia: "viernes",
        horario: "11:00 AM",
        confirmada: true
      },
      finalAnswer: "¡Excelente! Tu cita para revisión y cambio de *frenos* ha quedado confirmada para este *viernes a las 11:00 AM* con el folio *CITA-2026-8812* 🚗. Te sugerimos llegar 10 minutos antes.",
      lat1: 380,
      lat2: 430,
      execLat: 110
    },
    "¿Cuánto cobran por el cambio de aceite y afinación?": {
      toolCall: {
        name: "consultar_catalogo_servicios",
        arguments: { categoria: "mantenimiento_general" }
      },
      backendResult: {
        servicios: [
          { nombre: "Cambio de Aceite Sintético", precio: "$850 MXN" },
          { nombre: "Afinación Mayor 4 Cilindros", precio: "$2,200 MXN" }
        ]
      },
      finalAnswer: "Nuestros precios oficiales son:\\n• *Cambio de Aceite Sintético:* $850 MXN\\n• *Afinación Mayor 4 Cilindros:* $2,200 MXN\\nAmbos incluyen revisión de puntos de seguridad y garantía de 30 días.",
      lat1: 310,
      lat2: 390,
      execLat: 65
    }
  };

  function executeScenario(query) {
    const sc = scenarios[query];
    if (!sc) return;

    if (window.SOUND) window.SOUND.playClick();
    step1Box.textContent = "Llama 3.3 analizando intención...";
    step2Box.innerHTML = "<em>Esperando resolución de tool...</em>";
    step1Latency.textContent = "-- ms";
    step2Latency.textContent = "-- ms";
    totalLatency.textContent = "-- ms";

    setTimeout(() => {
      // Paso 1 completado
      step1Latency.textContent = `${sc.lat1} ms`;
      step1Box.textContent = `// Invocación estructurada por Llama:\n{\n  "tool_calls": [{\n    "id": "call_99x81",\n    "type": "function",\n    "function": ${JSON.stringify(sc.toolCall, null, 2)}\n  }]\n}`;
      if (window.SOUND) window.SOUND.playPop();

      setTimeout(() => {
        // Paso 2 completado
        const tot = sc.lat1 + sc.execLat + sc.lat2 + 45; // +45 webhook/send
        step2Latency.textContent = `${sc.lat2} ms (Tool: ${sc.execLat}ms)`;
        step2Box.innerHTML = sc.finalAnswer.replace(/\\n/g, "<br>");
        totalLatency.textContent = `${tot} ms`;

        if (tot < 3000) {
          slaBadge.textContent = "SLA CUMPLIDO (< 3.0s)";
          slaBadge.style.background = "rgba(5,150,105,0.1)";
          slaBadge.style.color = "var(--accent-success)";
        }
        if (window.SOUND) window.SOUND.playSuccess();
      }, 450);
    }, 350);
  }

  promptButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      promptButtons.forEach(b => {
        b.className = "btn-prompt-fc btn-secondary";
        b.style.fontSize = "0.8rem";
        b.style.padding = "0.4rem 0.8rem";
      });
      btn.className = "btn-prompt-fc btn-primary";
      const q = btn.getAttribute("data-query");
      executeScenario(q);
    });
  });

  // Ejecutar el primer escenario por defecto
  executeScenario("¿Dónde está mi pedido 4521?");
});

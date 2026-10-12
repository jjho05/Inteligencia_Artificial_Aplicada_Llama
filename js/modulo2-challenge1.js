// Script Interactivo para Challenge 1 del Módulo 2: WhatsApp Cloud API & Webhooks
document.addEventListener("DOMContentLoaded", () => {
  const tabGet = document.getElementById("sim-tab-get");
  const tabPost = document.getElementById("sim-tab-post");
  const tabDup = document.getElementById("sim-tab-dup");
  const inputJson = document.getElementById("sim-input-json");
  const btnEjecutar = document.getElementById("sim-btn-ejecutar");
  const outputBox = document.getElementById("sim-output-box");
  const metricLatencia = document.getElementById("sim-metric-latencia");
  const metricStatus = document.getElementById("sim-metric-status");

  let currentMode = "get";
  const processedWamids = new Set();

  const payloads = {
    get: `// GET /webhook?hub.mode=subscribe&hub.challenge=1158201444&hub.verify_token=mi_token_secreto_de_verificacion_2026
{
  "method": "GET",
  "query": {
    "hub.mode": "subscribe",
    "hub.challenge": "1158201444",
    "hub.verify_token": "mi_token_secreto_de_verificacion_2026"
  }
}`,
    post: `{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "109988776655443",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "display_phone_number": "5215500001111",
          "phone_number_id": "109988776655443"
        },
        "contacts": [{ "profile": { "name": "Carlos Mendoza" }, "wa_id": "5215512345678" }],
        "messages": [{
          "from": "5215512345678",
          "id": "wamid.HBgLNTIxNTUxMjM0NTY3OBUCABEYEjExMjIzMzQ0NTU2NgA=",
          "timestamp": "1773091200",
          "text": { "body": "Hola, ¿cuál es el horario de atención?" },
          "type": "text"
        }]
      },
      "field": "messages"
    }]
  }]
}`,
    dup: `{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "109988776655443",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "messages": [{
          "from": "5215512345678",
          "id": "wamid.HBgLNTIxNTUxMjM0NTY3OBUCABEYEjExMjIzMzQ0NTU2NgA=",
          "text": { "body": "Hola, ¿cuál es el horario de atención?" }
        }]
      }
    }]
  }]
}`
  };

  inputJson.value = payloads.get;

  function setActiveTab(btn, mode) {
    [tabGet, tabPost, tabDup].forEach(b => {
      b.className = "btn-secondary";
      b.style.fontSize = "0.85rem";
      b.style.padding = "0.5rem 1rem";
    });
    btn.className = "btn-primary";
    currentMode = mode;
    inputJson.value = payloads[mode];
    if (window.SOUND) window.SOUND.playPop();
  }

  tabGet.addEventListener("click", () => setActiveTab(tabGet, "get"));
  tabPost.addEventListener("click", () => setActiveTab(tabPost, "post"));
  tabDup.addEventListener("click", () => setActiveTab(tabDup, "dup"));

  btnEjecutar.addEventListener("click", () => {
    if (window.SOUND) window.SOUND.playClick();
    outputBox.textContent = "Procesando petición en gateway FastAPI...";
    metricStatus.textContent = "En proceso...";

    const startTime = performance.now();

    setTimeout(() => {
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime + 8);
      metricLatencia.textContent = `${latency} ms`;

      if (currentMode === "get") {
        outputBox.innerHTML = `HTTP/1.1 200 OK\nContent-Type: text/plain\n\n1158201444\n\n// Handshake superado exitosamente con Meta for Developers.`;
        outputBox.style.color = "#3fb950";
        metricStatus.textContent = "200 OK (Handshake)";
        if (window.SOUND) window.SOUND.playSuccess();
      } else if (currentMode === "post") {
        const wamid = "wamid.HBgLNTIxNTUxMjM0NTY3OBUCABEYEjExMjIzMzQ0NTU2NgA=";
        processedWamids.add(wamid);
        outputBox.innerHTML = `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "status": "message_received",\n  "from": "5215512345678",\n  "wamid": "${wamid}",\n  "idempotency": "first_time_registered"\n}`;
        outputBox.style.color = "#3fb950";
        metricStatus.textContent = "200 OK (Nuevo)";
        if (window.SOUND) window.SOUND.playSuccess();
      } else if (currentMode === "dup") {
        const wamid = "wamid.HBgLNTIxNTUxMjM0NTY3OBUCABEYEjExMjIzMzQ0NTU2NgA=";
        outputBox.innerHTML = `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "status": "duplicate_skipped",\n  "wamid": "${wamid}",\n  "idempotency": "discarded_by_lru_cache"\n}\n\n// El webhook descartó la ejecución para evitar respuestas duplicadas.`;
        outputBox.style.color = "#f59e0b";
        metricStatus.textContent = "200 OK (Duplicado omitido)";
        if (window.SOUND) window.SOUND.playToggle();
      }
    }, 280);
  });

  // Copia de código
  document.querySelectorAll(".btn-copy-code").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const codeEl = document.getElementById(targetId);
      if (codeEl) {
        navigator.clipboard.writeText(codeEl.textContent).then(() => {
          btn.textContent = "¡Copiado!";
          if (window.SOUND) window.SOUND.playChime();
          setTimeout(() => { btn.textContent = "Copiar Código"; }, 2000);
        });
      }
    });
  });
});

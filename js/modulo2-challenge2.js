// Script Interactivo para Challenge 2 del Módulo 2: Memoria Conversacional & Escalamiento Humano
document.addEventListener("DOMContentLoaded", () => {
  const chatMessagesBox = document.getElementById("chat-messages-box");
  const chatInput = document.getElementById("chat-input");
  const chatSendBtn = document.getElementById("chat-send-btn");
  const chatStatusPill = document.getElementById("chat-status-pill");
  const memoryInspectorBox = document.getElementById("memory-inspector-box");
  const memoryTurnsPill = document.getElementById("memory-turns-pill");

  const MAX_TURNS = 4;
  let history = [];
  let isHumanEscalated = false;
  let identifiedService = null;

  function updateMemoryInspector() {
    memoryTurnsPill.textContent = `Turnos: ${Math.floor(history.length / 2)} / ${MAX_TURNS}`;
    const sessionState = {
      user_id: "5215512345678",
      human_escalated: isHumanEscalated,
      detected_entities: {
        service: identifiedService
      },
      sliding_window_turns: history.length / 2,
      context_messages: [
        { role: "system", content: "Eres el asistente de TallerPro..." },
        ...history
      ]
    };
    memoryInspectorBox.textContent = JSON.stringify(sessionState, null, 2);
  }

  function appendMessage(role, text) {
    const msgDiv = document.createElement("div");
    msgDiv.style.padding = "0.6rem 0.8rem";
    msgDiv.style.borderRadius = "10px";
    msgDiv.style.maxWidth = "85%";
    msgDiv.style.fontSize = "0.85rem";
    msgDiv.style.lineHeight = "1.5";

    if (role === "user") {
      msgDiv.style.alignSelf = "flex-end";
      msgDiv.style.background = "var(--meta-blue)";
      msgDiv.style.color = "#ffffff";
      msgDiv.textContent = text;
    } else {
      msgDiv.style.alignSelf = "flex-start";
      msgDiv.style.background = "var(--bg-primary)";
      msgDiv.style.border = "1px solid var(--border-subtle)";
      msgDiv.style.color = "var(--text-primary)";
      msgDiv.innerHTML = text;
    }

    chatMessagesBox.appendChild(msgDiv);
    chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = "";

    if (window.SOUND) window.SOUND.playClick();
    appendMessage("user", text);

    if (isHumanEscalated) {
      setTimeout(() => {
        appendMessage("assistant", "<em>[Ticket #8942 en cola de operador humano. El bot permanecerá en pausa hasta que el asesor cierre la atención.]</em>");
        if (window.SOUND) window.SOUND.playToggle();
      }, 400);
      return;
    }

    // Regla dura de escalamiento humano
    const lower = text.toLowerCase();
    if (lower.includes("humano") || lower.includes("persona") || lower.includes("asesor")) {
      isHumanEscalated = true;
      chatStatusPill.textContent = "ESCALADO A HUMANO";
      chatStatusPill.style.background = "rgba(239, 68, 68, 0.15)";
      chatStatusPill.style.color = "#ef4444";

      history.push({ role: "user", content: text });
      history.push({ role: "assistant", content: "Entendido. He transferido tu solicitud a un asesor humano de nuestro equipo. En breve continuarán tu atención." });

      setTimeout(() => {
        appendMessage("assistant", "Entendido. He transferido tu solicitud a un asesor humano de nuestro equipo. En breve continuarán tu atención por este mismo chat.");
        updateMemoryInspector();
        if (window.SOUND) window.SOUND.playError();
      }, 400);
      return;
    }

    // Detección de entidad de servicio
    if (lower.includes("freno") || lower.includes("balatas")) {
      identifiedService = "frenos";
    } else if (lower.includes("aceite")) {
      identifiedService = "cambio_aceite";
    }

    // Respuesta inteligente contextual
    history.push({ role: "user", content: text });

    let botResponse = "";
    if (identifiedService && (lower.includes("jueves") || lower.includes("10am") || lower.includes("horario"))) {
      botResponse = `¡Perfecto! Confirmando tu solicitud para servicio de <strong>${identifiedService}</strong> el jueves a las 10:00 AM. ¿Deseas confirmar la cita con tu nombre?`;
    } else if (lower.includes("freno")) {
      botResponse = "Excelente. Tenemos disponibles citas para revisión y cambio de frenos esta semana. ¿Qué día y horario te convendría más?";
    } else {
      botResponse = "Recibido. ¿Deseas consultar algún servicio específico de mantenimiento o agendar una cita?";
    }

    // Poda con ventana deslizante
    if (history.length > MAX_TURNS * 2) {
      history = history.slice(- (MAX_TURNS * 2));
    }

    history.push({ role: "assistant", content: botResponse.replace(/<[^>]*>?/gm, "") });

    setTimeout(() => {
      appendMessage("assistant", botResponse);
      updateMemoryInspector();
      if (window.SOUND) window.SOUND.playSuccess();
    }, 500);
  }

  chatSendBtn.addEventListener("click", handleSend);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });

  document.querySelectorAll(".btn-prompt-sugerido").forEach(btn => {
    btn.addEventListener("click", () => {
      chatInput.value = btn.getAttribute("data-prompt");
      handleSend();
    });
  });

  updateMemoryInspector();
});

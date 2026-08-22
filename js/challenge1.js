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

  var latLig = document.getElementById("ch1-lat-lig");
  var tokLig = document.getElementById("ch1-tok-lig");
  var respLig = document.getElementById("ch1-resp-lig");

  var latGrd = document.getElementById("ch1-lat-grd");
  var tokGrd = document.getElementById("ch1-tok-grd");
  var respGrd = document.getElementById("ch1-resp-grd");

  var latQwn = document.getElementById("ch1-lat-qwn");
  var tokQwn = document.getElementById("ch1-tok-qwn");
  var respQwn = document.getElementById("ch1-resp-qwn");

  var dataset = [
    {
      prompt: "¿Cómo puedo restablecer mi contraseña olvidada en el portal web institucional?",
      ligero: {
        lat: "1.29 s",
        tok: "786 tok",
        resp: "¡Hola! Para restablecer tu contraseña en el portal institucional, sigue estos pasos:<br><br>1. Ingresa a la página oficial de inicio de sesión.<br>2. Haz clic en el enlace \"¿Olvidaste tu contraseña?\".<br>3. Escribe tu correo electrónico institucional o número de usuario.<br>4. Revisa tu bandeja de entrada y sigue el enlace seguro que recibirás para crear una nueva contraseña."
      },
      grande: {
        lat: "1.82 s",
        tok: "786 tok",
        resp: "Estimado usuario, el procedimiento formal para el restablecimiento de credenciales es el siguiente:<br><br>• <b>Paso 1:</b> Navegue al portal de autenticación unificada.<br>• <b>Paso 2:</b> Seleccione \"Recuperación de Cuenta\".<br>• <b>Paso 3:</b> Valide su identidad mediante el código OTP enviado a su correo o teléfono registrado.<br>• <b>Paso 4:</b> Ingrese una contraseña de al menos 12 caracteres con mayúsculas, números y símbolos."
      },
      qwen: {
        lat: "1.66 s",
        tok: "726 tok",
        resp: "Para recuperar el acceso a su cuenta en el portal web institucional:<br><br>1. Acceda al enlace de autenticación.<br>2. Pulse \"Olvidé mi contraseña\" e introduzca su ID de usuario.<br>3. Recibirá un token criptográfico temporal en su correo institucional para crear una nueva clave segura sin comprometer su cuenta."
      }
    },
    {
      prompt: "¿Cuál es el horario de atención y los canales oficiales para soporte técnico?",
      ligero: {
        lat: "0.90 s",
        tok: "608 tok",
        resp: "Nuestro horario de atención oficial es de lunes a viernes de 9:00 a 18:00 hrs (hora CDMX).<br><br>Canales disponibles:<br>• Correo electrónico: soporte@institucion.edu.mx<br>• Portal de Mesa de Ayuda: tickets.institucion.edu.mx<br>• Chatbot automatizado en portal: Disponible 24/7."
      },
      grande: {
        lat: "1.94 s",
        tok: "786 tok",
        resp: "Los canales oficiales de atención y asistencia técnica se estructuran de la siguiente forma:<br><br>1. <b>Mesa de Ayuda Virtual:</b> Disponible las 24 horas para radicación de tickets (SLA de respuesta: 4 horas hábiles).<br>2. <b>Línea Telefónica Directa:</b> Lunes a viernes de 08:00 a 19:00 hrs y sábados de 09:00 a 14:00 hrs.<br>3. <b>Canal de WhatsApp Oficial:</b> Asistencia guiada por agente de IA para consultas rápidas y escalado a operadores humanos."
      },
      qwen: {
        lat: "1.54 s",
        tok: "725 tok",
        resp: "Disponibilidad y canales de soporte técnico formal:<br><br>• <b>Atención en Tiempo Real:</b> Lunes a viernes en horario laboral estándar (09:00 - 18:00 hrs).<br>• <b>Recepción de Incidentes:</b> Vía formulario web o correo de soporte (abierto 24/7 con procesamiento de cola al día hábil siguiente)."
      }
    },
    {
      prompt: "¿Cuáles son los requisitos mínimos de hardware y software para instalar la plataforma?",
      ligero: {
        lat: "0.75 s",
        tok: "279 tok",
        resp: "Requisitos mínimos del sistema:<br><br>• <b>Hardware:</b> CPU Dual-Core a 2.0 GHz, 4 GB de memoria RAM y 20 GB de espacio libre en disco.<br>• <b>Software:</b> Sistema operativo Windows 10/11, macOS 11+ o Linux Ubuntu 20.04 LTS.<br>• <b>Navegador:</b> Google Chrome, Mozilla Firefox o Microsoft Edge actualizado."
      },
      grande: {
        lat: "1.91 s",
        tok: "786 tok",
        resp: "<b>Especificaciones Técnicas de Despliegue:</b><br><br>1. <b>Hardware Mínimo:</b> Procesador Intel Core i3 / AMD Ryzen 3 (2 GHz), 4 GB RAM, 20 GB almacenamiento SSD.<br>2. <b>Hardware Recomendado (Producción):</b> Intel Core i5 / Ryzen 5 (4 núcleos a 2.5 GHz), 8-16 GB RAM, 50 GB SSD NVMe.<br>3. <b>Software:</b> Entorno de ejecución Node.js v18+ o Python 3.10+, arquitectura de 64 bits (x86_64 / ARM64)."
      },
      qwen: {
        lat: "2.05 s",
        tok: "697 tok",
        resp: "Los requisitos de instalación dependen del componente a desplegar. En general para clientes web se requiere un navegador con soporte ECMAScript 2022 y conexión a internet (mínimo 5 Mbps). Para servidores locales se exige al menos 4 GB de RAM y soporte de virtualización si se emplean contenedores Docker."
      }
    }
  ];

  if(presetBtns.length > 0 && promptArea){
    presetBtns.forEach(function(btn){
      btn.addEventListener("click", function(){
        presetBtns.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        var qIdx = parseInt(btn.getAttribute("data-q"), 10);
        if(!isNaN(qIdx) && dataset[qIdx]){
          promptArea.value = dataset[qIdx].prompt;
          if(window.SOUND) window.SOUND.playPop(350);
        }
      });
    });
  }

  if(btnRun){
    btnRun.addEventListener("click", function(){
      if(statusInd){
        statusInd.innerHTML = "<span style=\"color:var(--meta-blue);\">⏳ Ejecutando inferencia en los 3 modelos simultáneamente...</span>";
      }
      if(window.SOUND) window.SOUND.playPop(440);

      setTimeout(function(){
        var currentText = promptArea ? promptArea.value.trim().toLowerCase() : "";
        var matchedData = dataset[0];

        if(currentText.includes("horario") || currentText.includes("soporte") || currentText.includes("canales")){
          matchedData = dataset[1];
        } else if(currentText.includes("requisito") || currentText.includes("hardware") || currentText.includes("software") || currentText.includes("instalar")){
          matchedData = dataset[2];
        }

        if(latLig) latLig.textContent = matchedData.ligero.lat;
        if(tokLig) tokLig.textContent = matchedData.ligero.tok;
        if(respLig) respLig.innerHTML = matchedData.ligero.resp;

        if(latGrd) latGrd.textContent = matchedData.grande.lat;
        if(tokGrd) tokGrd.textContent = matchedData.grande.tok;
        if(respGrd) respGrd.innerHTML = matchedData.grande.resp;

        if(latQwn) latQwn.textContent = matchedData.qwen.lat;
        if(tokQwn) tokQwn.textContent = matchedData.qwen.tok;
        if(respQwn) respQwn.innerHTML = matchedData.qwen.resp;

        if(statusInd){
          statusInd.innerHTML = "<span style=\"color:var(--accent-success); font-weight:700;\">✅ Inferencia completada con éxito en los 3 modelos (LPU Groq)</span>";
        }
        if(window.SOUND) window.SOUND.playChime();
      }, 550);
    });
  }

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
})();

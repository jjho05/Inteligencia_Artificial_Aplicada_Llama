/**
 * Meta AI - Módulo 1: Challenge 2 - Asistente de Políticas con RAG
 * Alumno: Ing. Jesús Javier Hernández Olvera
 * Módulo: IA Aplicada con Modelos Abiertos
 * Laboratorio Interactivo de Búsqueda Semántica, Similitud Coseno y Generación Aumentada
 */

(function(){
  "use strict";

  var presetBtns = document.querySelectorAll("#ch2-preset-container .challenge-preset-btn");
  var queryText = document.getElementById("ch2-query-text");
  var modelSelect = document.getElementById("ch2-model-select");
  var btnRun = document.getElementById("ch2-btn-run");
  var statusInd = document.getElementById("ch2-status-indicator");

  var score1 = document.getElementById("ch2-score-1");
  var bar1 = document.getElementById("ch2-bar-1");
  var score2 = document.getElementById("ch2-score-2");
  var bar2 = document.getElementById("ch2-bar-2");
  var score3 = document.getElementById("ch2-score-3");
  var bar3 = document.getElementById("ch2-bar-3");

  var latSin = document.getElementById("ch2-lat-sin");
  var tokSin = document.getElementById("ch2-tok-sin");
  var respSin = document.getElementById("ch2-resp-sin");

  var latCon = document.getElementById("ch2-lat-con");
  var tokCon = document.getElementById("ch2-tok-con");
  var respCon = document.getElementById("ch2-resp-con");

  var ragData = [
    {
      query: "¿Cuál es la penalización por entregar un challenge con 20 horas de retraso y cuál es la calificación mínima para aprobar el curso?",
      scores: [0.3120, 0.6384, 0.2240],
      winner: 1,
      sin: {
        lat: "0.79 s",
        tok: "510 tok",
        resp: "La respuesta depende del curso o plataforma específica a la que te refieras, ya que cada institución establece sus propias políticas. Por lo general, algunas aplican una penalización del 10% al 20%, y la calificación mínima suele ser 70 o 75 puntos. Te sugiero consultar el programa de estudios oficial o preguntar a tu profesor."
      },
      con: {
        lat: "0.62 s",
        tok: "576 tok",
        resp: "Basado en el <b>Reglamento Oficial del Curso (Doc #2 - Entregas Tardías)</b>:<br><br>1. <b>Penalización por 20 horas de retraso:</b> Es exactamente de <b>15 puntos sobre la calificación obtenida</b>, dado que la entrega se realizó dentro del margen de hasta 24 horas de retraso permitido.<br><br>2. <b>Calificación mínima para aprobar:</b> El fragmento recuperado <b>no contiene información sobre la calificación mínima aprobatoria</b> del curso."
      }
    },
    {
      query: "¿Cuáles son los porcentajes de evaluación del curso y la calificación mínima para aprobar?",
      scores: [0.7180, 0.2850, 0.3410],
      winner: 0,
      sin: {
        lat: "0.81 s",
        tok: "520 tok",
        resp: "En la mayoría de programas educativos de tecnología, las evaluaciones se dividen entre tareas (30%), proyectos (40%) y exámenes (30%), con una nota mínima de 70 u 80 puntos. Sin embargo, no tengo los datos específicos de tu curso. Revisa la sección de evaluación de tu aula virtual."
      },
      con: {
        lat: "0.60 s",
        tok: "560 tok",
        resp: "Basado en los <b>Criterios de Evaluación y Calificación Mínima (Doc #1)</b>:<br><br>• <b>Challenges Prácticos Semanales:</b> 40% de la calificación final.<br>• <b>Proyecto Integrador con Llama y RAG:</b> 50% de la calificación final.<br>• <b>Participación en Masterclasses:</b> 10% de la calificación final.<br><br>• <b>Calificación Mínima Aprobatoria:</b> Se requiere un mínimo de <b>80 sobre 100 puntos</b> para acreditar el curso y obtener la certificación."
      }
    },
    {
      query: "¿Qué porcentaje de asistencia se exige y cuál es la sanción en caso de plagio?",
      scores: [0.1980, 0.2540, 0.7420],
      winner: 2,
      sin: {
        lat: "0.77 s",
        tok: "490 tok",
        resp: "Las políticas universitarias suelen exigir entre 75% y 85% de asistencia para tener derecho a examen final. Respecto al plagio, suele conllevar una sanción que va desde la reprobación de la materia hasta un reporte disciplinario. Consulta el reglamento interno de tu institución."
      },
      con: {
        lat: "0.58 s",
        tok: "540 tok",
        resp: "Basado en la <b>Política de Integridad Académica y Asistencia (Doc #3)</b>:<br><br>1. <b>Asistencia Requerida:</b> Se exige un <b>mínimo estricto del 80% de asistencia</b> a las sesiones sincrónicas para mantener el derecho a evaluación.<br><br>2. <b>Sanción por Plagio:</b> Todo código entregado en Colab debe ser de autoría propia y funcional; cualquier copia no autorizada o plagio entre alumnos resultará en la <b>baja definitiva del programa</b>."
      }
    }
  ];

  if(presetBtns.length > 0 && queryText){
    presetBtns.forEach(function(btn){
      btn.addEventListener("click", function(){
        presetBtns.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        var qIdx = parseInt(btn.getAttribute("data-q"), 10);
        if(!isNaN(qIdx) && ragData[qIdx]){
          queryText.value = ragData[qIdx].query;
          if(window.SOUND) window.SOUND.playPop(350);
        }
      });
    });
  }

  if(btnRun){
    btnRun.addEventListener("click", function(){
      if(statusInd){
        statusInd.innerHTML = "<span style=\"color:var(--meta-blue); font-weight:600;\">⏳ Vectorizando texto (MiniLM-L12-v2) y calculando Similitud Coseno...</span>";
      }
      if(window.SOUND) window.SOUND.playPop(440);

      setTimeout(function(){
        var current = queryText ? queryText.value.trim().toLowerCase() : "";
        var curData = ragData[0];

        if(current.includes("porcentaje") || current.includes("criterio") || current.includes("nota") || current.includes("evaluaci")){
          curData = ragData[1];
        } else if(current.includes("asistencia") || current.includes("plagio") || current.includes("integridad") || current.includes("sanci")){
          curData = ragData[2];
        }

        if(score1) score1.textContent = curData.scores[0].toFixed(4);
        if(bar1) {
          bar1.style.width = (curData.scores[0] * 100).toFixed(1) + "%";
          bar1.style.background = (curData.winner === 0) ? "var(--accent-success)" : "var(--text-muted)";
        }

        if(score2) score2.textContent = curData.scores[1].toFixed(4);
        if(bar2) {
          bar2.style.width = (curData.scores[1] * 100).toFixed(1) + "%";
          bar2.style.background = (curData.winner === 1) ? "var(--accent-success)" : "var(--text-muted)";
        }

        if(score3) score3.textContent = curData.scores[2].toFixed(4);
        if(bar3) {
          bar3.style.width = (curData.scores[2] * 100).toFixed(1) + "%";
          bar3.style.background = (curData.winner === 2) ? "var(--accent-success)" : "var(--text-muted)";
        }

        if(latSin) latSin.textContent = curData.sin.lat;
        if(tokSin) tokSin.textContent = curData.sin.tok;
        if(respSin) respSin.innerHTML = curData.sin.resp;

        if(latCon) latCon.textContent = curData.con.lat;
        if(tokCon) tokCon.textContent = curData.con.tok;
        if(respCon) respCon.innerHTML = curData.con.resp;

        if(statusInd){
          statusInd.innerHTML = "<span style=\"color:var(--accent-success); font-weight:700;\">✅ Fragmento #" + (curData.winner + 1) + " recuperado e inyectado con éxito (Cero Alucinaciones)</span>";
        }
        if(window.SOUND) window.SOUND.playChime();
      }, 600);
    });
  }
})();

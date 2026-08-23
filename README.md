# Especialización en Inteligencia Artificial Aplicada con Meta Llama 3

[![Meta AI](https://img.shields.io/badge/Meta_AI-Llama_3.1-0866FF?style=for-the-badge&logo=meta&logoColor=white)](https://ai.meta.com/llama/)
[![Groq LPU](https://img.shields.io/badge/Hardware-Groq_LPU_Inference-F55036?style=for-the-badge)](https://groq.com/)
[![RAG & Vectors](https://img.shields.io/badge/Retrieval-Sentence_Transformers-059669?style=for-the-badge)](https://sbert.net/)
[![WhatsApp API](https://img.shields.io/badge/Meta-WhatsApp_Cloud_API-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://developers.facebook.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Plataforma formativa e interactiva de grado industrial diseñada y construida por **Ing. Jesús Javier Hernández Olvera** para dominar la inteligencia artificial con modelos de pesos abiertos (*Open Weights*), desde la microarquitectura de tensores y auto-atención hasta el despliegue de agentes autónomos conectados a bases de datos y la API oficial de WhatsApp.

---

## Dirección Técnica &amp; Ecosistema de Repositorios

* **Creador &amp; Arquitecto:** **Ing. Jesús Javier Hernández Olvera**
* **Repositorio de la Plataforma Web &amp; Simuladores:** [github.com/jjho05/Inteligencia_Artificial_Aplicada_Llama](https://github.com/jjho05/Inteligencia_Artificial_Aplicada_Llama)
* **Repositorio de Cuadernos Colab, Labs &amp; Scripts:** [github.com/jjho05/meta-llama-engineering-labs](https://github.com/jjho05/meta-llama-engineering-labs)
* **Enfoque de Ingeniería:** Soberanía tecnológica, inferencia en hardware LPU de ultra-alta velocidad (500+ tokens/seg), sistemas RAG libres de alucinaciones y microservicios asíncronos en producción.

---

## Estructura Integral del Programa

### Módulo 1: Fundamentos de IA &amp; Ecosistema de Modelos Abiertos
* **Tema 1.1 · Arquitectura Transformer &amp; Llama 3:** Mecanismo de auto-atención escalada ($Q, K, V$), Grouped-Query Attention (GQA), Rotary Position Embeddings (RoPE), KV-Cache y tokenizadores BPE de 128k.
* **Tema 1.2 · Prompt Engineering &amp; Optimización:** In-Context Learning (Few-Shot), Chain-of-Thought (CoT), delimitadores especiales y delimitación contra alucinaciones probabilísticas.
* **Tema 1.3 · Embeddings, Espacios Vectoriales &amp; RAG:** Representaciones densas multidimensionales, métricas de similitud coseno, indexación HNSW y recuperación fáctica.
* **Tema 1.4 · Fine-Tuning LoRA / QLoRA &amp; Cuantización:** Matrices de bajo rango ($\Delta W = B \cdot A$), cuantización NormalFloat4 (NF4), Unsloth y evaluación de perplejidad.
* **Challenge 1 · Comparador Multi-Modelo &amp; Benchmarking:** Telemetría en vivo de modelos de 20B (ligero), 27B CoT (razonamiento analítico) y 120B (insignia) en hardware Groq LPU con Google Colab Secrets.
* **Challenge 2 · Asistente de Políticas con RAG Semántico:** Pipeline RAG completo con Sentence-Transformers (`paraphrase-multilingual-MiniLM-L12-v2`), cálculo matricial en NumPy y síntesis condicionada anti-alucinación.

### Módulo 2: Automatización con Llama &amp; WhatsApp Cloud API
* **Tema 2.1 · WhatsApp Cloud API &amp; Webhooks:** Verificación criptográfica del handshake GET, parseo de eventos JSON y seguridad con HMAC SHA-256.
* **Tema 2.2 · Agentes Conversacionales &amp; Memoria de Sesión:** Gestión de estado multi-turno con Redis, ventanas deslizantes de contexto y persistencia en PostgreSQL.
* **Tema 2.3 · Function Calling &amp; Herramientas:** Inferencia en dos pasos, esquemas JSON Schema y validación estricta de payloads con Pydantic.
* **Tema 2.4 · Producción SRE &amp; Seguridad con Llama Guard:** Despliegue con Docker Compose, NGINX SSL con Let's Encrypt, telemetría P95 y blindaje contra Jailbreaks con Llama Guard 3 y Prompt Guard.

---

## Laboratorios Interactivos &amp; Simuladores en Vivo

La plataforma cuenta con motores interactivos desarrollados en JavaScript Vanilla y Canvas:
1. **Simulador de Inferencia Multi-Modelo:** Comparativa de latencia y throughput en tiempo real conectada a Groq Cloud API.
2. **Visualizador de Similitud Vectorial RAG:** Medidores dinámicos de producto punto y ranking de fragmentos documentales.
3. **Desgloses Línea por Línea:** Acordeones técnicos de ingeniería con badges de código en cada celda de Google Colab.
4. **Motor de Audio:** Efectos de sonido sintetizados nativamente mediante Web Audio API con control de activación/desactivación.
5. **Tema Dinámico:** Soporte nativo para Modo Claro y Modo Oscuro con variables HSL y CSS Pro.

---

## Scripts de Producción en Terminal

Cada challenge incluye un script Python independiente listo para ejecutar en entornos de producción:

```bash
# Challenge 1: Benchmarking Multi-Modelo
python3 ejecutar_challenge1.py --modelo openai/gpt-oss-20b --query "¿Qué es Grouped-Query Attention?"

# Challenge 2: Pipeline RAG de Políticas
python3 ejecutar_challenge2.py --modelo openai/gpt-oss-20b
```

---

## Cómo Ejecutar el Entorno en Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/jjho05/Inteligencia_Artificial_Aplicada_Llama.git
   cd Inteligencia_Artificial_Aplicada_Llama
   ```

2. **Iniciar un servidor HTTP local:**
   ```bash
   python3 -m http.server 8080
   ```

3. **Abrir en el navegador:**
   ```
   http://localhost:8080/
   ```

---

## Licencia &amp; Derechos

Desarrollado y mantenido por **Ing. Jesús Javier Hernández Olvera**. Distribuido bajo la Licencia MIT.

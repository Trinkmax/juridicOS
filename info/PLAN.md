# juridicOS — Plan de Producto

> Sistema de gestión integral para estudios jurídicos (legal practice management) — Cloud, multi-estudio y potenciado con IA.
> Pensado para Córdoba / Argentina, con foco inicial en estudios medianos y grandes.

**Versión del documento:** 0.1 (borrador inicial)
**Fecha:** 2026-06-01
**Estado:** Planificación

---

## Tabla de contenidos

1. [Visión y problema](#1-visión-y-problema)
2. [Mercado y posicionamiento](#2-mercado-y-posicionamiento)
3. [Usuarios, roles y permisos](#3-usuarios-roles-y-permisos)
4. [Módulos del producto](#4-módulos-del-producto)
5. [El motor de plazos (feature estrella)](#5-el-motor-de-plazos-feature-estrella)
6. [Integración con el SAC Multifuero](#6-integración-con-el-sac-multifuero)
7. [Capa de IA (Claude)](#7-capa-de-ia-claude)
8. [Arquitectura técnica](#8-arquitectura-técnica)
9. [Modelo de datos](#9-modelo-de-datos)
10. [Multi-tenancy y seguridad](#10-multi-tenancy-y-seguridad)
11. [Privacidad y compliance](#11-privacidad-y-compliance)
12. [Onboarding y migración](#12-onboarding-y-migración)
13. [Modelo de negocio (SaaS)](#13-modelo-de-negocio-saas)
14. [Roadmap por fases](#14-roadmap-por-fases)
15. [Métricas de éxito (KPIs)](#15-métricas-de-éxito-kpis)
16. [Riesgos y mitigaciones](#16-riesgos-y-mitigaciones)
17. [Fuera de alcance v1](#17-fuera-de-alcance-v1)
18. [Glosario](#18-glosario)
19. [Próximos pasos](#19-próximos-pasos)

---

## 1. Visión y problema

### El problema
Los estudios jurídicos en Argentina trabajan con herramientas fragmentadas y obsoletas:
- **Plazos procesales** controlados a mano (agenda de papel, Excel, memoria) → un plazo vencido es **mala praxis** y responsabilidad profesional.
- **Software dominante de escritorio** (Lex-Doctor) anclado a una PC, sin nube, sin IA, con UX de hace 20 años.
- **Redacción** de escritos y contratos repetitiva, copy-paste de modelos viejos.
- **Información dispersa** entre el SAC del Poder Judicial, mails, WhatsApp, carpetas físicas y la cabeza de cada abogado.
- En estudios **medianos/grandes**, además: falta de visibilidad de la carga de trabajo del equipo, quién hace qué, y control de honorarios.

### La visión
**juridicOS** es el sistema operativo del estudio jurídico moderno: una plataforma en la nube donde el estudio gestiona sus causas, controla automáticamente sus plazos, redacta documentos con IA, coordina al equipo y mantiene informados a sus clientes — todo en un solo lugar, seguro y accesible desde cualquier dispositivo.

### Propuesta de valor (one-liner)
> "Nunca más un plazo vencido, la mitad del tiempo de redacción, y todo el estudio en una sola pantalla."

### Diferenciadores clave
1. **Motor de plazos inteligente** con calendario judicial de Córdoba (feria, asuetos, plazo de gracia).
2. **Redacción asistida con IA** (Claude) sobre los datos reales del expediente.
3. **Cloud-native y multi-dispositivo** (vs. el escritorio de la competencia).
4. **Portal del cliente** para reducir la consulta telefónica constante.
5. **Pensado para equipos**: roles, asignaciones, reportes de productividad.

---

## 2. Mercado y posicionamiento

### Competencia (Argentina)
| Producto | Tipo | Debilidad que explotamos |
|----------|------|--------------------------|
| **Lex-Doctor** | Escritorio, líder histórico | Sin nube real, sin IA, UX antigua, difícil de actualizar |
| iurix / iJus | Web | Foco en gestión judicial interna, no en el estudio |
| Quanto, Legytech, Globalia | Web/SaaS | Funciones parciales, poca IA |
| Excel / Google Calendar | Manual | Cero automatización de plazos, error humano |

### Posicionamiento
juridicOS = **"el Notion/Linear de los estudios jurídicos argentinos"**: moderno, colaborativo, con IA nativa y específico para el procedimiento local (no un CRM genérico adaptado).

### Segmento objetivo (v1)
Estudios **medianos y grandes** (5–50+ profesionales) en Córdoba, con varios fueros (civil, comercial, laboral, familia), que sienten el dolor de coordinar equipos y plazos. Expansión posterior: otras provincias y estudios chicos.

---

## 3. Usuarios, roles y permisos

### Personas
- **Socio/a (Owner/Admin):** ve todo el estudio, configura, gestiona usuarios, facturación y reportes.
- **Abogado/a asociado:** gestiona sus causas y las del equipo asignado, redacta, controla plazos.
- **Procurador/a:** seguimiento de expedientes, diligencias, carga de movimientos.
- **Paralegal / asistente legal:** carga de datos, documentos, apoyo en redacción.
- **Secretaria/o administrativo:** agenda, clientes, facturación, recordatorios.
- **Cliente (externo):** acceso restringido al **Portal del Cliente** (solo sus casos).

### Matriz de roles (resumen)
| Capacidad | Admin | Abogado | Procurador | Paralegal | Secretaría | Cliente |
|-----------|:-----:|:-------:|:----------:|:---------:|:----------:|:-------:|
| Configurar estudio / usuarios | ✅ | — | — | — | — | — |
| Ver todas las causas | ✅ | ◑¹ | ◑¹ | ◑¹ | ◑¹ | — |
| Crear/editar expedientes | ✅ | ✅ | ✅ | ✅ | ◑ | — |
| Gestionar plazos/agenda | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Redactar con IA | ✅ | ✅ | — | ✅ | — | — |
| Ver honorarios/facturación | ✅ | ◑² | — | — | ✅ | — |
| Portal: ver estado de su caso | — | — | — | — | — | ✅ |

¹ Configurable: "solo causas asignadas" vs. "todas". ² Solo sus propias causas.

> El sistema de permisos debe ser **granular y configurable por estudio** (RBAC con scoping por expediente/equipo), no un enum fijo.

---

## 4. Módulos del producto

### 🟢 Núcleo (MVP / Fase 1)

#### 4.1 Gestión de Expedientes / Causas
- Ficha de causa: carátula, **nº SAC**, fuero, materia, juzgado, secretaría, etapa procesal, estado (en trámite / sentencia / ejecución / archivo).
- **Partes:** actor, demandado, terceros, con rol procesal.
- Cliente vinculado + abogados asignados (equipo de la causa).
- **Línea de tiempo de movimientos** (manual en v1; automática a futuro).
- Vinculación de documentos, plazos, audiencias y tareas a la causa.
- Vista lista con filtros (fuero, juzgado, abogado, estado) y búsqueda.

#### 4.2 Agenda y Plazos ⭐
- **Calculadora de plazos procesales** (ver sección 5): días hábiles, feria, asuetos, plazo de gracia.
- **Audiencias** con tipo, juzgado, lugar/virtual, recordatorios.
- **Vencimientos y tareas** con responsable y prioridad.
- Vistas **día / semana / mes** y "Mis vencimientos de hoy/semana".
- **Recordatorios escalonados** multi-canal: in-app, email, push y (opcional) WhatsApp — p.ej. T-5 / T-2 / día del vencimiento.
- Calendario judicial de Córdoba precargado y mantenido.

#### 4.3 CRM de Clientes
- Ficha: persona física/jurídica, DNI/CUIT, contacto, domicilio (real y electrónico).
- Casos asociados e historial de comunicaciones.
- Estado de cuenta del cliente (link a honorarios).

### 🟡 Importantes (Fase 2)

#### 4.4 Redacción de Documentos + IA
- **Biblioteca de plantillas:** demandas, contestaciones, escritos, contratos, poderes, cartas documento, oficios, telegramas laborales.
- **Campos variables** que se autocompletan con datos del cliente/expediente (mail-merge).
- **Editor enriquecido** con versionado e historial.
- **Asistente de redacción con IA (Claude):** generar/mejorar/resumir un escrito a partir del contexto del expediente. El abogado siempre revisa y aprueba.
- Exportación a PDF/DOCX, listo para presentar.

#### 4.5 Portal del Cliente
- Acceso seguro para que el cliente vea el **estado y avances** de su(s) causa(s), próximas audiencias, documentos compartidos y su estado de cuenta.
- Reduce drásticamente las llamadas "¿cómo va mi juicio?".

#### 4.6 Tareas y Equipo
- Asignación de tareas (a una persona o equipo), estados (pendiente / en curso / hecho), prioridad, vencimiento.
- Tablero tipo Kanban + vista por persona ("carga de trabajo").
- Vinculación opcional a una causa.

#### 4.7 Documentos y Archivo Digital
- Repositorio por expediente y por cliente (Supabase Storage).
- **OCR** de PDFs escaneados (cédulas, oficios) para búsqueda full-text.
- Etiquetas, versionado, control de acceso.

### 🔵 Avanzados (Fase 3+)

#### 4.8 Notificaciones y Movimientos (SAC)
- Registro de notificaciones y movimientos del expediente.
- Fase 1: **carga manual** → genera el plazo con un clic.
- Fase 3: **ingesta automática** de notificaciones electrónicas (ver sección 6).

#### 4.9 Honorarios y Facturación
- **Time-tracking** por causa/abogado y registro de gastos.
- Cálculo de honorarios por **jus / ley arancelaria** y pacto de cuota litis.
- **Facturación electrónica AFIP/ARCA** (CAE).
- Estados de cuenta y recordatorios de cobro.

#### 4.10 Dashboard y Reportes
- Próximos vencimientos, audiencias de la semana, alertas críticas.
- Carga de trabajo por abogado, estado de la cartera de causas.
- Reportes de facturación y productividad (para socios).

#### 4.11 Biblioteca jurídica / Investigación
- Modelos y precedentes propios del estudio.
- Búsqueda de jurisprudencia/doctrina asistida por IA (con fuentes).

#### 4.12 Administración del estudio
- Gestión de usuarios, roles y permisos.
- Configuración del estudio (datos, logo, plantillas, jurisdicciones).
- Suscripción y facturación del SaaS, uso de IA y almacenamiento.
- **Audit log** de acciones sensibles.

---

## 5. El motor de plazos (feature estrella)

Es la funcionalidad que justifica el producto. Debe ser **parametrizable**, no hardcodeada.

### Reglas de cómputo
- **Tipos de plazo:** días hábiles judiciales (mayoría), días corridos, horas.
- **Inicio del cómputo:** desde el día **siguiente** al de la notificación.
- **Días inhábiles:** sábados, domingos, **feriados** nacionales y provinciales, **feria judicial** (enero completo + receso de invierno en julio en Córdoba) y **asuetos** dispuestos por Acuerdos del TSJ.
- **Plazo de gracia:** presentación válida dentro de las **dos primeras horas** del día hábil siguiente al vencimiento ("cargo de las dos primeras horas").
- **Suspensión / interrupción** de plazos (configurable por evento).

### Calendario judicial
- Tabla `calendario_judicial` con días inhábiles por jurisdicción y año.
- Mantenimiento centralizado (lo actualiza el equipo de juridicOS al publicarse los Acuerdos del TSJ) + posibilidad de asuetos locales por estudio.

### Catálogo de plazos típicos (a parametrizar y validar contra el CPCC de Córdoba — Ley 8465 y leyes de cada fuero)
| Acto procesal | Plazo (ejemplo, **a validar**) | Tipo |
|---------------|-------------------------------|------|
| Contestar demanda (juicio ordinario) | 10 días | hábiles |
| Contestar demanda (juicio abreviado) | 6 días | hábiles |
| Oponer excepciones | 6 días | hábiles |
| Apelar | 5 días | hábiles |
| Recurso de reposición | 3 días | hábiles |
| Expresar agravios | según traslado | hábiles |

> ⚠️ Los valores exactos **dependen del fuero y del código procesal aplicable** y deben cargarse/validarse con un abogado. El motor los toma como datos configurables, nunca fijos en código.

### UX del plazo
1. Llega/carga una notificación → 2. El sistema sugiere el tipo de acto y calcula el vencimiento (mostrando los días contados y los inhábiles salteados) → 3. El abogado confirma → 4. Se programan recordatorios automáticos.

---

## 6. Integración con el SAC Multifuero

El SAC del Poder Judicial de Córdoba (extranet) **no tiene API pública oficial**. Estrategia por fases, de menor a mayor riesgo:

### Fase 1 — Carga manual ✅ (elegida para el MVP)
- El estudio carga nº SAC, carátula, movimientos y notificaciones a mano.
- 100% legal y simple. juridicOS aporta valor en plazos, agenda, redacción y equipo.
- UX optimizada para que cargar una notificación y generar el plazo sea de segundos.

### Fase 2 — Ingesta de notificaciones electrónicas (recomendada a mediano plazo)
- El Poder Judicial notifica al **domicilio electrónico** del abogado.
- Si esas notificaciones se reenvían/conectan a una casilla de juridicOS, la **IA parsea la cédula**, detecta el acto y **propone el plazo automáticamente**.
- Bajo riesgo legal, alto valor. **Pendiente:** validar el formato y canal exacto de las notificaciones.

### Fase 3 — Automatización del navegador (RPA/scraping) — opcional
- Bot (Playwright headless) que, con las **credenciales propias del abogado** y su consentimiento explícito, baja novedades de los expedientes.
- Potente, pero **frágil** (rompe si cambia el HTML) y requiere **revisar los Términos del Poder Judicial**.
- Solo si Fase 2 no alcanza. Aislar en un worker separado con manejo de errores y reintentos.

> **Acción previa:** averiguar si el Poder Judicial de Córdoba ofrece algún canal oficial de exportación/interoperabilidad antes de invertir en scraping.

---

## 7. Capa de IA (Claude)

La IA es nativa, no un agregado. Casos de uso:

| Caso de uso | Descripción | Fase |
|-------------|-------------|:----:|
| **Asistente de redacción** | Genera/mejora escritos y contratos con datos del expediente | 2 |
| **Resumen de expediente** | TL;DR de una causa larga en segundos | 2 |
| **Parseo de cédulas** | Lee una notificación (PDF) y sugiere acto + plazo | 3 |
| **Q&A sobre el expediente** | "¿Qué falta presentar en esta causa?" (RAG) | 3 |
| **Clasificación de novedades** | Prioriza notificaciones por urgencia | 3 |
| **Búsqueda de jurisprudencia** | Encuentra precedentes con cita de fuente | 4 |

### Arquitectura de IA
- **Claude API** (modelos Claude 4.x) vía server actions / edge functions.
- **RAG** sobre documentos del expediente con **pgvector** (embeddings) en Supabase.
- **Prompt caching** para abaratar contexto repetido (plantillas, normas).
- **Structured outputs** (tool use) para extraer datos de cédulas de forma confiable.
- **Control de costos por tenant**: límite/medición de tokens por estudio + plan.

### Guardrails (no negociables)
- La IA **asiste, no decide**: todo output legal lo revisa y aprueba un humano.
- Disclaimers claros ("no constituye asesoramiento jurídico").
- **Trazabilidad**: se registra qué se generó con IA, cuándo y por quién.
- Los datos del estudio **no se usan para entrenar** modelos.

---

## 8. Arquitectura técnica

### Stack
- **Frontend/Backend:** Next.js (App Router, RSC + Server Actions) + TypeScript + Tailwind.
- **Datos/Auth/Storage:** Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions).
- **IA:** Claude API + pgvector.
- **Jobs/Workers:** Supabase Edge Functions + `pg_cron` + Queues (recordatorios, OCR, ingesta de mails; scraping a futuro en worker dedicado).
- **Notificaciones:** Email (Resend), Web Push, WhatsApp (Meta/Twilio) opcional.
- **Facturación AFIP:** servicio/SDK de facturación electrónica (CAE).
- **Pagos del SaaS:** Mercado Pago / Stripe.

### Componentes
```
┌───────────────────────────────────────────────────────────┐
│                    Next.js (Vercel)                         │
│   UI · Server Actions · Portal Cliente · API interna        │
└───────────────┬───────────────────────────┬────────────────┘
                │                            │
        ┌───────▼────────┐          ┌────────▼─────────┐
        │   Supabase     │          │   Claude API     │
        │ Postgres + RLS │◄────────►│  (RAG/pgvector)  │
        │ Auth · Storage │          └──────────────────┘
        │ Realtime · Fn  │
        └───────┬────────┘
                │  pg_cron / Queues
        ┌───────▼─────────────────────────────────────┐
        │ Workers: recordatorios · OCR · ingesta mail  │
        │ (Fase 3) scraping SAC · (Fase 3) AFIP        │
        └──────────────────────────────────────────────┘
                │
        Notificaciones: Email · Push · WhatsApp
```

---

## 9. Modelo de datos

Todas las tablas de negocio llevan `estudio_id` (tenant) y están protegidas por **RLS**. Entidades principales:

### Tenancy y usuarios
- **`estudios`** — tenant: nombre, CUIT, domicilio, plan, config, branding.
- **`usuarios`** — perfil ligado a `auth.users`, datos profesionales (matrícula).
- **`miembros_estudio`** — relación usuario↔estudio con **rol** y scope (mapeo N:N por si un usuario pertenece a varios estudios).
- **`roles` / `permisos`** — RBAC granular configurable.

### Causas y partes
- **`clientes`** — tipo (física/jurídica), DNI/CUIT, contacto, domicilio real y electrónico.
- **`expedientes`** — `nro_sac`, carátula, fuero, materia, juzgado, secretaría, etapa, estado, `cliente_id`, fechas.
- **`partes`** — `expediente_id`, tipo (actor/demandado/tercero), nombre, rol procesal.
- **`expediente_miembros`** — abogados/equipo asignados a la causa.
- **`movimientos`** — `expediente_id`, fecha, tipo, descripción, origen (manual/sac).

### Agenda y plazos
- **`notificaciones`** — `expediente_id`, fecha_notif, tipo_acto, contenido, `plazo_id`.
- **`plazos`** — `expediente_id`, tipo_acto, fecha_inicio_computo, dias, modalidad (hábiles/corridos), **fecha_vencimiento** (calculada), estado, `responsable_id`.
- **`audiencias`** — `expediente_id`, fecha_hora, tipo, lugar/virtual, resultado.
- **`eventos_agenda`** — eventos genéricos de calendario.
- **`recordatorios`** — entidad relacionada, canal, momento (offset), estado de envío.
- **`calendario_judicial`** — jurisdicción, fecha, tipo de inhábil (feriado/feria/asueto).

### Tareas, documentos y plantillas
- **`tareas`** — título, `asignado_a`, estado, prioridad, vencimiento, `expediente_id?`.
- **`documentos`** — `estudio_id`, `expediente_id?`, nombre, tipo, storage_path, versión, texto_ocr.
- **`plantillas`** — nombre, tipo, contenido con variables, ámbito (estudio/global).
- **`documentos_generados`** — `plantilla_id`, `expediente_id`, contenido, `generado_por_ia` (bool).
- **`embeddings`** — pgvector para RAG (chunk, vector, doc_id).

### CRM, honorarios y facturación
- **`comunicaciones`** — `cliente_id`, tipo, contenido, fecha (historial CRM).
- **`time_entries`** — `expediente_id`, `usuario_id`, fecha, horas, descripción, tarifa.
- **`honorarios`** — cálculo, jus, pacto cuota litis, estado.
- **`facturas`** — `cliente_id`, items, total, estado, CAE/AFIP.

### Plataforma
- **`suscripciones`** — plan, estado, ciclo, límites (usuarios, IA, storage).
- **`audit_log`** — `estudio_id`, `usuario_id`, acción, entidad, timestamp, IP.
- **`ai_interactions`** — log de uso de IA (tokens, costo, feature) por tenant.

---

## 10. Multi-tenancy y seguridad

- **Aislamiento por RLS:** cada tabla filtra por `estudio_id`. Una función `auth.estudio_id()` lee el claim del JWT; las policies usan `using (estudio_id = auth.estudio_id())`.
- **Rol en el JWT** (custom claims) para policies basadas en rol + scope por expediente.
- **Principio de menor privilegio:** el `service_role` solo en server/workers, nunca expuesto al cliente. Cliente usa `anon` + RLS.
- **Portal del cliente** con políticas extra-restrictivas: el cliente solo ve filas donde es `cliente_id` de la causa.
- **Defensa en profundidad:** validación en server actions (Zod) + RLS en la base. Nunca confiar solo en el frontend.

---

## 11. Privacidad y compliance

El **secreto profesional** y los datos sensibles de clientes son el activo más delicado; la confianza es el producto.
- **Ley 25.326** de Protección de Datos Personales (y su actualización en curso): bases legales, derechos ARCO, registro de bases.
- **Cifrado** en tránsito (TLS) y en reposo; consideración de cifrado a nivel campo para datos ultra-sensibles.
- **Audit log** inmutable de accesos y acciones sensibles.
- **Backups** automáticos + plan de recuperación.
- **Data residency:** evaluar alojamiento/region acorde a requisitos del cliente.
- **Política de IA:** datos del estudio no se usan para entrenamiento; minimización de datos enviados al modelo.
- **Retención y borrado:** políticas por estudio (qué se guarda y por cuánto).

---

## 12. Onboarding y migración

Para estudios medianos/grandes, **migrar es el principal freno de adopción**. Ofrecer:
- **Importador** desde Excel/CSV (clientes, causas, contactos).
- Asistente de **migración desde Lex-Doctor** (export/parse) como servicio de onboarding.
- Carga guiada de plantillas propias del estudio.
- Capacitación inicial y datos de ejemplo precargados.

---

## 13. Modelo de negocio (SaaS)

### Pricing (hipótesis a validar)
Modelo **por usuario/mes** con bandas, en tres planes:

| Plan | Incluye | Pensado para |
|------|---------|--------------|
| **Básico** | Expedientes, Agenda/Plazos, Clientes | Estudios chicos / arranque |
| **Pro** | + Redacción IA, Documentos/OCR, Portal Cliente, Tareas/Equipo | Estudios medianos |
| **Premium** | + Facturación AFIP, Ingesta de notificaciones, Reportes avanzados, Soporte prioritario | Estudios grandes |

- **Add-ons:** créditos de IA adicionales, almacenamiento extra, integración SAC.
- **Servicios:** onboarding/migración (one-time).
- Cobro vía **Mercado Pago** (local) / Stripe.

---

## 14. Roadmap por fases

### Fase 0 — Fundaciones (semanas 1–3)
- Scaffold Next.js + Supabase, **multi-tenancy + RLS**, Auth, roles base.
- Modelo de datos núcleo, CI, entornos.

### Fase 1 — MVP vendible (semanas 4–12)
- **Expedientes + Partes + Clientes** (carga manual del SAC).
- **Agenda + Motor de plazos** + calendario judicial Córdoba + recordatorios (in-app/email).
- Dashboard básico ("mis vencimientos").
- Roles/permisos esenciales.

### Fase 2 — Diferenciación (meses 4–6)
- **Redacción con IA** + plantillas + documentos/OCR.
- **Portal del cliente**.
- **Tareas y equipo** (Kanban + carga de trabajo).
- Recordatorios push/WhatsApp.

### Fase 3 — Automatización (meses 7–9)
- **Ingesta de notificaciones electrónicas** + parseo IA → plazos.
- Q&A sobre expediente (RAG).
- **Honorarios + Facturación AFIP**.
- Reportes avanzados.

### Fase 4 — Expansión (meses 10+)
- Scraping SAC (opcional), Biblioteca jurídica, Analítica.
- Otras provincias/jurisdicciones, app móvil.

---

## 15. Métricas de éxito (KPIs)

- **Producto:** % de plazos gestionados en el sistema, plazos vencidos = 0, tiempo de redacción reducido.
- **Adopción:** usuarios activos/estudio, causas cargadas, % de clientes usando el portal.
- **Negocio:** estudios activos, MRR, churn, NPS.
- **IA:** documentos generados, satisfacción con outputs, costo de IA por estudio.

---

## 16. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Cálculo de plazos incorrecto | Crítico (mala praxis) | Motor parametrizable + validación con abogados + el humano confirma siempre |
| Sin API del SAC | Alto | Carga manual primero; ingesta de notificaciones; scraping solo como último recurso |
| Fuga de datos sensibles | Crítico | RLS estricto, cifrado, audit, pentest, mínimos privilegios |
| Resistencia a migrar de Lex-Doctor | Alto | Importador + onboarding asistido + UX claramente superior |
| Costos de IA | Medio | Prompt caching, límites por plan, medición por tenant |
| Cambios normativos/procesales | Medio | Calendario y catálogo de plazos como datos, no código |

---

## 17. Fuera de alcance v1

- Firma digital con token/dispositivo oficial del Poder Judicial (se evalúa luego).
- Presentación electrónica directa al SAC desde juridicOS.
- App móvil nativa (la web es responsive en v1).
- Jurisdicciones fuera de Córdoba (se diseña para extender, pero v1 = Córdoba).
- Contabilidad completa del estudio (solo honorarios/facturación, no ERP).

---

## 18. Glosario

- **SAC / SAC Multifuero:** Sistema de Administración de Causas del Poder Judicial de Córdoba.
- **Expediente / Causa:** el caso judicial y su conjunto de actuaciones.
- **Carátula:** título del expediente ("ACTOR c/ DEMANDADO - ORDINARIO").
- **Fuero:** rama judicial (civil, comercial, laboral, familia, penal).
- **Plazo procesal:** tiempo legal para realizar un acto; su vencimiento es perentorio.
- **Feria judicial:** período de receso (enero + invierno) con días inhábiles.
- **Plazo de gracia:** dos primeras horas del día hábil siguiente para presentar válidamente.
- **Cédula / Notificación:** comunicación oficial que suele disparar un plazo.
- **Jus:** unidad de medida de los honorarios profesionales.
- **Domicilio electrónico:** casilla oficial donde el Poder Judicial notifica.
- **RLS (Row Level Security):** seguridad a nivel de fila en Postgres para aislar tenants.

---

## 19. Próximos pasos

1. **Validar este plan** y ajustar prioridades de módulos.
2. **Definir el esquema de base de datos** detallado (migraciones Supabase + RLS) — núcleo de Fase 0/1.
3. **Diseñar el motor de plazos** con un abogado: cargar el calendario judicial 2026 de Córdoba y el catálogo de plazos por fuero.
4. **Scaffold del proyecto** (Next.js + Supabase, multi-tenant, auth, roles).
5. **Maquetar** las pantallas clave: lista de expedientes, ficha de causa, agenda/plazos, dashboard.

> Cuando quieras, seguimos con el **modelo de datos detallado** o el **scaffold técnico** de Fase 0.

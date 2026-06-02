# juridicOS

> El sistema operativo del estudio jurídico moderno. Gestión integral en la nube,
> multi-estudio y con IA, pensada para estudios de Córdoba (Argentina).

**Propuesta de valor:** _“Nunca más un plazo vencido, la mitad del tiempo de redacción
y todo el estudio en una sola pantalla.”_

Este repositorio implementa la **Fase 0 (fundaciones)** y el **núcleo de la Fase 1
(MVP vendible)**: multi-tenancy con RLS, autenticación, el **motor de plazos** (la
feature estrella), expedientes, clientes, agenda y un dashboard — todo con una UI
premium y animada.

---

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend/Backend | Next.js 16 (App Router · RSC · Server Actions) · React 19 · TypeScript |
| Estilos | Tailwind CSS v4 (tokens en `oklch`) · Radix UI · motion · lucide-react |
| Datos / Auth | Supabase (PostgreSQL + RLS · Auth · Storage) |
| Validación | Zod (cliente y servidor) |
| Proyecto Supabase | `pzmgvvxmdgpfcvbysmai` |

---

## Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:3000
```

Variables de entorno (`.env.local`, ya incluido para desarrollo):

```
NEXT_PUBLIC_SUPABASE_URL=https://pzmgvvxmdgpfcvbysmai.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

### Cuenta de demostración

En la pantalla de ingreso, **“Entrar a la demo”** (o):

- **Email:** `demo@juridicos.app`
- **Contraseña:** `demo1234`

Carga un estudio con clientes, expedientes, plazos (con urgencias variadas),
audiencias y tareas de ejemplo.

---

## El motor de plazos ⭐

Es la funcionalidad que justifica el producto y está **100% en la base de datos**
(parametrizable, nunca hardcodeada):

- `public.es_dia_habil(fecha, jurisdiccion, estudio)` — sábados, domingos, feriados,
  feria judicial y asuetos.
- `public.computar_plazo(inicio, dias, modalidad, jurisdiccion, estudio)` — calcula el
  vencimiento contando **días hábiles** desde el día siguiente a la notificación, salta
  inhábiles, calcula el **plazo de gracia (cargo de las dos primeras horas)** y devuelve
  el **desglose día por día** que la UI muestra para dar confianza.
- Un trigger recalcula `fecha_vencimiento` al crear/editar un plazo.

El **calendario judicial de Córdoba 2026** y el **catálogo de plazos** (CPCC Ley 8465,
laboral Ley 7987, familia Ley 10305) están precargados como datos globales editables.

> ⚠️ **Validación legal:** los plazos del catálogo y las fechas de la **feria de invierno**
> son una base **a validar con un abogado** contra el texto consolidado vigente y las
> Acordadas del TSJ. juridicOS **asiste, no reemplaza** el criterio profesional: el humano
> siempre confirma. Ver `info/research-calendario-plazos.json` (fuentes y nivel de confianza).

---

## Arquitectura

### Multi-tenancy y seguridad (RLS)
- Toda tabla de negocio lleva `estudio_id`. **Row Level Security activo en todas.**
- Funciones helper `SECURITY DEFINER` en el esquema `private` (sin recursión) resuelven
  la pertenencia del usuario: `private.staff_estudio_ids()`, `is_admin()`, etc.
- Patrón de policy performante: `estudio_id in (select private.staff_estudio_ids())`.
- **Portal del cliente**: policies extra-restrictivas — el cliente solo ve sus causas.
- Alta de estudio vía RPC `crear_estudio` (SECURITY DEFINER). Perfil de usuario creado por
  trigger en `auth.users`. Auditoría en `audit_log`.

### Migraciones (Supabase)
```
01_extensions_and_enums        06_rls_policies
02_core_tables                 07_indexes
03_auth_helpers_and_rpc        08_views_and_dashboard_rpc
04_deadline_engine             09_security_hardening_and_policy_cleanup
05_seed_calendario_y_catalogo  10_seed_demo
```

### Frontend
- `src/lib/supabase/*` — clientes SSR (`@supabase/ssr`) + middleware de sesión.
- `src/lib/session.ts` — contexto de sesión y estudio activo (cookie `jos_estudio`).
- `src/lib/constants.ts` — vocabulario de dominio (roles, fueros, estados, urgencias) con
  `label` + `tone` para la UI.
- `src/components/ui/*` — design system (Radix + CVA + tokens del tema).
- `src/lib/actions/*` — Server Actions con validación Zod.

---

## Módulos

| Módulo | Estado |
|--------|--------|
| Auth + onboarding multi-estudio | ✅ |
| Dashboard (vencimientos, agenda, métricas) | ✅ |
| Expedientes (lista, detalle con tabs, partes, movimientos) | ✅ |
| Clientes (CRM) | ✅ |
| Agenda + Plazos + **Calculadora de plazos** | ✅ |
| Tareas · Documentos · Equipo · Facturación · Portal cliente · IA | 🔜 Fase 2+ |

---

## Roadmap
- **Fase 2:** Redacción con IA (Claude + pgvector), documentos/OCR, portal del cliente,
  tareas/equipo (Kanban), recordatorios push/WhatsApp.
- **Fase 3:** Ingesta de notificaciones electrónicas → parseo IA → plazos, honorarios y
  facturación AFIP, reportes avanzados.

Ver `info/PLAN.md` para el plan de producto completo.

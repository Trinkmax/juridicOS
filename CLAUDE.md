# CLAUDE.md — guía para trabajar en juridicOS

Contexto y convenciones para asistentes de IA. El plan de producto está en `info/PLAN.md`.

## Qué es
SaaS legal multi-tenant para estudios jurídicos de Córdoba (AR). Next.js 16 (App Router,
RSC, Server Actions) + React 19 + TypeScript + Tailwind v4 + Supabase (RLS). UI en
**español (es-AR)**. Obsesión por la UX (nivel Linear/Notion).

## Comandos
- `npm run dev` · `npm run build` · `npm run lint`
- Migraciones y consultas Supabase: vía MCP de Supabase (proyecto `pzmgvvxmdgpfcvbysmai`).
  Tras cambios de esquema, regenerar `src/lib/types/database.ts` y correr `get_advisors`.

## Arquitectura clave
- **Multi-tenant + RLS**: toda tabla de negocio lleva `estudio_id`; RLS activo. Helpers en
  el esquema `private` (`SECURITY DEFINER`, `search_path=''`): `staff_estudio_ids()`,
  `user_estudio_ids()`, `is_admin()`, `client_expediente_ids()`. Policies usan
  `estudio_id in (select private.staff_estudio_ids())` (initplan cacheado).
- **Motor de plazos** (DB): `computar_plazo()`, `es_dia_habil()`, `proximo_dia_habil()`.
  Trigger `plazos_calcular` recalcula `fecha_vencimiento`. Calendario y catálogo son DATOS
  (tablas `calendario_judicial`, `catalogo_plazos`), nunca hardcode.
- **Sesión**: `requireEstudio()` / `getSessionContext()` (RSC). Estudio activo en cookie
  `jos_estudio`. `createClient()` de `@/lib/supabase/{server,client}`.

## Convenciones de código
- **Server Actions** (`src/lib/actions/*.ts`, `"use server"`): validar con Zod
  (`src/lib/validations/*`), obtener `getActionContext()` (`@/lib/actions/_base`), insertar
  con `estudio_id` + `created_by`, `revalidatePath`, devolver `ActionResult` (`{ok,...}` /
  `{ok:false,error,fieldErrors}`). Para altas full-page la action puede `redirect()`.
- **Formularios** (client): `useActionState` + `useFormStatus`. Errores con `<Field error>`
  y `<FormError>`. En diálogos: `useEffect` sobre `state.ok` → `toast.success` + cerrar +
  `router.refresh()`.
- **Datos en RSC**: `await requireEstudio()` → filtrar por `activeEstudio.id` (RLS además
  protege). `params`/`searchParams` son **Promesas** (Next 16): `await params`.
- **UI**: usar primitivos de `src/components/ui/*` (no reinventar). Vocabulario y `tone`
  desde `src/lib/constants.ts`. Fechas con `src/lib/format.ts`. Para plazos usar SIEMPRE
  `<PlazoUrgenciaBadge>` y `plazoTono()` (`@/components/shared/plazo-badge`).
- Tokens de tema (Tailwind v4) en `src/app/globals.css`: `primary`, `primary-soft`,
  `success/warning/destructive(-soft)`, `muted`, etc. Animaciones: `FadeIn/Stagger`
  (`@/components/motion/fade-in`).

## Seguridad (no negociable)
- Nunca exponer `service_role` al cliente. Cliente usa la publishable key + RLS.
- No confiar solo en el frontend: validar en server actions **y** RLS en la base.
- La IA asiste, no decide: todo output legal lo revisa un humano. Los plazos del catálogo
  **deben validarse con un abogado** (ver `info/research-calendario-plazos.json`).

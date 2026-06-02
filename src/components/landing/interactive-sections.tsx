"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CalendarDays,
  Sparkles,
  Search,
  CheckCircle2,
  Play,
  RotateCcw,
  Plus,
  ShieldAlert,
  ChevronDown,
  Bell,
  Mail,
  MessageSquare,
  Clock,
  Lock,
  Unlock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ────────────────────────────────────────────────────────────────────────
// 1. HERO PREVIEW INTERACTIVO (Dashboard Simplificado)
// ────────────────────────────────────────────────────────────────────────
export function HeroDashboardPreview() {
  const [activeTab, setActiveTab] = React.useState<"calendar" | "ai">("calendar");
  const [progress, setProgress] = React.useState(75);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl rounded-xl border border-border bg-card/60 shadow-xl backdrop-blur-md overflow-hidden text-left">
      {/* Header del Mockup */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-destructive/60" />
            <span className="size-3 rounded-full bg-warning/60" />
            <span className="size-3 rounded-full bg-success/60" />
          </div>
          <span className="ml-2 text-xs font-mono text-muted-foreground/80 sm:inline hidden">
            juridicos.app/estudio-valle
          </span>
        </div>
        <div className="flex gap-1 bg-secondary p-0.5 rounded-md border border-border">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === "calendar"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays className="size-3.5" />
            Agenda y Plazos
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === "ai"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="size-3.5" />
            Redacción IA
          </button>
        </div>
      </div>

      {/* Contenido del Mockup */}
      <div className="p-4 sm:p-6 min-h-[360px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {activeTab === "calendar" ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid gap-6 sm:grid-cols-3 flex-1"
            >
              {/* Sidebar de vencimientos del mockup */}
              <div className="space-y-3 sm:col-span-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Vencimientos Hoy
                </h4>
                <div className="relative overflow-hidden rounded-lg border border-destructive/20 bg-destructive-soft/30 p-3.5 animate-pulse-ring">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] uppercase font-bold text-destructive">
                      T-0 · Vence Hoy
                    </span>
                    <Badge tone="destructive" className="h-4 px-1.5 text-[9px] font-mono">
                      8:00 - 10:00 Gracia
                    </Badge>
                  </div>
                  <h5 className="font-display text-sm font-semibold mt-1">
                    Contestar Excepciones
                  </h5>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Autos: “Rodríguez c/ Provincia”
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-mono">Exp. 1029432</span>
                    <span className="font-medium text-destructive flex items-center gap-1">
                      <Clock className="size-3" /> Falta presentar
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-warning/30 bg-warning-soft/30 p-3.5">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] uppercase font-bold text-warning-foreground">
                      T-2 · Próximo
                    </span>
                    <Badge tone="warning" className="h-4 px-1.5 text-[9px] font-mono">
                      Vence 05/Jun
                    </Badge>
                  </div>
                  <h5 className="font-display text-sm font-semibold mt-1">
                    Interponer Apelación
                  </h5>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Autos: “Martínez c/ Sancor”
                  </p>
                </div>
              </div>

              {/* Contenido principal - Calendario del mockup */}
              <div className="sm:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold font-display">
                    Calendario Procesal (Córdoba)
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    Junio 2026
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 text-center text-xs border border-border bg-muted/20 p-2.5 rounded-lg">
                  {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map((day) => (
                    <div key={day} className="font-medium text-muted-foreground py-1">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 30 }).map((_, i) => {
                    const dayNum = i + 1;
                    const isToday = dayNum === 2;
                    const isDeadline = dayNum === 2; // hoy
                    const isWarning = dayNum === 5;  // proximo
                    const isWeekend = dayNum % 7 === 6 || dayNum % 7 === 0;

                    return (
                      <div
                        key={i}
                        className={`aspect-square flex flex-col items-center justify-between p-1 rounded transition-all border ${
                          isToday
                            ? "bg-destructive-soft/20 border-destructive/30"
                            : isWeekend
                            ? "bg-secondary/40 border-transparent text-muted-foreground/50"
                            : "bg-card border-border hover:border-foreground/20"
                        }`}
                      >
                        <span className={`text-[10px] font-medium ${isToday ? "text-destructive font-bold" : ""}`}>
                          {dayNum}
                        </span>
                        {isDeadline && (
                          <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
                        )}
                        {isWarning && (
                          <span className="size-1.5 rounded-full bg-warning" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" /> Feriados y asuetos de la Justicia de Córdoba integrados automáticamente.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4 flex-1 justify-center max-w-3xl mx-auto w-full"
            >
              <div className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-xs text-primary font-medium">
                  <Sparkles className="size-3.5" />
                  <span>Asistente de Redacción Jurídica</span>
                </div>
                <div className="bg-secondary p-3 rounded-md font-mono text-xs text-foreground/80 border border-border">
                  “Redactar contestación de demanda de daños por accidente automovilístico, alegando culpa exclusiva de la víctima por cruce de semáforo en rojo.”
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Generando defensa legal fundamentada...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden border border-border">
                    <div
                      className="bg-primary h-full transition-all duration-100 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-4 font-serif text-[13px] leading-relaxed text-foreground/90 max-h-[160px] overflow-y-auto space-y-2">
                <p className="font-bold">SE PRESENTA. CONTESTA TRASLADO. HACE RESERVA CASO FEDERAL.</p>
                <p>Señor Juez:</p>
                <p>
                  Que en el carácter de apoderado de la parte demandada, vengo por el presente a contestar en tiempo y forma el traslado de la demanda incoada en contra de mi representado, solicitando su rechazo con costas por los fundamentos que expongo...
                </p>
                {progress > 50 && (
                  <p className="italic text-muted-foreground">
                    [...Fundamentos de derecho: Art. 1729 Código Civil y Comercial - Responsabilidad por hecho del damnificado...]
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-t border-border mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            {activeTab === "calendar"
              ? "Calculando en base al Calendario del Poder Judicial de Córdoba"
              : "Generación basada en el expediente SAC importado"}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3 text-success" /> Seguro (RLS)
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3 text-success" /> En la Nube
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 2. CALCULADORA DE PLAZOS (BENTO CARD 1)
// ────────────────────────────────────────────────────────────────────────
export function CordobaCalculator() {
  const [days, setDays] = React.useState<number>(5);
  const [notifDate, setNotifDate] = React.useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const getCalculation = () => {
    const start = new Date(notifDate + "T12:00:00");
    if (isNaN(start.getTime())) return null;

    const current = new Date(start);
    let counted = 0;
    const path: { date: Date; type: "habil" | "finde" | "feriado" }[] = [];

    // Feriados simulados (ej. feria de julio, feriado nacional, asueto judicial cordobes)
    const isCordobaHoliday = (date: Date) => {
      const month = date.getMonth();
      const day = date.getDate();
      // Simular feria de Julio (10 al 20 de Julio para demo)
      if (month === 6 && day >= 10 && day <= 20) return "Feria Judicial de Invierno";
      // Día del Empleado Judicial Córdoba (16 de Noviembre)
      if (month === 10 && day === 16) return "Día del Empleado Judicial (Córdoba)";
      // Feriado de prueba: 20 de Junio (Día de la Bandera)
      if (month === 5 && day === 20) return "Día de la Bandera";
      return null;
    };

    // La notificación no cuenta, empieza el día hábil siguiente
    // Iteramos hasta cumplir los días requeridos
    while (counted < days) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay(); // 0: Dom, 6: Sab
      const holidayName = isCordobaHoliday(current);

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        path.push({ date: new Date(current), type: "finde" });
      } else if (holidayName) {
        path.push({ date: new Date(current), type: "feriado" });
      } else {
        counted++;
        path.push({ date: new Date(current), type: "habil" });
      }
    }

    const deadline = new Date(current);
    
    // Plazo de gracia: primeras dos horas de oficina del día hábil posterior al vencimiento
    const gracia = new Date(deadline);
    let foundGracia = false;
    while (!foundGracia) {
      gracia.setDate(gracia.getDate() + 1);
      const dayOfWeek = gracia.getDay();
      const holidayName = isCordobaHoliday(gracia);
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayName) {
        foundGracia = true;
      }
    }

    return {
      deadline,
      gracia,
      path,
    };
  };

  const calc = getCalculation();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Notificación
          </label>
          <input
            type="date"
            value={notifDate}
            onChange={(e) => setNotifDate(e.target.value)}
            className="mt-1 w-full bg-secondary text-foreground text-xs rounded border border-border p-2 focus:ring-1 focus:ring-primary outline-hidden"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Plazo (Días Hábiles)
          </label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1 w-full bg-secondary text-foreground text-xs rounded border border-border p-2 focus:ring-1 focus:ring-primary outline-hidden"
          >
            {[3, 5, 9, 10, 15].map((d) => (
              <option key={d} value={d}>
                {d} días hábiles
              </option>
            ))}
          </select>
        </div>
      </div>

      {calc && (
        <div className="space-y-3 bg-muted/40 p-3 rounded-lg border border-border">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Vencimiento Término:</span>
            <span className="font-bold text-foreground font-mono bg-card px-2 py-0.5 rounded border border-border">
              {formatDate(calc.deadline)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Plazo de Gracia (Córdoba):</span>
            <span className="font-bold text-destructive font-mono bg-destructive-soft/30 px-2 py-0.5 rounded border border-destructive/25 flex items-center gap-1">
              <Clock className="size-3" /> {formatDate(calc.gracia)} (08:00 a 10:00)
            </span>
          </div>

          <div className="border-t border-border/80 pt-2.5 space-y-1.5">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Desglose de días corridos
            </span>
            <div className="flex flex-wrap gap-1">
              {calc.path.map((p, idx) => (
                <div
                  key={idx}
                  title={`${p.date.toLocaleDateString()} - ${p.type}`}
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                    p.type === "habil"
                      ? "bg-primary-soft/50 border-primary/25 text-primary font-semibold"
                      : p.type === "feriado"
                      ? "bg-warning-soft/50 border-warning/30 text-warning-foreground"
                      : "bg-secondary text-muted-foreground/60 border-transparent"
                  }`}
                >
                  {p.date.getDate()} {p.type === "habil" ? "H" : p.type === "feriado" ? "F" : "Fde"}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 3. SIMULADOR DE REDACCION CON IA (BENTO CARD 2)
// ────────────────────────────────────────────────────────────────────────
const WRITING_STEPS = [
  "Analizando autos e historial en SAC...",
  "Extrayendo fundamentos de doctrina...",
  "Generando borrador inicial...",
  "Revisando estilo y coherencia..."
];

const WRITTEN_TEXT = `SE PRESENTA. CONTESTA APELACIÓN. SOLICITA RECHAZO.

Excelentísima Cámara de Apelaciones:

Que en representación de la parte demandada, vengo a contestar en legal tiempo y forma la expresión de agravios formulada por la actora. Solicito se desestime el recurso de apelación con costas, confirmando la sentencia de primera instancia por resultar ajustada a derecho y constancias de autos...`;

export function AiRedactionSimulator() {
  const [isRunning, setIsRunning] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [displayText, setDisplayText] = React.useState("");
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      if (stepIndex < WRITING_STEPS.length) {
        timer = setTimeout(() => {
          setStepIndex((p) => p + 1);
        }, 1200);
      } else {
        // Iniciar escritura de texto
        let charIndex = 0;
        const textTimer = setInterval(() => {
          if (charIndex < WRITTEN_TEXT.length) {
            setDisplayText((prev) => prev + WRITTEN_TEXT.charAt(charIndex));
            charIndex++;
          } else {
            clearInterval(textTimer);
            setIsRunning(false);
          }
        }, 15);
        return () => clearInterval(textTimer);
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, stepIndex]);

  const handleStart = () => {
    setIsRunning(true);
    setStepIndex(0);
    setDisplayText("");
    setIsCopied(false);
  };

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-3.5 flex flex-col justify-between h-full">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge tone="primary" className="text-[9px] uppercase font-mono tracking-wider font-bold">
            Expediente: “García c/ Epec”
          </Badge>
          <div className="flex gap-1.5">
            <button
              onClick={handleStart}
              disabled={isRunning}
              className="flex items-center gap-1 text-[10px] bg-primary text-primary-foreground font-medium px-2 py-1 rounded-md shadow-xs hover:brightness-95 disabled:opacity-50"
            >
              {displayText ? <RotateCcw className="size-3" /> : <Play className="size-3" />}
              {displayText ? "Re-generar" : "Simular IA"}
            </button>
          </div>
        </div>

        <div className="bg-secondary/60 p-2.5 rounded-lg border border-border text-[11px] font-mono text-muted-foreground/80 flex items-center justify-between">
          <span>Prompt: “Contestar expresión de agravios...”</span>
          <Sparkles className="size-3.5 text-primary shrink-0 animate-pulse" />
        </div>
      </div>

      <div className="relative border border-border bg-card rounded-lg p-3 min-h-[140px] max-h-[170px] overflow-y-auto text-xs font-serif leading-relaxed flex-1">
        {isRunning && stepIndex < WRITING_STEPS.length ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/85 backdrop-blur-xs space-y-2">
            <span className="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-[10px] font-mono text-muted-foreground animate-pulse">
              {WRITING_STEPS[stepIndex]}
            </span>
          </div>
        ) : null}

        {displayText ? (
          <div className="whitespace-pre-wrap">{displayText}</div>
        ) : (
          <div className="text-muted-foreground/40 italic flex items-center justify-center h-full text-[11px]">
            Hacé clic en “Simular IA” para ver la redacción del escrito jurídico.
          </div>
        )}
      </div>

      {displayText && !isRunning && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-success flex items-center gap-1 font-mono">
            <CheckCircle2 className="size-3" /> Escrito listo
          </span>
          <button
            onClick={handleCopy}
            className="text-[10px] font-semibold text-primary underline underline-offset-2 hover:brightness-75"
          >
            {isCopied ? "¡Copiado!" : "Copiar borrador"}
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 4. EXPEDIENTES VIVOS - BUSCADOR DE CAUSAS (BENTO CARD 3)
// ────────────────────────────────────────────────────────────────────────
const MOCK_EXPEDIENTES = [
  { id: "1094832", carátula: "Gómez c/ Municipalidad", fuero: "Contencioso Adm.", estado: "Traslado", fecha: "Hoy" },
  { id: "1028344", carátula: "Pérez c/ Cardozo s/ Daños", fuero: "Civil y Comercial", estado: "Decreto", fecha: "Ayer" },
  { id: "1104859", carátula: "Rodríguez c/ Swiss Medical", fuero: "Civil y Comercial", estado: "Prueba", fecha: "31/May" },
  { id: "1074321", carátula: "López s/ Declaratoria", fuero: "Familia", estado: "Resolución", fecha: "28/May" },
  { id: "1011492", carátula: "Sindicato s/ Amparo", fuero: "Laboral", estado: "Trámite", fecha: "25/May" },
];

export function ExpedientesVivosSimulator() {
  const [search, setSearch] = React.useState("");

  const filtered = MOCK_EXPEDIENTES.filter(
    (exp) =>
      exp.carátula.toLowerCase().includes(search.toLowerCase()) ||
      exp.id.includes(search) ||
      exp.fuero.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3.5">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar exp., fuero o carátula (ej. 'Civil')..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-secondary text-foreground text-xs rounded-md border border-border pl-8 pr-3 py-2 outline-hidden focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="space-y-1.5 max-h-[145px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((exp) => (
              <motion.div
                key={exp.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/80 hover:bg-muted/60 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-muted-foreground">#{exp.id}</span>
                    <span className="font-medium text-xs truncate max-w-[130px]">{exp.carátula}</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground">{exp.fuero}</span>
                </div>
                <div className="text-right">
                  <Badge
                    tone={
                      exp.estado === "Traslado"
                        ? "destructive"
                        : exp.estado === "Resolución"
                        ? "success"
                        : "default"
                    }
                    className="px-1 py-0 h-4 text-[9px]"
                  >
                    {exp.estado}
                  </Badge>
                  <span className="block text-[8px] font-mono text-muted-foreground mt-0.5">{exp.fecha}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-muted-foreground/60 italic">
              No se encontraron causas.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 5. ALERTAS ESCALONADAS (BENTO CARD 4)
// ────────────────────────────────────────────────────────────────────────
export function EscalatedAlertsSimulator() {
  const [activeAlert, setActiveAlert] = React.useState<"email" | "push" | "wa">("email");

  return (
    <div className="space-y-4">
      {/* Timeline tracker */}
      <div className="flex justify-between items-center bg-secondary/40 p-2.5 rounded-lg border border-border">
        <button
          onClick={() => setActiveAlert("email")}
          className={`flex-1 flex flex-col items-center py-1.5 rounded transition-all ${
            activeAlert === "email" ? "bg-card shadow-xs border border-border" : "opacity-60"
          }`}
        >
          <Mail className="size-4 text-primary" />
          <span className="text-[9px] font-mono font-bold mt-1">T-5 (Email)</span>
        </button>
        <div className="w-4 h-0.5 bg-border" />
        <button
          onClick={() => setActiveAlert("push")}
          className={`flex-1 flex flex-col items-center py-1.5 rounded transition-all ${
            activeAlert === "push" ? "bg-card shadow-xs border border-border" : "opacity-60"
          }`}
        >
          <Bell className="size-4 text-warning-foreground" />
          <span className="text-[9px] font-mono font-bold mt-1">T-2 (Push)</span>
        </button>
        <div className="w-4 h-0.5 bg-border" />
        <button
          onClick={() => setActiveAlert("wa")}
          className={`flex-1 flex flex-col items-center py-1.5 rounded transition-all ${
            activeAlert === "wa" ? "bg-card shadow-xs border border-border" : "opacity-60"
          }`}
        >
          <MessageSquare className="size-4 text-destructive" />
          <span className="text-[9px] font-mono font-bold mt-1">T-0 (WhatsApp)</span>
        </button>
      </div>

      <div className="h-[95px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeAlert === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="w-full bg-card border border-border rounded-lg p-3 space-y-1.5 shadow-sm text-left"
            >
              <div className="flex items-center justify-between text-[9px] text-muted-foreground font-mono">
                <span>De: alertas@juridicos.app</span>
                <span>Hace 2 días</span>
              </div>
              <h5 className="font-semibold text-xs">[Alerta T-5] Vencimiento de Plazo</h5>
              <p className="text-[11px] text-muted-foreground line-clamp-2">
                Quedan 5 días hábiles para contestar demanda en autos “Martínez c/ Rossi”. Asignado a: Dra. Laura.
              </p>
            </motion.div>
          )}

          {activeAlert === "push" && (
            <motion.div
              key="push"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="w-full max-w-[280px] bg-neutral-900 text-white rounded-lg p-3 shadow-md text-left flex items-start gap-2.5"
            >
              <div className="bg-amber-500 text-black p-1.5 rounded-md shrink-0">
                <Bell className="size-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold text-[11px]">juridicOS</span>
                  <span className="text-[9px] text-neutral-400 font-mono">10m atrás</span>
                </div>
                <h5 className="text-[11px] font-semibold text-amber-400">Plazo próximo: T-2</h5>
                <p className="text-[10px] text-neutral-300">
                  Vence en 48hs hábiles. “Martínez c/ Rossi”. Presentar descargo.
                </p>
              </div>
            </motion.div>
          )}

          {activeAlert === "wa" && (
            <motion.div
              key="wa"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="w-full max-w-[260px] bg-emerald-950/20 dark:bg-emerald-950/40 border border-emerald-500/20 text-foreground rounded-lg p-3 shadow-xs text-left"
            >
              <div className="flex items-center gap-1.5 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider font-mono">
                <span className="size-1.5 rounded-full bg-destructive animate-ping" />
                <span>Alerta Crítica T-0</span>
              </div>
              <h5 className="font-semibold text-xs mt-1">¡VENCE HOY! Plazo de Gracia</h5>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Autos “Martínez c/ Rossi”. El plazo vence hoy. Gracia disponible hasta las 10:00 hs.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 6. CARGA DE TRABAJO DEL EQUIPO (BENTO CARD 5)
// ────────────────────────────────────────────────────────────────────────
const INITIAL_TEAM = [
  { name: "Dra. Laura Valle", role: "Socia", load: 78, color: "bg-destructive" },
  { name: "Dr. Esteban Ortiz", role: "Asociado", load: 45, color: "bg-primary" },
  { name: "Dra. Sofía Díaz", role: "Junior", load: 20, color: "bg-success" },
];

export function TeamWorkloadSimulator() {
  const [team, setTeam] = React.useState(INITIAL_TEAM);

  const handleAddTask = (idx: number) => {
    setTeam((prev) =>
      prev.map((member, i) => {
        if (i === idx) {
          const newLoad = Math.min(member.load + 15, 100);
          return { ...member, load: newLoad };
        }
        return member;
      })
    );
  };

  const handleReset = () => {
    setTeam(INITIAL_TEAM);
  };

  return (
    <div className="space-y-3.5">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          Carga de Trabajo en Tiempo Real
        </span>
        <button
          onClick={handleReset}
          className="text-[9px] font-mono text-primary flex items-center gap-1 hover:brightness-75"
        >
          <RotateCcw className="size-2.5" /> Reestablecer
        </button>
      </div>

      <div className="space-y-2.5">
        {team.map((member, idx) => (
          <div key={member.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold font-mono border border-border">
                  {member.name.split(" ")[1].charAt(0)}
                </div>
                <div>
                  <span className="font-semibold block">{member.name}</span>
                  <span className="text-[9px] text-muted-foreground block leading-none">{member.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold">{member.load}%</span>
                <button
                  onClick={() => handleAddTask(idx)}
                  title="Asignar expediente"
                  className="size-5 rounded bg-muted/60 hover:bg-primary hover:text-primary-foreground border border-border flex items-center justify-center transition-colors"
                >
                  <Plus className="size-3" />
                </button>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden border border-border/80">
              <motion.div
                className={`h-full ${
                  member.load > 75 ? "bg-destructive" : member.load > 40 ? "bg-warning" : "bg-primary"
                }`}
                initial={{ width: "0%" }}
                animate={{ width: `${member.load}%` }}
                transition={{ type: "spring", stiffness: 60, damping: 12 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 7. SEGURO POR DISEÑO / RLS (BENTO CARD 6)
// ────────────────────────────────────────────────────────────────────────
export function SecurityRlsSimulator() {
  const [activeEstudio, setActiveEstudio] = React.useState<"A" | "B">("A");
  const [attemptAccess, setAttemptAccess] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean | null>(null);

  const handleAccess = (targetEstudio: "A" | "B") => {
    setAttemptAccess(true);
    setSuccess(null);
    setTimeout(() => {
      if (activeEstudio === targetEstudio) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
      setAttemptAccess(false);
    }, 900);
  };

  return (
    <div className="space-y-3.5 flex flex-col justify-between h-full">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">Sesión Activa:</span>
        <div className="flex gap-1.5 bg-secondary p-0.5 rounded-md border border-border">
          <button
            onClick={() => {
              setActiveEstudio("A");
              setSuccess(null);
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              activeEstudio === "A" ? "bg-card text-foreground border border-border" : "text-muted-foreground"
            }`}
          >
            Estudio Valle
          </button>
          <button
            onClick={() => {
              setActiveEstudio("B");
              setSuccess(null);
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              activeEstudio === "B" ? "bg-card text-foreground border border-border" : "text-muted-foreground"
            }`}
          >
            Estudio Ortiz
          </button>
        </div>
      </div>

      <div className="bg-muted/30 border border-border rounded-lg p-3 text-center space-y-2.5 relative flex-1 flex flex-col justify-center">
        <div className="flex justify-center gap-8 items-center relative">
          <div className="flex flex-col items-center">
            <div className="size-9 rounded-md bg-primary-soft text-primary flex items-center justify-center font-bold font-mono border border-primary/20 text-xs">
              Valle
            </div>
            <span className="text-[9px] text-muted-foreground mt-1">Base Valle</span>
          </div>

          <div className="relative">
            {success === false ? (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-[9px] text-destructive font-mono font-bold whitespace-nowrap bg-destructive-soft border border-destructive/20 px-1.5 py-0.5 rounded-md">
                <ShieldAlert className="size-3 animate-bounce inline-block mr-0.5" /> RLS Bloqueado
              </div>
            ) : success === true ? (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-[9px] text-success font-mono font-bold whitespace-nowrap bg-success-soft border border-success/25 px-1.5 py-0.5 rounded-md">
                <CheckCircle2 className="size-3 inline-block mr-0.5" /> Acceso Autorizado
              </div>
            ) : null}

            <div className={`size-8 rounded-full flex items-center justify-center transition-all ${
              success === false ? "bg-destructive text-destructive-foreground animate-shake" : success === true ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground border border-border"
            }`}>
              {success === true ? <Unlock className="size-4" /> : <Lock className="size-4" />}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="size-9 rounded-md bg-secondary text-foreground flex items-center justify-center font-bold font-mono border border-border text-xs">
              Ortiz
            </div>
            <span className="text-[9px] text-muted-foreground mt-1">Base Ortiz</span>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleAccess("A")}
            disabled={attemptAccess}
            className="text-[10px] bg-secondary text-foreground border border-border font-medium px-2 py-1 rounded hover:bg-accent transition-colors disabled:opacity-50"
          >
            Consultar Valle
          </button>
          <button
            onClick={() => handleAccess("B")}
            disabled={attemptAccess}
            className="text-[10px] bg-secondary text-foreground border border-border font-medium px-2 py-1 rounded hover:bg-accent transition-colors disabled:opacity-50"
          >
            Consultar Ortiz
          </button>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        Row-Level Security (RLS) aisla de forma nativa los datos a nivel de base de datos PostgreSQL.
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 8. FAQ ACCORDION (ACORDEÓN DE PREGUNTAS FRECUENTES)
// ────────────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "¿Cómo calcula los plazos judiciales de la provincia de Córdoba?",
    a: "juridicOS cuenta con un motor de plazos parametrizado bajo la normativa del Poder Judicial de la Provincia de Córdoba. Registra automáticamente el calendario de feriados nacionales y provinciales, asuetos judiciales decretados por el TSJ, ferias judiciales (enero y julio) y aplica de forma nativa el plazo de gracia de las dos primeras horas de oficina del día posterior al vencimiento (8:00 a 10:00 hs)."
  },
  {
    q: "¿La redacción con Inteligencia Artificial es segura?",
    a: "Totalmente. El redactor de IA opera de forma aislada sobre la información específica de tu expediente cargado. Nunca expone datos confidenciales del estudio ni de tus clientes para entrenar modelos públicos. Cumplimos con un esquema de protección estricto y el borrador de escrito siempre queda sujeto a la revisión, modificación y aprobación final del abogado matriculado."
  },
  {
    q: "¿Cómo se importan los expedientes desde el SAC?",
    a: "Podés vincular tus expedientes indicando el fuero y número de causa. El sistema sincroniza de forma transparente los datos de carátula, intervinientes, juzgado de radicación y el historial de decretos y movimientos para que no tengas que cargar nada manualmente."
  },
  {
    q: "¿Qué medidas de seguridad protegen el secreto profesional?",
    a: "Implementamos aislamiento físico y lógico mediante políticas Row-Level Security (RLS) a nivel de base de datos PostgreSQL en Supabase. Esto garantiza que ningún usuario ajeno a tu estudio pueda leer ni modificar tus expedientes, aún en caso de errores en la capa de aplicación. Los datos se cifran en tránsito y en reposo."
  },
  {
    q: "¿Puedo usarlo con varios abogados de mi estudio?",
    a: "Sí. juridicOS está diseñado para el trabajo en equipo. Podés invitar a socios, asociados y colaboradores, asignarles roles específicos (administrador, abogado, asistente), delegarles la procuración de expedientes específicos y visualizar la carga horaria y de vencimientos de todo el estudio en un panel coordinado."
  }
];

export function FaqAccordion() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3.5 text-left">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className="rounded-lg border border-border bg-card transition-colors duration-200"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-5 text-left font-medium text-foreground hover:text-primary transition-colors focus:outline-hidden"
            >
              <span className="font-display text-[15px] sm:text-base leading-snug">
                {item.q}
              </span>
              <ChevronDown
                className={`size-4 text-muted-foreground shrink-0 transition-transform duration-250 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground border-t border-border/40 mt-1 pt-4">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

import {
  FileText,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  FileVideo,
  FileAudio,
  FileCode,
  File as FileIcon,
  type LucideIcon,
} from "lucide-react";

/** Tamaño legible (B / KB / MB / GB) a partir de bytes. */
export function formatTamano(bytes?: number | null): string {
  if (bytes == null || Number.isNaN(bytes)) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

type IconMeta = { icon: LucideIcon; className: string };

/* Tinta: el tipo de archivo se comunica por la FORMA del icono, no por color.
   El color saturado queda reservado a la urgencia de plazos; acá todo va en
   tinta neutra (foreground/muted) para una biblioteca sobria y consistente. */
const ICONO_TINTA = "text-foreground/65";

/** Icono según el MIME / extensión del documento (color en tinta neutra). */
export function iconoDocumento(mime?: string | null, nombre?: string | null): IconMeta {
  const m = (mime ?? "").toLowerCase();
  const ext = (nombre ?? "").split(".").pop()?.toLowerCase() ?? "";

  if (m.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext))
    return { icon: FileImage, className: ICONO_TINTA };

  if (m.startsWith("video/") || ["mp4", "mov", "avi", "mkv"].includes(ext))
    return { icon: FileVideo, className: ICONO_TINTA };

  if (m.startsWith("audio/") || ["mp3", "wav", "ogg", "m4a"].includes(ext))
    return { icon: FileAudio, className: ICONO_TINTA };

  if (
    m.includes("spreadsheet") ||
    m.includes("excel") ||
    ["xls", "xlsx", "csv", "ods"].includes(ext)
  )
    return { icon: FileSpreadsheet, className: ICONO_TINTA };

  if (m.includes("zip") || m.includes("compressed") || ["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return { icon: FileArchive, className: ICONO_TINTA };

  if (
    m.includes("json") ||
    m.includes("xml") ||
    m.includes("javascript") ||
    ["json", "xml", "html", "js", "ts", "css"].includes(ext)
  )
    return { icon: FileCode, className: ICONO_TINTA };

  if (m === "application/pdf" || ext === "pdf")
    return { icon: FileText, className: ICONO_TINTA };

  if (
    m.includes("word") ||
    m.includes("document") ||
    m.startsWith("text/") ||
    ["doc", "docx", "txt", "rtf", "odt"].includes(ext)
  )
    return { icon: FileText, className: ICONO_TINTA };

  return { icon: FileIcon, className: "text-muted-foreground" };
}

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

/** Icono + color según el MIME / extensión del documento. */
export function iconoDocumento(mime?: string | null, nombre?: string | null): IconMeta {
  const m = (mime ?? "").toLowerCase();
  const ext = (nombre ?? "").split(".").pop()?.toLowerCase() ?? "";

  if (m.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext))
    return { icon: FileImage, className: "text-violet-600 dark:text-violet-400" };

  if (m.startsWith("video/") || ["mp4", "mov", "avi", "mkv"].includes(ext))
    return { icon: FileVideo, className: "text-pink-600 dark:text-pink-400" };

  if (m.startsWith("audio/") || ["mp3", "wav", "ogg", "m4a"].includes(ext))
    return { icon: FileAudio, className: "text-amber-600 dark:text-amber-400" };

  if (
    m.includes("spreadsheet") ||
    m.includes("excel") ||
    ["xls", "xlsx", "csv", "ods"].includes(ext)
  )
    return { icon: FileSpreadsheet, className: "text-emerald-600 dark:text-emerald-400" };

  if (m.includes("zip") || m.includes("compressed") || ["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return { icon: FileArchive, className: "text-orange-600 dark:text-orange-400" };

  if (
    m.includes("json") ||
    m.includes("xml") ||
    m.includes("javascript") ||
    ["json", "xml", "html", "js", "ts", "css"].includes(ext)
  )
    return { icon: FileCode, className: "text-sky-600 dark:text-sky-400" };

  if (m === "application/pdf" || ext === "pdf")
    return { icon: FileText, className: "text-rose-600 dark:text-rose-400" };

  if (
    m.includes("word") ||
    m.includes("document") ||
    m.startsWith("text/") ||
    ["doc", "docx", "txt", "rtf", "odt"].includes(ext)
  )
    return { icon: FileText, className: "text-blue-600 dark:text-blue-400" };

  return { icon: FileIcon, className: "text-muted-foreground" };
}

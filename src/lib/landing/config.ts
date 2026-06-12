/**
 * juridicOS · Landing — CONTENIDO EDITABLE (un solo lugar).
 *
 * Acá cargás todo lo que es "tuyo": el precio en pesos, tu nombre y los archivos
 * de foto/video. Cuando un asset es `null`, la landing muestra un placeholder
 * honesto (marco con leyenda) y nunca se ve roto. Apenas pongas el archivo en
 * /public y completes la ruta acá, aparece solo.
 */

/* ─────────────────────────── PRECIO (plan único) ──────────────────────────
 * ⚠️  ACTUALIZÁ ESTE VALOR con la cotización de pesos del día (junio 2026).
 * Es el ÚNICO número de precio en toda la página. El "≈ USD 50" es referencia fija.
 * Poné solo el número (sin "$" ni "/mes"); la UI agrega el formato.            */
export const PRECIO_ARS = 59_900; // ← TODO: poné acá tu precio real en ARS (USD 50 ≈ este valor)
export const PRECIO_USD = 50;

/* ─────────────────────────── IDENTIDAD / FUNDADOR ─────────────────────────
 * Lo usa la FOJA 07 ("Hecho en Córdoba, para el foro").                       */
export const FUNDADOR = {
  nombre: "—", // ← TODO: tu nombre (ej. "Dr. Juan Pérez")
  titulo: "Abogado · Universidad Nacional de Córdoba",
  // Retrato sobrio, idealmente b/n. 4:5. Dejalo en null hasta tener la foto.
  fotoSrc: null as string | null, // ej. "/landing/fundador.jpg"
};

/* ─────────────────────────── SLOTS DE FOTO / VIDEO ────────────────────────
 * Poné los archivos en /public (o /public/landing) y completá la ruta.
 * Mientras sean `null`, se muestran placeholders honestos y los simuladores
 * interactivos cubren el espacio (la página nunca se ve incompleta).          */
export const ASSETS = {
  // FOJA 01 — screencast del motor de plazos (16:9). El marco lo ocupa la cédula viva.
  heroVideoSrc: null as string | null, // ej. "/landing/motor-plazos.mp4"
  heroVideoPoster: null as string | null, // ej. "/landing/motor-plazos-poster.jpg"
  // FOJA 04 — screencast/gif de redacción con Claude (mail-merge → PDF).
  redaccionVideoSrc: null as string | null,
  // FOJA 04 — membrete del estudio (PNG transparente) que el sistema estampa en el PDF.
  membreteSrc: null as string | null,
  // FOJA 05 — captura real de la agenda ya sincronizada en el teléfono (vertical).
  agendaTelefonoSrc: null as string | null,
};

/* ─────────────────────────── ENLACES ──────────────────────────────────────*/
export const LINKS = {
  registro: "/registro",
  demo: "/login",
  panel: "/dashboard",
  terminos: "#",
  privacidad: "#",
  contacto: "#",
};

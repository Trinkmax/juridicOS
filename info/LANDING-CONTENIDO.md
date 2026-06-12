# Landing de juridicOS — qué cargás vos

Todo el contenido editable está centralizado en **`src/lib/landing/config.ts`**.
No toques los componentes: solo ese archivo y los archivos que pongas en `/public`.

La landing está diseñada para verse completa **sin ningún asset**: donde falta una
foto o video, aparece un placeholder honesto y los simuladores interactivos en vivo
(la cédula que calcula, el muro de 46 plazos, la agenda) cubren el espacio. Cargá los
assets cuando puedas; cada uno suma, ninguno bloquea.

---

## 1. Precio — IMPRESCINDIBLE (lo único que bloquea la sección de precio)

En `src/lib/landing/config.ts`:

```ts
export const PRECIO_ARS = 59_900; // ← poné acá el valor REAL en pesos (cotización de junio 2026)
```

- Es el **único** número de precio de toda la página.
- El plan es USD 50/mes; este valor es su equivalente en pesos. La referencia
  “≈ USD 50” se muestra sola.
- Poné solo el número (sin `$` ni `/mes`). La UI le da formato es-AR (`$59.900`).
- Hay un switch ARS ⇄ USD en la tarjeta: ARS es el protagonista, USD la referencia.

## 2. Tu nombre y título — RECOMENDADO (FOJA 07 “Hecho en Córdoba”)

```ts
export const FUNDADOR = {
  nombre: "Dr. Juan Pérez",                         // ← tu nombre
  titulo: "Abogado · Universidad Nacional de Córdoba",
  fotoSrc: "/landing/fundador.jpg",                 // ← ver punto 3
};
```

## 3. Foto de retrato — RECOMENDADO (FOJA 07)

- **Qué:** un retrato sobrio, editorial, mirada a cámara, fondo neutro.
- **Formato:** relación **4:5** (vertical), idealmente en blanco y negro o desaturado
  (la landing le aplica `grayscale` para que encaje con la estética “tinta”).
- **Dónde:** guardalo en `public/landing/fundador.jpg` y poné la ruta en
  `FUNDADOR.fotoSrc = "/landing/fundador.jpg"`.
- Si lo dejás en `null`, se muestra un marco con leyenda en su lugar.

## 4. Captura de la agenda en el teléfono — RECOMENDADO (FOJA 05)

- **Qué:** una captura **real** del calendario de tu celular (iPhone/Android) ya
  suscrito al feed ICS de juridicOS, mostrando plazos y audiencias.
- **Formato:** **vertical** (9:16 aprox.). Sirve foto o video corto.
- **Dónde:** `public/landing/agenda-telefono.jpg` →
  `ASSETS.agendaTelefonoSrc = "/landing/agenda-telefono.jpg"`.

## 5. Video del motor de plazos — OPCIONAL (FOJA 01, hero)

> El hero **ya tiene** la “cédula que calcula sola” interactiva. Este video es un extra;
> si lo cargás, reemplaza a la cédula en el marco del hero.

- **Qué:** screencast de ~15–25 s mostrando: elegir un acto → poner la fecha de
  notificación → aparece el vencimiento + el plazo de gracia. Sin audio o con tu voz.
- **Formato:** **16:9**, `.mp4` (idealmente también `.webm`). Opcional una imagen
  `poster`.
- **Dónde:** `public/landing/motor-plazos.mp4` →
  `ASSETS.heroVideoSrc = "/landing/motor-plazos.mp4"` (y `heroVideoPoster` si tenés).

## 6. Video de redacción con Claude — OPCIONAL (FOJA 04)

- **Qué:** screencast de ~20–45 s: generar/mejorar un borrador, completar el
  mail-merge y exportar el PDF con membrete. Causa de ejemplo anonimizada.
- **Dónde:** `public/landing/redaccion.mp4` →
  `ASSETS.redaccionVideoSrc = "/landing/redaccion.mp4"`.
- Si lo dejás en `null`, la demo guionada (texto que se completa solo) cubre la sección.

## 7. Membrete del estudio — OPCIONAL (FOJA 04)

- **Qué:** tu membrete (logo + pie) en **PNG transparente**, el que el sistema estampa
  en el PDF de los escritos.
- **Dónde:** `public/landing/membrete.png` → `ASSETS.membreteSrc = "/landing/membrete.png"`.

---

## Cómo agregar un archivo a `/public`

1. Creá la carpeta `public/landing/` si no existe.
2. Copiá ahí tu archivo (ej. `fundador.jpg`).
3. En `config.ts`, la ruta es **sin** `public` (ej. `"/landing/fundador.jpg"`).
4. Listo: aparece solo. No hace falta tocar nada más.

## Enlaces legales del footer

En `config.ts`, `LINKS.terminos`, `LINKS.privacidad`, `LINKS.contacto` están en `"#"`.
Cuando tengas esas páginas, poné sus rutas ahí.

---

### Nota sobre los datos legales (no es contenido tuyo, ya está cargado)

Los 46 plazos con su artículo y el calendario judicial 2026 están **precargados** desde
la base real del producto. La feria de invierno figura como *estimada* hasta que salga
la Acordada del TSJ. Como dice el pie de la landing: **los plazos deben validarse con un
profesional matriculado**.

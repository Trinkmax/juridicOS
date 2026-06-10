"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { Membrete } from "./tipos";

export type { Membrete };

export type DocumentoPDFProps = {
  /** Texto EXACTO del editor; se renderiza sin reescribir nada. */
  contenido: string;
  titulo?: string | null;
  /** Tipo de escrito; se muestra discreto bajo la suma. */
  tipo?: string | null;
  membrete?: Membrete | null;
  /** Si es para firma del cliente, agrega bloque de firma ológrafa del compareciente. */
  paraFirmaCliente?: boolean;
};

/* Times-Roman es una fuente built-in de @react-pdf/renderer; soporta acentos
 * del español sin registrar archivos externos (evita fallos de carga). */
const styles = StyleSheet.create({
  page: {
    paddingTop: 71, // ~2.5cm
    paddingBottom: 64,
    paddingHorizontal: 71,
    fontFamily: "Times-Roman",
    fontSize: 11.5,
    lineHeight: 1.55,
    color: "#1a1a1a",
  },
  // Membrete
  membrete: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  membreteCol: {
    flexShrink: 1,
  },
  logo: {
    width: 64,
    height: 64,
    objectFit: "contain",
  },
  estudioNombre: {
    fontFamily: "Times-Bold",
    fontSize: 13,
    marginBottom: 2,
  },
  abogadoNombre: {
    fontFamily: "Times-Bold",
    fontSize: 11.5,
  },
  membreteLinea: {
    fontSize: 9.5,
    color: "#444444",
    lineHeight: 1.4,
  },
  divisor: {
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    marginTop: 8,
    marginBottom: 18,
  },
  // Suma / título
  suma: {
    fontFamily: "Times-Bold",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  tipoLinea: {
    fontSize: 10,
    color: "#555555",
    marginBottom: 16,
  },
  // Cuerpo
  parrafo: {
    textAlign: "justify",
    marginBottom: 9,
  },
  parrafoVacio: {
    marginBottom: 9,
  },
  // Títulos de sección forenses ("I. OBJETO.", "PETITUM.", "SERÁ JUSTICIA.-"):
  // misma letra, en negrita y con aire, como en los escritos presentados.
  tituloSeccion: {
    fontFamily: "Times-Bold",
    textAlign: "left",
    marginTop: 7,
    marginBottom: 9,
  },
  // Firma
  firmaBloque: {
    marginTop: 48,
  },
  firmaFila: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 40,
  },
  firmaCol: {
    alignItems: "center",
    width: 200,
  },
  firmaRaya: {
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    width: "100%",
    marginBottom: 4,
  },
  firmaLabel: {
    fontSize: 9.5,
    color: "#333333",
    textAlign: "center",
  },
  firmaLabelFuerte: {
    fontSize: 10,
    fontFamily: "Times-Bold",
    textAlign: "center",
  },
  // Pie
  pie: {
    position: "absolute",
    bottom: 32,
    left: 71,
    right: 71,
    textAlign: "center",
    fontSize: 8.5,
    color: "#888888",
  },
});

function lineaContacto(m: Membrete): string {
  const partes: string[] = [];
  if (m.telefono?.trim()) partes.push(`Tel.: ${m.telefono.trim()}`);
  if (m.email?.trim()) partes.push(m.email.trim());
  return partes.join("  ·  ");
}

function hayMembrete(m: Membrete | null | undefined): m is Membrete {
  if (!m) return false;
  return Boolean(
    m.estudio?.trim() ||
      m.abogado?.trim() ||
      m.matricula?.trim() ||
      m.domicilio?.trim() ||
      m.domicilioElectronico?.trim() ||
      m.telefono?.trim() ||
      m.email?.trim() ||
      m.cuit?.trim(),
  );
}

/**
 * Divide el contenido en párrafos preservando saltos de línea y líneas en
 * blanco. NO altera ninguna palabra (fidelidad al texto presentado — Art. 22).
 */
function aParrafos(contenido: string): string[] {
  return contenido.replace(/\r\n/g, "\n").split("\n");
}

/**
 * ¿La línea es un título de sección forense? Heurística conservadora: línea
 * corta, íntegramente en mayúsculas (sin minúsculas), con al menos una letra.
 * Cubre "I. OBJETO.", "II. HECHOS.", "1. DOCUMENTAL:", "PETITUM.",
 * "SERÁ JUSTICIA.-". Solo cambia el estilo, jamás el texto.
 */
function esTituloSeccion(linea: string): boolean {
  const t = linea.trim();
  if (t.length < 3 || t.length > 100) return false;
  if (!/[A-ZÁÉÍÓÚÜÑ]/.test(t)) return false;
  return !/[a-záéíóúüñ]/.test(t);
}

export function DocumentoPDF({
  contenido,
  titulo,
  tipo,
  membrete,
  paraFirmaCliente = false,
}: DocumentoPDFProps) {
  const m = hayMembrete(membrete) ? membrete : null;
  const mostrarLogo = Boolean(m?.incluirLogo && m?.logoUrl?.trim());
  const contacto = m ? lineaContacto(m) : "";
  const parrafos = aParrafos(contenido);

  return (
    <Document
      title={titulo?.trim() || "Documento"}
      author={m?.abogado?.trim() || m?.estudio?.trim() || "juridicOS"}
      creator="juridicOS"
      producer="juridicOS"
      subject={tipo?.trim() || undefined}
    >
      <Page size="A4" style={styles.page}>
        {m && (
          <View>
            <View style={styles.membrete}>
              <View style={styles.membreteCol}>
                {m.estudio?.trim() && (
                  <Text style={styles.estudioNombre}>{m.estudio.trim()}</Text>
                )}
                {m.abogado?.trim() && (
                  <Text style={styles.abogadoNombre}>{m.abogado.trim()}</Text>
                )}
                {m.matricula?.trim() && (
                  <Text style={styles.membreteLinea}>
                    Mat. {m.matricula.trim()}
                  </Text>
                )}
                {m.domicilio?.trim() && (
                  <Text style={styles.membreteLinea}>
                    Domicilio constituido: {m.domicilio.trim()}
                  </Text>
                )}
                {m.domicilioElectronico?.trim() && (
                  <Text style={styles.membreteLinea}>
                    Domicilio electrónico: {m.domicilioElectronico.trim()}
                  </Text>
                )}
                {m.cuit?.trim() && (
                  <Text style={styles.membreteLinea}>CUIT {m.cuit.trim()}</Text>
                )}
                {contacto && (
                  <Text style={styles.membreteLinea}>{contacto}</Text>
                )}
              </View>
              {mostrarLogo && m?.logoUrl && (
                // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image no acepta alt
                <Image style={styles.logo} src={m.logoUrl.trim()} />
              )}
            </View>
            <View style={styles.divisor} />
          </View>
        )}

        {titulo?.trim() && <Text style={styles.suma}>{titulo.trim()}</Text>}
        {tipo?.trim() && <Text style={styles.tipoLinea}>{tipo.trim()}</Text>}

        <View>
          {parrafos.map((p, i) =>
            p.length === 0 ? (
              <View key={i} style={styles.parrafoVacio} />
            ) : (
              <Text
                key={i}
                style={esTituloSeccion(p) ? styles.tituloSeccion : styles.parrafo}
              >
                {p}
              </Text>
            ),
          )}
        </View>

        <View style={styles.firmaBloque} wrap={false}>
          {paraFirmaCliente ? (
            <View style={styles.firmaFila}>
              <View style={styles.firmaCol}>
                <View style={styles.firmaRaya} />
                <Text style={styles.firmaLabelFuerte}>Firma del compareciente</Text>
                <Text style={styles.firmaLabel}>Aclaración / DNI</Text>
              </View>
              <View style={styles.firmaCol}>
                <View style={styles.firmaRaya} />
                <Text style={styles.firmaLabelFuerte}>
                  {m?.abogado?.trim() || "Firma del letrado"}
                </Text>
                <Text style={styles.firmaLabel}>
                  {m?.matricula?.trim() ? `Mat. ${m.matricula.trim()}` : "Matrícula"}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.firmaFila}>
              <View style={styles.firmaCol}>
                <View style={styles.firmaRaya} />
                <Text style={styles.firmaLabelFuerte}>
                  {m?.abogado?.trim() || "Firma"}
                </Text>
                <Text style={styles.firmaLabel}>
                  {m?.matricula?.trim() ? `Mat. ${m.matricula.trim()}` : "Aclaración / Matrícula"}
                </Text>
              </View>
            </View>
          )}
        </View>

        <Text
          style={styles.pie}
          render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} de ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

/** Genera el PDF como Blob en el cliente. */
export async function generarPDFBlob(props: DocumentoPDFProps): Promise<Blob> {
  return pdf(<DocumentoPDF {...props} />).toBlob();
}

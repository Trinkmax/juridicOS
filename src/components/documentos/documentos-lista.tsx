import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { DocumentoFila, type DocumentoFilaItem } from "./documento-fila";

/** Lista animada de documentos del archivo digital. */
export function DocumentosLista({ documentos }: { documentos: DocumentoFilaItem[] }) {
  return (
    <Stagger className="space-y-2">
      {documentos.map((doc) => (
        <StaggerItem key={doc.id}>
          <DocumentoFila doc={doc} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

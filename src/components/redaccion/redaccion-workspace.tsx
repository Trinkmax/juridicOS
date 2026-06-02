"use client";

import { useRef, useState } from "react";
import { PenLine, LayoutTemplate, FilesIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EditorWorkspace, type EditorHandle } from "./editor-workspace";
import { PlantillasLista } from "./plantillas-lista";
import { BorradoresLista } from "./borradores-lista";
import type {
  PlantillaItem,
  ExpedienteContexto,
  BorradorItem,
  DocumentoEdicion,
} from "./tipos";

export function RedaccionWorkspace({
  plantillas,
  expedientes,
  borradores,
  iaActiva,
  documento,
}: {
  plantillas: PlantillaItem[];
  expedientes: ExpedienteContexto[];
  borradores: BorradorItem[];
  iaActiva: boolean;
  /** Si viene, el editor abre ese documento en modo edición. */
  documento?: DocumentoEdicion;
}) {
  const editorRef = useRef<EditorHandle>(null);
  const [tab, setTab] = useState("editor");

  function usarPlantilla(p: PlantillaItem) {
    editorRef.current?.cargarPlantilla(p);
    setTab("editor");
  }

  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-5">
      <TabsList>
        <TabsTrigger value="editor">
          <PenLine className="size-4" />
          Editor
        </TabsTrigger>
        <TabsTrigger value="plantillas">
          <LayoutTemplate className="size-4" />
          Plantillas
          {plantillas.length > 0 && <Badge tone="muted">{plantillas.length}</Badge>}
        </TabsTrigger>
        <TabsTrigger value="borradores">
          <FilesIcon className="size-4" />
          Mis borradores
          {borradores.length > 0 && <Badge tone="muted">{borradores.length}</Badge>}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="editor">
        <EditorWorkspace
          ref={editorRef}
          plantillas={plantillas}
          expedientes={expedientes}
          iaActiva={iaActiva}
          documento={documento}
        />
      </TabsContent>

      <TabsContent value="plantillas">
        <PlantillasLista plantillas={plantillas} onUsar={usarPlantilla} />
      </TabsContent>

      <TabsContent value="borradores">
        <BorradoresLista borradores={borradores} />
      </TabsContent>
    </Tabs>
  );
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_interactions: {
        Row: {
          costo_usd: number | null
          created_at: string
          estudio_id: string
          feature: string
          id: string
          modelo: string | null
          tokens_in: number | null
          tokens_out: number | null
          usuario_id: string | null
        }
        Insert: {
          costo_usd?: number | null
          created_at?: string
          estudio_id: string
          feature: string
          id?: string
          modelo?: string | null
          tokens_in?: number | null
          tokens_out?: number | null
          usuario_id?: string | null
        }
        Update: {
          costo_usd?: number | null
          created_at?: string
          estudio_id?: string
          feature?: string
          id?: string
          modelo?: string | null
          tokens_in?: number | null
          tokens_out?: number | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_interactions_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interactions_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      audiencias: {
        Row: {
          created_at: string
          created_by: string | null
          duracion_min: number
          enlace: string | null
          estado: string
          estudio_id: string
          expediente_id: string
          fecha_hora: string
          id: string
          juzgado: string | null
          lugar: string | null
          modalidad: string
          responsable_id: string | null
          resultado: string | null
          tipo: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          duracion_min?: number
          enlace?: string | null
          estado?: string
          estudio_id: string
          expediente_id: string
          fecha_hora: string
          id?: string
          juzgado?: string | null
          lugar?: string | null
          modalidad?: string
          responsable_id?: string | null
          resultado?: string | null
          tipo?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          duracion_min?: number
          enlace?: string | null
          estado?: string
          estudio_id?: string
          expediente_id?: string
          fecha_hora?: string
          id?: string
          juzgado?: string | null
          lugar?: string | null
          modalidad?: string
          responsable_id?: string | null
          resultado?: string | null
          tipo?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audiencias_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiencias_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiencias_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiencias_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          accion: string
          created_at: string
          datos: Json | null
          entidad: string | null
          entidad_id: string | null
          estudio_id: string | null
          id: number
          usuario_id: string | null
        }
        Insert: {
          accion: string
          created_at?: string
          datos?: Json | null
          entidad?: string | null
          entidad_id?: string | null
          estudio_id?: string | null
          id?: never
          usuario_id?: string | null
        }
        Update: {
          accion?: string
          created_at?: string
          datos?: Json | null
          entidad?: string | null
          entidad_id?: string | null
          estudio_id?: string | null
          id?: never
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      calendario_judicial: {
        Row: {
          anio: number | null
          created_at: string
          descripcion: string | null
          estudio_id: string | null
          fecha: string
          id: string
          jurisdiccion: string
          tipo: Database["public"]["Enums"]["tipo_inhabil"]
        }
        Insert: {
          anio?: number | null
          created_at?: string
          descripcion?: string | null
          estudio_id?: string | null
          fecha: string
          id?: string
          jurisdiccion?: string
          tipo: Database["public"]["Enums"]["tipo_inhabil"]
        }
        Update: {
          anio?: number | null
          created_at?: string
          descripcion?: string | null
          estudio_id?: string | null
          fecha?: string
          id?: string
          jurisdiccion?: string
          tipo?: Database["public"]["Enums"]["tipo_inhabil"]
        }
        Relationships: [
          {
            foreignKeyName: "calendario_judicial_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogo_plazos: {
        Row: {
          activo: boolean
          acto_procesal: string
          base_legal: string | null
          created_at: string
          descripcion: string | null
          dias: number
          estudio_id: string | null
          fuero: Database["public"]["Enums"]["fuero"]
          id: string
          modalidad: Database["public"]["Enums"]["modalidad_plazo"]
        }
        Insert: {
          activo?: boolean
          acto_procesal: string
          base_legal?: string | null
          created_at?: string
          descripcion?: string | null
          dias: number
          estudio_id?: string | null
          fuero?: Database["public"]["Enums"]["fuero"]
          id?: string
          modalidad?: Database["public"]["Enums"]["modalidad_plazo"]
        }
        Update: {
          activo?: boolean
          acto_procesal?: string
          base_legal?: string | null
          created_at?: string
          descripcion?: string | null
          dias?: number
          estudio_id?: string | null
          fuero?: Database["public"]["Enums"]["fuero"]
          id?: string
          modalidad?: Database["public"]["Enums"]["modalidad_plazo"]
        }
        Relationships: [
          {
            foreignKeyName: "catalogo_plazos_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          activo: boolean
          created_at: string
          created_by: string | null
          documento: string | null
          domicilio_electronico: string | null
          domicilio_real: string | null
          email: string | null
          estudio_id: string
          id: string
          localidad: string | null
          nombre: string
          notas: string | null
          provincia: string | null
          telefono: string | null
          tipo: Database["public"]["Enums"]["tipo_cliente"]
          updated_at: string
          usuario_id: string | null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          created_by?: string | null
          documento?: string | null
          domicilio_electronico?: string | null
          domicilio_real?: string | null
          email?: string | null
          estudio_id: string
          id?: string
          localidad?: string | null
          nombre: string
          notas?: string | null
          provincia?: string | null
          telefono?: string | null
          tipo?: Database["public"]["Enums"]["tipo_cliente"]
          updated_at?: string
          usuario_id?: string | null
        }
        Update: {
          activo?: boolean
          created_at?: string
          created_by?: string | null
          documento?: string | null
          domicilio_electronico?: string | null
          domicilio_real?: string | null
          email?: string | null
          estudio_id?: string
          id?: string
          localidad?: string | null
          nombre?: string
          notas?: string | null
          provincia?: string | null
          telefono?: string | null
          tipo?: Database["public"]["Enums"]["tipo_cliente"]
          updated_at?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      comunicaciones: {
        Row: {
          cliente_id: string
          contenido: string | null
          created_at: string
          created_by: string | null
          estudio_id: string
          expediente_id: string | null
          fecha: string
          id: string
          tipo: string
        }
        Insert: {
          cliente_id: string
          contenido?: string | null
          created_at?: string
          created_by?: string | null
          estudio_id: string
          expediente_id?: string | null
          fecha?: string
          id?: string
          tipo?: string
        }
        Update: {
          cliente_id?: string
          contenido?: string | null
          created_at?: string
          created_by?: string | null
          estudio_id?: string
          expediente_id?: string | null
          fecha?: string
          id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "comunicaciones_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicaciones_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicaciones_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicaciones_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          cliente_id: string | null
          compartido_cliente: boolean
          created_at: string
          created_by: string | null
          estudio_id: string
          etiquetas: string[] | null
          expediente_id: string | null
          id: string
          mime: string | null
          nombre: string
          storage_path: string | null
          tamano_bytes: number | null
          texto_ocr: string | null
          tipo: string | null
          version: number
        }
        Insert: {
          cliente_id?: string | null
          compartido_cliente?: boolean
          created_at?: string
          created_by?: string | null
          estudio_id: string
          etiquetas?: string[] | null
          expediente_id?: string | null
          id?: string
          mime?: string | null
          nombre: string
          storage_path?: string | null
          tamano_bytes?: number | null
          texto_ocr?: string | null
          tipo?: string | null
          version?: number
        }
        Update: {
          cliente_id?: string | null
          compartido_cliente?: boolean
          created_at?: string
          created_by?: string | null
          estudio_id?: string
          etiquetas?: string[] | null
          expediente_id?: string | null
          id?: string
          mime?: string | null
          nombre?: string
          storage_path?: string | null
          tamano_bytes?: number | null
          texto_ocr?: string | null
          tipo?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "documentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos_generados: {
        Row: {
          contenido: string
          created_at: string
          created_by: string | null
          estudio_id: string
          expediente_id: string | null
          generado_por_ia: boolean
          id: string
          plantilla_id: string | null
          tipo: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          contenido?: string
          created_at?: string
          created_by?: string | null
          estudio_id: string
          expediente_id?: string | null
          generado_por_ia?: boolean
          id?: string
          plantilla_id?: string | null
          tipo?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          contenido?: string
          created_at?: string
          created_by?: string | null
          estudio_id?: string
          expediente_id?: string | null
          generado_por_ia?: boolean
          id?: string
          plantilla_id?: string | null
          tipo?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_generados_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_generados_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_generados_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_generados_plantilla_id_fkey"
            columns: ["plantilla_id"]
            isOneToOne: false
            referencedRelation: "plantillas"
            referencedColumns: ["id"]
          },
        ]
      }
      estudio_ia_config: {
        Row: {
          activo: boolean
          estudio_id: string
          modelo: string
          secret_id: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          estudio_id: string
          modelo?: string
          secret_id?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          estudio_id?: string
          modelo?: string
          secret_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estudio_ia_config_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: true
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
        ]
      }
      estudios: {
        Row: {
          color_marca: string | null
          config: Json
          created_at: string
          cuit: string | null
          domicilio: string | null
          email: string | null
          id: string
          jurisdiccion_default: string
          localidad: string | null
          logo_url: string | null
          nombre: string
          plan: string
          provincia: string | null
          slug: string | null
          telefono: string | null
          timezone: string
          updated_at: string
          valor_jus: number
          web: string | null
        }
        Insert: {
          color_marca?: string | null
          config?: Json
          created_at?: string
          cuit?: string | null
          domicilio?: string | null
          email?: string | null
          id?: string
          jurisdiccion_default?: string
          localidad?: string | null
          logo_url?: string | null
          nombre: string
          plan?: string
          provincia?: string | null
          slug?: string | null
          telefono?: string | null
          timezone?: string
          updated_at?: string
          valor_jus?: number
          web?: string | null
        }
        Update: {
          color_marca?: string | null
          config?: Json
          created_at?: string
          cuit?: string | null
          domicilio?: string | null
          email?: string | null
          id?: string
          jurisdiccion_default?: string
          localidad?: string | null
          logo_url?: string | null
          nombre?: string
          plan?: string
          provincia?: string | null
          slug?: string | null
          telefono?: string | null
          timezone?: string
          updated_at?: string
          valor_jus?: number
          web?: string | null
        }
        Relationships: []
      }
      eventos_agenda: {
        Row: {
          color: string | null
          created_at: string
          created_by: string | null
          descripcion: string | null
          estudio_id: string
          expediente_id: string | null
          fin: string | null
          id: string
          inicio: string
          responsable_id: string | null
          tipo: string | null
          titulo: string
          todo_el_dia: boolean
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          estudio_id: string
          expediente_id?: string | null
          fin?: string | null
          id?: string
          inicio: string
          responsable_id?: string | null
          tipo?: string | null
          titulo: string
          todo_el_dia?: boolean
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          estudio_id?: string
          expediente_id?: string | null
          fin?: string | null
          id?: string
          inicio?: string
          responsable_id?: string | null
          tipo?: string | null
          titulo?: string
          todo_el_dia?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "eventos_agenda_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_agenda_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_agenda_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_agenda_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      expediente_miembros: {
        Row: {
          created_at: string
          estudio_id: string
          expediente_id: string
          id: string
          principal: boolean
          rol_en_causa: string | null
          usuario_id: string
        }
        Insert: {
          created_at?: string
          estudio_id: string
          expediente_id: string
          id?: string
          principal?: boolean
          rol_en_causa?: string | null
          usuario_id: string
        }
        Update: {
          created_at?: string
          estudio_id?: string
          expediente_id?: string
          id?: string
          principal?: boolean
          rol_en_causa?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expediente_miembros_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expediente_miembros_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expediente_miembros_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      expedientes: {
        Row: {
          archivado: boolean
          caracter_cliente: Database["public"]["Enums"]["tipo_parte"] | null
          caratula: string
          cliente_id: string | null
          created_at: string
          created_by: string | null
          estado: Database["public"]["Enums"]["estado_expediente"]
          estudio_id: string
          etapa: string | null
          fecha_inicio: string | null
          fuero: Database["public"]["Enums"]["fuero"]
          id: string
          jurisdiccion: string
          juzgado: string | null
          localidad: string | null
          materia: string | null
          monto_reclamado: number | null
          nro_sac: string | null
          observaciones: string | null
          secretaria: string | null
          updated_at: string
        }
        Insert: {
          archivado?: boolean
          caracter_cliente?: Database["public"]["Enums"]["tipo_parte"] | null
          caratula: string
          cliente_id?: string | null
          created_at?: string
          created_by?: string | null
          estado?: Database["public"]["Enums"]["estado_expediente"]
          estudio_id: string
          etapa?: string | null
          fecha_inicio?: string | null
          fuero?: Database["public"]["Enums"]["fuero"]
          id?: string
          jurisdiccion?: string
          juzgado?: string | null
          localidad?: string | null
          materia?: string | null
          monto_reclamado?: number | null
          nro_sac?: string | null
          observaciones?: string | null
          secretaria?: string | null
          updated_at?: string
        }
        Update: {
          archivado?: boolean
          caracter_cliente?: Database["public"]["Enums"]["tipo_parte"] | null
          caratula?: string
          cliente_id?: string | null
          created_at?: string
          created_by?: string | null
          estado?: Database["public"]["Enums"]["estado_expediente"]
          estudio_id?: string
          etapa?: string | null
          fecha_inicio?: string | null
          fuero?: Database["public"]["Enums"]["fuero"]
          id?: string
          jurisdiccion?: string
          juzgado?: string | null
          localidad?: string | null
          materia?: string | null
          monto_reclamado?: number | null
          nro_sac?: string | null
          observaciones?: string | null
          secretaria?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expedientes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expedientes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expedientes_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
        ]
      }
      facturas: {
        Row: {
          cae: string | null
          cae_vencimiento: string | null
          cliente_id: string
          created_at: string
          created_by: string | null
          estado: string
          estudio_id: string
          expediente_id: string | null
          fecha: string
          id: string
          items: Json
          iva: number
          notas: string | null
          numero: string | null
          punto_venta: number
          subtotal: number
          tipo_comprobante: string
          total: number
          updated_at: string
        }
        Insert: {
          cae?: string | null
          cae_vencimiento?: string | null
          cliente_id: string
          created_at?: string
          created_by?: string | null
          estado?: string
          estudio_id: string
          expediente_id?: string | null
          fecha?: string
          id?: string
          items?: Json
          iva?: number
          notas?: string | null
          numero?: string | null
          punto_venta?: number
          subtotal?: number
          tipo_comprobante?: string
          total?: number
          updated_at?: string
        }
        Update: {
          cae?: string | null
          cae_vencimiento?: string | null
          cliente_id?: string
          created_at?: string
          created_by?: string | null
          estado?: string
          estudio_id?: string
          expediente_id?: string | null
          fecha?: string
          id?: string
          items?: Json
          iva?: number
          notas?: string | null
          numero?: string | null
          punto_venta?: number
          subtotal?: number
          tipo_comprobante?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "facturas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facturas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facturas_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facturas_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
        ]
      }
      honorarios: {
        Row: {
          base: string
          cliente_id: string | null
          concepto: string
          created_at: string
          created_by: string | null
          estado: string
          estudio_id: string
          expediente_id: string | null
          id: string
          jus_cantidad: number | null
          jus_valor: number | null
          monto: number
          notas: string | null
          porcentaje: number | null
          updated_at: string
        }
        Insert: {
          base?: string
          cliente_id?: string | null
          concepto: string
          created_at?: string
          created_by?: string | null
          estado?: string
          estudio_id: string
          expediente_id?: string | null
          id?: string
          jus_cantidad?: number | null
          jus_valor?: number | null
          monto?: number
          notas?: string | null
          porcentaje?: number | null
          updated_at?: string
        }
        Update: {
          base?: string
          cliente_id?: string | null
          concepto?: string
          created_at?: string
          created_by?: string | null
          estado?: string
          estudio_id?: string
          expediente_id?: string | null
          id?: string
          jus_cantidad?: number | null
          jus_valor?: number | null
          monto?: number
          notas?: string | null
          porcentaje?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "honorarios_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "honorarios_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "honorarios_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "honorarios_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
        ]
      }
      localidades: {
        Row: {
          activo: boolean
          cabecera: string
          circunscripcion: number
          created_at: string
          es_cabecera: boolean
          id: string
          nombre: string
        }
        Insert: {
          activo?: boolean
          cabecera: string
          circunscripcion: number
          created_at?: string
          es_cabecera?: boolean
          id?: string
          nombre: string
        }
        Update: {
          activo?: boolean
          cabecera?: string
          circunscripcion?: number
          created_at?: string
          es_cabecera?: boolean
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      miembros_estudio: {
        Row: {
          activo: boolean
          created_at: string
          estudio_id: string
          id: string
          invitado_por: string | null
          rol: Database["public"]["Enums"]["rol_estudio"]
          updated_at: string
          usuario_id: string
          ver_todas_causas: boolean
        }
        Insert: {
          activo?: boolean
          created_at?: string
          estudio_id: string
          id?: string
          invitado_por?: string | null
          rol?: Database["public"]["Enums"]["rol_estudio"]
          updated_at?: string
          usuario_id: string
          ver_todas_causas?: boolean
        }
        Update: {
          activo?: boolean
          created_at?: string
          estudio_id?: string
          id?: string
          invitado_por?: string | null
          rol?: Database["public"]["Enums"]["rol_estudio"]
          updated_at?: string
          usuario_id?: string
          ver_todas_causas?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "miembros_estudio_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_estudio_invitado_por_fkey"
            columns: ["invitado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_estudio_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      movimientos: {
        Row: {
          created_at: string
          created_by: string | null
          descripcion: string | null
          estudio_id: string
          expediente_id: string
          fecha: string
          id: string
          origen: Database["public"]["Enums"]["origen_movimiento"]
          tipo: string | null
          titulo: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          estudio_id: string
          expediente_id: string
          fecha?: string
          id?: string
          origen?: Database["public"]["Enums"]["origen_movimiento"]
          tipo?: string | null
          titulo: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          estudio_id?: string
          expediente_id?: string
          fecha?: string
          id?: string
          origen?: Database["public"]["Enums"]["origen_movimiento"]
          tipo?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "movimientos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
        ]
      }
      notificaciones: {
        Row: {
          contenido: string | null
          created_at: string
          created_by: string | null
          estudio_id: string
          expediente_id: string
          fecha_notificacion: string
          id: string
          medio: string | null
          procesada: boolean
          tipo_acto: string | null
        }
        Insert: {
          contenido?: string | null
          created_at?: string
          created_by?: string | null
          estudio_id: string
          expediente_id: string
          fecha_notificacion: string
          id?: string
          medio?: string | null
          procesada?: boolean
          tipo_acto?: string | null
        }
        Update: {
          contenido?: string | null
          created_at?: string
          created_by?: string | null
          estudio_id?: string
          expediente_id?: string
          fecha_notificacion?: string
          id?: string
          medio?: string | null
          procesada?: boolean
          tipo_acto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notificaciones_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificaciones_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificaciones_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
        ]
      }
      partes: {
        Row: {
          caracter: string | null
          created_at: string
          documento: string | null
          domicilio: string | null
          es_propio: boolean
          estudio_id: string
          expediente_id: string
          id: string
          nombre: string
          patrocinante: string | null
          tipo: Database["public"]["Enums"]["tipo_parte"]
        }
        Insert: {
          caracter?: string | null
          created_at?: string
          documento?: string | null
          domicilio?: string | null
          es_propio?: boolean
          estudio_id: string
          expediente_id: string
          id?: string
          nombre: string
          patrocinante?: string | null
          tipo?: Database["public"]["Enums"]["tipo_parte"]
        }
        Update: {
          caracter?: string | null
          created_at?: string
          documento?: string | null
          domicilio?: string | null
          es_propio?: boolean
          estudio_id?: string
          expediente_id?: string
          id?: string
          nombre?: string
          patrocinante?: string | null
          tipo?: Database["public"]["Enums"]["tipo_parte"]
        }
        Relationships: [
          {
            foreignKeyName: "partes_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partes_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
        ]
      }
      plantillas: {
        Row: {
          ambito: string
          categoria: string | null
          contenido: string
          created_at: string
          created_by: string | null
          descripcion: string | null
          estudio_id: string | null
          fuero: string | null
          id: string
          nombre: string
          orden: number
          tipo: string | null
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          ambito?: string
          categoria?: string | null
          contenido?: string
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          estudio_id?: string | null
          fuero?: string | null
          id?: string
          nombre: string
          orden?: number
          tipo?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          ambito?: string
          categoria?: string | null
          contenido?: string
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          estudio_id?: string | null
          fuero?: string | null
          id?: string
          nombre?: string
          orden?: number
          tipo?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "plantillas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plantillas_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
        ]
      }
      plazos: {
        Row: {
          acto_procesal: string
          catalogo_plazo_id: string | null
          created_at: string
          created_by: string | null
          cumplido_at: string | null
          cumplido_por: string | null
          descripcion: string | null
          detalle_computo: Json | null
          dias: number
          dias_inhabiles_salteados: number | null
          estado: Database["public"]["Enums"]["estado_plazo"]
          estudio_id: string
          expediente_id: string
          fecha_inicio_computo: string
          fecha_vencimiento: string | null
          id: string
          jurisdiccion: string
          modalidad: Database["public"]["Enums"]["modalidad_plazo"]
          notificacion_id: string | null
          prioridad: Database["public"]["Enums"]["prioridad"]
          responsable_id: string | null
          updated_at: string
          vencimiento_con_gracia: string | null
        }
        Insert: {
          acto_procesal: string
          catalogo_plazo_id?: string | null
          created_at?: string
          created_by?: string | null
          cumplido_at?: string | null
          cumplido_por?: string | null
          descripcion?: string | null
          detalle_computo?: Json | null
          dias: number
          dias_inhabiles_salteados?: number | null
          estado?: Database["public"]["Enums"]["estado_plazo"]
          estudio_id: string
          expediente_id: string
          fecha_inicio_computo: string
          fecha_vencimiento?: string | null
          id?: string
          jurisdiccion?: string
          modalidad?: Database["public"]["Enums"]["modalidad_plazo"]
          notificacion_id?: string | null
          prioridad?: Database["public"]["Enums"]["prioridad"]
          responsable_id?: string | null
          updated_at?: string
          vencimiento_con_gracia?: string | null
        }
        Update: {
          acto_procesal?: string
          catalogo_plazo_id?: string | null
          created_at?: string
          created_by?: string | null
          cumplido_at?: string | null
          cumplido_por?: string | null
          descripcion?: string | null
          detalle_computo?: Json | null
          dias?: number
          dias_inhabiles_salteados?: number | null
          estado?: Database["public"]["Enums"]["estado_plazo"]
          estudio_id?: string
          expediente_id?: string
          fecha_inicio_computo?: string
          fecha_vencimiento?: string | null
          id?: string
          jurisdiccion?: string
          modalidad?: Database["public"]["Enums"]["modalidad_plazo"]
          notificacion_id?: string | null
          prioridad?: Database["public"]["Enums"]["prioridad"]
          responsable_id?: string | null
          updated_at?: string
          vencimiento_con_gracia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plazos_catalogo_plazo_id_fkey"
            columns: ["catalogo_plazo_id"]
            isOneToOne: false
            referencedRelation: "catalogo_plazos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plazos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plazos_cumplido_por_fkey"
            columns: ["cumplido_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plazos_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plazos_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plazos_notificacion_id_fkey"
            columns: ["notificacion_id"]
            isOneToOne: false
            referencedRelation: "notificaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plazos_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      recordatorios: {
        Row: {
          canal: Database["public"]["Enums"]["canal_recordatorio"]
          created_at: string
          destinatario_id: string | null
          entidad_id: string
          entidad_tipo: string
          enviado_at: string | null
          estado: Database["public"]["Enums"]["estado_recordatorio"]
          estudio_id: string
          id: string
          leido: boolean
          mensaje: string | null
          momento: string
          offset_label: string | null
          titulo: string | null
          url: string | null
        }
        Insert: {
          canal?: Database["public"]["Enums"]["canal_recordatorio"]
          created_at?: string
          destinatario_id?: string | null
          entidad_id: string
          entidad_tipo: string
          enviado_at?: string | null
          estado?: Database["public"]["Enums"]["estado_recordatorio"]
          estudio_id: string
          id?: string
          leido?: boolean
          mensaje?: string | null
          momento: string
          offset_label?: string | null
          titulo?: string | null
          url?: string | null
        }
        Update: {
          canal?: Database["public"]["Enums"]["canal_recordatorio"]
          created_at?: string
          destinatario_id?: string | null
          entidad_id?: string
          entidad_tipo?: string
          enviado_at?: string | null
          estado?: Database["public"]["Enums"]["estado_recordatorio"]
          estudio_id?: string
          id?: string
          leido?: boolean
          mensaje?: string | null
          momento?: string
          offset_label?: string | null
          titulo?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recordatorios_destinatario_id_fkey"
            columns: ["destinatario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recordatorios_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
        ]
      }
      tareas: {
        Row: {
          asignado_a: string | null
          completada_at: string | null
          created_at: string
          created_by: string | null
          descripcion: string | null
          estado: Database["public"]["Enums"]["estado_tarea"]
          estudio_id: string
          expediente_id: string | null
          id: string
          orden: number
          prioridad: Database["public"]["Enums"]["prioridad"]
          titulo: string
          updated_at: string
          vencimiento: string | null
        }
        Insert: {
          asignado_a?: string | null
          completada_at?: string | null
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          estado?: Database["public"]["Enums"]["estado_tarea"]
          estudio_id: string
          expediente_id?: string | null
          id?: string
          orden?: number
          prioridad?: Database["public"]["Enums"]["prioridad"]
          titulo: string
          updated_at?: string
          vencimiento?: string | null
        }
        Update: {
          asignado_a?: string | null
          completada_at?: string | null
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          estado?: Database["public"]["Enums"]["estado_tarea"]
          estudio_id?: string
          expediente_id?: string | null
          id?: string
          orden?: number
          prioridad?: Database["public"]["Enums"]["prioridad"]
          titulo?: string
          updated_at?: string
          vencimiento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tareas_asignado_a_fkey"
            columns: ["asignado_a"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tareas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tareas_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tareas_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          created_at: string
          descripcion: string | null
          estudio_id: string
          expediente_id: string | null
          factura_id: string | null
          facturable: boolean
          fecha: string
          id: string
          minutos: number
          tarifa_hora: number | null
          usuario_id: string | null
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          estudio_id: string
          expediente_id?: string | null
          factura_id?: string | null
          facturable?: boolean
          fecha?: string
          id?: string
          minutos: number
          tarifa_hora?: number | null
          usuario_id?: string | null
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          estudio_id?: string
          expediente_id?: string | null
          factura_id?: string | null
          facturable?: boolean
          fecha?: string
          id?: string
          minutos?: number
          tarifa_hora?: number | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_factura_fk"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          apellido: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          matricula: string | null
          nombre: string | null
          nombre_completo: string | null
          telefono: string | null
          titulo: string | null
          updated_at: string
        }
        Insert: {
          apellido?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          matricula?: string | null
          nombre?: string | null
          nombre_completo?: string | null
          telefono?: string | null
          titulo?: string | null
          updated_at?: string
        }
        Update: {
          apellido?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          matricula?: string | null
          nombre?: string | null
          nombre_completo?: string | null
          telefono?: string | null
          titulo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_plazos_detalle: {
        Row: {
          acto_procesal: string | null
          caratula: string | null
          cliente_id: string | null
          cliente_nombre: string | null
          created_at: string | null
          cumplido_at: string | null
          descripcion: string | null
          dias: number | null
          dias_inhabiles_salteados: number | null
          dias_restantes: number | null
          estado: Database["public"]["Enums"]["estado_plazo"] | null
          estudio_id: string | null
          expediente_id: string | null
          fecha_inicio_computo: string | null
          fecha_vencimiento: string | null
          fuero: Database["public"]["Enums"]["fuero"] | null
          id: string | null
          jurisdiccion: string | null
          modalidad: Database["public"]["Enums"]["modalidad_plazo"] | null
          nro_sac: string | null
          prioridad: Database["public"]["Enums"]["prioridad"] | null
          responsable_avatar: string | null
          responsable_id: string | null
          responsable_nombre: string | null
          vencimiento_con_gracia: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expedientes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plazos_estudio_id_fkey"
            columns: ["estudio_id"]
            isOneToOne: false
            referencedRelation: "estudios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plazos_expediente_id_fkey"
            columns: ["expediente_id"]
            isOneToOne: false
            referencedRelation: "expedientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plazos_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      borrar_api_key_ia: { Args: { _estudio: string }; Returns: undefined }
      computar_plazo: {
        Args: {
          _dias: number
          _estudio?: string
          _inicio_computo: string
          _jurisdiccion?: string
          _modalidad?: Database["public"]["Enums"]["modalidad_plazo"]
        }
        Returns: Json
      }
      crear_estudio: {
        Args: {
          _cuit?: string
          _localidad?: string
          _nombre: string
          _telefono?: string
        }
        Returns: string
      }
      dashboard_resumen: { Args: { _estudio: string }; Returns: Json }
      es_dia_habil: {
        Args: { _estudio?: string; _fecha: string; _jurisdiccion?: string }
        Returns: boolean
      }
      generar_recordatorios: { Args: never; Returns: number }
      guardar_api_key_ia: {
        Args: { _estudio: string; _key: string; _modelo?: string }
        Returns: undefined
      }
      obtener_api_key_ia: {
        Args: { _estudio: string }
        Returns: {
          api_key: string
          modelo: string
        }[]
      }
      proximo_dia_habil: {
        Args: { _estudio?: string; _fecha: string; _jurisdiccion?: string }
        Returns: string
      }
    }
    Enums: {
      canal_recordatorio: "in_app" | "email" | "push" | "whatsapp"
      estado_expediente:
        | "en_tramite"
        | "con_sentencia"
        | "en_ejecucion"
        | "en_apelacion"
        | "suspendido"
        | "archivado"
      estado_plazo:
        | "pendiente"
        | "cumplido"
        | "vencido"
        | "suspendido"
        | "cancelado"
      estado_recordatorio: "programado" | "enviado" | "fallido" | "cancelado"
      estado_tarea:
        | "pendiente"
        | "en_curso"
        | "en_revision"
        | "completada"
        | "cancelada"
      fuero:
        | "civil_comercial"
        | "laboral"
        | "familia"
        | "penal"
        | "contencioso_administrativo"
        | "concursos_quiebras"
        | "tributario"
        | "otro"
      modalidad_plazo: "habiles" | "corridos" | "horas"
      origen_movimiento: "manual" | "sac" | "sistema"
      prioridad: "baja" | "media" | "alta" | "critica"
      rol_estudio:
        | "owner"
        | "abogado"
        | "procurador"
        | "paralegal"
        | "secretaria"
        | "cliente"
      tipo_cliente: "fisica" | "juridica"
      tipo_inhabil:
        | "feriado_nacional"
        | "feriado_provincial"
        | "no_laborable"
        | "feria_judicial"
        | "asueto"
      tipo_parte: "actor" | "demandado" | "tercero" | "citado_garantia" | "otro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      canal_recordatorio: ["in_app", "email", "push", "whatsapp"],
      estado_expediente: [
        "en_tramite",
        "con_sentencia",
        "en_ejecucion",
        "en_apelacion",
        "suspendido",
        "archivado",
      ],
      estado_plazo: [
        "pendiente",
        "cumplido",
        "vencido",
        "suspendido",
        "cancelado",
      ],
      estado_recordatorio: ["programado", "enviado", "fallido", "cancelado"],
      estado_tarea: [
        "pendiente",
        "en_curso",
        "en_revision",
        "completada",
        "cancelada",
      ],
      fuero: [
        "civil_comercial",
        "laboral",
        "familia",
        "penal",
        "contencioso_administrativo",
        "concursos_quiebras",
        "tributario",
        "otro",
      ],
      modalidad_plazo: ["habiles", "corridos", "horas"],
      origen_movimiento: ["manual", "sac", "sistema"],
      prioridad: ["baja", "media", "alta", "critica"],
      rol_estudio: [
        "owner",
        "abogado",
        "procurador",
        "paralegal",
        "secretaria",
        "cliente",
      ],
      tipo_cliente: ["fisica", "juridica"],
      tipo_inhabil: [
        "feriado_nacional",
        "feriado_provincial",
        "no_laborable",
        "feria_judicial",
        "asueto",
      ],
      tipo_parte: ["actor", "demandado", "tercero", "citado_garantia", "otro"],
    },
  },
} as const

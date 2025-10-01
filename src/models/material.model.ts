import { Schema, model, Types } from "mongoose";
import { RANGOS_VOZ, ORIGENES } from "./tipos";

export interface IMaterial {
  titulo: string;
  cancionId?: Types.ObjectId;
  tipo: "voz" | "guitarra_base" | "guitarra_requinto" | "bajo" | "teoria";
  rangoVoz?: typeof RANGOS_VOZ[number];
  parte?: string;
  url: string;
  origen: typeof ORIGENES[number];
  autorId?: Types.ObjectId;
  etiquetas?: string[];
  creadoEn?: Date;
  actualizadoEn?: Date;
}

const MaterialSchema = new Schema<IMaterial>(
  {
    titulo: { type: String, required: true }, // sin index aquí
    cancionId: { type: Schema.Types.ObjectId, ref: "canciones" },
    tipo: { 
      type: String, 
      enum: ["voz","guitarra_base","guitarra_requinto","bajo","teoria"], 
      required: true 
    },
    rangoVoz: { type: String, enum: RANGOS_VOZ },
    parte: String,
    url: { type: String, required: true },
    origen: { type: String, enum: ORIGENES, default: "telegram" },
    autorId: { type: Schema.Types.ObjectId, ref: "miembros" },
    etiquetas: { type: [String], default: [] },
  },
  { timestamps: { createdAt: "creadoEn", updatedAt: "actualizadoEn" } }
);

// índices definidos aquí (evitas duplicados)
MaterialSchema.index({ titulo: "text" });
MaterialSchema.index({ tipo: 1, rangoVoz: 1 });
MaterialSchema.index({ cancionId: 1 });

export const MaterialModel = model<IMaterial>("materiales", MaterialSchema);

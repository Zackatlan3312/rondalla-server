import { Schema, model, Types } from "mongoose";
import { RANGOS_VOZ, INSTRUMENTALES, ORIGENES, RangoVoz, TipoInstrumental, Origen } from "./tipos";

interface VozTrack {
  rango: RangoVoz;
  parte?: string;
  url: string;
  origen: Origen;
  duracionSeg?: number;
}

interface InstrTrack {
  instrumento: TipoInstrumental;
  parte?: string;
  url: string;
  origen: Origen;
  duracionSeg?: number;
}

interface Participacion {
  miembroId: Types.ObjectId;
  rol: string;
}

export interface ICancion {
  titulo: string;
  tonalidad?: string;
  etiquetas?: string[];
  voces?: VozTrack[];
  instrumentales?: InstrTrack[];
  notas?: string;
  participaciones?: Participacion[];
  creadoEn?: Date;
  actualizadoEn?: Date;
}

const VozSchema = new Schema<VozTrack>(
  {
    rango: { type: String, enum: RANGOS_VOZ, required: true }, // <-- sin index aquí
    parte: String,
    url: { type: String, required: true },
    origen: { type: String, enum: ORIGENES, default: "telegram" },
    duracionSeg: Number,
  },
  { _id: false }
);

const InstrSchema = new Schema<InstrTrack>(
  {
    instrumento: { type: String, enum: INSTRUMENTALES, required: true }, // <-- sin index aquí
    parte: String,
    url: { type: String, required: true },
    origen: { type: String, enum: ORIGENES, default: "telegram" },
    duracionSeg: Number,
  },
  { _id: false }
);

const PartSchema = new Schema<Participacion>(
  {
    miembroId: { type: Schema.Types.ObjectId, ref: "miembros", index: true, required: true },
    rol: { type: String, required: true },
  },
  { _id: false }
);

const CancionSchema = new Schema<ICancion>(
  {
    titulo: { type: String, required: true }, // <-- sin index aquí
    tonalidad: String,
    etiquetas: { type: [String], default: [] },
    voces: { type: [VozSchema], default: [] },
    instrumentales: { type: [InstrSchema], default: [] },
    notas: String,
    participaciones: { type: [PartSchema], default: [] },
  },
  { timestamps: { createdAt: "creadoEn", updatedAt: "actualizadoEn" } }
);

// Índices (defínelos solo aquí)
CancionSchema.index({ "voces.rango": 1 });
CancionSchema.index({ "instrumentales.instrumento": 1 });
CancionSchema.index({ titulo: "text" }); // índice de texto para buscar por título

export const CancionModel = model<ICancion>("canciones", CancionSchema);

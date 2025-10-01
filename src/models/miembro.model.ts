import { Schema, model } from "mongoose";

export interface IMiembro {
  nombre: string;
  roles?: string[];
  instrumentos?: string[];
  activo: boolean;
  creadoEn?: Date;
  actualizadoEn?: Date;
}

const MiembroSchema = new Schema<IMiembro>(
  {
    nombre: { type: String, required: true }, // ← sin index aquí
    roles: { type: [String], default: [] },
    instrumentos: { type: [String], default: [] },
    activo: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "creadoEn", updatedAt: "actualizadoEn" } }
);

// Índices (solo aquí, sin duplicar en el campo)
MiembroSchema.index({ nombre: "text" });
// Opcional útil si filtras por activo:
MiembroSchema.index({ activo: 1 });

export const MiembroModel = model<IMiembro>("miembros", MiembroSchema);

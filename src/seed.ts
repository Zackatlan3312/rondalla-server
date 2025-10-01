/**
 * Script de seed para la Rondalla del Tec Veracruz
 * - Inserta miembros base
 * - Inserta canciones con voces por RANGO y pistas instrumentales (base/requinto/bajo)
 * - Inserta materiales tipo "Primera parte..."
 *
 * Ejecutar:
 *   docker start mongo   (si no está corriendo)
 *   npm run seed
 */

import "dotenv/config";
import mongoose, { Types } from "mongoose";
import { MiembroModel } from "./models/miembro.model";
import { CancionModel } from "./models/cancion.model";
import { MaterialModel } from "./models/material.model";
import { RANGOS_VOZ } from "./models/tipos";

const URI = process.env.MONGO_URI || "mongodb://localhost:27017/rondalla";

async function main() {
  console.log("[seed] Conectando a", URI);
  await mongoose.connect(URI);

  // ======= LIMPIEZA OPCIONAL (descomenta si quieres resetear) =======
  // await Promise.all([
  //   MiembroModel.deleteMany({}),
  //   CancionModel.deleteMany({}),
  //   MaterialModel.deleteMany({}),
  // ]);

  // ======= 1) MIEMBROS =======
  const miembrosData = [
    { nombre: "Profesor Arreglista", roles: ["director"], instrumentos: ["guitarra_requinto","bajo"], activo: true },
    { nombre: "Jorge Sánchez", roles: ["media_aguda"], instrumentos: ["guitarra_base"], activo: true },
    { nombre: "María López", roles: ["aguda"], instrumentos: [], activo: true },
    { nombre: "Carlos Pérez", roles: ["grave"], instrumentos: ["bajo"], activo: true },
  ];

  // upsert por nombre para no duplicar en ejecuciones posteriores
  const miembrosIds: Record<string, Types.ObjectId> = {};
  for (const m of miembrosData) {
    const doc = await MiembroModel.findOneAndUpdate(
      { nombre: m.nombre },
      { $setOnInsert: m },
      { new: true, upsert: true }
    );
    miembrosIds[m.nombre] = doc._id;
  }
  console.log("[seed] Miembros listos:", Object.keys(miembrosIds).length);

  // ======= 2) CANCIONES =======
  // Ejemplos reales según tu descripción
  const cancionesData = [
    {
      titulo: "No Morirá",
      tonalidad: "Sol mayor",
      etiquetas: ["ensayo","clásico"],
      voces: [
        {
          rango: "media_aguda" as (typeof RANGOS_VOZ)[number],
          parte: "Melodía principal",
          url: "https://t.me/tu_canal/no_morira_media_aguda.mp3", // sustituye cuando tengas el enlace real
          origen: "telegram",
          duracionSeg: 180
        }
      ],
      instrumentales: [
        {
          instrumento: "guitarra_base",
          parte: "Acompañamiento completo",
          url: "https://t.me/tu_canal/no_morira_guitarra_base.mp3",
          origen: "telegram",
          duracionSeg: 180
        },
        {
          instrumento: "guitarra_requinto",
          parte: "Melodía y adornos",
          url: "https://t.me/tu_canal/no_morira_requinto.mp3",
          origen: "telegram",
          duracionSeg: 180
        },
        {
          instrumento: "bajo",
          parte: "Línea de bajo",
          url: "https://t.me/tu_canal/no_morira_bajo.mp3",
          origen: "telegram",
          duracionSeg: 180
        }
      ],
      notas: "Arreglo del profesor para presentación",
      participaciones: [
        { miembroId: miembrosIds["Jorge Sánchez"], rol: "media_aguda" },
        { miembroId: miembrosIds["Carlos Pérez"], rol: "bajo" }
      ]
    },
    {
      titulo: "Sabes Una Cosa",
      tonalidad: "Re mayor",
      etiquetas: ["presentación"],
      voces: [
        {
          rango: "aguda",
          parte: "Coro",
          url: "https://t.me/tu_canal/sabes_una_cosa_aguda_coro.mp3",
          origen: "telegram",
          duracionSeg: 75
        }
      ],
      instrumentales: [
        {
          instrumento: "guitarra_base",
          parte: "Primera parte",
          url: "https://t.me/tu_canal/sabes_una_cosa_guitarra_base_parte1.mp3",
          origen: "telegram",
          duracionSeg: 60
        },
        {
          instrumento: "guitarra_requinto",
          parte: "Primera parte",
          url: "https://t.me/tu_canal/sabes_una_cosa_requinto_parte1.mp3",
          origen: "telegram",
          duracionSeg: 60
        }
      ],
      notas: "Sección con rasgueo marcado",
      participaciones: [
        { miembroId: miembrosIds["Profesor Arreglista"], rol: "requinto" }
      ]
    }
  ];

  for (const c of cancionesData) {
    await CancionModel.updateOne(
      { titulo: c.titulo },
      { $set: c },
      { upsert: true }
    );
  }
  const cancionesCount = await CancionModel.countDocuments({});
  console.log("[seed] Canciones totales:", cancionesCount);

  // ======= 3) MATERIALES =======
  const noMorira = await CancionModel.findOne({ titulo: "No Morirá" }).lean();
  const sabesUnaCosa = await CancionModel.findOne({ titulo: "Sabes Una Cosa" }).lean();

  const materialesData = [
    {
      titulo: "Primera parte de la guitarra de Sabes Una Cosa",
      cancionId: sabesUnaCosa?._id,
      tipo: "guitarra_base" as const,
      parte: "Primera parte",
      url: "https://t.me/tu_canal/sabes_una_cosa_guitarra_base_parte1.mp3",
      origen: "telegram",
      autorId: miembrosIds["Profesor Arreglista"],
      etiquetas: ["práctica"]
    },
    {
      titulo: "No Morirá – Voz MEDIA AGUDA",
      cancionId: noMorira?._id,
      tipo: "voz" as const,
      rangoVoz: "media_aguda" as const,
      parte: "Melodía principal",
      url: "https://t.me/tu_canal/no_morira_media_aguda.mp3",
      origen: "telegram",
      autorId: miembrosIds["Profesor Arreglista"],
      etiquetas: ["referencia"]
    }
  ];

  for (const m of materialesData) {
    await MaterialModel.updateOne(
      { titulo: m.titulo },
      { $set: m },
      { upsert: true }
    );
  }
  const materialesCount = await MaterialModel.countDocuments({});
  console.log("[seed] Materiales totales:", materialesCount);

  await mongoose.disconnect();
  console.log("[seed] Listo ✅");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

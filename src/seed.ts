/**
 * 🎵 SEED COMPLETO - RONDALLA TEC VERACRUZ
 * 
 * Base de datos con 30+ canciones reales del repertorio
 * - Miembros base (profesor + integrantes)
 * - 30+ canciones con voces por rango y guitarras
 * - Materiales organizados por tipo
 * 
 * Ejecutar: npm run seed
 */

import "dotenv/config";
import mongoose, { Types } from "mongoose";
import { MiembroModel } from "./models/miembro.model";
import { CancionModel } from "./models/cancion.model";
import { MaterialModel } from "./models/material.model";
import { RANGOS_VOZ, Nivel } from "./models/tipos";

const URI = process.env.MONGO_URI || "mongodb://localhost:27017/rondalla";

// ==================== DATOS BASE ====================

const MIEMBROS_DATA = [
  { 
    nombre: "Profesor Arreglista", 
    roles: ["director"], 
    instrumentos: ["guitarra_requinto","bajo"], 
    activo: true 
  },
  { 
    nombre: "Jorge Sánchez", 
    roles: ["media_aguda"], 
    instrumentos: ["guitarra_base"], 
    activo: true 
  },
  { 
    nombre: "María López", 
    roles: ["aguda"], 
    instrumentos: [], 
    activo: true 
  },
  { 
    nombre: "Carlos Pérez", 
    roles: ["grave"], 
    instrumentos: ["bajo"], 
    activo: true 
  },
  { 
    nombre: "Ana Torres", 
    roles: ["media"], 
    instrumentos: ["guitarra_base"], 
    activo: true 
  },
];

// ==================== CANCIONES (30+) ====================

interface CancionSeed {
  titulo: string;
  nivel: Nivel;
  tonalidad?: string;
  etiquetas: string[];
  voces: string[]; // rangos disponibles
  guitarras: string[]; // tipos disponibles
  notas?: string;
}

const CANCIONES_DATA: CancionSeed[] = [
  {
    titulo: "Alma Llanera",
    nivel: "dificil",
    tonalidad: "Re mayor",
    etiquetas: ["venezolana", "joropo", "presentacion"],
    voces: ["aguda", "media_aguda", "media", "media_grave", "grave"],
    guitarras: ["guitarra_base", "guitarra_requinto"],
    notas: "Requiere buen dominio del joropo"
  },
  {
    titulo: "Amor Marinero",
    nivel: "medio",
    tonalidad: "La menor",
    etiquetas: ["romantica", "bolero"],
    voces: ["aguda", "media_aguda", "media", "grave"],
    guitarras: ["guitarra_base"],
    notas: "Ritmo de bolero tradicional"
  },
  {
    titulo: "Cascabel",
    nivel: "facil",
    tonalidad: "Sol mayor",
    etiquetas: ["navidena", "ensayo"],
    voces: ["aguda", "media", "grave"],
    guitarras: ["guitarra_base"],
    notas: "Ideal para principiantes"
  },
  {
    titulo: "Cerca de Ti",
    nivel: "facil",
    tonalidad: "Do mayor",
    etiquetas: ["romantica", "practica"],
    voces: ["media_aguda", "media", "media_grave"],
    guitarras: ["guitarra_base"],
    notas: "Progresión armónica sencilla"
  },
  {
    titulo: "Como",
    nivel: "dificil",
    tonalidad: "Mi menor",
    etiquetas: ["romantica", "tecnica"],
    voces: ["aguda", "segunda_aguda", "media_aguda", "media", "media_grave", "grave"],
    guitarras: ["guitarra_base", "guitarra_requinto", "bajo"],
    notas: "Arreglo complejo con todas las voces"
  },
  {
    titulo: "Como Quien Pierde Una Estrella",
    nivel: "medio",
    tonalidad: "Re menor",
    etiquetas: ["romantica", "bolero"],
    voces: ["aguda", "media_aguda", "media", "grave"],
    guitarras: ["guitarra_base", "guitarra_requinto"],
    notas: "Clásico de Alejandro Fernández"
  },
  {
    titulo: "Contigo",
    nivel: "facil",
    tonalidad: "Sol mayor",
    etiquetas: ["romantica", "ensayo"],
    voces: ["aguda", "media", "grave"],
    guitarras: ["guitarra_base"],
    notas: "Buena para iniciarse en armonías"
  },
  {
    titulo: "Delirio",
    nivel: "facil",
    tonalidad: "La mayor",
    etiquetas: ["clasica", "vals"],
    voces: ["media_aguda", "media", "media_grave"],
    guitarras: ["guitarra_base"],
    notas: "Vals peruano tradicional"
  },
  {
    titulo: "El Andariego",
    nivel: "medio",
    tonalidad: "Mi menor",
    etiquetas: ["ranchera", "mexicana"],
    voces: ["aguda", "media_aguda", "media", "grave"],
    guitarras: ["guitarra_base", "bajo"],
    notas: "Ritmo de ranchera norteña"
  },
  {
    titulo: "Encampanados",
    nivel: "facil",
    tonalidad: "Do mayor",
    etiquetas: ["romantica", "practica"],
    voces: ["aguda", "media", "grave"],
    guitarras: ["guitarra_base"],
    notas: "Melodía sencilla y pegajosa"
  },
  {
    titulo: "Entrega Total",
    nivel: "facil",
    tonalidad: "Sol mayor",
    etiquetas: ["romantica", "ensayo"],
    voces: ["media_aguda", "media", "media_grave"],
    guitarras: ["guitarra_base"],
    notas: "Ideal para practicar afinación"
  },
  {
    titulo: "Escucha Mi Voz",
    nivel: "medio",
    tonalidad: "La menor",
    etiquetas: ["romantica", "tecnica"],
    voces: ["aguda", "media_aguda", "media", "media_grave", "grave"],
    guitarras: ["guitarra_base", "guitarra_requinto"],
    notas: "Requiere buena proyección vocal"
  },
  {
    titulo: "Gema",
    nivel: "facil",
    tonalidad: "Re mayor",
    etiquetas: ["bolero", "clasica"],
    voces: ["aguda", "media", "grave"],
    guitarras: ["guitarra_base"],
    notas: "Bolero tradicional mexicano"
  },
  {
    titulo: "Hoy Que Soy Mayor",
    nivel: "facil",
    tonalidad: "Sol mayor",
    etiquetas: ["balada", "practica"],
    voces: ["media_aguda", "media", "media_grave"],
    guitarras: ["guitarra_base"],
    notas: "Balada pop romántica"
  },
  {
    titulo: "Inolvidable",
    nivel: "medio",
    tonalidad: "Do mayor",
    etiquetas: ["bolero", "clasica"],
    voces: ["aguda", "media_aguda", "media", "grave"],
    guitarras: ["guitarra_base", "guitarra_requinto"],
    notas: "Clásico de Luis Miguel"
  },
  {
    titulo: "La Bikina",
    nivel: "dificil",
    tonalidad: "Mi menor",
    etiquetas: ["huapango", "tecnica", "presentacion"],
    voces: ["aguda", "segunda_aguda", "media_aguda", "media", "media_grave", "grave"],
    guitarras: ["guitarra_base", "guitarra_requinto", "bajo"],
    notas: "Huapango veracruzano complejo"
  },
  {
    titulo: "La Gloria Eres Tú",
    nivel: "medio",
    tonalidad: "La mayor",
    etiquetas: ["bolero", "romantica"],
    voces: ["aguda", "media_aguda", "media", "grave"],
    guitarras: ["guitarra_base"],
    notas: "Bolero clásico mexicano"
  },
  {
    titulo: "Lo Que Son Las Cosas",
    nivel: "facil",
    tonalidad: "Re mayor",
    etiquetas: ["balada", "ensayo"],
    voces: ["aguda", "media", "grave"],
    guitarras: ["guitarra_base"],
    notas: "Balada moderna sencilla"
  },
  {
    titulo: "Mi Ciudad",
    nivel: "dificil",
    tonalidad: "Sol menor",
    etiquetas: ["ranchera", "tecnica"],
    voces: ["aguda", "media_aguda", "media", "media_grave", "grave"],
    guitarras: ["guitarra_base", "guitarra_requinto", "bajo"],
    notas: "Ranchera con modulaciones complejas"
  },
  {
    titulo: "No Morirá",
    nivel: "dificil",
    tonalidad: "Sol mayor",
    etiquetas: ["clasica", "tecnica", "presentacion"],
    voces: ["aguda", "segunda_aguda", "media_aguda", "media", "media_grave", "grave"],
    guitarras: ["guitarra_base", "guitarra_requinto", "bajo"],
    notas: "Arreglo del profesor, todas las voces"
  },
  {
    titulo: "Noa Noa",
    nivel: "medio",
    tonalidad: "La mayor",
    etiquetas: ["tropical", "romantica"],
    voces: ["aguda", "media_aguda", "media", "grave"],
    guitarras: ["guitarra_base", "bajo"],
    notas: "Ritmo tropical-romántico"
  },
  {
    titulo: "Obsesión",
    nivel: "facil",
    tonalidad: "Do mayor",
    etiquetas: ["bolero", "practica"],
    voces: ["media_aguda", "media", "media_grave"],
    guitarras: ["guitarra_base"],
    notas: "Bolero cubano tradicional"
  },
  {
    titulo: "Perdiendo La Razón",
    nivel: "medio",
    tonalidad: "Mi menor",
    etiquetas: ["balada", "romantica"],
    voces: ["aguda", "media_aguda", "media", "grave"],
    guitarras: ["guitarra_base", "guitarra_requinto"],
    notas: "Balada con coro potente"
  },
  {
    titulo: "Sabes Una Cosa",
    nivel: "facil",
    tonalidad: "Re mayor",
    etiquetas: ["ensayo", "practica"],
    voces: ["aguda", "media", "grave"],
    guitarras: ["guitarra_base", "guitarra_requinto"],
    notas: "Primera canción del semestre"
  },
  {
    titulo: "Sabor a Mí",
    nivel: "facil",
    tonalidad: "La menor",
    etiquetas: ["bolero", "clasica"],
    voces: ["media_aguda", "media", "media_grave"],
    guitarras: ["guitarra_base"],
    notas: "Bolero mexicano icónico"
  },
  {
    titulo: "Sin Ti",
    nivel: "facil",
    tonalidad: "Sol mayor",
    etiquetas: ["romantica", "ensayo"],
    voces: ["aguda", "media", "grave"],
    guitarras: ["guitarra_base"],
    notas: "Melodía romántica sencilla"
  },
  {
    titulo: "Tres Regalos",
    nivel: "facil",
    tonalidad: "Do mayor",
    etiquetas: ["balada", "practica"],
    voces: ["media_aguda", "media", "media_grave"],
    guitarras: ["guitarra_base"],
    notas: "Balada pop mexicana"
  },
  {
    titulo: "Veracruz",
    nivel: "medio",
    tonalidad: "Mi menor",
    etiquetas: ["son", "jarocha", "regional", "presentacion"],
    voces: ["aguda", "media_aguda", "media", "media_grave", "grave"],
    guitarras: ["guitarra_base", "guitarra_requinto", "bajo"],
    notas: "Himno del puerto de Veracruz"
  },
  {
    titulo: "Voces del Recuerdo",
    nivel: "facil",
    tonalidad: "La mayor",
    etiquetas: ["balada", "ensayo"],
    voces: ["aguda", "media", "grave"],
    guitarras: ["guitarra_base"],
    notas: "Balada nostálgica sencilla"
  },
  {
    titulo: "Volverás",
    nivel: "facil",
    tonalidad: "Sol mayor",
    etiquetas: ["romantica", "practica"],
    voces: ["media_aguda", "media", "media_grave"],
    guitarras: ["guitarra_base"],
    notas: "Melodía pegajosa y fácil"
  }
];

// ==================== FUNCIÓN PRINCIPAL ====================

async function main() {
  console.log("[seed] 🎵 Conectando a", URI);
  await mongoose.connect(URI);

  // LIMPIEZA (opcional - descomenta para resetear)
  console.log("[seed] 🗑️  Limpiando base de datos...");
  await Promise.all([
    MiembroModel.deleteMany({}),
    CancionModel.deleteMany({}),
    MaterialModel.deleteMany({}),
  ]);

  // ======= 1) MIEMBROS =======
  console.log("[seed] 👥 Insertando miembros...");
  const miembrosIds: Record<string, Types.ObjectId> = {};
  
  for (const m of MIEMBROS_DATA) {
    const doc = await MiembroModel.findOneAndUpdate(
      { nombre: m.nombre },
      { $setOnInsert: m },
      { new: true, upsert: true }
    );
    miembrosIds[m.nombre] = doc._id;
  }
  console.log(`[seed] ✅ ${Object.keys(miembrosIds).length} miembros creados`);

  // ======= 2) CANCIONES =======
  console.log("[seed] 🎼 Insertando canciones...");
  let cancionesCreadas = 0;
  
  for (const cancion of CANCIONES_DATA) {
    // Construir voces
    const voces = cancion.voces.map(rango => ({
      rango: rango as any,
      parte: "Completa",
      url: `https://drive.google.com/canciones/${cancion.titulo.toLowerCase().replace(/\s+/g, '_')}/voces/${rango}.mp3`,
      origen: "local" as const,
      duracionSeg: 180
    }));

    // Construir instrumentales
    const instrumentales = cancion.guitarras.map(instrumento => ({
      instrumento: instrumento as any,
      parte: "Completa",
      url: `https://drive.google.com/canciones/${cancion.titulo.toLowerCase().replace(/\s+/g, '_')}/guitarra/${instrumento}.mp3`,
      origen: "local" as const,
      duracionSeg: 180
    }));

    // Participaciones ejemplo (profesor en todas)
    const participaciones = [
      { 
        miembroId: miembrosIds["Profesor Arreglista"], 
        rol: "arreglista" 
      }
    ];

    await CancionModel.updateOne(
      { titulo: cancion.titulo },
      {
        $set: {
          titulo: cancion.titulo,
          tonalidad: cancion.tonalidad,
          nivel: cancion.nivel,
          etiquetas: cancion.etiquetas,
          voces,
          instrumentales,
          notas: cancion.notas,
          participaciones
        }
      },
      { upsert: true }
    );
    
    cancionesCreadas++;
  }
  console.log(`[seed] ✅ ${cancionesCreadas} canciones creadas`);

  // ======= 3) MATERIALES DE EJEMPLO =======
  console.log("[seed] 📚 Insertando materiales de ejemplo...");
  
  const noMorira = await CancionModel.findOne({ titulo: "No Morirá" }).lean();
  const sabesUnaCosa = await CancionModel.findOne({ titulo: "Sabes Una Cosa" }).lean();

  const materialesData = [
    {
      titulo: "Guía: Primera parte de Sabes Una Cosa",
      cancionId: sabesUnaCosa?._id,
      tipo: "guitarra_base" as const,
      parte: "Primera parte",
      url: "https://drive.google.com/materiales/sabes_una_cosa_parte1.mp3",
      origen: "local" as const,
      autorId: miembrosIds["Profesor Arreglista"],
      etiquetas: ["practica", "principiantes"]
    },
    {
      titulo: "No Morirá - Voz Media Aguda (referencia)",
      cancionId: noMorira?._id,
      tipo: "voz" as const,
      rangoVoz: "media_aguda" as const,
      parte: "Completa",
      url: "https://drive.google.com/materiales/no_morira_media_aguda.mp3",
      origen: "local" as const,
      autorId: miembrosIds["Profesor Arreglista"],
      etiquetas: ["referencia", "avanzado"]
    },
    {
      titulo: "Teoría: Introducción al rasgueo básico",
      tipo: "teoria" as const,
      url: "https://drive.google.com/materiales/teoria_rasgueo.pdf",
      origen: "local" as const,
      autorId: miembrosIds["Profesor Arreglista"],
      etiquetas: ["teoria", "principiantes"]
    }
  ];

  for (const m of materialesData) {
    await MaterialModel.updateOne(
      { titulo: m.titulo },
      { $set: m },
      { upsert: true }
    );
  }
  console.log(`[seed] ✅ ${materialesData.length} materiales creados`);

  // ======= RESUMEN FINAL =======
  const totalMiembros = await MiembroModel.countDocuments({});
  const totalCanciones = await CancionModel.countDocuments({});
  const totalMateriales = await MaterialModel.countDocuments({});

  console.log("\n" + "=".repeat(50));
  console.log("🎉 SEED COMPLETADO EXITOSAMENTE");
  console.log("=".repeat(50));
  console.log(`👥 Miembros:    ${totalMiembros}`);
  console.log(`🎼 Canciones:   ${totalCanciones}`);
  console.log(`📚 Materiales:  ${totalMateriales}`);
  console.log("=".repeat(50) + "\n");

  await mongoose.disconnect();
  console.log("[seed] 🔌 Desconectado de MongoDB\n");
}

// ==================== EJECUCIÓN ====================

main().catch((e) => {
  console.error("❌ Error en seed:", e);
  process.exit(1);
});
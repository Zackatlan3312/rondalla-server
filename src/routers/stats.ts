import { Router, Request, Response } from "express";
import { CancionModel } from "../models/cancion.model";
import { MiembroModel } from "../models/miembro.model";
import { MaterialModel } from "../models/material.model";
import { RANGOS_VOZ, INSTRUMENTALES, NIVELES } from "../models/tipos";

const router = Router();

// ==================== RESUMEN GENERAL ====================
// GET /api/stats/resumen-general
router.get("/resumen-general", async (_req: Request, res: Response) => {
  try {
    // Contadores básicos
    const totalMiembros = await MiembroModel.countDocuments({});
    const miembrosActivos = await MiembroModel.countDocuments({ activo: true });
    const totalCanciones = await CancionModel.countDocuments({});
    const totalMateriales = await MaterialModel.countDocuments({});

    // 🆕 Contadores por nivel
    const cancionesFaciles = await CancionModel.countDocuments({ nivel: "facil" });
    const cancionesMedias = await CancionModel.countDocuments({ nivel: "medio" });
    const cancionesDificiles = await CancionModel.countDocuments({ nivel: "dificil" });

    // Rango de voz más usado
    const rangoMasUsado = await CancionModel.aggregate([
      { $unwind: "$voces" },
      { $group: { _id: "$voces.rango", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);

    // Instrumento más usado
    const instrumentoMasUsado = await CancionModel.aggregate([
      { $unwind: "$instrumentales" },
      { $group: { _id: "$instrumentales.instrumento", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);

    // Tipo de material más común
    const tipoMaterialMasComun = await MaterialModel.aggregate([
      { $group: { _id: "$tipo", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);

    return res.json({
      ok: true,
      data: {
        totalMiembros,
        miembrosActivos,
        miembrosInactivos: totalMiembros - miembrosActivos,
        totalCanciones,
        totalMateriales,
        distribucionNivel: {
          facil: cancionesFaciles,
          medio: cancionesMedias,
          dificil: cancionesDificiles
        },
        rangoMasUsado: rangoMasUsado[0] || null,
        instrumentoMasUsado: instrumentoMasUsado[0] || null,
        tipoMaterialMasComun: tipoMaterialMasComun[0] || null
      }
    });
  } catch (error: any) {
    console.error("[GET /stats/resumen-general] Error:", error);
    return res.status(500).json({
      ok: false,
      error: "Error al obtener resumen general",
      details: error.message
    });
  }
});

// ==================== 🆕 CANCIONES POR NIVEL ====================
// GET /api/stats/canciones-por-nivel
router.get("/canciones-por-nivel", async (_req: Request, res: Response) => {
  try {
    const resultado = await CancionModel.aggregate([
      {
        $group: {
          _id: "$nivel",
          total: { $sum: 1 },
          canciones: { $push: "$titulo" }
        }
      },
      { $sort: { _id: 1 } } // facil, medio, dificil
    ]);

    return res.json({
      ok: true,
      total: resultado.length,
      data: resultado
    });
  } catch (error: any) {
    console.error("[GET /stats/canciones-por-nivel] Error:", error);
    return res.status(500).json({
      ok: false,
      error: "Error al obtener estadísticas por nivel",
      details: error.message
    });
  }
});

// ==================== CANCIONES POR RANGO DE VOZ ====================
// GET /api/stats/canciones-por-voz
router.get("/canciones-por-voz", async (_req: Request, res: Response) => {
  try {
    const resultado = await CancionModel.aggregate([
      { $unwind: "$voces" },
      {
        $group: {
          _id: "$voces.rango",
          total: { $sum: 1 },
          canciones: { $addToSet: "$titulo" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    return res.json({
      ok: true,
      total: resultado.length,
      data: resultado
    });
  } catch (error: any) {
    console.error("[GET /stats/canciones-por-voz] Error:", error);
    return res.status(500).json({
      ok: false,
      error: "Error al obtener estadísticas por voz",
      details: error.message
    });
  }
});

// ==================== DISTRIBUCIÓN DE INSTRUMENTOS ====================
// GET /api/stats/distribucion-instrumentos
router.get("/distribucion-instrumentos", async (_req: Request, res: Response) => {
  try {
    const resultado = await CancionModel.aggregate([
      { $unwind: "$instrumentales" },
      {
        $group: {
          _id: "$instrumentales.instrumento",
          total: { $sum: 1 },
          canciones: { $addToSet: "$titulo" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    return res.json({
      ok: true,
      total: resultado.length,
      data: resultado
    });
  } catch (error: any) {
    console.error("[GET /stats/distribucion-instrumentos] Error:", error);
    return res.status(500).json({
      ok: false,
      error: "Error al obtener distribución de instrumentos",
      details: error.message
    });
  }
});

// ==================== COBERTURA DE VOCES ====================
// GET /api/stats/cobertura-voces
router.get("/cobertura-voces", async (_req: Request, res: Response) => {
  try {
    const canciones = await CancionModel.find({}, "titulo voces nivel").lean();

    const analisis = canciones.map(cancion => {
      const rangosPresentesSet = new Set(cancion.voces?.map(v => v.rango) || []);
      const rangosFaltantes = RANGOS_VOZ.filter(r => !rangosPresentesSet.has(r));
      
      return {
        cancion: cancion.titulo,
        nivel: cancion.nivel || "medio",
        vocesDisponibles: cancion.voces?.length || 0,
        rangoPresentes: Array.from(rangosPresentesSet),
        rangosFaltantes,
        completitud: ((rangosPresentesSet.size / RANGOS_VOZ.length) * 100).toFixed(1) + "%"
      };
    });

    // Ordenar por completitud
    analisis.sort((a, b) => parseFloat(b.completitud) - parseFloat(a.completitud));

    // Estadísticas generales
    const cancionesCompletas = analisis.filter(a => a.rangosFaltantes.length === 0).length;
    const promedioCompletitud = (
      analisis.reduce((sum, a) => sum + parseFloat(a.completitud), 0) / analisis.length
    ).toFixed(1);

    return res.json({
      ok: true,
      estadisticas: {
        totalCanciones: canciones.length,
        cancionesCompletas,
        cancionesIncompletas: canciones.length - cancionesCompletas,
        promedioCompletitud: promedioCompletitud + "%"
      },
      data: analisis
    });
  } catch (error: any) {
    console.error("[GET /stats/cobertura-voces] Error:", error);
    return res.status(500).json({
      ok: false,
      error: "Error al analizar cobertura de voces",
      details: error.message
    });
  }
});

// ==================== MATERIALES POR TIPO ====================
// GET /api/stats/materiales-por-tipo
router.get("/materiales-por-tipo", async (_req: Request, res: Response) => {
  try {
    const resultado = await MaterialModel.aggregate([
      {
        $group: {
          _id: "$tipo",
          total: { $sum: 1 },
          titulos: { $push: "$titulo" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    return res.json({
      ok: true,
      total: resultado.length,
      data: resultado
    });
  } catch (error: any) {
    console.error("[GET /stats/materiales-por-tipo] Error:", error);
    return res.status(500).json({
      ok: false,
      error: "Error al obtener materiales por tipo",
      details: error.message
    });
  }
});

// ==================== PARTICIPACIONES POR MIEMBRO ====================
// GET /api/stats/participaciones-miembros
router.get("/participaciones-miembros", async (_req: Request, res: Response) => {
  try {
    const resultado = await CancionModel.aggregate([
      { $unwind: "$participaciones" },
      {
        $lookup: {
          from: "miembros",
          localField: "participaciones.miembroId",
          foreignField: "_id",
          as: "miembroInfo"
        }
      },
      { $unwind: "$miembroInfo" },
      {
        $group: {
          _id: "$participaciones.miembroId",
          nombre: { $first: "$miembroInfo.nombre" },
          totalParticipaciones: { $sum: 1 },
          canciones: { $addToSet: "$titulo" },
          roles: { $addToSet: "$participaciones.rol" }
        }
      },
      { $sort: { totalParticipaciones: -1 } }
    ]);

    return res.json({
      ok: true,
      total: resultado.length,
      data: resultado
    });
  } catch (error: any) {
    console.error("[GET /stats/participaciones-miembros] Error:", error);
    return res.status(500).json({
      ok: false,
      error: "Error al obtener participaciones",
      details: error.message
    });
  }
});

// ==================== CANCIONES MÁS COMPLETAS ====================
// GET /api/stats/canciones-mas-completas
router.get("/canciones-mas-completas", async (_req: Request, res: Response) => {
  try {
    const canciones = await CancionModel.aggregate([
      {
        $project: {
          titulo: 1,
          tonalidad: 1,
          nivel: 1,
          totalVoces: { $size: { $ifNull: ["$voces", []] } },
          totalInstrumentales: { $size: { $ifNull: ["$instrumentales", []] } },
          totalParticipaciones: { $size: { $ifNull: ["$participaciones", []] } },
          totalElementos: {
            $add: [
              { $size: { $ifNull: ["$voces", []] } },
              { $size: { $ifNull: ["$instrumentales", []] } },
              { $size: { $ifNull: ["$participaciones", []] } }
            ]
          }
        }
      },
      { $sort: { totalElementos: -1 } },
      { $limit: 10 }
    ]);

    return res.json({
      ok: true,
      descripcion: "Top 10 canciones con más contenido (voces + instrumentales + participaciones)",
      data: canciones
    });
  } catch (error: any) {
    console.error("[GET /stats/canciones-mas-completas] Error:", error);
    return res.status(500).json({
      ok: false,
      error: "Error al obtener canciones más completas",
      details: error.message
    });
  }
});

// ==================== ANÁLISIS POR ETIQUETAS ====================
// GET /api/stats/analisis-etiquetas
router.get("/analisis-etiquetas", async (_req: Request, res: Response) => {
  try {
    const resultado = await CancionModel.aggregate([
      { $unwind: "$etiquetas" },
      {
        $group: {
          _id: "$etiquetas",
          total: { $sum: 1 },
          canciones: { $addToSet: "$titulo" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    return res.json({
      ok: true,
      total: resultado.length,
      data: resultado
    });
  } catch (error: any) {
    console.error("[GET /stats/analisis-etiquetas] Error:", error);
    return res.status(500).json({
      ok: false,
      error: "Error al analizar etiquetas",
      details: error.message
    });
  }
});

export default router;
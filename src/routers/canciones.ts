import { Router, Request, Response } from "express";
import { CancionModel } from "../models/cancion.model";
import { RANGOS_VOZ, INSTRUMENTALES, NIVELES } from "../models/tipos";

const router = Router();

// ==================== CREATE ====================
// POST /api/canciones
router.post("/", async (req: Request, res: Response) => {
  try {
    const { titulo, tonalidad, nivel, etiquetas, voces, instrumentales, notas, participaciones } = req.body;

    if (!titulo || titulo.trim() === "") {
      return res.status(400).json({ 
        ok: false, 
        error: "El título es obligatorio" 
      });
    }

    const nuevaCancion = await CancionModel.create({
      titulo: titulo.trim(),
      tonalidad,
      nivel: nivel || "medio",
      etiquetas: etiquetas || [],
      voces: voces || [],
      instrumentales: instrumentales || [],
      notas,
      participaciones: participaciones || []
    });

    return res.status(201).json({ 
      ok: true, 
      data: nuevaCancion 
    });

  } catch (error: any) {
    console.error("[POST /canciones] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al crear canción",
      details: error.message 
    });
  }
});

// ==================== READ (Lista con paginación) ====================
// GET /api/canciones?buscar=texto&etiqueta=ensayo&nivel=facil&page=1&limit=10
router.get("/", async (req: Request, res: Response) => {
  try {
    const { buscar, etiqueta, nivel, page, limit } = req.query;
    
    // Paginación
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    // Construir filtro dinámico
    const filtro: any = {};
    
    if (buscar && typeof buscar === "string") {
      filtro.$text = { $search: buscar };
    }
    
    if (etiqueta) {
      filtro.etiquetas = etiqueta;
    }

    if (nivel) {
      if (!NIVELES.includes(nivel as any)) {
        return res.status(400).json({
          ok: false,
          error: `Nivel inválido. Opciones: ${NIVELES.join(", ")}`
        });
      }
      filtro.nivel = nivel;
    }

    // Contar total de documentos
    const total = await CancionModel.countDocuments(filtro);

    // Obtener datos paginados
    const canciones = await CancionModel.find(filtro)
      .populate("participaciones.miembroId", "nombre roles")
      .sort({ titulo: 1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    return res.json({ 
      ok: true,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      data: canciones 
    });

  } catch (error: any) {
    console.error("[GET /canciones] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al obtener canciones",
      details: error.message 
    });
  }
});

// ==================== BÚSQUEDA AVANZADA MULTI-CRITERIO ====================
// GET /api/canciones/buscar-avanzado?voz=aguda&instrumento=guitarra_base&nivel=facil&texto=amor&etiqueta=romantico
router.get("/buscar-avanzado", async (req: Request, res: Response) => {
  try {
    const { voz, instrumento, nivel, texto, etiqueta } = req.query;

    // Construir filtro dinámico
    const filtro: any = {};

    // Filtro por voz (rango)
    if (voz && typeof voz === "string") {
      if (!RANGOS_VOZ.includes(voz as any)) {
        return res.status(400).json({
          ok: false,
          error: `Rango de voz inválido. Opciones: ${RANGOS_VOZ.join(", ")}`
        });
      }
      filtro["voces.rango"] = voz;
    }

    // Filtro por instrumento
    if (instrumento && typeof instrumento === "string") {
      if (!INSTRUMENTALES.includes(instrumento as any)) {
        return res.status(400).json({
          ok: false,
          error: `Instrumento inválido. Opciones: ${INSTRUMENTALES.join(", ")}`
        });
      }
      filtro["instrumentales.instrumento"] = instrumento;
    }

    // Filtro por nivel
    if (nivel && typeof nivel === "string") {
      if (!NIVELES.includes(nivel as any)) {
        return res.status(400).json({
          ok: false,
          error: `Nivel inválido. Opciones: ${NIVELES.join(", ")}`
        });
      }
      filtro.nivel = nivel;
    }

    // Filtro por texto (búsqueda en título)
    if (texto && typeof texto === "string") {
      filtro.$text = { $search: texto };
    }

    // Filtro por etiqueta
    if (etiqueta && typeof etiqueta === "string") {
      filtro.etiquetas = etiqueta;
    }

    // Si no hay filtros, devolver error
    if (Object.keys(filtro).length === 0) {
      return res.status(400).json({
        ok: false,
        error: "Debes proporcionar al menos un criterio de búsqueda",
        criteriosDisponibles: {
          voz: RANGOS_VOZ,
          instrumento: INSTRUMENTALES,
          nivel: NIVELES,
          texto: "cualquier texto para buscar en título",
          etiqueta: "nombre de etiqueta"
        }
      });
    }

    // Ejecutar búsqueda
    const canciones = await CancionModel.find(filtro)
      .populate("participaciones.miembroId", "nombre roles")
      .sort({ titulo: 1 })
      .lean();

    return res.json({
      ok: true,
      criteriosUsados: { voz, instrumento, nivel, texto, etiqueta },
      total: canciones.length,
      data: canciones
    });

  } catch (error: any) {
    console.error("[GET /canciones/buscar-avanzado] Error:", error);
    return res.status(500).json({
      ok: false,
      error: "Error en búsqueda avanzada",
      details: error.message
    });
  }
});

// ==================== BÚSQUEDA POR NIVEL ====================
// GET /api/canciones/por-nivel/:nivel
router.get("/por-nivel/:nivel", async (req: Request, res: Response) => {
  try {
    const { nivel } = req.params;

    if (!NIVELES.includes(nivel as any)) {
      return res.status(400).json({ 
        ok: false, 
        error: `Nivel inválido. Opciones: ${NIVELES.join(", ")}` 
      });
    }

    const canciones = await CancionModel.find({ nivel })
      .populate("participaciones.miembroId", "nombre")
      .sort({ titulo: 1 })
      .lean();

    return res.json({ 
      ok: true, 
      nivel,
      total: canciones.length,
      data: canciones 
    });

  } catch (error: any) {
    console.error("[GET /canciones/por-nivel] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al buscar por nivel",
      details: error.message 
    });
  }
});

// ==================== BÚSQUEDA POR VOZ ====================
// GET /api/canciones/por-voz/:rango
router.get("/por-voz/:rango", async (req: Request, res: Response) => {
  try {
    const { rango } = req.params;

    if (!RANGOS_VOZ.includes(rango as any)) {
      return res.status(400).json({ 
        ok: false, 
        error: `Rango inválido. Opciones: ${RANGOS_VOZ.join(", ")}` 
      });
    }

    const canciones = await CancionModel.find({
      "voces.rango": rango
    })
    .populate("participaciones.miembroId", "nombre")
    .sort({ titulo: 1 })
    .lean();

    return res.json({ 
      ok: true, 
      rango,
      total: canciones.length,
      data: canciones 
    });

  } catch (error: any) {
    console.error("[GET /canciones/por-voz] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al buscar por voz",
      details: error.message 
    });
  }
});

// ==================== BÚSQUEDA POR INSTRUMENTO ====================
// GET /api/canciones/por-instrumento/:tipo
router.get("/por-instrumento/:tipo", async (req: Request, res: Response) => {
  try {
    const { tipo } = req.params;

    if (!INSTRUMENTALES.includes(tipo as any)) {
      return res.status(400).json({ 
        ok: false, 
        error: `Instrumento inválido. Opciones: ${INSTRUMENTALES.join(", ")}` 
      });
    }

    const canciones = await CancionModel.find({
      "instrumentales.instrumento": tipo
    })
    .sort({ titulo: 1 })
    .lean();

    return res.json({ 
      ok: true, 
      instrumento: tipo,
      total: canciones.length,
      data: canciones 
    });

  } catch (error: any) {
    console.error("[GET /canciones/por-instrumento] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al buscar por instrumento",
      details: error.message 
    });
  }
});

// ==================== BÚSQUEDA POR MIEMBRO ====================
// GET /api/canciones/con-miembro/:miembroId
router.get("/con-miembro/:miembroId", async (req: Request, res: Response) => {
  try {
    const { miembroId } = req.params;

    const canciones = await CancionModel.find({
      "participaciones.miembroId": miembroId
    })
    .populate("participaciones.miembroId", "nombre roles")
    .sort({ titulo: 1 })
    .lean();

    return res.json({ 
      ok: true, 
      miembroId,
      total: canciones.length,
      data: canciones 
    });

  } catch (error: any) {
    console.error("[GET /canciones/con-miembro] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al buscar por miembro",
      details: error.message 
    });
  }
});

// ==================== READ (Individual) ====================
// GET /api/canciones/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cancion = await CancionModel.findById(id)
      .populate("participaciones.miembroId", "nombre roles instrumentos")
      .lean();

    if (!cancion) {
      return res.status(404).json({ 
        ok: false, 
        error: "Canción no encontrada" 
      });
    }

    return res.json({ 
      ok: true, 
      data: cancion 
    });

  } catch (error: any) {
    console.error("[GET /canciones/:id] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al obtener canción",
      details: error.message 
    });
  }
});

// ==================== UPDATE ====================
// PUT /api/canciones/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, tonalidad, nivel, etiquetas, voces, instrumentales, notas, participaciones } = req.body;

    if (titulo !== undefined && titulo.trim() === "") {
      return res.status(400).json({ 
        ok: false, 
        error: "El título no puede estar vacío" 
      });
    }

    if (nivel && !NIVELES.includes(nivel as any)) {
      return res.status(400).json({
        ok: false,
        error: `Nivel inválido. Opciones: ${NIVELES.join(", ")}`
      });
    }

    const actualizado = await CancionModel.findByIdAndUpdate(
      id,
      { 
        ...(titulo && { titulo: titulo.trim() }),
        ...(tonalidad && { tonalidad }),
        ...(nivel && { nivel }),
        ...(etiquetas && { etiquetas }),
        ...(voces && { voces }),
        ...(instrumentales && { instrumentales }),
        ...(notas !== undefined && { notas }),
        ...(participaciones && { participaciones })
      },
      { new: true, runValidators: true }
    )
    .populate("participaciones.miembroId", "nombre")
    .lean();

    if (!actualizado) {
      return res.status(404).json({ 
        ok: false, 
        error: "Canción no encontrada" 
      });
    }

    return res.json({ 
      ok: true, 
      data: actualizado 
    });

  } catch (error: any) {
    console.error("[PUT /canciones/:id] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al actualizar canción",
      details: error.message 
    });
  }
});

// ==================== DELETE ====================
// DELETE /api/canciones/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const eliminado = await CancionModel.findByIdAndDelete(id).lean();

    if (!eliminado) {
      return res.status(404).json({ 
        ok: false, 
        error: "Canción no encontrada" 
      });
    }

    return res.json({ 
      ok: true, 
      mensaje: "Canción eliminada correctamente",
      data: eliminado 
    });

  } catch (error: any) {
    console.error("[DELETE /canciones/:id] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al eliminar canción",
      details: error.message 
    });
  }
});

export default router;
import { Router, Request, Response } from "express";
import { MaterialModel } from "../models/material.model";
import { RANGOS_VOZ } from "../models/tipos";

const router = Router();

// ==================== CREATE ====================
// POST /api/materiales
router.post("/", async (req: Request, res: Response) => {
  try {
    const { titulo, cancionId, tipo, rangoVoz, parte, url, origen, autorId, etiquetas } = req.body;

    if (!titulo || titulo.trim() === "") {
      return res.status(400).json({ 
        ok: false, 
        error: "El título es obligatorio" 
      });
    }

    if (!url || url.trim() === "") {
      return res.status(400).json({ 
        ok: false, 
        error: "La URL es obligatoria" 
      });
    }

    if (!tipo) {
      return res.status(400).json({ 
        ok: false, 
        error: "El tipo es obligatorio (voz, guitarra_base, guitarra_requinto, bajo, teoria)" 
      });
    }

    const nuevoMaterial = await MaterialModel.create({
      titulo: titulo.trim(),
      cancionId,
      tipo,
      rangoVoz,
      parte,
      url: url.trim(),
      origen: origen || "telegram",
      autorId,
      etiquetas: etiquetas || []
    });

    return res.status(201).json({ 
      ok: true, 
      data: nuevoMaterial 
    });

  } catch (error: any) {
    console.error("[POST /materiales] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al crear material",
      details: error.message 
    });
  }
});

// ==================== READ (Lista con paginación) ====================
// GET /api/materiales?buscar=texto&tipo=voz&etiqueta=practica&page=1&limit=10
router.get("/", async (req: Request, res: Response) => {
  try {
    const { buscar, tipo, etiqueta, page, limit } = req.query;
    
    // Paginación
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    // Construir filtro dinámico
    const filtro: any = {};
    
    if (buscar && typeof buscar === "string") {
      filtro.$text = { $search: buscar };
    }
    
    if (tipo) {
      filtro.tipo = tipo;
    }
    
    if (etiqueta) {
      filtro.etiquetas = etiqueta;
    }

    // Contar total de documentos
    const total = await MaterialModel.countDocuments(filtro);

    // Obtener datos paginados
    const materiales = await MaterialModel.find(filtro)
      .populate("cancionId", "titulo tonalidad")
      .populate("autorId", "nombre")
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
      data: materiales 
    });

  } catch (error: any) {
    console.error("[GET /materiales] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al obtener materiales",
      details: error.message 
    });
  }
});

// ==================== BÚSQUEDA POR TIPO ====================
// GET /api/materiales/por-tipo/:tipo
router.get("/por-tipo/:tipo", async (req: Request, res: Response) => {
  try {
    const { tipo } = req.params;

    const tiposValidos = ["voz", "guitarra_base", "guitarra_requinto", "bajo", "teoria"];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ 
        ok: false, 
        error: `Tipo inválido. Opciones: ${tiposValidos.join(", ")}` 
      });
    }

    const materiales = await MaterialModel.find({ tipo })
      .populate("cancionId", "titulo")
      .populate("autorId", "nombre")
      .sort({ titulo: 1 })
      .lean();

    return res.json({ 
      ok: true, 
      tipo,
      total: materiales.length,
      data: materiales 
    });

  } catch (error: any) {
    console.error("[GET /materiales/por-tipo] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al buscar por tipo",
      details: error.message 
    });
  }
});

// ==================== BÚSQUEDA POR CANCIÓN ====================
// GET /api/materiales/por-cancion/:cancionId
router.get("/por-cancion/:cancionId", async (req: Request, res: Response) => {
  try {
    const { cancionId } = req.params;

    const materiales = await MaterialModel.find({ cancionId })
      .populate("autorId", "nombre")
      .sort({ tipo: 1, rangoVoz: 1 })
      .lean();

    return res.json({ 
      ok: true, 
      cancionId,
      total: materiales.length,
      data: materiales 
    });

  } catch (error: any) {
    console.error("[GET /materiales/por-cancion] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al buscar por canción",
      details: error.message 
    });
  }
});

// ==================== BÚSQUEDA POR RANGO DE VOZ ====================
// GET /api/materiales/por-voz/:rango
router.get("/por-voz/:rango", async (req: Request, res: Response) => {
  try {
    const { rango } = req.params;

    if (!RANGOS_VOZ.includes(rango as any)) {
      return res.status(400).json({ 
        ok: false, 
        error: `Rango inválido. Opciones: ${RANGOS_VOZ.join(", ")}` 
      });
    }

    const materiales = await MaterialModel.find({ 
      tipo: "voz",
      rangoVoz: rango 
    })
    .populate("cancionId", "titulo tonalidad")
    .populate("autorId", "nombre")
    .sort({ titulo: 1 })
    .lean();

    return res.json({ 
      ok: true, 
      rango,
      total: materiales.length,
      data: materiales 
    });

  } catch (error: any) {
    console.error("[GET /materiales/por-voz] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al buscar por rango de voz",
      details: error.message 
    });
  }
});

// ==================== READ (Individual) ====================
// GET /api/materiales/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const material = await MaterialModel.findById(id)
      .populate("cancionId", "titulo tonalidad etiquetas")
      .populate("autorId", "nombre roles")
      .lean();

    if (!material) {
      return res.status(404).json({ 
        ok: false, 
        error: "Material no encontrado" 
      });
    }

    return res.json({ 
      ok: true, 
      data: material 
    });

  } catch (error: any) {
    console.error("[GET /materiales/:id] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al obtener material",
      details: error.message 
    });
  }
});

// ==================== UPDATE ====================
// PUT /api/materiales/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, cancionId, tipo, rangoVoz, parte, url, origen, autorId, etiquetas } = req.body;

    if (titulo !== undefined && titulo.trim() === "") {
      return res.status(400).json({ 
        ok: false, 
        error: "El título no puede estar vacío" 
      });
    }

    if (url !== undefined && url.trim() === "") {
      return res.status(400).json({ 
        ok: false, 
        error: "La URL no puede estar vacía" 
      });
    }

    const actualizado = await MaterialModel.findByIdAndUpdate(
      id,
      { 
        ...(titulo && { titulo: titulo.trim() }),
        ...(cancionId !== undefined && { cancionId }),
        ...(tipo && { tipo }),
        ...(rangoVoz !== undefined && { rangoVoz }),
        ...(parte !== undefined && { parte }),
        ...(url && { url: url.trim() }),
        ...(origen && { origen }),
        ...(autorId !== undefined && { autorId }),
        ...(etiquetas && { etiquetas })
      },
      { new: true, runValidators: true }
    )
    .populate("cancionId", "titulo")
    .populate("autorId", "nombre")
    .lean();

    if (!actualizado) {
      return res.status(404).json({ 
        ok: false, 
        error: "Material no encontrado" 
      });
    }

    return res.json({ 
      ok: true, 
      data: actualizado 
    });

  } catch (error: any) {
    console.error("[PUT /materiales/:id] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al actualizar material",
      details: error.message 
    });
  }
});

// ==================== DELETE ====================
// DELETE /api/materiales/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const eliminado = await MaterialModel.findByIdAndDelete(id).lean();

    if (!eliminado) {
      return res.status(404).json({ 
        ok: false, 
        error: "Material no encontrado" 
      });
    }

    return res.json({ 
      ok: true, 
      mensaje: "Material eliminado correctamente",
      data: eliminado 
    });

  } catch (error: any) {
    console.error("[DELETE /materiales/:id] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al eliminar material",
      details: error.message 
    });
  }
});

export default router;
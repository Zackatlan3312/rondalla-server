import { Router, Request, Response } from "express";
import { MiembroModel } from "../models/miembro.model";

const router = Router();

// ==================== CREATE ====================
// POST /api/miembros
router.post("/", async (req: Request, res: Response) => {
  try {
    const { nombre, roles, instrumentos, activo } = req.body;

    // Validación básica
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ 
        ok: false, 
        error: "El nombre es obligatorio" 
      });
    }

    // Crear miembro
    const nuevoMiembro = await MiembroModel.create({
      nombre: nombre.trim(),
      roles: roles || [],
      instrumentos: instrumentos || [],
      activo: activo !== undefined ? activo : true
    });

    return res.status(201).json({ 
      ok: true, 
      data: nuevoMiembro 
    });

  } catch (error: any) {
    console.error("[POST /miembros] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al crear miembro",
      details: error.message 
    });
  }
});

// ==================== READ (Lista con paginación) ====================
// GET /api/miembros?activo=true&buscar=Jorge&page=1&limit=10
router.get("/", async (req: Request, res: Response) => {
  try {
    const { activo, buscar, page, limit } = req.query;
    
    // Paginación
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    // Construir filtro dinámico
    const filtro: any = {};
    
    if (activo !== undefined) {
      filtro.activo = activo === "true";
    }
    
    if (buscar && typeof buscar === "string") {
      filtro.$text = { $search: buscar };
    }

    // Contar total de documentos
    const total = await MiembroModel.countDocuments(filtro);
    
    // Obtener datos paginados
    const miembros = await MiembroModel.find(filtro)
      .sort({ nombre: 1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    return res.json({ 
      ok: true,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      data: miembros 
    });

  } catch (error: any) {
    console.error("[GET /miembros] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al obtener miembros",
      details: error.message 
    });
  }
});

// ==================== READ (Individual) ====================
// GET /api/miembros/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const miembro = await MiembroModel.findById(id).lean();

    if (!miembro) {
      return res.status(404).json({ 
        ok: false, 
        error: "Miembro no encontrado" 
      });
    }

    return res.json({ 
      ok: true, 
      data: miembro 
    });

  } catch (error: any) {
    console.error("[GET /miembros/:id] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al obtener miembro",
      details: error.message 
    });
  }
});

// ==================== UPDATE ====================
// PUT /api/miembros/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, roles, instrumentos, activo } = req.body;

    // Validación
    if (nombre !== undefined && nombre.trim() === "") {
      return res.status(400).json({ 
        ok: false, 
        error: "El nombre no puede estar vacío" 
      });
    }

    // Actualizar (solo campos enviados)
    const actualizado = await MiembroModel.findByIdAndUpdate(
      id,
      { 
        ...(nombre && { nombre: nombre.trim() }),
        ...(roles && { roles }),
        ...(instrumentos && { instrumentos }),
        ...(activo !== undefined && { activo })
      },
      { new: true, runValidators: true }
    ).lean();

    if (!actualizado) {
      return res.status(404).json({ 
        ok: false, 
        error: "Miembro no encontrado" 
      });
    }

    return res.json({ 
      ok: true, 
      data: actualizado 
    });

  } catch (error: any) {
    console.error("[PUT /miembros/:id] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al actualizar miembro",
      details: error.message 
    });
  }
});

// ==================== DELETE ====================
// DELETE /api/miembros/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const eliminado = await MiembroModel.findByIdAndDelete(id).lean();

    if (!eliminado) {
      return res.status(404).json({ 
        ok: false, 
        error: "Miembro no encontrado" 
      });
    }

    return res.json({ 
      ok: true, 
      mensaje: "Miembro eliminado correctamente",
      data: eliminado 
    });

  } catch (error: any) {
    console.error("[DELETE /miembros/:id] Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Error al eliminar miembro",
      details: error.message 
    });
  }
});

export default router;
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectMongo } from "./config/mongo";

// Importar routers
import miembrosRouter from "./routers/miembros";
import cancionesRouter from "./routers/canciones";
import materialRouter from "./routers/material";
import statsRouter from "./routers/stats";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true, mensaje: "API funcionando" }));

// Registrar rutas
app.use("/api/miembros", miembrosRouter);
app.use("/api/canciones", cancionesRouter);
app.use("/api/materiales", materialRouter);
app.use("/api/stats", statsRouter);  // ← ESTA ES LA LÍNEA QUE FALTABA

// Ruta 404
app.use((_req, res) => {
  res.status(404).json({ 
    ok: false, 
    error: "Ruta no encontrada" 
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
const URI = process.env.MONGO_URI || "mongodb://localhost:27017/rondalla";

connectMongo(URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ API escuchando en http://localhost:${PORT}`);
      console.log(`📚 Rutas disponibles:`);
      console.log(`   - GET  /health`);
      console.log(`   - CRUD /api/miembros`);
      console.log(`   - CRUD /api/canciones`);
      console.log(`   - CRUD /api/materiales`);
      console.log(`   - 📊   /api/stats/* (estadísticas)`);
    });
  })
  .catch((e) => {
    console.error("❌ Error conectando a Mongo:", e);
    process.exit(1);
  });
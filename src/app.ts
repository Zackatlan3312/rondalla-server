import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectMongo } from "./config/mongo";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
const URI  = process.env.MONGO_URI || "mongodb://localhost:27017/rondalla";

connectMongo(URI)
  .then(() => app.listen(PORT, () => console.log(`API escuchando en :${PORT}`)))
  .catch((e) => { console.error("Error conectando a Mongo:", e); process.exit(1); });

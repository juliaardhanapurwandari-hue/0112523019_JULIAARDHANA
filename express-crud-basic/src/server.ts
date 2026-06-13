import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Server Express.js berjalan",
  });
});

// Endpoint 1: /health
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    service: "Express CRUD API",
  });
});

// Endpoint 2: /profile
app.get("/profile", (req: Request, res: Response) => {
  res.json({
    name: "Julia",
    role: "Mahasiswa",
    nim: "0112523019",
  });
});

// Endpoint 3: /about
app.get("/about", (req: Request, res: Response) => {
  res.json({
    project: "Tugas Mandiri Pertemuan 1",
    description: "Membuat project Express TypeScript baru dengan minimal 3 endpoint GET.",
    version: "1.0.0"
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

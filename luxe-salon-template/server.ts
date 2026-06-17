import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as xlsx from "xlsx";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(process.cwd(), "database.json");
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-12345";
const ADMIN_PASS = "7818066137@9258";

// Initial DB state
interface Review { id: string; name: string; rating: number; text: string; date: string; approved: boolean; }
interface Appointment { id: string; name: string; phone: string; email: string; service: string; date: string; time: string; notes: string; createdAt: number; }
interface DbState { reviews: Review[]; appointments: Appointment[]; }

async function initDb() {
  try {
    await fs.access(DB_FILE);
  } catch {
    const freshDb: DbState = {
      reviews: [
        { id: "1", name: "Sarah Jenkins", text: "Absolutely the best salon experience I've ever had.", rating: 5, date: "2 weeks ago", approved: true },
        { id: "2", name: "Emily Rodriguez", text: "A beautiful, relaxing environment.", rating: 5, date: "1 month ago", approved: true },
        { id: "3", name: "Mia Thompson", text: "So impressed with the attention to detail.", rating: 5, date: "2 months ago", approved: true },
      ],
      appointments: []
    };
    await fs.writeFile(DB_FILE, JSON.stringify(freshDb, null, 2));
  }
}

initDb();

async function getDb(): Promise<DbState> {
  const data = await fs.readFile(DB_FILE, "utf-8");
  return JSON.parse(data);
}

async function saveDb(data: DbState) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Middleware to protect admin routes
function authAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Routes
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASS) {
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("adminToken", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Incorrect password" });
  }
});

app.post("/api/admin/logout", (req, res) => {
  res.clearCookie("adminToken");
  res.json({ success: true });
});

// Make booking
app.post("/api/appointments", async (req, res) => {
  const db = await getDb();
  const newAppointment: Appointment = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: Date.now()
  };
  db.appointments.push(newAppointment);
  await saveDb(db);
  res.json({ success: true, appointment: newAppointment });
});

// Admin: Get appointments
app.get("/api/admin/appointments", authAdmin, async (req, res) => {
  const db = await getDb();
  // Cleanup old appointments (older than 30 days)
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  const originalCount = db.appointments.length;
  db.appointments = db.appointments.filter(app => now - app.createdAt < THIRTY_DAYS_MS);
  if (db.appointments.length < originalCount) {
    await saveDb(db);
  }
  
  res.json(db.appointments);
});

// Admin: Delete appointment
app.delete("/api/admin/appointments/:id", authAdmin, async (req, res) => {
  const db = await getDb();
  db.appointments = db.appointments.filter(app => app.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true });
});

// Admin: Export to excel
app.get("/api/admin/appointments/export", authAdmin, async (req, res) => {
  const db = await getDb();
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const validAppointments = db.appointments.filter(app => now - app.createdAt < THIRTY_DAYS_MS);
  
  const worksheet = xlsx.utils.json_to_sheet(validAppointments);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Appointments");
  
  const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
  res.setHeader("Content-Disposition", "attachment; filename=\"appointments.xlsx\"");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buffer);
});

// Reviews fetch
app.get("/api/reviews", async (req, res) => {
  const db = await getDb();
  res.json(db.reviews.filter(r => r.approved));
});

// Admin: Get all reviews (including pending)
app.get("/api/admin/reviews", authAdmin, async (req, res) => {
  const db = await getDb();
  res.json(db.reviews);
});

// Post a review
app.post("/api/reviews", async (req, res) => {
  const db = await getDb();
  const newReview: Review = {
    id: Date.now().toString(),
    ...req.body,
    date: new Date().toLocaleDateString(),
    approved: true // Auto-approved so it shows immediately
  };
  db.reviews.push(newReview);
  await saveDb(db);
  res.json({ success: true, review: newReview });
});

// Admin: Approve review
app.patch("/api/admin/reviews/:id/approve", authAdmin, async (req, res) => {
  const db = await getDb();
  const review = db.reviews.find(r => r.id === req.params.id);
  if (review) {
    review.approved = true;
    await saveDb(db);
    res.json({ success: true, review });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

// Admin: Delete review
app.delete("/api/admin/reviews/:id", authAdmin, async (req, res) => {
  const db = await getDb();
  db.reviews = db.reviews.filter(r => r.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

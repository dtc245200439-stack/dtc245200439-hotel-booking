const express = require("express");
const { Pool } = require("pg");
const client = require("prom-client");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "postgres",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "hotel_booking",
  user: process.env.DB_USER || "hotel_app",
  password: process.env.DB_PASSWORD
});

client.collectDefaultMetrics();

const httpRequests = new client.Counter({
  name: "hotel_http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"]
});

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequests.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: String(res.statusCode)
    });
  });
  next();
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Database health check failed:", error.message);
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

app.get("/api/rooms", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, room_type, price_per_night, capacity, available FROM rooms ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Unable to fetch rooms:", error.message);
    res.status(500).json({ error: "Unable to fetch rooms" });
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, phone FROM customers ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Unable to fetch customers:", error.message);
    res.status(500).json({ error: "Unable to fetch customers" });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.id, c.full_name AS customer_name, r.name AS room_name,
             b.check_in, b.check_out, b.status
      FROM bookings b
      JOIN customers c ON c.id = b.customer_id
      JOIN rooms r ON r.id = b.room_id
      ORDER BY b.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Unable to fetch bookings:", error.message);
    res.status(500).json({ error: "Unable to fetch bookings" });
  }
});

app.post("/api/bookings", async (req, res) => {
  const { customer_id, room_id, check_in, check_out } = req.body;

  if (!customer_id || !room_id || !check_in || !check_out ||
      check_out <= check_in) {
    return res.status(400).json({ error: "Invalid booking information" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings
       (customer_id, room_id, check_in, check_out, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [customer_id, room_id, check_in, check_out]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Unable to create booking:", error.message);
    res.status(500).json({ error: "Unable to create booking" });
  }
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Hotel booking API listening on port ${port}`);
});

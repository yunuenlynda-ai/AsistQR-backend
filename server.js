const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//  Conexión a MongoDB Atlas
mongoose.connect ("mongodb+srv://Cetis117-Asistencias:1232209922233@cluster0.xlu7f1h.mongodb.net/", {})
  .then(() => console.log(" Conectado a MongoDB Atlas"))
  .catch((err) => console.log("Error al conectar:", err));

//  Modelo de Registro
const Registro = mongoose.model("Registro", new mongoose.Schema({
  nombre: String,
  grupo: String,
  sala: String,
  computadora: String,
  horaEntrada: Date,
  horaSalida: Date
}));

//  Registrar ENTRADA
app.post("/api/entrada", async (req, res) => {
  try {
    const { nombre, grupo, sala, computadora } = req.body;

    const abierto = await Registro.findOne({
      nombre,
      grupo,
      sala,
      computadora,
      horaSalida: null
    });

    if (abierto) {
      return res.json({ ok: false, mensaje: "Ya tienes una entrada sin salida." });
    }

    const nuevo = new Registro({
      nombre,
      grupo,
      sala,
      computadora,
      horaEntrada: new Date(),
      horaSalida: null
    });

    await nuevo.save();
    res.json({ ok: true, mensaje: "Entrada registrada." });
  } catch (e) {
    res.json({ ok: false, mensaje: "Error al registrar entrada." });
  }
});

//  Registrar SALIDA
app.post("/api/salida", async (req, res) => {
  try {
    const { nombre, grupo, sala, computadora } = req.body;

    const abierto = await Registro.findOne({
      nombre,
      grupo,
      sala,
      computadora,
      horaSalida: null
    });

    if (!abierto) {
      return res.json({ ok: false, mensaje: "No hay una entrada abierta." });
    }

    abierto.horaSalida = new Date();
    await abierto.save();

    res.json({ ok: true, mensaje: "Salida registrada." });
  } catch (e) {
    res.json({ ok: false, mensaje: "Error al registrar salida." });
  }
});

//  Lista para el maestro
app.get("/api/registros", async (req, res) => {
  const registros = await Registro.find().sort({ horaEntrada: -1 });
  res.json(registros);
});

app.listen(3000, () => console.log(" Servidor backend en http://localhost:3000"));
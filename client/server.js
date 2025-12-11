// server.js – Simulador del Backend del Examen de Parking (100% igual a lo que pide el examen)
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, { cors: { origin: "*" } });

console.log("Servidor SIMULADO de PARKING iniciado en puerto 4000...");

// =====================================================
// ESTADO GLOBAL DEL SISTEMA (10 salas = 10 alumnoId)
// =====================================================
const parkingSalas = {};

// Inicializa una sala con 10 espacios libres
function inicializarSala(ROOM) {
  parkingSalas[ROOM] = {
    espacios: [
      { numero: 1, tipo: "auto", estado: "libre", patente: null },
      { numero: 2, tipo: "auto", estado: "libre", patente: null },
      { numero: 3, tipo: "auto", estado: "libre", patente: null },
      { numero: 4, tipo: "auto", estado: "libre", patente: null },
      { numero: 5, tipo: "moto", estado: "libre", patente: null },
      { numero: 6, tipo: "moto", estado: "libre", patente: null },
      { numero: 7, tipo: "auto", estado: "libre", patente: null },
      { numero: 8, tipo: "auto", estado: "libre", patente: null },
      { numero: 9, tipo: "auto", estado: "libre", patente: null },
      { numero: 10, tipo: "moto", estado: "libre", patente: null }
    ],
    totalEntradas: 0,
    totalSalidas: 0,
    espaciosLibres: 10
  };
}

// =====================================================
// SOCKET.IO
// =====================================================
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // =====================================================
  // 1) JOIN – Cliente se une a una sala
  // =====================================================
  socket.on("join_parking", ({ alumnoId }) => {
    const ROOM = Number(alumnoId);
    socket.join(ROOM);
    socket.data.room = ROOM;

    console.log(`[PARKING] Cliente ${socket.id} entró a sala ${ROOM}`);

    // Si la sala no existe → inicializar
    if (!parkingSalas[ROOM]) {
      inicializarSala(ROOM);
    }

    // Emitir estado inicial SOLO a este socket (como pide el examen)
    socket.emit("joined_OK_parking", {
      room: ROOM,
      parking: parkingSalas[ROOM]
    });
  });

  // =====================================================
  // 2) REGISTRAR ENTRADA
  // =====================================================
  socket.on("registrar_entrada", ({ empleado, patente, tipo }) => {
    const ROOM = socket.data.room;

    if (!ROOM) return;

    const parking = parkingSalas[ROOM];

    // Ver si existe un espacio libre del tipo correcto
    const espacioLibre = parking.espacios.find(
      e => e.estado === "libre" && e.tipo === tipo
    );

    if (!espacioLibre) {
      socket.emit("error_parking", { mensaje: "No hay espacios disponibles" });
      return;
    }

    // Ocupar espacio
    espacioLibre.estado = "ocupado";
    espacioLibre.patente = patente;

    parking.totalEntradas++;
    parking.espaciosLibres--;

    console.log(`[PARKING] Entrada registrada en sala ${ROOM}: ${patente}`);

    // Notificar a toda la sala
    io.to(ROOM).emit("parking_actualizado", {
      parking: parkingSalas[ROOM]
    });
  });

  // =====================================================
  // 3) REGISTRAR SALIDA
  // =====================================================
  socket.on("registrar_salida", ({ patente }) => {
    const ROOM = socket.data.room;

    if (!ROOM) return;

    const parking = parkingSalas[ROOM];

    const ocupado = parking.espacios.find(
      e => e.estado === "ocupado" && e.patente === patente
    );

    if (!ocupado) {
      // Emitir error SOLO al socket (como pide el examen)
      socket.emit("error_parking", {
        mensaje: "Vehículo no encontrado"
      });
      return;
    }

    // Liberar espacio
    ocupado.estado = "libre";
    ocupado.patente = null;

    parking.totalSalidas++;
    parking.espaciosLibres++;

    console.log(`[PARKING] Salida registrada: ${patente}`);

    // Notificar a toda la sala
    io.to(ROOM).emit("parking_actualizado", {
      parking: parkingSalas[ROOM]
    });
  });
});

// =====================================================
httpServer.listen(4000, () =>
  console.log("PARKING listo en http://localhost:4000")
);

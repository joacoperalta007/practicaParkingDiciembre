//RESPUESTA 1
socket.on("join_parking", ({ alumnoId }) => {
    const ROOM = Number(alumnoId);
    socket.join(ROOM);
    socket.data.room = ROOM;
    
    // ... lógica para buscar el parking ...

    // RESPUESTA CORRECTA:
    socket.emit("joined_OK_parking", { 
        room: ROOM, 
        parking: parkingSalas[ROOM] 
    });
});

//RESPUESTA 2
socket.on("registrar_entrada", ({ empleado, patente, tipo }) => {
    const ROOM = socket.data.room;
    
    // ... lógica de validación ...

    // RESPUESTA CORRECTA:
    io.to(ROOM).emit("parking_actualizado", { 
        parking: parkingSalas[ROOM] 
    });
});


//RESPUESTA 3
socket.on("registrar_salida", ({ patente }) => {
    // ... búsqueda del vehículo ...

    if (!espacioOcupado) {
        // RESPUESTA CORRECTA:
        socket.emit("error_parking", { 
            mensaje: "Vehículo no encontrado" 
        });
        return;
    }
    
    // ... resto del código ...
});
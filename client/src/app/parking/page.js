"use client"

import { useSearchParams } from "next/navigation"
import { useSocket } from "@/hooks/useSocket"
import { useEffect, useState } from "react"
import FormularioVehiculo from "@/componentes/FormularioVehiculo"
import EspacioParking from "@/componentes/EspacioParking"

export default function parkingPage() {
    const params = useSearchParams()
    const empleado = params.get("empleado")
    const alumnoId = params.get("alumnoId")

    const { socket, isConnected } = useSocket("http://localhost:4000") //ESTE USO EN PARTICULAR.
    //PASO 2: RENOMBRAMOS isConnected A estaConectado PARA QUE SEA MAS FACIL DE COMPRENDER.
    const estaConectado = isConnected
    const [unidoASala, setUnidoASala] = useState(false)


    const [datosParking, setDatosParking] = useState(null)
    const [tipo, setTipo] = useState("auto")
    const [patente, setPatente] = useState("")


    const unirseASala = () => {
        if (socket && alumnoId) {
            socket.emit("join_parking", { alumnoId })
            console.log("enviando peticion para unirse a la sala")
        } else {
            alert("error, no se puede unir a la sala, fijate el socket o el id del alumno")
        }
    }




    useEffect(() => {
        if (!socket) return;

        socket.on("joined_OK_parking", (dataParking) => {
            console.log("datos de parking traidos", dataParking.room)
            setUnidoASala(true)
        })

        socket.on("parking_actualizado", (dataParkingActualizada) => {
            console.log("actualizacion recibida", dataParkingActualizada)
            setDatosParking(dataParkingActualizada.parking)
        })

        socket.on("error_parking", (data) => {
            console.log("el parking se lleno", data.mensaje)
            alert(data.mensaje)
        })


        return () => {
            socket.off("joined_OK_parking")
            socket.off("parking_actualizado")
            socket.off("error_parking")
        }


    }, [socket])

    const registroEntrada = () => {

        if (!patente.trim()) {
            alert("Por favor ingresa la patente")
            return;
        }

        socket.emit("registrar_entrada", {
            empleado: empleado,
            patente: patente,
            tipo: tipo
        })

        setPatente("")

    }

    const registroSalida = () => {

        if (!patente.trim()) {
            alert("Por favor ingresa la patente")
            return;
        }

        socket.emit("registrar_salida", { patente })

        setPatente("")

    }






    return (
        <main>
            <h2>Bienvenido a la Zona de parking {empleado}</h2>


            <div style={{ border: "3px solid green", paddingBottom: "10px", marginBottom: "10px" }}>
                <h2>Parking</h2>

                {/*USAMOS RENDERIZADO CONDICIONAL (TERNARIO) PARA MOSTRAR EL ESTADO DEL SOCKET*/}
                <p>Estado del socket: {estaConectado ? "CONECTADO ✅" : "DESCONECTADO ❌"}</p>  {/*ESTE RENDERIZADO CONDICIONAL FUNCIONA COMO UN IF Y UN ELSE*/}

                {/*MOSTRAMOS EL BOTON SOLO SI UNIDO A SALA ES FALSO*/}

                {!unidoASala && (
                    <button style={{ paddingBottom: "" }} onClick={unirseASala}
                        //DESHABILITA EL BOTON SI NO ESTAMOS CONECTADOS O NO HAY ID.
                        disabled={!estaConectado || !alumnoId} //EL || SIGNIFICA O
                    >

                        Unirse a sala

                    </button>
                )}
            </div>


            <div>
                {unidoASala && (
                    <FormularioVehiculo
                        onChangePatente={(e) => setPatente(e.target.value)}
                        onChangeSelectTipo={(e) => setTipo(e.target.value)}
                        onClickEntrada={registroEntrada}
                        onClickSalida={registroSalida}
                    />
                )}
            </div>


            {datosParking && ( 

                <div>
                    <p>holas</p>
                    
                    <h3>Estado parking</h3>
                    {datosParking.espacios.map((espacio) => (
                        <EspacioParking
                            key={espacio.numero}
                            numero={espacio.numero}
                            tipo={espacio.tipo}
                            patente={espacio.patente}
                            estado={espacio.estado}
                        />
                    ))}
                </div>
            )}
        </main>

    )
}
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"


export default function inicioPage() {
    const [empleado, setEmpleado] = useState("")
    const [alumnoId, setAlumnoId] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()


    const irAParking = () => {
        if(empleado.length < 2){
            setError("Error, el nombre debe tener mas de 3 caracteres")
            return;
        }

        router.push(`/parking?empleado=${empleado}&alumnoId=${alumnoId}`)
    }


    return (
        <main>

            <input  style={{display:"block", marginBottom:"3px", width:"195px"}}
                type="text"
                placeholder="ingresa el nombre del empleado"
                value={empleado}
                onChange={(e) => setEmpleado(e.target.value)}
            />

            {error && <p style={{color:"red"}}>{error}</p>}

            <input style={{display:"block", marginBottom:"3px"}}
                type="text"
                placeholder="ingresa el id del alumno"
                value={alumnoId}
                onChange={(e) => setAlumnoId(e.target.value)}
            />

            <button onClick={irAParking}>Ir al parking</button>

        </main>
    )

}
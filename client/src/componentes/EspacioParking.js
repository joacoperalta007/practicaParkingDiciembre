export default function EspacioParking({ numero, tipo, estado, patente }) {
    return (
        <div style={{ border: "2px solid white" }}>

            {tipo === "auto" ? (
                <p> Tipo: 🚗 </p>
            ) : tipo === "moto" ? ( //lo que hice aca fue decir que si la categoria era info, mandaba el info, si era pregunta mandaba pregunta Y SI NO ERA UNA DE ESAS 2
                <p>Tipo: 🏍 </p>         //mandaba respuesta, basicamente por descarte
            ) : null}

            <p>espacio: {numero}</p>

            <p>patente: {patente}</p>

            {estado === "libre" ? (
                <p> LIBRE </p>
            ) : estado === "ocupado" ? ( //lo que hice aca fue decir que si la categoria era info, mandaba el info, si era pregunta mandaba pregunta Y SI NO ERA UNA DE ESAS 2
                <p>OCUPADO, patente: {patente} </p>         //mandaba respuesta, basicamente por descarte
            ) : null}

        </div>
    )
}
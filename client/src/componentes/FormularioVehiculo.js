"use client"


export default function FormularioVehiculo({ onClickEntrada, onClickSalida, onChangePatente, onChangeSelectTipo }) {
    return (
        <div style={{ border: "3px solid blue" }}>

            <h2>Registrar entrada</h2>


            <input
                type="text"
                placeholder="ingrese la patente"
                onChange={onChangePatente}
            />

            
            <select onChange={onChangeSelectTipo}>
                <option value="">Elija su tipo</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
            </select>




            <button onClick={onClickEntrada}>Registrar entrada</button>



            <div style={{ border: "3px solid blue", marginTop:"5px" }}>

                <h2>Registrar salida</h2>


                <input
                    type="text"
                    placeholder="ingrese la patente"
                    onChange={onChangePatente}
                />
                <select onChange={onChangeSelectTipo}>
                    <option value="">Elija su tipo</option>
                    <option value="auto">Auto</option>
                    <option value="moto">Moto</option>
                </select>




                <button onClick={onClickSalida}>Registrar salida</button>
            </div>

        </div>





    )
}
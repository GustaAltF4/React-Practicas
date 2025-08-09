import { useState } from "react";
import { galeria } from "./constants/galeria";
import { Card } from "./Card";

export function Productos(){
    
    const [caterogoriaActiva, setCaterogoriaActiva] = useState(null);
    const cambioCategoria = (categoria) =>{
        setCaterogoriaActiva(prev => prev === categoria ? null : categoria)
        
    }

    return(
    <>
        <div key={galeria.categoria}>

            <button  className="w-full border  border-pink-600 mt-5 rounded-md py-4 text-pink-600 text-lg hover:bg-pink-600 hover:text-white transition-all duration-500"
             onClick={()=>cambioCategoria("cola y ligas")}
            >Cola y Ligas</button>
             { caterogoriaActiva === "cola y ligas" && <Card categoriaC="cola y ligas" />}

            <button  className="w-full border  border-pink-600 rounded-md py-4 text-pink-600 text-lg hover:bg-pink-600 hover:text-white transition-all duration-500"
             onClick={()=>cambioCategoria("pecho")}
            >Pecho</button>
            { caterogoriaActiva === "pecho"  && <Card categoriaC="pecho" />}
            
            <button  className="w-full border border-pink-600 rounded-md py-4 text-pink-600 text-lg hover:bg-pink-600 hover:text-white transition-all duration-500"
            onClick={() => cambioCategoria("cuerpo completo")}
            >Cuerpo completo y Conjuntos</button>
            {caterogoriaActiva === "cuerpo completo" && <Card categoriaC="cuerpo completo"/>}

            <button  className="w-full border border-pink-600 rounded-md py-4 text-pink-600 text-lg hover:bg-pink-600 hover:text-white transition-all duration-500"
            onClick={()=> cambioCategoria("gargantillas")}
            >Gargantillas</button>
            {caterogoriaActiva === "gargantillas" && <Card categoriaC="gargantillas"/>}

            <button  className="w-full border border-pink-600 rounded-md py-4 text-pink-600 text-lg hover:bg-pink-600 hover:text-white transition-all duration-500"
            onClick={()=> cambioCategoria("hombre")}
            >Hombre</button>
            { caterogoriaActiva === "hombre" && <Card categoriaC="hombre"/>}
        </div>
        
        
    </>
    )
}
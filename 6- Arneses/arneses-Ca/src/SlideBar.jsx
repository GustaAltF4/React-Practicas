import { useState } from "react";
import { Productos } from "./Productos";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-md transition-transform transform z-20 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex-shrink-0 w-64`}
      >
        <div className="p-4 font-bold text-xl border-b"> Nitch rosenrrot
            
        </div>
        {/* <img src="/img/icons/LOGONEGRO.png" alt="logo" style={{ width: '50px', height: '50px' }}/> */}
        <nav className="p-4 space-y-2">
          <a
            href="#"
            className="block px-3 py-2 rounded hover:bg-pink-500 hover:text-white"
          >
            Preguntas Frecuentes
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded hover:bg-pink-500 hover:text-white"
          >
            Seguime
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded hover:bg-pink-500 hover:text-white"
          >
            ¿Sex Shop?
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded hover:bg-pink-500 hover:text-white"
          >
            Cerrar sesión
          </a>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center bg-white shadow p-4 md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-700 focus:outline-none focus:ring "
          >
            <img src="/img/icons/3bars.png" alt="logo" style={{ width: '30px', height: '30px' }} className=""/>
          </button>
          <h1 className="p-4 font-bold text-xl border-b ">Nitch Rosenrot</h1>
          <img src="/img/icons/LOGONEGRO.png" alt="logo" style={{ width: '50px', height: '50px' }} className=""/>
        </header>
        <main className="flex-1 p-6">
            <>
            <div className="flex flex-col items-center" >
                <h2 className="text-2xl font-semibold mb-4 text-center ">Catalogo de Arneses</h2>
                <p className="bg-white p-6 rounded shadow max-w-x2 text-center text-gray-700">
                    <strong>¡Bienvenido!</strong>
                    <br/>
                    Estos son los productos que tenemos para ti. Todos los arneses son hechos a mano, por lo que es necesario que
                    todos los encargos se realicen con anticipación.
                    <br/>
                    (puede que las imagenes tarden en cargar al ser muchas)<br/>
                    ¡Muchas gracias!😊
                </p>
                <Productos />
            </div>
                
            </>
        </main>
      </div>
    </div>
  );
}

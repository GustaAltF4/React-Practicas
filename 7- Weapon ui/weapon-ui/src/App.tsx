import  { useEffect, useState } from "react";
import { Contenido } from "@/Contenido"
import { Separator } from "@radix-ui/react-dropdown-menu";
import './app.css'
function App() {
  const [serverUp, setServerUp] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch("https://api-weapon-v2.onrender.com/weapons");
        if (response.ok) {
          setServerUp(true);
          setChecking(false);
        }
      } catch (error) {
        console.log("Servidor no disponible, intentando...");
      }
    };
    checkServer();

    const interval = setInterval(() => {
      if (!serverUp) {
        checkServer();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [serverUp]);



  if (checking) {
    return (
      <div className="flex flex-col bg-stone-900 items-center justify-center h-screen gap-4 px-6 text-center">
        
        <div className="relative w-14 h-14">
          
          <div className="spinner-outer w-full h-full border-4 rounded-full"></div>

          
          <div className="spinner-inner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 border-2 rounded-full"></div>
        </div>



        <p className="text-lg text-white">
          Cargando servidor... Por favor, espere.<br />
          Loading server... Please wait.
        </p>
        <Separator className="my-4 w-full max-w-3xl border-t" />
        <p className="text-sm text-white max-w-3xl">
          Puede tardar bastante tiempo debido a que el servidor es de hosting gratuito.<br />
          This may take some time because the server is hosted on a free plan.
        </p>
      </div>
    );
  }



  return (

    <Contenido />
  )
}

export default App

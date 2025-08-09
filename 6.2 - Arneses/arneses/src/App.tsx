import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import { Catalogo } from "./components/catalogo"
import { Menu, ShoppingCart, CircleQuestionMark,Square,SquareCheckBig } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MyCarousel } from "./components/Carusel"
import { Button } from "./components/ui/button"
import { useState } from "react";
import { Alerta } from "./components/Alert"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function App() {
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [showAlerta, setShowAlerta] = useState(false);
  const toggleSeleccion = (id: number, checked: boolean) => {
    setSeleccionados((prev) =>
      checked ? [...prev, id] : prev.filter((n) => n !== id)
    );
  };
  const comprar = () => {
    if (seleccionados.length === 0) {
      setShowAlerta(true);
      return;
    }

    const mensaje = `Hola, quería comprar el/los producto(s) número(s): ${seleccionados.join(" - ")}`;
    const url = `https://api.whatsapp.com/send?phone=+5492613861336&text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    setTimeout(() => location.reload(), 1000);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider >
          <AppSidebar />
          <SidebarTrigger icon={<Menu />} ></SidebarTrigger>
          <div className=" justify-center w-full">
            <div className=" mt-4 w-full px-4">
              <h1 className="flex items-center text-4xl font-bold text-center mb-4 
            bg-gradient-to-r from-fuchsia-600 to-black dark:to-white 
            bg-clip-text text-transparent w-fit mx-auto
            
            ">CATALOGO ARNESES
            </h1>
              <Alert variant="default" className="w-full mt-4 border-2 border-pink-700 mb-4" data-variant="default">

                <AlertTitle className="text-pink-700 text-center">🎊¡Bienvenido!🎊</AlertTitle>
                <AlertDescription className=" text-center">
                  Estos son los productos que tenemos para ti. Todos los arneses son hechos a mano, por lo que es necesario que todos los encargos se realicen con anticipación.
                  (puede que las imagenes tarden en cargar al ser muchas)
                  ¡Muchas gracias!😊
                  <div className=" mt-4 flex justify-center ">
                    <Popover  >
                      <PopoverTrigger asChild >
                        <Button variant="secondary" className="cursor-pointer">
                          ¿Como comprar?
                          <CircleQuestionMark />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom">
                        <>
                        👉 Activá la casilla <Square className="md"/> → <SquareCheckBig className="md"/> que está en la parte inferior derecha de cada arnés.<br />
                        👉 Luego hacé clic en el botón Comprar <ShoppingCart className="md"  /> para contactarme 💌.
                        </>
                        </PopoverContent>
                    </Popover>
                  </div>
                </AlertDescription>

              </Alert>



              <Catalogo seleccionados={seleccionados} onToggleSeleccion={toggleSeleccion} />
              <h3 className="text-2xl font-bold text-pink-700 text-center mt-4 mb-4 w-full">Mis productos más vendidos</h3>
              <div className="flex justify-center mb-4">
                <MyCarousel />
              </div>

            </div>

            <div className="fixed bottom-4 right-2 z-50">
              <ModeToggle />
            </div>
            <div className="fixed  bottom-4 right-15 z-50 ">
              <Button onClick={comprar}
              > <ShoppingCart />Comprar </Button>
            </div>



          </div>



          <Alerta open={showAlerta} onOpenChange={setShowAlerta} />
        </SidebarProvider>
      </ThemeProvider>
    </div>
  )
}

export default App


import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Catalogo } from "@/components/catalogo"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { MyCarousel } from "@/components/Carusel"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Alerta } from "@/components/Alert"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function HomePage() {
  const [seleccionados, setSeleccionados] = useState<number[]>([])
  const [showAlerta, setShowAlerta] = useState(false)

  const toggleSeleccion = (id: number, checked: boolean) => {
    setSeleccionados((prev) =>
      checked ? [...prev, id] : prev.filter((n) => n !== id)
    )
  }

  const comprar = () => {
    if (seleccionados.length === 0) {
      setShowAlerta(true)
      return
    }

    const mensaje = `Hola, quería comprar el/los producto(s) número(s): ${seleccionados.join(" - ")}`
    const url = `https://api.whatsapp.com/send?phone=+5492613861336&text=${encodeURIComponent(mensaje)}`
    window.open(url, "_blank")

    setTimeout(() => location.reload(), 1000)
  }

  return (
    <SidebarProvider className="flex min-h-screen w-full italic-none">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black transition-colors duration-300">
        <main className="relative w-full">
          {/* HEADER */}
          <header className="absolute top-0 w-full z-40 p-4 md:p-8 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto">
              <SidebarTrigger className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl" />
            </div>
            <h1 className="text-2xl md:text-5xl font-black tracking-widest bg-gradient-to-r from-fuchsia-600 to-black dark:to-white bg-clip-text text-transparent uppercase text-center flex-1">
              CATALOGO ARNESES
            </h1>
            <div className="pointer-events-auto">
              <ModeToggle />
            </div>
          </header>

          {/* HERO + BIENVENIDA */}
          <section className="relative w-full h-[50vh] md:h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-10">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-black z-10" />
              <img
                src="https://images.unsplash.com/photo-1579006415735-7b1277e6ab26?q=80&w=2000"
                className="w-full h-full object-cover opacity-90 dark:opacity-60 animate-slow-zoom"
                alt="Hero"
              />
            </div>

            <div className="relative z-20 w-full flex flex-col items-center gap-4 px-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-5xl md:text-[120px] font-black tracking-tighter leading-[0.8] uppercase text-center">
                  <span className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-700 bg-clip-text text-transparent">
                    NITCH
                  </span>{" "}
                  <br />
                  <span className="text-black dark:text-white [text-shadow:1px_1px_0_white,_-1px_-1px_0_white,_1px_-1px_0_white,_-1px_1px_0_white] dark:[text-shadow:1px_1px_0_black,_-1px_-1px_0_black,_1px_-1px_0_black,_-1px_1px_0_black]">
                    ROSENROT
                  </span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl border border-white/20 dark:border-white/10 rounded-[0.5rem] p-4 md:p-6 bg-white/30 dark:bg-black/20 backdrop-blur-xl shadow-2xl text-center"
              >
                <p className="text-xs md:text-base text-zinc-900 dark:text-zinc-200 font-bold uppercase tracking-widest mb-1">
                  🎊 ¡Bienvenido! 🎊
                </p>
                <p className="text-[10px] md:text-sm mb-4 opacity-90 text-zinc-800 dark:text-zinc-300">
                  Arneses hechos a mano. Pedí con anticipación.
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-fuchsia-700/50 text-fuchsia-700 dark:text-fuchsia-400 bg-transparent h-8 text-[10px] md:text-xs"
                    >
                      ¿Cómo comprar?
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md">
                    <p className="text-xs font-medium text-center">
                      Seleccioná los productos y tocá Comprar abajo a la derecha. ✨
                    </p>
                  </PopoverContent>
                </Popover>
              </motion.div>
            </div>
          </section>

          {/* CONTENIDO (CATALOGO) */}
          <div className="w-full px-4 md:px-10 lg:px-20 py-20">
            <h3 className="text-4xl font-black text-center text-zinc-900 mb-12 dark:text-white uppercase tracking-tighter">
              Nuestros <span className="text-fuchsia-600">productos</span>
            </h3>
            <div className="w-full mb-32">
              <Catalogo seleccionados={seleccionados} onToggleSeleccion={toggleSeleccion} />
            </div>

            <div className="space-y-12 pb-20">
              <h3 className="text-3xl font-black text-center text-zinc-900 dark:text-white uppercase tracking-tighter">
                Más <span className="text-fuchsia-600">vendidos</span>
              </h3>
              <MyCarousel />
            </div>
          </div>

          {/* BOTÓN COMPRAR FLOTANTE GLASS MEJORADO */}
          <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
            <motion.div
              whileTap={{ scale: 0.94 }}
              animate={seleccionados.length > 0 ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 0.25 }}
            >
              <Button
                onClick={comprar}
                className="h-14 md:h-16 px-6 md:px-8 rounded-2xl bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border border-zinc-200 dark:border-fuchsia-500/30 hover:border-fuchsia-500 hover:bg-fuchsia-600/10 transition-all flex gap-3 md:gap-4 shadow-2xl group active:scale-95 text-zinc-900 dark:text-white"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-600 group-hover:scale-110 transition-transform" />
                  <AnimatePresence>
                    {seleccionados.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-3 -right-3 bg-fuchsia-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md shadow-fuchsia-600/50"
                      >
                        {seleccionados.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="font-black uppercase tracking-widest text-xs md:text-sm">
                  {seleccionados.length > 0 ? `Comprar (${seleccionados.length})` : "Comprar"}
                </span>
              </Button>
            </motion.div>
          </div>
        </main>
        <Alerta open={showAlerta} onOpenChange={setShowAlerta} />
      </div>
    </SidebarProvider>
  )
}

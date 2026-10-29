import { useState, useEffect } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { motion } from "framer-motion"
import { MyCarousel } from "@/components/Carusel"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getCategorias, getProductos } from "@/lib/api"
import { galeria } from "@/components/constants/galeria"
import type { Categoria, Producto } from "@/types/database"
import { Link } from "react-router-dom"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { normalizarImagenUrl } from "@/lib/utils"

const CATEGORIAS_FALLBACK: Categoria[] = [
  {
    nombre: "Cola & ligas",
    slug: "cola y ligas",
    portada_url:
      "https://images.pexels.com/photos/34225853/pexels-photo-34225853.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    nombre: "Pecho",
    slug: "pecho",
    portada_url:
      "https://images.unsplash.com/photo-1686704043435-0dcd84c45477?q=80&w=600&auto=format&fit=crop",
  },
  {
    nombre: "Cuerpo Completo & Conjuntos",
    slug: "cuerpo completo",
    portada_url:
      "https://images.pexels.com/photos/13443111/pexels-photo-13443111.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    nombre: "Gargantillas",
    slug: "gargantillas",
    portada_url:
      "https://images.pexels.com/photos/5065863/pexels-photo-5065863.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    nombre: "Hombre",
    slug: "hombre",
    portada_url:
      "https://images.pexels.com/photos/11572315/pexels-photo-11572315.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
]

export function HomePage() {
  const [categorias, setCategorias] = useState<Categoria[]>(CATEGORIAS_FALLBACK)
  const [productos, setProductos] = useState<Producto[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          getCategorias(false),
          getProductos(),
        ])
        if (cats && cats.length > 0) setCategorias(cats)
        if (prods && prods.length > 0) {
          setProductos(prods)
        } else {
          setProductos(galeria as Producto[])
        }
      } catch (err) {
        console.error("Error al cargar en HomePage:", err)
        setProductos(galeria as Producto[])
      }
    }
    fetchData()
  }, [])

  return (
    <SidebarProvider className="flex min-h-screen w-full italic-none">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black transition-colors duration-300">
        <main className="relative w-full">
          {/* HEADER STICKY GLASSMORPHIC */}
          <header className="sticky top-0 w-full z-40 px-4 md:px-8 py-3 flex items-center justify-between bg-white/75 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200/60 dark:border-white/10 transition-colors shadow-sm">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 border border-zinc-300 dark:border-white/20 shadow-sm rounded-xl transition-all active:scale-90 text-zinc-900 dark:text-white" />
            </div>
            <h1 className="text-sm sm:text-base md:text-2xl font-black tracking-widest bg-gradient-to-r from-fuchsia-600 via-zinc-900 to-zinc-900 dark:via-white dark:to-white bg-clip-text text-transparent uppercase text-center flex-1 truncate px-2">
              CATALOGO ARNESES
            </h1>
            <div className="flex items-center gap-2">
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
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
                      Elegí tu categoría, seleccioná los diseños que te gusten y tocá
                      Comprar. ✨
                    </p>
                  </PopoverContent>
                </Popover>
              </motion.div>
            </div>
          </section>

          {/* SECCIÓN COLECCIONES (CARDS INTERACTIVAS REACT BITS STYLE) */}
          <div className="w-full px-4 md:px-10 lg:px-20 py-16">
            <div className="text-center mb-10">
              <span className="text-xs font-black uppercase tracking-widest text-fuchsia-600">
                Catálogo Exclusivo
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-center text-zinc-900 dark:text-white uppercase tracking-tighter mt-1">
                Elegí tu <span className="text-fuchsia-600">colección</span>
              </h3>
            </div>

            {/* GRILLA DE CATEGORÍAS (SIN GRADIENTES, LETRAS DINÁMICAS LIGHT/DARK) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-24">
              {categorias.map((cat, idx) => {
                const count = productos.filter(
                  (p) => p.categoria === cat.slug
                ).length

                return (
                  <motion.div
                    key={cat.slug}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.35 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 transition-all flex flex-col"
                  >
                    <Link
                      to={`/categoria/${cat.slug}`}
                      className="block w-full h-full flex flex-col"
                    >
                      {/* Imagen limpia sin ningún gradiente que la opaque */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                        <img
                          src={normalizarImagenUrl(cat.portada_url)}
                          alt={cat.nombre}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-white flex items-center justify-center shadow-sm group-hover:bg-fuchsia-600 group-hover:text-white transition-all">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Cuerpo de la card con textos que responden al tema */}
                      <div className="p-4 flex flex-col justify-between flex-1 bg-white dark:bg-zinc-900/90 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/20">
                            <Sparkles className="w-3 h-3" />
                            {count} diseños
                          </span>
                        </div>
                        <div className="mt-2">
                          <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors leading-tight">
                            {cat.nombre}
                          </h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                            Ver colección completa →
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* MÁS VENDIDOS */}
            <div className="space-y-12 pb-20">
              <h3 className="text-3xl font-black text-center text-zinc-900 dark:text-white uppercase tracking-tighter">
                Más <span className="text-fuchsia-600">vendidos</span>
              </h3>
              <MyCarousel />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

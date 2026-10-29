import { useState, useEffect } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { motion, AnimatePresence } from "framer-motion"
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
import { ArrowUpRight, Sparkles, CircleHelp, Heart, Ruler, ShieldCheck, Truck, ArrowUp } from "lucide-react"
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
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
          {/* HEADER STICKY GLASSMORPHIC CON BOTONES TÁCTILES CÓMODOS */}
          <header className="sticky top-0 w-full z-40 px-4 md:px-8 py-3 flex items-center justify-between bg-white/80 dark:bg-black/85 backdrop-blur-xl border-b border-zinc-200/60 dark:border-white/10 transition-colors shadow-sm">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-11 w-11 min-w-[44px] min-h-[44px] bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 border border-zinc-300 dark:border-white/20 shadow-sm rounded-xl transition-all active:scale-95 text-zinc-900 dark:text-white flex items-center justify-center" />
            </div>
            <h1 className="text-sm sm:text-base md:text-2xl font-black tracking-widest bg-gradient-to-r from-fuchsia-600 via-zinc-900 to-zinc-900 dark:via-white dark:to-white bg-clip-text text-transparent uppercase text-center flex-1 truncate px-2">
              CATALOGO ARNESES
            </h1>
            <div className="flex items-center gap-2">
              <div className="scale-110">
                <ModeToggle />
              </div>
            </div>
          </header>

          {/* HERO + BIENVENIDA ORIGINAL COMPLETO */}
          <section className="relative w-full min-h-[55vh] md:min-h-[70vh] flex flex-col items-center justify-center overflow-hidden py-10">
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

              {/* CARTEL DE BIENVENIDO COMPLETO RESTAURADO */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl border-2 border-fuchsia-600/70 dark:border-fuchsia-500/50 rounded-2xl p-5 md:p-6 bg-white/80 dark:bg-black/60 backdrop-blur-xl shadow-2xl text-center"
              >
                <h3 className="text-base md:text-lg font-black text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider mb-2">
                  🎊¡Bienvenido!🎊
                </h3>
                <p className="text-xs md:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  Estos son los productos que tenemos para ti. Todos los arneses son hechos a mano, por lo que es necesario que todos los encargos se realicen con anticipación.
                </p>
                <p className="text-[11px] md:text-xs text-zinc-500 dark:text-zinc-400 mt-1 italic">
                  (puede que las imágenes tarden en cargar al ser muchas)
                </p>
                <p className="text-xs md:text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-2">
                  ¡Muchas gracias! 😊
                </p>

                <div className="mt-4 flex justify-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="secondary"
                        className="h-11 px-5 rounded-xl cursor-pointer font-bold text-xs uppercase tracking-wider gap-2 border border-zinc-300 dark:border-zinc-700 active:scale-95 shadow-sm"
                      >
                        <span>¿Cómo comprar?</span>
                        <CircleHelp className="w-4 h-4 text-fuchsia-600" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="bottom"
                      className="max-w-xs md:max-w-sm rounded-2xl p-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl text-xs space-y-2.5 leading-relaxed text-zinc-800 dark:text-zinc-200"
                    >
                      <p className="flex items-start gap-2">
                        <span className="font-bold text-fuchsia-600">👉</span>
                        <span>
                          Activá la casilla de selección en la esquina del arnés para sumarlo a tu pedido.
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="font-bold text-fuchsia-600">👉</span>
                        <span>
                          Luego tocá el botón flotante <strong>Carrito</strong> abajo a la derecha para ver tu lista y contactarme por WhatsApp 💌.
                        </span>
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
              </motion.div>
            </div>
          </section>

          {/* VALORES DE MARCA / ARTESANÍA */}
          <div className="w-full max-w-6xl mx-auto px-4 md:px-8 -mt-6 relative z-30 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-fuchsia-500/10 dark:bg-fuchsia-500/20 text-fuchsia-600 flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-fuchsia-500/20" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100">100% Artesanal</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight">Hecho a mano cuidando cada remache</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-fuchsia-500/10 dark:bg-fuchsia-500/20 text-fuchsia-600 flex items-center justify-center">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100">A tu Medida</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight">Ajuste personalizado a tu silueta</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-fuchsia-500/10 dark:bg-fuchsia-500/20 text-fuchsia-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100">Herrajes Fuertes</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight">Metales reforzados y duraderos</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-fuchsia-500/10 dark:bg-fuchsia-500/20 text-fuchsia-600 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100">Envíos a Todo el País</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight">Empaque cerrado, seguro y discreto</p>
                </div>
              </div>
            </div>
          </div>

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
            <div className="space-y-6 pb-20">
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-widest text-fuchsia-600">
                  Selección Especial
                </span>
                <h3 className="text-3xl md:text-5xl font-black text-center text-zinc-900 dark:text-white uppercase tracking-tighter mt-1">
                  Más <span className="text-fuchsia-600">vendidos</span>
                </h3>
              </div>
              <MyCarousel />
            </div>
          </div>

          {/* BOTÓN FLOTANTE VOLVER ARRIBA */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                onClick={scrollToTop}
                aria-label="Volver arriba"
                className="fixed bottom-6 left-6 z-40 h-11 w-11 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-200 shadow-xl hover:bg-fuchsia-600 hover:text-white dark:hover:bg-fuchsia-600 dark:hover:text-white flex items-center justify-center transition-all active:scale-90"
              >
                <ArrowUp className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </main>
      </div>
    </SidebarProvider>
  )
}

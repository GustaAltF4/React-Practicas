import { useState, useEffect, useRef, Suspense, lazy } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getCategorias, getProductos } from "@/lib/api"
import { galeria } from "@/components/constants/galeria"
import type { Categoria, Producto } from "@/types/database"
import { useCart } from "@/context/CartContext"
import { CardIMG } from "@/components/Card-img"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, Sparkles, ChevronDown, Check } from "lucide-react"
import { normalizarImagenUrl } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Lightbox = lazy(() => import("@/components/LightboxWrapper"))
const BATCH_SIZE = 40 // Lote amplio: 40 productos por carga

export function CategoriaPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { seleccionados, toggleSeleccion } = useCart()

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [limite, setLimite] = useState(BATCH_SIZE)
  const [cargando, setCargando] = useState(true)

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<{ src: string }[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setLimite(BATCH_SIZE)
  }, [slug])

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      try {
        const [cats, prods] = await Promise.all([
          getCategorias(false),
          getProductos(slug),
        ])
        if (cats && cats.length > 0) setCategorias(cats)
        if (prods && prods.length > 0) {
          setProductos(prods)
        } else {
          const fallbackProds = (galeria as Producto[]).filter(
            (p) => p.categoria === slug
          )
          setProductos(fallbackProds)
        }
      } catch (err) {
        console.error("Error al cargar productos de categoria:", err)
        const fallbackProds = (galeria as Producto[]).filter(
          (p) => p.categoria === slug
        )
        setProductos(fallbackProds)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [slug])

  // PRECARGA AGRESIVA EN MEMORIA (Lote actual + siguiente en background)
  useEffect(() => {
    if (productos.length === 0) return
    // Precarga las que se van a ver + 20 adicionales por adelantado
    const hasta = Math.min(productos.length, limite + 20)
    const imagenesAPrecargar = productos.slice(0, hasta)

    imagenesAPrecargar.forEach((p) => {
      const preloadImg = new Image()
      preloadImg.src = normalizarImagenUrl(p.imagen)
    })
  }, [productos, limite])

  // Scroll infinito con margen amplio (800px) para que cargue mucho antes de llegar al fondo
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLimite((prev) => prev + BATCH_SIZE)
        }
      },
      { rootMargin: "800px" }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [productos, limite])

  const categoriaActual = categorias.find((c) => c.slug === slug)
  const prodsVisibles = productos.slice(0, limite)
  const hayMas = limite < productos.length

  const handleImageClick = (id: number) => {
    const slides = productos.map((img) => ({
      src: normalizarImagenUrl(img.imagen),
    }))
    const idx = productos.findIndex((img) => img.id === id)
    setLightboxImages(slides)
    setLightboxIndex(idx >= 0 ? idx : 0)
    setTimeout(() => setLightboxOpen(true), 10)
  }

  return (
    <SidebarProvider className="flex min-h-screen w-full italic-none">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 dark:bg-black transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="min-h-screen text-zinc-900 dark:text-zinc-100 pb-32"
        >
          {/* HEADER STICKY CON CONTROLES ACCESIBLES */}
          <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/85 backdrop-blur-xl border-b border-zinc-200/60 dark:border-white/10 px-4 md:px-8 py-2.5 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 border border-zinc-300 dark:border-white/20 shadow-sm rounded-xl transition-all active:scale-90 text-zinc-900 dark:text-white" />
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Colecciones</span>
              </button>
            </div>

        {/* SELECTOR DROPDOWN ELEGANTE PARA CAMBIAR DE COLECCIÓN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900/90 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-fuchsia-500/20 text-zinc-900 dark:text-white transition-all shadow-sm active:scale-95">
              <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-400">
                Colección:
              </span>
              <span className="text-xs md:text-sm font-black uppercase tracking-tight truncate max-w-[140px] sm:max-w-[200px]">
                {categoriaActual?.nombre || slug}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="w-56 p-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl"
          >
            {categorias.map((c) => {
              const esActiva = c.slug === slug
              return (
                <DropdownMenuItem
                  key={c.slug}
                  onClick={() => navigate(`/categoria/${c.slug}`)}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-xl cursor-pointer ${
                    esActiva
                      ? "bg-fuchsia-600 text-white font-black"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <span className="truncate">{c.nombre}</span>
                  {esActiva && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>

          {/* BANNER LIMPIO SIN GRADIENTES OSCUROS */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
            <div className="relative w-full h-40 md:h-60 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-sm">
              {categoriaActual?.portada_url && (
                <img
                  src={normalizarImagenUrl(categoriaActual.portada_url)}
                  alt={categoriaActual.nombre}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* TÍTULO Y DETALLES QUE RESPONDEN AL MODO OSCURO Y CLARO */}
            <div className="pt-5 pb-2 flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  {productos.length} diseños disponibles
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter mt-2 leading-none">
                  {categoriaActual?.nombre || slug}
                </h2>
              </div>
            </div>
          </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        {cargando ? (
          /* SKELETONS INICIALES SHIMMER */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="relative aspect-[2/3] rounded-2xl bg-zinc-200/90 dark:bg-zinc-900 overflow-hidden border border-zinc-200 dark:border-white/5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-fuchsia-500/10 to-transparent animate-skeleton-shimmer" />
                <div className="absolute top-2 left-2 h-4 w-10 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                <div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-zinc-300 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              No hay productos disponibles en esta colección
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {prodsVisibles.map((item, index) => (
                <CardIMG
                  key={item.id}
                  id={item.id}
                  imagen={item.imagen}
                  priority={index < 16} // Las primeras 16 cargan con prioridad máxima inmediata
                  checked={seleccionados.includes(item.id)}
                  onToggleSeleccion={(checked) =>
                    toggleSeleccion(item.id, checked)
                  }
                  onClick={() => handleImageClick(item.id)}
                />
              ))}
            </div>

            {/* SENTINEL O BOTÓN DE CARGA */}
            {hayMas && (
              <div
                ref={sentinelRef}
                className="py-8 text-center flex flex-col items-center justify-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => setLimite((prev) => prev + BATCH_SIZE)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/30 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    Cargar más ({productos.length - limite} restantes)
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Suspense fallback={null}>
        {lightboxOpen && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            slides={lightboxImages}
            index={lightboxIndex}
            carousel={{ preload: 1 }}
          />
        )}
      </Suspense>
        </motion.div>
      </div>
    </SidebarProvider>
  )
}

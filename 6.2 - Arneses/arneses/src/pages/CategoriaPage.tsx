import { useState, useEffect, useRef, Suspense, lazy } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { getCategorias, getProductos } from "@/lib/api"
import { galeria } from "@/components/constants/galeria"
import type { Categoria, Producto } from "@/types/database"
import { useCart } from "@/context/CartContext"
import { CardIMG } from "@/components/Card-img"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, Sparkles } from "lucide-react"

const Lightbox = lazy(() => import("@/components/LightboxWrapper"))
const BATCH_SIZE = 12

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
    // Al cambiar de categoría, reseteamos el scroll y el lote
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
          // Fallback a galeria.ts filtrada
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

  // Scroll infinito con IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLimite((prev) => prev + BATCH_SIZE)
        }
      },
      { rootMargin: "300px" }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [productos, limite])

  const categoriaActual = categorias.find((c) => c.slug === slug)
  const prodsVisibles = productos.slice(0, limite)
  const hayMas = limite < productos.length

  const handleImageClick = (id: number) => {
    const slides = productos.map((img) => ({ src: img.imagen }))
    const idx = productos.findIndex((img) => img.id === id)
    setLightboxImages(slides)
    setLightboxIndex(idx >= 0 ? idx : 0)
    setTimeout(() => setLightboxOpen(true), 10)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.28, ease: "easeInOut" }}
      className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 pb-32 transition-colors duration-300"
    >
      {/* HEADER STICKY */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 px-4 md:px-8 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Colecciones</span>
        </button>

        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-400">
            Colección
          </span>
          <h1 className="text-sm md:text-base font-black uppercase tracking-tight truncate max-w-[200px] md:max-w-md">
            {categoriaActual?.nombre || slug}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>

      {/* BANNER HERMOSO DE LA CATEGORÍA */}
      <div className="relative w-full h-36 md:h-56 overflow-hidden bg-zinc-900">
        {categoriaActual?.portada_url && (
          <img
            src={categoriaActual.portada_url}
            alt={categoriaActual.nombre}
            className="w-full h-full object-cover opacity-75 dark:opacity-60 scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-black via-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 md:left-8 right-4 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
              {productos.length} modelos disponibles
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-lg mt-1">
              {categoriaActual?.nombre || slug}
            </h2>
          </div>
        </div>
      </div>

      {/* BARRA HORIZONTAL DE PILLS DE CATEGORÍAS (Para navegar rápido con el dedo) */}
      <div className="w-full overflow-x-auto no-scrollbar py-3 px-4 md:px-8 border-b border-zinc-200 dark:border-white/5 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md sticky top-[57px] z-30">
        <div className="flex gap-2 min-w-max">
          {categorias.map((c) => (
            <Link
              key={c.slug}
              to={`/categoria/${c.slug}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                c.slug === slug
                  ? "bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30 scale-105"
                  : "bg-zinc-200/70 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              {c.nombre}
            </Link>
          ))}
        </div>
      </div>

      {/* CONTENEDOR DE PRODUCTOS */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        {cargando ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] rounded-xl bg-zinc-200 dark:bg-zinc-900 animate-pulse"
              />
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
              {prodsVisibles.map((item) => (
                <CardIMG
                  key={item.id}
                  id={item.id}
                  imagen={item.imagen}
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
  )
}

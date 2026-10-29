import { useState, useEffect, useRef, Suspense, lazy } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { galeria } from "@/components/constants/galeria"
import { getCategorias, getProductos } from "@/lib/api"
import type { Categoria, Producto } from "@/types/database"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CardIMG } from "@/components/Card-img"
import { ChevronDown, Sparkles } from "lucide-react"

const Lightbox = lazy(() => import("@/components/LightboxWrapper"))

interface CatalogoProps {
  seleccionados: number[]
  onToggleSeleccion: (id: number, checked: boolean) => void
}

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

const BATCH_SIZE = 12

export function Catalogo({ seleccionados, onToggleSeleccion }: CatalogoProps) {
  const [categorias, setCategorias] = useState<Categoria[]>(CATEGORIAS_FALLBACK)
  const [productos, setProductos] = useState<Producto[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [open, setOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<{ src: string }[]>([])
  const [index, setIndex] = useState(0)

  // Control de carga progresiva por categoría abierta
  const [limiteVisible, setLimiteVisible] = useState<Record<string, number>>({})
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          getCategorias(false),
          getProductos(),
        ])
        if (cats && cats.length > 0) {
          setCategorias(cats)
        }
        if (prods && prods.length > 0) {
          setProductos(prods)
        } else {
          setProductos(galeria as Producto[])
        }
      } catch (err) {
        console.error("Error al cargar catálogo desde Supabase:", err)
        setProductos(galeria as Producto[])
      }
    }
    fetchData()
  }, [])

  // Auto-cargar más imágenes cuando scrollea cerca del final
  useEffect(() => {
    if (!sentinelRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLimiteVisible((prev) => {
            const actual = prev[activeCategory] || BATCH_SIZE
            return { ...prev, [activeCategory]: actual + BATCH_SIZE }
          })
        }
      },
      { rootMargin: "250px" }
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [activeCategory])

  const handleImageClick = (categoriaSlug: string, id: number) => {
    const filtradas = productos.filter((img) => img.categoria === categoriaSlug)
    const slides = filtradas.map((img) => ({ src: img.imagen }))
    const idx = filtradas.findIndex((img) => img.id === id)

    setLightboxImages(slides)
    setIndex(idx >= 0 ? idx : 0)
    setTimeout(() => setOpen(true), 10)
  }

  return (
    <div className="w-full">
      <Accordion
        type="single"
        collapsible
        className="flex flex-col gap-5 w-full border-none"
        value={activeCategory}
        onValueChange={(value) => {
          setActiveCategory(value || "")
          // Inicializamos el límite del lote al abrir
          if (value && !limiteVisible[value]) {
            setLimiteVisible((prev) => ({ ...prev, [value]: BATCH_SIZE }))
          }
        }}
      >
        {categorias.map((categoria, idx) => {
          const itemValue = `item-${idx}`
          const isOpen = activeCategory === itemValue
          const prodsDeCategoria = productos.filter(
            (item) => item.categoria === categoria.slug
          )

          const cantidadAMostrar = limiteVisible[itemValue] || BATCH_SIZE
          const prodsVisibles = prodsDeCategoria.slice(0, cantidadAMostrar)
          const hayMas = cantidadAMostrar < prodsDeCategoria.length

          return (
            <AccordionItem
              key={itemValue}
              value={itemValue}
              className="border-none w-full"
            >
              {/* HEADER DEL ACORDEÓN MEJORADO VISUALMENTE */}
              <AccordionTrigger className="relative h-32 md:h-52 rounded-2xl overflow-hidden p-0 hover:no-underline group [&>svg]:hidden shadow-lg border border-zinc-200/50 dark:border-white/5 active:scale-[0.99] transition-all">
                {categoria.portada_url && (
                  <img
                    src={categoria.portada_url}
                    alt={categoria.nombre}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-65 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
                {/* Gradiente profundo con toque fuchsia sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent dark:from-black/90 dark:via-black/50" />

                <div className="relative z-10 px-5 md:px-8 flex justify-between items-center w-full">
                  <div className="text-left space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-fuchsia-400 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-fuchsia-500/20">
                        {prodsDeCategoria.length} diseños
                      </span>
                    </div>
                    <h4 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-md">
                      {categoria.nombre}
                    </h4>
                  </div>

                  <div
                    className={`h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 ${
                      isOpen
                        ? "rotate-180 bg-fuchsia-600/80 border-fuchsia-400"
                        : "group-hover:bg-white/20"
                    }`}
                  >
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-4 overflow-visible">
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="max-h-[70vh] overflow-y-auto overscroll-contain pr-1 space-y-4"
                    >
                      {/* GRILLA MOBILE-FIRST (2 columnas en celular, 3 en tablet, 4-5 en desktop) */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-1">
                        {prodsVisibles.map((item) => (
                          <CardIMG
                            key={item.id}
                            id={item.id}
                            imagen={item.imagen}
                            checked={seleccionados.includes(item.id)}
                            onToggleSeleccion={(checked) =>
                              onToggleSeleccion(item.id, checked)
                            }
                            onClick={() =>
                              handleImageClick(categoria.slug, item.id)
                            }
                          />
                        ))}
                      </div>

                      {/* DETECTOR DE SCROLL PARA CARGA DEL SIGUIENTE LOTE */}
                      {hayMas && (
                        <div
                          ref={sentinelRef}
                          className="py-4 text-center flex flex-col items-center justify-center gap-2"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setLimiteVisible((prev) => ({
                                ...prev,
                                [itemValue]: cantidadAMostrar + BATCH_SIZE,
                              }))
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/30 text-xs font-bold uppercase tracking-wider transition-all"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>
                              Cargar más modelos (
                              {prodsDeCategoria.length - cantidadAMostrar} restantes)
                            </span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <Suspense fallback={null}>
        {open && (
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={lightboxImages}
            index={index}
            carousel={{ preload: 1 }}
          />
        )}
      </Suspense>
    </div>
  )
}

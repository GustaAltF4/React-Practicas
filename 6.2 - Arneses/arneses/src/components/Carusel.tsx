import { useState, useEffect, lazy, Suspense } from "react"
import { galeria } from "./constants/galeria"
import { supabase } from "@/lib/supabaseClient"
import type { Producto } from "@/types/database"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { normalizarImagenUrl } from "@/lib/utils"
import { useCart } from "@/context/CartContext"
import { Flame, Check, Plus, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react"

const Lightbox = lazy(() => import("@/components/LightboxWrapper"))

// Fallbacks variados cubriendo todas las categorías clave
const PRODUCTOS_FALLBACK = [17, 37, 62, 123, 150, 180, 200, 210]

export function MyCarousel() {
  const { seleccionados, toggleSeleccion } = useCart()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const [destacados, setDestacados] = useState<Producto[]>(() =>
    galeria.filter((item) => PRODUCTOS_FALLBACK.includes(item.id)) as Producto[]
  )

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const { data, error } = await supabase
          .from("arneses_productos")
          .select("*")
          .eq("destacado", true)
          .eq("activo", true)

        if (!error && data && data.length > 0) {
          setDestacados(data)
        }
      } catch (err) {
        console.error("Error al cargar carrusel:", err)
      }
    }

    fetchDestacados()
  }, [])

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api, destacados])

  const abrirFoto = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const slidesParaLightbox = destacados.map((p) => ({
    src: normalizarImagenUrl(p.imagen),
    alt: `Arnés #${p.id} - ${p.categoria}`,
  }))

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2">
      {/* HEADER DE CONTROL Y BOTONES DE NAVEGACIÓN */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-fuchsia-600 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
            Piezas más elegidas ({destacados.length})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => api?.scrollPrev()}
            aria-label="Anterior"
            className="h-9 w-9 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-fuchsia-600 hover:text-white dark:hover:bg-fuchsia-600 dark:hover:text-white transition-all active:scale-90 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            aria-label="Siguiente"
            className="h-9 w-9 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-fuchsia-600 hover:text-white dark:hover:bg-fuchsia-600 dark:hover:text-white transition-all active:scale-90 shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CAROUSEL CON ASPECT VERTICAL FASHION Y PEEK MULTI-ITEM */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4500,
            stopOnInteraction: true,
          }),
        ]}
        className="w-full relative"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {destacados.map((item, index) => {
            const estaSeleccionado = seleccionados.includes(item.id)

            return (
              <CarouselItem
                key={item.id}
                className="pl-3 md:pl-4 basis-[78%] xs:basis-[68%] sm:basis-[48%] md:basis-[32%] lg:basis-[24%]"
              >
                <div
                  onClick={() => abrirFoto(index)}
                  className="group relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-md hover:shadow-xl hover:shadow-fuchsia-500/10 transition-all duration-300 cursor-pointer select-none"
                >
                  {/* IMAGEN DEL PRODUCTO CON ZOOM ON HOVER */}
                  <img
                    src={normalizarImagenUrl(item.imagen)}
                    alt={`Arnés #${item.id}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* BADGES SUPERIORES FLOTANTES */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-20 pointer-events-none">
                    {/* BADGE DESTACADO / ID */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 dark:bg-black/75 backdrop-blur-md border border-white/15 text-white shadow-md">
                      <Flame className="w-3.5 h-3.5 text-fuchsia-400 fill-fuchsia-400" />
                      <span className="text-[11px] font-black tracking-wider uppercase">
                        #{item.id}
                      </span>
                    </div>

                    {/* BOTÓN RÁPIDO DE CARRITO / SELECCIÓN DIRECTA */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSeleccion(item.id, !estaSeleccionado)
                      }}
                      aria-label={estaSeleccionado ? "Quitar del encargo" : "Sumar al encargo"}
                      className={`pointer-events-auto h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-85 shadow-lg ${
                        estaSeleccionado
                          ? "bg-fuchsia-600 text-white border-2 border-white/80 ring-2 ring-fuchsia-500/50 scale-105"
                          : "bg-black/60 dark:bg-black/80 text-white/90 hover:text-white border border-white/20 hover:bg-fuchsia-600"
                      }`}
                    >
                      {estaSeleccionado ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </button>
                  </div>

                  {/* PILL INFERIOR CON CATEGORÍA Y BOTÓN DE ZOOM */}
                  <div className="absolute inset-x-0 bottom-0 p-3 pt-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between z-10">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400 drop-shadow-sm">
                        Colección
                      </span>
                      <h4 className="text-xs font-black uppercase text-white tracking-wide truncate max-w-[130px] drop-shadow-sm">
                        {item.categoria}
                      </h4>
                    </div>

                    <div className="h-7 w-7 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 group-hover:bg-fuchsia-600 group-hover:text-white transition-colors">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      {/* INDICADORES (DOTS CON ACTIVE PILL ANIMADO) */}
      {count > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-5">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Ir a la diapositiva ${i + 1}`}
              className={`h-2 transition-all duration-300 rounded-full ${
                current === i
                  ? "w-7 bg-fuchsia-600 shadow-sm shadow-fuchsia-600/50"
                  : "w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>
      )}

      {/* LIGHTBOX DE PANTALLA COMPLETA */}
      <Suspense fallback={null}>
        {lightboxOpen && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={slidesParaLightbox}
            carousel={{ preload: 1 }}
          />
        )}
      </Suspense>
    </div>
  )
}

import { useState, useEffect } from "react"
import { galeria } from "./constants/galeria"
import { supabase } from "@/lib/supabaseClient"
import type { Producto } from "@/types/database"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { normalizarImagenUrl } from "@/lib/utils"

const PRODUCTOS_FALLBACK = [62, 123, 17, 37, 55]

export function MyCarousel() {
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

  return (
    <div className="w-full flex justify-center py-4 bg-transparent">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: true,
          }),
        ]}
        className="w-full max-w-sm relative"
      >
        <CarouselContent className="-ml-1">
          {destacados.map((item, index) => (
            <CarouselItem key={index} className="pl-1 basis-full">
              <div className="relative aspect-[4/2] overflow-hidden rounded-[0.5rem] bg-transparent shadow-none border-none">
                {/* Badge de ID Estilo Glass Minimalista */}
                <div className="absolute top-4 left-4 z-20 backdrop-blur-md bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/10 uppercase tracking-wider">
                  Mod. {item.id}
                </div>

                {/* IMAGEN */}
                <img
                  src={normalizarImagenUrl(item.imagen)}
                  alt={`Producto ${item.id}`}
                  className="object-cover h-full w-full rounded-[0.5rem]"
                />

                {/* Gradiente inferior */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 rounded-b-[0.5rem] pointer-events-none" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="absolute left-3 top-1/2 -translate-y-1/2 border-none bg-transparent hover:bg-transparent text-white/70 hover:text-white transition-all duration-300 z-30 h-16 w-16 shadow-none flex items-center justify-center p-0"
          variant="ghost"
        />
        <CarouselNext
          className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent hover:bg-transparent text-white/70 hover:text-white transition-all duration-300 z-30 h-16 w-16 shadow-none flex items-center justify-center p-0"
          variant="ghost"
        />
      </Carousel>
    </div>
  )
}

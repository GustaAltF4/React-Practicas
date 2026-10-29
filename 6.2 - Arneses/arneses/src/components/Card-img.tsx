import { memo, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"

interface ImageCardProps {
  id: number
  imagen: string
  onClick?: () => void
  checked?: boolean
  onToggleSeleccion: (checked: boolean) => void
}

export const CardIMG = memo(function CardIMG({
  id,
  imagen,
  onClick,
  checked,
  onToggleSeleccion,
}: ImageCardProps) {
  const [cargada, setCargada] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`
        relative aspect-[2/3] w-full overflow-hidden rounded-xl
        border transition-all duration-300
        ${
          checked
            ? "border-fuchsia-600 shadow-md shadow-fuchsia-600/20 ring-1 ring-fuchsia-500/50"
            : "border-zinc-200/80 dark:border-white/10 hover:border-fuchsia-500/40"
        }
        bg-zinc-100 dark:bg-zinc-900
        content-visibility-auto
        will-change-transform
        active:scale-[0.98]
      `}
    >
      {/* Skeleton / Shimmer mientras descarga la foto */}
      {!cargada && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 animate-pulse flex items-center justify-center">
          <span className="text-[10px] font-black text-fuchsia-600/40 uppercase tracking-widest">
            #{id}
          </span>
        </div>
      )}

      {/* Badge de Modelo - Ahora visible en Mobile de forma glass minimalista */}
      <div className="absolute top-2 left-2 z-10 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-black/60 dark:bg-black/70 backdrop-blur-md text-white border border-white/10 shadow-sm pointer-events-none">
        #{id}
      </div>

      {/* Checkbox táctil agrandado para dedos en mobile */}
      <div className="absolute top-1.5 right-1.5 z-20 p-1">
        <Checkbox
          checked={checked}
          onCheckedChange={(val) => onToggleSeleccion(!!val)}
          className={`
            h-7 w-7 rounded-full border-2 transition-transform duration-200 active:scale-75 shadow-md
            ${
              checked
                ? "bg-fuchsia-600 border-fuchsia-600 ring-2 ring-white/50 dark:ring-black/50"
                : "bg-black/50 border-white/60 dark:bg-black/60 dark:border-white/40"
            }
          `}
        />
      </div>

      {/* Contenedor de Imagen clickeable */}
      <div
        className="w-full h-full cursor-pointer touch-manipulation"
        onClick={onClick}
      >
        <img
          src={imagen}
          alt={`Arnés Modelo ${id}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setCargada(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={`
            h-full w-full object-cover transition-all duration-500
            ${cargada ? "opacity-100 scale-100" : "opacity-0 scale-105"}
            ${checked ? "scale-[1.03]" : ""}
            hover:scale-105
          `}
        />
      </div>

      {/* Overlay sutil al estar seleccionado */}
      <div
        className={`
          absolute inset-0 pointer-events-none
          bg-fuchsia-600/10 dark:bg-fuchsia-600/15
          transition-opacity duration-200
          ${checked ? "opacity-100" : "opacity-0"}
        `}
      />
    </motion.div>
  )
})

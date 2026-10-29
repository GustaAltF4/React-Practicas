import { memo, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { normalizarImagenUrl } from "@/lib/utils"
import { Sparkles } from "lucide-react"

interface ImageCardProps {
  id: number
  imagen: string
  onClick?: () => void
  checked?: boolean
  onToggleSeleccion: (checked: boolean) => void
  priority?: boolean
}

export const CardIMG = memo(function CardIMG({
  id,
  imagen,
  onClick,
  checked,
  onToggleSeleccion,
  priority = false,
}: ImageCardProps) {
  const [cargada, setCargada] = useState(false)
  const urlFinal = normalizarImagenUrl(imagen)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`
        relative aspect-[2/3] w-full overflow-hidden rounded-2xl
        border transition-all duration-300
        ${
          checked
            ? "border-fuchsia-600 shadow-lg shadow-fuchsia-600/25 ring-2 ring-fuchsia-500/60"
            : "border-zinc-200 dark:border-white/10 hover:border-fuchsia-500/40"
        }
        bg-zinc-100 dark:bg-zinc-950
        content-visibility-auto
        will-change-transform
        active:scale-[0.98]
      `}
    >
      {/* SKELETON SHIMMER PRO CON HAZ DE LUZ FUCHSIA */}
      {!cargada && (
        <div className="absolute inset-0 bg-zinc-200/90 dark:bg-zinc-900 overflow-hidden flex flex-col items-center justify-center">
          {/* Haz de luz animado */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 dark:via-fuchsia-500/15 to-transparent animate-skeleton-shimmer" />

          {/* Icono central de carga con pulso */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 opacity-40">
            <div className="h-7 w-7 rounded-lg bg-fuchsia-600/20 text-fuchsia-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
              #{id}
            </span>
          </div>
        </div>
      )}

      {/* Badge de Modelo */}
      <div className="absolute top-2.5 left-2.5 z-10 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-black/60 dark:bg-black/75 backdrop-blur-md text-white border border-white/10 shadow-sm pointer-events-none">
        #{id}
      </div>

      {/* Checkbox táctil con área de toque ampliada para celular (48x48px) */}
      <div
        className="absolute top-0 right-0 z-20 min-w-[48px] min-h-[48px] p-2.5 flex items-start justify-end cursor-pointer touch-manipulation"
        onClick={(e) => {
          e.stopPropagation()
          onToggleSeleccion(!checked)
        }}
      >
        <Checkbox
          checked={checked}
          className={`
            h-7 w-7 rounded-full border-2 transition-transform duration-200 active:scale-75 shadow-md pointer-events-none
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
          src={urlFinal}
          alt={`Arnés Modelo ${id}`}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          {...(priority ? ({ fetchpriority: "high" } as any) : {})}
          onLoad={() => setCargada(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={`
            h-full w-full object-cover transition-all duration-500 ease-out
            ${
              cargada
                ? "opacity-100 scale-100 blur-0"
                : "opacity-0 scale-105 blur-sm"
            }
            ${checked ? "scale-[1.03]" : ""}
            hover:scale-105
          `}
        />
      </div>

      {/* Overlay al seleccionar */}
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

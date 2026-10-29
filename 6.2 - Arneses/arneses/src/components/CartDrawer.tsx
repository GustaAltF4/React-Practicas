import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Trash2, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { galeria } from "@/components/constants/galeria"
import { getProductos } from "@/lib/api"
import type { Producto } from "@/types/database"
import { normalizarImagenUrl } from "@/lib/utils"

export function CartDrawer() {
  const { seleccionados, toggleSeleccion, limpiarCarrito } = useCart()
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [nota, setNota] = useState("")
  const [todosLosProductos, setTodosLosProductos] = useState<Producto[]>([])

  useEffect(() => {
    const fetchProds = async () => {
      try {
        const prods = await getProductos()
        if (prods && prods.length > 0) {
          setTodosLosProductos(prods)
        } else {
          setTodosLosProductos(galeria as Producto[])
        }
      } catch (e) {
        setTodosLosProductos(galeria as Producto[])
      }
    }
    fetchProds()
  }, [])

  const itemsEnCarrito = seleccionados
    .map((id) => todosLosProductos.find((p) => p.id === id))
    .filter(Boolean) as Producto[]

  const handleEnviarWhatsApp = () => {
    if (seleccionados.length === 0) return

    let mensaje = `Hola! `
    if (nombre.trim()) {
      mensaje += `Soy *${nombre.trim()}*. `
    }
    mensaje += `Quería consultar y encargar los siguientes arneses del catálogo:\n\n`

    itemsEnCarrito.forEach((item) => {
      mensaje += `• *Modelo #${item.id}* (${item.categoria})\n`
    })

    if (nota.trim()) {
      mensaje += `\n💬 *Medidas / Consulta:* ${nota.trim()}`
    }

    const url = `https://api.whatsapp.com/send?phone=+5492613861336&text=${encodeURIComponent(
      mensaje
    )}`

    window.open(url, "_blank")
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* BOTÓN FLOTANTE TRIGGER */}
      <SheetTrigger asChild>
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
          <motion.div
            whileTap={{ scale: 0.93 }}
            animate={
              seleccionados.length > 0
                ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }
                : {}
            }
            transition={{ duration: 0.35 }}
          >
            <Button className="h-14 md:h-16 px-5 md:px-7 rounded-2xl bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-zinc-200 dark:border-fuchsia-500/30 hover:border-fuchsia-500 hover:bg-fuchsia-600/10 transition-all flex gap-3 md:gap-4 shadow-2xl group active:scale-95 text-zinc-900 dark:text-white">
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
                {seleccionados.length > 0
                  ? `Carrito (${seleccionados.length})`
                  : "Carrito"}
              </span>
            </Button>
          </motion.div>
        </div>
      </SheetTrigger>

      {/* CONTENIDO DEL DRAWER */}
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-0 flex flex-col justify-between"
      >
        {/* HEADER */}
        <SheetHeader className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-fuchsia-600/10 text-fuchsia-600 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <SheetTitle className="text-lg font-black uppercase tracking-tight">
                  Tu Selección
                </SheetTitle>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {seleccionados.length} {seleccionados.length === 1 ? "diseño elegido" : "diseños elegidos"}
                </p>
              </div>
            </div>

            {seleccionados.length > 0 && (
              <button
                onClick={limpiarCarrito}
                className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-red-500 transition-colors"
              >
                Vaciar
              </button>
            )}
          </div>
        </SheetHeader>

        {/* LISTADO DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {itemsEnCarrito.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 text-zinc-400">
              <ShoppingCart className="w-12 h-12 stroke-[1.2] opacity-40 mb-3" />
              <p className="text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Tu carrito está vacío
              </p>
              <p className="text-xs text-zinc-500 mt-1 max-w-[220px]">
                Tildá los modelos que te gusten en el catálogo para agregarlos acá.
              </p>
            </div>
          ) : (
            itemsEnCarrito.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/60 shadow-sm"
              >
                {/* Miniatura */}
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-950 shrink-0">
                  <img
                    src={normalizarImagenUrl(item.imagen)}
                    alt={`Modelo ${item.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400">
                    {item.categoria}
                  </span>
                  <h4 className="text-sm font-black uppercase text-zinc-900 dark:text-white truncate">
                    Modelo #{item.id}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Talle regulable a medida
                  </p>
                </div>

                {/* Quitar */}
                <button
                  onClick={() => toggleSeleccion(item.id, false)}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Quitar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* FOOTER CHECKOUT */}
        {itemsEnCarrito.length > 0 && (
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 backdrop-blur-md space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Tu Nombre (opcional)
              </label>
              <Input
                placeholder="Ej: Sofía"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Talle o Medidas (opcional)
              </label>
              <Input
                placeholder="Ej: Contorno de pecho 85cm..."
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs rounded-xl"
              />
            </div>

            <Button
              onClick={handleEnviarWhatsApp}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-600/20 gap-2 text-xs active:scale-[0.98] mt-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Pedir por WhatsApp ({seleccionados.length})</span>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

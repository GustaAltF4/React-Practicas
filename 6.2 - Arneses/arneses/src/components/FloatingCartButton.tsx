import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function FloatingCartButton() {
  const { seleccionados, comprar } = useCart()

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
      <motion.div
        whileTap={{ scale: 0.94 }}
        animate={seleccionados.length > 0 ? { scale: [1, 1.06, 1] } : {}}
        transition={{ duration: 0.25 }}
      >
        <Button
          onClick={comprar}
          className="h-14 md:h-16 px-6 md:px-8 rounded-2xl bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border border-zinc-200 dark:border-fuchsia-500/30 hover:border-fuchsia-500 hover:bg-fuchsia-600/10 transition-all flex gap-3 md:gap-4 shadow-2xl group active:scale-95 text-zinc-900 dark:text-white"
        >
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
              ? `Comprar (${seleccionados.length})`
              : "Comprar"}
          </span>
        </Button>
      </motion.div>
    </div>
  )
}

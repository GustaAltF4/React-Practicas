import React, { createContext, useContext, useState } from "react"
import { Alerta } from "@/components/Alert"

interface CartContextType {
  seleccionados: number[]
  toggleSeleccion: (id: number, checked: boolean) => void
  comprar: () => void
  limpiarCarrito: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [seleccionados, setSeleccionados] = useState<number[]>([])
  const [showAlerta, setShowAlerta] = useState(false)

  const toggleSeleccion = (id: number, checked: boolean) => {
    setSeleccionados((prev) =>
      checked ? [...prev, id] : prev.filter((n) => n !== id)
    )
  }

  const limpiarCarrito = () => {
    setSeleccionados([])
  }

  const comprar = () => {
    if (seleccionados.length === 0) {
      setShowAlerta(true)
      return
    }

    const mensaje = `Hola, quería comprar el/los producto(s) número(s): ${seleccionados.join(" - ")}`
    const url = `https://api.whatsapp.com/send?phone=+5492613861336&text=${encodeURIComponent(mensaje)}`
    window.open(url, "_blank")

    setTimeout(() => {
      setSeleccionados([])
    }, 1500)
  }

  return (
    <CartContext.Provider
      value={{ seleccionados, toggleSeleccion, comprar, limpiarCarrito }}
    >
      {children}
      <Alerta open={showAlerta} onOpenChange={setShowAlerta} />
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider")
  }
  return context
}

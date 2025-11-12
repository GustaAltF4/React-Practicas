import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"

export function DialogM({ onGastoGuardado }: { onGastoGuardado: () => void }) {
  const [monto, setMonto] = useState(0)
  const [tipoGasto, setTipoGasto] = useState("")
  const [tipoPlata, setTipoPlata] = useState("")
  const [dias, setDias] = useState(1) // 👈 cantidad de días (por defecto 1)
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!monto || !tipoGasto || !tipoPlata) {
      alert("Completa todos los campos")
      return
    }

    // Calcular monto total (multiplica por días solo si es estadía)
    const montoFinal = tipoGasto === "Estadia" ? monto * dias : monto

    // Obtener gastos existentes
    const gastos = JSON.parse(localStorage.getItem("gastos") || "[]")

    // Calcular nuevo total
    let totalRestante = 0
    if (tipoPlata === "Plata Argentina") {
      const actual = parseFloat(localStorage.getItem("plataArgentina") || "0")
      totalRestante = actual - montoFinal
      localStorage.setItem("plataArgentina", totalRestante.toString())
    } else if (tipoPlata === "Plata Chilena") {
      const actual = parseFloat(localStorage.getItem("plataChilena") || "0")
      totalRestante = actual - montoFinal
      localStorage.setItem("plataChilena", totalRestante.toString())
    }

    // Guardar el gasto
    const nuevoGasto = {
      fecha: new Date().toLocaleDateString(),
      tipoGasto,
      monto: montoFinal,
      tipoPlata,
      dias: tipoGasto === "Estadia" ? dias : undefined, // 👈 solo guarda si aplica
      totalRestante,
    }

    gastos.push(nuevoGasto)
    localStorage.setItem("gastos", JSON.stringify(gastos))

    onGastoGuardado()
    setMonto(0)
    setTipoGasto("")
    setTipoPlata("")
    setDias(1)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="p-8 mt-6 text-4xl">
          ✚ Agregar Gasto
        </Button>
      </DialogTrigger>
      <DialogTitle className="hidden">Agregar Gasto</DialogTitle>
      <DialogDescription className="hidden"></DialogDescription>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Monto */}
          <div className="grid gap-3">
            <Label className="text-2xl">¿Cuánto gastaste?</Label>
            <Input
              className="!text-2xl"
              type="number"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
            />
          </div>

          {/* Tipo de gasto */}
          <div className="grid gap-3">
            <Label className="text-2xl">¿En qué lo gastaste?</Label>
            <Select
              onValueChange={(value) => {
                setTipoGasto(value)
                if (value !== "Estadia") setDias(1) // resetea si no es estadía
              }}
            >
              <SelectTrigger className="w-full text-2xl">
                <SelectValue placeholder="Tipo de gasto" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Peaje" className="text-2xl">
                    Peaje
                  </SelectItem>
                  <SelectItem value="Fitosanitario" className="text-2xl">
                    Fitosanitario
                  </SelectItem>
                  <SelectItem value="Playa" className="text-2xl">
                    Playa
                  </SelectItem>
                  <SelectItem value="Aduana pago" className="text-2xl">
                    Aduana pago
                  </SelectItem>
                  <SelectItem value="Combustible" className="text-2xl">
                    Combustible
                  </SelectItem>
                  <SelectItem value="Gastos de repuestos" className="text-2xl">
                    Gastos de repuestos
                  </SelectItem>
                  <SelectItem value="Gastos del camion" className="text-2xl">
                    Gastos del camión
                  </SelectItem>
                  <SelectItem value="Estadia" className="text-2xl">
                    Estadía
                  </SelectItem>
                  <SelectItem value="Comida" className="text-2xl">
                    Comida
                  </SelectItem>
                  <SelectItem value="Otro" className="text-2xl">
                    Otro
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Solo aparece si es estadía */}
          {tipoGasto === "Estadia" && (
            <div className="grid gap-3">
              <Label className="text-2xl">¿Cuántos días?</Label>
              <Input
                className="!text-2xl"
                type="number"
                min={1}
                value={dias}
                onChange={(e) => setDias(Number(e.target.value))}
              />
            </div>
          )}

          {/* Tipo de plata */}
          <div className="grid gap-3">
            <Label className="text-2xl">¿Con qué dinero?</Label>
            <Select onValueChange={setTipoPlata}>
              <SelectTrigger className="w-full text-2xl">
                <SelectValue placeholder="Selecciona la moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Plata Argentina" className="text-2xl">
                    Plata Argentina
                  </SelectItem>
                  <SelectItem value="Plata Chilena" className="text-2xl">
                    Plata Chilena
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="text-2xl h-12"
              type="button"
              onClick={() => setOpen(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button className="text-2xl h-12" type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

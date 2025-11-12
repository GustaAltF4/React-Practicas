import { ThemeProvider } from "@/components/theme-provider"
import { Menu } from "./components/menu"
import { Input } from "./components/ui/input"
import { useState } from "react"
import { Button } from "./components/ui/button"
import { DialogM } from "./components/dialog"
import { useEffect } from "react"
import { ExportPDF } from "./components/ExportPDF"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Truck } from "lucide-react"
import { Separator } from "./components/ui/separator"
export function Contenido() {
  const [plataChilena, setPlataChilena] = useState(0)
  const [plataArgentina, setPlataArgentina] = useState(0)
  const [gastos, setGastos] = useState<any[]>([])
  const [guardado, setGuardado] = useState(false)
  const [name, setName] = useState(localStorage.getItem("nombre") || "")
  const [destino, setDestino] = useState(localStorage.getItem("destino") || "")


  useEffect(() => {
    const ch = localStorage.getItem("plataChilena")
    const ar = localStorage.getItem("plataArgentina")
    if (ch && ar) {
      setPlataChilena(parseFloat(ch))
      setPlataArgentina(parseFloat(ar))
      setGuardado(true)
    }

    const gs = JSON.parse(localStorage.getItem("gastos") || "[]")
    setGastos(gs)
  }, [])

  const guardar = () => {
    localStorage.setItem("plataChilena", plataChilena.toString())
    localStorage.setItem("plataArgentina", plataArgentina.toString())
    localStorage.setItem("nombre", name)
    localStorage.setItem("destino", destino)
    setGuardado(true)
    if (!localStorage.getItem("plataArgentinaInicial"))
      localStorage.setItem("plataArgentinaInicial", plataArgentina.toString())

    if (!localStorage.getItem("plataChilenaInicial"))
      localStorage.setItem("plataChilenaInicial", plataChilena.toString())
  }

  const reset = () => {
    const confirmado = window.confirm("¿Estás seguro que querés reiniciar todo? Esto borrará la plata y los gastos.")
    if (!confirmado) return

    localStorage.clear()
    setPlataChilena(0)
    setPlataArgentina(0)
    setName("")
    setDestino("")
    setGastos([])
    setGuardado(false)
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Menu />
      <div className="flex justify-center items-center flex-col p-4 gap-2 mt-8 text-center">


        <h1 className="text-5xl font-bold ">Plata para el viaje </h1>
        <Truck />
        <h1 className="text-4xl">🪙 CLP: <strong className="text-cyan-600">${plataChilena}</strong></h1>
        <h1 className="text-4xl">🪙 ARS: <strong className="text-cyan-600">${plataArgentina}</strong></h1>
        {!guardado && (
          <>
            <p className="text-xl text-gray-500 text-center ">Ingresa la plata con la que arrancás el viaje en pesos chilenos y argentinos</p>
            <span className="text-2xl text-gray-400 font-bold">Chilena</span>
            <Input
              type="number"
              className="w-[50%] h-10 text-3xl "
              placeholder="plata chilena"
              value={plataChilena}
              onChange={(e) => setPlataChilena(Number(e.target.value))}
            />
            <span className="text-2xl text-gray-400 font-bold">Argentina</span>
            <Input
              type="number"
              className="w-[50%] h-10 text-3xl"
              placeholder="plata argentina"
              value={plataArgentina}
              onChange={(e) => setPlataArgentina(Number(e.target.value))}
            />
            <p className="text-xl text-gray-500 text-center ">
              Ahora ingresa Nombre del chofer y destino del viaje para poder agregarlo al resumen final del viaje</p>
            <Input
              type="text" className="w-[50%] h-10 text-3xl" placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)} />
            <Input
              type="text" className="w-[50%] h-10 text-3xl" placeholder="Destino"
              value={destino}
              onChange={(e) => setDestino(e.target.value)} />

            <Button onClick={guardar} className="mt-8 p-8 text-4xl">💾 Guardar</Button>
          </>
        )}

        {guardado && (
          <>
            <DialogM onGastoGuardado={() => window.location.reload()} />
            <Button variant={"destructive"} onClick={reset} className="pt-7 pb-7 mt-3  text-4xl">🔃 Reiniciar </Button>

            <Separator className="my-4" />
            <div className="text-3xl text-center ">
              <h2 className="mb-4">📋 Gastos registrados</h2>

              {gastos.length === 0 ? (
                <p className="text-2xl text-pink-800">No hay gastos todavía.</p>
              ) : (

                <Table className="w-full ">
                  <TableHeader>
                    <TableRow className="bg-gray-300 dark:bg-gray-700">
                      <TableHead>Fecha 📅</TableHead>
                      <TableHead>Tipo de Gasto 📊</TableHead>
                      <TableHead >Monto 💰</TableHead>
                      <TableHead>Tipo plata 💱</TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gastos.map((g, i) => (
                      <TableRow key={i}>
                        <TableCell>{g.fecha}</TableCell>
                        <TableCell className="font-bold">
                          {g.tipoGasto}
                          {g.dias && (
                            <div className="text-sm text-gray-400">
                              {g.dias} día{g.dias > 1 ? "s" : ""}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>$ {g.monto}</TableCell>
                        <TableCell>{g.tipoPlata}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>

              )}
            </div>

            <ExportPDF />
          </>
        )}

      </div>

    </ThemeProvider>

  )
}



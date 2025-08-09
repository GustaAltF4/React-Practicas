import { useState } from "react"
import { galeria } from "@/components/constants/galeria"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CardIMG } from "@/components/Card-img"

import Lightbox from "yet-another-react-lightbox"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"

interface CatalogoProps {
  seleccionados: number[];
  onToggleSeleccion: (id: number, checked: boolean) => void;
}
export function Catalogo({ seleccionados, onToggleSeleccion }: CatalogoProps) {
  const categorias = [
    { label: "Cola & ligas", value: "cola y ligas" },
    { label: "Pecho", value: "pecho" },
    { label: "Cuerpo Completo & Conjuntos", value: "cuerpo completo" },
    { label: "Gargantillas", value: "gargantillas" },
    { label: "Hombre", value: "hombre" },
  ]

  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [imagenes, setImagenes] = useState<{ src: string }[]>([]);

  const handleImageClick = (categoriaValue: string, id: number) => {
    const imgsCategoria = galeria
      .filter((img) => img.categoria === categoriaValue)
      .map((img) => ({ src: img.imagen }))
    const idx = galeria
      .filter((img) => img.categoria === categoriaValue)
      .findIndex((img) => img.id === id)

    setImagenes(imgsCategoria)
    setIndex(idx)
    setOpen(true)
  }



  return (
    <>
    <div className="w-full ">
      <Accordion type="single" collapsible className="w-full ">
        {categorias.map((categoria, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="custom1 text-black dark:text-white hover:text-pink-800 dark:hover:text-pink-600">
              {categoria.label}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <ScrollArea className="h-[50vh]  overflow-y-auto ">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                  {galeria
                    .filter((item) => item.categoria === categoria.value)
                    .map((item) => (
                      <CardIMG
                        key={item.id}
                        id={item.id}
                        imagen={item.imagen}
                        onClick={() => handleImageClick(categoria.value, item.id)}
                        checked={seleccionados.includes(item.id)}
                        onCheckChange={(checked) => onToggleSeleccion(item.id, checked)}
                      />
                    ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={imagenes}
        index={index}
        plugins={[Thumbnails]}
      />
    </div>
    </>
  )
}



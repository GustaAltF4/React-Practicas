import { Card, CardContent } from "@/components/ui/card"
import { galeria } from "./constants/galeria"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const productosEspecificos = [62,123,17,37,55]
export function MyCarousel() {
  return (
    
    <Carousel className="w-full max-w-xs mt-3 mb-3">
      <CarouselContent>
        {galeria.filter((item) => productosEspecificos.includes(item.id))
        .map((item, index) => (
            <CarouselItem key={index} className="flex justify-center ">
                <Card className="aspect-[3/3] overflow-hidden p-0 shadow-md">
                <CardContent className=" relative p-0 h-full">
                  <img
                    src={item.imagen}
                    alt={`Producto ${item.id}`}
                    className="object-cover h-full w-full"
                  />
                  <p className="absolute top-2 left-2 bg-primary dark:bg-secondary text-white text-xs px-2 py-1 rounded-full ">{item.id}</p>
                </CardContent>
              </Card>
            </CarouselItem>
        ))
        }
            
        
      </CarouselContent>
      <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 ext-primary dark:text-secondary h-20 " variant={"ghost"} />
      <CarouselNext className="right-2 top-1/2 -translate-y-1/2 text-primary dark:text-secondary h-20" variant={"ghost"}/>
    </Carousel>
  )
}

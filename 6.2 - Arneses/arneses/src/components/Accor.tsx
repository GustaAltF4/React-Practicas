import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
} from "@/components/ui/accordion";

export function AccorAnidado() {
    return (
        <Accordion type="single" collapsible className="mt-2">
            <AccordionItem value="sub-1">
                <AccordionTrigger className="pl-4">¿Cómo puedo comprar un arnés?</AccordionTrigger>
                <AccordionContent className="pl-4">
                    <p className="italic text-pink-700">
                        Simplemente selecciona activando la casilla en la parte inferior
                        derecha del arnés que deseas, y luego presiona el botón de compra para contactarme.
                        También puedes escribirme directamente mencionando el número del arnés que quieres comprar.
                    </p>

                </AccordionContent>
            </AccordionItem>


            <AccordionItem value="sub-2">
                <AccordionTrigger className="pl-4">¿Cómo puedo obtener el producto o haces envíos?</AccordionTrigger>
                <AccordionContent className="pl-4">
                    <p className="italic text-pink-700">
                        Hago entregas en Mendoza en puntos de encuentro, o a domicilio con un cargo extra.
                        También realizo envíos a todo el país a través de Correo Argentino.</p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sub-3">
                <AccordionTrigger className="pl-4">¿Sobre el producto?</AccordionTrigger>
                <AccordionContent className="pl-4">
                    <p className="italic text-pink-700">
                        Todos los arneses los hago a mano, por lo que requiero que todos los encargos se realicen con anticipación.
                        En general son talla única, pero puedes escribirme para preguntar sobre otros talles específicos. Además, tienen reguladores para adaptarse a más de un talle. ❤</p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sub-4">
                <AccordionTrigger className="pl-4">Encargos por mayor</AccordionTrigger>
                <AccordionContent className="pl-4">
                    <p className="italic text-pink-700">
                        Sí, realizo encargos por mayor, con una compra mínima de $15,000. Si el encargo es menor a este monto, los precios serán como individuales.
                        Para encargar por mayor, es necesaria una seña del 15% del total de la compra. El encargo puede incluir cualquier tipo de arnés del catálogo, no es necesario pedir los mismos diseños.</p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sub-5">
                <AccordionTrigger className="pl-4">¿Qué pasa si quiero un diseño de arnés que no está en el catálogo?</AccordionTrigger>
                <AccordionContent className="pl-4">
                    <p className="italic text-pink-700">
                        Puedo hacer el tipo de arnés que quieras. Solo tienes que escribirme y enviarme la foto del diseño que quieres, y te responderé con el presupuesto.</p>
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    )
}
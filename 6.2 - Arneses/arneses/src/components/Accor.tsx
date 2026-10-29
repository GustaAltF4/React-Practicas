import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
} from "@/components/ui/accordion";

export function AccorAnidado() {
    return (
        <Accordion type="single" collapsible className="w-full flex flex-col gap-1">
            <AccordionItem value="sub-1" className="border-none">
                <AccordionTrigger className="py-2 px-3 text-[11px] font-bold uppercase tracking-tight text-zinc-600 hover:underline hover:bg-fuchsia-500/5 rounded-[0.5rem] transition-all text-left leading-tight">
                    ¿Cómo puedo comprar un arnés?
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-1 pb-3">
                    <p className="text-[12px] leading-relaxed text-fuchsia-800/80 font-medium">
                        Selecciona activando la casilla en la parte inferior derecha del arnés y presiona el botón de compra. 
                        También puedes escribirme con el número del modelo.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sub-2" className="border-none">
                <AccordionTrigger className="py-2 px-3 text-[11px] font-bold uppercase tracking-tight text-zinc-600 hover:underline hover:bg-fuchsia-500/5 rounded-[0.5rem] transition-all text-left leading-tight">
                    ¿Cómo puedo obtener el producto?
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-1 pb-3">
                    <p className="text-[12px] leading-relaxed text-fuchsia-800/80 font-medium">
                        Entregas en Mendoza (puntos de encuentro o domicilio con cargo extra) y envíos a todo el país por Correo Argentino.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sub-3" className="border-none">
                <AccordionTrigger className="py-2 px-3 text-[11px] font-bold uppercase tracking-tight text-zinc-600 hover:underline hover:bg-fuchsia-500/5 rounded-[0.5rem] transition-all text-left leading-tight">
                    ¿Sobre el producto?
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-1 pb-3">
                    <p className="text-[12px] leading-relaxed text-fuchsia-800/80 font-medium">
                        Hechos a mano con anticipación. Talle único regulable, pero consultame por talles específicos si necesitas. ❤
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sub-4" className="border-none">
                <AccordionTrigger className="py-2 px-3 text-[11px] font-bold uppercase tracking-tight text-zinc-600 hover:underline hover:bg-fuchsia-500/5 rounded-[0.5rem] transition-all text-left leading-tight">
                    Encargos por mayor
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-1 pb-3">
                    <p className="text-[12px] leading-relaxed text-fuchsia-800/80 font-medium">
                        Mínimo $15.000 con seña del 15%. Puedes combinar cualquier diseño del catálogo.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sub-5" className="border-none">
                <AccordionTrigger className="py-2 px-3 text-[11px] font-bold uppercase tracking-tight text-zinc-600 hover:underline hover:bg-fuchsia-500/5 rounded-[0.5rem] transition-all text-left leading-tight">
                    ¿Diseños personalizados?
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-1 pb-3">
                    <p className="text-[12px] leading-relaxed text-fuchsia-800/80 font-medium">
                        Puedo hacer el diseño que quieras. Enviame la foto por WhatsApp y te paso el presupuesto.
                    </p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
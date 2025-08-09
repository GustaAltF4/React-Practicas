import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { VenusAndMars, Share2, Search, MessageCircleQuestionMark, Instagram, Facebook, Brush,Blocks,Github,Mail  } from "lucide-react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { galeria } from "@/components/constants/galeria"
import { useState } from "react";
import { AccorAnidado } from "./Accor";



export function AppSidebar() {
  const [numeroprod, setNumeroprod] = useState(0);

  return (
    <Sidebar >
      <SidebarContent >
        <SidebarGroup>
          <SidebarGroupLabel>
            <h1 className="text-2xl font-bold tracking-tight ">Nitch Rosenrot</h1>
            <img src="/img/icons/LOGONEGRO.png" alt="Logo" className="ml-3 w-7 h-7 dark:hidden" />
            <img src="/img/icons/LOGOBLANCO.png" alt="Logo" className="ml-3 w-7 h-7 hidden dark:block" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Preguntas Frecuentes - Accordion */}
              <SidebarMenuItem>
                <Accordion type="single" collapsible asChild >
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="flex w-full w-1 items-center gap-2 px-4 py-2 text-pink-600 font-medium hover:no-underline hover:bg-accent  rounded-md transition-colors">
                      <MessageCircleQuestionMark className="mr-0 h-4 w-4" />
                      Preguntas Frecuentes
                    </AccordionTrigger>
                    <AccordionContent>
                      {/** ACCORDION ANIDADO */}
                      <AccorAnidado />

                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </SidebarMenuItem>

              {/* Seguime - Dropdown */}
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <Share2 className="ml-2 mr-2 text-pink-600" />
                      <span className="text-pink-600">Seguime</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom"  >
                    <DropdownMenuItem>
                      <Instagram className="mr-2 h-4 w-4" />
                      <a href="https://www.instagram.com/mmwojcik99/">Instagram</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Facebook className="mr-2 h-4 w-4" />
                      <a href="https://www.facebook.com/milagros.wojcik/">Facebook</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Brush className="mr-2 h-4 w-4" />
                      <a href="https://www.instagram.com/hexagonik.tattoo/">Mi Arte</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>

                      <svg className="mr-2 h-4" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                        <path fill="#ffffff" d="M25,2C12.318,2,2,12.318,2,25c0,3.96,1.023,7.854,2.963,11.29L2.037,46.73c-0.096,0.343-0.003,0.711,0.245,0.966 C2.473,47.893,2.733,48,3,48c0.08,0,0.161-0.01,0.24-0.029l10.896-2.699C17.463,47.058,21.21,48,25,48c12.682,0,23-10.318,23-23 S37.682,2,25,2z M36.57,33.116c-0.492,1.362-2.852,2.605-3.986,2.772c-1.018,0.149-2.306,0.213-3.72-0.231 c-0.857-0.27-1.957-0.628-3.366-1.229c-5.923-2.526-9.791-8.415-10.087-8.804C15.116,25.235,13,22.463,13,19.594 s1.525-4.28,2.067-4.864c0.542-0.584,1.181-0.73,1.575-0.73s0.787,0.005,1.132,0.021c0.363,0.018,0.85-0.137,1.329,1.001 c0.492,1.168,1.673,4.037,1.819,4.33c0.148,0.292,0.246,0.633,0.05,1.022c-0.196,0.389-0.294,0.632-0.59,0.973 s-0.62,0.76-0.886,1.022c-0.296,0.291-0.603,0.606-0.259,1.19c0.344,0.584,1.529,2.493,3.285,4.039 c2.255,1.986,4.158,2.602,4.748,2.894c0.59,0.292,0.935,0.243,1.279-0.146c0.344-0.39,1.476-1.703,1.869-2.286 s0.787-0.487,1.329-0.292c0.542,0.194,3.445,1.604,4.035,1.896c0.59,0.292,0.984,0.438,1.132,0.681 C37.062,30.587,37.062,31.755,36.57,33.116z"></path>
                      </svg>
                      <a href="whatsapp://send?phone=2613861336&text/">Whatsapp</a>


                    </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>

              {/* SexShop - Enlace común */}
              <SidebarMenuItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <SidebarMenuButton className="ml-1 flex items-center  text-pink-600 hover:text-pink-600">
                      <VenusAndMars className="ml-1 text-pink-600" />
                      <span className="ml-1">¿SexShop?</span>
                    </SidebarMenuButton>
                  </PopoverTrigger>
                  <PopoverContent>
                    También puedes consultarme por productos de SexShop a mi WhatsApp 😉💌.
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>

              {/* Buscador - Dialog que se muestra al hacer click */}
              <SidebarMenuItem>
                <Dialog>
                  <DialogTrigger asChild>
                    <SidebarMenuButton className="flex items-center gap-2 text-pink-600">
                      {/* Este es el único hijo (un botón con todo adentro) */}
                      <>
                        <Search className="ml-2 mr-2" />
                        <span>Buscador</span>
                      </>
                    </SidebarMenuButton>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Buscador de Arneses</DialogTitle>
                      <DialogDescription className="flex flex-col gap-2 max-h-2xl">
                        <Input
                          placeholder="N° del producto..."
                          value={numeroprod}
                          onChange={(e) => setNumeroprod(Number(e.target.value))}
                          type="number"
                        />
                        {
                          galeria
                            .filter((img) => String(img.id) === String(numeroprod))
                            .map((img) => (
                              <img
                                key={img.id}
                                src={img.imagen}
                                alt={`Producto ${img.id}`}
                                className="rounded-md border shadow-sm max-h-[70vh] transition-all duration-500 ease-in-out opacity-0 scale-95"
                                onLoad={(e) => {
                                  e.currentTarget.classList.remove("opacity-0", "scale-95")
                                  e.currentTarget.classList.add("opacity-100", "scale-100")
                                }}
                              />
                            ))
                        }
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

              </SidebarMenuItem>


            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      <div>

        <img src="/img/icons/rosa2.webp" alt="rosa white" className="dark:hidden" />
        <img src="/img/icons/rosa1.webp" alt="rosa dark" className="hidden dark:block"/>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className=" mb-3 gap-2 text-primary opacity-40">
              <Blocks className="ml-2 mr-2 " />
              <span >Desarrollado por...</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top"  >
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              <a href="mailto:acostag.123456@gmail.com">Correo</a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Github className="mr-2 h-4 w-4" />
              <a href="https://github.com/GustaAltF4">Git Hub</a>
            </DropdownMenuItem>
            

          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </Sidebar>
  )
}
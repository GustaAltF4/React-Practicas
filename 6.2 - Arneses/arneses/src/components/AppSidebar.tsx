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
import { 
  VenusAndMars, Share2, Search, MessageCircleQuestionMark, 
  Instagram, Facebook, Brush, Blocks, Github, Mail, Shield,
  Layers, Check
} from "lucide-react"
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
  DropdownMenuItem,
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
import { useNavigate, Link } from "react-router-dom";
import { normalizarImagenUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const COLECCIONES = [
  { label: "Cola & ligas", slug: "cola y ligas" },
  { label: "Pecho", slug: "pecho" },
  { label: "Cuerpo Completo & Conjuntos", slug: "cuerpo completo" },
  { label: "Gargantillas", slug: "gargantillas" },
  { label: "Hombre", slug: "hombre" },
]

export function AppSidebar() {
  const [numeroprod, setNumeroprod] = useState<string>("");
  const navigate = useNavigate();
  const { seleccionados, toggleSeleccion } = useCart();

  return (
    <Sidebar className="border-r border-fuchsia-500/10 shadow-md">
      <SidebarContent className="p-2">
        <SidebarGroup>
          {/* Header con estética Pro - Doble click secreto para Admin */}
          <SidebarGroupLabel
            className="h-20 mb-4 px-2 cursor-pointer select-none"
            onDoubleClick={() => navigate("/admin")}
          >
            <div className="flex items-center gap-3 transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative h-10 w-10 overflow-hidden rounded-[0.5rem] bg-fuchsia-600 p-1.5 shadow-lg shadow-fuchsia-500/20">
                <img
                  src={normalizarImagenUrl("/img/icons/LOGOBLANCO.png")}
                  alt="Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-tight">
                Nitch <br />
                <span className="text-fuchsia-600">Arneses</span>
              </h1>
            </div>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {/* Buscador - rounded-[0.5rem] y Animación */}
              <SidebarMenuItem>
                <Dialog>
                  <DialogTrigger asChild>
                    <SidebarMenuButton className="h-11 rounded-[0.5rem] bg-fuchsia-500/5 hover:bg-fuchsia-500/10 text-fuchsia-600 transition-all active:scale-95 border border-fuchsia-500/5 hover:border-fuchsia-500/20">
                      <Search className="ml-2 mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                      <span className="font-bold uppercase text-[11px] tracking-widest">
                        Buscador
                      </span>
                    </SidebarMenuButton>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] rounded-[0.5rem] border-fuchsia-500/20 animate-in fade-in zoom-in duration-300">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                        Buscar Arnés
                      </DialogTitle>
                      <DialogDescription>
                        Ingresa el modelo para previsualizar.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                      <Input
                        placeholder="Ej: 123..."
                        value={numeroprod}
                        onChange={(e) => setNumeroprod(e.target.value)}
                        className="h-12 rounded-[0.5rem] border-fuchsia-500/20 focus-visible:ring-fuchsia-500"
                        type="number"
                      />
                      <div className="flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-900 rounded-[0.5rem] overflow-hidden">
                        {galeria
                          .filter((img) => String(img.id) === String(numeroprod))
                          .map((img) => {
                            const isSelected = seleccionados.includes(img.id)
                            return (
                              <div key={img.id} className="w-full relative group">
                                <img
                                  src={normalizarImagenUrl(img.imagen)}
                                  alt="Producto"
                                  className="max-h-[50vh] w-full object-cover animate-in slide-in-from-bottom-4 duration-500"
                                />
                                <div className="p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
                                  <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-600">
                                      {img.categoria}
                                    </span>
                                    <h5 className="text-sm font-black uppercase">
                                      Modelo #{img.id}
                                    </h5>
                                  </div>
                                  <button
                                    onClick={() => toggleSeleccion(img.id, !isSelected)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                                      isSelected
                                        ? "bg-fuchsia-600 text-white"
                                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-fuchsia-500/20"
                                    }`}
                                  >
                                    {isSelected && <Check className="w-3.5 h-3.5" />}
                                    <span>{isSelected ? "Seleccionado" : "Seleccionar"}</span>
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </SidebarMenuItem>

              {/* Colecciones - Enlaces directos */}
              <SidebarMenuItem>
                <Accordion type="single" collapsible className="border-none">
                  <AccordionItem value="item-colecciones" className="border-none">
                    <AccordionTrigger className="h-11 px-4 py-2 hover:no-underline hover:bg-fuchsia-500/5 rounded-[0.5rem] transition-all text-fuchsia-600 group">
                      <div className="flex items-center gap-3">
                        <Layers className="h-4 w-4 opacity-70 transition-transform group-hover:scale-110" />
                        <span className="font-bold uppercase text-[11px] tracking-widest">
                          Colecciones
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 space-y-1 animate-in slide-in-from-top-2 duration-300 px-1">
                      {COLECCIONES.map((c) => (
                        <Link
                          key={c.slug}
                          to={`/categoria/${c.slug}`}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase hover:bg-fuchsia-500/10 text-zinc-700 dark:text-zinc-300 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 rounded-[0.3rem] transition-colors"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-600" />
                          <span>{c.label}</span>
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </SidebarMenuItem>

              {/* Preguntas Frecuentes - Accordion */}
              <SidebarMenuItem>
                <Accordion type="single" collapsible className="border-none">
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="h-11 px-4 py-2 hover:no-underline hover:bg-fuchsia-500/5 rounded-[0.5rem] transition-all text-fuchsia-600 group">
                      <div className="flex items-center gap-3">
                        <MessageCircleQuestionMark className="h-4 w-4 opacity-70 transition-transform group-hover:scale-110" />
                        <span className="font-bold uppercase text-[11px] tracking-widest">
                          Preguntas Frecuentes
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 animate-in slide-in-from-top-2 duration-300 px-1">
                      <AccorAnidado />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </SidebarMenuItem>

              {/* Seguime - Accordion */}
              <SidebarMenuItem>
                <Accordion type="single" collapsible className="border-none">
                  <AccordionItem value="item-seguime" className="border-none">
                    <AccordionTrigger className="h-11 px-4 py-2 hover:no-underline hover:bg-fuchsia-500/5 rounded-[0.5rem] transition-all text-fuchsia-600 group">
                      <div className="flex items-center gap-3 mt-2">
                        <Share2 className="h-4 w-4 opacity-70 transition-transform group-hover:scale-110" />
                        <span className="font-bold uppercase text-[11px] tracking-widest">
                          Seguime
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 space-y-1 animate-in slide-in-from-top-2 duration-300 px-1">
                      <a
                        href="https://www.instagram.com/mmwojcik99/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase hover:bg-fuchsia-50 dark:hover:bg-zinc-800 rounded-[0.3rem] transition-colors"
                      >
                        <Instagram className="h-4 w-4" /> Instagram
                      </a>
                      <a
                        href="https://www.facebook.com/milagros.wojcik/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase hover:bg-blue-50 dark:hover:bg-zinc-800 rounded-[0.3rem] transition-colors"
                      >
                        <Facebook className="h-4 w-4" /> Facebook
                      </a>
                      <a
                        href="https://www.instagram.com/monze.tattooink/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase hover:bg-fuchsia-50 dark:hover:bg-zinc-800 rounded-[0.3rem] transition-colors"
                      >
                        <Brush className="h-4 w-4" /> Mi Arte
                      </a>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </SidebarMenuItem>

              {/* SexShop - Popover */}
              <SidebarMenuItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <SidebarMenuButton className="h-11 rounded-[0.5rem] text-fuchsia-600 hover:bg-fuchsia-500/10 transition-all group">
                      <VenusAndMars className="ml-2 mr-2 h-4 w-4 opacity-70 transition-transform group-hover:scale-110" />
                      <span className="font-bold uppercase text-[11px] tracking-widest">
                        ¿SexShop?
                      </span>
                    </SidebarMenuButton>
                  </PopoverTrigger>
                  <PopoverContent
                    side="right"
                    className="rounded-[0.5rem] shadow-xl border-fuchsia-500/20 p-4 animate-in zoom-in-95 duration-200"
                  >
                    <p className="text-[11px] uppercase tracking-wider leading-relaxed">
                      Consulta por productos de{" "}
                      <span className="font-bold text-fuchsia-600">SexShop</span> vía
                      WhatsApp. 😉💌
                    </p>
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* BLOQUE FINAL */}
      <div>
        <img
          src={normalizarImagenUrl("/img/icons/rosa2.webp")}
          alt="rosa white"
          className="dark:hidden"
        />
        <img
          src={normalizarImagenUrl("/img/icons/rosa1.webp")}
          alt="rosa dark"
          className="hidden dark:block"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="mb-3 gap-2 text-primary opacity-40">
              <Blocks className="ml-2 mr-2 " />
              <span>Desarrollado por...</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="rounded-[0.5rem]">
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              <a href="mailto:acostag.123456@gmail.com">Correo</a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Github className="mr-2 h-4 w-4" />
              <a href="https://github.com/GustaAltF4" target="_blank" rel="noreferrer">
                Git Hub
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/admin")}
              className="text-zinc-500 hover:text-fuchsia-400"
            >
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  )
}

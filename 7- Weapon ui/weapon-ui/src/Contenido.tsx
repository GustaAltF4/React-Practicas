import { ThemeProvider } from "@/components/theme-provider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from "react"

import { WeaponByIdRequest } from "./components/weapon-id"
import { WeaponByNameRequest } from "./components/weapon-name"
import WeaponPostForm from "./components/add-weapon"
import WeaponDelete from "./components/delete-weapon"
import WeaponUpdateForm from "./components/update-weapon"
import InputWeapon from "./components/input-gets"
import { Menu } from "./components/menu"


export function Contenido() {

  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 1000); // 1 segundo
  };


  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Menu />
      <div className="flex  flex-col items-center mb-5 ">
        <h1 className="text-4xl font-bold mb-4 ">
          <img
            className={`inline-block mr-2 h-10 cursor-pointer ${isSpinning ? "animate-spin" : ""}`}
            src="/sword-origami-paper-svgrepo-com.svg"
            alt="Logo"
            onClick={handleClick}
          />
          Armory API (demo)
        </h1>
        <a className="mb-4 text-2x1 text-slate-500 hover:underline" 
        href="https://api-weapon-v2.onrender.com/weapons" 
        target="_blank"
        >https://api-weapon-v2.onrender.com/weapons</a>


        <div className="bg-slate-400 dark:bg-slate-800 text-center mb-4 p-4 rounded-lg  border-2 border-stone-700 max-w-3xl ">
          <p className="font-bold">INFO</p>
          <p>
            This is a demo application to test the Armory API, developed by me.
            It allows you to manage video game weapon data using GET, POST, PUT, and DELETE requests.
          </p>
          <p className="mt-2 border-3 border-stone-700 p-2 ">
            <strong>Note:</strong> Data is periodically reset due to the use of free hosting services, so any changes will be temporary.
          </p>
          <p className="mt-1 italic text-sm">
            This application is for educational and testing purposes only.
          </p>
        </div>


        <InputWeapon />
        <Accordion type="single" collapsible className="w-full max-w-3xl px-4 mt-4">
          <h2 className="text-2xl font-semibold text-slate-500">Requests example</h2>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer">GET requests: by ID</AccordionTrigger>
            <AccordionContent>
              <WeaponByIdRequest />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="cursor-pointer">GET requests: by Name</AccordionTrigger>
            <AccordionContent>
              <WeaponByNameRequest />
            </AccordionContent>
          </AccordionItem>


          {/* <h2>POST requests example</h2> */}
          <AccordionItem value="item-3">
            <AccordionTrigger className="cursor-pointer">POST requests</AccordionTrigger>
            <AccordionContent>
              <WeaponPostForm />
            </AccordionContent>
          </AccordionItem>


          {/* <h2>PUT requests example</h2> */}
          <AccordionItem value="item-4">
            <AccordionTrigger className="cursor-pointer">PUT requests</AccordionTrigger>
            <AccordionContent>
              <WeaponUpdateForm />
            </AccordionContent>
          </AccordionItem>

          {/* <h2>DELETE requests example</h2> */}
          <AccordionItem value="item-5">
            <AccordionTrigger className="cursor-pointer">DELETE requests</AccordionTrigger>
            <AccordionContent>
              <WeaponDelete />
            </AccordionContent>
          </AccordionItem>

        </Accordion>

      </div>

    </ThemeProvider>

  )
}




import { Menu } from "./components/menu"
import InputJson from "@/components/input-gets"
import { ButtonDelete } from "./components/button-delete"
import { ButtonAdd } from "./components/button-add"
import { ButtonUpdate } from "./components/button-update"
export function Content() {


  return (
    <>

      <Menu />
      <div className="flex  flex-col items-center mt-4 ">
        <div className="flex items-center mb-4">
           <h1 className="text-4xl font-bold">Microservices Project (demo)</h1>
          <div className="relative h-20 w-20 mr-2">
            <img
              src="./microservices-5.svg"
              alt="logo"
              className="absolute inset-0 w-full h-full dark:hidden"
            />
            <img
              src="./microservices-6.svg"
              alt="logo"
              className="absolute inset-0 w-full h-full hidden dark:block"
            />
          </div>
         
        </div>
        <div className="bg-slate-400 dark:bg-slate-800 text-center mb-4 p-4 rounded-lg  border-2 border-stone-700 max-w-3xl ">
          <p className="font-bold">INFO</p>
          <p>
            This is a demo application to test endpoints in a microservices architecture, developed by me.
            It allows you to manage data using GET, POST, PUT, and DELETE requests.
          </p>
          <p className="mt-2 border-3 border-stone-700 p-2 ">
            <strong>Note:</strong> Data is periodically reset due to the use of free hosting services, so any changes will be temporary.
          </p>
          <p className="mt-1 italic text-sm">
            This application is for educational and testing purposes only.<br />
            <strong className="text-blue-800 dark:text-blue-500 ">If an endpoint fails to respond due to CORS restrictions or a gateway error, please try refreshing the page.</strong>
          </p>
        </div>
      </div>
      <div className="flex min-h-svh flex-col items-center ">
        <InputJson />
        <ButtonDelete />
        <ButtonAdd />
        <ButtonUpdate />
      </div>

    </>
  )
}

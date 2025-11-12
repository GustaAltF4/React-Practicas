import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import logo from './assets/12.webp'



function App() {
  const [base, setBase] = useState(() => {
    const guardado = window.localStorage.getItem('precio_base')
    return guardado ? Number(guardado) : ""

  })
  const [cm, setCm] = useState("")
  const [result, setResult] = useState(null)

  useEffect(() => {
    localStorage.setItem('precio_base', base)
  }, [base])
  const calcular = () => {
    if (base && cm) {
      const resultado = (cm * base) / 5
      setResult(resultado)

    }
  }
  function sumarColor() {
    setResult(result + 1500)
  }
  function sumarRelleno() {
    setResult(result + 3000)
  }

  return (
    <>


        

        <div >

          <div>
            <h1><svg width={40} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
            </svg>
              Calculadora de Tatuajes
            </h1>
            <img src={logo} alt="img" width={100} />
            {result !== null && (
              <motion.h2 key={result} className='result'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >Total: ${result}</motion.h2>
            )}
          </div>

          <div>
            <span>Precio Base:</span><br />
            <input type="number" value={base} onChange={(e) => setBase(Number(e.target.value))}
              placeholder='Ingrese Precio' />
          </div>

          <div>
            <span>Tamaño en Cm:</span><br />
            <input type="number" value={cm} onChange={(e) => setCm(Number(e.target.value))} placeholder='Ingrese Tamaño' />
          </div>
          <button onClick={calcular} className='logo'>Calcular</button>


          {/* extras  */}
          <div className='extras'>
            <h4>Extras</h4>
            <button onClick={sumarColor}>
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M10.5 10.5c.002 2.762-2.237 5-5 5s-5.002-2.238-5-5c-.002-2.76 2.237-5 5-5s5.002 2.24 5 5z" color="#000000" fill="#ff15a1" stroke="#373737" strokeWidth=".49999682600000006"></path><path d="M8 1.401a4.998 4.998 0 0 0-2.488 9.334c-.004-.078-.012-.155-.012-.234a4.998 4.998 0 0 1 7.488-4.334A4.994 4.994 0 0 0 8 1.4z" fill="#1583ff"></path><path d="M10.5 5.5a4.998 4.998 0 0 0-5 5c0 .08.008.157.012.235A4.998 4.998 0 0 0 13 6.401c0-.079-.008-.156-.012-.234A4.975 4.975 0 0 0 10.5 5.5z" fill="#00cf2d"></path><path d="M12.988 6.167c.004.078.012.155.012.234a4.998 4.998 0 0 1-7.489 4.334 4.994 4.994 0 0 0 4.989 4.766 4.998 4.998 0 0 0 2.488-9.334z" fill="#f8ff15"></path><path d="M5.512 10.735a4.996 4.996 0 0 0 2.486 4.093 4.987 4.987 0 0 0 2.49-4.091A4.978 4.978 0 0 1 8 11.4a4.975 4.975 0 0 1-2.488-.666z" fill="#ef0000"></path><path d="M7.998 6.173A4.991 4.991 0 0 0 5.5 10.5c0 .079.008.156.012.234a4.978 4.978 0 0 0 4.977.002c.003-.079.011-.157.011-.236a4.99 4.99 0 0 0-2.502-4.328z" fill="#383027"></path><path d="M5.5 5.5c-.91 0-1.76.247-2.494.67a4.99 4.99 0 0 0 2.506 4.564c-.004-.077-.012-.154-.012-.233a4.991 4.991 0 0 1 2.498-4.328A4.975 4.975 0 0 0 5.5 5.5z" fill="#5100cc"></path><path d="M8 1.401a4.998 4.998 0 0 0-4.994 4.77 4.998 4.998 0 1 0 4.992 8.658 4.998 4.998 0 1 0 4.99-8.662A4.994 4.994 0 0 0 8 1.4z" fill="none" stroke="#373737" strokeWidth=".9999936520000001"></path></g></svg></button>
            <button onClick={sumarRelleno}>
              <svg fill="#000000" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><title>ionicons-v5-m</title><path d="M256,185a167.85,167.85,0,0,1,134.9-18.28C382.36,99.83,325.12,48,256,48S129.64,99.83,121.1,166.67A167.85,167.85,0,0,1,256,185Z"></path><path d="M336,331.73a167.51,167.51,0,0,1-52.37,118.08A135,135,0,0,0,344,464c75,0,136-61,136-136a136,136,0,0,0-59.06-112.08A168.53,168.53,0,0,1,336,331.73Z"></path><path d="M283.58,206.19a167.87,167.87,0,0,1,49.36,89.89A136.14,136.14,0,0,0,391,200.38a135.87,135.87,0,0,0-107.43,5.81Z"></path><path d="M176.05,331.73a168.53,168.53,0,0,1-85-115.81A136,136,0,0,0,32,328c0,75,61,136,136,136a135,135,0,0,0,60.42-14.19A167.51,167.51,0,0,1,176.05,331.73Z"></path><path d="M179.06,296.08a167.87,167.87,0,0,1,49.36-89.89A135.87,135.87,0,0,0,121,200.38,136.14,136.14,0,0,0,179.06,296.08Z"></path><path d="M302.9,345.33a168.22,168.22,0,0,1-93.8,0A135.9,135.9,0,0,0,256,431.6,135.9,135.9,0,0,0,302.9,345.33Z"></path><path d="M209,311.62a136,136,0,0,0,94,0,135.93,135.93,0,0,0-47-87.22A135.93,135.93,0,0,0,209,311.62Z"></path></g></svg></button>
          </div>

        </div>


    </>
  )
}

export default App

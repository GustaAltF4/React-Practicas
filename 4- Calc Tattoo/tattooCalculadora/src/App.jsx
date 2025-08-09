import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import logo from './assets/12.webp'


function App() {
  const [base, setBase] = useState(()=>{
    const guardado= window.localStorage.getItem('precio_base')
    return guardado ? Number(guardado) : ""

  })
  const [cm, setCm] = useState("")
  const [result, setResult] = useState(null)

  useEffect(()=>{
      localStorage.setItem('precio_base', base)
  },[base])
  const calcular = () =>{
    if (base && cm){
      const resultado= (cm *base)/ 5
      setResult(resultado)
    }
  }
  
  return (
    <>
      
      
      <article>
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
          <span>Precio Base:</span><br/>
          <input type="number" value={base} onChange={(e)=> setBase(Number(e.target.value))}
          placeholder='Ingrese Precio' />
        </div>
        
        <div>
          <span>Tamaño en Cm:</span><br/>
          <input type="number" value={cm} onChange={(e)=> setCm(Number(e.target.value))} placeholder='Ingrese Tamaño'  />
        </div>
        <button onClick={calcular} className='logo'>Calcular</button>
        
      </article>
      
      
      
    </>
  )
}

export default App

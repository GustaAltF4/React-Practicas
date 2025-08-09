import { useState } from 'react'
import './App.css'
import { Card } from './Card'
import { Tatuadores } from './Tatuadores'



function App() {
  

  return (
    <>
      <h1>Diseños de Tatuajes</h1>
      <h2 >HEXAGONIK</h2>
      <p>⬇ Nuestros Artistas ⬇</p>
      <Tatuadores/>
      <Card />
      <div className="logoHexa"></div>
      
      
     
    </>
  )
}

export default App

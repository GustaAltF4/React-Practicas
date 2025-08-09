import { useState, useEffect } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { imagesTattoo } from './constants/images'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

function descargar(url) {
  const link = document.createElement('a')
  link.href = url
  link.download = url.substring(url.lastIndexOf('/') + 1)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function Card() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  

  const slides = imagesTattoo.map(img => ({
    src: `/tattoos/${img}`
  }))

 useEffect(() => {

  if (!open) {
    document.body.style.overflow = 'auto'
    const elemento = document.getElementById(`img-${index}`)
    if (elemento) {
      setTimeout(() => {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 200)
    }
  } else {
    document.body.style.overflow = 'hidden'
  }
}, [open])

  return (
    <>
      <div className='imagenTattoo'>
        {imagesTattoo.map((imgNombre, i) => (
          <div key={i} className='imgBtnContenedor' id={`img-${i}`}>
            <img
              src={`/tattoos/${imgNombre}`}
              alt={`tattoo ${i + 1}`}
              onClick={() => {
                setIndex(i)
                setOpen(true)
              }}
            />
            <button className='btnDD' onClick={() => descargar(`/tattoos/${imgNombre}`)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}

        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          on={{
            view: ({ index: newIndex }) => setIndex(newIndex)
          }}
          slides={slides}
          plugins={[Zoom, Thumbnails]}
        />
      </div>
    </>
  )
}

import { useState, useEffect } from "react";
import { galeria } from "./constants/galeria";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";


import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";


export function Card({ categoriaC }) {
    const imagenes = galeria.filter((img) => img.categoria === categoriaC);
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(-1);

    const slides = imagenes.map(img => ({
        src: img.imagen
    }));

    useEffect(() => {
        if (!open) {
            document.body.style.overflow = 'auto';
            const elemento = document.getElementById(`img-${index}`);
            if (elemento) {
                setTimeout(() => {
                    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 200);
            }
        } else {
            document.body.style.overflow = 'hidden';
        }
    }, [open]);

    return (
        <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {
                imagenes.map((img, i) => (
                    <div key={img.id} className=" relative border rounded p-2 shadow bg-white">
                        <img
                            id={`img-${i}`}
                            src={img.imagen}
                            alt={`Imagen ${img.id}`}
                            className="w-full h-full rounded cursor-pointer"
                            onClick={() => {
                                setIndex(i);
                                setOpen(true);
                            }}
                        />
                         
                        <p className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 ">{img.id}</p>
                        
                        
                    </div>
                ))
            }
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                on={{
                    view: ({ index: newIndex }) => setIndex(newIndex)
                }}
                slides={slides}
                plugins={[ Thumbnails]}
            />
        </div>
    );
};

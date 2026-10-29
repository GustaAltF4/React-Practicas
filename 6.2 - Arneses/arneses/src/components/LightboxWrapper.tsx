// LightboxWrapper.tsx
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// Exportamos un componente que ya tiene el plugin puesto
export default function SafeLightbox(props: any) {
  return <Lightbox plugins={[Thumbnails]} {...props} />;
}
// LightboxWrapper.tsx
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function SafeLightbox(props: any) {
  return (
    <Lightbox
      plugins={[Thumbnails]}
      styles={{
        container: {
          backgroundColor: "rgba(0, 0, 0, 0.92)",
          backdropFilter: "blur(12px)",
        },
        thumbnailsContainer: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      }}
      {...props}
    />
  );
}

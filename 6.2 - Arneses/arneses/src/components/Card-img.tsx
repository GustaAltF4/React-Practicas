import { Checkbox } from "@/components/ui/checkbox"

interface ImageCardProps {
  id: number;
  imagen: string;
  onClick?: () => void;
  checked?: boolean;
  onCheckChange: (checked: boolean) => void
}
export function CardIMG({ id, imagen, onClick, checked, onCheckChange }: ImageCardProps) {
  return (
    <div className="relative rounded-lg w-40 h-60 m-2 overflow-hidden shadow-md cursor-pointer">
      <Checkbox checked={checked} onCheckedChange={onCheckChange}
        className="absolute bottom-2 right-2 z-10
        bg-white/60 dark:bg-black/50
        shadow-lg
        scale-110
        hover:scale-125
        transition-transform duration-200 "></Checkbox>
      <img
        src={imagen}
        alt={`Producto ${id}`}
        className="h-full w-full object-cover rounded"
        onClick={onClick}
      />
      <p className="absolute top-2 left-2 bg-primary dark:bg-secondary text-white text-xs px-2 py-1 rounded-full ">{id}</p>

    </div>
  )
}
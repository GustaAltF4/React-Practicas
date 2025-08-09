import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AlertaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function Alerta({ open, onOpenChange }: AlertaProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className=" dark:bg-pink-950">
        <AlertDialogHeader>
          <AlertDialogTitle>Debes seleccionar al menos un producto</AlertDialogTitle>
          <AlertDialogDescription>
            Por favor, selecciona al menos un producto para continuar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="
          bg-pink-600">Aceptar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

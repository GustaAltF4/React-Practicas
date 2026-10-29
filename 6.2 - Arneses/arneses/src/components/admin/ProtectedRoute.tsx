import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { LoginForm } from "./LoginForm"
import { Loader2, ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"

export const ADMIN_EMAILS = [
  "wojcikmilagros@gmail.com",
  "acostag.123456@gmail.com",
]

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [denegado, setDenegado] = useState(false)

  const checkUserAccess = async (user: any) => {
    if (!user || !user.email) {
      setSession(null)
      setDenegado(false)
      return
    }

    const emailNormalizado = user.email.toLowerCase().trim()
    const esAdmin = ADMIN_EMAILS.includes(emailNormalizado)

    if (esAdmin) {
      setSession(user)
      setDenegado(false)
    } else {
      // Si es un alumno u otro usuario de cursos, lo deslogueamos de esta app
      await supabase.auth.signOut()
      setSession(null)
      setDenegado(true)
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      checkUserAccess(user).then(() => setLoading(false))
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await checkUserAccess(session?.user || null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-fuchsia-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-xs uppercase tracking-widest font-black text-zinc-400">
          Verificando permisos...
        </span>
      </div>
    )
  }

  if (denegado) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black text-white relative">
        <div className="absolute inset-0 bg-radial from-fuchsia-950/20 via-black to-black" />
        <div className="relative z-10 w-full max-w-md bg-zinc-900/90 border border-red-500/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-center">
          <div className="inline-flex p-3 rounded-xl bg-red-600/10 border border-red-500/30 text-red-500 mb-3">
            <ShieldX className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-red-400">
            Acceso No Autorizado
          </h2>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Tu cuenta no tiene permisos para acceder al panel de administración de arneses.
          </p>
          <Button
            onClick={() => {
              setDenegado(false)
            }}
            className="mt-6 w-full h-11 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-wider rounded-xl text-xs"
          >
            Volver a intentar
          </Button>
        </div>
      </div>
    )
  }

  if (!session) {
    return <LoginForm onLoginSuccess={() => setLoading(false)} />
  }

  return <>{children}</>
}

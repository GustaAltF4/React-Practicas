import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Mail, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ADMIN_EMAILS } from "./ProtectedRoute"
import { ModeToggle } from "@/components/mode-toggle"

export function LoginForm({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const cleanEmail = email.trim().toLowerCase()

    if (!ADMIN_EMAILS.includes(cleanEmail)) {
      setErrorMsg("Este correo no tiene permisos de administrador.")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      })

      if (error) {
        setErrorMsg("Credenciales incorrectas. Verificá tu contraseña.")
      } else if (data?.user) {
        if (onLoginSuccess) {
          onLoginSuccess()
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error al intentar iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 relative overflow-hidden transition-colors duration-300">
      {/* Fondo estético sutil con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/10 via-transparent to-transparent dark:from-fuchsia-950/30 dark:via-black dark:to-black pointer-events-none" />

      {/* Selector de modo flotante */}
      <div className="absolute top-4 right-4 z-20">
        <ModeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/90 dark:bg-zinc-950/80 border border-zinc-200 dark:border-fuchsia-500/20 backdrop-blur-2xl p-8 rounded-2xl shadow-xl dark:shadow-2xl">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a la tienda
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-xl bg-fuchsia-600/10 border border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400 mb-3 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            NITCH <span className="text-fuchsia-600">ADMIN</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
            Acceso restringido para administración
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu-email@ejemplo.com"
                className="pl-10 h-11 bg-zinc-100 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:ring-fuchsia-500 text-sm rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11 bg-zinc-100 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:ring-fuchsia-500 text-sm rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
                title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-fuchsia-600/20 mt-2 active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Verificando...
              </span>
            ) : (
              "Ingresar al Panel"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

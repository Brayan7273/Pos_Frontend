import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/assets/components/ui/card"
import { Label } from "@/assets/components/ui/label"
import { Input } from "@/assets/components/ui/input"
import { Button } from "@/assets/components/ui/button"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
 bh
      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        if (rememberMe) localStorage.setItem("rememberUser", email)
        window.location.href = "/dashboard"
      } else {
        setError(data.message || "Credenciales incorrectas")
      }
    } catch {
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Efecto de fondo animado */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-black blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="z-10"
      >
        <Card className="w-[400px] shadow-2xl border border-slate-700 bg-slate-900/90 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl text-white font-extrabold tracking-tight">
              POS-ML
            </CardTitle>
            <CardDescription className="text-gray-400">
              Inicia sesión en tu cuenta
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <motion.p
                className="text-red-500 text-sm mb-3 text-center font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-gray-300 font-medium">
                  Usuario
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div className="grid gap-2 relative">
                <Label htmlFor="password" className="text-gray-300 font-medium">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-blue-500 pr-10 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-blue-400 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-blue-600 h-4 w-4"
                  />
                  <span>Recordarme</span>
                </label>

                <a
                  href="#"
                  className="text-blue-500 hover:text-blue-400 transition font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 disabled:opacity-70"
              >
                {loading ? "Iniciando..." : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm text-gray-400 w-full">
              © {new Date().getFullYear()} POS-ML. Todos los derechos reservados.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

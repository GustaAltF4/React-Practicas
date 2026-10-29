import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { HomePage } from "@/pages/HomePage"
import { CategoriaPage } from "@/pages/CategoriaPage"
import { AdminPage } from "@/pages/AdminPage"
import { ProtectedRoute } from "@/components/admin/ProtectedRoute"
import { CartProvider } from "@/context/CartContext"
import { CartDrawer } from "@/components/CartDrawer"
import { AnimatePresence } from "framer-motion"

export default function App() {
  const location = useLocation()

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <CartProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/categoria/:slug" element={<CategoriaPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
        {/* El drawer del carrito flotante persiste en todas las páginas excepto en el admin */}
        {!location.pathname.startsWith("/admin") && <CartDrawer />}
      </CartProvider>
    </ThemeProvider>
  )
}

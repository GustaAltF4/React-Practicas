import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import {
  getCategorias,
  saveCategoria,
  deleteCategoria,
  getProductosAdmin,
  saveProducto,
  deleteProducto,
  uploadImagen,
} from "@/lib/api"
import type { Categoria, Producto } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  LogOut,
  Upload,
  Loader2,
  Package,
  Layers,
  CheckCircle,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react"
import { Link } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle"
import { normalizarImagenUrl } from "@/lib/utils"

export function AdminPage() {
  const [tab, setTab] = useState<"productos" | "categorias">("productos")
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  // Filtros
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas")
  const [busqueda, setBusqueda] = useState<string>("")

  // Modales
  const [modalProdOpen, setModalProdOpen] = useState(false)
  const [modalCatOpen, setModalCatOpen] = useState(false)
  const [guardando, setGuardando] = useState(false)

  // Estado formulario Producto
  const [prodForm, setProdForm] = useState<{
    id?: number
    nombre: string
    categoria: string
    imagen: string
    precio: number
    destacado: boolean
    activo: boolean
  }>({
    nombre: "",
    categoria: "",
    imagen: "",
    precio: 0,
    destacado: false,
    activo: true,
  })
  const [prodFile, setProdFile] = useState<File | null>(null)
  const [prodPreview, setProdPreview] = useState<string>("")

  // Estado formulario Categoría
  const [catForm, setCatForm] = useState<{
    id?: number
    slug: string
    nombre: string
    portada_url: string
    orden: number
    activo: boolean
  }>({
    slug: "",
    nombre: "",
    portada_url: "",
    orden: 0,
    activo: true,
  })
  const [catFile, setCatFile] = useState<File | null>(null)
  const [catPreview, setCatPreview] = useState<string>("")

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [cats, prods] = await Promise.all([
        getCategorias(true),
        getProductosAdmin(),
      ])
      setCategorias(cats)
      setProductos(prods)
      if (cats.length > 0 && !prodForm.categoria) {
        setProdForm((prev) => ({ ...prev, categoria: cats[0].slug }))
      }
    } catch (err) {
      console.error("Error al cargar datos:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  // --- ACCIONES PRODUCTO ---
  const abrirNuevoProducto = () => {
    setProdForm({
      nombre: "",
      categoria: categorias[0]?.slug || "pecho",
      imagen: "",
      precio: 0,
      destacado: false,
      activo: true,
    })
    setProdFile(null)
    setProdPreview("")
    setModalProdOpen(true)
  }

  const abrirEditarProducto = (p: Producto) => {
    setProdForm({
      id: p.id,
      nombre: p.nombre || "",
      categoria: p.categoria,
      imagen: p.imagen,
      precio: p.precio || 0,
      destacado: !!p.destacado,
      activo: p.activo !== false,
    })
    setProdFile(null)
    setProdPreview(p.imagen)
    setModalProdOpen(true)
  }

  const handleGuardarProducto = async (e: React.FormEvent) => {
    e.preventDefault()
    setGuardando(true)

    try {
      let urlImagen = prodForm.imagen

      if (prodFile) {
        urlImagen = await uploadImagen(prodFile, "productos")
      }

      if (!urlImagen) {
        alert("Debes seleccionar una imagen para el producto.")
        setGuardando(false)
        return
      }

      await saveProducto({
        id: prodForm.id,
        nombre: prodForm.nombre || null,
        categoria: prodForm.categoria,
        imagen: urlImagen,
        precio: Number(prodForm.precio) || 0,
        destacado: prodForm.destacado,
        activo: prodForm.activo,
      })

      setModalProdOpen(false)
      await cargarDatos()
    } catch (err: any) {
      alert("Error al guardar producto: " + err.message)
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminarProducto = async (id: number) => {
    if (!confirm(`¿Eliminar producto #${id}?`)) return
    try {
      await deleteProducto(id)
      setProductos((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      alert("Error al eliminar: " + err.message)
    }
  }

  const handleToggleActivoProducto = async (p: Producto) => {
    try {
      const nuevoEstado = !p.activo
      await saveProducto({ id: p.id, activo: nuevoEstado })
      setProductos((prev) =>
        prev.map((item) =>
          item.id === p.id ? { ...item, activo: nuevoEstado } : item
        )
      )
    } catch (err: any) {
      alert("Error al actualizar: " + err.message)
    }
  }

  // --- ACCIONES CATEGORÍA ---
  const abrirNuevaCategoria = () => {
    setCatForm({
      slug: "",
      nombre: "",
      portada_url: "",
      orden: categorias.length + 1,
      activo: true,
    })
    setCatFile(null)
    setCatPreview("")
    setModalCatOpen(true)
  }

  const abrirEditarCategoria = (c: Categoria) => {
    setCatForm({
      id: c.id,
      slug: c.slug,
      nombre: c.nombre,
      portada_url: c.portada_url || "",
      orden: c.orden || 0,
      activo: c.activo !== false,
    })
    setCatFile(null)
    setCatPreview(c.portada_url || "")
    setModalCatOpen(true)
  }

  const handleGuardarCategoria = async (e: React.FormEvent) => {
    e.preventDefault()
    setGuardando(true)

    try {
      let portada = catForm.portada_url
      if (catFile) {
        portada = await uploadImagen(catFile, "categorias")
      }

      await saveCategoria({
        id: catForm.id,
        slug: catForm.slug.trim().toLowerCase(),
        nombre: catForm.nombre.trim(),
        portada_url: portada,
        orden: Number(catForm.orden) || 0,
        activo: catForm.activo,
      })

      setModalCatOpen(false)
      await cargarDatos()
    } catch (err: any) {
      alert("Error al guardar categoría: " + err.message)
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminarCategoria = async (id: number) => {
    if (!confirm("¿Eliminar categoría? Los productos asociados podrían quedar huérfanos.")) return
    try {
      await deleteCategoria(id)
      setCategorias((prev) => prev.filter((c) => c.id !== id))
    } catch (err: any) {
      alert("Error al eliminar categoría: " + err.message)
    }
  }

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const productosFiltrados = productos.filter((p) => {
    const matchCat =
      filtroCategoria === "todas" ? true : p.categoria === filtroCategoria
    const matchBusqueda =
      busqueda === ""
        ? true
        : String(p.id).includes(busqueda) ||
          (p.nombre && p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    return matchCat && matchBusqueda
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 transition-colors duration-300">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-[0.5rem] bg-fuchsia-600 p-1.5 shadow-md shadow-fuchsia-600/20 flex items-center justify-center">
            <img src="/img/icons/LOGOBLANCO.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-base font-black uppercase tracking-tight leading-none">
              Panel Nitch
            </h1>
            <span className="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 font-bold uppercase tracking-widest">
              Administración
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link to="/" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 border-zinc-300 dark:border-zinc-700 hover:border-fuchsia-500 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Tienda</span>
            </Button>
          </Link>
          <Button
            onClick={handleCerrarSesion}
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-red-500 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </header>

      {/* TABS SELECTOR */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <button
            onClick={() => setTab("productos")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              tab === "productos"
                ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900"
            }`}
          >
            <Package className="w-4 h-4" /> Productos ({productos.length})
          </button>
          <button
            onClick={() => setTab("categorias")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              tab === "categorias"
                ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900"
            }`}
          >
            <Layers className="w-4 h-4" /> Categorías ({categorias.length})
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-500 dark:text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-fuchsia-600" />
            <span className="text-xs uppercase tracking-widest font-bold">
              Cargando datos...
            </span>
          </div>
        ) : tab === "productos" ? (
          /* TAB PRODUCTOS */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex flex-1 gap-2">
                <Input
                  placeholder="Buscar por ID o nombre..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs max-w-xs"
                />
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="h-10 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-fuchsia-500"
                >
                  <option value="todas">Todas las categorías</option>
                  {categorias.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={abrirNuevoProducto}
                className="h-10 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-lg shadow-fuchsia-600/20"
              >
                <Plus className="w-4 h-4" /> Nuevo Producto
              </Button>
            </div>

            {productosFiltrados.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
                <p className="text-zinc-500 text-xs uppercase tracking-widest">
                  No se encontraron productos
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {productosFiltrados.map((p) => (
                  <div
                    key={p.id}
                    className={`relative rounded-xl border overflow-hidden bg-white dark:bg-zinc-900/60 transition-all shadow-sm ${
                      p.activo
                        ? "border-zinc-200 dark:border-zinc-800 hover:border-fuchsia-500/40"
                        : "border-red-300 dark:border-red-900/40 opacity-60"
                    }`}
                  >
                    <div className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white">
                      #{p.id}
                    </div>

                    <button
                      onClick={() => handleToggleActivoProducto(p)}
                      title={p.activo ? "Pausar producto" : "Activar producto"}
                      className={`absolute top-2 right-2 z-10 p-1 rounded-full backdrop-blur-md transition-colors ${
                        p.activo
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {p.activo ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div className="aspect-[2/3] w-full bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
                      <img
                        src={normalizarImagenUrl(p.imagen)}
                        alt={`Producto ${p.id}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-2.5 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-fuchsia-600 dark:text-fuchsia-400 truncate">
                        {p.categoria}
                      </p>
                      {p.nombre && (
                        <p className="text-xs font-semibold truncate">
                          {p.nombre}
                        </p>
                      )}
                      {p.destacado && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                          ★ Destacado
                        </span>
                      )}

                      <div className="flex gap-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 mt-2">
                        <Button
                          onClick={() => abrirEditarProducto(p)}
                          variant="ghost"
                          size="sm"
                          className="h-7 flex-1 text-[11px] p-0 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                        >
                          <Edit2 className="w-3 h-3 mr-1" /> Editar
                        </Button>
                        <Button
                          onClick={() => handleEliminarProducto(p.id)}
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-zinc-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* TAB CATEGORÍAS */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold">Categorías del Catálogo</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Definí los nombres, el orden y las fotos de portada de los acordeones.
                </p>
              </div>
              <Button
                onClick={abrirNuevaCategoria}
                className="h-10 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-lg shadow-fuchsia-600/20"
              >
                <Plus className="w-4 h-4" /> Nueva Categoría
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categorias.map((c) => (
                <div
                  key={c.slug}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col shadow-sm"
                >
                  <div className="relative h-28 bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
                    {c.portada_url ? (
                      <img
                        src={normalizarImagenUrl(c.portada_url)}
                        alt={c.nombre}
                        className="w-full h-full object-cover opacity-80 dark:opacity-70"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
                      <div>
                        <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider">
                          Orden #{c.orden}
                        </span>
                        <h3 className="text-base font-black uppercase text-white leading-tight">
                          {c.nombre}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 text-xs">
                    <span className="text-zinc-500 font-mono text-[11px]">
                      slug: {c.slug}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => abrirEditarCategoria(c)}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                      >
                        <Edit2 className="w-3 h-3 mr-1" /> Editar
                      </Button>
                      <Button
                        onClick={() => c.id && handleEliminarCategoria(c.id)}
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL PRODUCTO */}
      <Dialog open={modalProdOpen} onOpenChange={setModalProdOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-tight">
              {prodForm.id ? `Editar Producto #${prodForm.id}` : "Nuevo Producto"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleGuardarProducto} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                Categoría
              </label>
              <select
                value={prodForm.categoria}
                onChange={(e) =>
                  setProdForm({ ...prodForm, categoria: e.target.value })
                }
                className="w-full h-11 px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-fuchsia-500"
              >
                {categorias.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* FOTO CON UPLOAD DIRECTO */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                Foto del Arnés
              </label>
              <div className="flex gap-3 items-center">
                <div className="w-20 h-28 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex items-center justify-center shrink-0">
                  {prodPreview ? (
                    <img
                      src={prodPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="flex items-center justify-center gap-2 h-10 px-3 rounded-xl border border-fuchsia-500/40 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-500/20 text-xs font-bold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Subir desde dispositivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setProdFile(file)
                          setProdPreview(URL.createObjectURL(file))
                        }
                      }}
                    />
                  </label>
                  <Input
                    placeholder="O pegar URL de imagen..."
                    value={prodForm.imagen}
                    onChange={(e) => {
                      setProdForm({ ...prodForm, imagen: e.target.value })
                      setProdPreview(e.target.value)
                    }}
                    className="h-9 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                Nombre / Modelo (opcional)
              </label>
              <Input
                placeholder="Ej: Arnés Pentagrama..."
                value={prodForm.nombre}
                onChange={(e) =>
                  setProdForm({ ...prodForm, nombre: e.target.value })
                }
                className="h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Precio (opcional)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={prodForm.precio}
                  onChange={(e) =>
                    setProdForm({ ...prodForm, precio: Number(e.target.value) })
                  }
                  className="h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs"
                />
              </div>

              <div className="flex flex-col justify-end gap-2 pb-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={prodForm.destacado}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, destacado: e.target.checked })
                    }
                    className="rounded accent-fuchsia-600 h-4 w-4"
                  />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">★ Más vendido</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={prodForm.activo}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, activo: e.target.checked })
                    }
                    className="rounded accent-fuchsia-600 h-4 w-4"
                  />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Activo (visible)</span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={guardando}
              className="w-full h-11 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-fuchsia-600/20 mt-4"
            >
              {guardando ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                </span>
              ) : (
                "Guardar Producto"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL CATEGORÍA */}
      <Dialog open={modalCatOpen} onOpenChange={setModalCatOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-tight">
              {catForm.id ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleGuardarCategoria} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                Nombre Visible
              </label>
              <Input
                required
                placeholder="Ej: Gargantillas & Chokers"
                value={catForm.nombre}
                onChange={(e) => {
                  const nombre = e.target.value
                  setCatForm({
                    ...catForm,
                    nombre,
                    slug: catForm.id ? catForm.slug : nombre.toLowerCase().trim(),
                  })
                }}
                className="h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                Slug (identificador único)
              </label>
              <Input
                required
                placeholder="ej: gargantillas"
                value={catForm.slug}
                onChange={(e) =>
                  setCatForm({ ...catForm, slug: e.target.value })
                }
                className="h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                Foto de Portada (Banner Acordeón)
              </label>
              <div className="flex gap-3 items-center">
                <div className="w-24 h-14 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex items-center justify-center shrink-0">
                  {catPreview ? (
                    <img
                      src={catPreview}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="flex items-center justify-center gap-2 h-9 px-3 rounded-xl border border-fuchsia-500/40 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-500/20 text-xs font-bold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setCatFile(file)
                          setCatPreview(URL.createObjectURL(file))
                        }
                      }}
                    />
                  </label>
                  <Input
                    placeholder="O pegar URL del banner..."
                    value={catForm.portada_url}
                    onChange={(e) => {
                      setCatForm({ ...catForm, portada_url: e.target.value })
                      setCatPreview(e.target.value)
                    }}
                    className="h-9 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Orden de aparición
                </label>
                <Input
                  type="number"
                  value={catForm.orden}
                  onChange={(e) =>
                    setCatForm({ ...catForm, orden: Number(e.target.value) })
                  }
                  className="h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs"
                />
              </div>

              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={catForm.activo}
                    onChange={(e) =>
                      setCatForm({ ...catForm, activo: e.target.checked })
                    }
                    className="rounded accent-fuchsia-600 h-4 w-4"
                  />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Activa (visible)</span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={guardando}
              className="w-full h-11 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-fuchsia-600/20 mt-4"
            >
              {guardando ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                </span>
              ) : (
                "Guardar Categoría"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

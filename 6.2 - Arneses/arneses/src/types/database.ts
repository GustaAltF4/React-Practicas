export interface Categoria {
  id?: number
  slug: string
  nombre: string
  portada_url?: string | null
  orden?: number
  activo?: boolean
  created_at?: string
}

export interface Producto {
  id: number
  nombre?: string | null
  categoria: string
  imagen: string
  precio?: number
  destacado?: boolean
  activo?: boolean
  created_at?: string
}

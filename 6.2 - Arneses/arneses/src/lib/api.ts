import { supabase } from './supabaseClient'
import type { Categoria, Producto } from '@/types/database'
import { comprimirImagen } from './imageCompressor'

const BUCKET_NAME = 'arneses-imagenes'

// --- STORAGE ---
export async function uploadImagen(file: File, folder: string = 'productos'): Promise<string> {
  // Comprimimos y convertimos a WebP liviano antes de subir
  const archivoOptimizado = await comprimirImagen(file)

  const extension = archivoOptimizado.name.split('.').pop() || 'webp'
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, archivoOptimizado, {
      cacheControl: '31536000', // 1 año de caché
      upsert: false,
      contentType: 'image/webp',
    })

  if (error) {
    throw new Error(`Error al subir imagen: ${error.message}`)
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName)

  return data.publicUrl
}

// --- CATEGORIAS ---
export async function getCategorias(incluirInactivas: boolean = false): Promise<Categoria[]> {
  let query = supabase
    .from('arneses_categorias')
    .select('*')
    .order('orden', { ascending: true })

  if (!incluirInactivas) {
    query = query.eq('activo', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching categorias:', error)
    return []
  }
  return data || []
}

export async function saveCategoria(categoria: Partial<Categoria>): Promise<Categoria | null> {
  if (categoria.id) {
    const { id, ...dataToUpdate } = categoria
    const { data, error } = await supabase
      .from('arneses_categorias')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    // Excluimos explícitamente el campo 'id' para que PostgreSQL genere el autoincremental
    const { id, ...dataToInsert } = categoria
    const { data, error } = await supabase
      .from('arneses_categorias')
      .insert([dataToInsert])
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export async function deleteCategoria(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('arneses_categorias')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

// --- PRODUCTOS ---
export async function getProductos(categoriaSlug?: string): Promise<Producto[]> {
  let query = supabase
    .from('arneses_productos')
    .select('*')
    .eq('activo', true)
    .order('id', { ascending: true })

  if (categoriaSlug) {
    query = query.eq('categoria', categoriaSlug)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching productos:', error)
    return []
  }
  return data || []
}

export async function getProductosAdmin(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from('arneses_productos')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    console.error('Error fetching productos admin:', error)
    return []
  }
  return data || []
}

export async function saveProducto(producto: Partial<Producto>): Promise<Producto | null> {
  if (producto.id) {
    const { id, ...dataToUpdate } = producto
    const { data, error } = await supabase
      .from('arneses_productos')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    // Excluimos explícitamente el campo 'id' para que la base genere el próximo autoincrement
    const { id, ...dataToInsert } = producto
    const { data, error } = await supabase
      .from('arneses_productos')
      .insert([dataToInsert])
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export async function deleteProducto(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('arneses_productos')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

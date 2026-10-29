/**
 * Utilidad nativa para comprimir y redimensionar imágenes en el navegador
 * antes de enviarlas a Supabase Storage.
 * Convierte automáticamente a formato WebP optimizado sin librerías externas.
 */
export async function comprimirImagen(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1600,
  quality: number = 0.8
): Promise<File> {
  // Si no es imagen, devolvemos el archivo original
  if (!file.type.startsWith('image/')) {
    return file
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    reader.onerror = (err) => reject(err)

    img.onload = () => {
      let width = img.width
      let height = img.height

      // Redimensionamiento proporcional
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height)
        height = maxHeight
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return resolve(file)
      }

      // Renderizado de alta calidad
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      // Conversión a WebP optimizado
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve(file)
          }

          const baseName = file.name.replace(/\.[^/.]+$/, '')
          const archivoComprimido = new File([blob], `${baseName}.webp`, {
            type: 'image/webp',
            lastModified: Date.now(),
          })

          resolve(archivoComprimido)
        },
        'image/webp',
        quality
      )
    }

    img.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

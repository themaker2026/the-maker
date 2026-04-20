'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews]   = useState([])
  const supabase = createClient()

  const uploadImages = useCallback(async (files) => {
    if (!files || files.length === 0) return []
    const remaining = 4 - previews.length
    if (remaining <= 0) return []

    const filesToUpload = Array.from(files).slice(0, remaining)
    setUploading(true)

    const urls = []

    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 5 * 1024 * 1024) continue

      const ext      = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const path     = `products/${filename}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: false })

      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(path)
        urls.push({ url: publicUrl, path })
      }
    }

    setPreviews((prev) => [...prev, ...urls])
    setUploading(false)
    return urls
  }, [previews, supabase])

  const removeImage = useCallback(async (index) => {
    const item = previews[index]
    if (item?.path) {
      await supabase.storage
        .from('product-images')
        .remove([item.path])
    }
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }, [previews, supabase])

  const setExistingImages = useCallback((urls) => {
    setPreviews(urls.map((url) => ({ url, path: null })))
  }, [])

  return {
    previews,
    uploading,
    uploadImages,
    removeImage,
    setExistingImages,
    imageUrls: previews.map((p) => p.url),
  }
}
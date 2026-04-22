'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select(`
          id, name, slug, description,
          products(count)
        `)
        .order('display_order', { ascending: true })

      if (data) {
        const mapped = data.map((cat) => ({
          ...cat,
          product_count: cat.products?.[0]?.count || 0,
        }))
        setCategories(mapped)
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  return { categories, loading }
}
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import s from '../dashboard.module.css'

export default function CategoriesPage() {
  const supabase = createClient()
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [adding, setAdding]         = useState(false)
  const [toast, setToast]           = useState(null)
  const [form, setForm]             = useState({ name: '', description: '' })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    supabase
      .from('categories')
      .select('*, products(count)')
      .order('display_order')
      .then(({ data }) => {
        setCategories(data || [])
        setLoading(false)
      })
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return

    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: form.name.trim(),
        slug,
        description: form.description.trim() || null,
        display_order: categories.length + 1,
      })
      .select()
      .single()

    if (error) {
      showToast('Failed to add category.', 'error')
      return
    }

    setCategories((prev) => [...prev, data])
    setForm({ name: '', description: '' })
    setAdding(false)
    showToast(`"${data.name}" added.`)
  }

  return (
    <>
      <div className={s.page_header}>
        <h1 className={s.page_title}>Categories</h1>
        <button
          className={s.btn_primary}
          onClick={() => setAdding(!adding)}
        >
          + Add Category
        </button>
      </div>

      {adding && (
        <div className={s.section_card} style={{ marginBottom: '20px' }}>
          <div className={s.section_card_header}>
            <h2 className={s.section_card_title}>New Category</h2>
          </div>
          <form onSubmit={handleAdd}>
            <div className={s.form_grid}>
              <div className={s.field}>
                <label className={s.field_label}>Category Name *</label>
                <input
                  type="text"
                  className={s.field_input}
                  placeholder="e.g. Figurines"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className={s.field}>
                <label className={s.field_label}>Description</label>
                <input
                  type="text"
                  className={s.field_input}
                  placeholder="Short description"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>
            <div className={s.form_actions}>
              <button type="button" className={s.btn_secondary} onClick={() => setAdding(false)}>
                Cancel
              </button>
              <button type="submit" className={s.btn_primary}>
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={s.section_card}>
        {loading ? (
          <div className={s.loading}>Loading...</div>
        ) : (
          <div className={s.table_wrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Products</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: 500 }}>{cat.name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-sage)' }}>
                      {cat.slug}
                    </td>
                    <td>{cat.description || '—'}</td>
                    <td>{cat.products?.[0]?.count || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && (
        <div className={`${s.toast} ${toast.type === 'error' ? s.toast_error : s.toast_success}`}>
          {toast.message}
        </div>
      )}
    </>
  )
}
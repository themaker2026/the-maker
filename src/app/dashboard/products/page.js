'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import s from '../dashboard.module.css'

export default function DashboardProductsPage() {
  const supabase = createClient()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [toast, setToast]       = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, name, slug, images, is_active, is_featured, categories(name)')
      .order('created_at', { ascending: false })

    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id, name) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      showToast('Failed to delete product.', 'error')
      return
    }

    setProducts((prev) => prev.filter((p) => p.id !== id))
    showToast(`"${name}" deleted.`)
  }

  const handleToggle = async (id, field, value) => {
    const { error } = await supabase
      .from('products')
      .update({ [field]: !value })
      .eq('id', id)

    if (!error) {
      setProducts((prev) =>
        prev.map((p) => p.id === id ? { ...p, [field]: !value } : p)
      )
    }
  }

  return (
    <>
      <div className={s.page_header}>
        <h1 className={s.page_title}>Products</h1>
        <Link href="/dashboard/products/new" className={s.btn_primary}>
          + Add New Product
        </Link>
      </div>

      <div className={s.section_card}>
        {loading ? (
          <div className={s.loading}>Loading products...</div>
        ) : products.length === 0 ? (
          <div className={s.empty_state}>
            <p className={s.empty_state_title}>No products yet</p>
            <p className={s.empty_state_body}>Add your first product to populate the catalogue.</p>
            <Link href="/dashboard/products/new" className={s.btn_primary}>
              + Add Product
            </Link>
          </div>
        ) : (
          <div className={s.table_wrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Active</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className={s.product_name_cell}>
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className={s.product_thumb}
                          />
                        ) : (
                          <div className={s.product_thumb_placeholder}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#BFC6C4" strokeWidth="1.5"/>
                            </svg>
                          </div>
                        )}
                        {product.name}
                      </div>
                    </td>
                    <td>{product.categories?.name || '—'}</td>
                    <td>
                      <label className={s.toggle}>
                        <input
                          type="checkbox"
                          checked={product.is_active}
                          onChange={() => handleToggle(product.id, 'is_active', product.is_active)}
                        />
                        <span className={s.toggle_slider} />
                      </label>
                    </td>
                    <td>
                      <label className={s.toggle}>
                        <input
                          type="checkbox"
                          checked={product.is_featured}
                          onChange={() => handleToggle(product.id, 'is_featured', product.is_featured)}
                        />
                        <span className={s.toggle_slider} />
                      </label>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className={s.btn_secondary}
                          style={{ fontSize: '12px', padding: '5px 10px' }}
                        >
                          Edit
                        </Link>
                        <button
                          className={s.btn_danger}
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
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
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useImageUpload } from '@/hooks/useImageUpload'
import ImageUpload from './ImageUpload'
import s from '@/app/dashboard/dashboard.module.css'

export default function ProductForm({ product = null }) {
  const router   = useRouter()
  const supabase = createClient()
  const isEdit   = !!product

  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [toast, setToast]           = useState(null)

  const [form, setForm] = useState({
    name:        product?.name        || '',
    slug:        product?.slug        || '',
    description: product?.description || '',
    category_id: product?.category_id || '',
    material:    product?.material    || '',
    finish:      product?.finish      || '',
    dimensions:  product?.dimensions  || '',
    weight:      product?.weight      || '',
    moq:         product?.moq         || 1,
    is_active:   product?.is_active   ?? true,
    is_featured: product?.is_featured ?? false,
  })

  const {
    previews,
    uploading,
    uploadImages,
    removeImage,
    setExistingImages,
    imageUrls,
  } = useImageUpload()

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name')
      .order('display_order')
      .then(({ data }) => setCategories(data || []))

    if (product?.images?.length) {
      setExistingImages(product.images)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (name === 'name' && !isEdit) {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim(),
      }))
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Product name is required.'); return }
    if (!form.category_id) { setError('Please select a category.'); return }

    setLoading(true)
    setError('')

    const payload = {
      ...form,
      moq: parseInt(form.moq) || 1,
      images: imageUrls,
    }

    let dbError

    if (isEdit) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id)
      dbError = error
    } else {
      const { error } = await supabase
        .from('products')
        .insert(payload)
      dbError = error
    }

    setLoading(false)

    if (dbError) {
      setError(dbError.message || 'Something went wrong.')
      return
    }

    showToast(isEdit ? 'Product updated.' : 'Product added.')
    setTimeout(() => router.push('/dashboard/products'), 1000)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={s.section_card}>
          <div className={s.section_card_header}>
            <h2 className={s.section_card_title}>
              {isEdit ? 'Edit Product' : 'New Product'}
            </h2>
          </div>

          <div className={s.form_grid}>
            {error && (
              <div className={`${s.form_full}`}>
                <p className={s.login_error}>{error}</p>
              </div>
            )}

            {/* Name */}
            <div className={s.field}>
              <label className={s.field_label}>
                Product Name <span className={s.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                className={s.field_input}
                placeholder="e.g. Temple Bell — Large"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Slug */}
            <div className={s.field}>
              <label className={s.field_label}>URL Slug</label>
              <input
                type="text"
                name="slug"
                className={s.field_input}
                placeholder="temple-bell-large"
                value={form.slug}
                onChange={handleChange}
                disabled={isEdit}
              />
            </div>

            {/* Category */}
            <div className={s.field}>
              <label className={s.field_label}>
                Category <span className={s.required}>*</span>
              </label>
              <select
                name="category_id"
                className={`${s.field_input} ${s.field_select}`}
                value={form.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Material */}
            <div className={s.field}>
              <label className={s.field_label}>Material</label>
              <input
                type="text"
                name="material"
                className={s.field_input}
                placeholder="e.g. Premium Brass"
                value={form.material}
                onChange={handleChange}
              />
            </div>

            {/* Finish */}
            <div className={s.field}>
              <label className={s.field_label}>Finish</label>
              <input
                type="text"
                name="finish"
                className={s.field_input}
                placeholder="e.g. Polished / Antique"
                value={form.finish}
                onChange={handleChange}
              />
            </div>

            {/* MOQ */}
            <div className={s.field}>
              <label className={s.field_label}>MOQ (pieces)</label>
              <input
                type="number"
                name="moq"
                className={s.field_input}
                placeholder="50"
                value={form.moq}
                onChange={handleChange}
                min="1"
              />
            </div>

            {/* Dimensions */}
            <div className={s.field}>
              <label className={s.field_label}>Dimensions</label>
              <input
                type="text"
                name="dimensions"
                className={s.field_input}
                placeholder="e.g. 15cm × 10cm"
                value={form.dimensions}
                onChange={handleChange}
              />
            </div>

            {/* Weight */}
            <div className={s.field}>
              <label className={s.field_label}>Weight</label>
              <input
                type="text"
                name="weight"
                className={s.field_input}
                placeholder="e.g. 450g"
                value={form.weight}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className={`${s.field} ${s.form_full}`}>
              <label className={s.field_label}>Description</label>
              <textarea
                name="description"
                className={`${s.field_input} ${s.field_textarea}`}
                placeholder="Describe the product — materials, craftsmanship, use case..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Images */}
            <div className={`${s.field} ${s.form_full}`}>
              <label className={s.field_label}>
                Product Images
                <span style={{ fontWeight: 400, color: 'var(--color-sage)', marginLeft: '6px' }}>
                  (up to 4 · first image is the main display)
                </span>
              </label>
              <ImageUpload
                previews={previews}
                uploading={uploading}
                onUpload={uploadImages}
                onRemove={removeImage}
              />
            </div>

            {/* Toggles */}
            <div className={`${s.form_full}`}>
              <div className={s.toggle_row}>
                <div>
                  <p className={s.toggle_label}>Active — visible on the website</p>
                  <p className={s.toggle_sub}>Turn off to hide this product without deleting it</p>
                </div>
                <label className={s.toggle}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                  />
                  <span className={s.toggle_slider} />
                </label>
              </div>

              <div className={s.toggle_row}>
                <div>
                  <p className={s.toggle_label}>Featured — show on homepage</p>
                  <p className={s.toggle_sub}>Featured products appear in the homepage section</p>
                </div>
                <label className={s.toggle}>
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={form.is_featured}
                    onChange={handleChange}
                  />
                  <span className={s.toggle_slider} />
                </label>
              </div>
            </div>
          </div>

          <div className={s.form_actions}>
            <button
              type="button"
              className={s.btn_secondary}
              onClick={() => router.push('/dashboard/products')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={s.btn_primary}
              disabled={loading || uploading}
            >
              {loading
                ? 'Saving...'
                : isEdit ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </div>
      </form>

      {toast && (
        <div className={`${s.toast} ${toast.type === 'error' ? s.toast_error : s.toast_success}`}>
          {toast.message}
        </div>
      )}
    </>
  )
}
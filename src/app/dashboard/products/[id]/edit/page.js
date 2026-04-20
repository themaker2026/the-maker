import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/dashboard/ProductForm'
import s from '../../../dashboard.module.css'

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <>
      <div className={s.page_header}>
        <h1 className={s.page_title}>Edit Product</h1>
      </div>
      <ProductForm product={product} />
    </>
  )
}
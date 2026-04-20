import ProductForm from '@/components/dashboard/ProductForm'
import s from '../../dashboard.module.css'

export default function NewProductPage() {
  return (
    <>
      <div className={s.page_header}>
        <h1 className={s.page_title}>Add New Product</h1>
      </div>
      <ProductForm />
    </>
  )
}
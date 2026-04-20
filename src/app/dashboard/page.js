import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import s from './dashboard.module.css'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalProducts },
    { count: newInquiries },
    { count: featuredProducts },
    { data: recentInquiries },
    { data: recentProducts },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id, name, slug, images, is_active, is_featured, categories(name)').order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <>
      <div className={s.page_header}>
        <h1 className={s.page_title}>Dashboard</h1>
        <Link href="/dashboard/products/new" className={s.btn_primary}>
          + Add New Product
        </Link>
      </div>

      {/* Stats */}
      <div className={s.stats_row}>
        <div className={s.stat_card}>
          <p className={s.stat_label}>Total Products</p>
          <p className={s.stat_value}>{totalProducts || 0}</p>
        </div>
        <div className={s.stat_card}>
          <p className={s.stat_label}>New Inquiries</p>
          <p className={`${s.stat_value} ${newInquiries ? s.stat_value_teal : ''}`}>
            {newInquiries || 0}
          </p>
        </div>
        <div className={s.stat_card}>
          <p className={s.stat_label}>Featured</p>
          <p className={s.stat_value}>{featuredProducts || 0}</p>
        </div>
        <div className={s.stat_card}>
          <p className={s.stat_label}>Live Site</p>
          <a
            href="https://the-maker-arham2004ms-projects.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className={s.btn_primary}
            style={{ marginTop: '8px', fontSize: '12px', padding: '7px 14px' }}
          >
            View Site ↗
          </a>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className={s.section_card}>
        <div className={s.section_card_header}>
          <h2 className={s.section_card_title}>Recent Inquiries</h2>
          <Link href="/dashboard/inquiries" className={s.btn_secondary}>
            View All
          </Link>
        </div>

        {!recentInquiries?.length ? (
          <div className={s.empty_state}>
            <p className={s.empty_state_body}>No inquiries yet — they'll appear here when buyers contact you.</p>
          </div>
        ) : (
          <div>
            {recentInquiries.map((inq) => (
              <div
                key={inq.id}
                className={`${s.inquiry_card} ${inq.status === 'new' ? s.inquiry_card_new : ''}`}
              >
                <div>
                  <p className={s.inquiry_name}>{inq.name}</p>
                  <p className={s.inquiry_email}>{inq.email}{inq.country ? ` · ${inq.country}` : ''}</p>
                </div>
                <p className={s.inquiry_product}>{inq.product_name || '—'}</p>
                <p className={s.inquiry_time}>
                  {new Date(inq.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>
                <span className={`${s.badge} ${
                  inq.status === 'new' ? s.badge_new :
                  inq.status === 'replied' ? s.badge_replied : s.badge_read
                }`}>
                  {inq.status.charAt(0).toUpperCase() + inq.status.slice(1)}
                </span>
                <Link
                  href="/dashboard/inquiries"
                  className={s.btn_secondary}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Products */}
      <div className={s.section_card}>
        <div className={s.section_card_header}>
          <h2 className={s.section_card_title}>Products</h2>
          <Link href="/dashboard/products" className={s.btn_secondary}>
            View All
          </Link>
        </div>

        {!recentProducts?.length ? (
          <div className={s.empty_state}>
            <p className={s.empty_state_title}>No products yet</p>
            <p className={s.empty_state_body}>Add your first product to get started.</p>
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
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => (
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
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#BFC6C4" strokeWidth="1.5"/>
                              <circle cx="8.5" cy="8.5" r="1.5" stroke="#BFC6C4" strokeWidth="1.5"/>
                              <path d="M21 15l-5-5L5 21" stroke="#BFC6C4" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                        )}
                        {product.name}
                      </div>
                    </td>
                    <td>{product.categories?.name || '—'}</td>
                    <td>
                      <span className={`${s.badge} ${product.is_active ? s.badge_active : s.badge_inactive}`}>
                        {product.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      {product.is_featured && (
                        <span className={`${s.badge} ${s.badge_featured}`}>Featured</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className={s.btn_secondary}
                          style={{ fontSize: '12px', padding: '5px 10px' }}
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
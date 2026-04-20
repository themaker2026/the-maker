'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import s from '../dashboard.module.css'

const STATUS_OPTIONS = ['new', 'read', 'replied']

export default function InquiriesPage() {
  const supabase = createClient()
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')
  const [toast, setToast]         = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchInquiries = async () => {
    let q = supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') q = q.eq('status', filter)

    const { data } = await q
    setInquiries(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchInquiries() }, [filter])

  const handleStatusChange = async (id, status) => {
    const { error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setInquiries((prev) =>
        prev.map((inq) => inq.id === id ? { ...inq, status } : inq)
      )
      showToast(`Marked as ${status}.`)
    }
  }

  const filtered = inquiries.filter(
    (inq) => filter === 'all' || inq.status === filter
  )

  return (
    <>
      <div className={s.page_header}>
        <h1 className={s.page_title}>Inquiries</h1>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', ...STATUS_OPTIONS].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? s.btn_primary : s.btn_secondary}
              style={{ fontSize: '12px', padding: '6px 14px', textTransform: 'capitalize' }}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={s.section_card}>
        {loading ? (
          <div className={s.loading}>Loading inquiries...</div>
        ) : filtered.length === 0 ? (
          <div className={s.empty_state}>
            <p className={s.empty_state_title}>No inquiries</p>
            <p className={s.empty_state_body}>
              {filter === 'all'
                ? 'When buyers contact you, their messages will appear here.'
                : `No ${filter} inquiries.`}
            </p>
          </div>
        ) : (
          filtered.map((inq) => (
            <div
              key={inq.id}
              style={{
                padding: '20px 24px',
                borderBottom: '0.5px solid #F5F5F5',
                background: inq.status === 'new' ? '#FAFFFE' : 'transparent',
                borderLeft: inq.status === 'new' ? '3px solid #007677' : '3px solid transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <p className={s.inquiry_name}>{inq.name}</p>
                    <span className={`${s.badge} ${
                      inq.status === 'new' ? s.badge_new :
                      inq.status === 'replied' ? s.badge_replied : s.badge_read
                    }`}>
                      {inq.status.charAt(0).toUpperCase() + inq.status.slice(1)}
                    </span>
                  </div>
                  <p className={s.inquiry_email}>
                    <a href={`mailto:${inq.email}`} style={{ color: 'var(--color-teal)' }}>
                      {inq.email}
                    </a>
                    {inq.phone && ` · ${inq.phone}`}
                    {inq.country && ` · ${inq.country}`}
                    {inq.company && ` · ${inq.company}`}
                  </p>
                  {inq.product_name && (
                    <p className={s.inquiry_product} style={{ marginTop: '4px' }}>
                      Product: {inq.product_name}
                    </p>
                  )}
                  {inq.message && (
                    <p className={s.inquiry_message} style={{ marginTop: '8px' }}>
                      {inq.message}
                    </p>
                  )}
                  <p className={s.inquiry_time} style={{ marginTop: '8px' }}>
                    {new Date(inq.created_at).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Status actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flexShrink: 0 }}>
                  {inq.status !== 'read' && (
                    <button
                      className={s.btn_secondary}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => handleStatusChange(inq.id, 'read')}
                    >
                      Mark Read
                    </button>
                  )}
                  {inq.status !== 'replied' && (
                    <button
                      className={s.btn_primary}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => handleStatusChange(inq.id, 'replied')}
                    >
                      Mark Replied
                    </button>
                  )}
                  <a
                    href={`mailto:${inq.email}?subject=Re: Your enquiry about ${inq.product_name || 'our products'} — The Maker`}
                    className={s.btn_secondary}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Reply by Email ↗
                  </a>
                </div>
              </div>
            </div>
          ))
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
'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import s from '@/app/dashboard/dashboard.module.css'

export default function ImageUpload({ previews, uploading, onUpload, onRemove }) {
  const inputRef  = useRef()
  const [drag, setDrag] = useState(false)

  const handleFiles = (files) => {
    if (previews.length >= 4) return
    onUpload(files)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    handleFiles(e.dataTransfer.files)
  }

  const remaining = 4 - previews.length

  return (
    <div>
      {remaining > 0 && (
        <div
          className={`${s.upload_area} ${drag ? s.upload_area_drag : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#BFC6C4" strokeWidth="1.5" strokeLinecap="round"/>
            <polyline points="17 8 12 3 7 8" stroke="#BFC6C4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="3" x2="12" y2="15" stroke="#BFC6C4" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className={s.upload_area_text}>
            {uploading
              ? 'Uploading...'
              : <>Drop images here or <span className={s.upload_area_link}>browse</span></>
            }
          </p>
          <p className={s.upload_area_sub}>
            {remaining} image{remaining !== 1 ? 's' : ''} remaining · Max 5MB each · JPG, PNG, WebP
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading}
          />
        </div>
      )}

      {previews.length > 0 && (
        <div className={s.image_previews}>
          {previews.map((item, i) => (
            <div key={i} className={s.image_preview_item}>
              <Image
                src={item.url}
                alt={`Product image ${i + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="120px"
                unoptimized={process.env.NODE_ENV === 'development'}
              />
              <span className={s.image_preview_order}>{i + 1}</span>
              <button
                type="button"
                className={s.image_preview_remove}
                onClick={(e) => { e.stopPropagation(); onRemove(i) }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
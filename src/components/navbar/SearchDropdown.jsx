"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import s from "./SearchDropdown.module.css";

export default function SearchDropdown({ suggestions, query, onSelect }) {
  const router = useRouter();

  const handleClick = (item) => {
    onSelect(item);
    router.push(item.href);
  };

  const handleSearchAll = () => {
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!suggestions.length) return null;

  return (
    <div className={s.dropdown}>
      {suggestions.map((item, index) => {
        if (item.type === "section") {
          return (
            <div key={`section-${index}`} className={s.section_label}>
              {item.label}
            </div>
          );
        }

        if (item.type === "category") {
          return (
            <button
              key={item.id}
              className={s.item}
              onClick={() => handleClick(item)}
            >
              <span className={`${s.item_icon} ${s.item_icon_category}`}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="1"
                    y="1"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <rect
                    x="9"
                    y="1"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <rect
                    x="1"
                    y="9"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <rect
                    x="9"
                    y="9"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </span>
              <span className={s.item_name}>{item.name}</span>
              <span className={s.item_type}>Category</span>
            </button>
          );
        }

        if (item.type === "product") {
          return (
            <button
              key={item.id}
              className={s.item}
              onClick={() => handleClick(item)}
            >
              <span className={`${s.item_icon} ${s.item_icon_product}`}>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={28}
                    height={28}
                    style={{ objectFit: "cover", borderRadius: "4px" }}
                  />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 4h12M2 8h12M2 12h7"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </span>
              <span className={s.item_name}>{item.name}</span>
              <span className={s.item_type}>Product</span>
            </button>
          );
        }

        return null;
      })}

      <button className={s.view_all} onClick={handleSearchAll}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle
            cx="6.5"
            cy="6.5"
            r="5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M10.5 10.5L14 14"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        View all results for &ldquo;{query}&rdquo;
      </button>
    </div>
  );
}

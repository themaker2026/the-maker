"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef(null);
  const supabase = createClient();

  const fetchSuggestions = useCallback(
    async (searchQuery) => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);

      try {
        const trimmed = searchQuery.trim();

        const [productsRes, categoriesRes] = await Promise.all([
          supabase
            .from("products")
            .select("id, name, slug, category_id, images")
            .textSearch("fts", trimmed, { type: "websearch" })
            .eq("is_active", true)
            .limit(5),

          supabase
            .from("categories")
            .select("id, name, slug")
            .ilike("name", `%${trimmed}%`)
            .limit(3),
        ]);

        const results = [];

        if (categoriesRes.data?.length > 0) {
          results.push({
            type: "section",
            label: "Categories",
          });
          categoriesRes.data.forEach((cat) => {
            results.push({
              type: "category",
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              href: `/products?category=${cat.slug}`,
            });
          });
        }

        if (productsRes.data?.length > 0) {
          results.push({
            type: "section",
            label: "Products",
          });
          productsRes.data.forEach((product) => {
            results.push({
              type: "product",
              id: product.id,
              name: product.name,
              slug: product.slug,
              image: product.images?.[0] || null,
              href: `/products/${product.slug}`,
            });
          });
        }

        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (err) {
        console.error("Search error:", err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [supabase],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, fetchSuggestions]);

  const handleSelect = useCallback((item) => {
    setQuery(item.name);
    setIsOpen(false);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      if (e) e.preventDefault();
      if (query.trim()) {
        setIsOpen(false);
      }
    },
    [query],
  );

  const clear = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    isOpen,
    setIsOpen,
    handleSelect,
    handleSubmit,
    clear,
  };
}

import axios from 'axios'

export type Product = {
  id?: number
  name: string
  brand: string
  category: string
  price: number
  currency?: string
  thumbnail?: string
  source_url?: string
}

export type SearchParams = {
  query: string
  brand?: string
  category?: string
  priceRange?: [number, number]
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
})

export async function fetchProducts(params: SearchParams): Promise<Product[]> {
  const { query, brand, category, priceRange } = params
  const priceFilters = priceRange
    ? { min_price: priceRange[0], max_price: priceRange[1] }
    : {}

  const { data } = await client.get('/products/search', {
    params: { q: query, brand, category, ...priceFilters },
  })
  return data
}

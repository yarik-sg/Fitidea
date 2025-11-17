import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts, Product } from './api/products'
import { Hero, ProductCard, FilterBar } from './components'

function App() {
  const [query, setQuery] = useState('whey isolate')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('whey')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150])

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', query, brand, category, priceRange],
    queryFn: () => fetchProducts({ query, brand, category, priceRange }),
  })

  const products = useMemo(() => data ?? [], [data])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Hero onSearch={setQuery} />
        <FilterBar
          brand={brand}
          category={category}
          priceRange={priceRange}
          onBrandChange={setBrand}
          onCategoryChange={setCategory}
          onPriceChange={setPriceRange}
        />

        {isLoading && <p className="mt-8 text-slate-500">Chargement des produits...</p>}
        {error && <p className="mt-8 text-red-500">Impossible de charger les produits.</p>}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product: Product) => (
            <ProductCard key={product.id ?? product.source_url} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App

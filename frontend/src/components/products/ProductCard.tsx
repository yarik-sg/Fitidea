import { Product } from '../../api/products'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {product.thumbnail && (
        <img src={product.thumbnail} alt={product.name} className="h-40 w-full rounded-xl object-cover" />
      )}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{product.brand}</p>
          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
          <p className="text-sm text-slate-500">{product.category}</p>
        </div>
        <div className="rounded-lg bg-slate-100 px-3 py-2 text-right">
          <p className="text-sm font-semibold text-slate-700">
            {product.price.toFixed(2)} {product.currency ?? 'EUR'}
          </p>
          {product.source_url && (
            <a className="text-xs text-indigo-600 hover:underline" href={product.source_url} target="_blank" rel="noreferrer">
              Voir l&apos;offre
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

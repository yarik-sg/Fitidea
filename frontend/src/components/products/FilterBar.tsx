interface Props {
  brand: string
  category: string
  priceRange: [number, number]
  onBrandChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onPriceChange: (value: [number, number]) => void
}

const categories = ['whey', 'bcaa', 'creatine', 'accessoires', 'vetements']

export function FilterBar({ brand, category, priceRange, onBrandChange, onCategoryChange, onPriceChange }: Props) {
  return (
    <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Marque
        <input
          value={brand}
          onChange={(e) => onBrandChange(e.target.value)}
          placeholder="Optimum Nutrition, MyProtein..."
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Catégorie
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none"
        >
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Prix max ({priceRange[1]}€)
        <input
          type="range"
          min={10}
          max={200}
          step={5}
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="accent-indigo-500"
        />
      </label>
    </div>
  )
}

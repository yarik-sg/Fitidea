import { FormEvent, useState } from 'react'

interface Props {
  onSearch: (query: string) => void
}

export function Hero({ onSearch }: Props) {
  const [value, setValue] = useState('whey isolate')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSearch(value)
  }

  return (
    <section className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-10 text-white shadow-lg">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-indigo-100">Fitidea</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Trouve la meilleure whey et tes compléments</h1>
          <p className="mt-3 max-w-2xl text-indigo-100">
            Comparateur en temps réel, filtres avancés, favoris personnels et programmes d&apos;entraînement pour rester motivé.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
          <input
            type="search"
            placeholder="Ex: whey isolate chocolat"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 rounded-xl border-0 bg-white/90 px-4 py-3 text-slate-900 shadow focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="rounded-xl bg-white px-4 py-3 font-semibold text-indigo-600 shadow transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Rechercher
          </button>
        </form>
      </div>
    </section>
  )
}

import React from "react";

const formatPrice = (value) => {
  if (value === undefined || value === null) return null;

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return null;

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
};

function OfferTable({ offers = [] }) {
  if (!offers.length) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
        Aucune offre disponible pour le moment.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-orange-100 bg-white shadow-sm">
      <div className="hidden grid-cols-[1.5fr,1fr,1fr,0.8fr] bg-orange-50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-orange-700 sm:grid">
        <div>Marchand</div>
        <div>Prix</div>
        <div>Livraison</div>
        <div className="text-right">Action</div>
      </div>
      <div className="divide-y divide-orange-100">
        {offers.map((offer) => {
          const priceLabel = formatPrice(offer.price);
          return (
            <div
              key={offer.id || offer.title}
              className="grid grid-cols-1 gap-4 px-4 py-4 transition hover:bg-orange-50 sm:grid-cols-[1.5fr,1fr,1fr,0.8fr] sm:px-6 sm:py-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl text-orange-500">
                  {offer.logo ? (
                    <img
                      src={offer.logo}
                      alt={offer.seller || offer.title || "Marchand"}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    "🛒"
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {offer.seller || offer.title || "Marchand partenaire"}
                  </p>
                  {offer.description ? (
                    <p className="line-clamp-2 text-xs text-gray-600">{offer.description}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-2 text-lg font-bold text-orange-600 sm:justify-center">
                {priceLabel ? `${priceLabel}€` : "Prix N/D"}
              </div>

              <div className="space-y-1 text-sm text-gray-600 sm:flex sm:flex-col sm:items-start sm:justify-center">
                {offer.shipping ? (
                  <p className="font-semibold text-gray-800">{offer.shipping}</p>
                ) : (
                  <p className="font-semibold text-gray-800">Livraison non renseignée</p>
                )}
                {offer.delivery_time ? (
                  <p className="text-xs text-gray-500">{offer.delivery_time}</p>
                ) : null}
              </div>

              <div className="flex items-center justify-start sm:justify-end">
                {offer.url ? (
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-100 transition hover:bg-orange-600"
                  >
                    Voir l'offre
                  </a>
                ) : (
                  <span className="text-xs font-semibold text-gray-400">Lien indisponible</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OfferTable;

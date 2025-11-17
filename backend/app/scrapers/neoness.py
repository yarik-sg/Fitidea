from datetime import datetime


def fetch_neoness_gyms() -> list[dict]:
    base_url = "https://www.neoness.fr/clubs"
    return [
        {
            "name": "Neoness Paris Montparnasse",
            "brand": "neoness",
            "address": "36 Rue du Départ, 75015 Paris",
            "city": "Paris",
            "country": "France",
            "latitude": 48.8424,
            "longitude": 2.3224,
            "url": base_url,
            "image_url": "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?auto=format&fit=crop&w=900&q=80",
            "opened_24_7": False,
            "last_synced": datetime.utcnow(),
        }
    ]

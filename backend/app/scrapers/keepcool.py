from datetime import datetime


def fetch_keepcool_gyms() -> list[dict]:
    base_url = "https://www.keepcool.fr/salle-de-sport"
    return [
        {
            "name": "KeepCool Marseille Vieux-Port",
            "brand": "keepcool",
            "address": "24 Quai de Rive Neuve, 13007 Marseille",
            "city": "Marseille",
            "country": "France",
            "latitude": 43.2916,
            "longitude": 5.3689,
            "url": base_url,
            "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c8c2d9b?auto=format&fit=crop&w=900&q=80",
            "opened_24_7": False,
            "last_synced": datetime.utcnow(),
        }
    ]

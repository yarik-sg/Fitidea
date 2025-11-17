from datetime import datetime


def fetch_fitnesspark_gyms() -> list[dict]:
    base_url = "https://www.fitnesspark.fr/club/"
    return [
        {
            "name": "Fitness Park La Défense",
            "brand": "fitnesspark",
            "address": "15 Parvis de La Défense, 92800 Puteaux",
            "city": "Paris",
            "country": "France",
            "latitude": 48.8919,
            "longitude": 2.2383,
            "url": base_url,
            "image_url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
            "opened_24_7": True,
            "last_synced": datetime.utcnow(),
        }
    ]

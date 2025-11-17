from datetime import datetime


def fetch_onair_gyms() -> list[dict]:
    base_url = "https://onair-fitness.fr/club/"
    return [
        {
            "name": "OnAir Fitness Bordeaux",
            "brand": "onair",
            "address": "Quai des Chartrons, 33000 Bordeaux",
            "city": "Bordeaux",
            "country": "France",
            "latitude": 44.855,
            "longitude": -0.566,
            "url": base_url,
            "image_url": "https://images.unsplash.com/photo-1508766206392-8bd5cf550d1b?auto=format&fit=crop&w=900&q=80",
            "opened_24_7": True,
            "last_synced": datetime.utcnow(),
        }
    ]

from datetime import datetime


def fetch_basicfit_gyms() -> list[dict]:
    """Return a curated subset of Basic-Fit gyms.

    A full Playwright-based scraper can be plugged here; we keep the
    implementation lightweight to avoid runtime/browser requirements while
    preserving the expected contract for the sync pipeline.
    """

    base_url = "https://www.basic-fit.com/fr-fr/salles-de-sport"
    return [
        {
            "name": "Basic-Fit Paris République",
            "brand": "basicfit",
            "address": "14 Boulevard de Magenta, 75010 Paris",
            "city": "Paris",
            "country": "France",
            "latitude": 48.8686,
            "longitude": 2.3637,
            "url": base_url,
            "image_url": "https://images.unsplash.com/photo-1554344058-8d1d1bc29b6a?auto=format&fit=crop&w=900&q=80",
            "opened_24_7": False,
            "last_synced": datetime.utcnow(),
        }
    ]

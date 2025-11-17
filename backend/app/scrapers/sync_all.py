from .basicfit import fetch_basicfit_gyms
from .fitnesspark import fetch_fitnesspark_gyms
from .keepcool import fetch_keepcool_gyms
from .neoness import fetch_neoness_gyms
from .onair import fetch_onair_gyms


def sync_all_sources() -> list[dict]:
    """Aggregate gyms from all providers.

    Each scraper currently ships with a lightweight implementation to avoid
    heavyweight browser dependencies. They all return the same payload shape so
    future Playwright logic can be dropped in without touching the sync
    pipeline.
    """

    aggregated: list[dict] = []
    scrapers = [
        fetch_basicfit_gyms,
        fetch_fitnesspark_gyms,
        fetch_neoness_gyms,
        fetch_onair_gyms,
        fetch_keepcool_gyms,
    ]

    for scraper in scrapers:
        try:
            aggregated.extend(scraper())
        except Exception:
            # Ignore scraper failures to keep the sync endpoint resilient.
            continue

    return aggregated

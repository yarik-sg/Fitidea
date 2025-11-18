from __future__ import annotations

from typing import Optional

from redis.asyncio import Redis
from sqlalchemy.orm import Session

from app.models.product import Product
from app.services.product_scraper_service import scrape_product


async def ingest_product(url: str, source: str, db: Session, redis: Optional[Redis] = None) -> Product:
    """
    - Scrape le produit
    - Normalise les données
    - Update ou create en base
    - Retourne le produit
    """
    scraped = await scrape_product(url, source, redis)

    product = db.query(Product).filter(Product.url == url).first()
    if not product:
        product = Product(url=url)
        db.add(product)

    product.name = scraped.get("name") or product.name
    product.description = scraped.get("description") or product.description
    product.price = scraped.get("price")
    product.brand = scraped.get("brand")
    product.category = scraped.get("category")
    product.rating = scraped.get("rating")
    product.reviews_count = scraped.get("reviews_count")
    product.images = scraped.get("images")
    product.source = scraped.get("source") or source

    db.commit()
    db.refresh(product)
    return product

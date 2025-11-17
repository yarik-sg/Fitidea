from decimal import Decimal

from fastapi import status

from app.models.offer import Offer
from app.models.product import Product


def create_product_with_offer(db_session, name="Protein", price=Decimal("19.99")):
    product = Product(name=name, description="Great product", price=price)
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    offer = Offer(title="Gym Shop", description="Special offer", price=price, product_id=product.id)
    db_session.add(offer)
    db_session.commit()
    db_session.refresh(offer)

    return product, offer


def test_list_products_returns_paginated_results(client, db_session):
    for idx in range(3):
        create_product_with_offer(db_session, name=f"Product {idx}", price=Decimal("10.00") + idx)

    response = client.get("/api/products?page=1&page_size=2")

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["total"] == 3
    assert data["page"] == 1
    assert data["page_size"] == 2
    assert len(data["items"]) == 2


def test_get_product_returns_offers(client, db_session):
    product, offer = create_product_with_offer(db_session)

    response = client.get(f"/api/products/{product.id}")

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == product.id
    assert data["offers"][0]["id"] == offer.id
    assert str(data["offers"][0]["price"]) == str(offer.price)


def test_get_product_offers_endpoint(client, db_session):
    product, offer = create_product_with_offer(db_session)

    response = client.get(f"/api/products/{product.id}/offers")

    assert response.status_code == status.HTTP_200_OK
    offers = response.json()
    assert len(offers) == 1
    assert offers[0]["id"] == offer.id

from decimal import Decimal

from fastapi import status

from app.models.favorite import Favorite
from app.models.offer import Offer
from app.models.product import Product


def create_product_and_offer(db_session):
    product = Product(name="Yoga Mat", description="Comfortable mat", price=Decimal("30.00"))
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    offer = Offer(title="Local Gym", description="", price=Decimal("25.00"), product_id=product.id)
    db_session.add(offer)
    db_session.commit()
    db_session.refresh(offer)

    return product, offer


def test_add_favorite_creates_entry(authenticated_client, db_session, test_user):
    product, offer = create_product_and_offer(db_session)

    response = authenticated_client.post(f"/api/favorites/{product.id}")

    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["product"]["id"] == product.id
    assert data["offer"]["id"] == offer.id

    favorite = db_session.query(Favorite).filter_by(user_id=test_user.id).first()
    assert favorite is not None
    assert favorite.offer_id == offer.id


def test_list_favorites_returns_user_items(authenticated_client, db_session, test_user):
    product, offer = create_product_and_offer(db_session)
    favorite = Favorite(user_id=test_user.id, offer_id=offer.id)
    db_session.add(favorite)
    db_session.commit()

    response = authenticated_client.get("/api/favorites")

    assert response.status_code == status.HTTP_200_OK
    favorites = response.json()
    assert len(favorites) == 1
    assert favorites[0]["product"]["id"] == product.id


def test_remove_favorite_deletes_entry(authenticated_client, db_session, test_user):
    product, offer = create_product_and_offer(db_session)
    favorite = Favorite(user_id=test_user.id, offer_id=offer.id)
    db_session.add(favorite)
    db_session.commit()

    response = authenticated_client.delete(f"/api/favorites/{product.id}")

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert db_session.query(Favorite).filter_by(id=favorite.id).first() is None

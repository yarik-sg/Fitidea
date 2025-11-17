import json
from decimal import Decimal

from fastapi import status

from app.routes import compare_routes
from app.models.offer import Offer
from app.models.product import Product


class FakeRedis:
    def __init__(self):
        self.store: dict[str, str] = {}

    async def get(self, key: str):
        return self.store.get(key)

    async def set(self, key: str, value: str, ex=None):
        self.store[key] = value

    async def ping(self):
        return True


def create_products(db_session):
    first = Product(name="Bike", description="", price=Decimal("100.00"))
    second = Product(name="Helmet", description="", price=Decimal("50.00"))
    db_session.add_all([first, second])
    db_session.commit()
    db_session.refresh(first)
    db_session.refresh(second)

    db_session.add_all(
        [
            Offer(title="Store A", description="", price=Decimal("95.00"), product_id=first.id),
            Offer(title="Store B", description="", price=Decimal("45.00"), product_id=second.id),
        ]
    )
    db_session.commit()
    return first, second


def test_compare_products_uses_cache(client, monkeypatch):
    fake_redis = FakeRedis()
    cached = {"query": "rope", "offers": ["cached"]}
    fake_redis.store["compare:rope"] = json.dumps(cached)
    client.app.state.redis = fake_redis

    def _should_not_run(query: str):
        raise AssertionError("search_product should not be called when cache is hit")

    monkeypatch.setattr(compare_routes.serpapi_service, "search_product", _should_not_run)

    response = client.post("/api/compare", json={"query": "rope"})

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == cached


def test_compare_products_calls_serpapi(client, monkeypatch):
    fake_redis = FakeRedis()
    client.app.state.redis = fake_redis

    async def fake_search(query: str):
        return {"query": query, "offers": []}

    monkeypatch.setattr(compare_routes.serpapi_service, "search_product", fake_search)

    response = client.post("/api/compare", json={"query": "gloves"})

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["query"] == "gloves"
    assert "compare:gloves" in fake_redis.store


def test_get_comparison_returns_products(client, db_session):
    first, second = create_products(db_session)

    response = client.get(f"/api/comparison?ids={first.id},{second.id}")

    assert response.status_code == status.HTTP_200_OK
    products = response.json()["products"]
    assert len(products) == 2
    assert {item["product"]["name"] for item in products} == {first.name, second.name}


def test_get_comparison_handles_missing(client, db_session):
    response = client.get("/api/comparison?ids=999")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "No matching products found"

from fastapi.testclient import TestClient
from app.main import app


def test_health_endpoint_without_lifespan():
    # Create a TestClient with lifespan disabled so startup/shutdown handlers (DB/Redis/seed) are not executed
    client = TestClient(app, lifespan="off")
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") == "ok"
    assert "redis" in data

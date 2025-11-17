from fastapi import status

from app.auth.utils import hash_password
from app.models.user import User


def test_signup_creates_user_and_returns_token(client, db_session):
    payload = {"email": "new@example.com", "full_name": "New User", "password": "secret"}

    response = client.post("/api/auth/signup", json=payload)

    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == payload["email"]

    created = db_session.query(User).filter_by(email=payload["email"]).first()
    assert created is not None
    assert created.full_name == payload["full_name"]


def test_signup_rejects_duplicate_email(client, db_session):
    existing = User(email="dupe@example.com", full_name="Existing", hashed_password=hash_password("pass"))
    db_session.add(existing)
    db_session.commit()

    payload = {"email": existing.email, "full_name": "Another", "password": "secret"}
    response = client.post("/api/auth/signup", json=payload)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "Email already registered"


def test_login_returns_token(client, db_session):
    user = User(email="login@example.com", full_name="Login", hashed_password=hash_password("secret"))
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/auth/login",
        data={"username": user.email, "password": "secret"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["user"]["email"] == user.email
    assert data["token_type"] == "bearer"
    assert data["access_token"]


def test_me_returns_current_user(client, auth_headers, test_user):
    response = client.get("/api/auth/me", headers=auth_headers)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == test_user.email
    assert data["full_name"] == test_user.full_name

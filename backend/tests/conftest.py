from collections.abc import Generator
from typing import Callable

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.main import app
from app.auth.auth import get_current_user
from app.auth.utils import create_access_token, hash_password
from app.db.session import Base, get_db
from app.models.user import User


SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_database() -> Generator[None, None, None]:
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db_session(setup_database: None) -> Generator[Session, None, None]:
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture()
def override_get_db(db_session: Session) -> Callable[[], Generator[Session, None, None]]:
    def _get_db() -> Generator[Session, None, None]:
        try:
            yield db_session
        finally:
            db_session.close()

    return _get_db


@pytest.fixture()
def client(override_get_db: Callable[[], Generator[Session, None, None]]) -> Generator[TestClient, None, None]:
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture()
def test_user(db_session: Session) -> User:
    user = User(email="user@example.com", full_name="Test User", hashed_password=hash_password("password"))
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def auth_headers(test_user: User) -> dict[str, str]:
    token = create_access_token({"sub": str(test_user.id)})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def authenticated_client(client: TestClient, test_user: User) -> Generator[TestClient, None, None]:
    async def get_user_override():
        return test_user

    app.dependency_overrides[get_current_user] = get_user_override
    try:
        yield client
    finally:
        app.dependency_overrides.pop(get_current_user, None)

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class AuthRepository:

    @staticmethod
    def get_by_username(
        db: Session,
        username: str,
    ) -> User | None:
        statement = select(User).where(User.username == username)
        return db.scalar(statement)

    @staticmethod
    def get_by_email(
        db: Session,
        email: str,
    ) -> User | None:
        statement = select(User).where(User.email == email)
        return db.scalar(statement)

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: int,
    ) -> User | None:
        return db.get(User, user_id)

    @staticmethod
    def create(
        db: Session,
        username: str,
        email: str,
        hashed_password: str,
        role: str = "user",
    ) -> User:

        user = User(
            username=username,
            email=email,
            hashed_password=hashed_password,
            role=role,
            is_active=True,
        )

        db.add(user)
        db.flush()
        db.refresh(user)

        return user

    @staticmethod
    def update_email(
        db: Session,
        user: User,
        email: str,
    ) -> User:

        user.email = email
        db.flush()
        db.refresh(user)

        return user

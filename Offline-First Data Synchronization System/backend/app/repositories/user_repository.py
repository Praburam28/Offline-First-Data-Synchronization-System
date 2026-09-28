from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: int,
    ) -> User | None:

        return db.get(User, user_id)

    @staticmethod
    def get_by_username(
        db: Session,
        username: str,
    ) -> User | None:

        statement = select(User).where(
            User.username == username
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_email(
        db: Session,
        email: str,
    ) -> User | None:

        statement = select(User).where(
            User.email == email
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_username_or_email(
        db: Session,
        username: str,
        email: str,
    ) -> User | None:

        statement = select(User).where(
            or_(
                User.username == username,
                User.email == email,
            )
        )

        return db.scalar(statement)

    @staticmethod
    def create(
        db: Session,
        user: User,
    ) -> User:

        db.add(user)
        db.flush()

        return user

    @staticmethod
    def update(
        db: Session,
        user: User,
    ) -> User:

        db.add(user)
        db.flush()

        return user

from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.schemas.user import UserProfileUpdate


class UserService:

    @staticmethod
    def get_profile(
        db: Session,
        user_id: int,
    ):

        user = UserRepository.get_by_id(
            db,
            user_id,
        )

        if not user:
            raise ValueError("User not found")

        return user

    @staticmethod
    def update_profile(
        db: Session,
        user_id: int,
        data: UserProfileUpdate,
    ):

        user = UserRepository.get_by_id(
            db,
            user_id,
        )

        if not user:
            raise ValueError("User not found")

        if data.username is not None:

            existing = UserRepository.get_by_username(
                db,
                data.username,
            )

            if existing and existing.id != user.id:
                raise ValueError("Username already exists")

            user.username = data.username

        if data.email is not None:

            existing = UserRepository.get_by_email(
                db,
                data.email,
            )

            if existing and existing.id != user.id:
                raise ValueError("Email already exists")

            user.email = data.email

        UserRepository.update(
            db,
            user,
        )

        db.commit()
        db.refresh(user)

        return user

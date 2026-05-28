import uuid
from datetime import date, datetime

from sqlalchemy import String, Integer, Date, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class UserCertification(Base):
    __tablename__ = "user_certifications"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    cert_type: Mapped[str] = mapped_column(String(100), nullable=False)
    exam_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="certifications")  # noqa: F821
    subject_scores: Mapped[list["SubjectScore"]] = relationship(
        back_populates="certification", cascade="all, delete-orphan"
    )


class SubjectScore(Base):
    __tablename__ = "subject_scores"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_cert_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("user_certifications.id", ondelete="CASCADE"), nullable=False
    )
    subject_key: Mapped[str] = mapped_column(String(100), nullable=False)
    score: Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    certification: Mapped["UserCertification"] = relationship(back_populates="subject_scores")

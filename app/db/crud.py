from typing import Optional, List
import json

from sqlalchemy.orm import Session

from . import models


# User CRUD
def get_user_by_id(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, email: str, password_hash: str, name: Optional[str] = None) -> models.User:
    user = models.User(email=email, password_hash=password_hash, name=name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# Resume CRUD
def create_resume(
    db: Session,
    *,
    user_id: int,
    file_name: Optional[str],
    file_type: Optional[str],
    file_size: Optional[int],
    extracted_text: str,
) -> models.Resume:
    resume = models.Resume(
        user_id=user_id,
        file_name=file_name,
        file_type=file_type,
        file_size=file_size,
        extracted_text=extracted_text,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


def get_resume(db: Session, resume_id: int) -> Optional[models.Resume]:
    return db.query(models.Resume).filter(models.Resume.id == resume_id).first()


def list_resumes_for_user(db: Session, user_id: int) -> List[models.Resume]:
    return db.query(models.Resume).filter(models.Resume.user_id == user_id).order_by(models.Resume.created_at.desc()).all()


def get_resume_analysis(db: Session, resume_id: int) -> Optional[dict]:
    """Return stored analysis JSON for a resume if available."""
    resume = get_resume(db, resume_id)
    if not resume or not getattr(resume, "analysis_json", None):
        return None
    try:
        return json.loads(resume.analysis_json)
    except Exception:
        return None


def save_resume_analysis(db: Session, resume_id: int, analysis_dict: dict) -> Optional[models.Resume]:
    """Persist analysis JSON into the resume record and return the updated model."""
    resume = get_resume(db, resume_id)
    if not resume:
        return None
    resume.analysis_json = json.dumps(analysis_dict)
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


# Job CRUD
def create_job(
    db: Session,
    *,
    user_id: int,
    title: str,
    company: Optional[str] = None,
    location: Optional[str] = None,
    description: Optional[str] = None,
) -> models.Job:
    job = models.Job(
        user_id=user_id,
        title=title,
        company=company,
        location=location,
        description=description,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def get_job(db: Session, job_id: int) -> Optional[models.Job]:
    return db.query(models.Job).filter(models.Job.id == job_id).first()


# ChatMessage CRUD
def create_chat_message(
    db: Session,
    *,
    user_id: int,
    role: str,
    content: str,
    conversation_id: Optional[str] = None,
) -> models.ChatMessage:
    msg = models.ChatMessage(
        user_id=user_id,
        role=role,
        content=content,
        conversation_id=conversation_id,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def list_chat_messages(db: Session, user_id: int, conversation_id: Optional[str] = None) -> List[models.ChatMessage]:
    query = db.query(models.ChatMessage).filter(models.ChatMessage.user_id == user_id)
    if conversation_id:
        query = query.filter(models.ChatMessage.conversation_id == conversation_id)
    return query.order_by(models.ChatMessage.created_at.asc()).all()



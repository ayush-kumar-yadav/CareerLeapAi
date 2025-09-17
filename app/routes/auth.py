from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
import os

from app.db.session import get_db
from app.db import crud
from app.db import models as db_models


router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

AUTH_SECRET_KEY = os.getenv("AUTH_SECRET_KEY", os.getenv("SECRET_KEY", "change-me"))
AUTH_ALGORITHM = os.getenv("AUTH_ALGORITHM", "HS256")
AUTH_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("AUTH_ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int
    email: EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=AUTH_ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, AUTH_SECRET_KEY, algorithm=AUTH_ALGORITHM)
    return encoded_jwt


def get_current_user(db: Session = Depends(get_db), token: str = Depends(lambda: None)) -> db_models.User:
    # Token should be provided via Authorization header in dependencies when used
    from fastapi import Request

    def _extract_token(request: Request) -> Optional[str]:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None
        parts = auth_header.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            return parts[1]
        return None

    from fastapi import Request
    request: Request
    # We will rely on request state to get header, workaround since we can't inject Request here easily
    # In routes, prefer Depends(get_current_user) which will read from Authorization header
    try:
        # This is a no-op path; actual token extract happens in route via request
        pass
    except Exception:
        pass
    # Fallback: raise to ensure proper usage via dependency in routes where Request is available
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")


def get_current_user_from_request(request, db: Session) -> db_models.User:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token = auth_header.split()[1]
    try:
        payload = jwt.decode(token, AUTH_SECRET_KEY, algorithms=[AUTH_ALGORITHM])
        user_id: int = int(payload.get("sub"))
        email: str = payload.get("email")
        if user_id is None or email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = crud.get_user_by_id(db, user_id)
    if not user or user.email != email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.post("/api/auth/register", response_model=UserResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(payload.password)
    user = crud.create_user(db, email=payload.email, password_hash=hashed)
    return UserResponse(id=user.id, email=user.email, created_at=user.created_at)


@router.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash or ""):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(access_token=token)


@router.get("/api/auth/me", response_model=UserResponse)
def me(request, db: Session = Depends(get_db)):
    user = get_current_user_from_request(request, db)
    return UserResponse(id=user.id, email=user.email, created_at=user.created_at)


@router.post("/api/auth/logout")
def logout():
    # Stateless JWT; front-end should delete token
    return {"detail": "Logged out"}



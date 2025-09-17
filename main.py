from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import io
from typing import List
from contextlib import asynccontextmanager

# Optional heavy deps used for PDF extraction/OCR
try:
    import pdfplumber
except Exception:
    pdfplumber = None

try:
    from PyPDF2 import PdfReader
except Exception:
    PdfReader = None

try:
    from pdf2image import convert_from_bytes
except Exception:
    convert_from_bytes = None

try:
    import pytesseract
except Exception:
    pytesseract = None

# Load environment variables
load_dotenv()
SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

# Fail fast if AUTH_SECRET_KEY is not configured
if os.getenv("AUTH_SECRET_KEY", os.getenv("SECRET_KEY", "change-me")) == "change-me":
    raise RuntimeError("AUTH_SECRET_KEY is not configured. Set a strong value in environment.")

# Import routers & database
from app.routes import resume, jobs, chat
from app.routes import auth as auth_routes
from app.db.session import Base, engine
from sqlalchemy import inspect, text
from sqlalchemy.exc import OperationalError

# Lifespan context for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and ensure columns exist
    Base.metadata.create_all(bind=engine)
    try:
        inspector = inspect(engine)
        columns = [c['name'] for c in inspector.get_columns('resumes')]
        dialect_name = engine.dialect.name
        if 'analysis_json' not in columns and dialect_name in ("sqlite", "postgresql", "mysql"):
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE resumes ADD COLUMN analysis_json TEXT"))
                conn.commit()
        user_columns = [c['name'] for c in inspector.get_columns('users')]
        if 'password_hash' not in user_columns and dialect_name in ("sqlite", "postgresql", "mysql"):
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT ''"))
                conn.commit()
    except OperationalError:
        pass

    yield  # App runs here

    # Optional shutdown code can go here

# Create FastAPI app with lifespan
app = FastAPI(
    title="Career Leap AI API",
    description="AI-powered career development platform with resume analysis, job matching, and career counseling",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allow_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router, tags=["auth"])
app.include_router(resume.router, prefix="/api/v1", tags=["resume"])
app.include_router(jobs.router, prefix="/api/v1", tags=["jobs"])
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])

# Root & health check
@app.get("/")
async def root():
    return {"message": "Career Leap AI API", "version": "1.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Helper functions for text extraction
def _clean_text(text: str) -> str:
    if not text:
        return ""
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    import re
    cleaned = "\n".join(lines)
    cleaned = re.sub(r"\s+", " ", cleaned)
    cleaned = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]", "", cleaned)
    return cleaned.strip()

def _has_meaningful_text(text: str) -> bool:
    return bool(text and len(text.strip()) >= 10)

# Upload resume endpoint
@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    filename = file.filename or ""
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported at this endpoint.")

    content = await file.read()
    max_bytes = 10 * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(status_code=400, detail="File size too large. Max allowed is 10MB.")

    # Attempt 1: pdfplumber
    extracted_text = ""
    if pdfplumber is not None:
        try:
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                texts: List[str] = [page.extract_text() or "" for page in pdf.pages]
                extracted_text = _clean_text("\n".join(texts))
        except Exception:
            extracted_text = ""

    # Attempt 2: PyPDF2
    if not _has_meaningful_text(extracted_text) and PdfReader is not None:
        try:
            reader = PdfReader(io.BytesIO(content))
            texts: List[str] = [page.extract_text() or "" for page in reader.pages]
            extracted_text = _clean_text("\n".join(texts))
        except Exception:
            extracted_text = ""

    # Attempt 3: OCR fallback
    if not _has_meaningful_text(extracted_text):
        if convert_from_bytes is None or pytesseract is None:
            raise HTTPException(
                status_code=400,
                detail="Could not extract meaningful text from PDF. OCR dependencies are missing. Install 'pdf2image', 'pytesseract', and Poppler.",
            )
        try:
            images = convert_from_bytes(content)
            ocr_texts: List[str] = [pytesseract.image_to_string(img) for img in images]
            extracted_text = _clean_text("\n".join(ocr_texts))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")

    if not _has_meaningful_text(extracted_text):
        raise HTTPException(status_code=400, detail="Could not extract meaningful text from the uploaded PDF.")

    return JSONResponse({"extracted_text": extracted_text})

# Run server
if __name__ == "_main_":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
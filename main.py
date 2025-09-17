from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import routes
from app.routes import resume, jobs, chat
from app.routes import auth as auth_routes
from app.db.session import Base, engine
from sqlalchemy import inspect
from sqlalchemy.exc import OperationalError

# Create FastAPI app
app = FastAPI(
    title="Career Leap AI API",
    description="AI-powered career development platform with resume analysis, job matching, and career counseling",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router, tags=["auth"])
app.include_router(resume.router, prefix="/api/v1", tags=["resume"])
app.include_router(jobs.router, prefix="/api/v1", tags=["jobs"])
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])

# Create tables on startup (safe for SQLite; migrations recommended for production)
@app.on_event("startup")
async def on_startup():
    Base.metadata.create_all(bind=engine)
    # Fallback: ensure analysis_json exists if migrations haven't run
    try:
        inspector = inspect(engine)
        columns = [c['name'] for c in inspector.get_columns('resumes')]
        if 'analysis_json' not in columns:
            with engine.connect() as conn:
                conn.execute("ALTER TABLE resumes ADD COLUMN analysis_json TEXT")
                conn.commit()
        # Fallback: ensure password_hash exists on users table for legacy DBs
        user_columns = [c['name'] for c in inspector.get_columns('users')]
        if 'password_hash' not in user_columns:
            with engine.connect() as conn:
                conn.execute("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT ''")
                conn.commit()
    except OperationalError:
        # Ignore if table doesn't exist yet or dialect doesn't support this at startup
        pass

@app.get("/")
async def root():
    return {
        "message": "Career Leap AI API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.get("/")
def root():
    return {"message": "Career Leap AI API", "version": "1.0.0", "status": "running"}

@app.post("/analyze")
def analyze(data: dict):
    return {"received": data, "status": "backend works ✅"}




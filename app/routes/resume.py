from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Request
from sqlalchemy.orm import Session
from typing import Optional
import os
from datetime import datetime
from app.models.resume_models import (
    ResumeAnalysisRequest, 
    ResumeAnalysisResponse,
    ResumeTailorRequest,
    ResumeTailorResponse,
    ResumeUploadResponse,
    ResumeListResponse,
    ResumeRecord,
    ResumeStoredAnalysisResponse,
)
from app.services.resume_service import ResumeService
from app.utils.text_extractor import TextExtractor
from app.db.session import get_db
from app.db import crud
from app.routes.auth import get_current_user_from_request

router = APIRouter()
resume_service = ResumeService()

@router.post("/analyze-resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(request: ResumeAnalysisRequest, db: Session = Depends(get_db), http_request: Request = None):
    """
    Analyze a resume and provide detailed feedback including:
    - Overall score (0-100)
    - Strengths and weaknesses
    - Improvement recommendations
    - Analysis summary
    """
    try:
        if not request.resume_text or len(request.resume_text.strip()) < 10:
            raise HTTPException(
                status_code=400, 
                detail="Resume text must be at least 10 characters long"
            )
        
        # Auth
        user = get_current_user_from_request(http_request, db)

        saved = crud.create_resume(
            db,
            user_id=user.id,
            file_name=None,
            file_type=None,
            file_size=None,
            extracted_text=request.resume_text,
        )

        result = resume_service.analyze_resume(
            resume_text=request.resume_text,
            job_title=request.job_title,
            industry=request.industry
        )

        # Build response and persist it as analysis JSON
        response = ResumeAnalysisResponse(
            resume_id=saved.id,
            overall_score=result.overall_score,
            strengths=result.strengths,
            weaknesses=result.weaknesses,
            recommendations=result.recommendations,
            summary=result.summary,
            analysis_timestamp=result.analysis_timestamp,
        )
        try:
            crud.save_resume_analysis(db, saved.id, response.dict())
        except Exception:
            # Non-fatal: proceed even if persistence fails
            pass

        return response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume analysis failed: {str(e)}"
        )

@router.post("/tailor-resume", response_model=ResumeTailorResponse)
async def tailor_resume(request: ResumeTailorRequest):
    """
    Tailor a resume for a specific job by:
    - Analyzing job requirements
    - Optimizing keywords
    - Adjusting content for better ATS compatibility
    - Providing change summary
    """
    try:
        if not request.resume_text or len(request.resume_text.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Resume text must be at least 10 characters long"
            )
        
        if not request.job_description or len(request.job_description.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Job description must be at least 10 characters long"
            )
        
        result = resume_service.tailor_resume(
            resume_text=request.resume_text,
            job_description=request.job_description,
            job_title=request.job_title,
            company_name=request.company_name
        )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume tailoring failed: {str(e)}"
        )

@router.post("/upload-resume", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db), http_request: Request = None):
    """
    Upload a resume file (PDF or DOCX) and extract text content
    
    Args:
        file: The resume file to upload (PDF or DOCX format)
        
    Returns:
        ResumeUploadResponse with extracted text and file metadata
    """
    try:
        # Validate file type
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in ['.pdf', '.docx', '.doc']:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format. Please upload a PDF or DOCX file."
            )
        
        # Validate file size (max 10MB)
        file_content = await file.read()
        if len(file_content) > 10 * 1024 * 1024:  # 10MB limit
            raise HTTPException(
                status_code=400,
                detail="File size too large. Please upload a file smaller than 10MB."
            )
        
        # Extract text from the file
        extracted_text = TextExtractor.extract_text(file_content, file_extension)
        
        # Calculate word and character counts
        word_count = len(extracted_text.split())
        character_count = len(extracted_text)
        
        saved = crud.create_resume(
            db,
            user_id=get_current_user_from_request(http_request, db).id,
            file_name=file.filename,
            file_type=file_extension,
            file_size=len(file_content),
            extracted_text=extracted_text,
        )

        # Prepare response
        response = ResumeUploadResponse(
            resume_id=saved.id,
            extracted_text=extracted_text,
            file_name=file.filename,
            file_size=len(file_content),
            file_type=file_extension,
            extraction_timestamp=datetime.utcnow().isoformat(),
            word_count=word_count,
            character_count=character_count
        )

        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process uploaded file: {str(e)}"
        )

@router.get("/resume-tips")
async def get_resume_tips():
    """
    Get general resume optimization tips and best practices
    """
    tips = {
        "general_tips": [
            "Use a clean, professional format with clear section headers",
            "Include relevant keywords from job descriptions",
            "Quantify your achievements with specific numbers and metrics",
            "Keep your resume to 1-2 pages maximum",
            "Use action verbs to start each bullet point",
            "Include a professional summary or objective",
            "Proofread carefully for spelling and grammar errors"
        ],
        "ats_optimization": [
            "Use standard section headers (Experience, Education, Skills)",
            "Avoid graphics, images, or complex formatting",
            "Use common fonts like Arial, Calibri, or Times New Roman",
            "Save as a .docx or .pdf file",
            "Include relevant keywords naturally throughout",
            "Use full words instead of abbreviations where possible"
        ],
        "content_guidelines": [
            "Focus on achievements rather than just job duties",
            "Use the STAR method (Situation, Task, Action, Result) for accomplishments",
            "Include relevant skills and certifications",
            "List education in reverse chronological order",
            "Include contact information and professional links",
            "Customize your resume for each job application"
        ]
    }
    
    return tips


@router.get("/resumes", response_model=ResumeListResponse)
async def list_resumes(db: Session = Depends(get_db), http_request: Request = None):
    """Return all resumes for current user"""
    user = get_current_user_from_request(http_request, db)
    resumes = crud.list_resumes_for_user(db, user.id)
    items = [
        ResumeRecord(
            id=r.id,
            user_id=r.user_id,
            file_name=r.file_name,
            file_type=r.file_type,
            file_size=r.file_size,
            created_at=r.created_at.isoformat() if r.created_at else ""
        )
        for r in resumes
    ]
    return ResumeListResponse(resumes=items)


@router.get("/analysis/{resume_id}", response_model=ResumeStoredAnalysisResponse)
async def get_resume_analysis(resume_id: int, db: Session = Depends(get_db), http_request: Request = None):
    """Fetch stored analysis for a resume; 404 if missing."""
    resume = crud.get_resume(db, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    # Ensure ownership
    user = get_current_user_from_request(http_request, db)
    if resume.user_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    stored = crud.get_resume_analysis(db, resume_id)
    if not stored:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return ResumeStoredAnalysisResponse(resume_id=resume_id, analysis=stored)


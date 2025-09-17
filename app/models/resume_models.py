from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class ResumeAnalysisRequest(BaseModel):
    resume_text: str = Field(..., description="The resume text to analyze", min_length=10)
    job_title: Optional[str] = Field(None, description="Target job title for analysis")
    industry: Optional[str] = Field(None, description="Target industry")

class StrengthWeakness(BaseModel):
    category: str = Field(..., description="Category of strength/weakness (e.g., 'Technical Skills', 'Experience')")
    description: str = Field(..., description="Description of the strength or weakness")
    impact: str = Field(..., description="Impact level: 'high', 'medium', 'low'")

class ResumeAnalysisResponse(BaseModel):
    resume_id: int = Field(..., description="Database ID of the saved resume")
    overall_score: float = Field(..., description="Overall resume score (0-100)", ge=0, le=100)
    strengths: List[StrengthWeakness] = Field(..., description="List of resume strengths")
    weaknesses: List[StrengthWeakness] = Field(..., description="List of resume weaknesses")
    recommendations: List[str] = Field(..., description="List of improvement recommendations")
    summary: str = Field(..., description="Overall analysis summary")
    analysis_timestamp: str = Field(..., description="Timestamp of the analysis")

class ResumeTailorRequest(BaseModel):
    resume_text: str = Field(..., description="Original resume text", min_length=10)
    job_description: str = Field(..., description="Target job description", min_length=10)
    job_title: str = Field(..., description="Target job title")
    company_name: Optional[str] = Field(None, description="Target company name")

class ResumeTailorResponse(BaseModel):
    tailored_resume: str = Field(..., description="Tailored resume text")
    changes_made: List[str] = Field(..., description="List of changes made to the resume")
    keyword_matches: List[str] = Field(..., description="Keywords that were matched and emphasized")
    tailoring_timestamp: str = Field(..., description="Timestamp of the tailoring")

class ResumeUploadResponse(BaseModel):
    resume_id: int = Field(..., description="Database ID of the saved resume")
    extracted_text: str = Field(..., description="Extracted text from the uploaded file")
    file_name: str = Field(..., description="Original file name")
    file_size: int = Field(..., description="File size in bytes")
    file_type: str = Field(..., description="File type/extension")
    extraction_timestamp: str = Field(..., description="Timestamp of the extraction")
    word_count: int = Field(..., description="Number of words in extracted text")
    character_count: int = Field(..., description="Number of characters in extracted text")


class ResumeRecord(BaseModel):
    id: int = Field(..., description="Resume ID")
    user_id: int = Field(..., description="Owner user ID")
    file_name: Optional[str] = Field(None, description="Original file name if uploaded")
    file_type: Optional[str] = Field(None, description="File type/extension")
    file_size: Optional[int] = Field(None, description="File size in bytes")
    created_at: str = Field(..., description="Creation timestamp")


class ResumeListResponse(BaseModel):
    resumes: List[ResumeRecord] = Field(..., description="List of resumes for the user")


class ResumeStoredAnalysisResponse(BaseModel):
    resume_id: int = Field(..., description="Resume ID")
    analysis: Optional[Dict[str, Any]] = Field(None, description="Stored analysis fields if available")

from typing import List, Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., description="User's message to the assistant")
    conversation_history: Optional[List[dict]] = Field(
        default=None, description="Prior messages for context"
    )
    context: Optional[dict] = Field(default=None, description="Additional context for the model")
    user_id: Optional[str] = Field(default=None, description="Identifier for the user")


class ChatResponse(BaseModel):
    reply: str
    conversation_id: str
    suggestions: List[str] = []
    response_timestamp: str


class CareerCounselingRequest(BaseModel):
    current_role: Optional[str] = None
    experience_years: Optional[int] = None
    skills: Optional[List[str]] = None
    career_goals: str
    challenges: Optional[List[str]] = None
    industry: Optional[str] = None


class CareerCounselingResponse(BaseModel):
    advice: str
    action_plan: List[str] = []
    skill_recommendations: List[str] = []
    career_paths: List[str] = []
    resources: List[str] = []
    counseling_timestamp: str


class ATSAnalysisRequest(BaseModel):
    resume_text: str
    job_description: str
    ats_system: Optional[str] = None


class ATSAnalysisResponse(BaseModel):
    ats_score: float
    keyword_matches: List[str]
    missing_keywords: List[str]
    formatting_issues: List[str]
    recommendations: List[str]
    analysis_timestamp: str



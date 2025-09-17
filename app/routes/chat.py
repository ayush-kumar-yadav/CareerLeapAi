from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any
from app.models.chat_models import (
    ChatRequest,
    ChatResponse,
    CareerCounselingRequest,
    CareerCounselingResponse,
    ATSAnalysisRequest,
    ATSAnalysisResponse
)
from app.services.chat_service import ChatService

router = APIRouter()
chat_service = ChatService()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat with the AI career counselor:
    - Get personalized career advice
    - Ask questions about resume optimization
    - Receive job search guidance
    - Get interview preparation tips
    """
    try:
        if not request.message or len(request.message.strip()) == 0:
            raise HTTPException(
                status_code=400,
                detail="Message cannot be empty"
            )
        
        result = chat_service.chat_response(
            message=request.message,
            conversation_history=request.conversation_history,
            context=request.context,
            user_id=request.user_id
        )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chat service failed: {str(e)}"
        )

@router.post("/career-counseling", response_model=CareerCounselingResponse)
async def career_counseling(request: CareerCounselingRequest):
    """
    Get personalized career counseling:
    - Receive tailored career advice
    - Get step-by-step action plans
    - Learn about skill recommendations
    - Explore career path options
    - Access relevant resources
    """
    try:
        if not request.career_goals or len(request.career_goals.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Career goals must be at least 10 characters long"
            )
        
        result = chat_service.career_counseling(
            current_role=request.current_role,
            experience_years=request.experience_years,
            skills=request.skills,
            career_goals=request.career_goals,
            challenges=request.challenges,
            industry=request.industry
        )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Career counseling failed: {str(e)}"
        )

@router.post("/ats-analysis", response_model=ATSAnalysisResponse)
async def ats_analysis(request: ATSAnalysisRequest):
    """
    Analyze resume for ATS (Applicant Tracking System) compatibility:
    - Calculate ATS compatibility score
    - Identify keyword matches and gaps
    - Detect formatting issues
    - Provide optimization recommendations
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
        
        result = chat_service.ats_analysis(
            resume_text=request.resume_text,
            job_description=request.job_description,
            ats_system=request.ats_system
        )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"ATS analysis failed: {str(e)}"
        )

@router.get("/chat-suggestions")
async def get_chat_suggestions():
    """
    Get suggested conversation starters and topics
    """
    suggestions = {
        "resume_topics": [
            "How can I improve my resume formatting?",
            "What keywords should I include in my resume?",
            "How do I optimize my resume for ATS systems?",
            "What's the best way to describe my achievements?",
            "How long should my resume be?",
            "What sections should I include in my resume?"
        ],
        "job_search_topics": [
            "What are the best job search strategies?",
            "How do I find remote work opportunities?",
            "What skills are most in demand right now?",
            "How do I network effectively?",
            "What should I research about companies?",
            "How do I follow up after applying?"
        ],
        "interview_topics": [
            "What are common interview questions?",
            "How do I answer behavioral questions?",
            "What should I wear to an interview?",
            "How do I prepare for technical interviews?",
            "What questions should I ask the interviewer?",
            "How do I handle salary negotiations?"
        ],
        "career_development_topics": [
            "How do I plan my career path?",
            "What skills should I develop next?",
            "How do I transition to a new industry?",
            "What certifications are worth pursuing?",
            "How do I build my professional network?",
            "How do I ask for a promotion or raise?"
        ]
    }
    
    return suggestions

@router.get("/career-resources")
async def get_career_resources():
    """
    Get curated career development resources
    """
    resources = {
        "learning_platforms": [
            {"name": "LinkedIn Learning", "url": "https://www.linkedin.com/learning/", "type": "Courses"},
            {"name": "Coursera", "url": "https://www.coursera.org/", "type": "Courses"},
            {"name": "Udemy", "url": "https://www.udemy.com/", "type": "Courses"},
            {"name": "edX", "url": "https://www.edx.org/", "type": "Courses"},
            {"name": "Khan Academy", "url": "https://www.khanacademy.org/", "type": "Free Courses"}
        ],
        "job_boards": [
            {"name": "LinkedIn Jobs", "url": "https://www.linkedin.com/jobs/", "type": "General"},
            {"name": "Indeed", "url": "https://www.indeed.com/", "type": "General"},
            {"name": "Glassdoor", "url": "https://www.glassdoor.com/", "type": "General"},
            {"name": "AngelList", "url": "https://angel.co/", "type": "Startups"},
            {"name": "Remote.co", "url": "https://remote.co/", "type": "Remote"}
        ],
        "professional_networking": [
            {"name": "LinkedIn", "url": "https://www.linkedin.com/", "type": "Professional Network"},
            {"name": "Meetup", "url": "https://www.meetup.com/", "type": "Local Events"},
            {"name": "Eventbrite", "url": "https://www.eventbrite.com/", "type": "Events"},
            {"name": "Slack Communities", "url": "https://slack.com/", "type": "Online Communities"}
        ],
        "resume_tools": [
            {"name": "Canva", "url": "https://www.canva.com/", "type": "Design"},
            {"name": "Resume.io", "url": "https://resume.io/", "type": "Builder"},
            {"name": "Zety", "url": "https://zety.com/", "type": "Builder"},
            {"name": "Grammarly", "url": "https://www.grammarly.com/", "type": "Writing"}
        ],
        "interview_prep": [
            {"name": "Pramp", "url": "https://www.pramp.com/", "type": "Mock Interviews"},
            {"name": "InterviewBit", "url": "https://www.interviewbit.com/", "type": "Practice"},
            {"name": "LeetCode", "url": "https://leetcode.com/", "type": "Coding Practice"},
            {"name": "HackerRank", "url": "https://www.hackerrank.com/", "type": "Coding Practice"}
        ]
    }
    
    return resources





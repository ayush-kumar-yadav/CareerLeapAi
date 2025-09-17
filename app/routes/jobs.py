from fastapi import APIRouter, HTTPException
from typing import Optional
from app.models.job_models import (
    JobMatchRequest,
    JobMatchResponse,
    JobSearchRequest,
    JobSearchResponse
)
from app.services.job_service import JobService

router = APIRouter()
job_service = JobService()

@router.post("/match-jobs", response_model=JobMatchResponse)
async def match_jobs(request: JobMatchRequest):
    """
    Match jobs based on user skills and preferences:
    - Calculate match scores for each job
    - Identify matched and missing skills
    - Provide match reasoning
    - Return top job matches
    """
    try:
        if not request.skills or len(request.skills) == 0:
            raise HTTPException(
                status_code=400,
                detail="At least one skill must be provided"
            )
        
        result = job_service.match_jobs(
            skills=request.skills,
            experience_level=request.experience_level,
            location=request.location,
            job_type=request.job_type,
            salary_range=request.salary_range
        )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Job matching failed: {str(e)}"
        )

@router.post("/search-jobs", response_model=JobSearchResponse)
async def search_jobs(request: JobSearchRequest):
    """
    Search for jobs based on query and filters:
    - Search by job title, company, or description
    - Apply location, job type, and experience filters
    - Return relevant job listings
    """
    try:
        if not request.query or len(request.query.strip()) < 2:
            raise HTTPException(
                status_code=400,
                detail="Search query must be at least 2 characters long"
            )
        
        result = job_service.search_jobs(
            query=request.query,
            location=request.location,
            job_type=request.job_type,
            experience_level=request.experience_level,
            limit=request.limit
        )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Job search failed: {str(e)}"
        )

@router.get("/job-categories")
async def get_job_categories():
    """
    Get available job categories and types
    """
    categories = {
        "job_types": [
            "full-time",
            "part-time",
            "contract",
            "freelance",
            "internship",
            "temporary"
        ],
        "experience_levels": [
            "entry",
            "junior",
            "mid",
            "senior",
            "lead",
            "executive"
        ],
        "industries": [
            "Technology",
            "Healthcare",
            "Finance",
            "Education",
            "Marketing",
            "Sales",
            "Design",
            "Engineering",
            "Data Science",
            "Product Management",
            "Operations",
            "Human Resources"
        ],
        "popular_skills": [
            "Python",
            "JavaScript",
            "React",
            "Node.js",
            "SQL",
            "AWS",
            "Docker",
            "Kubernetes",
            "Machine Learning",
            "Data Analysis",
            "Project Management",
            "Agile",
            "DevOps",
            "UI/UX Design",
            "Mobile Development"
        ]
    }
    
    return categories

@router.get("/job-market-insights")
async def get_job_market_insights():
    """
    Get current job market insights and trends
    """
    insights = {
        "trending_skills": [
            {"skill": "Artificial Intelligence", "demand": "Very High", "growth": "+45%"},
            {"skill": "Machine Learning", "demand": "High", "growth": "+38%"},
            {"skill": "Cloud Computing", "demand": "High", "growth": "+32%"},
            {"skill": "Data Science", "demand": "High", "growth": "+28%"},
            {"skill": "Cybersecurity", "demand": "High", "growth": "+25%"},
            {"skill": "DevOps", "demand": "Medium", "growth": "+22%"},
            {"skill": "React", "demand": "Medium", "growth": "+18%"},
            {"skill": "Python", "demand": "Medium", "growth": "+15%"}
        ],
        "salary_ranges": {
            "entry_level": "$50,000 - $70,000",
            "mid_level": "$70,000 - $120,000",
            "senior_level": "$120,000 - $180,000",
            "lead_level": "$150,000 - $250,000"
        },
        "remote_work_trends": {
            "percentage_remote": "42%",
            "hybrid_work": "38%",
            "fully_remote": "26%",
            "on_site": "20%"
        },
        "hiring_trends": [
            "Companies are prioritizing soft skills alongside technical skills",
            "Remote work options are becoming standard",
            "Diversity and inclusion initiatives are expanding",
            "Continuous learning and upskilling are highly valued",
            "Project-based and contract work is increasing"
        ]
    }
    
    return insights





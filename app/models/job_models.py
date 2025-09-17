from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum

class JobMatchRequest(BaseModel):
    skills: List[str] = Field(..., description="List of user skills", min_items=1)
    experience_level: Optional[str] = Field(None, description="Experience level: 'entry', 'mid', 'senior'")
    location: Optional[str] = Field(None, description="Preferred location")
    job_type: Optional[str] = Field(None, description="Job type: 'full-time', 'part-time', 'contract'")
    salary_range: Optional[str] = Field(None, description="Desired salary range")

class JobDescription(BaseModel):
    title: str = Field(..., description="Job title")
    company: str = Field(..., description="Company name")
    location: str = Field(..., description="Job location")
    description: str = Field(..., description="Job description")
    requirements: List[str] = Field(..., description="Job requirements")
    benefits: List[str] = Field(default_factory=list, description="Job benefits")
    salary_range: Optional[str] = Field(None, description="Salary range")
    job_type: str = Field(..., description="Job type")
    experience_level: str = Field(..., description="Required experience level")

class JobMatch(BaseModel):
    job: JobDescription = Field(..., description="Job details")
    match_score: float = Field(..., description="Match score (0-100)", ge=0, le=100)
    matched_skills: List[str] = Field(..., description="Skills that matched")
    missing_skills: List[str] = Field(..., description="Skills that are missing")
    match_reasons: List[str] = Field(..., description="Reasons for the match")

class JobMatchResponse(BaseModel):
    matches: List[JobMatch] = Field(..., description="List of matched jobs")
    total_matches: int = Field(..., description="Total number of matches found")
    search_timestamp: str = Field(..., description="Timestamp of the search")

class JobSearchRequest(BaseModel):
    query: str = Field(..., description="Search query", min_length=2)
    location: Optional[str] = Field(None, description="Location filter")
    job_type: Optional[str] = Field(None, description="Job type filter")
    experience_level: Optional[str] = Field(None, description="Experience level filter")
    limit: int = Field(10, description="Maximum number of results", ge=1, le=50)

class JobSearchResponse(BaseModel):
    jobs: List[JobDescription] = Field(..., description="List of found jobs")
    total_results: int = Field(..., description="Total number of results")
    search_timestamp: str = Field(..., description="Timestamp of the search")


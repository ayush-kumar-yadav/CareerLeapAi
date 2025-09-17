from datetime import datetime
from typing import List, Dict, Any
import re
from collections import Counter
from app.models.job_models import JobMatchResponse, JobSearchResponse, JobDescription, JobMatch
from app.utils.ai_client import ai_client

class JobService:
    """Service for job matching and search"""
    
    def __init__(self):
        self.ai_client = ai_client
        # Sample job database (in production, this would be a real database)
        self.sample_jobs = self._load_sample_jobs()
    
    def match_jobs(self, skills: List[str], experience_level: str = None, location: str = None, 
                   job_type: str = None, salary_range: str = None) -> JobMatchResponse:
        """Match jobs based on skills and preferences"""
        try:
            # Filter jobs based on criteria
            filtered_jobs = self._filter_jobs(experience_level, location, job_type, salary_range)
            
            # Calculate matches
            matches = []
            for job in filtered_jobs:
                match = self._calculate_job_match(job, skills)
                if match["match_score"] > 30:  # Only include jobs with decent match
                    matches.append(match)
            
            # Sort by match score
            matches.sort(key=lambda x: x["match_score"], reverse=True)
            
            return JobMatchResponse(
                matches=matches[:20],  # Top 20 matches
                total_matches=len(matches),
                search_timestamp=datetime.now().isoformat()
            )
        except Exception as e:
            # Fallback response
            return JobMatchResponse(
                matches=[],
                total_matches=0,
                search_timestamp=datetime.now().isoformat()
            )
    
    def search_jobs(self, query: str, location: str = None, job_type: str = None, 
                    experience_level: str = None, limit: int = 10) -> JobSearchResponse:
        """Search for jobs based on query"""
        try:
            # Filter jobs based on search criteria
            filtered_jobs = self._filter_jobs(experience_level, location, job_type)
            
            # Search based on query
            matching_jobs = []
            query_lower = query.lower()
            
            for job in filtered_jobs:
                # Check if query matches job title, company, or description
                if (query_lower in job["title"].lower() or 
                    query_lower in job["company"].lower() or 
                    query_lower in job["description"].lower()):
                    matching_jobs.append(job)
            
            # Limit results
            matching_jobs = matching_jobs[:limit]
            
            return JobSearchResponse(
                jobs=matching_jobs,
                total_results=len(matching_jobs),
                search_timestamp=datetime.now().isoformat()
            )
        except Exception as e:
            return JobSearchResponse(
                jobs=[],
                total_results=0,
                search_timestamp=datetime.now().isoformat()
            )
    
    def _filter_jobs(self, experience_level: str = None, location: str = None, 
                     job_type: str = None, salary_range: str = None) -> List[Dict[str, Any]]:
        """Filter jobs based on criteria"""
        filtered_jobs = self.sample_jobs.copy()
        
        if experience_level:
            filtered_jobs = [job for job in filtered_jobs 
                           if experience_level.lower() in job["experience_level"].lower()]
        
        if location:
            filtered_jobs = [job for job in filtered_jobs 
                           if location.lower() in job["location"].lower()]
        
        if job_type:
            filtered_jobs = [job for job in filtered_jobs 
                           if job_type.lower() in job["job_type"].lower()]
        
        return filtered_jobs
    
    def _calculate_job_match(self, job: Dict[str, Any], user_skills: List[str]) -> JobMatch:
        """Calculate match score between user skills and job requirements"""
        job_requirements = job.get("requirements", [])
        job_description = job.get("description", "")
        
        # Extract skills from job requirements and description
        job_skills = self._extract_skills_from_job(job_requirements, job_description)
        
        # Calculate skill overlap
        user_skills_lower = [skill.lower() for skill in user_skills]
        job_skills_lower = [skill.lower() for skill in job_skills]
        
        matched_skills = []
        missing_skills = []
        
        for job_skill in job_skills_lower:
            if any(user_skill in job_skill or job_skill in user_skill 
                   for user_skill in user_skills_lower):
                matched_skills.append(job_skill)
            else:
                missing_skills.append(job_skill)
        
        # Calculate match score
        if len(job_skills_lower) == 0:
            match_score = 50  # Default score if no skills found
        else:
            match_score = (len(matched_skills) / len(job_skills_lower)) * 100
        
        # Generate match reasons
        match_reasons = []
        if len(matched_skills) > 0:
            match_reasons.append(f"Matched {len(matched_skills)} required skills")
        if match_score > 70:
            match_reasons.append("Strong skill alignment")
        elif match_score > 50:
            match_reasons.append("Good skill overlap")
        else:
            match_reasons.append("Some relevant skills")
        
        return JobMatch(
            job=JobDescription(**job),
            match_score=round(match_score, 1),
            matched_skills=matched_skills[:10],
            missing_skills=missing_skills[:10],
            match_reasons=match_reasons
        )
    
    def _extract_skills_from_job(self, requirements: List[str], description: str) -> List[str]:
        """Extract skills from job requirements and description"""
        skills = []
        
        # Common technical skills to look for
        tech_skills = [
            'python', 'javascript', 'java', 'react', 'node.js', 'sql', 'aws', 'docker',
            'kubernetes', 'git', 'linux', 'html', 'css', 'typescript', 'angular',
            'vue.js', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
            'machine learning', 'ai', 'data science', 'analytics', 'tableau', 'power bi',
            'agile', 'scrum', 'devops', 'ci/cd', 'microservices', 'api', 'rest',
            'graphql', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn'
        ]
        
        # Check requirements
        for req in requirements:
            req_lower = req.lower()
            for skill in tech_skills:
                if skill in req_lower:
                    skills.append(skill)
        
        # Check description
        desc_lower = description.lower()
        for skill in tech_skills:
            if skill in desc_lower:
                skills.append(skill)
        
        # Remove duplicates and return
        return list(set(skills))
    
    def _load_sample_jobs(self) -> List[Dict[str, Any]]:
        """Load sample job data"""
        return [
            {
                "title": "Senior Python Developer",
                "company": "TechCorp Inc.",
                "location": "San Francisco, CA",
                "description": "We are looking for a senior Python developer to join our team. You will work on building scalable web applications and APIs.",
                "requirements": [
                    "5+ years Python experience",
                    "Experience with Django or Flask",
                    "Knowledge of SQL databases",
                    "Experience with AWS",
                    "Strong problem-solving skills"
                ],
                "benefits": ["Health insurance", "401k", "Flexible hours", "Remote work"],
                "salary_range": "$120,000 - $150,000",
                "job_type": "full-time",
                "experience_level": "senior"
            },
            {
                "title": "Frontend Developer",
                "company": "StartupXYZ",
                "location": "New York, NY",
                "description": "Join our growing startup as a frontend developer. You'll work with React and modern JavaScript frameworks.",
                "requirements": [
                    "3+ years React experience",
                    "JavaScript/TypeScript proficiency",
                    "CSS/HTML expertise",
                    "Experience with state management",
                    "Git version control"
                ],
                "benefits": ["Equity", "Health insurance", "Unlimited PTO"],
                "salary_range": "$90,000 - $120,000",
                "job_type": "full-time",
                "experience_level": "mid"
            },
            {
                "title": "Data Scientist",
                "company": "DataCorp",
                "location": "Seattle, WA",
                "description": "We're seeking a data scientist to analyze large datasets and build machine learning models.",
                "requirements": [
                    "PhD or Master's in Data Science",
                    "Python/R programming",
                    "Machine learning experience",
                    "SQL and database knowledge",
                    "Statistical analysis skills"
                ],
                "benefits": ["Health insurance", "401k", "Learning budget"],
                "salary_range": "$110,000 - $140,000",
                "job_type": "full-time",
                "experience_level": "senior"
            },
            {
                "title": "Junior Software Engineer",
                "company": "InnovateTech",
                "location": "Austin, TX",
                "description": "Entry-level position for recent graduates. You'll work on various projects and learn from experienced developers.",
                "requirements": [
                    "Computer Science degree",
                    "Programming experience (any language)",
                    "Strong communication skills",
                    "Eagerness to learn",
                    "Problem-solving ability"
                ],
                "benefits": ["Mentorship program", "Health insurance", "401k"],
                "salary_range": "$60,000 - $80,000",
                "job_type": "full-time",
                "experience_level": "entry"
            },
            {
                "title": "DevOps Engineer",
                "company": "CloudScale",
                "location": "Remote",
                "description": "Remote DevOps engineer position. You'll manage cloud infrastructure and CI/CD pipelines.",
                "requirements": [
                    "3+ years DevOps experience",
                    "AWS/Azure/GCP knowledge",
                    "Docker and Kubernetes",
                    "CI/CD pipeline experience",
                    "Infrastructure as Code"
                ],
                "benefits": ["Remote work", "Health insurance", "401k", "Equipment budget"],
                "salary_range": "$100,000 - $130,000",
                "job_type": "full-time",
                "experience_level": "mid"
            }
        ]


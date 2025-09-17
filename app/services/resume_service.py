from datetime import datetime
from typing import Dict, Any, List
import re
from app.utils.ai_client import ai_client
from app.models.resume_models import ResumeAnalysisResponse, ResumeTailorResponse, StrengthWeakness

class ResumeService:
    """Service for resume analysis and tailoring"""
    
    def __init__(self):
        self.ai_client = ai_client
    
    def analyze_resume(self, resume_text: str, job_title: str = None, industry: str = None) -> ResumeAnalysisResponse:
        """Analyze resume and return structured analysis"""
        try:
            # Get AI analysis
            ai_analysis = self.ai_client.analyze_resume(resume_text, job_title)
            
            # Enhance with basic text analysis
            basic_analysis = self._basic_resume_analysis(resume_text)
            
            # Combine AI and basic analysis
            overall_score = self._calculate_overall_score(ai_analysis, basic_analysis)
            strengths = self._enhance_strengths(ai_analysis.get("strengths", []), basic_analysis)
            weaknesses = self._enhance_weaknesses(ai_analysis.get("weaknesses", []), basic_analysis)
            recommendations = self._enhance_recommendations(ai_analysis.get("recommendations", []), basic_analysis)
            
            return ResumeAnalysisResponse(
                overall_score=overall_score,
                strengths=strengths,
                weaknesses=weaknesses,
                recommendations=recommendations,
                summary=ai_analysis.get("summary", "Resume analysis completed."),
                analysis_timestamp=datetime.now().isoformat()
            )
        except Exception as e:
            # Fallback to basic analysis if AI fails
            basic_analysis = self._basic_resume_analysis(resume_text)
            return ResumeAnalysisResponse(
                overall_score=basic_analysis["score"],
                strengths=basic_analysis["strengths"],
                weaknesses=basic_analysis["weaknesses"],
                recommendations=basic_analysis["recommendations"],
                summary="Basic analysis completed. AI analysis unavailable.",
                analysis_timestamp=datetime.now().isoformat()
            )
    
    def tailor_resume(self, resume_text: str, job_description: str, job_title: str, company_name: str = None) -> ResumeTailorResponse:
        """Tailor resume for specific job"""
        try:
            # Use AI to tailor resume
            ai_result = self.ai_client.tailor_resume(
                resume_text=resume_text,
                job_description=job_description,
                job_title=job_title,
                company_name=company_name,
            )

            # Extract keywords from job description for reference
            keywords = self._extract_keywords(job_description)

            # Identify changes (augment AI output if needed)
            tailored_resume = ai_result.get("tailored_resume", resume_text)
            changes_made = ai_result.get("changes_made", [])
            if not changes_made:
                changes_made = self._identify_changes(resume_text, tailored_resume, keywords)

            keyword_matches = ai_result.get("keyword_matches", [])
            if not keyword_matches:
                keyword_matches = keywords[:10]

            return ResumeTailorResponse(
                tailored_resume=tailored_resume,
                changes_made=changes_made,
                keyword_matches=keyword_matches,
                tailoring_timestamp=datetime.now().isoformat()
            )
        except Exception as e:
            # Fallback response
            return ResumeTailorResponse(
                tailored_resume=resume_text,
                changes_made=["Tailoring service temporarily unavailable"],
                keyword_matches=[],
                tailoring_timestamp=datetime.now().isoformat()
            )
    
    def _basic_resume_analysis(self, resume_text: str) -> Dict[str, Any]:
        """Perform basic resume analysis without AI"""
        text_length = len(resume_text)
        word_count = len(resume_text.split())
        
        # Check for common sections
        sections_found = []
        if re.search(r'(?i)(experience|work history|employment)', resume_text):
            sections_found.append("Experience")
        if re.search(r'(?i)(education|degree|university|college)', resume_text):
            sections_found.append("Education")
        if re.search(r'(?i)(skills|technical skills|competencies)', resume_text):
            sections_found.append("Skills")
        if re.search(r'(?i)(summary|objective|profile)', resume_text):
            sections_found.append("Summary")
        
        # Calculate basic score
        score = 50  # Base score
        if word_count > 200:
            score += 10
        if word_count > 400:
            score += 10
        if len(sections_found) >= 3:
            score += 15
        if len(sections_found) >= 4:
            score += 15
        
        # Generate basic strengths and weaknesses
        strengths = []
        weaknesses = []
        recommendations = []
        
        if word_count > 300:
            strengths.append(StrengthWeakness(
                category="Length",
                description="Resume has adequate length and detail",
                impact="medium"
            ))
        else:
            weaknesses.append(StrengthWeakness(
                category="Length",
                description="Resume may be too short",
                impact="medium"
            ))
            recommendations.append("Add more detail to your experience and achievements")
        
        if "Skills" in sections_found:
            strengths.append(StrengthWeakness(
                category="Structure",
                description="Skills section is present",
                impact="high"
            ))
        else:
            weaknesses.append(StrengthWeakness(
                category="Structure",
                description="Skills section is missing",
                impact="high"
            ))
            recommendations.append("Add a dedicated skills section")
        
        if "Summary" in sections_found:
            strengths.append(StrengthWeakness(
                category="Structure",
                description="Professional summary is present",
                impact="medium"
            ))
        else:
            recommendations.append("Consider adding a professional summary")
        
        return {
            "score": min(score, 100),
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommendations": recommendations
        }
    
    def _calculate_overall_score(self, ai_analysis: Dict[str, Any], basic_analysis: Dict[str, Any]) -> float:
        """Calculate overall score combining AI and basic analysis"""
        ai_score = ai_analysis.get("overall_score", 0)
        basic_score = basic_analysis.get("score", 0)
        return (ai_score + basic_score) / 2
    
    def _enhance_strengths(self, ai_strengths: List[Dict], basic_analysis: Dict[str, Any]) -> List[StrengthWeakness]:
        """Enhance strengths from AI analysis"""
        strengths = []
        
        # Add AI strengths
        for strength in ai_strengths:
            if isinstance(strength, dict):
                strengths.append(StrengthWeakness(
                    category=strength.get("category", "General"),
                    description=strength.get("description", ""),
                    impact=strength.get("impact", "medium")
                ))
        
        # Add basic analysis strengths
        strengths.extend(basic_analysis.get("strengths", []))
        
        return strengths[:10]  # Limit to top 10
    
    def _enhance_weaknesses(self, ai_weaknesses: List[Dict], basic_analysis: Dict[str, Any]) -> List[StrengthWeakness]:
        """Enhance weaknesses from AI analysis"""
        weaknesses = []
        
        # Add AI weaknesses
        for weakness in ai_weaknesses:
            if isinstance(weakness, dict):
                weaknesses.append(StrengthWeakness(
                    category=weakness.get("category", "General"),
                    description=weakness.get("description", ""),
                    impact=weakness.get("impact", "medium")
                ))
        
        # Add basic analysis weaknesses
        weaknesses.extend(basic_analysis.get("weaknesses", []))
        
        return weaknesses[:10]  # Limit to top 10
    
    def _enhance_recommendations(self, ai_recommendations: List[str], basic_analysis: Dict[str, Any]) -> List[str]:
        """Enhance recommendations from AI analysis"""
        recommendations = list(ai_recommendations)
        recommendations.extend(basic_analysis.get("recommendations", []))
        return list(set(recommendations))[:10]  # Remove duplicates and limit
    
    def _extract_keywords(self, job_description: str) -> List[str]:
        """Extract important keywords from job description"""
        # Simple keyword extraction (can be enhanced with NLP)
        words = re.findall(r'\b[A-Za-z]{3,}\b', job_description.lower())
        
        # Filter common words
        stop_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'}
        
        keywords = [word for word in words if word not in stop_words]
        
        # Count frequency and return top keywords
        from collections import Counter
        keyword_counts = Counter(keywords)
        return [word for word, count in keyword_counts.most_common(20)]
    
    def _generate_tailored_resume(self, resume_text: str, keywords: List[str], job_title: str) -> str:
        """Generate tailored resume (placeholder implementation)"""
        # This is a placeholder - in a real implementation, you would use AI to rewrite sections
        tailored_resume = resume_text
        
        # Add a note about tailoring
        tailored_resume += f"\n\n[Tailored for {job_title} position - Keywords emphasized: {', '.join(keywords[:5])}]"
        
        return tailored_resume
    
    def _identify_changes(self, original: str, tailored: str, keywords: List[str]) -> List[str]:
        """Identify changes made during tailoring"""
        changes = []
        
        if len(tailored) > len(original):
            changes.append("Added keyword optimization")
        
        if any(keyword.lower() in tailored.lower() for keyword in keywords[:5]):
            changes.append("Emphasized relevant keywords")
        
        changes.append("Optimized for ATS compatibility")
        
        return changes


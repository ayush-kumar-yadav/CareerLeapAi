from datetime import datetime
from typing import List, Dict, Any, Optional
import uuid
from app.models.chat_models import ChatResponse, CareerCounselingResponse, ATSAnalysisResponse
from app.utils.ai_client import ai_client

class ChatService:
    """Service for chat and career counseling"""
    
    def __init__(self):
        self.ai_client = ai_client
        # In production, you'd store conversation history in a database
        self.conversation_history = {}
    
    def chat_response(self, message: str, conversation_history: List[Dict[str, str]] = None, 
                     context: Dict[str, Any] = None, user_id: str = None) -> ChatResponse:
        """Generate chat response for career counseling"""
        try:
            # Get AI response
            ai_response = self.ai_client.chat_response(message, conversation_history)
            
            # Generate conversation ID if not provided
            conversation_id = str(uuid.uuid4())
            
            # Generate suggestions based on the message
            suggestions = self._generate_suggestions(message, ai_response)
            
            # Store conversation history (in production, use database)
            if user_id:
                if user_id not in self.conversation_history:
                    self.conversation_history[user_id] = []
                self.conversation_history[user_id].append({
                    "role": "user",
                    "content": message,
                    "timestamp": datetime.now().isoformat()
                })
                self.conversation_history[user_id].append({
                    "role": "assistant",
                    "content": ai_response,
                    "timestamp": datetime.now().isoformat()
                })
            
            return ChatResponse(
                reply=ai_response,
                conversation_id=conversation_id,
                suggestions=suggestions,
                response_timestamp=datetime.now().isoformat()
            )
        except Exception as e:
            # Fallback response
            return ChatResponse(
                reply="I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
                conversation_id=str(uuid.uuid4()),
                suggestions=["Try asking about resume tips", "Ask about job search strategies"],
                response_timestamp=datetime.now().isoformat()
            )
    
    def career_counseling(self, current_role: str = None, experience_years: int = None,
                         skills: List[str] = None, career_goals: str = None,
                         challenges: List[str] = None, industry: str = None) -> CareerCounselingResponse:
        """Provide personalized career counseling"""
        try:
            # Build context for AI
            context = self._build_counseling_context(
                current_role, experience_years, skills, career_goals, challenges, industry
            )
            
            # Generate AI response
            ai_response = self._generate_counseling_response(context)
            
            # Parse AI response and structure it
            structured_response = self._parse_counseling_response(ai_response)
            
            return CareerCounselingResponse(
                advice=structured_response.get("advice", ai_response),
                action_plan=structured_response.get("action_plan", []),
                skill_recommendations=structured_response.get("skill_recommendations", []),
                career_paths=structured_response.get("career_paths", []),
                resources=structured_response.get("resources", []),
                counseling_timestamp=datetime.now().isoformat()
            )
        except Exception as e:
            # Fallback response
            return CareerCounselingResponse(
                advice="I'd be happy to help with your career development. Could you provide more details about your current situation and goals?",
                action_plan=["Schedule a follow-up consultation", "Complete skills assessment"],
                skill_recommendations=["Communication skills", "Technical skills relevant to your field"],
                career_paths=["Consider your current role progression", "Explore lateral moves"],
                resources=["LinkedIn Learning", "Industry conferences", "Professional networking"],
                counseling_timestamp=datetime.now().isoformat()
            )
    
    def ats_analysis(self, resume_text: str, job_description: str, ats_system: str = None) -> ATSAnalysisResponse:
        """Analyze resume for ATS compatibility"""
        try:
            # Basic ATS analysis
            basic_analysis = self._basic_ats_analysis(resume_text, job_description)

            # AI-enhanced analysis via AI client
            ai_result = self.ai_client.ats_feedback(
                resume_text=resume_text,
                job_description=job_description,
                ats_system=ats_system,
            )

            # Merge: prefer AI fields if present, fall back to basic
            ats_score = float(ai_result.get("ats_score", basic_analysis["score"]))
            keyword_matches = ai_result.get("keyword_matches", basic_analysis["keyword_matches"]) or basic_analysis["keyword_matches"]
            missing_keywords = ai_result.get("missing_keywords", basic_analysis["missing_keywords"]) or basic_analysis["missing_keywords"]
            formatting_issues = ai_result.get("formatting_issues", basic_analysis["formatting_issues"]) or basic_analysis["formatting_issues"]
            recommendations = ai_result.get("recommendations", basic_analysis["recommendations"]) or basic_analysis["recommendations"]

            return ATSAnalysisResponse(
                ats_score=round(ats_score, 1),
                keyword_matches=keyword_matches[:10],
                missing_keywords=missing_keywords[:10],
                formatting_issues=formatting_issues,
                recommendations=recommendations,
                analysis_timestamp=datetime.now().isoformat()
            )
        except Exception as e:
            # Fallback response
            return ATSAnalysisResponse(
                ats_score=0,
                keyword_matches=[],
                missing_keywords=[],
                formatting_issues=["Analysis temporarily unavailable"],
                recommendations=["Please try again later"],
                analysis_timestamp=datetime.now().isoformat()
            )
    
    def _generate_suggestions(self, user_message: str, ai_response: str) -> List[str]:
        """Generate follow-up suggestions based on conversation"""
        suggestions = []
        message_lower = user_message.lower()
        
        if "resume" in message_lower:
            suggestions.extend([
                "How can I improve my resume formatting?",
                "What keywords should I include?",
                "How do I optimize for ATS systems?"
            ])
        elif "job" in message_lower or "career" in message_lower:
            suggestions.extend([
                "What skills should I develop?",
                "How do I prepare for interviews?",
                "What career paths are available?"
            ])
        elif "interview" in message_lower:
            suggestions.extend([
                "What are common interview questions?",
                "How do I answer behavioral questions?",
                "What should I research about the company?"
            ])
        else:
            suggestions.extend([
                "Tell me about resume optimization",
                "Help me with job search strategies",
                "What career development resources do you recommend?"
            ])
        
        return suggestions[:3]  # Return top 3 suggestions
    
    def _build_counseling_context(self, current_role: str, experience_years: int,
                                 skills: List[str], career_goals: str,
                                 challenges: List[str], industry: str) -> Dict[str, Any]:
        """Build context for career counseling"""
        context = {
            "current_role": current_role or "Not specified",
            "experience_years": experience_years or 0,
            "skills": skills or [],
            "career_goals": career_goals or "Not specified",
            "challenges": challenges or [],
            "industry": industry or "Not specified"
        }
        return context
    
    def _generate_counseling_response(self, context: Dict[str, Any]) -> str:
        """Generate AI-powered career counseling response"""
        system_prompt = """You are an expert career counselor. Based on the provided context, 
        give personalized career advice. Structure your response with:
        1. Overall advice
        2. Action plan (3-5 steps)
        3. Skill recommendations
        4. Career paths to consider
        5. Resources to explore
        
        Be encouraging, specific, and actionable."""
        
        user_prompt = f"""
        Current role: {context['current_role']}
        Experience: {context['experience_years']} years
        Skills: {', '.join(context['skills'])}
        Career goals: {context['career_goals']}
        Challenges: {', '.join(context['challenges'])}
        Industry: {context['industry']}
        
        Please provide personalized career counseling advice.
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        return self.ai_client.generate_response(messages, max_tokens=1500)
    
    def _parse_counseling_response(self, response: str) -> Dict[str, Any]:
        """Parse AI counseling response into structured format"""
        # This is a simplified parser - in production, you'd use more sophisticated parsing
        lines = response.split('\n')
        
        structured = {
            "advice": response,
            "action_plan": [],
            "skill_recommendations": [],
            "career_paths": [],
            "resources": []
        }
        
        # Simple keyword-based parsing
        for line in lines:
            line_lower = line.lower()
            if "action" in line_lower or "step" in line_lower:
                if line.strip() and not line.startswith('#'):
                    structured["action_plan"].append(line.strip())
            elif "skill" in line_lower:
                if line.strip() and not line.startswith('#'):
                    structured["skill_recommendations"].append(line.strip())
            elif "career" in line_lower or "path" in line_lower:
                if line.strip() and not line.startswith('#'):
                    structured["career_paths"].append(line.strip())
            elif "resource" in line_lower or "recommend" in line_lower:
                if line.strip() and not line.startswith('#'):
                    structured["resources"].append(line.strip())
        
        return structured
    
    def _basic_ats_analysis(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Perform basic ATS analysis"""
        # Extract keywords from job description
        job_keywords = self._extract_keywords(job_description)
        resume_keywords = self._extract_keywords(resume_text)
        
        # Calculate keyword matches
        matches = [kw for kw in job_keywords if kw in resume_keywords]
        missing = [kw for kw in job_keywords if kw not in resume_keywords]
        
        # Calculate ATS score
        if len(job_keywords) == 0:
            score = 50
        else:
            score = (len(matches) / len(job_keywords)) * 100
        
        # Check for formatting issues
        formatting_issues = []
        if len(resume_text) < 200:
            formatting_issues.append("Resume may be too short")
        if not any(section in resume_text.lower() for section in ['experience', 'education', 'skills']):
            formatting_issues.append("Missing key sections")
        
        # Generate recommendations
        recommendations = []
        if score < 70:
            recommendations.append("Add more relevant keywords from the job description")
        if missing:
            recommendations.append(f"Consider adding these keywords: {', '.join(missing[:5])}")
        recommendations.append("Use standard section headers (Experience, Education, Skills)")
        recommendations.append("Avoid complex formatting and graphics")
        
        return {
            "score": round(score, 1),
            "keyword_matches": matches[:10],
            "missing_keywords": missing[:10],
            "formatting_issues": formatting_issues,
            "recommendations": recommendations
        }
    
    def _ai_ats_analysis(self, resume_text: str, job_description: str, ats_system: str) -> Dict[str, Any]:
        """AI-enhanced ATS analysis"""
        # Deprecated by direct call to AI client in ats_analysis
        return self._basic_ats_analysis(resume_text, job_description)
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text"""
        import re
        from collections import Counter
        
        # Simple keyword extraction
        words = re.findall(r'\b[A-Za-z]{3,}\b', text.lower())
        
        # Filter common words
        stop_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'}
        
        keywords = [word for word in words if word not in stop_words]
        
        # Count frequency and return top keywords
        keyword_counts = Counter(keywords)
        return [word for word, count in keyword_counts.most_common(20)]


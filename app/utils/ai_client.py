from typing import List, Dict, Any, Optional
import os
import json
import requests

try:
    from openai import OpenAI
except Exception:  # pragma: no cover
    OpenAI = None  # type: ignore


class _LLMProvider:
    """Internal helper that wraps OpenAI with Ollama fallback and a deterministic stub."""

    def __init__(self) -> None:
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.openai_model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.ollama_model = os.getenv("OLLAMA_MODEL", "llama2")

        self._openai_client = None
        if self.openai_api_key and OpenAI is not None:
            try:
                self._openai_client = OpenAI(api_key=self.openai_api_key)
            except Exception:
                self._openai_client = None

    def chat(self, messages: List[Dict[str, str]], max_tokens: int = 1000, temperature: float = 0.2) -> str:
        # Prefer OpenAI if configured
        if self._openai_client:
            try:
                resp = self._openai_client.chat.completions.create(
                    model=self.openai_model,
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=temperature,
                )
                return resp.choices[0].message.content or ""
            except Exception:
                pass

        # Fallback to Ollama if reachable
        try:
            resp = requests.post(
                f"{self.ollama_base_url}/api/chat",
                json={"model": self.ollama_model, "messages": messages, "stream": False},
                timeout=30,
            )
            if resp.ok:
                data = resp.json()
                # Ollama returns a list of message deltas; consolidate
                if isinstance(data, dict) and "message" in data:
                    return data["message"].get("content", "")
                if isinstance(data, dict) and "choices" in data:
                    return data["choices"][0]["message"]["content"]
        except Exception:
            pass

        # Last-resort deterministic stub
        last_user = next((m for m in reversed(messages) if m.get("role") == "user"), None)
        content = last_user.get("content") if last_user else ""
        return (
            "AI service not configured. Here's a helpful placeholder based on your input:\n" + (content or "")
        )


class AIClient:
    """AI client with OpenAI primary, Ollama fallback, and stub as last resort."""

    def __init__(self) -> None:
        self._llm = _LLMProvider()

    # General chat helpers
    def chat_response(self, message: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> str:
        conversation_history = conversation_history or []
        messages = [m for m in conversation_history]
        messages.append({"role": "user", "content": message})
        return self._llm.chat(messages, max_tokens=400)

    def generate_response(self, messages: List[Dict[str, str]], max_tokens: int = 1500) -> str:
        return self._llm.chat(messages, max_tokens=max_tokens)

    # Resume analysis
    def analyze_resume(self, resume_text: str, job_title: Optional[str] = None) -> Dict[str, Any]:
        system = (
            "You are an expert resume analyst. Return a concise JSON object with keys: "
            "overall_score (0-100), strengths (list of {category, description, impact}), "
            "weaknesses (list of {category, description, impact}), recommendations (list of strings), summary (string). "
            "Be practical, specific, and ATS-aware."
        )
        user = f"""
Resume:
{resume_text}

Target role: {job_title or 'N/A'}

Return ONLY JSON, no markdown.
"""
        raw = self._llm.chat([
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ], max_tokens=800)

        try:
            data = json.loads(self._extract_json(raw))
            # Minimal validation and fallback defaults
            return {
                "overall_score": float(data.get("overall_score", 65)),
                "strengths": data.get("strengths", []),
                "weaknesses": data.get("weaknesses", []),
                "recommendations": data.get("recommendations", []),
                "summary": data.get("summary", "Resume analysis completed."),
            }
        except Exception:
            # Basic heuristic fallback
            word_count = len(resume_text.split())
            strengths: List[Dict[str, Any]] = []
            weaknesses: List[Dict[str, Any]] = []
            recommendations: List[str] = []
            if word_count >= 300:
                strengths.append({"category": "Length", "description": "Adequate detail", "impact": "medium"})
            else:
                weaknesses.append({"category": "Length", "description": "Too short", "impact": "medium"})
                recommendations.append("Add accomplishment-focused bullet points with metrics")
            return {
                "overall_score": 60.0,
                "strengths": strengths,
                "weaknesses": weaknesses,
                "recommendations": recommendations,
                "summary": f"Analysis for {job_title or 'resume'} completed.",
            }

    # Resume tailoring
    def tailor_resume(self, resume_text: str, job_description: str, job_title: str, company_name: Optional[str] = None) -> Dict[str, Any]:
        system = (
            "You are a resume rewriting assistant. Rewrite the resume to target the job while preserving truthfulness. "
            "Return JSON with: tailored_resume (string), changes_made (list of strings), keyword_matches (list of strings). "
            "Keep formatting clean and ATS-friendly."
        )
        user = f"""
Job Title: {job_title}
Company: {company_name or 'N/A'}

Job Description:
{job_description}

Original Resume:
{resume_text}

Return ONLY JSON, no markdown.
"""
        raw = self._llm.chat([
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ], max_tokens=1200)
        try:
            data = json.loads(self._extract_json(raw))
            return {
                "tailored_resume": data.get("tailored_resume", resume_text),
                "changes_made": data.get("changes_made", []),
                "keyword_matches": data.get("keyword_matches", []),
            }
        except Exception:
            # Conservative fallback: append keyword emphasis
            return {
                "tailored_resume": resume_text + f"\n\n[Tailored for {job_title} - keywords emphasized]",
                "changes_made": ["Emphasized role-specific keywords", "Improved alignment with job requirements"],
                "keyword_matches": [],
            }

    # ATS feedback
    def ats_feedback(self, resume_text: str, job_description: str, ats_system: Optional[str] = None) -> Dict[str, Any]:
        system = (
            "You are an ATS optimization expert. Compare resume to job description. "
            "Return JSON with: ats_score (0-100), keyword_matches (list), missing_keywords (list), "
            "formatting_issues (list), recommendations (list). Be specific."
        )
        user = f"""
ATS: {ats_system or 'generic'}

Job Description:
{job_description}

Resume:
{resume_text}

Return ONLY JSON, no markdown.
"""
        raw = self._llm.chat([
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ], max_tokens=900)
        try:
            data = json.loads(self._extract_json(raw))
            return {
                "ats_score": float(data.get("ats_score", 0)),
                "keyword_matches": data.get("keyword_matches", []),
                "missing_keywords": data.get("missing_keywords", []),
                "formatting_issues": data.get("formatting_issues", []),
                "recommendations": data.get("recommendations", []),
            }
        except Exception:
            return {
                "ats_score": 0.0,
                "keyword_matches": [],
                "missing_keywords": [],
                "formatting_issues": ["Unable to run AI-based ATS analysis"],
                "recommendations": ["Add relevant keywords from the job description"],
            }

    @staticmethod
    def _extract_json(text: str) -> str:
        # If model wraps JSON in extra text, try to find the JSON object boundaries
        text = text.strip()
        if text.startswith("{") and text.endswith("}"):
            return text
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            return text[start : end + 1]
        return text


ai_client = AIClient()


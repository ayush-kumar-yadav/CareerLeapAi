# app/utils/ai_client.py

class AIClient:
    def __init__(self):
        # later we can connect OpenAI, Ollama, etc.
        pass

    def analyze(self, text: str):
        return {"message": f"AI processed: {text}"}

ai_client = AIClient()

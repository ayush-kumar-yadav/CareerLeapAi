# Career Leap AI - Complete Platform

A comprehensive AI-powered career development platform with both frontend (Next.js) and backend (FastAPI) components.

[![Frontend - Deployed on Vercel](https://img.shields.io/badge/Frontend-Deployed%20on%20Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/suman23bce8114-5658s-projects/v0-career-leap-ai-app)
[![Backend - FastAPI](https://img.shields.io/badge/Backend-FastAPI-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/T8uvhV2bkLJ)

## 🚀 Overview

Career Leap AI is a complete career development platform that helps users:
- **Resume Analysis**: Get AI-powered feedback on resume quality and ATS compatibility
- **Job Matching**: Find relevant job opportunities based on skills and preferences
- **Career Counseling**: Receive personalized career advice and development plans
- **Interview Preparation**: Get tips and practice for job interviews

## 📁 Project Structure

```
career-leap-ai/
├── app/                    # Next.js frontend
│   ├── auth/              # Authentication pages
│   ├── components/        # React components
│   └── ...
├── main.py                # FastAPI backend entry point
├── requirements.txt       # Python dependencies
├── app/                   # Backend application
│   ├── routes/           # API endpoints
│   ├── models/           # Pydantic models
│   ├── services/         # Business logic
│   └── utils/            # Utilities (AI client)
└── env.example           # Environment variables template
```

## 🛠️ Backend Setup (FastAPI)

### Prerequisites

- Python 3.8 or higher
- pip or pipenv
- OpenAI API key (optional) or Ollama for local AI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-leap-ai
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # For OpenAI (recommended)
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   
   # For local Ollama (alternative)
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama2
   ```

5. **Database setup**
   - Default is SQLite with `DATABASE_URL=sqlite:///./careerleap.db`
   - Tables auto-create at startup for development
   - For migrations, see Alembic below

4. **Run the backend server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at: `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

### AI Configuration Options

#### Option 1: OpenAI (Recommended)
- Get API key from [OpenAI](https://platform.openai.com/api-keys)
- Add to `.env`: `OPENAI_API_KEY=your_key_here`
- Uses GPT-3.5-turbo by default

#### Option 2: Local Ollama
- Install [Ollama](https://ollama.ai/)
- Run: `ollama pull llama2`
- Set in `.env`: `OLLAMA_BASE_URL=http://localhost:11434`

## 🔌 API Endpoints

### Resume Analysis
- `POST /api/v1/analyze-resume` - Analyze resume quality and provide feedback
- `POST /api/v1/tailor-resume` - Tailor resume for specific job
- `GET /api/v1/resume-tips` - Get resume optimization tips

### Job Matching
- `POST /api/v1/match-jobs` - Match jobs based on skills
- `POST /api/v1/search-jobs` - Search for jobs by query
- `GET /api/v1/job-categories` - Get available job categories
- `GET /api/v1/job-market-insights` - Get market trends

### Career Counseling
- `POST /api/v1/chat` - Chat with AI career counselor
- `POST /api/v1/career-counseling` - Get personalized career advice
- `POST /api/v1/ats-analysis` - Analyze ATS compatibility
- `GET /api/v1/chat-suggestions` - Get conversation starters
- `GET /api/v1/career-resources` - Get curated resources

### Health & Info
- `GET /` - API information
- `GET /health` - Health check

## 🚀 Deployment

### Deploy to Render

1. **Create Render account** at [render.com](https://render.com)

2. **Create new Web Service**
   - Connect your GitHub repository
   - Choose "Web Service"
   - Select your repository

3. **Configure build settings**
   ```
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **Set environment variables**
   - Add all variables from your `.env` file
   - Make sure to set `OPENAI_API_KEY` or configure Ollama

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set environment variables**
   ```bash
   railway variables set OPENAI_API_KEY=your_key_here
   ```

### Deploy to Heroku

1. **Install Heroku CLI** and login
   ```bash
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set OPENAI_API_KEY=your_key_here
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploy to DigitalOcean App Platform

1. **Create new app** in DigitalOcean dashboard
2. **Connect GitHub repository**
3. **Configure build settings**:
   - Build command: `pip install -r requirements.txt`
   - Run command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Add environment variables**
5. **Deploy**

## 🔧 Development

### Running in Development Mode

```bash
# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn main:app --reload

# Run with specific host/port
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Testing the API

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test resume analysis
curl -X POST "http://localhost:8000/api/v1/analyze-resume" \
     -H "Content-Type: application/json" \
     -d '{"resume_text": "Your resume text here"}'
```

### API Documentation

Once running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🌐 Frontend Integration

The backend is designed to work with the Next.js frontend. Update your frontend API calls to point to your deployed backend URL:

```javascript
// Example API call from frontend
const response = await fetch('https://your-backend-url.com/api/v1/analyze-resume', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    resume_text: resumeText,
    job_title: jobTitle
  })
});
```

## 📝 Environment Variables

Copy `env.example` to `.env` and configure:

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Optional* |
| `OPENAI_MODEL` | OpenAI model to use | No |
| `OLLAMA_BASE_URL` | Ollama server URL | No |
| `OLLAMA_MODEL` | Ollama model name | No |
| `DEBUG` | Enable debug mode | No |
| `HOST` | Server host | No |
| `PORT` | Server port | No |
| `DATABASE_URL` | SQLAlchemy URL (default SQLite) | No |
## 🗃️ Migrations with Alembic

1. Initialize Alembic:
   ```bash
   alembic init alembic
   ```
2. Edit `alembic.ini` and set `sqlalchemy.url` to your `DATABASE_URL` or use env var in `env.py`.
3. Generate initial migration:
   ```bash
   alembic revision --autogenerate -m "init"
   ```
4. Apply migrations:
   ```bash
   alembic upgrade head
   ```

*Either OpenAI API key or Ollama must be configured for AI features to work.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the environment configuration

---

**Frontend**: [v0.app Project](https://v0.app/chat/projects/T8uvhV2bkLJ) | **Backend**: FastAPI with AI Integration

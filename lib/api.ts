/**
 * API service for communicating with the FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ResumeUploadResponse {
  resume_id: number;
  extracted_text: string;
  file_name: string;
  file_size: number;
  file_type: string;
  extraction_timestamp: string;
  word_count: number;
  character_count: number;
}

export interface ResumeAnalysisRequest {
  resume_text: string;
  job_title?: string;
  industry?: string;
}

export interface ResumeAnalysisResponse {
  overall_score: number;
  strengths: Array<{
    category: string;
    description: string;
    impact: string;
  }>;
  weaknesses: Array<{
    category: string;
    description: string;
    impact: string;
  }>;
  recommendations: string[];
  summary: string;
  analysis_timestamp: string;
}

export interface ResumeTailorRequest {
  resume_text: string;
  job_description: string;
  job_title: string;
  company_name?: string;
}

export interface ResumeTailorResponse {
  tailored_resume: string;
  changes_made: string[];
  keyword_matches: string[];
  tailoring_timestamp: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Fetch all resumes for the demo user
   */
  async getResumes(): Promise<Array<{
    id: number
    user_id?: number
    file_name?: string | null
    file_type?: string | null
    file_size?: number | null
    created_at?: string
  }>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const resp = await this.request<{ resumes: Array<any> }>(
      '/api/v1/resumes',
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return resp.resumes || [];
  }

  /**
   * Fetch analysis for a resume by id
   */
  async getResumeAnalysis(resumeId: string | number): Promise<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return this.request(`/api/v1/analysis/${resumeId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  /**
   * Upload a resume file and extract text
   */
  async uploadResume(file: File): Promise<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(`${this.baseURL}/api/v1/upload-resume`, {
      method: 'POST',
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed with status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Analyze resume text
   */
  async analyzeResume(data: ResumeAnalysisRequest): Promise<ResumeAnalysisResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return this.request<ResumeAnalysisResponse>('/api/v1/analyze-resume', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  /**
   * Tailor resume for a specific job
   */
  async tailorResume(data: ResumeTailorRequest): Promise<ResumeTailorResponse> {
    return this.request<ResumeTailorResponse>('/api/v1/tailor-resume', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get resume tips
   */
  async getResumeTips(): Promise<{
    general_tips: string[];
    ats_optimization: string[];
    content_guidelines: string[];
  }> {
    return this.request('/api/v1/resume-tips');
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string }> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;

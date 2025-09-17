/**
 * Custom hook for handling resume uploads
 */
import { useState, useCallback } from 'react';
import { apiService, ResumeUploadResponse } from '@/lib/api';

export interface UseResumeUploadReturn {
  isUploading: boolean;
  uploadError: string | null;
  uploadProgress: number;
  uploadedResume: ResumeUploadResponse | null;
  uploadResume: (file: File) => Promise<void>;
  clearUpload: () => void;
  resetError: () => void;
}

export function useResumeUpload(): UseResumeUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedResume, setUploadedResume] = useState<ResumeUploadResponse | null>(null);

  const uploadResume = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const allowedExtensions = ['.pdf', '.docx'];
      
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error('Please upload a PDF or DOCX file');
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload the file
      const result = await apiService.uploadResume(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedResume(result);
      
      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 500);
      
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const clearUpload = useCallback(() => {
    setUploadedResume(null);
    setUploadError(null);
    setUploadProgress(0);
  }, []);

  const resetError = useCallback(() => {
    setUploadError(null);
  }, []);

  return {
    isUploading,
    uploadError,
    uploadProgress,
    uploadedResume,
    uploadResume,
    clearUpload,
    resetError,
  };
}

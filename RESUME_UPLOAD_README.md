# Resume Upload Feature Implementation

This document describes the implementation of PDF/DOCX resume upload functionality in the Career Leap AI application.

## Features Implemented

### Backend (FastAPI)
- **POST /api/v1/upload-resume** endpoint that accepts multipart/form-data
- Support for PDF and DOCX file formats
- Text extraction using `pdfminer.six` for PDFs and `python-docx` for DOCX files
- File validation (size limit: 10MB, supported formats: .pdf, .docx)
- Comprehensive error handling and validation
- Detailed response with extracted text, metadata, and statistics

### Frontend (Next.js/React)
- Real file upload functionality replacing the mock implementation
- Upload progress indicator with visual feedback
- Error handling with user-friendly messages
- Success confirmation with file statistics
- Automatic text extraction and display in modals
- Integration with existing resume analysis features

## File Structure

### Backend Files
- `app/utils/text_extractor.py` - Text extraction utilities for PDF and DOCX
- `app/models/resume_models.py` - Updated with ResumeUploadResponse model
- `app/routes/resume.py` - Added upload endpoint
- `requirements.txt` - Added pdfminer.six and python-docx dependencies

### Frontend Files
- `lib/api.ts` - API service for backend communication
- `lib/hooks/useResumeUpload.ts` - Custom hook for upload functionality
- `components/features-section.tsx` - Updated with real upload functionality
- `components/feature-modals/resume-tailor-modal.tsx` - Updated to use uploaded text
- `components/feature-modals/ats-analyzer-modal.tsx` - Updated to use uploaded text

## API Endpoint Details

### POST /api/v1/upload-resume

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (PDF or DOCX)

**Response:**
```json
{
  "extracted_text": "string",
  "file_name": "string",
  "file_size": "number",
  "file_type": "string",
  "extraction_timestamp": "string",
  "word_count": "number",
  "character_count": "number"
}
```

**Error Responses:**
- 400: Invalid file format or size
- 500: Processing error

## Usage Instructions

### Backend Setup
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the FastAPI server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variable (optional):
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Testing
1. Use the provided test script:
   ```bash
   python test_upload.py
   ```

2. Or test manually by uploading a PDF/DOCX file through the frontend

## Key Features

### Text Extraction
- **PDF**: Uses pdfminer.six with optimized layout parameters for better text extraction
- **DOCX**: Extracts text from paragraphs and tables
- **Text Cleaning**: Removes artifacts and normalizes whitespace

### Error Handling
- File format validation
- File size limits (10MB)
- Comprehensive error messages
- Graceful degradation for unsupported files

### User Experience
- Real-time upload progress
- Visual feedback for all states (uploading, success, error)
- Automatic integration with existing analysis features
- File statistics display (word count, character count)

## Security Considerations

- File size limits prevent DoS attacks
- File type validation prevents malicious uploads
- No persistent file storage - files are processed in memory
- Input validation and sanitization

## Future Enhancements

- Support for additional file formats (RTF, TXT)
- Batch file processing
- File caching for improved performance
- Advanced text extraction with OCR for image-based PDFs
- Resume parsing and structured data extraction

## Troubleshooting

### Common Issues

1. **Upload fails with "Unsupported file format"**
   - Ensure file is PDF or DOCX format
   - Check file extension is correct

2. **"File size too large" error**
   - Reduce file size to under 10MB
   - Compress PDF or optimize DOCX

3. **"Could not extract meaningful text" error**
   - File might be corrupted or password-protected
   - Try with a different file
   - Ensure file contains readable text (not just images)

4. **Connection errors**
   - Ensure FastAPI server is running on port 8000
   - Check NEXT_PUBLIC_API_URL environment variable
   - Verify CORS settings if running on different ports

### Debug Mode
Enable debug logging by setting the log level in the FastAPI application or browser developer tools for frontend debugging.

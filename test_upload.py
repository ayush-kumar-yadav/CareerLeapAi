#!/usr/bin/env python3
"""
Simple test script to verify the resume upload endpoint works
"""
import requests
import os

def test_upload_endpoint():
    """Test the upload resume endpoint"""
    
    # Test with a sample PDF file (you can create a simple one for testing)
    url = "http://localhost:8000/api/v1/upload-resume"
    
    # Create a simple test file
    test_content = """
    John Doe
    Software Engineer
    
    Experience:
    - Developed web applications using React and Node.js
    - Collaborated with cross-functional teams
    - Implemented RESTful APIs
    
    Skills:
    - JavaScript, Python, React, Node.js
    - Problem solving
    - Team collaboration
    """
    
    # For testing purposes, we'll create a simple text file and test the endpoint
    print("Testing resume upload endpoint...")
    
    try:
        # Test with a simple text file (simulating a DOCX)
        files = {
            'file': ('test_resume.txt', test_content, 'text/plain')
        }
        
        response = requests.post(url, files=files)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Upload successful!")
            print(f"File name: {data['file_name']}")
            print(f"Word count: {data['word_count']}")
            print(f"Character count: {data['character_count']}")
            print(f"Extracted text preview: {data['extracted_text'][:200]}...")
        else:
            print(f"❌ Upload failed with status {response.status_code}")
            print(f"Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the server. Make sure the FastAPI server is running on localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Health check failed with status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the server. Make sure the FastAPI server is running on localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("=== Testing FastAPI Resume Upload Endpoint ===\n")
    
    print("1. Testing health check...")
    test_health_check()
    print()
    
    print("2. Testing upload endpoint...")
    test_upload_endpoint()
    
    print("\n=== Test Complete ===")
    print("Note: To test with actual PDF/DOCX files, place them in this directory and modify the script.")

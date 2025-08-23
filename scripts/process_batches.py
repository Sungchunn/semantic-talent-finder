#!/usr/bin/env python3
"""
Simplified batch processor for Parquet files
Processes pre-split batch files and imports them via REST API
"""
import os
import json
import time
import requests
import pandas as pd
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed


class BatchProcessor:
    def __init__(self, batch_dir="data/batches", backend_url="http://localhost:8080"):
        self.batch_dir = Path(batch_dir)
        self.backend_url = backend_url
        self.session = requests.Session()
        
    def get_batch_files(self):
        """Get all valid batch files"""
        batch_files = list(self.batch_dir.glob("batch_*.parquet"))
        batch_files.sort()  # Process in order
        return batch_files
    
    def check_backend_health(self):
        """Verify backend is running"""
        try:
            response = self.session.get(f"{self.backend_url}/actuator/health", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def process_batch_file(self, batch_file):
        """Process a single batch file"""
        print(f"📦 Processing {batch_file.name}...")
        
        try:
            # Read batch file to get record count
            df = pd.read_parquet(batch_file)
            record_count = len(df)
            
            # Convert to simplified JSON format for API
            profiles = []
            for _, row in df.head(100).iterrows():  # Process first 100 records as test
                profile = {
                    "fullName": str(row.get("Full name", "")),
                    "firstName": str(row.get("First Name", "")),
                    "lastName": str(row.get("Last Name", "")),
                    "jobTitle": str(row.get("Job title", "")),
                    "companyName": str(row.get("Company Name", "")),
                    "industry": str(row.get("Industry", "")),
                    "location": str(row.get("Location", "")),
                    "linkedinUrl": str(row.get("LinkedIn Url", "")),
                    "skills": str(row.get("Skills", "")).split(",") if row.get("Skills") else [],
                    "summary": str(row.get("Summary", ""))
                }
                profiles.append(profile)
            
            # Send to backend API
            payload = {
                "batchId": batch_file.stem,
                "profiles": profiles
            }
            
            response = self.session.post(
                f"{self.backend_url}/api/profiles/batch",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                return {
                    "file": batch_file.name,
                    "status": "success",
                    "records_processed": len(profiles),
                    "total_records": record_count
                }
            else:
                return {
                    "file": batch_file.name,
                    "status": "error",
                    "error": f"HTTP {response.status_code}: {response.text}"
                }
                
        except Exception as e:
            return {
                "file": batch_file.name,
                "status": "error",
                "error": str(e)
            }
    
    def process_all_batches(self, max_workers=3):
        """Process all batch files with controlled concurrency"""
        if not self.check_backend_health():
            print("❌ Backend is not healthy. Please start the application first.")
            return
        
        batch_files = self.get_batch_files()
        print(f"🚀 Found {len(batch_files)} batch files to process")
        
        results = []
        successful = 0
        failed = 0
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all batch processing tasks
            future_to_batch = {
                executor.submit(self.process_batch_file, batch_file): batch_file 
                for batch_file in batch_files[:10]  # Process first 10 as test
            }
            
            for future in as_completed(future_to_batch):
                result = future.result()
                results.append(result)
                
                if result["status"] == "success":
                    successful += 1
                    print(f"✅ {result['file']}: {result['records_processed']} records")
                else:
                    failed += 1
                    print(f"❌ {result['file']}: {result['error']}")
        
        print(f"\n📊 Processing Summary:")
        print(f"   Total batches: {len(batch_files[:10])}")
        print(f"   Successful: {successful}")
        print(f"   Failed: {failed}")
        
        return results


if __name__ == "__main__":
    processor = BatchProcessor()
    results = processor.process_all_batches()
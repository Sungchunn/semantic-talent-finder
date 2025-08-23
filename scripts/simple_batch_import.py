#!/usr/bin/env python3
"""
Simple direct database batch import
Bypasses backend API to avoid PGvector serialization issues
"""
import pandas as pd
import psycopg2
from pathlib import Path
import uuid
from datetime import datetime
import json

def connect_to_db():
    """Connect directly to PostgreSQL database"""
    return psycopg2.connect(
        host="localhost",
        port=5433,
        database="semantic_talent_finder",
        user="postgres",
        password="postgres"
    )

def import_batch_file(batch_file, limit=5):
    """Import a single batch file directly to database"""
    print(f"📦 Processing {batch_file.name} (first {limit} records)...")
    
    try:
        # Read parquet file
        df = pd.read_parquet(batch_file)
        
        # Connect to database
        conn = connect_to_db()
        cursor = conn.cursor()
        
        # Process records
        imported_count = 0
        for idx, row in df.head(limit).iterrows():
            try:
                # Extract data with fallbacks
                profile_data = {
                    'id': str(uuid.uuid4()),
                    'full_name': str(row.get('Full name', '')),
                    'first_name': str(row.get('First Name', '')),
                    'last_name': str(row.get('Last Name', '')),
                    'job_title': str(row.get('Job title', '')),
                    'company_name': str(row.get('Company Name', '')),
                    'industry': str(row.get('Industry', '')),
                    'location': str(row.get('Location', '')),
                    'linkedin_url': str(row.get('LinkedIn Url', '')),
                    'summary': str(row.get('Summary', '')),
                    'skills': [s.strip() for s in str(row.get('Skills', '')).split(',') if s.strip()] if row.get('Skills') else [],
                    'searchable_content': ' '.join([
                        str(row.get('Full name', '')),
                        str(row.get('Job title', '')),
                        str(row.get('Company Name', '')),
                        str(row.get('Industry', '')),
                        str(row.get('Summary', ''))
                    ]).strip(),
                    'import_batch_id': batch_file.stem,
                    'created_at': datetime.utcnow(),
                    'updated_at': datetime.utcnow()
                }
                
                # Create headline
                headline = f"{profile_data['job_title'] or 'Professional'} at {profile_data['company_name'] or 'Company'}"
                profile_data['headline'] = headline
                
                # Insert into database (without embedding)
                insert_query = """
                INSERT INTO profiles (
                    id, full_name, first_name, last_name, job_title, company_name, 
                    industry, location, linkedin_url, summary, skills, searchable_content, 
                    headline, import_batch_id, created_at, updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                )
                """
                
                cursor.execute(insert_query, [
                    profile_data['id'], profile_data['full_name'], profile_data['first_name'],
                    profile_data['last_name'], profile_data['job_title'], profile_data['company_name'],
                    profile_data['industry'], profile_data['location'], profile_data['linkedin_url'],
                    profile_data['summary'], profile_data['skills'], profile_data['searchable_content'],
                    profile_data['headline'], profile_data['import_batch_id'], 
                    profile_data['created_at'], profile_data['updated_at']
                ])
                
                imported_count += 1
                
            except Exception as e:
                print(f"   ❌ Failed to import record {idx}: {e}")
        
        # Commit transaction
        conn.commit()
        cursor.close()
        conn.close()
        
        print(f"   ✅ Successfully imported {imported_count}/{limit} records from {batch_file.name}")
        return imported_count
        
    except Exception as e:
        print(f"   ❌ Failed to process {batch_file.name}: {e}")
        return 0

def main():
    """Import first few batch files for testing"""
    batch_dir = Path("data/batches")
    batch_files = sorted(batch_dir.glob("batch_*.parquet"))[:3]  # First 3 batches
    
    print(f"🚀 Starting simple batch import for {len(batch_files)} files...")
    
    total_imported = 0
    for batch_file in batch_files:
        imported = import_batch_file(batch_file, limit=5)
        total_imported += imported
    
    print(f"\n📊 Import Summary:")
    print(f"   Total files processed: {len(batch_files)}")
    print(f"   Total records imported: {total_imported}")
    
    # Check database
    try:
        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM profiles;")
        total_profiles = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        
        print(f"   Database now contains: {total_profiles} profiles")
        
    except Exception as e:
        print(f"   ❌ Failed to check database: {e}")

if __name__ == "__main__":
    main()
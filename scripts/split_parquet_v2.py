#!/usr/bin/env python3
"""
Optimized Parquet file splitter using DuckDB
Handles large files efficiently with streaming and progress tracking
"""
import os
import sys
import time
import duckdb
from pathlib import Path


def split_parquet_streaming(
    input_file: str,
    output_dir: str,
    batch_size: int = 50000,
    max_batches: int = None
):
    """
    Stream-based Parquet splitting for large files
    """
    print(f"🚀 Starting optimized Parquet splitting...")
    print(f"   Source: {input_file} ({os.path.getsize(input_file) / 1e9:.2f} GB)")
    print(f"   Output: {output_dir}")
    print(f"   Batch size: {batch_size:,} records per batch")
    
    start_time = time.time()
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Clean up any previous partial files
    for f in Path(output_dir).glob("batch_*.parquet"):
        if f.stat().st_size == 0:
            f.unlink()
            print(f"   Removed empty file: {f.name}")
    
    # Initialize DuckDB connection
    conn = duckdb.connect()
    
    # Get total record count
    print("📊 Analyzing file structure...")
    result = conn.execute(f"SELECT COUNT(*) FROM read_parquet('{input_file}')").fetchone()
    total_records = result[0]
    print(f"   Total records: {total_records:,}")
    
    # Calculate batches
    total_batches = (total_records + batch_size - 1) // batch_size
    if max_batches:
        total_batches = min(total_batches, max_batches)
    
    print(f"   Will create: {total_batches} batches")
    print()
    
    # Process in batches with progress tracking
    successful_batches = 0
    failed_batches = 0
    
    for batch_num in range(total_batches):
        batch_start_time = time.time()
        offset = batch_num * batch_size
        
        output_file = f"{output_dir}/batch_{batch_num:04d}.parquet"
        
        # Skip if file already exists and is not empty
        if os.path.exists(output_file) and os.path.getsize(output_file) > 0:
            print(f"   ⏭️  Skipping existing batch {batch_num:04d}")
            successful_batches += 1
            continue
        
        try:
            # Use DuckDB for efficient extraction
            query = f"""
                COPY (
                    SELECT * FROM read_parquet('{input_file}') 
                    LIMIT {batch_size} OFFSET {offset}
                ) TO '{output_file}' (FORMAT PARQUET)
            """
            
            conn.execute(query)
            
            # Verify the file was created successfully
            if os.path.exists(output_file) and os.path.getsize(output_file) > 0:
                file_size_mb = os.path.getsize(output_file) / 1024 / 1024
                batch_time = time.time() - batch_start_time
                
                successful_batches += 1
                
                # Progress reporting
                if (batch_num + 1) % 10 == 0 or batch_num == 0:
                    progress = (batch_num + 1) / total_batches * 100
                    elapsed = time.time() - start_time
                    est_remaining = (elapsed / (batch_num + 1)) * (total_batches - batch_num - 1)
                    
                    print(f"   ✅ Batch {batch_num:04d}: {file_size_mb:.1f}MB in {batch_time:.1f}s")
                    print(f"      Progress: {progress:.1f}% ({batch_num + 1}/{total_batches})")
                    print(f"      Estimated remaining: {est_remaining/60:.1f} minutes")
                    print()
            else:
                print(f"   ❌ Failed to create batch {batch_num:04d}")
                failed_batches += 1
                
        except Exception as e:
            print(f"   ❌ Error creating batch {batch_num:04d}: {e}")
            failed_batches += 1
            
            # Clean up failed file
            if os.path.exists(output_file):
                os.remove(output_file)
    
    # Final summary
    elapsed = time.time() - start_time
    total_size_gb = sum(f.stat().st_size for f in Path(output_dir).glob("*.parquet")) / 1e9
    
    print(f"\n🎯 Splitting completed!")
    print(f"   Successful batches: {successful_batches}")
    print(f"   Failed batches: {failed_batches}")
    print(f"   Total output size: {total_size_gb:.2f} GB")
    print(f"   Total time: {elapsed/60:.1f} minutes")
    print(f"   Average rate: {(successful_batches * batch_size) / elapsed:,.0f} records/second")
    
    # Create manifest
    create_manifest(output_dir, successful_batches, batch_size, total_records)
    
    return successful_batches


def create_manifest(output_dir, num_batches, batch_size, total_records):
    """Create a processing manifest"""
    import json
    
    manifest = {
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_batches": num_batches,
        "batch_size": batch_size,
        "estimated_total_records": min(num_batches * batch_size, total_records),
        "actual_total_records": total_records,
        "completion_percentage": min(100.0, (num_batches * batch_size) / total_records * 100),
        "files": [f"batch_{i:04d}.parquet" for i in range(num_batches)]
    }
    
    manifest_path = f"{output_dir}/manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"📋 Manifest created: {manifest_path}")


if __name__ == "__main__":
    INPUT_FILE = "data/USA_filtered.parquet"
    OUTPUT_DIR = "data/batches"
    BATCH_SIZE = 50000  # 50K records per batch
    
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Error: Input file not found: {INPUT_FILE}")
        sys.exit(1)
    
    try:
        num_batches = split_parquet_streaming(
            input_file=INPUT_FILE,
            output_dir=OUTPUT_DIR,
            batch_size=BATCH_SIZE
        )
        
        print(f"\n✨ Ready for processing!")
        print(f"   Run: python3 scripts/process_batches.py")
        
    except KeyboardInterrupt:
        print(f"\n⏹️  Process interrupted by user")
        print(f"   Partial results are saved in: {OUTPUT_DIR}")
        print(f"   Re-run to continue from where it left off")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
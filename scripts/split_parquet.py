#!/usr/bin/env python3
"""
High-performance Parquet file splitter using DuckDB and PyArrow
Efficiently splits large Parquet files into manageable batches for processing.
"""
import os
import sys
import time
from pathlib import Path
import duckdb
import pyarrow.parquet as pq
import pyarrow as pa


def split_parquet_file(
    input_file: str,
    output_dir: str,
    batch_size: int = 50000,  # Records per batch
    shard_strategy: str = "geographic"  # or "hash"
):
    """
    Split large Parquet file into smaller batches for efficient processing.
    
    Args:
        input_file: Path to source Parquet file
        output_dir: Directory for output batch files  
        batch_size: Number of records per batch
        shard_strategy: "geographic" or "hash" based sharding
    """
    
    print(f"🚀 Starting Parquet batch splitting...")
    print(f"   Source: {input_file}")
    print(f"   Output: {output_dir}")
    print(f"   Batch size: {batch_size:,} records")
    
    start_time = time.time()
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Initialize DuckDB connection
    conn = duckdb.connect()
    
    # First, get total record count and basic stats
    print("\n📊 Analyzing source file...")
    result = conn.execute(f"""
        SELECT 
            COUNT(*) as total_records,
            COUNT(DISTINCT "Location") as unique_locations,
            COUNT(DISTINCT "Industry") as unique_industries,
            MIN("Full name") as first_name,
            MAX("Full name") as last_name
        FROM read_parquet('{input_file}')
    """).fetchone()
    
    total_records = result[0]
    print(f"   Total records: {total_records:,}")
    print(f"   Unique locations: {result[1]:,}")
    print(f"   Unique industries: {result[2]:,}")
    
    # Calculate number of batches needed
    num_batches = (total_records + batch_size - 1) // batch_size
    print(f"   Estimated batches: {num_batches}")
    
    if shard_strategy == "geographic":
        # Geographic-based sharding for better locality
        print("\n🌍 Using geographic sharding strategy...")
        shards = _create_geographic_shards(conn, input_file, output_dir, batch_size)
    else:
        # Simple row-based batching
        print("\n🔢 Using hash-based sharding strategy...")
        shards = _create_hash_shards(conn, input_file, output_dir, batch_size, num_batches)
    
    elapsed = time.time() - start_time
    print(f"\n✅ Batch splitting completed!")
    print(f"   Created {len(shards)} batch files")
    print(f"   Total time: {elapsed:.2f} seconds")
    print(f"   Processing rate: {total_records/elapsed:,.0f} records/second")
    
    return shards


def _create_geographic_shards(conn, input_file, output_dir, batch_size):
    """Create shards based on geographic distribution"""
    shards = []
    
    # Define geographic regions for better data locality
    regions = {
        "west_coast": ["California", "CA", "San Francisco", "Los Angeles", "Seattle", "WA", "OR", "Portland"],
        "east_coast": ["New York", "NY", "Boston", "MA", "Washington", "DC", "Philadelphia", "PA"],
        "central": ["Texas", "TX", "Chicago", "IL", "Denver", "CO", "Austin", "Dallas"],
        "south": ["Florida", "FL", "Atlanta", "GA", "Miami", "North Carolina", "NC"],
        "other": []  # Will catch remaining records
    }
    
    batch_num = 0
    
    for region_name, keywords in regions.items():
        if region_name == "other":
            # Handle remaining records not matched by geographic keywords
            where_clause = " AND ".join([
                f"\"Location\" NOT ILIKE '%{keyword}%'" 
                for region_keywords in list(regions.values())[:-1]  # Exclude 'other'
                for keyword in region_keywords
            ])
        else:
            # Create geographic filter
            location_filters = " OR ".join([f"\"Location\" ILIKE '%{keyword}%'" for keyword in keywords])
            where_clause = f"({location_filters})"
        
        # Count records in this region
        count_result = conn.execute(f"""
            SELECT COUNT(*) FROM read_parquet('{input_file}') 
            WHERE {where_clause}
        """).fetchone()
        
        region_count = count_result[0]
        if region_count == 0:
            continue
            
        print(f"   Processing {region_name}: {region_count:,} records")
        
        # Split region into batches
        region_batches = (region_count + batch_size - 1) // batch_size
        
        for i in range(region_batches):
            offset = i * batch_size
            output_file = f"{output_dir}/batch_{batch_num:04d}_{region_name}_{i:03d}.parquet"
            
            # Extract batch using DuckDB's efficient LIMIT/OFFSET
            conn.execute(f"""
                COPY (
                    SELECT * FROM read_parquet('{input_file}') 
                    WHERE {where_clause}
                    LIMIT {batch_size} OFFSET {offset}
                ) TO '{output_file}' (FORMAT PARQUET)
            """)
            
            shards.append({
                'file': output_file,
                'region': region_name,
                'batch_index': i,
                'estimated_records': min(batch_size, region_count - offset)
            })
            
            batch_num += 1
            
            if batch_num % 10 == 0:
                print(f"     Created {batch_num} batches...")
    
    return shards


def _create_hash_shards(conn, input_file, output_dir, batch_size, num_batches):
    """Create shards using simple hash-based distribution"""
    shards = []
    
    print(f"   Creating {num_batches} hash-based batches...")
    
    for i in range(num_batches):
        offset = i * batch_size
        output_file = f"{output_dir}/batch_{i:04d}.parquet"
        
        # Use DuckDB for efficient batch extraction
        conn.execute(f"""
            COPY (
                SELECT * FROM read_parquet('{input_file}') 
                LIMIT {batch_size} OFFSET {offset}
            ) TO '{output_file}' (FORMAT PARQUET)
        """)
        
        shards.append({
            'file': output_file,
            'batch_index': i,
            'estimated_records': batch_size
        })
        
        if (i + 1) % 50 == 0:
            print(f"     Created {i + 1} batches...")
    
    return shards


def generate_processing_manifest(shards, output_dir):
    """Generate a manifest file for batch processing coordination"""
    manifest_file = f"{output_dir}/processing_manifest.json"
    
    import json
    manifest = {
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_batches": len(shards),
        "estimated_total_records": sum(s.get('estimated_records', 0) for s in shards),
        "sharding_strategy": "geographic" if any('region' in s for s in shards) else "hash",
        "batches": shards
    }
    
    with open(manifest_file, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"\n📋 Processing manifest created: {manifest_file}")
    return manifest_file


if __name__ == "__main__":
    # Configuration
    INPUT_FILE = "data/USA_filtered.parquet"
    OUTPUT_DIR = "data/batches"
    BATCH_SIZE = 50000  # Optimal for memory usage and processing speed
    SHARD_STRATEGY = "geographic"  # Better for data locality
    
    # Check if input file exists
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Error: Input file not found: {INPUT_FILE}")
        sys.exit(1)
    
    try:
        # Split the Parquet file
        shards = split_parquet_file(
            input_file=INPUT_FILE,
            output_dir=OUTPUT_DIR, 
            batch_size=BATCH_SIZE,
            shard_strategy=SHARD_STRATEGY
        )
        
        # Generate processing manifest
        manifest_file = generate_processing_manifest(shards, OUTPUT_DIR)
        
        print(f"\n🎯 Ready for batch processing!")
        print(f"   Batch directory: {OUTPUT_DIR}")
        print(f"   Manifest file: {manifest_file}")
        print(f"   Next step: Process batches with improved Java importer")
        
    except Exception as e:
        print(f"❌ Error during processing: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
#!/usr/bin/env python3
import pandas as pd
import numpy as np

# Load and analyze the dataset
df = pd.read_parquet('/Users/chromatrical/CAREER/Side Projects/semantic-talent-finder/data/USA_filtered.parquet')

print(f"📊 DATASET ANALYSIS")
print(f"Records: {len(df):,}")
print(f"Columns: {len(df.columns)}")
print(f"Memory: {df.memory_usage(deep=True).sum() / (1024**3):.2f} GB")
print(f"File size estimate: ~17 GB (including storage overhead)")

print("\n🗂️ COLUMN ANALYSIS")
print("First 10 columns:", list(df.columns[:10]))

# Location analysis for sharding
print("\n🌍 LOCATION ANALYSIS FOR SHARDING")
loc_cols = [c for c in df.columns if 'location' in c.lower() or 'country' in c.lower() or 'region' in c.lower() or 'metro' in c.lower()]
print("Location-related columns:", loc_cols)

for col in loc_cols[:4]:  # Analyze top location columns
    if col in df.columns:
        print(f"\n{col} distribution:")
        value_counts = df[col].value_counts().head(10)
        for idx, (val, count) in enumerate(value_counts.items()):
            percentage = (count / len(df)) * 100
            print(f"  {idx+1}. {val}: {count:,} ({percentage:.1f}%)")

# Industry analysis
print("\n🏢 INDUSTRY ANALYSIS")
industry_cols = [c for c in df.columns if 'industry' in c.lower()]
if industry_cols:
    col = industry_cols[0]
    print(f"Top industries in {col}:")
    industry_counts = df[col].value_counts().head(10)
    for idx, (val, count) in enumerate(industry_counts.items()):
        percentage = (count / len(df)) * 100
        print(f"  {idx+1}. {val}: {count:,} ({percentage:.1f}%)")

print(f"\n📈 SHARDING RECOMMENDATIONS")
print(f"Total records to shard: {len(df):,}")
print(f"Suggested shard size: ~12-15M records per shard")
print(f"Estimated shards needed: {int(np.ceil(len(df) / 12_000_000))}-{int(np.ceil(len(df) / 15_000_000))}")
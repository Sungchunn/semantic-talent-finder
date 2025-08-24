#!/bin/bash

# Semantic Talent Finder - Batch Upload Script
# This script uploads all parquet files from the batches directory to the backend API

set -e

# Configuration
API_BASE_URL="http://localhost:8080/api/import"
DATA_DIR="/Users/chromatrical/CAREER/Side Projects/semantic-talent-finder/data/batches"
LOG_FILE="/Users/chromatrical/CAREER/Side Projects/semantic-talent-finder/logs/batch_upload.log"
MAX_CONCURRENT=5  # Number of concurrent uploads
RETRY_ATTEMPTS=3  # Number of retry attempts for failed uploads

# Create logs directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Initialize counters
total_files=0
uploaded_files=0
failed_files=0
skipped_files=0

# Function to log messages
log_message() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

# Function to check backend health
check_backend_health() {
    local response=$(curl -s -w "%{http_code}" http://localhost:8080/api/health -o /dev/null)
    if [ "$response" != "200" ]; then
        log_message "ERROR" "Backend is not healthy (HTTP $response)"
        return 1
    fi
    return 0
}

# Function to upload a single file
upload_file() {
    local file_path=$1
    local filename=$(basename "$file_path")
    local attempts=0
    
    while [ $attempts -lt $RETRY_ATTEMPTS ]; do
        attempts=$((attempts + 1))
        
        log_message "INFO" "Uploading $filename (attempt $attempts/$RETRY_ATTEMPTS)"
        
        # Make the API request
        local response=$(curl -s -w "%{http_code}" \
            -X POST \
            -H "Content-Type: application/json" \
            -d "{\"filename\":\"data/batches/$filename\"}" \
            "$API_BASE_URL/parquet" \
            -o /tmp/upload_response.txt)
        
        if [ "$response" = "200" ]; then
            log_message "SUCCESS" "✅ Successfully uploaded $filename"
            return 0
        else
            local error_msg=$(cat /tmp/upload_response.txt 2>/dev/null || echo "Unknown error")
            log_message "WARNING" "❌ Failed to upload $filename (HTTP $response): $error_msg"
            
            if [ $attempts -lt $RETRY_ATTEMPTS ]; then
                local wait_time=$((attempts * 2))
                log_message "INFO" "Waiting ${wait_time}s before retry..."
                sleep $wait_time
            fi
        fi
    done
    
    return 1
}

# Function to get current database stats
get_db_stats() {
    local stats=$(curl -s http://localhost:8080/api/profiles/stats 2>/dev/null || echo '{"totalProfiles":0}')
    local count=$(echo "$stats" | grep -o '"totalProfiles":[0-9]*' | cut -d':' -f2 || echo "0")
    echo "$count"
}

# Main function
main() {
    echo -e "${BLUE}=== Semantic Talent Finder - Batch Upload Starting ===${NC}"
    log_message "INFO" "Batch upload process started"
    
    # Check backend health
    if ! check_backend_health; then
        echo -e "${RED}❌ Backend is not healthy. Please start the backend first.${NC}"
        exit 1
    fi
    
    # Get initial database stats
    local initial_count=$(get_db_stats)
    log_message "INFO" "Initial database profile count: $initial_count"
    
    # Count total files
    total_files=$(find "$DATA_DIR" -name "batch_*.parquet" | wc -l)
    log_message "INFO" "Found $total_files batch files to upload"
    
    if [ $total_files -eq 0 ]; then
        echo -e "${YELLOW}⚠️ No batch files found in $DATA_DIR${NC}"
        exit 0
    fi
    
    echo -e "${BLUE}📊 Starting upload of $total_files batch files...${NC}"
    echo -e "${YELLOW}⏱️ This process will take several hours for large datasets${NC}"
    
    # Process files in batches for better performance
    local current_batch=0
    local batch_size=$MAX_CONCURRENT
    
    find "$DATA_DIR" -name "batch_*.parquet" | sort | while IFS= read -r file; do
        current_batch=$((current_batch + 1))
        
        # Show progress
        local percentage=$(( (current_batch * 100) / total_files ))
        echo -e "${BLUE}📈 Progress: $current_batch/$total_files ($percentage%) - Processing $(basename "$file")${NC}"
        
        # Upload file
        if upload_file "$file"; then
            uploaded_files=$((uploaded_files + 1))
        else
            failed_files=$((failed_files + 1))
        fi
        
        # Show periodic stats every 50 files
        if [ $((current_batch % 50)) -eq 0 ]; then
            local current_count=$(get_db_stats)
            local new_profiles=$((current_count - initial_count))
            log_message "INFO" "📊 Progress update: $current_batch/$total_files processed, $new_profiles new profiles added to database"
        fi
        
        # Small delay to avoid overwhelming the backend
        sleep 1
    done
    
    # Final statistics
    local final_count=$(get_db_stats)
    local total_new_profiles=$((final_count - initial_count))
    
    echo -e "${GREEN}=== Batch Upload Complete ===${NC}"
    log_message "INFO" "Batch upload process completed"
    log_message "INFO" "📊 Final Statistics:"
    log_message "INFO" "  - Total files processed: $total_files"
    log_message "INFO" "  - Successfully uploaded: $uploaded_files"
    log_message "INFO" "  - Failed uploads: $failed_files"
    log_message "INFO" "  - Initial profile count: $initial_count"
    log_message "INFO" "  - Final profile count: $final_count"
    log_message "INFO" "  - New profiles added: $total_new_profiles"
    
    if [ $failed_files -gt 0 ]; then
        echo -e "${YELLOW}⚠️ Warning: $failed_files files failed to upload. Check the log for details.${NC}"
    fi
    
    echo -e "${GREEN}✅ Upload process completed! Added $total_new_profiles new profiles to the database.${NC}"
}

# Handle script interruption
trap 'echo -e "${RED}❌ Upload interrupted by user${NC}"; log_message "WARNING" "Upload process interrupted"; exit 130' INT TERM

# Run main function
main "$@"
#!/bin/bash

# Monitor the batch upload progress
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to get database stats
get_stats() {
    curl -s http://localhost:8080/api/profiles/stats 2>/dev/null || echo '{"totalProfiles":0,"totalLocations":0,"totalIndustries":0}'
}

# Function to format large numbers
format_number() {
    local num=$1
    if [ $num -ge 1000000 ]; then
        echo "${num:0:$((${#num}-6))}.${num:$((${#num}-6)):1}M"
    elif [ $num -ge 1000 ]; then
        echo "${num:0:$((${#num}-3))}.${num:$((${#num}-3)):1}K"
    else
        echo "$num"
    fi
}

echo -e "${BLUE}=== Semantic Talent Finder - Upload Monitor ===${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop monitoring${NC}"
echo ""

# Get initial stats
initial_stats=$(get_stats)
initial_count=$(echo "$initial_stats" | grep -o '"totalProfiles":[0-9]*' | cut -d':' -f2)

start_time=$(date +%s)
last_count=$initial_count

while true; do
    # Get current stats
    current_stats=$(get_stats)
    current_count=$(echo "$current_stats" | grep -o '"totalProfiles":[0-9]*' | cut -d':' -f2)
    location_count=$(echo "$current_stats" | grep -o '"totalLocations":[0-9]*' | cut -d':' -f2)
    industry_count=$(echo "$current_stats" | grep -o '"totalIndustries":[0-9]*' | cut -d':' -f2)
    
    # Calculate progress
    current_time=$(date +%s)
    elapsed_time=$((current_time - start_time))
    new_profiles=$((current_count - initial_count))
    recent_profiles=$((current_count - last_count))
    
    # Calculate rates
    if [ $elapsed_time -gt 0 ]; then
        profiles_per_second=$(echo "scale=2; $new_profiles / $elapsed_time" | bc -l 2>/dev/null || echo "0")
        profiles_per_hour=$(echo "scale=0; $profiles_per_second * 3600" | bc -l 2>/dev/null || echo "0")
    else
        profiles_per_second="0"
        profiles_per_hour="0"
    fi
    
    # Format elapsed time
    hours=$((elapsed_time / 3600))
    minutes=$(( (elapsed_time % 3600) / 60 ))
    seconds=$((elapsed_time % 60))
    
    # Display progress
    clear
    echo -e "${BLUE}=== Semantic Talent Finder - Real-time Statistics ===${NC}"
    echo -e "${GREEN}📊 Database Status:${NC}"
    echo -e "  Total Profiles: $(format_number $current_count)"
    echo -e "  Unique Locations: $(format_number $location_count)"
    echo -e "  Industries: $(format_number $industry_count)"
    echo ""
    echo -e "${GREEN}📈 Upload Progress:${NC}"
    echo -e "  New Profiles Added: $(format_number $new_profiles)"
    echo -e "  Profiles in Last 30s: $(format_number $recent_profiles)"
    echo -e "  Upload Rate: $(format_number ${profiles_per_hour%.*}) profiles/hour"
    echo ""
    echo -e "${GREEN}⏱️ Time Statistics:${NC}"
    echo -e "  Elapsed Time: ${hours}h ${minutes}m ${seconds}s"
    echo -e "  Last Updated: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo -e "${YELLOW}Target: 51.3M+ profiles | Press Ctrl+C to stop monitoring${NC}"
    
    # Store last count for next iteration
    last_count=$current_count
    
    # Wait 30 seconds before next update
    sleep 30
done
---
name: find-leads
description: Search Apollo.io for leads matching your criteria (industry, location, company size, job titles)
argument-hint: "[criteria] e.g., 'wellness clinics in Texas' or 'pharmacies with 10+ employees'"
allowed-tools:
  - Bash
  - Read
  - Write
  - WebFetch
---

# Find Leads Command

Search Apollo.io for prospects matching the user's criteria and export to CSV.

## Instructions

1. **Parse the search criteria** from the user's input:
   - Industry/keywords (e.g., "wellness clinics", "pharmacies")
   - Location (e.g., "Texas", "California")
   - Company size (e.g., "10+ employees", "small business")
   - Job titles (e.g., "medical director", "owner")

2. **Check for Apollo API key**:
   ```bash
   if [ -z "$APOLLO_API_KEY" ]; then
     echo "Error: APOLLO_API_KEY not set. Add it to ~/.elevare-env"
     exit 1
   fi
   ```

3. **Build the Apollo API request**:
   - Use the `/people/search` endpoint for contact searches
   - Use the `/organizations/search` endpoint for company searches
   - Apply filters based on parsed criteria

4. **Execute the search** using curl:
   ```bash
   curl -X POST "https://api.apollo.io/v1/mixed_people/search" \
     -H "Content-Type: application/json" \
     -H "Cache-Control: no-cache" \
     -d '{
       "api_key": "'$APOLLO_API_KEY'",
       "q_organization_domains": "",
       "page": 1,
       "per_page": 100,
       "organization_locations": ["Texas"],
       "organization_num_employees_ranges": ["1,10", "11,50"],
       "person_titles": ["Owner", "Medical Director", "Practice Manager"]
     }'
   ```

5. **Process results** and save to CSV:
   - Extract: name, email, phone, company, title, location, LinkedIn
   - Save to `~/Desktop/leads-{timestamp}.csv`
   - Report count and file location

6. **Output summary**:
   ```
   Found 47 leads matching "wellness clinics in Texas"
   Saved to: ~/Desktop/leads-2026-03-24.csv

   Top companies:
   - Austin Wellness Center (3 contacts)
   - Houston Hormone Clinic (2 contacts)
   - Dallas TRT Specialists (2 contacts)
   ```

## Search Criteria Mapping

| User Says | Apollo Filter |
|-----------|---------------|
| "wellness clinics" | organization_keywords: ["wellness", "clinic"] |
| "in Texas" | organization_locations: ["Texas, United States"] |
| "10+ employees" | organization_num_employees_ranges: ["11,50", "51,100"] |
| "medical director" | person_titles: ["Medical Director"] |
| "pharmacies" | organization_keywords: ["pharmacy", "compounding"] |

## Error Handling

- **No API key**: Prompt user to set APOLLO_API_KEY
- **Rate limited**: Wait and retry, or inform user
- **No results**: Suggest broadening search criteria
- **Invalid criteria**: Ask for clarification

## Tips

- Start with broad searches, then narrow down
- Export multiple searches to build a comprehensive list
- Use company size filters to focus on ideal customer profile

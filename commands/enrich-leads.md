---
name: enrich-leads
description: Enrich a CSV of leads with additional data (phone, email, LinkedIn, company info)
argument-hint: "[file.csv] [options: --add-linkedin, --add-phone, --validate-email]"
allowed-tools:
  - Bash
  - Read
  - Write
  - WebFetch
---

# Enrich Leads Command

Add missing contact data to a lead list using Apollo.io's enrichment API.

## Instructions

1. **Read the input CSV file**:
   - Parse the file path from arguments
   - Load and analyze the CSV structure
   - Identify existing columns (name, email, company, etc.)

2. **Determine what needs enrichment**:
   - Missing emails → use Apollo email finder
   - Missing phones → use Apollo phone enrichment
   - Missing LinkedIn → use Apollo profile lookup
   - Missing company data → use Apollo org enrichment

3. **Process each row**:
   ```bash
   # For each contact, call Apollo enrichment
   curl -X POST "https://api.apollo.io/v1/people/match" \
     -H "Content-Type: application/json" \
     -d '{
       "api_key": "'$APOLLO_API_KEY'",
       "first_name": "John",
       "last_name": "Smith",
       "organization_name": "Austin Wellness Center",
       "email": "john@example.com"
     }'
   ```

4. **Rate limiting**:
   - Apollo allows ~100 requests/minute
   - Add 600ms delay between requests
   - Show progress: "Enriching contact 15/47..."

5. **Save enriched file**:
   - Create new file: `{original}-enriched.csv`
   - Add new columns for enriched data
   - Keep original data intact

6. **Output summary**:
   ```
   Enrichment complete!

   Input: leads.csv (47 contacts)
   Output: leads-enriched.csv

   Data added:
   - 23 phone numbers found
   - 41 LinkedIn profiles found
   - 8 additional emails found
   - 47 company details enriched

   Coverage: 89% complete profiles
   ```

## Enrichment Options

| Option | Description |
|--------|-------------|
| `--add-linkedin` | Add LinkedIn profile URLs |
| `--add-phone` | Add phone numbers |
| `--validate-email` | Verify email deliverability |
| `--add-company` | Add company size, industry, revenue |
| `--all` | All enrichment types (default) |

## CSV Requirements

Minimum required columns:
- `name` or (`first_name` + `last_name`)
- `company` or `organization`
- `email` (optional but helps matching)

## Error Handling

- **File not found**: Ask user to verify path
- **Invalid CSV**: Report parsing errors
- **API errors**: Log failed rows, continue processing
- **Rate limits**: Pause and resume automatically

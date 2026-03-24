---
name: crm-sync
description: Sync leads to HubSpot CRM with tags and pipeline assignment
argument-hint: "[leads.csv] [options: --tag 'wellness-clinic', --pipeline 'partnerships']"
allowed-tools:
  - Bash
  - Read
  - Write
  - WebFetch
---

# CRM Sync Command

Push leads to HubSpot CRM with proper tagging and pipeline assignment.

## Instructions

1. **Check HubSpot API key**:
   ```bash
   if [ -z "$HUBSPOT_API_KEY" ]; then
     echo "Error: HUBSPOT_API_KEY not set. Add it to ~/.elevare-env"
     exit 1
   fi
   ```

2. **Read the leads CSV**:
   - Required: email, first_name, last_name, company
   - Optional: phone, title, linkedin, source

3. **Check for existing contacts** (avoid duplicates):
   ```bash
   curl -X POST "https://api.hubapi.com/crm/v3/objects/contacts/search" \
     -H "Authorization: Bearer $HUBSPOT_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "filterGroups": [{
         "filters": [{
           "propertyName": "email",
           "operator": "EQ",
           "value": "john@example.com"
         }]
       }]
     }'
   ```

4. **Create new contacts**:
   ```bash
   curl -X POST "https://api.hubapi.com/crm/v3/objects/contacts" \
     -H "Authorization: Bearer $HUBSPOT_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "properties": {
         "email": "john@austinwellness.com",
         "firstname": "John",
         "lastname": "Smith",
         "company": "Austin Wellness Center",
         "jobtitle": "Medical Director",
         "phone": "512-555-0123",
         "lead_source": "Apollo - Elevare Plugin",
         "lead_status": "New"
       }
     }'
   ```

5. **Apply tags/labels**:
   - Add to contact using custom property or list membership
   - Common tags: wellness-clinic, pharmacy, high-priority

6. **Assign to pipeline** (if deals):
   ```bash
   curl -X POST "https://api.hubapi.com/crm/v3/objects/deals" \
     -H "Authorization: Bearer $HUBSPOT_API_KEY" \
     -d '{
       "properties": {
         "dealname": "Austin Wellness Center - Partnership",
         "pipeline": "partnerships",
         "dealstage": "qualifiedtobuy",
         "amount": "50000"
       },
       "associations": [{
         "to": {"id": "contact-id"},
         "types": [{"associationCategory": "HUBSPOT_DEFINED", "associationTypeId": 3}]
       }]
     }'
   ```

7. **Output summary**:
   ```
   HubSpot Sync Complete
   =====================

   Contacts:
   - New contacts created: 34
   - Existing contacts updated: 8
   - Duplicates skipped: 5

   Tags Applied:
   - wellness-clinic: 34
   - texas: 34
   - high-priority: 12

   Pipeline:
   - Deals created: 12 (high-priority leads)
   - Pipeline: partnerships
   - Stage: Qualified

   View in HubSpot: https://app.hubspot.com/contacts/...
   ```

## Sync Options

| Option | Description |
|--------|-------------|
| `--tag "name"` | Apply tag to all contacts |
| `--pipeline "name"` | Create deals in pipeline |
| `--update` | Update existing contacts |
| `--dry-run` | Preview without syncing |
| `--from-apollo` | Sync recent Apollo exports |

## Field Mapping

| CSV Column | HubSpot Property |
|------------|------------------|
| email | email |
| first_name | firstname |
| last_name | lastname |
| company | company |
| title | jobtitle |
| phone | phone |
| linkedin | linkedin_url (custom) |
| source | lead_source |

## Pipeline Stages

| Stage | Description |
|-------|-------------|
| New | Fresh lead, not contacted |
| Contacted | Outreach sent |
| Qualified | Responded with interest |
| Meeting Scheduled | Call booked |
| Proposal Sent | Partnership proposal delivered |
| Won/Lost | Final outcome |

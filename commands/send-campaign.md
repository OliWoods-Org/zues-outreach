---
name: send-campaign
description: Send a personalized email campaign to a lead list using Instantly.ai
argument-hint: "[leads.csv] [template-name] [options: --schedule 'tomorrow 9am', --test]"
allowed-tools:
  - Bash
  - Read
  - Write
  - WebFetch
---

# Send Campaign Command

Send personalized cold email campaigns via Instantly.ai.

## Instructions

1. **Parse arguments**:
   - CSV file path with leads
   - Template name (e.g., "partnership-outreach")
   - Optional: schedule time, test mode

2. **Load the email template**:
   - Check `$CLAUDE_PLUGIN_ROOT/templates/` for template
   - Templates use {{variables}} for personalization

3. **Read the leads CSV**:
   - Required columns: email, first_name, company
   - Optional: title, location, custom fields

4. **Preview campaign** (if --test or first time):
   ```
   Campaign Preview:

   To: john@austinwellness.com
   Subject: Partnership opportunity for Austin Wellness Center

   Hi John,

   I noticed Austin Wellness Center offers hormone optimization...
   ```

5. **Send via Instantly API**:
   ```bash
   curl -X POST "https://api.instantly.ai/api/v1/campaign/add" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $INSTANTLY_API_KEY" \
     -d '{
       "name": "Elevare Partnership - 2026-03-24",
       "sending_account": "paul@elevarehealth.com",
       "sequences": [
         {
           "subject": "Partnership opportunity for {{company}}",
           "body": "Hi {{first_name}},\n\nI noticed {{company}} offers..."
         }
       ]
     }'
   ```

6. **Add leads to campaign**:
   ```bash
   curl -X POST "https://api.instantly.ai/api/v1/lead/add" \
     -H "Authorization: Bearer $INSTANTLY_API_KEY" \
     -d '{
       "campaign_id": "campaign-uuid",
       "leads": [
         {"email": "john@example.com", "first_name": "John", "company": "Austin Wellness"}
       ]
     }'
   ```

7. **Output confirmation**:
   ```
   Campaign created: "Elevare Partnership - 2026-03-24"

   Leads added: 47
   Template: partnership-outreach
   Scheduled: Tomorrow at 9:00 AM CST

   Sequence:
   - Day 0: Initial outreach
   - Day 3: Follow-up
   - Day 7: Case study share

   Track progress at: https://app.instantly.ai/campaigns/...
   ```

## Available Templates

| Template | Use Case |
|----------|----------|
| `partnership-outreach` | Cold outreach to wellness clinics |
| `pharmacy-partnership` | Compounding pharmacy outreach |
| `follow-up` | Generic follow-up sequence |
| `case-study` | Share success stories |
| `meeting-request` | Book a call |

## Campaign Options

| Option | Description |
|--------|-------------|
| `--schedule "tomorrow 9am"` | Schedule for later |
| `--test` | Send test email to yourself |
| `--sequence 3` | Number of follow-up emails |
| `--delay 3` | Days between emails |

## Safety Features

- Always preview before sending
- Confirm lead count before launch
- Test mode sends to your email only
- Unsubscribe link auto-added

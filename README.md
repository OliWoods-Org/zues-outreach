# Elevare Plugin

B2B sales automation toolkit for Elevare Health. Designed for non-technical users to run lead generation, email campaigns, Google Ads, and social listening operations.

## Features

| Command | Description |
|---------|-------------|
| `/find-leads` | Search Apollo.io for prospects by criteria |
| `/enrich-leads` | Add phone, email, LinkedIn to contact lists |
| `/send-campaign` | Send personalized email campaigns via Instantly |
| `/ads-report` | Get Google Ads performance metrics |
| `/social-listen` | Monitor Reddit/Twitter for opportunities |
| `/crm-sync` | Push leads to HubSpot CRM |

## Installation

### Prerequisites

- Claude Code installed (`npm install -g @anthropic-ai/claude-code`)
- API keys for the services you want to use

### Quick Install

```bash
# Clone the plugin
git clone https://github.com/OliWoods-Org/elevare-plugin.git ~/.claude/plugins/elevare-plugin

# Add your API keys
cp ~/.claude/plugins/elevare-plugin/.env.example ~/.elevare-env
# Edit ~/.elevare-env with your keys
echo "source ~/.elevare-env" >> ~/.zshrc
source ~/.zshrc
```

## Required API Keys

Create `~/.elevare-env` with these keys:

```bash
# Apollo.io - Lead database
export APOLLO_API_KEY="your-apollo-key"

# Instantly.ai - Email campaigns
export INSTANTLY_API_KEY="your-instantly-key"

# Google Ads - PPC management
export GOOGLE_ADS_CLIENT_ID="your-client-id"
export GOOGLE_ADS_CLIENT_SECRET="your-client-secret"
export GOOGLE_ADS_REFRESH_TOKEN="your-refresh-token"
export GOOGLE_ADS_CUSTOMER_ID="your-customer-id"

# HubSpot - CRM
export HUBSPOT_API_KEY="your-hubspot-key"

# Reddit - Social listening
export REDDIT_CLIENT_ID="your-reddit-client-id"
export REDDIT_CLIENT_SECRET="your-reddit-client-secret"
export REDDIT_USERNAME="your-reddit-username"
export REDDIT_PASSWORD="your-reddit-password"
```

## Usage Examples

### Find Leads
```
/find-leads wellness clinics in Texas
/find-leads pharmacies in California with 10+ employees
/find-leads "medical director" at healthcare companies
```

### Enrich Contacts
```
/enrich-leads contacts.csv
/enrich-leads apollo-export.csv --add-linkedin
```

### Send Email Campaign
```
/send-campaign leads.csv "partnership-outreach"
/send-campaign warm-leads.csv "follow-up" --schedule "tomorrow 9am"
```

### Get Ads Report
```
/ads-report
/ads-report --period "last 7 days"
/ads-report --campaign "TRT Texas"
```

### Social Listening
```
/social-listen "TRT" "testosterone therapy"
/social-listen "semaglutide" --reddit-only
```

### Sync to CRM
```
/crm-sync leads.csv
/crm-sync --from-apollo --tag "wellness-clinic"
```

## Agents

The plugin includes specialized agents that can be triggered automatically:

- **lead-prospector** - Autonomous lead research and scoring
- **campaign-builder** - Create email sequences from briefs
- **social-monitor** - Find and respond to social opportunities

## Support

For issues or questions, contact Matt Woods or refer to the Elevare Notion workspace.

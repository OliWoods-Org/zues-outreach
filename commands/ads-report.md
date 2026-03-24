---
name: ads-report
description: Get Google Ads performance report (spend, clicks, conversions, ROAS)
argument-hint: "[options: --period 'last 7 days', --campaign 'TRT Texas']"
allowed-tools:
  - Bash
  - Read
  - Write
  - WebFetch
---

# Ads Report Command

Fetch and display Google Ads performance metrics.

## Instructions

1. **Check Google Ads credentials**:
   ```bash
   if [ -z "$GOOGLE_ADS_REFRESH_TOKEN" ]; then
     echo "Error: Google Ads not configured. See README for setup."
     exit 1
   fi
   ```

2. **Parse report parameters**:
   - Period: "today", "last 7 days", "last 30 days", "this month"
   - Campaign filter: specific campaign name
   - Metrics: spend, clicks, impressions, conversions, CPA, ROAS

3. **Get OAuth access token**:
   ```bash
   ACCESS_TOKEN=$(curl -s -X POST "https://oauth2.googleapis.com/token" \
     -d "client_id=$GOOGLE_ADS_CLIENT_ID" \
     -d "client_secret=$GOOGLE_ADS_CLIENT_SECRET" \
     -d "refresh_token=$GOOGLE_ADS_REFRESH_TOKEN" \
     -d "grant_type=refresh_token" | jq -r '.access_token')
   ```

4. **Fetch campaign data** via Google Ads API:
   ```bash
   curl -X POST "https://googleads.googleapis.com/v14/customers/$GOOGLE_ADS_CUSTOMER_ID/googleAds:search" \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "developer-token: $GOOGLE_ADS_DEVELOPER_TOKEN" \
     -d '{
       "query": "SELECT campaign.name, metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.conversions FROM campaign WHERE segments.date DURING LAST_7_DAYS"
     }'
   ```

5. **Format the report**:
   ```
   Google Ads Report - Last 7 Days
   ================================

   Overall Performance:
   - Spend: $1,247.83
   - Clicks: 892
   - Impressions: 23,456
   - CTR: 3.8%
   - Conversions: 34
   - CPA: $36.70
   - ROAS: 4.2x

   By Campaign:
   ┌─────────────────┬─────────┬────────┬────────┬─────┐
   │ Campaign        │ Spend   │ Clicks │ Conv   │ CPA │
   ├─────────────────┼─────────┼────────┼────────┼─────┤
   │ TRT Texas       │ $523.45 │ 412    │ 18     │ $29 │
   │ Weight Loss TX  │ $487.12 │ 356    │ 12     │ $41 │
   │ Brand Awareness │ $237.26 │ 124    │ 4      │ $59 │
   └─────────────────┴─────────┴────────┴────────┴─────┘

   Top Keywords:
   1. "trt clinic near me" - 156 clicks, 8 conv ($19 CPA)
   2. "testosterone therapy online" - 89 clicks, 5 conv ($28 CPA)
   3. "semaglutide prescription" - 67 clicks, 4 conv ($35 CPA)

   Recommendations:
   - Increase budget on "TRT Texas" (best CPA)
   - Pause "Brand Awareness" (highest CPA)
   - Add negative keywords for "free" searches
   ```

6. **Save report** (optional):
   - Export to `~/Desktop/ads-report-{date}.csv`

## Report Options

| Option | Description |
|--------|-------------|
| `--period "last 7 days"` | Time range |
| `--campaign "name"` | Filter to specific campaign |
| `--export` | Save to CSV file |
| `--keywords` | Include keyword performance |
| `--compare` | Compare to previous period |

## Metrics Explained

| Metric | Description | Good Target |
|--------|-------------|-------------|
| CTR | Click-through rate | >3% |
| CPA | Cost per acquisition | <$50 |
| ROAS | Return on ad spend | >3x |
| Conv Rate | Conversion rate | >5% |

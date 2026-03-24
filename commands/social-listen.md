---
name: social-listen
description: Monitor Reddit and Twitter for conversations about TRT, hormones, and weight loss
argument-hint: "[keywords] [options: --reddit-only, --twitter-only, --last-24h]"
allowed-tools:
  - Bash
  - Read
  - Write
  - WebFetch
---

# Social Listen Command

Monitor social media for B2C opportunities and brand mentions.

## Instructions

1. **Parse keywords and options**:
   - Keywords: "TRT", "testosterone", "semaglutide", etc.
   - Platform: Reddit, Twitter, or both
   - Time range: last 24h, 7 days, etc.

2. **Search Reddit** using the API:
   ```bash
   # Get Reddit access token
   TOKEN=$(curl -s -X POST "https://www.reddit.com/api/v1/access_token" \
     -u "$REDDIT_CLIENT_ID:$REDDIT_CLIENT_SECRET" \
     -d "grant_type=password&username=$REDDIT_USERNAME&password=$REDDIT_PASSWORD" \
     | jq -r '.access_token')

   # Search subreddits
   curl -s "https://oauth.reddit.com/r/testosterone/search?q=clinic&sort=new&limit=25" \
     -H "Authorization: Bearer $TOKEN" \
     -H "User-Agent: ElevareBot/1.0"
   ```

3. **Target subreddits**:
   - r/testosterone (150K+ members)
   - r/TRT (50K+ members)
   - r/PEDs (performance enhancing)
   - r/weightloss (3M+ members)
   - r/biohacking (500K+ members)
   - r/longevity (health span)

4. **Filter for high-intent posts**:
   - Questions asking for clinic recommendations
   - Frustration with current provider
   - Price comparisons
   - New to TRT/considering starting

5. **Score opportunities**:
   ```
   High Intent (respond first):
   - "looking for online TRT clinic"
   - "anyone recommend a telehealth provider"
   - "switching from [competitor]"

   Medium Intent (monitor):
   - General TRT questions
   - Side effect discussions
   - Protocol questions

   Low Intent (skip):
   - Memes
   - Steroid discussions (not TRT)
   - Off-topic
   ```

6. **Output report**:
   ```
   Social Listening Report - Last 24 Hours
   ========================================

   HIGH INTENT (5 opportunities):

   1. r/testosterone - 2 hours ago
      "Looking for online TRT clinic recommendations"
      Score: 95/100 | 12 comments | Growing thread
      Link: https://reddit.com/r/testosterone/...

      Suggested response:
      "I've been with an online clinic for 6 months now.
      Key things to look for: comprehensive labs, responsive
      provider, transparent pricing. Happy to share more
      about my experience if helpful!"

   2. r/TRT - 5 hours ago
      "Frustrated with [competitor] pricing changes"
      Score: 88/100 | 8 comments
      Link: https://reddit.com/r/trt/...

   MEDIUM INTENT (12 posts):
   - Protocol questions: 4
   - Side effect discussions: 5
   - General questions: 3

   TRENDING TOPICS:
   - Semaglutide shortages (mentioned 23x)
   - AI dosing calculators (new trend)
   - At-home testing kits

   Recommended Actions:
   1. Respond to post #1 (highest intent)
   2. Create content about transparent pricing
   3. Monitor semaglutide shortage discussions
   ```

## Response Guidelines

**DO:**
- Be helpful and educational
- Share personal experience (if applicable)
- Answer questions honestly
- Build credibility over time

**DON'T:**
- Directly promote Elevare
- Make medical claims
- Spam multiple threads
- Use multiple accounts

## Keywords to Monitor

| Category | Keywords |
|----------|----------|
| TRT | testosterone, TRT, low T, hormone therapy |
| Weight Loss | semaglutide, Ozempic, Wegovy, GLP-1 |
| General | telehealth, online clinic, men's health |

## Options

| Option | Description |
|--------|-------------|
| `--reddit-only` | Only search Reddit |
| `--twitter-only` | Only search Twitter |
| `--last-24h` | Last 24 hours only |
| `--high-intent` | Only show high-intent posts |
| `--export` | Save to CSV |

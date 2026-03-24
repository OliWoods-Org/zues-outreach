#!/bin/bash
# Check if Elevare API keys are configured

MISSING_KEYS=""

# Check each API key
if [ -z "$APOLLO_API_KEY" ]; then
    MISSING_KEYS="$MISSING_KEYS\n  - APOLLO_API_KEY (for /find-leads)"
fi

if [ -z "$INSTANTLY_API_KEY" ]; then
    MISSING_KEYS="$MISSING_KEYS\n  - INSTANTLY_API_KEY (for /send-campaign)"
fi

if [ -z "$HUBSPOT_API_KEY" ]; then
    MISSING_KEYS="$MISSING_KEYS\n  - HUBSPOT_API_KEY (for /crm-sync)"
fi

# Only show warning if keys are missing
if [ -n "$MISSING_KEYS" ]; then
    echo "⚠️  Elevare Plugin: Some API keys not configured:"
    echo -e "$MISSING_KEYS"
    echo ""
    echo "Add keys to ~/.elevare-env and run: source ~/.elevare-env"
fi

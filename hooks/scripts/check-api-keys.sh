#!/bin/bash
# Warn if common Zeus / execution-layer API keys are missing (optional keys only)

MISSING_KEYS=""

if [ -z "$APOLLO_API_KEY" ]; then
    MISSING_KEYS="$MISSING_KEYS\n  - APOLLO_API_KEY (for /find-leads)"
fi

if [ -z "$INSTANTLY_API_KEY" ]; then
    MISSING_KEYS="$MISSING_KEYS\n  - INSTANTLY_API_KEY (for /send-campaign)"
fi

if [ -z "$HUBSPOT_API_KEY" ]; then
    MISSING_KEYS="$MISSING_KEYS\n  - HUBSPOT_API_KEY (for /crm-sync)"
fi

if [ -n "$MISSING_KEYS" ]; then
    echo "⚠️  Zeus (zues-outreach): some API keys not set in the environment:"
    echo -e "$MISSING_KEYS"
    echo ""
    echo "Add keys to ~/.zeus-env or ~/.elevare-env, then: source that file"
fi

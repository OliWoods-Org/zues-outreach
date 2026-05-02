#!/bin/bash
# Zeus Growth OS (zues-outreach) — Claude plugin installer
# Run with: curl -fsSL https://raw.githubusercontent.com/OliWoods-Org/zues-outreach/main/scripts/install.sh | bash

set -e

PLUGIN_DIR="${ZEUS_PLUGIN_DIR:-$HOME/.claude/plugins/zues-outreach}"
ENV_FILE="${ZEUS_ENV_FILE:-$HOME/.zeus-env}"
REPO_URL="https://github.com/OliWoods-Org/zues-outreach.git"

echo "⚡ Installing Zeus Growth OS (Claude plugin)..."
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Installing via Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "Installing Homebrew first..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew install node
fi

# Check for Claude Code
if ! command -v claude &> /dev/null; then
    echo "📦 Installing Claude Code..."
    npm install -g @anthropic-ai/claude-code
fi

mkdir -p "$HOME/.claude/plugins"

# Clone or update
if [ -d "$PLUGIN_DIR" ]; then
    echo "🔄 Updating existing plugin at $PLUGIN_DIR..."
    cd "$PLUGIN_DIR"
    git pull
elif [ -d "$HOME/.claude/plugins/elevare-plugin" ]; then
    echo "📌 Legacy install found at ~/.claude/plugins/elevare-plugin"
    echo "   Pull latest there, or remove it and re-run to use $PLUGIN_DIR"
    cd "$HOME/.claude/plugins/elevare-plugin"
    git pull
    PLUGIN_DIR="$HOME/.claude/plugins/elevare-plugin"
else
    echo "📥 Cloning $REPO_URL → $PLUGIN_DIR"
    git clone "$REPO_URL" "$PLUGIN_DIR"
fi

# Environment file
if [ ! -f "$ENV_FILE" ]; then
    echo "📝 Creating $ENV_FILE from .env.example..."
    cp "$PLUGIN_DIR/.env.example" "$ENV_FILE"
    echo ""
    echo "⚠️  IMPORTANT: Edit $ENV_FILE to add your API keys!"
fi

SHELL_PROFILE=""
if [ -f "$HOME/.zshrc" ]; then
    SHELL_PROFILE="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_PROFILE="$HOME/.bashrc"
fi

ENV_LINE="source $ENV_FILE"
if [ -n "$SHELL_PROFILE" ] && ! grep -qF "$ENV_FILE" "$SHELL_PROFILE" 2>/dev/null; then
    echo "$ENV_LINE" >> "$SHELL_PROFILE"
    echo "✅ Added environment loader to $SHELL_PROFILE"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit $ENV_FILE with your API keys"
echo "   2. Run: source $ENV_FILE"
echo "   3. Run: claude"
echo ""
echo "📘 Master build plan: docs/ZEUS_FINAL_BUILD_PLAN.md"
echo ""
echo "🚀 Commands: /zeus /find-leads /enrich-leads /send-campaign /ads-report /social-listen /crm-sync /airtable-sync"

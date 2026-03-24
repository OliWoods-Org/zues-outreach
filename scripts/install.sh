#!/bin/bash
# Elevare B2B Toolkit - One-Click Installer
# Run with: curl -fsSL https://raw.githubusercontent.com/OliWoods-Org/elevare-plugin/main/scripts/install.sh | bash

set -e

echo "🏥 Installing Elevare B2B Toolkit..."
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

# Create plugins directory
mkdir -p ~/.claude/plugins

# Clone or update the plugin
if [ -d ~/.claude/plugins/elevare-plugin ]; then
    echo "🔄 Updating existing plugin..."
    cd ~/.claude/plugins/elevare-plugin
    git pull
else
    echo "📥 Downloading plugin..."
    git clone https://github.com/OliWoods-Org/elevare-plugin.git ~/.claude/plugins/elevare-plugin
fi

# Create environment file if it doesn't exist
if [ ! -f ~/.elevare-env ]; then
    echo "📝 Creating environment file..."
    cp ~/.claude/plugins/elevare-plugin/.env.example ~/.elevare-env
    echo ""
    echo "⚠️  IMPORTANT: Edit ~/.elevare-env to add your API keys!"
fi

# Add to shell profile if not already there
SHELL_PROFILE=""
if [ -f ~/.zshrc ]; then
    SHELL_PROFILE=~/.zshrc
elif [ -f ~/.bashrc ]; then
    SHELL_PROFILE=~/.bashrc
fi

if [ -n "$SHELL_PROFILE" ]; then
    if ! grep -q "source ~/.elevare-env" "$SHELL_PROFILE"; then
        echo "source ~/.elevare-env" >> "$SHELL_PROFILE"
        echo "✅ Added environment loader to $SHELL_PROFILE"
    fi
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit ~/.elevare-env to add your API keys"
echo "   2. Run: source ~/.elevare-env"
echo "   3. Run: claude"
echo ""
echo "🚀 Available commands:"
echo "   /find-leads - Search Apollo for prospects"
echo "   /enrich-leads - Add data to contact lists"
echo "   /send-campaign - Send email campaigns"
echo "   /ads-report - Google Ads performance"
echo "   /social-listen - Reddit/Twitter monitoring"
echo "   /crm-sync - Push to HubSpot"
echo ""
echo "Need help? Contact Matt Woods"

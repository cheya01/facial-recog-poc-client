#!/bin/bash

# This script replaces environment variable placeholders in the built files
# Used during Vercel deployment

# Default API URL if not set
API_URL="${NG_APP_API_URL:-http://localhost:3000}"

echo "Replacing environment variables..."
echo "API_URL: $API_URL"

# Find and replace in all JavaScript files in dist
if [ -d "dist" ]; then
  find dist -type f \( -name "*.js" -o -name "*.mjs" \) -exec sed -i.bak "s|\${NG_APP_API_URL}|$API_URL|g" {} \;
  find dist -name "*.bak" -type f -delete
  echo "Environment variables replaced successfully!"
else
  echo "Warning: dist directory not found"
fi

#!/bin/bash

# Create environment.ts from template if it doesn't exist
if [ ! -f "src/environments/environment.ts" ]; then
  echo "Creating environment.ts from template..."
  cp src/environments/environment.template.ts src/environments/environment.ts
fi

# Replace placeholder with actual environment variable in environment.prod.ts
API_URL="${NG_APP_API_URL:-http://localhost:3000}"
echo "Setting API URL to: $API_URL"

# Replace in the production environment file before build
sed -i.bak "s|NG_APP_API_URL_PLACEHOLDER|${API_URL}|g" src/environments/environment.prod.ts
rm -f src/environments/environment.prod.ts.bak

echo "Environment configured successfully!"

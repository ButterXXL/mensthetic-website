#!/bin/bash

# Load environment variables
source .env

# Start Supabase MCP server
npx -y @supabase/mcp-server-supabase@latest \
  --read-only \
  --project-ref="$SUPABASE_PROJECT_REF" \
  --access-token="$SUPABASE_ACCESS_TOKEN"
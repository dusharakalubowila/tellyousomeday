#!/bin/bash
# Production startup script for DigitalOcean
echo "🚀 Starting TellYouSomeday backend..."
echo "Environment: $NODE_ENV"
echo "Port: $PORT"
echo "MongoDB URI configured: $(echo $MONGODB_URI | cut -c1-30)..."

# Start the server
node server.js

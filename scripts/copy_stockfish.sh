#!/bin/bash

set -euxo pipefail
LOG_FILE="/tmp/deploy_debug.log"
echo "Running $(basename "$0")..." >> "$LOG_FILE"

echo "Copying stockfish..." >> "$LOG_FILE"

# Define paths
STATIC_SECRETS_DIR="/home/ec2-user/static-secrets"
STOCKFISH_DIR="/home/ec2-user/chessButBetter/stockfish"

# Ensure secrets directory exists
if [ ! -d "$STATIC_SECRETS_DIR" ]; then
    echo "Error: Stockfish directory does not exist: $STATIC_SECRETS_DIR"
    exit 1
fi

# Copy the secrets.properties file
echo "Copying stockfish"
mkdir -p $STOCKFISH_DIR/stockfish
cp $STATIC_SECRETS_DIR/stockfish $STOCKFISH_DIR

# Set correct permissions
chmod 700 $STOCKFISH_DIR/stockfish
chown ec2-user:ec2-user $STOCKFISH_DIR/stockfish

echo "✅ Stockfish copied successfully."

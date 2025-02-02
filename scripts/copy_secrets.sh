#!/bin/bash

# Define paths
STATIC_SECRETS_DIR="/home/ec2-user/static-secrets"
APP_SECRETS_DIR="/home/ec2-user/chessButBetter/backend/src/main/resources"

# Ensure secrets directory exists
if [ ! -d "$STATIC_SECRETS_DIR" ]; then
    echo "Error: Secrets directory does not exist: $STATIC_SECRETS_DIR"
    exit 1
fi

# Copy the secrets.properties file
echo "Copying secrets.properties..."
cp $STATIC_SECRETS_DIR/secrets.properties $APP_SECRETS_DIR/secrets.properties

# Set correct permissions
chmod 600 $APP_SECRETS_DIR/secrets.properties
chown ec2-user:ec2-user $APP_SECRETS_DIR/secrets.properties

echo "✅ Secrets copied successfully."

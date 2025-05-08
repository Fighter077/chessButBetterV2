#!/bin/bash
set -euxo pipefail

LOG_FILE="/tmp/deploy_debug.log"
echo "Running $(basename "$0")..." >> "$LOG_FILE"

# CONFIGURATION
PROD_IP="51.20.11.215"
SSH_KEY="/home/ec2-user/static-secrets/chessButBetter.pem"
DEPLOY_USER="ec2-user"
DEPLOY_PATH="/home/ec2-user/deployment"
ARCHIVE_NAME="full_deploy.tar.gz"
SOURCE_DIR="/home/ec2-user/chessButBetter"

echo "Creating full archive of source + build..." >> "$LOG_FILE"

# Create a tarball of the entire project directory
cd "$(dirname "$SOURCE_DIR")"
tar -czf "$ARCHIVE_NAME" "$(basename "$SOURCE_DIR")"

echo "Ensuring deployment directory exists on prod..." >> "$LOG_FILE"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$DEPLOY_USER@$PROD_IP" "mkdir -p $DEPLOY_PATH"

echo "Copying archive to prod server..." >> "$LOG_FILE"
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no "$ARCHIVE_NAME" "$DEPLOY_USER@$PROD_IP:$DEPLOY_PATH/"

echo "Triggering unpack + restart on prod..." >> "$LOG_FILE"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$DEPLOY_USER@$PROD_IP" << 'EOF'
  set -euxo pipefail

  DEPLOY_PATH="/home/ec2-user/deployment"
  TARGET_PATH="/home/ec2-user/chessButBetter"

  cd "$DEPLOY_PATH"

  # Unpack and overwrite the whole directory
  tar -xzf full_deploy.tar.gz

  # Move new code into place
  cp -r chessButBetter/ "$TARGET_PATH/"

  # Optional cleanup
  rm -f full_deploy.tar.gz

  # Restart services
  bash "$TARGET_PATH/scripts/copy_frontend.sh"
  bash "$TARGET_PATH/scripts/start_frontend.sh"
  bash "$TARGET_PATH/scripts/start_backend.sh"
EOF

echo "Full transfer and deploy complete." >> "$LOG_FILE"

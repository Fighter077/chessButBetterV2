#!/bin/bash
set -euxo pipefail
LOG_FILE="/tmp/deploy_debug.log"
echo "Running $(basename "$0")..." >> "$LOG_FILE"

echo "Installing backend..." >> "$LOG_FILE"

cd /home/ec2-user/chessButBetter/backend
mkdir -p logs
sudo bash ./mvnw clean install
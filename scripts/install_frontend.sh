#!/bin/bash
set -euxo pipefail
LOG_FILE="/tmp/deploy_debug.log"
echo "Running $(basename "$0")..." >> "$LOG_FILE"

echo "Installing frontend..." >> "$LOG_FILE"

cd /home/ec2-user/chessButBetter/frontend
mkdir -p logs
sudo npm install -N
sudo npm run build
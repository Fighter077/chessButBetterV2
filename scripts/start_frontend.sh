#!/bin/bash
set -euxo pipefail
LOG_FILE="/tmp/deploy_debug.log"
echo "Running $(basename "$0")..." >> "$LOG_FILE"

echo "Starting frontend..." >> "$LOG_FILE"

cd /home/ec2-user/chessButBetter/frontend
sudo systemctl restart nginx
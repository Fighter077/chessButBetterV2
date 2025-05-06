#!/bin/bash
set -euxo pipefail
LOG_FILE="/tmp/deploy_debug.log"
echo "Running $(basename "$0")..." >> "$LOG_FILE"

echo "Starting backend..." >> "$LOG_FILE"

cd /home/ec2-user/chessButBetter/backend

PID=$(pgrep -f 'chessButBetter-0.0.1-SNAPSHOT.jar' || true)

if [ -n "$PID" ]; then
  echo "Killing existing backend server (PID: $PID)..."
  kill "$PID"
  sleep 2
fi


nohup java -jar target/chessButBetter-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod > /home/ec2-user/chessButBetter/backend/logs/logs.log 2>&1 &
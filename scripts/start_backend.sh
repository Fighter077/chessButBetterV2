#!/bin/bash
cd /home/ec2-user/chessButBetter/backend
nohup java -jar target/chessButBetter-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod > /home/ec2-user/chessButBetter/backend/logs/logs.log 2>&1 &
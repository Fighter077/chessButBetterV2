cd /home/ec2-user/chessButBetter/frontend
nohup npx http-server dist -p 80 > /home/ec2-user/chessButBetter/logs/frontend.log 2>&1 &
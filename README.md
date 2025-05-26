# chessButBetterV2

Prerequisites:

Install mysql server and create schema: "chessbutbetter". Provide root user password in '/backend/src/main/resources/secrets.properties' as 'DB_PASSWORD=***'.
 
Run 'cd frontend' & 'npm install' & 'ng serve' for development frontend server.

Frontend should be reachable under 'http://localhost:4200'.

Make sure to have a stockfish executable at /stockfish/stockfish.exe

Run 'cd backend' & 'mvn clean install -DskipTests' & 'mvn spring-boot:run -Dspring-boot.run.profiles=dev' for development backend server.

Flyway will automatically create all necessary tables and data.
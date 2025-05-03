# chessButBetterV2

Prerequisites:

Install mysql server and create schema: "chessbutbetter". Provide root user password in '/backend/src/main/resources/secrets.properties' as 'DB_PASSWORD=***'.
 
Run 'cd frontend' & 'npm install' & 'ng serve' for development frontend server.

Frontend should be reachable under 'http://localhost:4200'.

Run 'cd backend' & 'mvn clean install' & 'mvn spring-boot:run -Dspring-boot.run.profiles=dev' for development backend server.

Jakarta will automatically create all necessary tables and data.
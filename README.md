# ChessButBetterV2

A full-stack chess application with enhanced features, powered by a Spring Boot backend and an Angular frontend. Integrates Stockfish for chess engine analysis.

---

## Prerequisites

- **MySQL Server**: Install and create a schema named `chessbutbetter`.
- **Node.js & npm**: For running the Angular frontend.
- **Java 17+ and Maven**: For building and running the backend.
- **Stockfish**: Ensure a Stockfish executable is located at `/stockfish/stockfish.exe`.

---

## Setup & Installation

### 1. Database Configuration

1. Install MySQL server.
2. Create a schema/database named: `chessbutbetter`.
3. Provide your secrets in `/backend/src/main/resources/secrets.properties` as:
   ```
   DB_PASSWORD=your_mysql_root_password
   admin.password=your_admin_password # Sets the admin user password for the initially created admin user
   KEYSTORE_PASSWORD=your_keystore_password # For SSL configuration (only used in production)
   ```

### 2. Stockfish Engine

- Download the Stockfish engine and place the executable at:  
    - Windows/Dev:
        ```
        /stockfish/stockfish.exe
        ```
    - Linux/Prod:
        ```
        /stockfish/stockfish
        ```

---

## Running the Application

### Development Environment

#### Backend (Spring Boot)
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
- This will start the backend server in development mode.
- Flyway will automatically create all necessary tables and data.

#### Frontend (Angular)
```bash
cd frontend
npm install
ng serve
```
- The frontend will be available at [http://localhost:4200](http://localhost:4200).
- Hot-reloading is enabled for development.

---

### Production Environment

#### Backend (Spring Boot)
```bash
cd backend
mvn clean install -DskipTests
java -jar target/chessButBetterV2-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```
- This will start the backend server in production mode.
- Make sure your `secrets.properties` and any other configurations are set for a production environment.

#### Frontend (Angular)
```bash
cd frontend
npm install
ng build --configuration production
```
- The production-ready build will be output to `frontend/dist/`.
- Serve the contents of `dist/chess-but-better-ang/browser` using your preferred web server (e.g., Nginx, Apache, or Node.js static server).

---

## Usage

- **Frontend (Development):** Visit [http://localhost:4200](http://localhost:4200) in your browser.
- **Frontend (Production):** Serve `frontend/dist/` with a production web server.
- **Backend: (Development)** Runs on the configured port ([http://localhost:5000](http://localhost:5000) by default, check `application-dev.properties`).
- **Backend: (Production)** Runs on the configured port ([http://localhost:5010](http://localhost:5010) by default, check `application-prod.properties`).

---

## Project Structure

```
chessButBetterV2/
│
├── backend/       # Spring Boot backend (Java)
│
├── frontend/      # Angular frontend (TypeScript)
│
├── stockfish/     # Place Stockfish engine here
│
└── README.md
```

---

## Development

### Frontend (Angular)

- Generated with [Angular CLI](https://github.com/angular/angular-cli) v18.1.3.
- Common commands:
  - `ng serve` - Start development server.
  - `ng build` - Build for production.

### Backend (Spring Boot)

- Built with Maven, Java 17+.
- Uses Flyway for database migrations.
- Configurations are managed via `resources/*.properties`, which should be set appropriately for development or production.

---

## Contributing

Pull requests are welcome! Please open issues for any bugs or feature requests.

---

## Acknowledgements

- [Stockfish Chess Engine](https://stockfishchess.org/)
- [Angular](https://angular.io/)
- [Spring Boot](https://spring.io/projects/spring-boot)
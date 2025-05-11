CREATE TABLE IF NOT EXISTS user_ids (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    FOREIGN KEY (user_id) REFERENCES user_ids(user_id)
);

CREATE TABLE IF NOT EXISTS temp_users (
    user_id BIGINT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES user_ids(user_id)
);

CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_ids(user_id)
);

CREATE TABLE IF NOT EXISTS queue (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_ids(user_id)
);

CREATE TABLE IF NOT EXISTS games (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player1_id BIGINT NOT NULL,
    player2_id BIGINT NOT NULL,
    result VARCHAR(255),
    FOREIGN KEY (player1_id) REFERENCES user_ids(user_id),
    FOREIGN KEY (player2_id) REFERENCES user_ids(user_id)
);

CREATE TABLE IF NOT EXISTS moves (
    game_id BIGINT NOT NULL,
    move_number INT NOT NULL,
    move VARCHAR(255) NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id),
    PRIMARY KEY (game_id, move_number)
);
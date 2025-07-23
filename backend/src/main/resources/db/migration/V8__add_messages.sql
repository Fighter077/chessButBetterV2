CREATE TABLE IF NOT EXISTS game_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    game_id BIGINT,
    content VARCHAR(255) NOT NULL,
    sender_id BIGINT,
    timestamp DATETIME NOT NULL,
    is_public BOOLEAN NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (sender_id) REFERENCES user_ids(user_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES user_ids(user_id),
    FOREIGN KEY (receiver_id) REFERENCES user_ids(user_id)
);
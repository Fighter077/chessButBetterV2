CREATE TABLE IF NOT EXISTS oauth_temp_users (
    user_id BIGINT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    provider VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_ids(user_id)
);
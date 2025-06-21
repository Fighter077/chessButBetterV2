CREATE TABLE IF NOT EXISTS cookie_acceptance (
    acceptance_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    acceptance_time DATETIME NOT NULL,
    acceptance_level ENUM('REJECTED', 'ACCEPTED_FULL', 'ACCEPTED_PARTIAL') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_ids(user_id)
);
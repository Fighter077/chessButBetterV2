CREATE TABLE IF NOT EXISTS draw_offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    game_id BIGINT NOT NULL,
    player_id BIGINT NOT NULL,
    offer_time DATETIME(6) NOT NULL,
    action ENUM('OFFERED', 'REJECTED') NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (player_id) REFERENCES user_ids(user_id)
);
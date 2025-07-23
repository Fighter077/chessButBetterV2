package com.chessButBetter.chessButBetter.interfaces;

import java.time.LocalDateTime;

public interface MessageDto {
    String getContent();

    void setContent(String content);

    Long getSenderId();

    void setSenderId(Long senderId);

    LocalDateTime getTimestamp();

    void setTimestamp(LocalDateTime timestamp);
}

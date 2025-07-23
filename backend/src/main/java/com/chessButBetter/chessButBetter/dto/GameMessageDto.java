package com.chessButBetter.chessButBetter.dto;

import java.time.LocalDateTime;

import com.chessButBetter.chessButBetter.interfaces.MessageDto;

public class GameMessageDto implements MessageDto {
    private Long gameId;
    private String content;
    private Long senderId;
    private LocalDateTime timestamp;
    private Boolean isPublic;

    public GameMessageDto() {
    }

    public GameMessageDto(Long gameId, String content, Long senderId, LocalDateTime timestamp, Boolean isPublic) {
        this.gameId = gameId;
        this.content = content;
        this.senderId = senderId;
        this.timestamp = timestamp;
        this.isPublic = isPublic;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    @Override
    public String getContent() {
        return content;
    }

    @Override
    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public Long getSenderId() {
        return senderId;
    }

    @Override
    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    @Override
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    @Override
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }
    
    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
}

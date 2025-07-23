package com.chessButBetter.chessButBetter.dto;

import java.time.LocalDateTime;

import com.chessButBetter.chessButBetter.interfaces.MessageDto;

public class ChatMessageDto implements MessageDto {
    private String content;
    private Long senderId;
    private LocalDateTime timestamp;

    public ChatMessageDto() {
    }

    public ChatMessageDto(String content, Long senderId, LocalDateTime timestamp) {
        this.content = content;
        this.senderId = senderId;
        this.timestamp = timestamp;
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
    
}

package com.chessButBetter.chessButBetter.dto;

import com.chessButBetter.chessButBetter.enums.GameWebSocketMessageType;

public class GameWebSocketMessage {
    private GameWebSocketMessageType type;
    private Object content;

    public GameWebSocketMessage(GameWebSocketMessageType type, Object content) {
        this.type = type;
        this.content = content;
    }

    public GameWebSocketMessageType getType() {
        return type;
    }

    public void setType(GameWebSocketMessageType type) {
        this.type = type;
    }

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }
}

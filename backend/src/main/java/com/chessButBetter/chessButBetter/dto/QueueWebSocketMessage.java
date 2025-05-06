package com.chessButBetter.chessButBetter.dto;

import com.chessButBetter.chessButBetter.enums.QueueWebSocketMessageType;

public class QueueWebSocketMessage {
    private QueueWebSocketMessageType type;
    private Object content;

    public QueueWebSocketMessage(QueueWebSocketMessageType type, Object content) {
        this.type = type;
        this.content = content;
    }

    public QueueWebSocketMessageType getType() {
        return type;
    }

    public void setType(QueueWebSocketMessageType type) {
        this.type = type;
    }

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }
}

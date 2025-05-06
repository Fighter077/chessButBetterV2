package com.chessButBetter.chessButBetter.webSocket.exception;

import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

public class StompErrorHandler extends StompSubProtocolErrorHandler {

    @SuppressWarnings("null")
    @Override
    public Message<byte[]> handleClientMessageProcessingError(Message<byte[]> clientMessage, Throwable ex) {
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.ERROR);
        accessor.setMessage("WebSocket connection denied: " + ex.getMessage());
        accessor.setLeaveMutable(true);

        String errorPayload = "ERROR: " + ex.getMessage();
        return MessageBuilder.createMessage(errorPayload.getBytes(), accessor.getMessageHeaders());
    }
}

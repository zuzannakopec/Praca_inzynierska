package com.example.backend.handler;

import com.example.backend.model.Chatroom;
import com.example.backend.model.Message;
import com.example.backend.model.User;
import com.example.backend.service.ChatroomService;
import com.example.backend.service.MessageService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;


public class NotificationHandler extends TextWebSocketHandler {
    private static final Logger log = Logger.getLogger(ChatroomHandler.class.getName());
    private final MessageService messageService;
    private final ChatroomService chatroomService;
    private final Long senderId;
    static Map<Long, WebSocketSession> openSockets = new HashMap<>();

    // TODO: Do this properly
    static class SocketMessage {
        public String message;
        public Long chatroomId;
    }

    public void handleTransportError(WebSocketSession session, Throwable throwable) throws Exception {
        log.info("error occured at sender " + session)  ;
    }

    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info(String.format("Session %s closed because of %s", session.getId(), status.getReason()));
        openSockets.remove(senderId);
    }

    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("Connected ... " + session.getId());
        var previousSession = openSockets.get(senderId);
        if ( previousSession!= null) {
            previousSession.close();
        }
        openSockets.put(senderId, session);
    }

    protected void handleTextMessage(WebSocketSession session, TextMessage jsonTextMessage) throws Exception {
        log.info("message received: " + jsonTextMessage.getPayload());
        Gson gson = new Gson();
        SocketMessage message = gson.fromJson(jsonTextMessage.getPayload(), SocketMessage.class);
        // TODO: Add support for message read and message received notifications
        Chatroom chatroom = chatroomService.findById(message.chatroomId).get();
        messageService.updateMessageHistory(message.message, chatroom, senderId);
        for (User user : chatroom.getUsers()){
            WebSocketSession recipientSession = openSockets.get(user.getId());
            if (recipientSession != null) {
                // TODO Add custom type for notifications
                recipientSession.sendMessage(new TextMessage(message.message));
            }
        }
    }

    public NotificationHandler(final Long senderId, final ChatroomService chatroomService, final MessageService messageService) {
        this.senderId = senderId;
        this.chatroomService = chatroomService;
        this.messageService = messageService;
    }
}
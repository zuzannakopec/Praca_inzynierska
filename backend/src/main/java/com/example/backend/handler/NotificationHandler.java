package com.example.backend.handler;

import com.example.backend.model.Chatroom;
import com.example.backend.model.SocketMessage;
import com.example.backend.model.User;
import com.example.backend.service.ChatroomService;
import com.example.backend.service.MessageService;
import com.google.gson.Gson;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;


public class NotificationHandler extends TextWebSocketHandler {
    private static final Logger log = Logger.getLogger(ChatroomHandler.class.getName());
    private final MessageService messageService;
    private final ChatroomService chatroomService;
    private final Long senderId;
    static Map<Long, WebSocketSession> openSockets = new HashMap<>();


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
        Chatroom chatroom = chatroomService.findById(message.getChatroomId()).get();
        messageService.updateMessageHistory(message.getMessage(), message.getCodeType(), message.isCode(), chatroom, senderId);
        for (User user : chatroom.getUsers()){
            WebSocketSession recipientSession = openSockets.get(user.getId());
            if (recipientSession != null) {
                recipientSession.sendMessage(new TextMessage(message.getMessage()));
            }
        }
    }

    public NotificationHandler(final Long senderId, final ChatroomService chatroomService, final MessageService messageService) {
        this.senderId = senderId;
        this.chatroomService = chatroomService;
        this.messageService = messageService;
    }
}
package com.example.backend.handler;

import com.example.backend.model.Chatroom;
import com.example.backend.service.ChatroomService;
import com.example.backend.service.MessageService;
import com.google.gson.Gson;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class ChatroomHandler extends TextWebSocketHandler {
    private static final Logger log = Logger.getLogger(ChatroomHandler.class.getName());
    private final ChatroomService chatroomService;
    private final MessageService messageService;

    public void handleTransportError(WebSocketSession session, Throwable throwable) throws Exception {
        log.info("error occured at sender " + session);
    }

    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info(String.format("Session %s closed because of %s", session.getId(), status.getReason()));
    }

    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("Connected ... " + session.getId());
    }

    protected void handleTextMessage(WebSocketSession session, TextMessage jsonTextMessage) throws Exception {
        log.info("message received: " + jsonTextMessage.getPayload());
        Gson gson = new Gson();
        Map data = gson.fromJson(jsonTextMessage.getPayload(), Map.class);
        Long chatroomId = (long)(double)data.get("chatroomId");
        String userId = (String) data.get("sender");
        Optional<Chatroom> chatroom = this.chatroomService.findById(chatroomId);
        this.messageService.updateMessageHistory((String)data.get("message"), chatroom.get(), userId);
        session.sendMessage(new TextMessage("halo"));
    }

    public ChatroomHandler(final ChatroomService chatroomService, final MessageService messageService) {
        this.chatroomService = chatroomService;
        this.messageService = messageService;
    }
}

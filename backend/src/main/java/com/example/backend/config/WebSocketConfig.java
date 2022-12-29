
package com.example.backend.config;

import com.example.backend.handler.ChatroomHandler;
import com.example.backend.model.Chatroom;
import com.example.backend.repository.ChatroomRepository;
import com.example.backend.service.ChatroomService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import java.util.List;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    protected final ChatroomHandler chatroomHandler;

    @Autowired
    private ChatroomService chatroomService;

    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        List<Chatroom> chatrooms = chatroomService.findAll();
        for(Chatroom chatroom : chatrooms){
            String path = "/chat/" + chatroom.getId();
            registry.addHandler(this.chatroomHandler, path);
        }
    }

    public WebSocketConfig(final ChatroomHandler chatroomHandler) {
        this.chatroomHandler = chatroomHandler;
    }
}

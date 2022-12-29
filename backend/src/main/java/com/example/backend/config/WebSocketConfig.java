
package com.example.backend.config;

import com.example.backend.handler.ChatroomHandler;
import com.example.backend.handler.NotificationHandler;
import com.example.backend.model.Chatroom;
import com.example.backend.model.User;
import com.example.backend.repository.ChatroomRepository;
import com.example.backend.service.ChatroomService;
import com.example.backend.service.MessageService;
import com.example.backend.service.UserService;
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

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        List<Chatroom> chatrooms = chatroomService.findAll();
        for(Chatroom chatroom : chatrooms){
            String path = "/chat/" + chatroom.getId();
            registry.addHandler(this.chatroomHandler, path);
        }
        List<User> users = userService.getAll();
        for(User user : users){
            String path = "/notification/" + user.getId();
            registry.addHandler(new NotificationHandler(user.getId(), chatroomService, messageService), path);
        }
    }

    public WebSocketConfig(final ChatroomHandler chatroomHandler) {
        this.chatroomHandler = chatroomHandler;
    }
}

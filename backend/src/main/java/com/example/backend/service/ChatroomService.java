package com.example.backend.service;


import com.example.backend.model.Chatroom;
import com.example.backend.model.Message;
import com.example.backend.model.User;
import com.example.backend.repository.ChatroomRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatroomService {
    private final ChatroomRepository chatroomRepository;
    private final UserService userService;
    private final MessageService messageService;

    public List<Chatroom> findAll() {
        return this.chatroomRepository.findAll();
    }

    public Optional<Chatroom> findById(Long id) {
        return this.chatroomRepository.findById(id);
    }

    public Chatroom create(Chatroom chatroom) {
        List<User> users = new ArrayList();

        for (User user : chatroom.getUsers()) {
            users.add(this.userService.findByEmail(user.getEmail()));
        }

        chatroom.setUsers(users);
        return this.chatroomRepository.save(chatroom);
    }

    public List<Message> findMessageHistory(Long chatroomId) {
        return this.messageService.findMessageHistory(chatroomId);
    }

    public Optional<Chatroom> find(Chatroom chatroom){
        Chatroom foundChatroom = chatroomRepository.findByChatroomName(chatroom.getChatroomName());
        if(foundChatroom == null)
            return Optional.empty();
        return this.findById(foundChatroom.getId());
    }

}

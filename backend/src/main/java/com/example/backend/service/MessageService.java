package com.example.backend.service;


import com.example.backend.model.Chatroom;
import com.example.backend.model.Message;
import com.example.backend.repository.MessageRepository;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserService userService;

    public List<Message> findMessageHistory(Long chatroomId) {
        List<Message> messages = messageRepository.findAllByChatroomId(chatroomId);
        return messages;
    }

    public void updateMessageHistory(String text, Chatroom chatroom, Long userId) {
        Message message = new Message();
        message.setText(text);
        message.setChatroom(chatroom);
        message.setUser(userService.findById(userId).get());
        this.messageRepository.save(message);
    }

}

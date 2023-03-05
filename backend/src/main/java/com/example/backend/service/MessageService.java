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
        return messageRepository.findAllByChatroomId(chatroomId);
    }

    public void updateMessageHistory(String text, String codeType, boolean isCode, Chatroom chatroom, Long userId) {
        Message message = Message.builder()
                .text(text)
                .chatroom(chatroom)
                .isCode(isCode)
                .codeType(codeType)
                .build();
        message.setUser(userService.findById(userId).get());

        this.messageRepository.save(message);
    }

}

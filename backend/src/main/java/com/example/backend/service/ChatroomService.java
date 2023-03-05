package com.example.backend.service;


import com.example.backend.model.Accessibility;
import com.example.backend.model.Chatroom;
import com.example.backend.model.Message;
import com.example.backend.model.User;
import com.example.backend.repository.AccessibilityRepository;
import com.example.backend.repository.ChatroomRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatroomService {
    private final ChatroomRepository chatroomRepository;
    private final UserService userService;
    private final MessageService messageService;
    private final AccessibilityRepository accessibilityRepository;

    public List<Chatroom> findAll() {
        var all= chatroomRepository.findAll();
        return all;
    }

    public Optional<Chatroom> findById(Long id) {
        return chatroomRepository.findById(id);
    }

    public Chatroom create(Chatroom chatroom) {
        List<User> users = new ArrayList<>();
        for (User user : chatroom.getUsers()) {
            users.add(userService.findByEmail(user.getEmail()));
        }
        chatroom.setUsers(users);
        return chatroomRepository.save(chatroom);
    }

    public List<Message> findMessageHistory(Long chatroomId) {
        return this.messageService.findMessageHistory(chatroomId);
    }

    public Optional<Chatroom> find(Chatroom chatroom){
        List<User> foundUsers = findUsers(chatroom);
        List<Chatroom> foundChatrooms = chatroomRepository.findAllByUsersIn(foundUsers);
        if(foundChatrooms == null)
            return Optional.empty();
        for(Chatroom foundChatroom : foundChatrooms){
            if(foundChatroom.getUsers().equals(foundUsers)){
                return Optional.of(foundChatroom);
            }
        }
        return Optional.empty();
    }

    public ResponseEntity<String> saveAccessibility(List<Accessibility> accessibilityList){
        try {
            accessibilityRepository.saveAll(accessibilityList);
            return new ResponseEntity<>("Chatroom accessibility saved.", HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>("Unknown error has occured.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private List<User> findUsers(Chatroom chatroom){
        List<User> result = new ArrayList<>();
        for(User user : chatroom.getUsers()){
            User foundUser = userService.findByEmail(user.getEmail());
            result.add(foundUser);
        }
        return result;
    }

    public Accessibility getAccessibility(Long userId, Long chatroomId){
       return accessibilityRepository.findByUserIdAndChatroomId(userId, chatroomId);
    }

}

package com.example.backend.controller;

import com.example.backend.model.Accessibility;
import com.example.backend.model.Chatroom;
import com.example.backend.model.Message;
import com.example.backend.service.ChatroomService;
import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chatroom")
@RequiredArgsConstructor
public class ChatroomController {
    private final ChatroomService chatroomService;

    @PostMapping({"/createChatroom"})
    public ResponseEntity<Chatroom> createChatroom(@RequestBody Chatroom chatroom) {
        return new ResponseEntity<>(this.chatroomService.create(chatroom), HttpStatus.OK);
    }

    @GetMapping({"/openChatroom/{id}"})
    public ResponseEntity<Chatroom> getChatroom(@PathVariable Long id) {
        return new ResponseEntity<>((Chatroom)this.chatroomService.findById(id).get(), HttpStatus.OK);
    }

    @PostMapping({"/findChatroom"})
    public ResponseEntity<Chatroom> findChatroom(@RequestBody Chatroom chatroom) {
        Optional<Chatroom> optionalChatroom = chatroomService.find(chatroom);
        return optionalChatroom.isPresent() ? new ResponseEntity<>(optionalChatroom.get(), HttpStatus.OK) : new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @GetMapping({"/getChatrooms"})
    public ResponseEntity<List<Chatroom>> getChatrooms() {
        return new ResponseEntity<>(this.chatroomService.findAll(), HttpStatus.OK);
    }

    @GetMapping({"/getMessageHistory/{chatroomId}"})
    public ResponseEntity<List<Message>> getMessageHistory(@PathVariable Long chatroomId) {
        List<Message> messages = chatroomService.findMessageHistory(chatroomId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @GetMapping("/getLastMessage/{chatroomId}")
    public ResponseEntity<Message> getLastMessage(@PathVariable Long chatroomId) {
        List<Message> messages = chatroomService.findMessageHistory(chatroomId);
        return messages.size() > 0 ? new ResponseEntity<>(messages.get(messages.size()-1), HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    @PostMapping({"/accessibility"})
    public ResponseEntity<String> saveAccessibility(@RequestBody List<Accessibility> accessibilityList) {
       return chatroomService.saveAccessibility(accessibilityList);
    }


    @GetMapping({"/accessibility/{userId}/{chatroomId}"})
    public ResponseEntity<Accessibility> getAccessibility(@PathVariable Long userId, @PathVariable Long chatroomId) {
        return new ResponseEntity<>(chatroomService.getAccessibility(userId, chatroomId), HttpStatus.OK);
    }
}

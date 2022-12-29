package com.example.backend.repository;

import com.example.backend.model.Chatroom;
import com.example.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatroomRepository extends JpaRepository<Chatroom, Long> {
    List<Message> findAllById(Long id);
    Chatroom findByChatroomName(String chatroomName);
}

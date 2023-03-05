package com.example.backend.repository;

import com.example.backend.model.Accessibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccessibilityRepository extends JpaRepository<Accessibility, String> {
    Accessibility findByUserIdAndChatroomId(Long userId, Long chatroomId);
}

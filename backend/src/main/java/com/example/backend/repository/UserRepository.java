package com.example.backend.repository;


import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    
    boolean existsByEmail(String email);

    List<User> findByNameContaining(String name);
    List<User> findBySurnameContaining(String surname);
    List<User> findByEmailContaining(String surname);
}

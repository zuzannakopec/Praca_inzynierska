package com.example.backend.repository;


import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    String findHashValueByEmail(String email);

    boolean existsByEmail(String email);
}

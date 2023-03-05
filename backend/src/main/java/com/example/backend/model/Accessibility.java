package com.example.backend.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrimaryKeyJoinColumn;

@Data
@Entity
public class Accessibility {
    @PrimaryKeyJoinColumn
    Long chatroomId;
    @PrimaryKeyJoinColumn
    Long userId;
    @Id
    String encryptedKey;
}

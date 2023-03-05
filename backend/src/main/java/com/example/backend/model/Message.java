package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@Table(name = "Message")
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class Message {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    Long id;
    String text;
    boolean isCode;
    String codeType;
    @OneToOne(
            cascade = {CascadeType.MERGE}
    )
    Chatroom chatroom;
    @OneToOne(
            cascade = {CascadeType.MERGE}
    )
    User user;
    String iv;

}

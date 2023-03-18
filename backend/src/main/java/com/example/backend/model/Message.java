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
    @Column(length = 65535,columnDefinition="Text")
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
}
